import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@bubble_pop:bestScore';

interface BubblePopContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const BubblePopContext = createContext<BubblePopContextType | undefined>(undefined);

export const BubblePopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <BubblePopContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </BubblePopContext.Provider>
  );
};

export const useBubblePop = () => {
  const ctx = useContext(BubblePopContext);
  if (!ctx) throw new Error('useBubblePop must be used within BubblePopProvider');
  return ctx;
};
