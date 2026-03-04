import React, { createContext, useContext, useState } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

export type Difficulty = 'easy' | 'normal' | 'hard';

interface WeatherWizardContextType {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  bestScore: number;
  bestScores: Record<Difficulty, number>;
  updateBestScore: (score: number) => void;
}
const WeatherWizardContext = createContext<WeatherWizardContextType | undefined>(undefined);

export const WeatherWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  const { bestScore: easy, updateBestScore: updateEasy } = useGameBestScore('@weather_wizard:bestScore:easy');
  const { bestScore: normal, updateBestScore: updateNormal } = useGameBestScore('@weather_wizard:bestScore:normal');
  const { bestScore: hard, updateBestScore: updateHard } = useGameBestScore('@weather_wizard:bestScore:hard');

  const bestScores: Record<Difficulty, number> = { easy, normal, hard };

  const updateBestScore = (score: number) => {
    const updaters: Record<Difficulty, (s: number) => void> = {
      easy: updateEasy,
      normal: updateNormal,
      hard: updateHard,
    };
    updaters[difficulty](score);
  };

  const currentBest = bestScores[difficulty];

  return (
    <WeatherWizardContext.Provider
      value={{
        difficulty,
        setDifficulty,
        bestScore: currentBest,
        bestScores,
        updateBestScore,
      }}
    >
      {children}
    </WeatherWizardContext.Provider>
  );
};

export const useWeatherWizard = () => {
  const ctx = useContext(WeatherWizardContext);
  if (!ctx) throw new Error('useWeatherWizard must be used within WeatherWizardProvider');
  return ctx;
};
