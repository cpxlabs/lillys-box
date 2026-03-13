import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface SnakesLaddersContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const SnakesLaddersContext = createContext<SnakesLaddersContextType | null>(null);

export const SnakesLaddersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_snakes-ladders_best_score');
  return (
    <SnakesLaddersContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </SnakesLaddersContext.Provider>
  );
};

export const useSnakesLadders = () => {
  const ctx = useContext(SnakesLaddersContext);
  if (!ctx) throw new Error('useSnakesLadders must be used within SnakesLaddersProvider');
  return ctx;
};
