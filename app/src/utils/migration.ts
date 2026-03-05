import { Pet } from '../types';
import { GAME_BALANCE } from '../config/gameBalance';
import { calculateHealth } from './petStats';
import { logger } from './logger';

/**
 * Migrate old pet data to new schema
 * Ensures backwards compatibility with existing saves
 */
export const migratePetData = (oldPet: Record<string, unknown>): Pet => {
  // Check if pet already has new fields
  const hasNewFields = 'energy' in oldPet && 'happiness' in oldPet && 'health' in oldPet;

  if (hasNewFields) {
    // Already migrated, but ensure lastUpdated exists
    return {
      ...oldPet,
      lastUpdated: oldPet.lastUpdated ?? Date.now(),
      isSleeping: oldPet.isSleeping ?? false,
    } as Pet;
  }

  // Migrate to new schema
  const migratedPet: Pet = {
    ...oldPet,
    // Add new stats with reasonable defaults
    energy: GAME_BALANCE.initialStats.energy,
    happiness: GAME_BALANCE.initialStats.happiness,
    health: GAME_BALANCE.initialStats.health, // Will be recalculated below
    lastUpdated: Date.now(),
    isSleeping: false,
  };

  // Calculate actual health based on current stats
  migratedPet.health = calculateHealth(migratedPet);

  logger.log('Migrated pet data:', {
    name: migratedPet.name,
    addedFields: {
      energy: migratedPet.energy,
      happiness: migratedPet.happiness,
      health: migratedPet.health,
    },
  });

  return migratedPet;
};

/**
 * Validate pet data structure
 * Returns true if valid, false otherwise
 */
export const validatePetData = (pet: Record<string, unknown>): pet is Pet => {
  if (!pet || typeof pet !== 'object') return false;

  const requiredFields = [
    'id',
    'name',
    'type',
    'color',
    'gender',
    'hunger',
    'hygiene',
    'energy',
    'happiness',
    'health',
    'money',
    'clothes',
    'createdAt',
    'lastUpdated',
  ];

  // Check all required fields exist
  for (const field of requiredFields) {
    if (!(field in pet)) {
      logger.warn(`Pet data missing required field: ${field}`);
      return false;
    }
  }

  // Validate stat ranges
  const stats = ['hunger', 'hygiene', 'energy', 'happiness', 'health'];
  for (const stat of stats) {
    const value = pet[stat];
    if (typeof value !== 'number' || value < 0 || value > 100) {
      logger.warn(`Pet data has invalid ${stat} value: ${value}`);
      return false;
    }
  }

  return true;
};

/**
 * Repair corrupted pet data
 * Attempts to fix common data issues
 */
export const repairPetData = (pet: Record<string, unknown>): Pet | null => {
  if (!pet || typeof pet !== 'object') {
    logger.error('Cannot repair: pet data is null or not an object');
    return null;
  }

  try {
    // Start with migrated data
    const repairedPet = migratePetData(pet);

    // Clamp all stats to valid ranges
    repairedPet.hunger = Math.min(100, Math.max(0, repairedPet.hunger || 50));
    repairedPet.hygiene = Math.min(100, Math.max(0, repairedPet.hygiene || 50));
    repairedPet.energy = Math.min(100, Math.max(0, repairedPet.energy || 50));
    repairedPet.happiness = Math.min(100, Math.max(0, repairedPet.happiness || 50));
    repairedPet.money = Math.max(0, repairedPet.money || 0);

    // Recalculate health
    repairedPet.health = calculateHealth(repairedPet);

    // Ensure timestamps are valid
    repairedPet.createdAt = repairedPet.createdAt || Date.now();
    repairedPet.lastUpdated = repairedPet.lastUpdated || Date.now();

    // Clear invalid sleep state
    if (repairedPet.isSleeping && !repairedPet.sleepStartTime) {
      repairedPet.isSleeping = false;
      repairedPet.sleepStartTime = undefined;
    }

    logger.log('Repaired pet data:', repairedPet.name);
    return repairedPet;
  } catch (error) {
    logger.error('Failed to repair pet data:', error);
    return null;
  }
};
