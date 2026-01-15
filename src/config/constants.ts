/**
 * Application-wide constants
 *
 * Centralized location for magic numbers, animation durations,
 * and other fixed values used throughout the application.
 */

/**
 * Animation durations in milliseconds
 */
export const ANIMATION_DURATION = {
  /** Short animations (e.g., button press feedback) */
  SHORT: 1000,
  /** Medium animations (e.g., feeding, playing) */
  MEDIUM: 1500,
  /** Long animations (e.g., bathing, complex transitions) */
  LONG: 2000,
  /** Extra long animations */
  EXTRA_LONG: 3000,
} as const;

/**
 * Animation spring configurations
 */
export const ANIMATION_SPRING = {
  /** Default spring configuration */
  DEFAULT: {
    damping: 15,
    stiffness: 150,
  },
  /** Bouncy spring for playful animations */
  BOUNCY: {
    damping: 10,
    stiffness: 120,
  },
  /** Stiff spring for quick, precise movements */
  STIFF: {
    damping: 20,
    stiffness: 200,
  },
} as const;

/**
 * Timer intervals in milliseconds
 */
export const TIMER_INTERVAL = {
  /** How often pet stats decay (PetContext) */
  STAT_DECAY: 1000,
  /** How often ad availability is checked */
  AD_CHECK: 3000,
} as const;

/**
 * Activity types for rewards and tracking
 */
export const ACTIVITY_TYPE = {
  FEED: 'feed',
  PLAY: 'play',
  BATH: 'bath',
  SLEEP: 'sleep',
  VET: 'vet',
} as const;

/**
 * Toast display durations
 */
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 4000,
} as const;

/**
 * Storage keys for AsyncStorage
 */
export const STORAGE_KEYS = {
  PET_DATA: 'petData',
  GAME_STATE: 'gameState',
} as const;

/**
 * Reward multipliers
 */
export const REWARD_MULTIPLIER = {
  /** Standard single reward */
  SINGLE: 1,
  /** Double reward from watching ad */
  DOUBLE: 2,
} as const;

/**
 * UI Constants
 */
export const UI = {
  /** Stat bar heights */
  STAT_BAR_HEIGHT: 20,
  /** Icon sizes */
  ICON_SIZE: {
    SMALL: 16,
    MEDIUM: 24,
    LARGE: 32,
  },
  /** Border radius values */
  BORDER_RADIUS: {
    SMALL: 8,
    MEDIUM: 12,
    LARGE: 16,
  },
} as const;
