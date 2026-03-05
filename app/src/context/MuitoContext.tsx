import React, { createContext, useContext, useState, useCallback } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface MuitoContextType { score: number; bestScore: number; addScore: (points: number) => void; resetScore: () => void; }
const MuitoContext = createContext<MuitoContextType | undefined>(undefined);

export const MuitoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@muito_game:bestScore');
  const [score, setScore] = useState(0);

  const addScore = useCallback((points: number) => {
    setScore((prev) => {
      const next = prev + points;
      updateBestScore(next);
      return next;
    });
  }, [updateBestScore]);

  const resetScore = useCallback(() => {
    setScore(0);
  }, []);

  return (
    <MuitoContext.Provider value={{ score, bestScore, addScore, resetScore }}>
      {children}
    </MuitoContext.Provider>
  );
};

export const useMuito = () => {
  const ctx = useContext(MuitoContext);
  if (!ctx) throw new Error('useMuito must be used within MuitoProvider');
  return ctx;
};
