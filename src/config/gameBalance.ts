/**
 * Game Balance Configuration
 * All numerical values for stat decay, activity effects, and thresholds
 * Adjust these values to tune gameplay without code changes
 */

export const GAME_BALANCE = {
  // Stat decay rates (per minute)
  decay: {
    hunger: -1.0,
    hygiene: -1.0,
    energyDay: -0.5, // 6 AM - 10 PM
    energyNight: -0.2, // 10 PM - 6 AM
    happinessHealthy: 0.5, // Gain when all stats > 70
    happinessUnhealthy: -0.3, // Loss when health < 60
    happinessVeryUnhealthy: -0.5, // Loss when health < 40
  },

  // Activity effects
  activities: {
    feed: {
      hunger: 25,
      energy: 5,
      happiness: 3,
      hygiene: -2,
    },
    bathe: {
      hygiene: 35,
      hunger: -10,
      energy: -8,
      happiness: 5,
    },
    play: {
      happiness: 20,
      hunger: -15,
      hygiene: -15,
      energy: -25,
      money: 5,
    },
    sleep: {
      energy: 40,
      happiness: 10,
      hunger: -5,
      duration: 30000, // 30 seconds in milliseconds
    },
    exercise: {
      happiness: 15,
      hunger: -20,
      hygiene: -10,
      energy: -30,
      money: 10,
    },
    petCuddle: {
      happiness: 10,
      energy: -3,
    },
    vet: {
      cost: 50,
      healthTarget: 70, // Set health to minimum of 70
      energy: -10,
      happiness: -5,
      statBoost: 10, // Boost to other stats
    },
  },

  // Stat thresholds
  thresholds: {
    energyForSleep: 80, // Can only sleep if energy < 80
    energyForActivities: 20, // Activities blocked if energy < 20
    healthForVetUrgent: 40,
    healthForVetSuggested: 60,
    statWarning: 25, // Show warning if any stat < 25
    statCritical: 10, // Critical state if any stat < 10
  },

  // Energy multipliers (affect activity gains)
  energyMultipliers: {
    high: 1.0, // 70-100 energy
    medium: 0.5, // 40-69 energy
    low: 0.25, // 20-39 energy
    critical: 0, // 0-19 energy (activities blocked)
  },

  // Health-based decay multipliers
  decayMultipliers: {
    excellent: 1.0, // 80-100 health
    good: 1.0, // 60-79 health
    fair: 1.2, // 40-59 health
    poor: 1.5, // 20-39 health
    critical: 2.0, // 0-19 health
  },

  // Health calculation weights
  healthWeights: {
    hunger: 0.25,
    hygiene: 0.20,
    energy: 0.25,
    happiness: 0.30,
  },

  // Health status multipliers
  healthStatusMultipliers: {
    allStatsAbove50: 1.0,
    anyStatBelow50: 0.9,
    anyStatBelow25: 0.75,
    anyStatBelow10: 0.5,
  },

  // Time constants
  time: {
    dayStartHour: 6, // 6 AM
    nightStartHour: 22, // 10 PM
    updateInterval: 60000, // 1 minute in milliseconds
  },

  // Initial stat values for new pets
  initialStats: {
    hunger: 100,
    hygiene: 100,
    energy: 80,
    happiness: 75,
    health: 85,
    money: 0,
  },
};
