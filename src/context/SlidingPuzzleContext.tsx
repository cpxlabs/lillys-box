import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY_BASE = '@sliding_puzzle:bestMoves';

interface BestMoves {
  easy: number | null;
  hard: number | null;
}

interface SlidingPuzzleContextType {
  bestMoves: BestMoves;
  updateBestMoves: (difficulty: 'easy' | 'hard', moves: number) => void;
}

const SlidingPuzzleContext = createContext<SlidingPuzzleContextType | undefined>(undefined);

export const SlidingPuzzleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id || (isGuest ? 'guest' : 'guest');
  const storageKey = `${STORAGE_KEY_BASE}:${userId}`;

  const [bestMoves, setBestMoves] = useState<BestMoves>({ easy: null, hard: null });
  const bestMovesRef = useRef<BestMoves>({ easy: null, hard: null });
  const loadedRef = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(storageKey)
      .then((stored) => {
        if (stored != null) {
          const parsed = JSON.parse(stored) as BestMoves;
          setBestMoves(parsed);
          bestMovesRef.current = parsed;
        }
        loadedRef.current = true;
      })
      .catch(() => {
        loadedRef.current = true;
      });
  }, [storageKey]);

  const updateBestMoves = useCallback(
    (difficulty: 'easy' | 'hard', moves: number) => {
      if (!loadedRef.current) return;
      const current = bestMovesRef.current[difficulty];
      if (current === null || moves < current) {
        const updated = { ...bestMovesRef.current, [difficulty]: moves };
        bestMovesRef.current = updated;
        setBestMoves(updated);
        AsyncStorage.setItem(storageKey, JSON.stringify(updated)).catch(() => {});
      }
    },
    [storageKey],
  );

  return (
    <SlidingPuzzleContext.Provider value={{ bestMoves, updateBestMoves }}>
      {children}
    </SlidingPuzzleContext.Provider>
  );
};

export const useSlidingPuzzle = () => {
  const ctx = useContext(SlidingPuzzleContext);
  if (!ctx) throw new Error('useSlidingPuzzle must be used within SlidingPuzzleProvider');
  return ctx;
};
