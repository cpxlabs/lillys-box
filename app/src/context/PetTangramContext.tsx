import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PetTangramContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetTangramContext = createContext<PetTangramContextType | null>(null);

export const PetTangramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_pet-tangram_best_score');
  return (
    <PetTangramContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetTangramContext.Provider>
  );
};

export const usePetTangram = () => {
  const ctx = useContext(PetTangramContext);
  if (!ctx) throw new Error('usePetTangram must be used within PetTangramProvider');
  return ctx;
};
