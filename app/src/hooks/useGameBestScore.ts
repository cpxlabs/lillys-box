import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

/**
 * Hook for persisting and tracking a game's best score in AsyncStorage.
 *
 * Handles initial load, update-if-higher logic, and write failures
 * with __DEV__ logging. Uses a ref to avoid stale closure bugs in
 * updateBestScore without requiring bestScore in its dependency array.
 *
 * @param storageKey - The AsyncStorage key (should be unique per game + user)
 * @returns [bestScore, updateBestScore]
 *
 * @example
 * const { user, isGuest } = useAuth();
 * const userId = user?.id ?? 'guest';
 * const [bestScore, updateBestScore] = useGameBestScore(`@my_game:bestScore:${userId}`);
 */
export function useGameBestScore(storageKey: string): [number, (score: number) => void] {
  const [bestScore, setBestScore] = useState(0);
  const bestScoreRef = useRef(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    loadedRef.current = false;
    bestScoreRef.current = 0;
    setBestScore(0);

    AsyncStorage.getItem(storageKey)
      .then((stored) => {
        if (stored != null) {
          const val = parseInt(stored, 10);
          if (!isNaN(val)) {
            setBestScore(val);
            bestScoreRef.current = val;
          }
        }
        loadedRef.current = true;
      })
      .catch((err) => {
        if (__DEV__) logger.warn('[useGameBestScore] Failed to load best score:', err);
        loadedRef.current = true;
      });
  }, [storageKey]);

  const updateBestScore = useCallback(
    (score: number) => {
      if (!loadedRef.current) return;
      if (score > bestScoreRef.current) {
        bestScoreRef.current = score;
        setBestScore(score);
        AsyncStorage.setItem(storageKey, score.toString()).catch((err) => {
          if (__DEV__) logger.warn('[useGameBestScore] Failed to save best score:', err);
        });
      }
    },
    [storageKey],
  );

  return [bestScore, updateBestScore];
}
