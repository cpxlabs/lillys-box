import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface FeedThePetContextType { bestScore: number; updateBestScore: (score: number) => void; }
const FeedThePetContext = createContext<FeedThePetContextType | undefined>(undefined);

export const FeedThePetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@feed_the_pet:bestScore');
  return <FeedThePetContext.Provider value={{ bestScore, updateBestScore }}>{children}</FeedThePetContext.Provider>;
};

export const useFeedThePet = () => {
  const ctx = useContext(FeedThePetContext);
  if (!ctx) throw new Error('useFeedThePet must be used within FeedThePetProvider');
  return ctx;
};
