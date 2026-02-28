import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@pet_explorer:bestScore';

interface PetExplorerContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetExplorerContext = createContext<PetExplorerContextType | undefined>(undefined);

export const PetExplorerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <PetExplorerContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetExplorerContext.Provider>
  );
};

export const usePetExplorer = () => {
  const ctx = useContext(PetExplorerContext);
  if (!ctx) throw new Error('usePetExplorer must be used within PetExplorerProvider');
  return ctx;
};
