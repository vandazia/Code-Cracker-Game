import type { LevelConfig } from './types';

export const CAMPAIGN_LEVELS: LevelConfig[] = [
    // Simple Difficulty Levels
    { name: 'Level 1: Boot Sequence', codeLength: 4, numColors: 4, maxAttempts: 7, difficulty: 'simple', timeLimit: 0 },
    { name: 'Level 2: Basic I/O', codeLength: 4, numColors: 4, maxAttempts: 10, difficulty: 'simple', timeLimit: 0 },
    { name: 'Level 3: Color Palette', codeLength: 4, numColors: 5, maxAttempts: 10, difficulty: 'simple', timeLimit: 0 },
    { name: 'Level 4: Memory Test', codeLength: 4, numColors: 5, maxAttempts: 8, difficulty: 'simple', timeLimit: 0 },
    { name: 'Level 5: Logic Gates', codeLength: 4, numColors: 6, maxAttempts: 8, difficulty: 'simple', timeLimit: 0 },
    { name: 'Level 6: Data Bus', codeLength: 4, numColors: 7, maxAttempts: 8, difficulty: 'simple', timeLimit: 0 },
    { name: 'Level 7: First Expansion', codeLength: 5, numColors: 5, maxAttempts: 10, difficulty: 'simple', timeLimit: 0 },
    { name: 'Level 8: Wider Spectrum', codeLength: 5, numColors: 6, maxAttempts: 10, difficulty: 'simple', timeLimit: 0 },
    { name: 'Level 9: CPU Overclock', codeLength: 5, numColors: 7, maxAttempts: 9, difficulty: 'simple', timeLimit: 0 },
    { name: 'Level 10: Simple Encryption', codeLength: 5, numColors: 7, maxAttempts: 8, difficulty: 'simple', timeLimit: 0 },

    // Hard Difficulty Levels
    { name: 'Level 11: Hard Mode Init', codeLength: 4, numColors: 5, maxAttempts: 12, difficulty: 'hard', timeLimit: 0 },
    { name: 'Level 12: Firewalls Up', codeLength: 4, numColors: 6, maxAttempts: 12, difficulty: 'hard', timeLimit: 0 },
    { name: 'Level 13: Sub-routine', codeLength: 4, numColors: 7, maxAttempts: 10, difficulty: 'hard', timeLimit: 0 },
    { name: 'Level 14: Time Pressure', codeLength: 4, numColors: 7, maxAttempts: 10, difficulty: 'hard', timeLimit: 480 },
    { name: 'Level 15: Brute Force', codeLength: 4, numColors: 8, maxAttempts: 10, difficulty: 'hard', timeLimit: 420 },
    { name: 'Level 16: Complex Key', codeLength: 4, numColors: 8, maxAttempts: 9, difficulty: 'hard', timeLimit: 360 },
    { name: 'Level 17: Black Ice', codeLength: 5, numColors: 6, maxAttempts: 12, difficulty: 'hard', timeLimit: 0 },
    { name: 'Level 18: Quantum Lock', codeLength: 5, numColors: 6, maxAttempts: 12, difficulty: 'hard', timeLimit: 600 },
    { name: 'Level 19: Heuristic Analysis', codeLength: 5, numColors: 7, maxAttempts: 12, difficulty: 'hard', timeLimit: 540 },
    { name: 'Level 20: System Intrusion', codeLength: 5, numColors: 7, maxAttempts: 11, difficulty: 'hard', timeLimit: 480 },
    { name: 'Level 21: Decryption Race', codeLength: 5, numColors: 8, maxAttempts: 12, difficulty: 'hard', timeLimit: 480 },
    { name: 'Level 22: Root Access', codeLength: 5, numColors: 8, maxAttempts: 11, difficulty: 'hard', timeLimit: 450 },
    { name: 'Level 23: Honeypot', codeLength: 5, numColors: 8, maxAttempts: 10, difficulty: 'hard', timeLimit: 420 },
    { name: 'Level 24: Shifting Ciphers', codeLength: 5, numColors: 9, maxAttempts: 12, difficulty: 'hard', timeLimit: 420 },
    { name: 'Level 25: The Core', codeLength: 5, numColors: 9, maxAttempts: 11, difficulty: 'hard', timeLimit: 390 },
    { name: 'Level 26: Master Password', codeLength: 5, numColors: 9, maxAttempts: 10, difficulty: 'hard', timeLimit: 360 },
    { name: 'Level 27: Singularity', codeLength: 5, numColors: 10, maxAttempts: 12, difficulty: 'hard', timeLimit: 360 },
    { name: 'Level 28: Zero Day', codeLength: 5, numColors: 10, maxAttempts: 11, difficulty: 'hard', timeLimit: 330 },
    { name: 'Level 29: Final Countdown', codeLength: 5, numColors: 10, maxAttempts: 10, difficulty: 'hard', timeLimit: 300 },
    { name: 'Level 30: The Mainframe', codeLength: 5, numColors: 10, maxAttempts: 10, difficulty: 'hard', timeLimit: 300 },
];
