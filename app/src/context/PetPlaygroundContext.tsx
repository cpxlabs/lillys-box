import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PetPlaygroundContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetPlaygroundContext = createContext<PetPlaygroundContextType | null>(null);

export const PetPlaygroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_pet-playground_best_score');
  return (
    <PetPlaygroundContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetPlaygroundContext.Provider>
  );
};

export const usePetPlayground = () => {
  const ctx = useContext(PetPlaygroundContext);
  if (!ctx) throw new Error('usePetPlayground must be used within PetPlaygroundProvider');
  return ctx;
};
