import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@paint_splash:bestScore';
interface PaintSplashContextType { bestScore: number; updateBestScore: (score: number) => void; }
const PaintSplashContext = createContext<PaintSplashContextType | undefined>(undefined);

export const PaintSplashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  return <PaintSplashContext.Provider value={{ bestScore, updateBestScore }}>{children}</PaintSplashContext.Provider>;
};

export const usePaintSplash = () => {
  const ctx = useContext(PaintSplashContext);
  if (!ctx) throw new Error('usePaintSplash must be used within PaintSplashProvider');
  return ctx;
};
