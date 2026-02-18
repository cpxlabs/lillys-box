import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@photo_studio:bestScore';
interface PhotoStudioContextType { bestScore: number; updateBestScore: (score: number) => void; }
const PhotoStudioContext = createContext<PhotoStudioContextType | undefined>(undefined);

export const PhotoStudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const storageKey = `${STORAGE_KEY_BASE}:${user?.id || (isGuest ? 'guest' : 'guest')}`;
  const [bestScore, setBestScore] = useState(0);
  const bestScoreRef = useRef(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((stored) => {
      if (stored != null) { const val = parseInt(stored, 10); setBestScore(val); bestScoreRef.current = val; }
      loadedRef.current = true;
    }).catch(() => { loadedRef.current = true; });
  }, [storageKey]);

  const updateBestScore = useCallback((score: number) => {
    if (!loadedRef.current) return;
    if (score > bestScoreRef.current) { bestScoreRef.current = score; setBestScore(score); AsyncStorage.setItem(storageKey, score.toString()).catch(() => {}); }
  }, [storageKey]);

  return <PhotoStudioContext.Provider value={{ bestScore, updateBestScore }}>{children}</PhotoStudioContext.Provider>;
};

export const usePhotoStudio = () => {
  const ctx = useContext(PhotoStudioContext);
  if (!ctx) throw new Error('usePhotoStudio must be used within PhotoStudioProvider');
  return ctx;
};
