import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface ColorTapContextType { bestScore: number; updateBestScore: (score: number) => void; }
const ColorTapContext = createContext<ColorTapContextType | null>(null);

export const ColorTapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_color-tap_best_score');
  return <ColorTapContext.Provider value={{ bestScore, updateBestScore }}>{children}</ColorTapContext.Provider>;
};

export const useColorTap = () => {
  const ctx = useContext(ColorTapContext);
  if (!ctx) throw new Error('useColorTap must be used within ColorTapProvider');
  return ctx;
};
