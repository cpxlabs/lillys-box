import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface GardenGrowContextType { bestScore: number; updateBestScore: (score: number) => void; }
const GardenGrowContext = createContext<GardenGrowContextType | undefined>(undefined);

export const GardenGrowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@garden_grow:bestScore');
  return <GardenGrowContext.Provider value={{ bestScore, updateBestScore }}>{children}</GardenGrowContext.Provider>;
};

export const useGardenGrow = () => {
  const ctx = useContext(GardenGrowContext);
  if (!ctx) throw new Error('useGardenGrow must be used within GardenGrowProvider');
  return ctx;
};
