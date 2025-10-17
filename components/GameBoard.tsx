import React, { useRef, useEffect } from 'react';
import type { Guess, Difficulty, CodeType } from '../types';
import GuessRow from './GuessRow';

interface GameBoardProps {
  guesses: Guess[];
  codeLength: number;
  difficulty: Difficulty;
  highlightedGuessIndex?: number | null;
  codeType: CodeType;
}

const GameBoard: React.FC<GameBoardProps> = ({
  guesses,
  codeLength,
  difficulty,
  highlightedGuessIndex,
  codeType,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Effect to scroll to the bottom for new guesses
  useEffect(() => {
    // Only scroll to bottom when a new guess is added and no highlight is active.
    // This prevents it from overriding the highlight scroll.
    if (highlightedGuessIndex === null) {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [guesses]); // Reruns only when the guesses array itself changes.

  // Effect to scroll to the highlighted (duplicate) row
  useEffect(() => {
    if (highlightedGuessIndex !== null && rowRefs.current[highlightedGuessIndex]) {
      rowRefs.current[highlightedGuessIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedGuessIndex]); // Reruns only when the highlight index changes.

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col items-center justify-start gap-3 p-2 bg-black/30 rounded-lg shadow-inner overflow-y-auto flex-grow min-h-0"
      aria-label="Guess History"
    >
      {guesses.map((guess, index) => (
        <GuessRow
          key={`guess-${index}`}
          // FIX: The ref callback was implicitly returning a value, which is not allowed for ref callbacks. Changed to a block body to ensure a void return type.
          ref={(el) => { rowRefs.current[index] = el; }}
          guess={guess}
          difficulty={difficulty}
          codeLength={codeLength}
          isHighlighted={index === highlightedGuessIndex}
          codeType={codeType}
        />
      ))}
    </div>
  );
};

export default GameBoard;