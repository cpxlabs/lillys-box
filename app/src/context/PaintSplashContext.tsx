import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@paint_splash:bestScore';

interface PaintSplashContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PaintSplashContext = createContext<PaintSplashContextType | undefined>(undefined);

export const PaintSplashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <PaintSplashContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PaintSplashContext.Provider>
  );
};

export const usePaintSplash = () => {
  const ctx = useContext(PaintSplashContext);
  if (!ctx) throw new Error('usePaintSplash must be used within PaintSplashProvider');
  return ctx;
};
