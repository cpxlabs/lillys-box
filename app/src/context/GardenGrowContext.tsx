import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@garden_grow:bestScore';

interface GardenGrowContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const GardenGrowContext = createContext<GardenGrowContextType | undefined>(undefined);

export const GardenGrowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <GardenGrowContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </GardenGrowContext.Provider>
  );
};

export const useGardenGrow = () => {
  const ctx = useContext(GardenGrowContext);
  if (!ctx) throw new Error('useGardenGrow must be used within GardenGrowProvider');
  return ctx;
};
