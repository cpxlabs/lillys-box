import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface SimonSaysContextType { bestScore: number; updateBestScore: (score: number) => void; }
const SimonSaysContext = createContext<SimonSaysContextType | undefined>(undefined);

export const SimonSaysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@simon_says:bestScore');
  return <SimonSaysContext.Provider value={{ bestScore, updateBestScore }}>{children}</SimonSaysContext.Provider>;
};

export const useSimonSays = () => {
  const ctx = useContext(SimonSaysContext);
  if (!ctx) throw new Error('useSimonSays must be used within SimonSaysProvider');
  return ctx;
};
