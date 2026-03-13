import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface CountingKennelContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const CountingKennelContext = createContext<CountingKennelContextType | null>(null);

export const CountingKennelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_counting-kennel_best_score');
  return (
    <CountingKennelContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </CountingKennelContext.Provider>
  );
};

export const useCountingKennel = () => {
  const ctx = useContext(CountingKennelContext);
  if (!ctx) throw new Error('useCountingKennel must be used within CountingKennelProvider');
  return ctx;
};
