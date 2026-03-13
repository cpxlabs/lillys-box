import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface TreatTossContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const TreatTossContext = createContext<TreatTossContextType | null>(null);

export const TreatTossProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_treat-toss_best_score');
  return (
    <TreatTossContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </TreatTossContext.Provider>
  );
};

export const useTreatToss = () => {
  const ctx = useContext(TreatTossContext);
  if (!ctx) throw new Error('useTreatToss must be used within TreatTossProvider');
  return ctx;
};
