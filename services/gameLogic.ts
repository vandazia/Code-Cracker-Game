
import { ALL_COLORS } from '../constants';
import type { Difficulty, Feedback } from '../types';

export const generateSecretCode = (length: number, numColors: number): string[] => {
  const availableColors = ALL_COLORS.slice(0, numColors).map(c => c.name);
  const shuffled = availableColors.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, length);
};

export const checkGuess = (guess: string[], secretCode: string[], difficulty: Difficulty): Feedback => {
  const isWin = guess.every((color, i) => color === secretCode[i]);

  if (difficulty === 'hard') {
    let correctPosition = 0;
    let correctColor = 0;
    const secretCodeCopy = [...secretCode];
    const guessCopy = [...guess];

    // First pass: check for correct color in correct position
    for (let i = guessCopy.length - 1; i >= 0; i--) {
      if (guessCopy[i] === secretCodeCopy[i]) {
        correctPosition++;
        guessCopy.splice(i, 1);
        secretCodeCopy.splice(i, 1);
      }
    }

    // Second pass: check for correct color in wrong position
    for (let i = 0; i < guessCopy.length; i++) {
      const colorIndex = secretCodeCopy.indexOf(guessCopy[i]);
      if (colorIndex > -1) {
        correctColor++;
        secretCodeCopy.splice(colorIndex, 1);
      }
    }
    return { hard: { correctPosition, correctColor }, isWin };
  } else { // simple difficulty
    const feedback: ('correct' | 'present' | 'absent')[] = Array(secretCode.length).fill('absent');
    const secretCodeCopy = [...secretCode];
    const accountedFor = Array(secretCode.length).fill(false);

    // First pass for 'correct'
    guess.forEach((color, i) => {
      if (color === secretCode[i]) {
        feedback[i] = 'correct';
        secretCodeCopy[i] = ''; // Mark as used
        accountedFor[i] = true;
      }
    });
    
    // Second pass for 'present'
    guess.forEach((color, i) => {
        if (!accountedFor[i]) {
            const secretIndex = secretCodeCopy.indexOf(color);
            if (secretIndex !== -1) {
                feedback[i] = 'present';
                secretCodeCopy[secretIndex] = ''; // Mark as used
            }
        }
    });
    return { simple: feedback, isWin };
  }
};
