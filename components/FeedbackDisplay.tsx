
import React from 'react';
import type { Feedback, Difficulty } from '../types';

interface FeedbackDisplayProps {
  feedback?: Feedback;
  difficulty?: Difficulty;
  codeLength: number;
}

const FeedbackPeg: React.FC<{ color: string }> = ({ color }) => {
  const baseStyle = 'w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-black/30';
  let colorStyle = 'bg-gray-800 shadow-inner';
  let glowStyle = {};

  if (color === 'green') {
    colorStyle = 'bg-green-500 shadow-green-400';
    glowStyle = { boxShadow: `0 0 8px var(--tw-shadow-color)`};
  } else if (color === 'white') {
    colorStyle = 'bg-gray-200 shadow-gray-100';
    glowStyle = { boxShadow: `0 0 8px var(--tw-shadow-color)`};
  }

  return <div className={`${baseStyle} ${colorStyle}`} style={glowStyle} />;
};

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, difficulty, codeLength }) => {
  const getPegs = () => {
    if (!feedback || !difficulty) {
      return Array(codeLength).fill('empty');
    }

    if (difficulty === 'hard' && feedback.hard) {
      const pegs: string[] = [];
      for (let i = 0; i < feedback.hard.correctPosition; i++) pegs.push('green');
      for (let i = 0; i < feedback.hard.correctColor; i++) pegs.push('white');
      while (pegs.length < codeLength) pegs.push('empty');
      return pegs;
    }

    if (difficulty === 'simple' && feedback.simple) {
      const simpleToColor = {
        'correct': 'green',
        'present': 'white',
        'absent': 'empty'
      };
      return feedback.simple.map(s => simpleToColor[s]);
    }

    return Array(codeLength).fill('empty');
  };

  const pegs = getPegs();

  return (
    <div className={`grid gap-1.5 sm:gap-2 ${codeLength > 4 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {pegs.map((pegColor, index) => (
        <FeedbackPeg key={index} color={pegColor} />
      ))}
    </div>
  );
};

export default FeedbackDisplay;
