import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@treasure_dig:bestScore';

interface TreasureDigContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const TreasureDigContext = createContext<TreasureDigContextType | undefined>(undefined);

export const TreasureDigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <TreasureDigContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </TreasureDigContext.Provider>
  );
};

export const useTreasureDig = () => {
  const ctx = useContext(TreasureDigContext);
  if (!ctx) throw new Error('useTreasureDig must be used within TreasureDigProvider');
  return ctx;
};
