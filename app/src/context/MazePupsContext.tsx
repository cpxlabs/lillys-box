import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface MazePupsContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const MazePupsContext = createContext<MazePupsContextType | null>(null);

export const MazePupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_maze-pups_best_score');
  return (
    <MazePupsContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </MazePupsContext.Provider>
  );
};

export const useMazePups = () => {
  const ctx = useContext(MazePupsContext);
  if (!ctx) throw new Error('useMazePups must be used within MazePupsProvider');
  return ctx;
};
