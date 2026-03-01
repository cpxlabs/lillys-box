import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PhotoStudioContextType { bestScore: number; updateBestScore: (score: number) => void; }
const PhotoStudioContext = createContext<PhotoStudioContextType | undefined>(undefined);

export const PhotoStudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@photo_studio:bestScore');
  return <PhotoStudioContext.Provider value={{ bestScore, updateBestScore }}>{children}</PhotoStudioContext.Provider>;
};

export const usePhotoStudio = () => {
  const ctx = useContext(PhotoStudioContext);
  if (!ctx) throw new Error('usePhotoStudio must be used within PhotoStudioProvider');
  return ctx;
};
