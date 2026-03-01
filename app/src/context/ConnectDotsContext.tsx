import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface ConnectDotsContextType { bestScore: number; updateBestScore: (score: number) => void; }
const ConnectDotsContext = createContext<ConnectDotsContextType | undefined>(undefined);

export const ConnectDotsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@connect_dots:bestScore');
  return <ConnectDotsContext.Provider value={{ bestScore, updateBestScore }}>{children}</ConnectDotsContext.Provider>;
};

export const useConnectDots = () => {
  const ctx = useContext(ConnectDotsContext);
  if (!ctx) throw new Error('useConnectDots must be used within ConnectDotsProvider');
  return ctx;
};
