import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface BalloonFloatContextType { bestScore: number; updateBestScore: (score: number) => void; }
const BalloonFloatContext = createContext<BalloonFloatContextType | undefined>(undefined);

export const BalloonFloatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@balloon_float:bestScore');
  return <BalloonFloatContext.Provider value={{ bestScore, updateBestScore }}>{children}</BalloonFloatContext.Provider>;
};

export const useBalloonFloat = () => {
  const ctx = useContext(BalloonFloatContext);
  if (!ctx) throw new Error('useBalloonFloat must be used within BalloonFloatProvider');
  return ctx;
};
