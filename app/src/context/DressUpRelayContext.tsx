import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface DressUpRelayContextType { bestScore: number; updateBestScore: (score: number) => void; }
const DressUpRelayContext = createContext<DressUpRelayContextType | undefined>(undefined);

export const DressUpRelayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@dress_up_relay:bestScore');
  return <DressUpRelayContext.Provider value={{ bestScore, updateBestScore }}>{children}</DressUpRelayContext.Provider>;
};

export const useDressUpRelay = () => {
  const ctx = useContext(DressUpRelayContext);
  if (!ctx) throw new Error('useDressUpRelay must be used within DressUpRelayProvider');
  return ctx;
};
