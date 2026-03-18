import { Pet, PetMood, StatLevel } from '../types';
import { GAME_BALANCE } from '../config/gameBalance';
import { STAT_THRESHOLDS, COLORS } from '../config/constants';
import { ActionType } from '../config/actionConfig';

/**
 * Validation result for action checks
 */
export type ValidationResult = {
  /** Whether the action can be performed */
  canPerform: boolean;
  /** i18n key for toast message explaining why action is blocked */
  reason?: string;
};

/**
 * Calculate pet's health based on all stats
 */
export const calculateHealth = (pet: Partial<Pet>): number => {
  const { hunger = 0, hygiene = 0, energy = 0, happiness = 0 } = pet;

  // Weighted average based on configuration
  const baseHealth =
    hunger * GAME_BALANCE.healthWeights.hunger +
    hygiene * GAME_BALANCE.healthWeights.hygiene +
    energy * GAME_BALANCE.healthWeights.energy +
    happiness * GAME_BALANCE.healthWeights.happiness;

  // Apply status multiplier based on stat thresholds
  const criticalThreshold = GAME_BALANCE.thresholds.statCritical; // 10
  const warningThreshold = GAME_BALANCE.thresholds.statWarning; // 25
  const mediumThreshold = GAME_BALANCE.thresholds.statMedium;

  const anyStatBelowCritical =
    hunger < criticalThreshold ||
    hygiene < criticalThreshold ||
    energy < criticalThreshold ||
    happiness < criticalThreshold;
  const anyStatBelowWarning =
    hunger < warningThreshold ||
    hygiene < warningThreshold ||
    energy < warningThreshold ||
    happiness < warningThreshold;
  const anyStatBelowMedium =
    hunger < mediumThreshold ||
    hygiene < mediumThreshold ||
    energy < mediumThreshold ||
    happiness < mediumThreshold;

  let multiplier: number;
  if (anyStatBelowCritical) {
    multiplier = GAME_BALANCE.healthStatusMultipliers.anyStatBelow10;
  } else if (anyStatBelowWarning) {
    multiplier = GAME_BALANCE.healthStatusMultipliers.anyStatBelow25;
  } else if (anyStatBelowMedium) {
    multiplier = GAME_BALANCE.healthStatusMultipliers.anyStatBelow50;
  } else {
    // All stats are >= 50
    multiplier = GAME_BALANCE.healthStatusMultipliers.allStatsAbove50;
  }

  return Math.min(100, Math.max(0, baseHealth * multiplier));
};

/**
 * Get pet's current mood based on health
 */
export const getPetMood = (health: number): PetMood => {
  const { MOOD } = STAT_THRESHOLDS;

  if (health >= MOOD.EXCELLENT) return 'excellent';
  if (health >= MOOD.GOOD) return 'good';
  if (health >= MOOD.FAIR) return 'fair';
  if (health >= MOOD.POOR) return 'poor';
  return 'critical';
};

/**
 * Get stat level with color coding
 */
export const getStatLevel = (value: number): StatLevel => {
  const { LEVELS } = STAT_THRESHOLDS;
  const { STAT_LEVELS: STAT_COLORS } = COLORS;

  let level: 'high' | 'medium' | 'low' | 'critical';
  let color: string;

  if (value >= LEVELS.HIGH) {
    level = 'high';
    color = STAT_COLORS.HIGH;
  } else if (value >= LEVELS.MEDIUM) {
    level = 'medium';
    color = STAT_COLORS.MEDIUM;
  } else if (value >= LEVELS.LOW) {
    level = 'low';
    color = STAT_COLORS.LOW;
  } else {
    level = 'critical';
    color = STAT_COLORS.CRITICAL;
  }

  return { value, level, color };
};

/**
 * Calculate energy decay rate based on time of day
 */
export const getEnergyDecayRate = (): number => {
  const hour = new Date().getHours();
  const isDaytime =
    hour >= GAME_BALANCE.time.dayStartHour && hour < GAME_BALANCE.time.nightStartHour;
  return isDaytime ? GAME_BALANCE.decay.energyDay : GAME_BALANCE.decay.energyNight;
};

/**
 * Calculate activity effect multiplier based on energy
 */
export const getEnergyMultiplier = (energy: number): number => {
  const { ENERGY } = STAT_THRESHOLDS;

  if (energy >= ENERGY.HIGH) return GAME_BALANCE.energyMultipliers.high;
  if (energy >= ENERGY.MEDIUM) return GAME_BALANCE.energyMultipliers.medium;
  if (energy >= ENERGY.LOW) return GAME_BALANCE.energyMultipliers.low;
  return GAME_BALANCE.energyMultipliers.critical;
};

/**
 * Calculate stat decay multiplier based on health
 */
export const getDecayMultiplier = (health: number): number => {
  const { MOOD } = STAT_THRESHOLDS;

  if (health >= MOOD.EXCELLENT) return GAME_BALANCE.decayMultipliers.excellent;
  if (health >= MOOD.GOOD) return GAME_BALANCE.decayMultipliers.good;
  if (health >= MOOD.FAIR) return GAME_BALANCE.decayMultipliers.fair;
  if (health >= MOOD.POOR) return GAME_BALANCE.decayMultipliers.poor;
  return GAME_BALANCE.decayMultipliers.critical;
};

/**
 * Check if vet visit is needed
 */
export const needsVet = (health: number): 'urgent' | 'suggested' | 'none' => {
  if (health < GAME_BALANCE.thresholds.healthForVetUrgent) return 'urgent';
  if (health < GAME_BALANCE.thresholds.healthForVetSuggested) return 'suggested';
  return 'none';
};

/**
 * Check if pet can perform activity (not too tired)
 */
export const canPerformActivity = (pet: Pet, activityName: string): boolean => {
  // Sleep is always allowed when energy is low
  if (activityName === 'sleep') {
    return pet.energy < GAME_BALANCE.thresholds.energyForSleep;
  }

  // Other activities blocked if energy critical
  if (pet.energy < GAME_BALANCE.thresholds.energyForActivities) {
    return false;
  }

  return true;
};

/**
 * Check if any stat is in warning state
 */
export const hasWarningStats = (pet: Pet): boolean => {
  const threshold = GAME_BALANCE.thresholds.statWarning;
  return (
    pet.hunger < threshold ||
    pet.hygiene < threshold ||
    pet.energy < threshold ||
    pet.happiness < threshold ||
    pet.health < threshold
  );
};

/**
 * Check if any stat is in critical state
 */
export const hasCriticalStats = (pet: Pet): boolean => {
  const threshold = GAME_BALANCE.thresholds.statCritical;
  return (
    pet.hunger < threshold ||
    pet.hygiene < threshold ||
    pet.energy < threshold ||
    pet.happiness < threshold ||
    pet.health < threshold
  );
};

/**
 * Get the most urgent need for the pet
 */
export const getMostUrgentNeed = (
  pet: Pet
): 'hunger' | 'hygiene' | 'energy' | 'happiness' | 'health' | 'none' => {
  const stats = [
    { name: 'hunger' as const, value: pet.hunger },
    { name: 'hygiene' as const, value: pet.hygiene },
    { name: 'energy' as const, value: pet.energy },
    { name: 'happiness' as const, value: pet.happiness },
    { name: 'health' as const, value: pet.health },
  ];

  // Find the lowest stat
  const lowestStat = stats.reduce((lowest, current) =>
    current.value < lowest.value ? current : lowest
  );

  // Only return if it's below warning threshold
  if (lowestStat.value < GAME_BALANCE.thresholds.statWarning) {
    return lowestStat.name;
  }

  return 'none';
};

/**
 * Calculate happiness change based on current conditions
 */
export const calculateHappinessChange = (pet: Pet, minutesPassed: number): number => {
  const { HAPPINESS } = STAT_THRESHOLDS;
  let happinessChange = 0;

  // Happiness gain if all stats high
  if (
    pet.hunger > HAPPINESS.HEALTHY_STAT &&
    pet.hygiene > HAPPINESS.HEALTHY_STAT &&
    pet.energy > HAPPINESS.HEALTHY_STAT
  ) {
    happinessChange += GAME_BALANCE.decay.happinessHealthy * minutesPassed;
  }

  // Happiness loss based on health
  if (pet.health < HAPPINESS.VERY_UNHEALTHY_HEALTH) {
    happinessChange -= GAME_BALANCE.decay.happinessVeryUnhealthy * minutesPassed;
  } else if (pet.health < HAPPINESS.UNHEALTHY_HEALTH) {
    happinessChange -= GAME_BALANCE.decay.happinessUnhealthy * minutesPassed;
  }

  return happinessChange;
};

/**
 * Validate whether an action can be performed and provide feedback
 *
 * This function checks all conditions for an action and returns both
 * whether it can be performed and a localized reason if it cannot.
 *
 * @param pet - The pet to validate
 * @param actionType - The type of action to perform
 * @returns ValidationResult with canPerform flag and optional reason key
 *
 * @example
 * ```ts
 * const result = validateAction(pet, 'feed');
 * if (!result.canPerform) {
 *   showToast(t(result.reason, { name: pet.name }), 'info');
 * }
 * ```
 */
export const validateAction = (pet: Pet, actionType: ActionType): ValidationResult => {
  // Energy check for most actions (except sleep and cuddle)
  if (['feed', 'play', 'bathe', 'exercise'].includes(actionType)) {
    if (!canPerformActivity(pet, actionType)) {
      return {
        canPerform: false,
        reason: `${actionType}.needsRest`, // e.g., "feed.needsRest"
      };
    }
  }

  // Action-specific validations
  switch (actionType) {
    case 'feed':
      if (pet.hunger >= 100) {
        return { canPerform: false, reason: 'feed.notHungry' };
      }
      break;

    case 'bathe':
      if (pet.hygiene >= 100) {
        return { canPerform: false, reason: 'bathe.alreadyClean' };
      }
      break;

    case 'sleep':
      if (pet.energy >= GAME_BALANCE.thresholds.energyForSleep) {
        return { canPerform: false, reason: 'sleep.notTired' };
      }
      break;

    case 'vet':
      // Vet validation is handled separately in visitVet() for money check
      // Health check: only allow if health is below suggested threshold
      if (pet.health >= GAME_BALANCE.thresholds.healthForVetSuggested) {
        return { canPerform: false, reason: 'vet.notNeeded' };
      }
      break;

    case 'play':
    case 'exercise':
    case 'cuddle':
      // No additional validations beyond energy check
      break;
  }

  return { canPerform: true };
};
