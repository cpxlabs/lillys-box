import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@music_maker:bestScore';
interface MusicMakerContextType { bestScore: number; updateBestScore: (score: number) => void; }
const MusicMakerContext = createContext<MusicMakerContextType | undefined>(undefined);

export const MusicMakerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  return <MusicMakerContext.Provider value={{ bestScore, updateBestScore }}>{children}</MusicMakerContext.Provider>;
};

export const useMusicMaker = () => {
  const ctx = useContext(MusicMakerContext);
  if (!ctx) throw new Error('useMusicMaker must be used within MusicMakerProvider');
  return ctx;
};
