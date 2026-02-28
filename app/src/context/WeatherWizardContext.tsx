import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@weather_wizard:bestScore';

interface WeatherWizardContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const WeatherWizardContext = createContext<WeatherWizardContextType | undefined>(undefined);

export const WeatherWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <WeatherWizardContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </WeatherWizardContext.Provider>
  );
};

export const useWeatherWizard = () => {
  const ctx = useContext(WeatherWizardContext);
  if (!ctx) throw new Error('useWeatherWizard must be used within WeatherWizardProvider');
  return ctx;
};
