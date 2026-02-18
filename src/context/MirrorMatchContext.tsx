import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@mirror_match_new:bestScore';
interface MirrorMatchContextType { bestScore: number; updateBestScore: (score: number) => void; }
const MirrorMatchGameContext = createContext<MirrorMatchContextType | undefined>(undefined);

export const MirrorMatchGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  return <MirrorMatchGameContext.Provider value={{ bestScore, updateBestScore }}>{children}</MirrorMatchGameContext.Provider>;
};

export const useMirrorMatchGame = () => {
  const ctx = useContext(MirrorMatchGameContext);
  if (!ctx) throw new Error('useMirrorMatchGame must be used within MirrorMatchGameProvider');
  return ctx;
};
