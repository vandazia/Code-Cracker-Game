import React, { forwardRef } from 'react';
import type { Guess, Difficulty, CodeType } from '../types';
import ColorPeg from './ColorPeg';
import FeedbackDisplay from './FeedbackDisplay';

interface GuessRowProps {
  guess?: Guess;
  difficulty: Difficulty;
  codeLength: number;
  isHighlighted?: boolean;
  codeType: CodeType;
}

const GuessRow = forwardRef<HTMLDivElement, GuessRowProps>(
  ({ guess, difficulty, codeLength, isHighlighted, codeType }, ref) => {
    const pegs = guess ? guess.code : Array(codeLength).fill(null);
    const feedbackStatus = guess?.feedback?.simple;

    return (
      <div
        ref={ref}
        className={`w-full h-14 flex items-center justify-between gap-2 shrink-0 rounded-lg ${
          isHighlighted ? 'animate-flash' : ''
        }`}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {pegs.map((color, index) => {
            const isCorrect = difficulty === 'simple' && feedbackStatus?.[index] === 'correct';
            const isPresent = difficulty === 'simple' && feedbackStatus?.[index] === 'present';
            
            return (
              <div key={index} className="flex flex-col items-center gap-1">
                <ColorPeg colorName={color} codeType={codeType} />
                <div
                  className="h-1.5 w-8 sm:w-10 rounded-full"
                  style={{
                    backgroundColor:
                      isCorrect
                        ? '#22c55e' // green-500
                        : isPresent
                        ? '#ffffff' // white
                        : guess
                        ? '#1f2937' // gray-800 for absent or hard mode
                        : 'transparent', // for empty rows
                    boxShadow: 
                      isCorrect
                        ? '0 0 6px #22c55e'
                        : isPresent
                        ? '0 0 6px #ffffff'
                        : 'none'
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="bg-black/20 p-2 rounded-lg">
          <FeedbackDisplay
            feedback={difficulty === 'hard' ? guess?.feedback : undefined}
            difficulty={difficulty}
            codeLength={codeLength}
          />
        </div>
      </div>
    );
  }
);

export default GuessRow;