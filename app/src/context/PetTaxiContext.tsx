import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@pet_taxi:bestScore';

interface PetTaxiContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetTaxiContext = createContext<PetTaxiContextType | undefined>(undefined);

export const PetTaxiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <PetTaxiContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetTaxiContext.Provider>
  );
};

export const usePetTaxi = () => {
  const ctx = useContext(PetTaxiContext);
  if (!ctx) throw new Error('usePetTaxi must be used within PetTaxiProvider');
  return ctx;
};
