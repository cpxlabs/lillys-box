/**
 * Play Activities Configuration
 * Centralized data for all play activities in the game
 *
 * Each play activity has:
 * - id: Unique identifier
 * - emoji: Visual representation
 * - nameKey: Translation key for i18n
 */

export interface PlayActivity {
  id: string;
  emoji: string;
  nameKey: string;
}

/**
 * All available play activities
 */
export const PLAY_ACTIVITIES: readonly PlayActivity[] = [
  {
    id: 'yarn_ball',
    emoji: '🧶',
    nameKey: 'play.activities.yarnBall',
  },
  {
    id: 'small_ball',
    emoji: '⚽',
    nameKey: 'play.activities.smallBall',
  },
] as const;

/**
 * Helper to get play activity by ID
 */
export const getActivityById = (id: string): PlayActivity | undefined => {
  return PLAY_ACTIVITIES.find((activity) => activity.id === id);
};
