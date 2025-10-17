
import React from 'react';
import type { GameStatus } from '../types';
import * as audio from '../services/audioService';

interface ControlsProps {
  onSubmit: () => void;
  onNewGame: () => void;
  gameStatus: GameStatus;
}

const ControlButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
    <button 
      className={`px-4 py-2 rounded-lg font-bold text-white transition-all duration-200 shadow-lg border-2 border-black/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
        {children}
    </button>
);

const Controls: React.FC<ControlsProps> = ({ onSubmit, onNewGame, gameStatus }) => {
  return (
    <div className="flex justify-between items-center shrink-0">
      <ControlButton 
        onClick={() => {
          audio.playClickSound();
          onNewGame();
        }}
        className="bg-yellow-600 hover:bg-yellow-500 focus:ring-yellow-400"
      >
        New Game
      </ControlButton>
      <ControlButton
        onClick={onSubmit}
        disabled={gameStatus !== 'playing'}
        className="bg-green-600 hover:bg-green-500 focus:ring-green-400 text-lg"
      >
        Enter
      </ControlButton>
    </div>
  );
};

export default Controls;
