import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const FAVORITES_STORAGE_KEY = '@pet_care_game:favorite_games';

const getStorageKey = (userId?: string): string => {
  const id = userId || 'guest';
  return `${FAVORITES_STORAGE_KEY}:${id}`;
};

export function useFavoriteGames() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const key = getStorageKey(user?.id);
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          setFavorites(new Set(JSON.parse(stored)));
        } else {
          setFavorites(new Set());
        }
      } catch {
        setFavorites(new Set());
      } finally {
        setIsLoaded(true);
      }
    };
    loadFavorites();
  }, [user?.id]);

  const saveFavorites = useCallback(
    async (next: Set<string>) => {
      try {
        const key = getStorageKey(user?.id);
        await AsyncStorage.setItem(key, JSON.stringify(Array.from(next)));
      } catch {
        // Silently fail on save error
      }
    },
    [user?.id],
  );

  const toggleFavorite = useCallback(
    (gameId: string) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(gameId)) {
          next.delete(gameId);
        } else {
          next.add(gameId);
        }
        saveFavorites(next);
        return next;
      });
    },
    [saveFavorites],
  );

  const isFavorite = useCallback(
    (gameId: string): boolean => favorites.has(gameId),
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
