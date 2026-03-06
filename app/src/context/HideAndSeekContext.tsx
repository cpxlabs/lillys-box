import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface HideAndSeekContextType { bestScore: number; updateBestScore: (score: number) => void; }
const HideAndSeekContext = createContext<HideAndSeekContextType | undefined>(undefined);

export const HideAndSeekProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@hide_and_seek:bestScore');
  return <HideAndSeekContext.Provider value={{ bestScore, updateBestScore }}>{children}</HideAndSeekContext.Provider>;
};

export const useHideAndSeek = () => {
  const ctx = useContext(HideAndSeekContext);
  if (!ctx) throw new Error('useHideAndSeek must be used within HideAndSeekProvider');
  return ctx;
};
