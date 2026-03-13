import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PetLullabyContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetLullabyContext = createContext<PetLullabyContextType | null>(null);

export const PetLullabyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_pet-lullaby_best_score');
  return (
    <PetLullabyContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetLullabyContext.Provider>
  );
};

export const usePetLullaby = () => {
  const ctx = useContext(PetLullabyContext);
  if (!ctx) throw new Error('usePetLullaby must be used within PetLullabyProvider');
  return ctx;
};
