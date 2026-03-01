import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface JigsawPetsContextType { bestScore: number; updateBestScore: (score: number) => void; }
const JigsawPetsContext = createContext<JigsawPetsContextType | undefined>(undefined);

export const JigsawPetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@jigsaw_pets:bestScore');
  return <JigsawPetsContext.Provider value={{ bestScore, updateBestScore }}>{children}</JigsawPetsContext.Provider>;
};

export const useJigsawPets = () => {
  const ctx = useContext(JigsawPetsContext);
  if (!ctx) throw new Error('useJigsawPets must be used within JigsawPetsProvider');
  return ctx;
};
