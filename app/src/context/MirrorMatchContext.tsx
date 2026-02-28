import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@mirror_match_new:bestScore';

interface MirrorMatchContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const MirrorMatchGameContext = createContext<MirrorMatchContextType | undefined>(undefined);

export const MirrorMatchGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <MirrorMatchGameContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </MirrorMatchGameContext.Provider>
  );
};

export const useMirrorMatchGame = () => {
  const ctx = useContext(MirrorMatchGameContext);
  if (!ctx) throw new Error('useMirrorMatchGame must be used within MirrorMatchGameProvider');
  return ctx;
};
