import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface StarCatcherContextType { bestScore: number; updateBestScore: (score: number) => void; }
const StarCatcherContext = createContext<StarCatcherContextType | undefined>(undefined);

export const StarCatcherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@star_catcher:bestScore');
  return <StarCatcherContext.Provider value={{ bestScore, updateBestScore }}>{children}</StarCatcherContext.Provider>;
};

export const useStarCatcher = () => {
  const ctx = useContext(StarCatcherContext);
  if (!ctx) throw new Error('useStarCatcher must be used within StarCatcherProvider');
  return ctx;
};
