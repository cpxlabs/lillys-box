/**
 * Food Items Configuration
 * Centralized data for all food items in the game
 *
 * Each food item has:
 * - id: Unique identifier
 * - emoji: Visual representation
 * - nameKey: Translation key for i18n
 * - hungerValue: How much hunger is restored
 */

export interface FoodItem {
  id: string;
  emoji: string;
  nameKey: string;
  hungerValue: number;
}

/**
 * All available food items
 * Values represent hunger restoration amount
 */
export const FOOD_ITEMS: readonly FoodItem[] = [
  {
    id: 'kibble',
    emoji: '🍖',
    nameKey: 'feed.foods.kibble',
    hungerValue: 20,
  },
  {
    id: 'fish',
    emoji: '🐟',
    nameKey: 'feed.foods.fish',
    hungerValue: 25,
  },
  {
    id: 'treat',
    emoji: '🦴',
    nameKey: 'feed.foods.treat',
    hungerValue: 15,
  },
  {
    id: 'milk',
    emoji: '🥛',
    nameKey: 'feed.foods.milk',
    hungerValue: 10,
  },
] as const;

/**
 * Helper to get food item by ID
 */
export const getFoodById = (id: string): FoodItem | undefined => {
  return FOOD_ITEMS.find((food) => food.id === id);
};
