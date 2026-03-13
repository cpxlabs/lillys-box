import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface MemoryBoardContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const MemoryBoardContext = createContext<MemoryBoardContextType | null>(null);

export const MemoryBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_memory-board_best_score');
  return (
    <MemoryBoardContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </MemoryBoardContext.Provider>
  );
};

export const useMemoryBoard = () => {
  const ctx = useContext(MemoryBoardContext);
  if (!ctx) throw new Error('useMemoryBoard must be used within MemoryBoardProvider');
  return ctx;
};
