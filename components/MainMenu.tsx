
import React from 'react';
import { CAMPAIGN_LEVELS } from '../levels';

interface MainMenuProps {
  onSelectMode: (mode: 'campaign' | 'freePlay') => void;
  unlockedLevel: number;
}

const MenuButton: React.FC<{ title: string, description: string, onClick: () => void }> = ({ title, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full max-w-xs p-6 bg-black/30 border-2 border-green-700/50 rounded-lg shadow-lg hover:bg-green-700/20 hover:border-green-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
    style={{ textShadow: '0 0 5px #6ee7b7' }}
  >
    <h2 className="text-3xl font-bold text-green-300">{title}</h2>
    <p className="mt-2 text-gray-300">{description}</p>
  </button>
);

const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode, unlockedLevel }) => {
  const levelIndex = unlockedLevel - 1;
  let campaignDescription: string;

  if (levelIndex < CAMPAIGN_LEVELS.length) {
    campaignDescription = CAMPAIGN_LEVELS[levelIndex].name;
  } else {
    campaignDescription = "Campaign Complete!";
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 text-white">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl text-green-300" style={{ textShadow: '0 0 15px #6ee7b7' }}>
          Code Cracker
        </h1>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <MenuButton
          title="Campaign"
          description={campaignDescription}
          onClick={() => onSelectMode('campaign')}
        />
        <MenuButton
          title="Free Play"
          description="Customize your own code-cracking experience."
          onClick={() => onSelectMode('freePlay')}
        />
      </div>
    </div>
  );
};

export default MainMenu;