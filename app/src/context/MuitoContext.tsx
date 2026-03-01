import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface MuitoContextType { score: number; bestScore: number; addScore: (points: number) => void; resetScore: () => void; }
const MuitoContext = createContext<MuitoContextType | undefined>(undefined);

export const MuitoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@muito_game:bestScore');
  return <MuitoContext.Provider value={{ bestScore, updateBestScore }}>{children}</MuitoContext.Provider>;
};

export const useMuito = () => {
  const ctx = useContext(MuitoContext);
  if (!ctx) throw new Error('useMuito must be used within MuitoProvider');
  return ctx;
};
