
export type Difficulty = 'simple' | 'hard';
export type CodeType = 'color' | 'letter' | 'number';
export type GameMode = 'menu' | 'campaign' | 'freePlay';

export interface GameSettings {
  codeLength: number;
  numColors: number;
  maxAttempts: number;
  difficulty: Difficulty;
  codeType: CodeType;
  timeLimit: number; // in seconds, 0 for no limit
}

export interface HardFeedback {
  correctPosition: number;
  correctColor: number;
}

export type SimpleFeedback = ('correct' | 'present' | 'absent')[];

export interface Feedback {
    hard?: HardFeedback;
    simple?: SimpleFeedback;
    isWin: boolean;
}

export interface Guess {
  code: string[];
  feedback: Feedback;
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface LevelConfig {
    name: string;
    codeLength: number;
    numColors: number;
    maxAttempts: number;
    difficulty: Difficulty;
    timeLimit: number; // in seconds, 0 for no limit
}
