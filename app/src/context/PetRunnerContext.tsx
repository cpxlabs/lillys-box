import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@pet_runner:bestScore';

interface PetRunnerContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetRunnerContext = createContext<PetRunnerContextType | undefined>(undefined);

export const PetRunnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <PetRunnerContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetRunnerContext.Provider>
  );
};

export const usePetRunner = () => {
  const ctx = useContext(PetRunnerContext);
  if (!ctx) throw new Error('usePetRunner must be used within PetRunnerProvider');
  return ctx;
};
