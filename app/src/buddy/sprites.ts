/**
 * Buddy emoji sprites and face rendering.
 *
 * Mobile-first approach: uses emoji instead of ASCII art.
 * Each species has a primary emoji, face variants, and accessory display.
 */

import type { Species, Accessory, BuddyBones, BuddyMood } from './types';

// ── Species Emoji Map ────────────────────────────────────────────────
export const SPECIES_EMOJI: Record<Species, string> = {
  duck: '🦆',
  bunny: '🐰',
  penguin: '🐧',
  cat: '🐱',
  owl: '🦉',
  turtle: '🐢',
  axolotl: '🦎',
  capybara: '🦫',
  bear: '🐻',
  fox: '🦊',
  frog: '🐸',
  hamster: '🐹',
};

// ── Species-specific faces for compact display ───────────────────────
export const SPECIES_FACES: Record<Species, string> = {
  duck: '(🦆)',
  bunny: '(🐰)',
  penguin: '(🐧)',
  cat: '=🐱=',
  owl: '{🦉}',
  turtle: '[🐢]',
  axolotl: '~🦎~',
  capybara: '(🦫)',
  bear: '(🐻)',
  fox: '(🦊)',
  frog: '~🐸~',
  hamster: '(🐹)',
};

// ── Accessory Emoji Map ──────────────────────────────────────────────
export const ACCESSORY_EMOJI: Record<Accessory, string> = {
  none: '',
  crown: '👑',
  flower: '🌸',
  bow: '🎀',
  star: '⭐',
  heart: '💖',
  ribbon: '🎗️',
  sparkle: '✨',
};

// ── Mood Emoji ───────────────────────────────────────────────────────
const MOOD_EMOJI: Record<BuddyMood, string> = {
  happy: '😊',
  excited: '🤩',
  sleepy: '😴',
  playful: '😝',
  calm: '😌',
};

// ── Animation frames (emoji sequences for idle animation) ────────────
const IDLE_FRAMES: Record<Species, string[]> = {
  duck: ['🦆', '🦆💨', '🦆✨'],
  bunny: ['🐰', '🐰💫', '🐰✨'],
  penguin: ['🐧', '🐧❄️', '🐧✨'],
  cat: ['🐱', '🐱💤', '🐱✨'],
  owl: ['🦉', '🦉🌙', '🦉✨'],
  turtle: ['🐢', '🐢🌿', '🐢✨'],
  axolotl: ['🦎', '🦎💧', '🦎✨'],
  capybara: ['🦫', '🦫🌊', '🦫✨'],
  bear: ['🐻', '🐻🍯', '🐻✨'],
  fox: ['🦊', '🦊🍂', '🦊✨'],
  frog: ['🐸', '🐸🌧️', '🐸✨'],
  hamster: ['🐹', '🐹🌻', '🐹✨'],
};

// ── Render Functions ─────────────────────────────────────────────────

/** Get the primary emoji for a species */
export function getSpeciesEmoji(species: Species): string {
  return SPECIES_EMOJI[species];
}

/** Render a compact one-line face */
export function renderFace(bones: BuddyBones): string {
  const face = SPECIES_FACES[bones.species];
  const accessory = ACCESSORY_EMOJI[bones.accessory];
  return accessory ? `${accessory}${face}` : face;
}

/** Get the mood emoji */
export function getMoodEmoji(mood: BuddyMood): string {
  return MOOD_EMOJI[mood];
}

/** Get an animation frame for idle display */
export function getIdleFrame(species: Species, frameIndex: number): string {
  const frames = IDLE_FRAMES[species];
  return frames[frameIndex % frames.length];
}

/** Get the accessory emoji */
export function getAccessoryEmoji(accessory: Accessory): string {
  return ACCESSORY_EMOJI[accessory];
}

/** Get total animation frame count for a species */
export function getFrameCount(species: Species): number {
  return IDLE_FRAMES[species].length;
}
