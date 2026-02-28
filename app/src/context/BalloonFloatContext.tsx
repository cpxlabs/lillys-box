import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@balloon_float:bestScore';

interface BalloonFloatContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const BalloonFloatContext = createContext<BalloonFloatContextType | undefined>(undefined);

export const BalloonFloatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <BalloonFloatContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </BalloonFloatContext.Provider>
  );
};

export const useBalloonFloat = () => {
  const ctx = useContext(BalloonFloatContext);
  if (!ctx) throw new Error('useBalloonFloat must be used within BalloonFloatProvider');
  return ctx;
};
