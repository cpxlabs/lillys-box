import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface TreasureDigContextType { bestScore: number; updateBestScore: (score: number) => void; }
const TreasureDigContext = createContext<TreasureDigContextType | undefined>(undefined);

export const TreasureDigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@treasure_dig:bestScore');
  return <TreasureDigContext.Provider value={{ bestScore, updateBestScore }}>{children}</TreasureDigContext.Provider>;
};

export const useTreasureDig = () => {
  const ctx = useContext(TreasureDigContext);
  if (!ctx) throw new Error('useTreasureDig must be used within TreasureDigProvider');
  return ctx;
};
