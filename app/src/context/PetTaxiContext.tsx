import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PetTaxiContextType { bestScore: number; updateBestScore: (score: number) => void; }
const PetTaxiContext = createContext<PetTaxiContextType | undefined>(undefined);

export const PetTaxiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@pet_taxi:bestScore');
  return <PetTaxiContext.Provider value={{ bestScore, updateBestScore }}>{children}</PetTaxiContext.Provider>;
};

export const usePetTaxi = () => {
  const ctx = useContext(PetTaxiContext);
  if (!ctx) throw new Error('usePetTaxi must be used within PetTaxiProvider');
  return ctx;
};
