/**
 * Feed the Pet Game - Item Configuration
 * Defines good (food) and bad items for the catch game
 */

export interface FeedThePetItem {
  id: string;
  emoji: string;
  type: 'good' | 'bad';
  points: number;
}

/**
 * Good items (food) - reuses existing food items
 * Catching these awards points
 */
export const GOOD_ITEMS: readonly FeedThePetItem[] = [
  {
    id: 'kibble',
    emoji: '🍖',
    type: 'good',
    points: 10,
  },
  {
    id: 'fish',
    emoji: '🐟',
    type: 'good',
    points: 15,
  },
  {
    id: 'treat',
    emoji: '🦴',
    type: 'good',
    points: 20,
  },
  {
    id: 'milk',
    emoji: '🥛',
    type: 'good',
    points: 5,
  },
] as const;

/**
 * Bad items - must be avoided
 * Catching these deducts points and lives
 */
export const BAD_ITEMS: readonly FeedThePetItem[] = [
  {
    id: 'rock',
    emoji: '🪨',
    type: 'bad',
    points: -10,
  },
  {
    id: 'garbage',
    emoji: '🗑️',
    type: 'bad',
    points: -15,
  },
  {
    id: 'poop',
    emoji: '💩',
    type: 'bad',
    points: -5,
  },
] as const;

/**
 * All items combined for random selection
 */
export const ALL_ITEMS = [...GOOD_ITEMS, ...BAD_ITEMS] as const;

/**
 * Get a random item with weighted probability
 * 75% chance of good item, 25% chance of bad item
 */
export const getRandomItem = (): FeedThePetItem => {
  const random = Math.random();

  if (random < 0.75) {
    // Good item (75%)
    const index = Math.floor(Math.random() * GOOD_ITEMS.length);
    return { ...GOOD_ITEMS[index] };
  } else {
    // Bad item (25%)
    const index = Math.floor(Math.random() * BAD_ITEMS.length);
    return { ...BAD_ITEMS[index] };
  }
};
