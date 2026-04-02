/**
 * Buddy System Types
 *
 * Inspired by claude-pets (https://github.com/milind-soni/claude-pets),
 * adapted for Lilly's Box children's platform.
 *
 * Key differences from claude-pets:
 * - Kid-friendly species and stats
 * - Emoji-based rendering (mobile) instead of ASCII art
 * - Integration with existing pet care system
 * - Reactions to game events and pet actions
 */

// ── Species ──────────────────────────────────────────────────────────
export const SPECIES = [
  'duck',
  'bunny',
  'penguin',
  'cat',
  'owl',
  'turtle',
  'axolotl',
  'capybara',
  'bear',
  'fox',
  'frog',
  'hamster',
] as const;
export type Species = (typeof SPECIES)[number];

// ── Rarity ───────────────────────────────────────────────────────────
export const RARITIES = [
  'common',
  'uncommon',
  'rare',
  'superRare',
  'legendary',
] as const;
export type Rarity = (typeof RARITIES)[number];

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 55,
  uncommon: 25,
  rare: 12,
  superRare: 6,
  legendary: 2,
};

export const RARITY_STARS: Record<Rarity, string> = {
  common: '⭐',
  uncommon: '⭐⭐',
  rare: '⭐⭐⭐',
  superRare: '⭐⭐⭐⭐',
  legendary: '⭐⭐⭐⭐⭐',
};

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  superRare: '#a855f7',
  legendary: '#eab308',
};

// ── Eyes ──────────────────────────────────────────────────────────────
export const EYES = ['●', '◉', '★', '◆', '♥', '✿'] as const;
export type Eye = (typeof EYES)[number];

// ── Accessories ──────────────────────────────────────────────────────
export const ACCESSORIES = [
  'none',
  'crown',
  'flower',
  'bow',
  'star',
  'heart',
  'ribbon',
  'sparkle',
] as const;
export type Accessory = (typeof ACCESSORIES)[number];

// ── Stats (kid-friendly) ────────────────────────────────────────────
export const STAT_NAMES = [
  'KINDNESS',
  'BRAVERY',
  'CURIOSITY',
  'CREATIVITY',
  'SILLINESS',
] as const;
export type StatName = (typeof STAT_NAMES)[number];

// ── Buddy Structure ─────────────────────────────────────────────────

/** The deterministic "bones" of a buddy - generated from seed */
export type BuddyBones = {
  species: Species;
  rarity: Rarity;
  eye: Eye;
  accessory: Accessory;
  sparkle: boolean; // 2% chance - equivalent to "shiny"
  stats: Record<StatName, number>; // 0-100
};

/** The personality layer */
export type BuddySoul = {
  name: string;
  personality: string;
};

/** Full buddy = bones + soul */
export type Buddy = BuddyBones & BuddySoul;

// ── Events ───────────────────────────────────────────────────────────
export type BuddyEventType =
  | 'greeting'
  | 'farewell'
  | 'pet_fed'
  | 'pet_played'
  | 'pet_bathed'
  | 'pet_sleeping'
  | 'game_start'
  | 'game_win'
  | 'game_lose'
  | 'game_highscore'
  | 'idle'
  | 'pet_happy'
  | 'pet_sad'
  | 'petting';

export type BuddyEvent = {
  type: BuddyEventType;
  text?: string;
  timestamp?: number;
};

// ── Mood ─────────────────────────────────────────────────────────────
export type BuddyMood =
  | 'happy'
  | 'excited'
  | 'sleepy'
  | 'playful'
  | 'calm';
