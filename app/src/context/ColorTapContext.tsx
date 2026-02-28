import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY = '@game_color-tap_best_score';

interface ColorTapContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const ColorTapContext = createContext<ColorTapContextType | null>(null);

export const ColorTapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? (isGuest ? 'guest' : 'guest');
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY}:${userId}`);

  return (
    <ColorTapContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </ColorTapContext.Provider>
  );
};

export const useColorTap = () => {
  const ctx = useContext(ColorTapContext);
  if (!ctx) throw new Error('useColorTap must be used within ColorTapProvider');
  return ctx;
};
