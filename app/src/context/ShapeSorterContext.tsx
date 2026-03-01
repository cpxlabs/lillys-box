import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface ShapeSorterContextType { bestScore: number; updateBestScore: (score: number) => void; }
const ShapeSorterContext = createContext<ShapeSorterContextType | undefined>(undefined);

export const ShapeSorterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@shape_sorter:bestScore');
  return <ShapeSorterContext.Provider value={{ bestScore, updateBestScore }}>{children}</ShapeSorterContext.Provider>;
};

export const useShapeSorter = () => {
  const ctx = useContext(ShapeSorterContext);
  if (!ctx) throw new Error('useShapeSorter must be used within ShapeSorterProvider');
  return ctx;
};
