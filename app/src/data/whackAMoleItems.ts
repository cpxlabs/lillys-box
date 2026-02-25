/**
 * Whack-a-Mole Game - Item Configuration
 * Defines pests and friendly animals
 */

export interface WhackAMoleItem {
  id: string;
  emoji: string;
  type: 'pest' | 'friendly';
  points: number;
}

/**
 * Pest items - these should be tapped!
 * Tapping awards points
 */
export const PESTS: readonly WhackAMoleItem[] = [
  {
    id: 'bug',
    emoji: '🐛',
    type: 'pest',
    points: 10,
  },
  {
    id: 'mouse',
    emoji: '🐭',
    type: 'pest',
    points: 15,
  },
  {
    id: 'cricket',
    emoji: '🦗',
    type: 'pest',
    points: 12,
  },
  {
    id: 'worm',
    emoji: '🪱',
    type: 'pest',
    points: 8,
  },
] as const;

/**
 * Friendly animals - do NOT tap these!
 * Tapping deducts points
 */
export const FRIENDLY_ANIMALS: readonly WhackAMoleItem[] = [
  {
    id: 'cat',
    emoji: '🐱',
    type: 'friendly',
    points: -20,
  },
  {
    id: 'dog',
    emoji: '🐶',
    type: 'friendly',
    points: -20,
  },
] as const;

/**
 * Power-up items
 */
export interface PowerUpItem {
  id: string;
  emoji: string;
  type: 'freeze' | 'double';
  duration: number; // milliseconds
}

export const POWER_UPS: readonly PowerUpItem[] = [
  {
    id: 'freeze',
    emoji: '❄️',
    type: 'freeze',
    duration: 3000, // 3 seconds
  },
  {
    id: 'double',
    emoji: '⭐',
    type: 'double',
    duration: 5000, // 5 seconds
  },
] as const;

/**
 * Get a random pest
 */
export const getRandomPest = (): WhackAMoleItem => {
  const index = Math.floor(Math.random() * PESTS.length);
  return { ...PESTS[index] };
};

/**
 * Get a random friendly animal
 */
export const getRandomFriendly = (): WhackAMoleItem => {
  const index = Math.floor(Math.random() * FRIENDLY_ANIMALS.length);
  return { ...FRIENDLY_ANIMALS[index] };
};

/**
 * Get a random power-up
 */
export const getRandomPowerUp = (): PowerUpItem => {
  const index = Math.floor(Math.random() * POWER_UPS.length);
  return { ...POWER_UPS[index] };
};
