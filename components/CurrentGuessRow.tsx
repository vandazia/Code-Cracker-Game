import React from 'react';
import ColorPeg from './ColorPeg';
import FeedbackDisplay from './FeedbackDisplay';
import type { Difficulty, Feedback, CodeType } from '../types';

interface CurrentGuessRowProps {
  guess: (string | null)[];
  onColorChange: (index: number, direction: 'up' | 'down') => void;
  codeLength: number;
  feedback: Feedback | null;
  difficulty: Difficulty;
  isInteractive: boolean;
  codeType: CodeType;
}

const CurrentGuessRow: React.FC<CurrentGuessRowProps> = ({ guess, onColorChange, codeLength, feedback, difficulty, isInteractive, codeType }) => {
  return (
    <div className="w-full flex items-center justify-between gap-2">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {guess.map((color, index) => {
          const feedbackStatus = feedback?.simple;
          const isCorrect = difficulty === 'simple' && feedbackStatus?.[index] === 'correct';
          const isPresent = difficulty === 'simple' && feedbackStatus?.[index] === 'present';

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <ColorPeg
                colorName={color}
                onClick={() => onColorChange(index, 'up')}
                onWheelChange={(direction) => onColorChange(index, direction)}
                isInteractive={isInteractive}
                codeType={codeType}
              />
              <div
                className="h-1.5 w-8 sm:w-10 rounded-full transition-colors"
                style={{
                  backgroundColor:
                    isCorrect ? '#22c55e' // green-500
                    : isPresent ? '#ffffff' // white
                    : feedback ? '#1f2937' // gray-800 for absent or hard mode
                    : 'transparent',
                  boxShadow:
                    isCorrect ? '0 0 6px #22c55e'
                    : isPresent ? '0 0 6px #ffffff'
                    : 'none'
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="bg-black/20 p-2 rounded-lg">
        <FeedbackDisplay 
          feedback={difficulty === 'hard' ? feedback : undefined} 
          difficulty={difficulty} 
          codeLength={codeLength} 
        />
      </div>
    </div>
  );
};

export default CurrentGuessRow;