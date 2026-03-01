import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PaintSplashContextType { bestScore: number; updateBestScore: (score: number) => void; }
const PaintSplashContext = createContext<PaintSplashContextType | undefined>(undefined);

export const PaintSplashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@paint_splash:bestScore');
  return <PaintSplashContext.Provider value={{ bestScore, updateBestScore }}>{children}</PaintSplashContext.Provider>;
};

export const usePaintSplash = () => {
  const ctx = useContext(PaintSplashContext);
  if (!ctx) throw new Error('usePaintSplash must be used within PaintSplashProvider');
  return ctx;
};
