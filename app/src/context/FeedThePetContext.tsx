import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@feed_the_pet:bestScore';

interface FeedThePetContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const FeedThePetContext = createContext<FeedThePetContextType | undefined>(undefined);

export const FeedThePetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <FeedThePetContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </FeedThePetContext.Provider>
  );
};

export const useFeedThePet = () => {
  const ctx = useContext(FeedThePetContext);
  if (!ctx) throw new Error('useFeedThePet must be used within FeedThePetProvider');
  return ctx;
};
