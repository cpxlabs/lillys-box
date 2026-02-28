import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@snack_stack:bestScore';

interface SnackStackContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const SnackStackContext = createContext<SnackStackContextType | undefined>(undefined);

export const SnackStackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <SnackStackContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </SnackStackContext.Provider>
  );
};

export const useSnackStack = () => {
  const ctx = useContext(SnackStackContext);
  if (!ctx) throw new Error('useSnackStack must be used within SnackStackProvider');
  return ctx;
};
