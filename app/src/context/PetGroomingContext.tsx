import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PetGroomingContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetGroomingContext = createContext<PetGroomingContextType | null>(null);

export const PetGroomingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_pet-grooming_best_score');
  return (
    <PetGroomingContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetGroomingContext.Provider>
  );
};

export const usePetGrooming = () => {
  const ctx = useContext(PetGroomingContext);
  if (!ctx) throw new Error('usePetGrooming must be used within PetGroomingProvider');
  return ctx;
};
