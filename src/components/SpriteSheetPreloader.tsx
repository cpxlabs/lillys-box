import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Pet } from '../types';
import { spriteSheetManager } from '../utils/SpriteSheetManager';
import { COLORS } from '../config/constants';

interface SpriteSheetPreloaderProps {
  /** Current pet to preload animations for */
  pet: Pet;
  /** All pets to preload (for batch preloading) */
  allPets?: Pet[];
  /** Show loading UI */
  showUI?: boolean;
  /** Callback when preloading completes */
  onComplete?: () => void;
  /** Callback for progress updates */
  onProgress?: (current: number, total: number, percentage: number) => void;
  /** Children to render when loading completes */
  children?: React.ReactNode;
}

/**
 * Component that preloads sprite sheets for pets
 *
 * @example
 * // Basic usage with current pet
 * <SpriteSheetPreloader pet={currentPet} showUI>
 *   <GameScreen />
 * </SpriteSheetPreloader>
 *
 * @example
 * // Batch preload all pets
 * <SpriteSheetPreloader
 *   pet={currentPet}
 *   allPets={allPets}
 *   onComplete={() => console.log('All loaded!')}
 * >
 *   <App />
 * </SpriteSheetPreloader>
 */
export const SpriteSheetPreloader: React.FC<SpriteSheetPreloaderProps> = ({
  pet,
  allPets,
  showUI = true,
  onComplete,
  onProgress,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentPetName, setCurrentPetName] = useState('');

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        const petsToLoad = allPets || [pet];
        const total = petsToLoad.length;

        for (let i = 0; i < petsToLoad.length; i++) {
          const petToLoad = petsToLoad[i];
          setCurrentPetName(petToLoad.name);

          // Preload all animations for this pet
          await spriteSheetManager.preloadPet(
            petToLoad.type,
            petToLoad.color,
            ['idle', 'eating', 'happy'] // Priority animations
          );

          const current = i + 1;
          const percentage = Math.round((current / total) * 100);
          setProgress(percentage);
          onProgress?.(current, total, percentage);
        }

        // Log cache stats
        const stats = spriteSheetManager.getCacheStats();
        console.log('📊 Sprite Sheet Cache Stats:', stats);

        setIsLoading(false);
        onComplete?.();
      } catch (error) {
        console.error('Error preloading sprite sheets:', error);
        // Don't block app - just proceed without sprite sheets
        setIsLoading(false);
        onComplete?.();
      }
    };

    preloadAssets();
  }, [pet, allPets, onComplete, onProgress]);

  if (!showUI || !isLoading) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading animations...</Text>
      {currentPetName && (
        <Text style={styles.petName}>{currentPetName}</Text>
      )}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.percentage}>{progress}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  petName: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  progressContainer: {
    width: '80%',
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginTop: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  percentage: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
