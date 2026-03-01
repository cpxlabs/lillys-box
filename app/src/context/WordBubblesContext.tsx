import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface WordBubblesContextType { bestScore: number; updateBestScore: (score: number) => void; }
const WordBubblesContext = createContext<WordBubblesContextType | undefined>(undefined);

export const WordBubblesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@word_bubbles:bestScore');
  return <WordBubblesContext.Provider value={{ bestScore, updateBestScore }}>{children}</WordBubblesContext.Provider>;
};

export const useWordBubbles = () => {
  const ctx = useContext(WordBubblesContext);
  if (!ctx) throw new Error('useWordBubbles must be used within WordBubblesProvider');
  return ctx;
};
