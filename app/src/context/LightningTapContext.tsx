import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface LightningTapContextType { bestScore: number; updateBestScore: (score: number) => void; }
const LightningTapContext = createContext<LightningTapContextType | undefined>(undefined);

export const LightningTapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@lightning_tap:bestScore');
  return <LightningTapContext.Provider value={{ bestScore, updateBestScore }}>{children}</LightningTapContext.Provider>;
};

export const useLightningTap = () => {
  const ctx = useContext(LightningTapContext);
  if (!ctx) throw new Error('useLightningTap must be used within LightningTapProvider');
  return ctx;
};
