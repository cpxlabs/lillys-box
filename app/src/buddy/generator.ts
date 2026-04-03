/**
 * Deterministic buddy generator.
 *
 * Given a seed string (e.g. user ID), produces the same buddy every time.
 * Inspired by claude-pets' generator with kid-friendly adaptations.
 */

import { mulberry32, hashString, pick } from './prng';
import type { BuddyBones, Buddy, BuddySoul, Rarity, StatName } from './types';
import {
  SPECIES,
  RARITIES,
  RARITY_WEIGHTS,
  EYES,
  ACCESSORIES,
  STAT_NAMES,
} from './types';

const SALT = 'lillys-box-buddy-2026';

// ── Rarity Roll ──────────────────────────────────────────────────────

function rollRarity(rng: () => number): Rarity {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  for (const r of RARITIES) {
    roll -= RARITY_WEIGHTS[r];
    if (roll < 0) return r;
  }
  return 'common';
}

// ── Stat Generation ──────────────────────────────────────────────────

const STAT_FLOOR: Record<Rarity, number> = {
  common: 10,
  uncommon: 20,
  rare: 30,
  superRare: 40,
  legendary: 55,
};

function rollStats(
  rng: () => number,
  rarity: Rarity,
): Record<StatName, number> {
  const floor = STAT_FLOOR[rarity];
  const peak = pick(rng, STAT_NAMES);
  let dump = pick(rng, STAT_NAMES);
  while (dump === peak) dump = pick(rng, STAT_NAMES);

  const stats = {} as Record<StatName, number>;
  for (const name of STAT_NAMES) {
    if (name === peak) {
      stats[name] = Math.min(100, floor + 45 + Math.floor(rng() * 25));
    } else if (name === dump) {
      stats[name] = Math.max(5, floor - 5 + Math.floor(rng() * 15));
    } else {
      stats[name] = floor + Math.floor(rng() * 35);
    }
  }
  return stats;
}

// ── Names & Personalities (kid-friendly) ─────────────────────────────

const NAMES = [
  'Luna',
  'Pixel',
  'Mochi',
  'Boba',
  'Tofu',
  'Nimbus',
  'Pip',
  'Cosmo',
  'Ember',
  'Fern',
  'Sunny',
  'Maple',
  'Cookie',
  'Pebble',
  'Sage',
  'Twig',
  'Bubbles',
  'Clover',
  'Doodle',
  'Sprout',
  'Ziggy',
  'Pudding',
  'Noodle',
  'Waffles',
  'Poppy',
];

const PERSONALITIES = [
  'cheerful and always smiling',
  'curious about everything',
  'super playful and silly',
  'calm and dreamy',
  'brave and adventurous',
  'kind and caring',
  'creative and artistic',
  'funny and loves to dance',
];

// ── Generation Functions ─────────────────────────────────────────────

/** Generate the deterministic "bones" of a buddy from a seed */
export function generateBones(seed: string): BuddyBones {
  const rng = mulberry32(hashString(seed + SALT));
  const rarity = rollRarity(rng);
  return {
    species: pick(rng, SPECIES),
    rarity,
    eye: pick(rng, EYES),
    accessory: rarity === 'common' ? 'none' : pick(rng, ACCESSORIES),
    sparkle: rng() < 0.02,
    stats: rollStats(rng, rarity),
  };
}

/** Generate the personality layer from a seed */
export function generateSoul(seed: string): BuddySoul {
  const rng = mulberry32(hashString(seed + SALT + '-soul'));
  return {
    name: pick(rng, NAMES),
    personality: pick(rng, PERSONALITIES),
  };
}

/** Generate a complete buddy from a seed */
export function generateBuddy(seed: string, soul?: BuddySoul): Buddy {
  return { ...generateBones(seed), ...(soul ?? generateSoul(seed)) };
}
