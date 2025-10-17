
import React, { useState, useMemo, useEffect } from 'react';
import type { GameSettings, GameMode, LevelConfig } from '../types';
import { CAMPAIGN_LEVELS } from '../levels';
import * as audio from '../services/audioService';

interface SettingsModalProps {
  currentSettings: GameSettings;
  onSave: (newSettings: GameSettings) => void;
  onClose: () => void;
  mode: GameMode;
  unlockedLevel?: number;
  currentLevel?: number;
  onSelectLevel?: (levelIndex: number) => void;
}

const formatSecondsToTime = (seconds: number): string => {
    if (seconds === 0) return "No Limit";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const OptionSelector: React.FC<{
  label: string;
  options: { value: number | string; label: string }[];
  selectedValue: number | string;
  onSelect: (value: any) => void;
}> = ({ label, options, selectedValue, onSelect }) => (
  <div className="mb-6">
    <label className="block text-gray-300 text-sm font-bold mb-2">{label}</label>
    <div className="flex rounded-lg bg-gray-900 p-1">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => {
            audio.playClickSound();
            onSelect(option.value);
          }}
          className={`flex-1 p-2 rounded-md transition-colors font-semibold ${selectedValue === option.value ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-700'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const Slider: React.FC<{ label: string; value: number; min: number; max: number; step?: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; displayValue?: string; }> = ({ label, value, min, max, step = 1, onChange, displayValue }) => (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-bold mb-2">
        {label}: <span className="text-green-400">{displayValue ?? value}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-green-500 [&::-moz-range-thumb]:cursor-pointer"
      />
    </div>
);

const FreePlaySettings: React.FC<{
    settings: GameSettings;
    setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}> = ({ settings, setSettings }) => {
    const colorOptions = useMemo(() => {
        const options = [];
        for (let i = settings.codeLength; i <= 10; i++) {
            options.push({ value: i, label: i.toString() });
        }
        return options;
    }, [settings.codeLength]);

    const handleCodeLengthChange = (newLength: number) => {
        const newSettings = { ...settings, codeLength: newLength };
        if (newSettings.numColors < newLength) {
            newSettings.numColors = newLength;
        }
        setSettings(newSettings);
    };


    return (
    <>
      <OptionSelector
          label="Code Type"
          options={[{value: 'color', label: "Color"}, {value: 'letter', label: "Letter"}, {value: 'number', label: "Number"}]}
          selectedValue={settings.codeType}
          onSelect={(value) => setSettings({ ...settings, codeType: value })}
      />
      <OptionSelector
        label="Code Length"
        options={[{value: 4, label: "4"}, {value: 5, label: "5"}, {value: 6, label: "6"}]}
        selectedValue={settings.codeLength}
        onSelect={handleCodeLengthChange}
      />
      <OptionSelector
        label="Number of Colors"
        options={colorOptions}
        selectedValue={settings.numColors}
        onSelect={(value) => setSettings({ ...settings, numColors: value })}
      />
      <OptionSelector
        label="Difficulty"
        options={[{value: 'simple', label: "Simple"}, {value: 'hard', label: "Hard"}]}
        selectedValue={settings.difficulty}
        onSelect={(value) => setSettings({ ...settings, difficulty: value })}
      />
      <Slider 
          label="Attempt Limit"
          value={settings.maxAttempts}
          min={1} max={30}
          onChange={(e) => setSettings({ ...settings, maxAttempts: parseInt(e.target.value) })}
      />
      <Slider 
          label="Time Limit"
          value={settings.timeLimit}
          min={0} max={600} step={30}
          onChange={(e) => setSettings({ ...settings, timeLimit: parseInt(e.target.value) })}
          displayValue={formatSecondsToTime(settings.timeLimit)}
      />
    </>
    );
};

const CampaignSettings: React.FC<{
    settings: GameSettings;
    setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
    unlockedLevel: number;
    currentLevel: number;
    onSelectLevel: (levelIndex: number) => void;
}> = ({ settings, setSettings, unlockedLevel, currentLevel, onSelectLevel }) => {
  const selectedLevelConfig = useMemo(() => CAMPAIGN_LEVELS[currentLevel], [currentLevel]);
  return (
    <>
      <OptionSelector
        label="Code Type"
        options={[{value: 'color', label: "Color"}, {value: 'letter', label: "Letter"}, {value: 'number', label: "Number"}]}
        selectedValue={settings.codeType}
        onSelect={(value) => setSettings({ ...settings, codeType: value })}
      />
      <div>
        <label className="block text-gray-300 text-sm font-bold mb-2">Select Level</label>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {CAMPAIGN_LEVELS.map((level, index) => {
              const isLocked = index >= unlockedLevel;
              return (
                <button 
                  key={index}
                  onClick={() => {
                    if (!isLocked) {
                      audio.playClickSound();
                      onSelectLevel(index);
                    }
                  }}
                  disabled={isLocked}
                  className={`w-full text-left p-3 rounded-md transition-colors flex justify-between items-center ${
                    currentLevel === index 
                    ? 'bg-green-600 border-2 border-green-400' 
                    : isLocked 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <span>{level.name}</span>
                  {isLocked && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              )
            })}
        </div>
      </div>
      <div className="mt-4 p-3 bg-black/20 rounded-lg border border-gray-600">
        <h3 className="text-lg text-green-300 mb-2">{selectedLevelConfig.name} Details</h3>
        <ul className="text-gray-300 space-y-1 text-sm">
          <li>Code Length: <span className="font-semibold text-white">{selectedLevelConfig.codeLength}</span></li>
          <li>Colors: <span className="font-semibold text-white">{selectedLevelConfig.numColors}</span></li>
          <li>Attempts: <span className="font-semibold text-white">{selectedLevelConfig.maxAttempts}</span></li>
          <li>Difficulty: <span className="font-semibold text-white capitalize">{selectedLevelConfig.difficulty}</span></li>
          <li>Time Limit: <span className="font-semibold text-white">{formatSecondsToTime(selectedLevelConfig.timeLimit)}</span></li>
        </ul>
      </div>
    </>
  );
};

const SettingsModal: React.FC<SettingsModalProps> = ({ currentSettings, onSave, onClose, mode, unlockedLevel = 1, currentLevel = 0, onSelectLevel = () => {} }) => {
  const [settings, setSettings] = useState<GameSettings>(currentSettings);

  // Sync local state with props, important for when props change while modal is open (e.g., selecting a new level).
  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2d3748] rounded-xl shadow-2xl p-6 w-full max-w-md border-2 border-gray-600 overflow-y-auto max-h-[95vh]">
        <h2 className="text-2xl text-green-300 mb-6 text-center">
            {mode === 'campaign' ? "Campaign Settings" : "Free Play Settings"}
        </h2>
        
        {mode === 'campaign' ? 
            <CampaignSettings 
                settings={settings}
                setSettings={setSettings}
                unlockedLevel={unlockedLevel}
                currentLevel={currentLevel}
                onSelectLevel={onSelectLevel}
            /> 
            : 
            <FreePlaySettings 
                settings={settings}
                setSettings={setSettings}
            />
        }

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={() => { audio.playClickSound(); onClose(); }} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-bold">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 font-bold">
            Apply & Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
