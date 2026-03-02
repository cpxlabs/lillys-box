import { Image, ImageRequireSource } from 'react-native';
import { AnimationState, PetType, PetColor } from '../types';
import {
  SpriteSheetDefinition,
  getSpriteSheet,
  hasSpriteSheet,
  getAvailableAnimations,
} from '../config/spriteSheets';
import { logger } from './logger';

/**
 * Cache entry for loaded sprite sheets
 */
interface CacheEntry {
  definition: SpriteSheetDefinition;
  loaded: boolean;
  error?: Error;
  timestamp: number;
}

/**
 * Sprite sheet asset manager with intelligent caching
 */
class SpriteSheetManager {
  private cache: Map<string, CacheEntry>;
  private preloadQueue: Set<string>;
  private isPreloading: boolean;

  constructor() {
    this.cache = new Map();
    this.preloadQueue = new Set();
    this.isPreloading = false;
  }

  /**
   * Generate cache key from pet parameters
   */
  private getCacheKey(
    petType: PetType,
    color: PetColor,
    state: AnimationState
  ): string {
    return `${petType}_${color}_${state}`;
  }

  /**
   * Get sprite sheet definition with caching
   */
  public get(
    petType: PetType,
    color: PetColor,
    state: AnimationState
  ): SpriteSheetDefinition | null {
    const cacheKey = this.getCacheKey(petType, color, state);

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached.definition;
    }

    // Try to get from config
    const definition = getSpriteSheet(petType, color, state);
    if (definition) {
      // Add to cache
      this.cache.set(cacheKey, {
        definition,
        loaded: false,
        timestamp: Date.now(),
      });
      return definition;
    }

    return null;
  }

  /**
   * Check if sprite sheet exists
   */
  public has(
    petType: PetType,
    color: PetColor,
    state: AnimationState
  ): boolean {
    return hasSpriteSheet(petType, color, state);
  }

  /**
   * Preload a single sprite sheet
   */
  public async preload(
    petType: PetType,
    color: PetColor,
    state: AnimationState
  ): Promise<boolean> {
    const cacheKey = this.getCacheKey(petType, color, state);
    const definition = this.get(petType, color, state);

    if (!definition) {
      logger.warn(`Sprite sheet not found: ${cacheKey}`);
      return false;
    }

    // Check if already loaded
    const cached = this.cache.get(cacheKey);
    if (cached?.loaded) {
      return true;
    }

    try {
      // Resolve asset source to get URI
      const resolvedAsset = Image.resolveAssetSource(definition.asset);

      if (!resolvedAsset) {
        throw new Error('Failed to resolve asset source');
      }

      // Prefetch the image
      await Image.prefetch(resolvedAsset.uri);

      // Update cache
      this.cache.set(cacheKey, {
        definition,
        loaded: true,
        timestamp: Date.now(),
      });

      logger.log(`✅ Preloaded sprite sheet: ${cacheKey}`);
      return true;
    } catch (error) {
      logger.error(`❌ Failed to preload sprite sheet: ${cacheKey}`, error);

      // Update cache with error
      this.cache.set(cacheKey, {
        definition,
        loaded: false,
        error: error as Error,
        timestamp: Date.now(),
      });

      return false;
    }
  }

  /**
   * Preload all sprite sheets for a specific pet
   */
  public async preloadPet(
    petType: PetType,
    color: PetColor,
    priority: AnimationState[] = ['idle', 'eating', 'happy']
  ): Promise<void> {
    const availableStates = getAvailableAnimations(petType, color);

    // Sort states by priority
    const sortedStates = [
      ...priority.filter((state) => availableStates.includes(state)),
      ...availableStates.filter((state) => !priority.includes(state)),
    ];

    logger.log(`🎬 Preloading ${sortedStates.length} animations for ${petType} (${color})`);

    // Preload in priority order
    for (const state of sortedStates) {
      await this.preload(petType, color, state);
    }

    logger.log(`✅ Finished preloading ${petType} (${color})`);
  }

  /**
   * Preload all sprite sheets for multiple pets (batch)
   */
  public async preloadBatch(
    pets: Array<{ type: PetType; color: PetColor }>,
    onProgress?: (current: number, total: number) => void
  ): Promise<void> {
    if (this.isPreloading) {
      logger.warn('Preloading already in progress');
      return;
    }

    this.isPreloading = true;
    let completed = 0;
    const total = pets.length;

    try {
      for (const pet of pets) {
        await this.preloadPet(pet.type, pet.color);
        completed++;
        onProgress?.(completed, total);
      }
    } finally {
      this.isPreloading = false;
    }
  }

  /**
   * Clear cache (useful for memory management)
   */
  public clearCache(): void {
    this.cache.clear();
    logger.log('🗑️  Sprite sheet cache cleared');
  }

  /**
   * Clear old cache entries (older than maxAge milliseconds)
   */
  public clearOldCache(maxAge: number = 5 * 60 * 1000): void {
    const now = Date.now();
    let cleared = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > maxAge) {
        this.cache.delete(key);
        cleared++;
      }
    }

    if (cleared > 0) {
      logger.log(`🗑️  Cleared ${cleared} old cache entries`);
    }
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): {
    total: number;
    loaded: number;
    failed: number;
    pending: number;
  } {
    let loaded = 0;
    let failed = 0;
    let pending = 0;

    for (const entry of this.cache.values()) {
      if (entry.loaded) {
        loaded++;
      } else if (entry.error) {
        failed++;
      } else {
        pending++;
      }
    }

    return {
      total: this.cache.size,
      loaded,
      failed,
      pending,
    };
  }

  /**
   * Get all cached sprite sheet keys
   */
  public getCachedKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Check if a sprite sheet is loaded
   */
  public isLoaded(
    petType: PetType,
    color: PetColor,
    state: AnimationState
  ): boolean {
    const cacheKey = this.getCacheKey(petType, color, state);
    return this.cache.get(cacheKey)?.loaded ?? false;
  }

  /**
   * Get loading error for a sprite sheet (if any)
   */
  public getError(
    petType: PetType,
    color: PetColor,
    state: AnimationState
  ): Error | null {
    const cacheKey = this.getCacheKey(petType, color, state);
    return this.cache.get(cacheKey)?.error ?? null;
  }
}

// Singleton instance
export const spriteSheetManager = new SpriteSheetManager();

// Export for testing or advanced usage
export { SpriteSheetManager };
