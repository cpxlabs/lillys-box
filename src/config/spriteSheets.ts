import { ImageRequireSource } from 'react-native';
import { AnimationState, PetType, PetColor } from '../types';

/**
 * Sprite sheet configuration interface
 */
export interface SpriteSheetConfig {
  /** Path to the sprite sheet asset */
  asset: ImageRequireSource;
  /** Number of frames in the sprite sheet */
  frameCount: number;
  /** Width of each frame in pixels */
  frameWidth: number;
  /** Height of each frame in pixels */
  frameHeight: number;
  /** Frames per second for playback */
  fps: number;
  /** Whether the animation should loop */
  loop: boolean;
  /** Total duration in milliseconds (calculated) */
  duration: number;
}

/**
 * Animation metadata for each state
 */
export interface AnimationMetadata {
  /** How many times the animation should repeat */
  repeatCount?: number;
  /** Whether this animation can be interrupted */
  interruptible: boolean;
  /** Next animation state after completion (if not looping) */
  nextState?: AnimationState;
}

/**
 * Complete sprite sheet definition with metadata
 */
export interface SpriteSheetDefinition extends SpriteSheetConfig, AnimationMetadata {}

/**
 * Sprite sheet map: PetType -> PetColor -> AnimationState -> Config
 */
type SpriteSheetMap = {
  [key in PetType]: {
    [color in PetColor]?: {
      [state in AnimationState]?: SpriteSheetDefinition;
    };
  };
};

/**
 * Default sprite sheet configuration values
 */
export const SPRITE_DEFAULTS = {
  frameWidth: 256,
  frameHeight: 256,
} as const;

/**
 * Helper to calculate duration from frame count and fps
 */
const calcDuration = (frameCount: number, fps: number): number => {
  return (frameCount / fps) * 1000;
};

/**
 * Main sprite sheet registry
 *
 * ⚠️ SPRITE SHEETS NOT YET IMPLEMENTED
 *
 * The sprite sheet assets haven't been created yet. To add sprite sheets:
 *
 * 1. Generate sprite sheet videos using prompts in /docs/VIDEO_GENERATION_PROMPTS.md
 * 2. Extract frames and create sprite sheets using /tools/create_spritesheet.py
 * 3. Place sprite sheets in /assets/sprites/animations/{petType}/{petType}_{color}_{state}.png
 * 4. See /src/config/spriteSheets.example.ts for full configuration reference
 * 5. Add require() statements for your assets below
 *
 * Example:
 *   cat: {
 *     base: {
 *       idle: {
 *         asset: require('../../assets/sprites/animations/cats/cat_base_idle.png'),
 *         frameCount: 12,
 *         frameWidth: 256,
 *         frameHeight: 256,
 *         fps: 12,
 *         loop: true,
 *         duration: 1000,
 *         interruptible: true,
 *       },
 *       ...
 *     }
 *   }
 *
 * Until sprite sheets exist, the app uses transform-based animations as fallback.
 */
export const SPRITE_SHEETS: SpriteSheetMap = {
  cat: {
    // Add cat sprite sheets here when assets are ready
  },
  dog: {
    // Add dog sprite sheets here when assets are ready
  },
};

/**
 * Get sprite sheet configuration for a specific pet and animation state
 */
export const getSpriteSheet = (
  petType: PetType,
  color: PetColor,
  state: AnimationState
): SpriteSheetDefinition | null => {
  return SPRITE_SHEETS[petType]?.[color]?.[state] || null;
};

/**
 * Check if a sprite sheet exists for given parameters
 */
export const hasSpriteSheet = (
  petType: PetType,
  color: PetColor,
  state: AnimationState
): boolean => {
  return getSpriteSheet(petType, color, state) !== null;
};

/**
 * Get all available animation states for a pet
 */
export const getAvailableAnimations = (
  petType: PetType,
  color: PetColor
): AnimationState[] => {
  const animations = SPRITE_SHEETS[petType]?.[color];
  if (!animations) return [];
  return Object.keys(animations) as AnimationState[];
};

// Export for use in configurations
export { calcDuration };
