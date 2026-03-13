import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface SplashyBathContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const SplashyBathContext = createContext<SplashyBathContextType | null>(null);

export const SplashyBathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_splashy-bath_best_score');
  return (
    <SplashyBathContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </SplashyBathContext.Provider>
  );
};

export const useSplashyBath = () => {
  const ctx = useContext(SplashyBathContext);
  if (!ctx) throw new Error('useSplashyBath must be used within SplashyBathProvider');
  return ctx;
};
