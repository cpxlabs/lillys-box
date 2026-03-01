import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface WeatherWizardContextType { bestScore: number; updateBestScore: (score: number) => void; }
const WeatherWizardContext = createContext<WeatherWizardContextType | undefined>(undefined);

export const WeatherWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@weather_wizard:bestScore');
  return <WeatherWizardContext.Provider value={{ bestScore, updateBestScore }}>{children}</WeatherWizardContext.Provider>;
};

export const useWeatherWizard = () => {
  const ctx = useContext(WeatherWizardContext);
  if (!ctx) throw new Error('useWeatherWizard must be used within WeatherWizardProvider');
  return ctx;
};
