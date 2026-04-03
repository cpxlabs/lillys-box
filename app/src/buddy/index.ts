/**
 * Buddy System - Public API
 */

export { generateBuddy, generateBones, generateSoul } from './generator';
export { getReaction } from './reactions';
export {
  getSpeciesEmoji,
  renderFace,
  getMoodEmoji,
  getIdleFrame,
  getAccessoryEmoji,
  getFrameCount,
} from './sprites';
export type {
  Species,
  Rarity,
  Eye,
  Accessory,
  StatName,
  BuddyBones,
  BuddySoul,
  Buddy,
  BuddyEvent,
  BuddyEventType,
  BuddyMood,
} from './types';
export {
  SPECIES,
  RARITIES,
  RARITY_WEIGHTS,
  RARITY_STARS,
  RARITY_COLORS,
  EYES,
  ACCESSORIES,
  STAT_NAMES,
} from './types';
