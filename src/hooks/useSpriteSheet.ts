import { useState, useEffect } from 'react';
import { AnimationState, PetType, PetColor } from '../types';
import { SpriteSheetDefinition } from '../config/spriteSheets';
import { spriteSheetManager } from '../utils/SpriteSheetManager';

/**
 * Hook return type
 */
interface UseSpriteSheetReturn {
  /** Sprite sheet configuration (null if not found) */
  spriteSheet: SpriteSheetDefinition | null;
  /** Whether the sprite sheet is loaded and ready */
  isLoaded: boolean;
  /** Loading error (if any) */
  error: Error | null;
  /** Whether a sprite sheet exists for this configuration */
  exists: boolean;
}

/**
 * React hook for using sprite sheets with automatic preloading
 *
 * @param petType - Type of pet (cat or dog)
 * @param color - Pet color variant
 * @param state - Animation state
 * @param autoPreload - Whether to automatically preload the sprite sheet (default: true)
 *
 * @example
 * const { spriteSheet, isLoaded } = useSpriteSheet(pet.type, pet.color, 'idle');
 *
 * if (isLoaded && spriteSheet) {
 *   return <SpriteSheetAnimation {...spriteSheet} />;
 * }
 */
export const useSpriteSheet = (
  petType: PetType,
  color: PetColor,
  state: AnimationState,
  autoPreload: boolean = true
): UseSpriteSheetReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const spriteSheet = spriteSheetManager.get(petType, color, state);
  const exists = spriteSheet !== null;

  useEffect(() => {
    if (!autoPreload || !exists) {
      return;
    }

    // Check if already loaded
    if (spriteSheetManager.isLoaded(petType, color, state)) {
      setIsLoaded(true);
      return;
    }

    // Preload the sprite sheet
    let isMounted = true;

    spriteSheetManager.preload(petType, color, state).then((success) => {
      if (!isMounted) return;

      setIsLoaded(success);

      if (!success) {
        const loadError = spriteSheetManager.getError(petType, color, state);
        setError(loadError);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [petType, color, state, autoPreload, exists]);

  return {
    spriteSheet,
    isLoaded,
    error,
    exists,
  };
};

/**
 * Hook for preloading all animations for a pet
 *
 * @example
 * const { isPreloading, progress } = usePreloadPetAnimations(pet.type, pet.color);
 */
export const usePreloadPetAnimations = (
  petType: PetType,
  color: PetColor
): {
  isPreloading: boolean;
  progress: number;
} => {
  const [isPreloading, setIsPreloading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const preload = async () => {
      await spriteSheetManager.preloadPet(petType, color);

      if (isMounted) {
        setProgress(1);
        setIsPreloading(false);
      }
    };

    preload();

    return () => {
      isMounted = false;
    };
  }, [petType, color]);

  return {
    isPreloading,
    progress,
  };
};
