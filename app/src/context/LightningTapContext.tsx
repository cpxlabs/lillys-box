import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@lightning_tap:bestScore';

interface LightningTapContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const LightningTapContext = createContext<LightningTapContextType | undefined>(undefined);

export const LightningTapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <LightningTapContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </LightningTapContext.Provider>
  );
};

export const useLightningTap = () => {
  const ctx = useContext(LightningTapContext);
  if (!ctx) throw new Error('useLightningTap must be used within LightningTapProvider');
  return ctx;
};
