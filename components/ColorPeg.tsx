
import React, { useRef, useEffect } from 'react';
import { ALL_COLORS } from '../constants';
import type { CodeType } from '../types';

interface ColorPegProps {
  colorName: string | null;
  onClick?: () => void;
  isInteractive?: boolean;
  onWheelChange?: (direction: 'up' | 'down') => void;
  codeType?: CodeType;
}

const ColorPeg: React.FC<ColorPegProps> = ({ colorName, onClick, isInteractive = false, onWheelChange, codeType = 'color' }) => {
  const color = ALL_COLORS.find(c => c.name === colorName);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const buttonElement = buttonRef.current;

    const handleWheel = (e: WheelEvent) => {
      if (!isInteractive || !onWheelChange) return;
      e.preventDefault();
      const direction = e.deltaY < 0 ? 'up' : 'down';
      onWheelChange(direction);
    };

    if (buttonElement) {
      buttonElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (buttonElement) {
        buttonElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isInteractive, onWheelChange]);

  const baseClasses = 'w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center relative';
  
  if (!color) {
    return (
      <button 
        ref={buttonRef}
        className={`${baseClasses} bg-gray-800 border-gray-900 shadow-inner ${isInteractive ? 'cursor-pointer hover:bg-gray-700' : ''}`}
        onClick={onClick}
        disabled={!isInteractive}
        aria-label="Empty peg"
      />
    );
  }

  const character = codeType === 'letter' ? color.letter : codeType === 'number' ? color.number : null;
  const colorClasses = `${color.bg} border-black/50`;
  const glowStyle = { boxShadow: `0 0 15px var(--shadow-color), inset 0 2px 4px rgba(255,255,255,0.4)`, '--shadow-color': `var(--tw-shadow-color)` };
  
  if (codeType !== 'color' && character) {
    const textStyle = {
        color: color.hex,
        textShadow: `0 0 8px ${color.hex}, 0 0 12px ${color.hex}`
    };

    return (
        <button
          ref={buttonRef}
          className={`${baseClasses} ${colorClasses} ${color.shadow} ${isInteractive ? 'cursor-pointer transform hover:scale-105' : ''}`}
          style={glowStyle}
          onClick={onClick}
          disabled={!isInteractive}
          aria-label={`Peg: ${color.name} (${character})`}
        >
          <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
          <span className="relative text-2xl sm:text-3xl font-bold" style={textStyle}>
            {character}
          </span>
        </button>
    );
  }
  
  return (
    <button
      ref={buttonRef}
      className={`${baseClasses} ${colorClasses} ${color.shadow} ${isInteractive ? 'cursor-pointer transform hover:scale-105' : ''}`}
      style={glowStyle}
      onClick={onClick}
      disabled={!isInteractive}
      aria-label={`Color peg: ${color.name}`}
    />
  );
};

export default ColorPeg;
