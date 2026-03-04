/**
 * Game Ad Strategies Configuration
 * Defines when and how ads should be shown for each game category
 */

import { GameAdConfig, AdPlacement, GameCategory } from '../types/gameAds';

// ───────────────────────────────────────────────────────────────────────────
// CASUAL GAMES STRATEGY
// ───────────────────────────────────────────────────────────────────────────
const casualGamePlacements: AdPlacement[] = [
  {
    id: 'casual-game-start',
    trigger: 'game_started',
    adType: 'interstitial',
    optional: true,
    delayMs: 500,
    message: 'Get ready to play!',
  },
  {
    id: 'casual-game-end',
    trigger: 'game_ended',
    adType: 'rewarded',
    optional: true,
    delayMs: 1000,
    message: 'Watch an ad to double your coins!',
    rewardAmount: 0, // Will be calculated based on game score
  },
  {
    id: 'casual-round-complete',
    trigger: 'level_complete',
    adType: 'interstitial',
    optional: true,
    delayMs: 800,
    message: 'Great job! Next round incoming...',
  },
];

// ───────────────────────────────────────────────────────────────────────────
// PUZZLE GAMES STRATEGY
// ───────────────────────────────────────────────────────────────────────────
const puzzleGamePlacements: AdPlacement[] = [
  {
    id: 'puzzle-hint',
    trigger: 'hint_used',
    adType: 'rewarded',
    optional: true,
    message: 'Watch an ad to get a hint!',
    rewardAmount: 0,
  },
  {
    id: 'puzzle-level-complete',
    trigger: 'level_complete',
    adType: 'interstitial',
    optional: true,
    delayMs: 1500,
    message: 'Level complete!',
  },
  {
    id: 'puzzle-game-over',
    trigger: 'game_over',
    adType: 'rewarded',
    optional: true,
    delayMs: 1000,
    message: 'Watch an ad to retry with a bonus!',
    rewardAmount: 25,
  },
  {
    id: 'puzzle-power-up',
    trigger: 'power_up_activated',
    adType: 'rewarded',
    optional: true,
    message: 'Watch an ad to activate a power-up!',
    rewardAmount: 0,
  },
];

// ───────────────────────────────────────────────────────────────────────────
// ADVENTURE GAMES STRATEGY
// ───────────────────────────────────────────────────────────────────────────
const adventureGamePlacements: AdPlacement[] = [
  {
    id: 'adventure-game-start',
    trigger: 'game_started',
    adType: 'interstitial',
    optional: true,
    delayMs: 500,
    message: 'Ready for adventure?',
  },
  {
    id: 'adventure-checkpoint',
    trigger: 'checkpoint_reached',
    adType: 'interstitial',
    optional: true,
    delayMs: 1000,
    message: 'Checkpoint reached!',
  },
  {
    id: 'adventure-game-over',
    trigger: 'game_over',
    adType: 'rewarded',
    optional: true,
    delayMs: 1000,
    message: 'Watch an ad to continue!',
    rewardAmount: 0,
  },
  {
    id: 'adventure-feature-unlock',
    trigger: 'feature_unlocked',
    adType: 'rewarded',
    optional: true,
    message: 'Watch an ad to unlock this feature!',
    rewardAmount: 0,
  },
];

// ───────────────────────────────────────────────────────────────────────────
// PET CARE STRATEGY
// ───────────────────────────────────────────────────────────────────────────
const petCarePlacements: AdPlacement[] = [
  {
    id: 'pet-daily-bonus',
    trigger: 'daily_bonus_claimed',
    adType: 'rewarded',
    optional: true,
    message: 'Watch an ad for a bonus!',
    rewardAmount: 50,
  },
  {
    id: 'pet-activity-complete',
    trigger: 'activity_completed',
    adType: 'rewarded',
    optional: true,
    message: 'Double your coins? Watch an ad!',
    rewardAmount: 0,
  },
  {
    id: 'pet-feature-unlock',
    trigger: 'feature_unlocked',
    adType: 'rewarded',
    optional: true,
    message: 'Watch an ad to unlock!',
    rewardAmount: 0,
  },
];

// ───────────────────────────────────────────────────────────────────────────
// GAME SPECIFIC CONFIGURATIONS
// ───────────────────────────────────────────────────────────────────────────

const casualGames = [
  'color-tap',
  'bubble-pop',
  'lightning-tap',
  'whack-a-mole',
  'catch-the-ball',
  'paint-splash',
  'balloon-float',
  'treasure-dig',
  'pet-dance-party',
  'snack-stack',
  'dress-up-relay',
  'feed-the-pet',
  'color-mixer',
  'pet-chef',
  'music-maker',
  'garden-grow',
  'photo-studio',
];

const puzzleGames = [
  'memory-match',
  'simon-says',
  'sliding-puzzle',
  'path-finder',
  'shape-sorter',
  'mirror-match-new',
  'word-bubbles',
  'jigsaw-pets',
  'connect-dots',
];

const adventureGames = ['pet-runner', 'pet-explorer', 'weather-wizard', 'pet-taxi', 'muito'];

const petCareGames = ['pet-care'];

/**
 * Get ad strategy for a specific game
 */
export function getGameAdStrategy(gameId: string): GameAdConfig | null {
  // Determine category
  let category: GameCategory;
  let placements: AdPlacement[];

  if (casualGames.includes(gameId)) {
    category = 'casual';
    placements = casualGamePlacements;
  } else if (puzzleGames.includes(gameId)) {
    category = 'puzzle';
    placements = puzzleGamePlacements;
  } else if (adventureGames.includes(gameId)) {
    category = 'adventure';
    placements = adventureGamePlacements;
  } else if (petCareGames.includes(gameId)) {
    category = 'pet-care';
    placements = petCarePlacements;
  } else {
    return null; // Game not configured
  }

  return {
    gameId,
    gameName: gameId,
    category,
    adPlacements: placements,
    rewardMultiplier: 1,
    frequencyLimit: {
      type: 'per_session',
      maxAds: category === 'casual' ? 2 : category === 'puzzle' ? 3 : 3,
    },
  };
}

/**
 * Get all games in a category
 */
export function getGamesByCategory(category: GameCategory): string[] {
  switch (category) {
    case 'casual':
      return casualGames;
    case 'puzzle':
      return puzzleGames;
    case 'adventure':
      return adventureGames;
    case 'pet-care':
      return petCareGames;
    default:
      return [];
  }
}

/**
 * Get placement for a specific event type and game
 */
export function getAdPlacementForEvent(
  gameId: string,
  eventType: string
): AdPlacement | null {
  const strategy = getGameAdStrategy(gameId);
  if (!strategy) return null;

  return strategy.adPlacements.find((p) => p.trigger === eventType) || null;
}

export const gameAdStrategies = {
  casual: casualGamePlacements,
  puzzle: puzzleGamePlacements,
  adventure: adventureGamePlacements,
  'pet-care': petCarePlacements,
  getGameAdStrategy,
  getGamesByCategory,
  getAdPlacementForEvent,
};
