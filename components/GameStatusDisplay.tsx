import React from 'react';
import type { GameStatus, CodeType } from '../types';
import { ALL_COLORS } from '../constants';

interface GameStatusDisplayProps {
  status: GameStatus;
  attemptsLeft: number;
  secretCode: string[];
  transientMessage: { text: string, type: 'error' | 'info' } | null;
  levelName?: string; // Optional level name for campaign mode
  codeType: CodeType;
  timeLeft: number | null;
}

const GameStatusDisplay: React.FC<GameStatusDisplayProps> = ({ status, attemptsLeft, secretCode, transientMessage, levelName, codeType, timeLeft }) => {
  let message: string;
  let messageColor: string;
  let animationClass = '';

  if (transientMessage) {
    message = transientMessage.text;
    messageColor = transientMessage.type === 'error' ? "text-yellow-400" : "text-cyan-400";
  } else {
    switch (status) {
      case 'won':
        message = "ACCESS GRANTED";
        messageColor = "text-green-400";
        break;
      case 'lost':
        message = "ACCESS DENIED";
        messageColor = "text-red-400";
        break;
      case 'playing':
      default:
        message = `Attempts Left: ${attemptsLeft}`;
        if (attemptsLeft <= 3) {
          messageColor = "text-red-500";
          // The key={attemptsLeft} prop on the <p> tag ensures the animation re-triggers on each decrease.
          animationClass = 'animate-shake';
        } else {
          messageColor = "text-gray-300";
        }
        break;
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const showTimer = status === 'playing' && timeLeft !== null;
  const justifyContentClass = showTimer && !transientMessage ? 'justify-between' : 'justify-center';


  return (
    <div className="text-center p-3 bg-black/40 rounded-lg flex flex-col justify-center shrink-0">
      {levelName && <p className="text-sm text-cyan-400 mb-1">{levelName}</p>}
       <div className={`flex ${justifyContentClass} items-center min-h-[28px]`}>
        {transientMessage ? (
          <p className={`text-xl ${messageColor} w-full text-center`}>{message}</p>
        ) : (
          <>
            <p key={attemptsLeft} className={`text-xl ${messageColor} ${animationClass}`}>{message}</p>
            {showTimer && (
              <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-300'}`}>
                <span className="tabular-nums">{formatTime(timeLeft)}</span>
              </div>
            )}
          </>
        )}
      </div>
      {status === 'lost' && !transientMessage && (
        <div className="mt-2">
            <p className="text-sm text-gray-400 mb-1">The correct code was:</p>
            <div className="flex justify-center items-center gap-2">
                {secretCode.map((color, index) => {
                    const colorData = ALL_COLORS.find(c => c.name === color);
                    const character = codeType === 'letter' ? colorData?.letter : codeType === 'number' ? colorData?.number : null;
                    const textStyle = {
                      color: colorData?.hex,
                      textShadow: `0 0 8px ${colorData?.hex}, 0 0 12px ${colorData?.hex}`
                    };

                    return (
                        <div
                            key={index}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-md border border-black/30 flex items-center justify-center relative"
                            style={{
                                backgroundColor: colorData?.hex,
                                boxShadow: colorData ? `0 0 8px ${colorData.hex}` : 'none',
                            }}
                        >
                          {character && (
                            <>
                                <div className="absolute inset-0 bg-black/40 rounded-md"></div>
                                <span className="relative text-lg sm:text-xl font-bold" style={textStyle}>{character}</span>
                            </>
                          )}
                        </div>
                    );
                })}
            </div>
        </div>
      )}
    </div>
  );
};

export default GameStatusDisplay;