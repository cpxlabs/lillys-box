import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@pet_chef:bestScore';

interface PetChefContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetChefContext = createContext<PetChefContextType | undefined>(undefined);

export const PetChefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <PetChefContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetChefContext.Provider>
  );
};

export const usePetChef = () => {
  const ctx = useContext(PetChefContext);
  if (!ctx) throw new Error('usePetChef must be used within PetChefProvider');
  return ctx;
};
