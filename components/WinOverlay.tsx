import React, { useEffect, useState } from 'react';

interface WinOverlayProps {
  onClose: () => void;
}

const WinOverlay: React.FC<WinOverlayProps> = ({ onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 10px #6ee7b7, 0 0 20px #6ee7b7, 0 0 30px #34d399; }
          50% { text-shadow: 0 0 20px #6ee7b7, 0 0 30px #34d399, 0 0 40px #10b981; }
        }
        @keyframes scanline {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        .win-overlay {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .win-overlay-text {
          animation: textGlow 2s infinite ease-in-out;
        }
        .scanline-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          background: linear-gradient(to bottom, rgba(110, 231, 183, 0), rgba(110, 231, 183, 0.1) 50%, rgba(110, 231, 183, 0));
          background-size: 100% 8px;
          animation: scanline 0.2s linear infinite;
        }
      `}</style>
      <div
        onClick={onClose}
        className={`win-overlay fixed inset-0 bg-black/80 z-40 flex items-center justify-center transition-opacity duration-500 cursor-pointer ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="relative text-center text-green-300 p-4">
          <h2 className="win-overlay-text text-4xl sm:text-5xl md:text-6xl uppercase tracking-widest">
            System Unlocked
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mt-4 opacity-80">
            Access Granted
          </p>
        </div>
        <div className="scanline-effect"></div>
      </div>
    </>
  );
};

export default WinOverlay;