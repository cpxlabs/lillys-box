import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PetExplorerContextType { bestScore: number; updateBestScore: (score: number) => void; }
const PetExplorerContext = createContext<PetExplorerContextType | undefined>(undefined);

export const PetExplorerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@pet_explorer:bestScore');
  return <PetExplorerContext.Provider value={{ bestScore, updateBestScore }}>{children}</PetExplorerContext.Provider>;
};

export const usePetExplorer = () => {
  const ctx = useContext(PetExplorerContext);
  if (!ctx) throw new Error('usePetExplorer must be used within PetExplorerProvider');
  return ctx;
};
