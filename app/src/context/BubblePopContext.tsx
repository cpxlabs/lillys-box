import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface BubblePopContextType { bestScore: number; updateBestScore: (score: number) => void; }
const BubblePopContext = createContext<BubblePopContextType | undefined>(undefined);

export const BubblePopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@bubble_pop:bestScore');
  return <BubblePopContext.Provider value={{ bestScore, updateBestScore }}>{children}</BubblePopContext.Provider>;
};

export const useBubblePop = () => {
  const ctx = useContext(BubblePopContext);
  if (!ctx) throw new Error('useBubblePop must be used within BubblePopProvider');
  return ctx;
};
