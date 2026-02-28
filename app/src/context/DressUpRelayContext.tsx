import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@dress_up_relay:bestScore';

interface DressUpRelayContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const DressUpRelayContext = createContext<DressUpRelayContextType | undefined>(undefined);

export const DressUpRelayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <DressUpRelayContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </DressUpRelayContext.Provider>
  );
};

export const useDressUpRelay = () => {
  const ctx = useContext(DressUpRelayContext);
  if (!ctx) throw new Error('useDressUpRelay must be used within DressUpRelayProvider');
  return ctx;
};
