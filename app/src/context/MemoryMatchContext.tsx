import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface MemoryMatchContextType { bestScores: BestScores; updateBestScore: (difficulty: Difficulty, score: number) => void; }
const MemoryMatchContext = createContext<MemoryMatchContextType | undefined>(undefined);

export const MemoryMatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@memory_match:bestScore');
  return <MemoryMatchContext.Provider value={{ bestScore, updateBestScore }}>{children}</MemoryMatchContext.Provider>;
};

export const useMemoryMatch = () => {
  const ctx = useContext(MemoryMatchContext);
  if (!ctx) throw new Error('useMemoryMatch must be used within MemoryMatchProvider');
  return ctx;
};
