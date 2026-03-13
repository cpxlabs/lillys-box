import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PatternPawsContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PatternPawsContext = createContext<PatternPawsContextType | null>(null);

export const PatternPawsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_pattern-paws_best_score');
  return (
    <PatternPawsContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PatternPawsContext.Provider>
  );
};

export const usePatternPaws = () => {
  const ctx = useContext(PatternPawsContext);
  if (!ctx) throw new Error('usePatternPaws must be used within PatternPawsProvider');
  return ctx;
};
