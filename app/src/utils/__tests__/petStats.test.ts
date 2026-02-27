import {
  calculateHealth,
  getPetMood,
  getEnergyDecayRate,
  getEnergyMultiplier,
  canPerformActivity,
  calculateHappinessChange,
  getStatLevel,
  needsVet,
  hasWarningStats,
  hasCriticalStats,
  getMostUrgentNeed,
} from '../petStats';
import { Pet } from '../../types';
import { GAME_BALANCE } from '../../config/gameBalance';

describe('petStats', () => {
  describe('calculateHealth', () => {
    it('should calculate health correctly for all stats at 100', () => {
      const pet = {
        hunger: 100,
        hygiene: 100,
        energy: 100,
        happiness: 100,
      };
      const health = calculateHealth(pet);
      expect(health).toBe(100);
    });

    it('should calculate health correctly for all stats at 50', () => {
      const pet = {
        hunger: 50,
        hygiene: 50,
        energy: 50,
        happiness: 50,
      };
      const health = calculateHealth(pet);
      expect(health).toBeGreaterThan(0);
      expect(health).toBeLessThan(100);
    });

    it('should apply penalty multiplier when any stat is below 10', () => {
      const pet1 = {
        hunger: 5,
        hygiene: 100,
        energy: 100,
        happiness: 100,
      };
      const pet2 = {
        hunger: 50,
        hygiene: 100,
        energy: 100,
        happiness: 100,
      };

      const health1 = calculateHealth(pet1);
      const health2 = calculateHealth(pet2);

      expect(health1).toBeLessThan(health2);
    });

    it('should handle edge case of all stats at 0', () => {
      const pet = {
        hunger: 0,
        hygiene: 0,
        energy: 0,
        happiness: 0,
      };
      const health = calculateHealth(pet);
      expect(health).toBe(0);
    });

    it('should not exceed 100 health', () => {
      const pet = {
        hunger: 100,
        hygiene: 100,
        energy: 100,
        happiness: 100,
      };
      const health = calculateHealth(pet);
      expect(health).toBeLessThanOrEqual(100);
    });
  });

  describe('getPetMood', () => {
    it('should return excellent for health >= 80', () => {
      expect(getPetMood(100)).toBe('excellent');
      expect(getPetMood(80)).toBe('excellent');
    });

    it('should return good for health 60-79', () => {
      expect(getPetMood(79)).toBe('good');
      expect(getPetMood(60)).toBe('good');
    });

    it('should return fair for health 40-59', () => {
      expect(getPetMood(59)).toBe('fair');
      expect(getPetMood(40)).toBe('fair');
    });

    it('should return poor for health 20-39', () => {
      expect(getPetMood(39)).toBe('poor');
      expect(getPetMood(20)).toBe('poor');
    });

    it('should return critical for health < 20', () => {
      expect(getPetMood(19)).toBe('critical');
      expect(getPetMood(0)).toBe('critical');
    });
  });

  describe('getStatLevel', () => {
    it('should return high level for values >= 70', () => {
      const result = getStatLevel(100);
      expect(result.level).toBe('high');
      expect(result.color).toBe('#4CAF50');
    });

    it('should return medium level for values 40-69', () => {
      const result = getStatLevel(50);
      expect(result.level).toBe('medium');
      expect(result.color).toBe('#FFA726');
    });

    it('should return low level for values 20-39', () => {
      const result = getStatLevel(30);
      expect(result.level).toBe('low');
      expect(result.color).toBe('#EF5350');
    });

    it('should return critical level for values < 20', () => {
      const result = getStatLevel(10);
      expect(result.level).toBe('critical');
      expect(result.color).toBe('#C62828');
    });
  });

  describe('getEnergyDecayRate', () => {
    it('should return day rate during daytime hours', () => {
      // Mock date to 12:00 PM
      jest.spyOn(Date.prototype, 'getHours').mockReturnValue(12);
      expect(getEnergyDecayRate()).toBe(GAME_BALANCE.decay.energyDay);
    });

    it('should return night rate during nighttime hours', () => {
      // Mock date to 11:00 PM
      jest.spyOn(Date.prototype, 'getHours').mockReturnValue(23);
      expect(getEnergyDecayRate()).toBe(GAME_BALANCE.decay.energyNight);
    });

    it('should return night rate during early morning hours', () => {
      // Mock date to 3:00 AM
      jest.spyOn(Date.prototype, 'getHours').mockReturnValue(3);
      expect(getEnergyDecayRate()).toBe(GAME_BALANCE.decay.energyNight);
    });
  });

  describe('getEnergyMultiplier', () => {
    it('should return high multiplier for energy >= 70', () => {
      expect(getEnergyMultiplier(100)).toBe(GAME_BALANCE.energyMultipliers.high);
      expect(getEnergyMultiplier(70)).toBe(GAME_BALANCE.energyMultipliers.high);
    });

    it('should return medium multiplier for energy 40-69', () => {
      expect(getEnergyMultiplier(69)).toBe(GAME_BALANCE.energyMultipliers.medium);
      expect(getEnergyMultiplier(40)).toBe(GAME_BALANCE.energyMultipliers.medium);
    });

    it('should return low multiplier for energy 20-39', () => {
      expect(getEnergyMultiplier(39)).toBe(GAME_BALANCE.energyMultipliers.low);
      expect(getEnergyMultiplier(20)).toBe(GAME_BALANCE.energyMultipliers.low);
    });

    it('should return critical multiplier for energy < 20', () => {
      expect(getEnergyMultiplier(19)).toBe(GAME_BALANCE.energyMultipliers.critical);
      expect(getEnergyMultiplier(0)).toBe(GAME_BALANCE.energyMultipliers.critical);
    });
  });

  describe('canPerformActivity', () => {
    const createMockPet = (energy: number): Pet => ({
      id: '1',
      name: 'Test',
      type: 'cat',
      color: 'base',
      gender: 'other',
      hunger: 50,
      hygiene: 50,
      energy,
      happiness: 50,
      health: 50,
      money: 0,
      clothes: { head: null, eyes: null, torso: null, paws: null },
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    });

    it('should allow sleep when energy < 80', () => {
      const pet = createMockPet(70);
      expect(canPerformActivity(pet, 'sleep')).toBe(true);
    });

    it('should not allow sleep when energy >= 80', () => {
      const pet = createMockPet(80);
      expect(canPerformActivity(pet, 'sleep')).toBe(false);
    });

    it('should not allow activities when energy < 20', () => {
      const pet = createMockPet(15);
      expect(canPerformActivity(pet, 'feed')).toBe(false);
      expect(canPerformActivity(pet, 'play')).toBe(false);
      expect(canPerformActivity(pet, 'bathe')).toBe(false);
    });

    it('should allow activities when energy >= 20', () => {
      const pet = createMockPet(20);
      expect(canPerformActivity(pet, 'feed')).toBe(true);
      expect(canPerformActivity(pet, 'play')).toBe(true);
      expect(canPerformActivity(pet, 'bathe')).toBe(true);
    });
  });

  describe('needsVet', () => {
    it('should return urgent for very low health', () => {
      expect(needsVet(20)).toBe('urgent');
    });

    it('should return suggested for moderately low health', () => {
      expect(needsVet(45)).toBe('suggested');
    });

    it('should return none for good health', () => {
      expect(needsVet(70)).toBe('none');
    });
  });

  describe('hasWarningStats', () => {
    const createMockPet = (stats: Partial<Pet>): Pet => ({
      id: '1',
      name: 'Test',
      type: 'cat',
      color: 'base',
      gender: 'other',
      hunger: 50,
      hygiene: 50,
      energy: 50,
      happiness: 50,
      health: 50,
      money: 0,
      clothes: { head: null, eyes: null, torso: null, paws: null },
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      ...stats,
    });

    it('should return true when hunger is below warning threshold', () => {
      const pet = createMockPet({ hunger: 20 }); // Below threshold of 25
      expect(hasWarningStats(pet)).toBe(true);
    });

    it('should return false when all stats are above warning threshold', () => {
      const pet = createMockPet({ hunger: 50, hygiene: 50, energy: 50, happiness: 50, health: 50 });
      expect(hasWarningStats(pet)).toBe(false);
    });
  });

  describe('hasCriticalStats', () => {
    const createMockPet = (stats: Partial<Pet>): Pet => ({
      id: '1',
      name: 'Test',
      type: 'cat',
      color: 'base',
      gender: 'other',
      hunger: 50,
      hygiene: 50,
      energy: 50,
      happiness: 50,
      health: 50,
      money: 0,
      clothes: { head: null, eyes: null, torso: null, paws: null },
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      ...stats,
    });

    it('should return true when any stat is below critical threshold', () => {
      const pet = createMockPet({ hunger: 5 }); // Below threshold of 10
      expect(hasCriticalStats(pet)).toBe(true);
    });

    it('should return false when all stats are above critical threshold', () => {
      const pet = createMockPet({ hunger: 50, hygiene: 50, energy: 50, happiness: 50, health: 50 });
      expect(hasCriticalStats(pet)).toBe(false);
    });
  });

  describe('getMostUrgentNeed', () => {
    const createMockPet = (stats: Partial<Pet>): Pet => ({
      id: '1',
      name: 'Test',
      type: 'cat',
      color: 'base',
      gender: 'other',
      hunger: 50,
      hygiene: 50,
      energy: 50,
      happiness: 50,
      health: 50,
      money: 0,
      clothes: { head: null, eyes: null, torso: null, paws: null },
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      ...stats,
    });

    it('should return hunger when it is the lowest stat below threshold', () => {
      const pet = createMockPet({ hunger: 20, hygiene: 50, energy: 50, happiness: 50, health: 50 }); // hunger below 25
      expect(getMostUrgentNeed(pet)).toBe('hunger');
    });

    it('should return none when all stats are above warning threshold', () => {
      const pet = createMockPet({ hunger: 50, hygiene: 50, energy: 50, happiness: 50, health: 50 });
      expect(getMostUrgentNeed(pet)).toBe('none');
    });
  });

  describe('calculateHappinessChange', () => {
    const createMockPet = (
      hunger: number,
      hygiene: number,
      energy: number,
      health: number
    ): Pet => ({
      id: '1',
      name: 'Test',
      type: 'cat',
      color: 'base',
      gender: 'other',
      hunger,
      hygiene,
      energy,
      happiness: 50,
      health,
      money: 0,
      clothes: { head: null, eyes: null, torso: null, paws: null },
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    });

    it('should increase happiness when all stats are high', () => {
      const pet = createMockPet(80, 80, 80, 80);
      const change = calculateHappinessChange(pet, 1);
      expect(change).toBeGreaterThan(0);
    });

    it('should decrease happiness when health is very low', () => {
      const pet = createMockPet(50, 50, 50, 30);
      const change = calculateHappinessChange(pet, 1);
      expect(change).toBeLessThan(0);
    });

    it('should scale with time passed', () => {
      const pet = createMockPet(80, 80, 80, 80);
      const change1 = calculateHappinessChange(pet, 1);
      const change2 = calculateHappinessChange(pet, 2);
      expect(change2).toBeCloseTo(change1 * 2, 1);
    });

    it('should return 0 when stats are moderate', () => {
      const pet = createMockPet(50, 50, 50, 70);
      const change = calculateHappinessChange(pet, 1);
      expect(change).toBe(0);
    });
  });
});
