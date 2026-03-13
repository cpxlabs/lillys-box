import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PillowFightContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PillowFightContext = createContext<PillowFightContextType | null>(null);

export const PillowFightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_pillow-fight_best_score');
  return (
    <PillowFightContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PillowFightContext.Provider>
  );
};

export const usePillowFight = () => {
  const ctx = useContext(PillowFightContext);
  if (!ctx) throw new Error('usePillowFight must be used within PillowFightProvider');
  return ctx;
};
