import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PetParadeContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetParadeContext = createContext<PetParadeContextType | null>(null);

export const PetParadeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_pet-parade_best_score');
  return (
    <PetParadeContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetParadeContext.Provider>
  );
};

export const usePetParade = () => {
  const ctx = useContext(PetParadeContext);
  if (!ctx) throw new Error('usePetParade must be used within PetParadeProvider');
  return ctx;
};
