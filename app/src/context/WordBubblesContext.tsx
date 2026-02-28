import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@word_bubbles:bestScore';

interface WordBubblesContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const WordBubblesContext = createContext<WordBubblesContextType | undefined>(undefined);

export const WordBubblesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <WordBubblesContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </WordBubblesContext.Provider>
  );
};

export const useWordBubbles = () => {
  const ctx = useContext(WordBubblesContext);
  if (!ctx) throw new Error('useWordBubbles must be used within WordBubblesProvider');
  return ctx;
};
