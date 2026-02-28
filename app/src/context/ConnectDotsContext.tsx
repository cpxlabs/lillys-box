import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@connect_dots:bestScore';

interface ConnectDotsContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const ConnectDotsContext = createContext<ConnectDotsContextType | undefined>(undefined);

export const ConnectDotsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <ConnectDotsContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </ConnectDotsContext.Provider>
  );
};

export const useConnectDots = () => {
  const ctx = useContext(ConnectDotsContext);
  if (!ctx) throw new Error('useConnectDots must be used within ConnectDotsProvider');
  return ctx;
};
