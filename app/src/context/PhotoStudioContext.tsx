import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@photo_studio:bestScore';

interface PhotoStudioContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PhotoStudioContext = createContext<PhotoStudioContextType | undefined>(undefined);

export const PhotoStudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <PhotoStudioContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PhotoStudioContext.Provider>
  );
};

export const usePhotoStudio = () => {
  const ctx = useContext(PhotoStudioContext);
  if (!ctx) throw new Error('usePhotoStudio must be used within PhotoStudioProvider');
  return ctx;
};
