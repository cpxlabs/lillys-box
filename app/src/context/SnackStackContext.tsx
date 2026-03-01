import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface SnackStackContextType { bestScore: number; updateBestScore: (score: number) => void; }
const SnackStackContext = createContext<SnackStackContextType | undefined>(undefined);

export const SnackStackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@snack_stack:bestScore');
  return <SnackStackContext.Provider value={{ bestScore, updateBestScore }}>{children}</SnackStackContext.Provider>;
};

export const useSnackStack = () => {
  const ctx = useContext(SnackStackContext);
  if (!ctx) throw new Error('useSnackStack must be used within SnackStackProvider');
  return ctx;
};
