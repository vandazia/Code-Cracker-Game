// A simple audio service using the Web Audio API to generate sounds without needing audio files.
let audioContext: AudioContext;

const getAudioContext = () => {
    if (!audioContext && (window.AudioContext || (window as any).webkitAudioContext)) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
};

const playTone = (
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.2
) => {
  const context = getAudioContext();
  if (!context) return;

  // Resume context if it's suspended (e.g., due to browser autoplay policies)
  if (context.state === 'suspended') {
      context.resume();
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);

  gainNode.gain.setValueAtTime(volume, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration);
};

export const playClickSound = () => playTone(880, 0.05, 'triangle', 0.1);
export const playSubmitSound = () => playTone(440, 0.1, 'square', 0.15);
export const playErrorSound = () => playTone(150, 0.2, 'sawtooth');

export const playWinSound = () => {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  playTone(523.25, 0.1, 'sine'); // C5
  setTimeout(() => playTone(659.25, 0.1, 'sine'), 100); // E5
  setTimeout(() => playTone(783.99, 0.1, 'sine'), 200); // G5
  setTimeout(() => playTone(1046.50, 0.3, 'sine'), 300); // C6
};

export const playLoseSound = () => {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  playTone(349.23, 0.2, 'sawtooth'); // F4
  setTimeout(() => playTone(311.13, 0.3, 'sawtooth'), 200); // D#4
};