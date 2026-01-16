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
  /** Happy bounce animation - pet jumps when happy */
  HAPPY_BOUNCE: {
    damping: 8,
    stiffness: 100,
    amplitude: -15,
  },
} as const;

/**
 * Pet animation parameters
 * Used by PetRenderer for various animation states
 */
export const PET_ANIMATION = {
  /** Happy state - wiggle and bounce */
  HAPPY: {
    wiggle: {
      rotation: 5, // degrees
      durationFirst: 100,
      durationSecond: 200,
      durationThird: 100,
    },
  },
  /** Eating state - head bob */
  EATING: {
    bobAmount: -5, // pixels
    duration: 400,
  },
  /** Bathing state - shake */
  BATHING: {
    shakeAmount: 3, // pixels
    durationFirst: 50,
    durationSecond: 100,
    durationThird: 50,
  },
  /** Idle state - breathing animation */
  IDLE: {
    maxScale: 1.02,
    duration: 2000,
  },
} as const;

/**
 * Sleep scene animation parameters
 */
export const SLEEP_ANIMATION = {
  /** Floating Z animation */
  Z_FLOAT: {
    offsetPixels: -30,
    duration: 1500,
    minOpacity: 0.4,
    maxScale: 1.2,
  },
  /** Fade out duration when waking up */
  FADE_OUT_DURATION: 2000,
} as const;

/**
 * Timer intervals in milliseconds
 */
export const TIMER_INTERVAL = {
  /** How often pet stats decay (PetContext) */
  STAT_DECAY: 1000,
  /** How often ad availability is checked */
  AD_CHECK: 3000,
  /** Debounce delay for saving pet data to storage */
  DEBOUNCE_SAVE_DELAY: 1000,
  /** How often to check if sleep was cancelled */
  SLEEP_CANCELLATION_CHECK: 100,
  /** How often to update sleep progress bar */
  SLEEP_PROGRESS_UPDATE: 100,
  /** Delay before returning to home screen after sleep */
  SLEEP_COMPLETION_DELAY: 500,
  /** Bubble creation throttle in bath scene */
  BUBBLE_THROTTLE: 100,
} as const;

/**
 * Time conversion constants
 */
export const TIME = {
  /** Milliseconds per minute */
  MS_PER_MINUTE: 60000,
  /** Milliseconds per second */
  MS_PER_SECOND: 1000,
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
  /** Dirt mark size ratio (percentage of pet size) */
  DIRT_MARK_SIZE_RATIO: 0.071,
  /** Gesture sensitivity */
  GESTURE: {
    /** Pan gesture damping factor (0-1) */
    PAN_DAMPING: 0.3,
    /** Sponge scale when actively scrubbing */
    SPONGE_ACTIVE_SCALE: 1.1,
  },
} as const;

/**
 * Stat level thresholds
 * These determine the visual representation and behavior for stat values
 */
export const STAT_THRESHOLDS = {
  /** Thresholds for stat level colors and labels */
  LEVELS: {
    HIGH: 70, // Green - healthy range
    MEDIUM: 40, // Orange - needs attention
    LOW: 20, // Red - urgent
    CRITICAL: 0, // Dark red - emergency
  },
  /** Thresholds for mood display */
  MOOD: {
    EXCELLENT: 80,
    GOOD: 60,
    FAIR: 40,
    POOR: 20,
    CRITICAL: 0,
  },
  /** Thresholds for energy-based multipliers */
  ENERGY: {
    HIGH: 70,
    MEDIUM: 40,
    LOW: 20,
    CRITICAL: 0,
  },
  /** Thresholds for dirt mark display (hygiene-based) */
  DIRT_MARKS: {
    NONE: 80, // 0 dirt marks
    ONE: 60, // 1 dirt mark
    TWO: 40, // 2 dirt marks
    THREE: 20, // 3 dirt marks
    FOUR: 0, // 4 dirt marks
    MAX: 5, // Maximum dirt marks
  },
  /** Happiness calculation thresholds */
  HAPPINESS: {
    /** All stats above this = happiness boost */
    HEALTHY_STAT: 70,
    /** Health below this = moderate happiness penalty */
    UNHEALTHY_HEALTH: 60,
    /** Health below this = severe happiness penalty */
    VERY_UNHEALTHY_HEALTH: 40,
  },
} as const;

/**
 * Color scheme for consistent UI colors across the app
 */
export const COLORS = {
  /** Stat level colors (matches STAT_THRESHOLDS.LEVELS) */
  STAT_LEVELS: {
    HIGH: '#4CAF50', // Green
    MEDIUM: '#FFA726', // Orange
    LOW: '#EF5350', // Red
    CRITICAL: '#C62828', // Dark red
  },
  /** Vet urgency indicator colors */
  URGENCY: {
    URGENT: '#EF5350', // Red
    SUGGESTED: '#FFA726', // Orange
    NORMAL: '#4CAF50', // Green
  },
} as const;
