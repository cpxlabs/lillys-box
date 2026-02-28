import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@shape_sorter:bestScore';

interface ShapeSorterContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const ShapeSorterContext = createContext<ShapeSorterContextType | undefined>(undefined);

export const ShapeSorterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <ShapeSorterContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </ShapeSorterContext.Provider>
  );
};

export const useShapeSorter = () => {
  const ctx = useContext(ShapeSorterContext);
  if (!ctx) throw new Error('useShapeSorter must be used within ShapeSorterProvider');
  return ctx;
};
