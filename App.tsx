
import React, { useState, useEffect, useCallback } from 'react';
import type { GameSettings, Guess, GameStatus, Feedback, GameMode } from './types';
import { ALL_COLORS } from './constants';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import SettingsModal from './components/SettingsModal';
import GameStatusDisplay from './components/GameStatusDisplay';
import { generateSecretCode, checkGuess } from './services/gameLogic';
import CurrentGuessRow from './components/CurrentGuessRow';
import WinOverlay from './components/WinOverlay';
import * as audio from './services/audioService';
import MainMenu from './components/MainMenu';
import TopBar from './components/TopBar';
import { CAMPAIGN_LEVELS } from './levels';

const initialSettings: GameSettings = {
  codeLength: 4,
  numColors: 7,
  maxAttempts: 10,
  difficulty: 'simple',
  codeType: 'color',
  timeLimit: 0,
};

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  
  // Persistent settings for Free Play mode, loaded from localStorage
  const [freePlaySettings, setFreePlaySettings] = useState<GameSettings>(() => {
    try {
      const savedSettings = localStorage.getItem('gameSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.codeLength && parsed.numColors && parsed.maxAttempts) {
          // Merge with initial settings to ensure all keys, like timeLimit, exist
          return { ...initialSettings, ...parsed };
        }
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    }
    return initialSettings;
  });
  
  // Settings for the currently active game, which could be from a campaign level or free play
  const [activeGameSettings, setActiveGameSettings] = useState<GameSettings>(freePlaySettings);

  const [secretCode, setSecretCode] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [latestFeedback, setLatestFeedback] = useState<Feedback | null>(null);
  const [transientMessage, setTransientMessage] = useState<{text: string, type: 'error' | 'info'} | null>(null);
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const [highlightedGuessIndex, setHighlightedGuessIndex] = useState<number | null>(null);
  const [isErrorState, setIsErrorState] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isLoseAnimationActive, setIsLoseAnimationActive] = useState(false);
  
  // Campaign specific state
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    const savedLevel = localStorage.getItem('unlockedLevel');
    return savedLevel ? parseInt(savedLevel, 10) : 1;
  });
  const [currentLevel, setCurrentLevel] = useState<number>(0);

  // Timer logic
  useEffect(() => {
    if (gameStatus !== 'playing' || timeLeft === null) {
        return;
    }

    if (timeLeft <= 0) {
        setGameStatus('lost');
        audio.playLoseSound();
        setIsLoseAnimationActive(true);
        setTimeout(() => setIsLoseAnimationActive(false), 500);
        return;
    }

    const timerId = setInterval(() => {
        setTimeLeft(t => (t !== null ? t - 1 : null));
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameStatus, timeLeft]);

  const startNewGame = useCallback((newSettings: GameSettings) => {
    const newSecretCode = generateSecretCode(newSettings.codeLength, newSettings.numColors);
    setSecretCode(newSecretCode);
    setGuesses([]);
    setCurrentGuess(Array(newSettings.codeLength).fill(null));
    setGameStatus('playing');
    if (newSettings.timeLimit > 0) {
      setTimeLeft(newSettings.timeLimit);
    } else {
      setTimeLeft(null);
    }
    setLatestFeedback(null);
    setTransientMessage(null);
    setShowWinOverlay(false);
    setHighlightedGuessIndex(null);
    setActiveGameSettings(newSettings);

    // --- Automatic First Guess ---
    const initialGuessCode = generateSecretCode(newSettings.codeLength, newSettings.numColors);
    
    const feedback = checkGuess(initialGuessCode, newSecretCode, newSettings.difficulty);
    const firstGuess: Guess = { code: initialGuessCode, feedback };
    
    setGuesses([firstGuess]);
    setCurrentGuess(initialGuessCode);
    setLatestFeedback(feedback);
    
    if (feedback.isWin) {
      setGameStatus('won');
      setShowWinOverlay(true);
      audio.playWinSound();
      if (gameMode === 'campaign') {
        const nextLevel = currentLevel + 2;
        if (nextLevel > unlockedLevel && nextLevel <= CAMPAIGN_LEVELS.length) {
          setUnlockedLevel(nextLevel);
          localStorage.setItem('unlockedLevel', nextLevel.toString());
        }
      }
    } else if (1 >= newSettings.maxAttempts) {
      setGameStatus('lost');
      audio.playLoseSound();
      setIsLoseAnimationActive(true);
      setTimeout(() => setIsLoseAnimationActive(false), 500);
    } else {
      audio.playSubmitSound();
    }
  }, [gameMode, currentLevel, unlockedLevel]);
  
  const startLevel = useCallback((levelIndex: number) => {
    if (levelIndex >= CAMPAIGN_LEVELS.length) return;
    
    setCurrentLevel(levelIndex);
    const levelSettings = CAMPAIGN_LEVELS[levelIndex];
    // Use level settings but preserve the player's preferred code type
    const newSettings = { ...levelSettings, codeType: freePlaySettings.codeType };
    startNewGame(newSettings);
  }, [freePlaySettings.codeType, startNewGame]);

  useEffect(() => {
    if (transientMessage) {
      const timer = setTimeout(() => setTransientMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [transientMessage]);
  
  const handleSelectMode = (mode: 'campaign' | 'freePlay') => {
    audio.playClickSound();
    setGameMode(mode);
    if (mode === 'campaign') {
      const levelToStart = unlockedLevel - 1;
      startLevel(levelToStart);
    } else {
      // For freeplay, start with the saved free play settings
      startNewGame(freePlaySettings);
    }
  };
  
  const handleBackToMenu = () => {
      audio.playClickSound();
      setGameMode('menu');
  };

  const handleColorChange = (index: number, direction: 'up' | 'down' = 'up') => {
    if (gameStatus !== 'playing') return;
    audio.playClickSound();
    if (transientMessage) setTransientMessage(null);

    const availableColors = ALL_COLORS.slice(0, activeGameSettings.numColors);
    const newGuess = [...currentGuess];
    const currentColor = newGuess[index];
    const currentColorIndex = availableColors.findIndex(c => c.name === currentColor);
    
    let nextColorIndex;
    if (currentColorIndex === -1) {
      nextColorIndex = direction === 'up' ? 0 : availableColors.length - 1;
    } else {
      nextColorIndex = direction === 'up' ? (currentColorIndex + 1) % availableColors.length : (currentColorIndex - 1 + availableColors.length) % availableColors.length;
    }
    
    newGuess[index] = availableColors[nextColorIndex].name;
    setCurrentGuess(newGuess);
    setLatestFeedback(null);
  };

  const handleSubmitGuess = () => {
    if (gameStatus !== 'playing') return;
     if (transientMessage) setTransientMessage(null);

    const triggerErrorFeedback = (message: string) => {
        setTransientMessage({ text: message, type: 'error' });
        audio.playErrorSound();
        setIsErrorState(true);
        setTimeout(() => setIsErrorState(false), 500);
    };

    if (currentGuess.some(color => color === null)) {
      triggerErrorFeedback("Please fill all slots.");
      return;
    }
    
    const uniqueColors = new Set(currentGuess);
    if (uniqueColors.size !== activeGameSettings.codeLength) {
        triggerErrorFeedback("Colors must not be repeated.");
        return;
    }

    const currentGuessStr = currentGuess.join(',');
    const duplicateIndex = guesses.findIndex(g => g.code.join(',') === currentGuessStr);
    if (duplicateIndex !== -1) {
      triggerErrorFeedback("Combination already tried.");
      setHighlightedGuessIndex(duplicateIndex);
      setTimeout(() => setHighlightedGuessIndex(null), 1000);
      return;
    }

    const feedback = checkGuess(currentGuess as string[], secretCode, activeGameSettings.difficulty);
    const newGuesses = [...guesses, { code: currentGuess as string[], feedback }];
    setGuesses(newGuesses);
    setLatestFeedback(feedback);

    if (feedback.isWin) {
      setGameStatus('won');
      setShowWinOverlay(true);
      audio.playWinSound();
      if (gameMode === 'campaign') {
        const nextLevel = currentLevel + 2;
        if (nextLevel > unlockedLevel && nextLevel <= CAMPAIGN_LEVELS.length) {
          setUnlockedLevel(nextLevel);
          localStorage.setItem('unlockedLevel', nextLevel.toString());
        }
      }
    } else if (newGuesses.length >= activeGameSettings.maxAttempts) {
      setGameStatus('lost');
      audio.playLoseSound();
      setIsLoseAnimationActive(true);
      setTimeout(() => setIsLoseAnimationActive(false), 500);
    } else {
      audio.playSubmitSound();
    }
  };

  const handleSettingsSave = (modalSettings: GameSettings) => {
    audio.playClickSound();
    setIsSettingsOpen(false);

    if (gameMode === 'freePlay') {
      // In free play, the settings from the modal are the new source of truth
      setFreePlaySettings(modalSettings);
      try {
        localStorage.setItem('gameSettings', JSON.stringify(modalSettings));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
      startNewGame(modalSettings);
    } else { // Campaign mode
      // In campaign, only the codeType preference is saved persistently.
      const updatedFreePlaySettings = { ...freePlaySettings, codeType: modalSettings.codeType };
      setFreePlaySettings(updatedFreePlaySettings);
      try {
        localStorage.setItem('gameSettings', JSON.stringify(updatedFreePlaySettings));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
      
      // Then, restart the currently selected level with this new codeType.
      const levelBaseSettings = CAMPAIGN_LEVELS[currentLevel];
      const newGameSettings = { 
          ...levelBaseSettings,
          codeType: modalSettings.codeType
      };
      startNewGame(newGameSettings);
    }
  };
  
  const handleSelectLevel = (levelIndex: number) => {
    // Just updates the state for which level is selected in the modal.
    // The game itself only restarts when "Apply & Restart" is clicked.
    setCurrentLevel(levelIndex);
  };

  const handleOpenSettings = () => {
    audio.playClickSound();
    setIsSettingsOpen(true);
  }

  const handleWinOverlayClose = () => {
    audio.playClickSound();
    setShowWinOverlay(false);

    if (gameMode === 'campaign' && gameStatus === 'won') {
      const nextLevelIndex = currentLevel + 1;
      
      if (nextLevelIndex < CAMPAIGN_LEVELS.length) {
        startLevel(nextLevelIndex);
      } else {
        // Campaign finished
        setTransientMessage({ text: "Campaign Complete! Well done!", type: 'info' });
        setTimeout(() => {
          handleBackToMenu();
        }, 3000);
      }
    }
  };
  
  if (gameMode === 'menu') {
    return <MainMenu onSelectMode={handleSelectMode} unlockedLevel={unlockedLevel} />;
  }

  return (
    <div id="app-container" className="h-screen w-full flex flex-col items-center justify-center text-white">
      {showWinOverlay && <WinOverlay onClose={handleWinOverlayClose} />}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl flex flex-col h-full">
        <header className="text-center mb-2 sm:mb-4 shrink-0">
          <h1 className="text-4xl md:text-5xl text-green-300" style={{textShadow: '0 0 10px #6ee7b7'}}>
            Code Cracker
          </h1>
        </header>

        <main 
          className={`bg-[#212121] p-4 rounded-2xl border-4 flex flex-col flex-grow min-h-0 gap-2 sm:gap-4 
            ${isLoseAnimationActive ? 'animate-lose' : ''}
            ${gameStatus === 'lost' ? 'game-lost' : 'border-[#1a1a1a]'}`
          } 
          style={
            gameStatus === 'lost' 
              ? {} 
              : { boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5), 0 25px 50px -12px rgba(0, 0, 0, 0.25)' }
          }
        >
          <TopBar onBackToMenu={handleBackToMenu} onOpenSettings={handleOpenSettings} />
          <GameStatusDisplay 
            status={gameStatus}
            attemptsLeft={activeGameSettings.maxAttempts - guesses.length}
            secretCode={secretCode}
            transientMessage={transientMessage}
            levelName={gameMode === 'campaign' ? CAMPAIGN_LEVELS[currentLevel].name : undefined}
            codeType={activeGameSettings.codeType}
            timeLeft={timeLeft}
          />
          <GameBoard
            guesses={guesses}
            codeLength={activeGameSettings.codeLength}
            difficulty={activeGameSettings.difficulty}
            highlightedGuessIndex={highlightedGuessIndex}
            codeType={activeGameSettings.codeType}
          />
          <div 
            className={`w-full p-3 bg-black/40 border-2 rounded-lg shadow-inner shrink-0 ${isErrorState ? 'animate-border-flash-error' : 'border-green-700/50'}`}
            aria-label="Operating Area"
          >
             <CurrentGuessRow
                guess={currentGuess}
                onColorChange={handleColorChange}
                codeLength={activeGameSettings.codeLength}
                feedback={latestFeedback}
                difficulty={activeGameSettings.difficulty}
                isInteractive={gameStatus === 'playing'}
                codeType={activeGameSettings.codeType}
             />
          </div>
          <Controls
            onSubmit={handleSubmitGuess}
            onNewGame={() => startNewGame(activeGameSettings)}
            gameStatus={gameStatus}
          />
        </main>
      </div>

      {isSettingsOpen && (
        <SettingsModal
          currentSettings={activeGameSettings}
          onSave={handleSettingsSave}
          onClose={() => setIsSettingsOpen(false)}
          mode={gameMode}
          unlockedLevel={unlockedLevel}
          currentLevel={currentLevel}
          onSelectLevel={handleSelectLevel}
        />
      )}
    </div>
  );
};

export default App;