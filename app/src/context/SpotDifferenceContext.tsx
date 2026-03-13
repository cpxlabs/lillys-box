import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface SpotDifferenceContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const SpotDifferenceContext = createContext<SpotDifferenceContextType | null>(null);

export const SpotDifferenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_spot-difference_best_score');
  return (
    <SpotDifferenceContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </SpotDifferenceContext.Provider>
  );
};

export const useSpotDifference = () => {
  const ctx = useContext(SpotDifferenceContext);
  if (!ctx) throw new Error('useSpotDifference must be used within SpotDifferenceProvider');
  return ctx;
};
