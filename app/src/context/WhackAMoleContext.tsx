import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface WhackAMoleContextType { bestScore: number; updateBestScore: (score: number) => void; }
const WhackAMoleContext = createContext<WhackAMoleContextType | undefined>(undefined);

export const WhackAMoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@whack_a_mole:bestScore');
  return <WhackAMoleContext.Provider value={{ bestScore, updateBestScore }}>{children}</WhackAMoleContext.Provider>;
};

export const useWhackAMole = () => {
  const ctx = useContext(WhackAMoleContext);
  if (!ctx) throw new Error('useWhackAMole must be used within WhackAMoleProvider');
  return ctx;
};
