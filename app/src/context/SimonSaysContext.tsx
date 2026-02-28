import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@simon_says:bestScore';

interface SimonSaysContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const SimonSaysContext = createContext<SimonSaysContextType | undefined>(undefined);

export const SimonSaysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <SimonSaysContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </SimonSaysContext.Provider>
  );
};

export const useSimonSays = () => {
  const ctx = useContext(SimonSaysContext);
  if (!ctx) throw new Error('useSimonSays must be used within SimonSaysProvider');
  return ctx;
};
