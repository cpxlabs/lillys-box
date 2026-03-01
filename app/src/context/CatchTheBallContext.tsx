import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface CatchTheBallContextType { bestScore: number; updateBestScore: (score: number) => void; }
const CatchTheBallContext = createContext<CatchTheBallContextType | undefined>(undefined);

export const CatchTheBallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@catch_the_ball:bestScore');
  return <CatchTheBallContext.Provider value={{ bestScore, updateBestScore }}>{children}</CatchTheBallContext.Provider>;
};

export const useCatchTheBall = () => {
  const ctx = useContext(CatchTheBallContext);
  if (!ctx) throw new Error('useCatchTheBall must be used within CatchTheBallProvider');
  return ctx;
};
