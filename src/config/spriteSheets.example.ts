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
const SPRITE_DEFAULTS = {
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
 * IMPORTANT: Sprite sheet assets are currently DISABLED because they haven't been generated yet.
 *
 * To enable sprite sheets:
 * 1. Generate sprite sheets using the prompts in /docs/VIDEO_GENERATION_PROMPTS.md
 * 2. Place them in: /assets/sprites/animations/{petType}/{petType}_{color}_{state}.png
 * 3. Uncomment the `asset:` lines below (marked with "// UNCOMMENT WHEN ASSETS EXIST")
 * 4. Remove the temporary placeholder `asset:` lines
 *
 * Until assets exist, the app will use transform-based animations as fallback.
 */
export const SPRITE_SHEETS: SpriteSheetMap = {
  cat: {
    base: {
      /* UNCOMMENT WHEN ASSETS EXIST
      idle: {
        asset: require('../../assets/sprites/animations/cats/cat_base_idle.png'),
        frameCount: 12,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: true,
        duration: calcDuration(12, 12),
        interruptible: true,
      },
      eating: {
        asset: require('../../assets/sprites/animations/cats/cat_base_eating.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: true,
        duration: calcDuration(8, 12),
        repeatCount: 3,
        interruptible: false,
        nextState: 'happy',
      },
      happy: {
        asset: require('../../assets/sprites/animations/cats/cat_base_happy.png'),
        frameCount: 10,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: false,
        duration: calcDuration(10, 12),
        interruptible: false,
        nextState: 'idle',
      },
      playing: {
        asset: require('../../assets/sprites/animations/cats/cat_base_playing.png'),
        frameCount: 12,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 15,
        loop: true,
        duration: calcDuration(12, 15),
        repeatCount: 2,
        interruptible: false,
        nextState: 'happy',
      },
      sleeping: {
        asset: require('../../assets/sprites/animations/cats/cat_base_sleeping.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 6,
        loop: true,
        duration: calcDuration(8, 6),
        interruptible: true,
      },
      bathing: {
        asset: require('../../assets/sprites/animations/cats/cat_base_bathing.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 20,
        loop: false,
        duration: calcDuration(8, 20),
        repeatCount: 3,
        interruptible: false,
        nextState: 'happy',
      },
      tired: {
        asset: require('../../assets/sprites/animations/cats/cat_base_tired.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 8,
        loop: true,
        duration: calcDuration(8, 8),
        interruptible: true,
      },
      sick: {
        asset: require('../../assets/sprites/animations/cats/cat_base_sick.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 6,
        loop: true,
        duration: calcDuration(8, 6),
        interruptible: true,
      },
    },
    black: {
      idle: {
        asset: require('../../assets/sprites/animations/cats/cat_black_idle.png'),
        frameCount: 12,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: true,
        duration: calcDuration(12, 12),
        interruptible: true,
      },
      eating: {
        asset: require('../../assets/sprites/animations/cats/cat_black_eating.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: true,
        duration: calcDuration(8, 12),
        repeatCount: 3,
        interruptible: false,
        nextState: 'happy',
      },
      happy: {
        asset: require('../../assets/sprites/animations/cats/cat_black_happy.png'),
        frameCount: 10,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: false,
        duration: calcDuration(10, 12),
        interruptible: false,
        nextState: 'idle',
      },
      playing: {
        asset: require('../../assets/sprites/animations/cats/cat_black_playing.png'),
        frameCount: 12,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 15,
        loop: true,
        duration: calcDuration(12, 15),
        repeatCount: 2,
        interruptible: false,
        nextState: 'happy',
      },
      sleeping: {
        asset: require('../../assets/sprites/animations/cats/cat_black_sleeping.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 6,
        loop: true,
        duration: calcDuration(8, 6),
        interruptible: true,
      },
      bathing: {
        asset: require('../../assets/sprites/animations/cats/cat_black_bathing.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 20,
        loop: false,
        duration: calcDuration(8, 20),
        repeatCount: 3,
        interruptible: false,
        nextState: 'happy',
      },
      tired: {
        asset: require('../../assets/sprites/animations/cats/cat_black_tired.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 8,
        loop: true,
        duration: calcDuration(8, 8),
        interruptible: true,
      },
      sick: {
        asset: require('../../assets/sprites/animations/cats/cat_black_sick.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 6,
        loop: true,
        duration: calcDuration(8, 6),
        interruptible: true,
      },
    },
  },
  dog: {
    brown: {
      idle: {
        asset: require('../../assets/sprites/animations/dogs/dog_brown_idle.png'),
        frameCount: 12,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: true,
        duration: calcDuration(12, 12),
        interruptible: true,
      },
      eating: {
        asset: require('../../assets/sprites/animations/dogs/dog_brown_eating.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: true,
        duration: calcDuration(8, 12),
        repeatCount: 3,
        interruptible: false,
        nextState: 'happy',
      },
      happy: {
        asset: require('../../assets/sprites/animations/dogs/dog_brown_happy.png'),
        frameCount: 10,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: false,
        duration: calcDuration(10, 12),
        interruptible: false,
        nextState: 'idle',
      },
      playing: {
        asset: require('../../assets/sprites/animations/dogs/dog_brown_playing.png'),
        frameCount: 12,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 15,
        loop: true,
        duration: calcDuration(12, 15),
        repeatCount: 2,
        interruptible: false,
        nextState: 'happy',
      },
      sleeping: {
        asset: require('../../assets/sprites/animations/dogs/dog_brown_sleeping.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 6,
        loop: true,
        duration: calcDuration(8, 6),
        interruptible: true,
      },
      bathing: {
        asset: require('../../assets/sprites/animations/dogs/dog_brown_bathing.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 20,
        loop: false,
        duration: calcDuration(8, 20),
        repeatCount: 3,
        interruptible: false,
        nextState: 'happy',
      },
      tired: {
        asset: require('../../assets/sprites/animations/dogs/dog_brown_tired.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 8,
        loop: true,
        duration: calcDuration(8, 8),
        interruptible: true,
      },
      sick: {
        asset: require('../../assets/sprites/animations/dogs/dog_brown_sick.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 6,
        loop: true,
        duration: calcDuration(8, 6),
        interruptible: true,
      },
    },
    black: {
      idle: {
        asset: require('../../assets/sprites/animations/dogs/dog_black_idle.png'),
        frameCount: 12,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: true,
        duration: calcDuration(12, 12),
        interruptible: true,
      },
      eating: {
        asset: require('../../assets/sprites/animations/dogs/dog_black_eating.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: true,
        duration: calcDuration(8, 12),
        repeatCount: 3,
        interruptible: false,
        nextState: 'happy',
      },
      happy: {
        asset: require('../../assets/sprites/animations/dogs/dog_black_happy.png'),
        frameCount: 10,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: false,
        duration: calcDuration(10, 12),
        interruptible: false,
        nextState: 'idle',
      },
      playing: {
        asset: require('../../assets/sprites/animations/dogs/dog_black_playing.png'),
        frameCount: 12,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 15,
        loop: true,
        duration: calcDuration(12, 15),
        repeatCount: 2,
        interruptible: false,
        nextState: 'happy',
      },
      sleeping: {
        asset: require('../../assets/sprites/animations/dogs/dog_black_sleeping.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 6,
        loop: true,
        duration: calcDuration(8, 6),
        interruptible: true,
      },
      bathing: {
        asset: require('../../assets/sprites/animations/dogs/dog_black_bathing.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 20,
        loop: false,
        duration: calcDuration(8, 20),
        repeatCount: 3,
        interruptible: false,
        nextState: 'happy',
      },
      tired: {
        asset: require('../../assets/sprites/animations/dogs/dog_black_tired.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 8,
        loop: true,
        duration: calcDuration(8, 8),
        interruptible: true,
      },
      sick: {
        asset: require('../../assets/sprites/animations/dogs/dog_black_sick.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 6,
        loop: true,
        duration: calcDuration(8, 6),
        interruptible: true,
      },
    },
    whiteandbrown: {
      idle: {
        asset: require('../../assets/sprites/animations/dogs/dog_whiteandbrown_idle.png'),
        frameCount: 12,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: true,
        duration: calcDuration(12, 12),
        interruptible: true,
      },
      eating: {
        asset: require('../../assets/sprites/animations/dogs/dog_whiteandbrown_eating.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: true,
        duration: calcDuration(8, 12),
        repeatCount: 3,
        interruptible: false,
        nextState: 'happy',
      },
      happy: {
        asset: require('../../assets/sprites/animations/dogs/dog_whiteandbrown_happy.png'),
        frameCount: 10,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 12,
        loop: false,
        duration: calcDuration(10, 12),
        interruptible: false,
        nextState: 'idle',
      },
      playing: {
        asset: require('../../assets/sprites/animations/dogs/dog_whiteandbrown_playing.png'),
        frameCount: 12,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 15,
        loop: true,
        duration: calcDuration(12, 15),
        repeatCount: 2,
        interruptible: false,
        nextState: 'happy',
      },
      sleeping: {
        asset: require('../../assets/sprites/animations/dogs/dog_whiteandbrown_sleeping.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 6,
        loop: true,
        duration: calcDuration(8, 6),
        interruptible: true,
      },
      bathing: {
        asset: require('../../assets/sprites/animations/dogs/dog_whiteandbrown_bathing.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 20,
        loop: false,
        duration: calcDuration(8, 20),
        repeatCount: 3,
        interruptible: false,
        nextState: 'happy',
      },
      tired: {
        asset: require('../../assets/sprites/animations/dogs/dog_whiteandbrown_tired.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 8,
        loop: true,
        duration: calcDuration(8, 8),
        interruptible: true,
      },
      sick: {
        asset: require('../../assets/sprites/animations/dogs/dog_whiteandbrown_sick.png'),
        frameCount: 8,
        frameWidth: SPRITE_DEFAULTS.frameWidth,
        frameHeight: SPRITE_DEFAULTS.frameHeight,
        fps: 6,
        loop: true,
        duration: calcDuration(8, 6),
        interruptible: true,
      },
    },
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
