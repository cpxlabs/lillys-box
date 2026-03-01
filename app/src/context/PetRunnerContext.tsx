import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PetRunnerContextType { bestScore: number; updateBestScore: (score: number) => void; }
const PetRunnerContext = createContext<PetRunnerContextType | undefined>(undefined);

export const PetRunnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@pet_runner:bestScore');
  return <PetRunnerContext.Provider value={{ bestScore, updateBestScore }}>{children}</PetRunnerContext.Provider>;
};

export const usePetRunner = () => {
  const ctx = useContext(PetRunnerContext);
  if (!ctx) throw new Error('usePetRunner must be used within PetRunnerProvider');
  return ctx;
};
