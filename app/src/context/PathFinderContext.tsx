import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@path_finder:bestScore';

interface PathFinderContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PathFinderContext = createContext<PathFinderContextType | undefined>(undefined);

export const PathFinderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <PathFinderContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PathFinderContext.Provider>
  );
};

export const usePathFinder = () => {
  const ctx = useContext(PathFinderContext);
  if (!ctx) throw new Error('usePathFinder must be used within PathFinderProvider');
  return ctx;
};
