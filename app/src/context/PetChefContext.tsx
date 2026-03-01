import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PetChefContextType { bestScore: number; updateBestScore: (score: number) => void; }
const PetChefContext = createContext<PetChefContextType | undefined>(undefined);

export const PetChefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@pet_chef:bestScore');
  return <PetChefContext.Provider value={{ bestScore, updateBestScore }}>{children}</PetChefContext.Provider>;
};

export const usePetChef = () => {
  const ctx = useContext(PetChefContext);
  if (!ctx) throw new Error('usePetChef must be used within PetChefProvider');
  return ctx;
};
