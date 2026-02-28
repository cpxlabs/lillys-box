import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@catch_the_ball:bestScore';

interface CatchTheBallContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const CatchTheBallContext = createContext<CatchTheBallContextType | undefined>(undefined);

export const CatchTheBallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <CatchTheBallContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </CatchTheBallContext.Provider>
  );
};

export const useCatchTheBall = () => {
  const ctx = useContext(CatchTheBallContext);
  if (!ctx) throw new Error('useCatchTheBall must be used within CatchTheBallProvider');
  return ctx;
};
