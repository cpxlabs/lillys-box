import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@pet_dance_party:bestScore';

interface PetDancePartyContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetDancePartyContext = createContext<PetDancePartyContextType | undefined>(undefined);

export const PetDancePartyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id || (isGuest ? 'guest' : 'guest');
  const storageKey = `${STORAGE_KEY_BASE}:${userId}`;
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
    if (score > bestScoreRef.current) {
      bestScoreRef.current = score; setBestScore(score);
      AsyncStorage.setItem(storageKey, score.toString()).catch(() => {});
    }
  }, [storageKey]);

  return <PetDancePartyContext.Provider value={{ bestScore, updateBestScore }}>{children}</PetDancePartyContext.Provider>;
};

export const usePetDanceParty = () => {
  const ctx = useContext(PetDancePartyContext);
  if (!ctx) throw new Error('usePetDanceParty must be used within PetDancePartyProvider');
  return ctx;
};
