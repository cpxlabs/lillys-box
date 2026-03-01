import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface MirrorMatchContextType { bestScore: number; updateBestScore: (score: number) => void; }
const MirrorMatchContext = createContext<MirrorMatchContextType | undefined>(undefined);

export const MirrorMatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@mirror_match_new:bestScore');
  return <MirrorMatchContext.Provider value={{ bestScore, updateBestScore }}>{children}</MirrorMatchContext.Provider>;
};

export const useMirrorMatch = () => {
  const ctx = useContext(MirrorMatchContext);
  if (!ctx) throw new Error('useMirrorMatchGame must be used within MirrorMatchGameProvider');
  return ctx;
};
