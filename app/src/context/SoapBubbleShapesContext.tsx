import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface SoapBubbleShapesContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const SoapBubbleShapesContext = createContext<SoapBubbleShapesContextType | null>(null);

export const SoapBubbleShapesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_soap-bubble-shapes_best_score');
  return (
    <SoapBubbleShapesContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </SoapBubbleShapesContext.Provider>
  );
};

export const useSoapBubbleShapes = () => {
  const ctx = useContext(SoapBubbleShapesContext);
  if (!ctx) throw new Error('useSoapBubbleShapes must be used within SoapBubbleShapesProvider');
  return ctx;
};
