import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PathFinderContextType { bestScore: number; updateBestScore: (score: number) => void; }
const PathFinderContext = createContext<PathFinderContextType | undefined>(undefined);

export const PathFinderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@path_finder:bestScore');
  return <PathFinderContext.Provider value={{ bestScore, updateBestScore }}>{children}</PathFinderContext.Provider>;
};

export const usePathFinder = () => {
  const ctx = useContext(PathFinderContext);
  if (!ctx) throw new Error('usePathFinder must be used within PathFinderProvider');
  return ctx;
};
