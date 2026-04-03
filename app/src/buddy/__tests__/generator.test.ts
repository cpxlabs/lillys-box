import { generateBuddy, generateBones, generateSoul } from '../generator';
import { SPECIES, RARITIES, EYES, ACCESSORIES, STAT_NAMES } from '../types';

describe('Buddy Generator', () => {
  describe('generateBones', () => {
    it('produces deterministic output for the same seed', () => {
      const bones1 = generateBones('test-user-123');
      const bones2 = generateBones('test-user-123');
      expect(bones1).toEqual(bones2);
    });

    it('produces different output for different seeds', () => {
      const bones1 = generateBones('user-alpha');
      const bones2 = generateBones('user-beta');
      // At least one field should differ (extremely unlikely all match)
      const isSame =
        bones1.species === bones2.species &&
        bones1.rarity === bones2.rarity &&
        bones1.eye === bones2.eye;
      expect(isSame).toBe(false);
    });

    it('produces valid species', () => {
      const bones = generateBones('species-test');
      expect(SPECIES).toContain(bones.species);
    });

    it('produces valid rarity', () => {
      const bones = generateBones('rarity-test');
      expect(RARITIES).toContain(bones.rarity);
    });

    it('produces valid eye', () => {
      const bones = generateBones('eye-test');
      expect(EYES).toContain(bones.eye);
    });

    it('produces valid accessory', () => {
      const bones = generateBones('accessory-test');
      expect(ACCESSORIES).toContain(bones.accessory);
    });

    it('sets accessory to none for common rarity', () => {
      // Generate many buddies and check common ones have no accessory
      let foundCommon = false;
      for (let i = 0; i < 200; i++) {
        const bones = generateBones(`common-check-${i}`);
        if (bones.rarity === 'common') {
          expect(bones.accessory).toBe('none');
          foundCommon = true;
        }
      }
      expect(foundCommon).toBe(true);
    });

    it('produces sparkle field as boolean', () => {
      const bones = generateBones('sparkle-test');
      expect(typeof bones.sparkle).toBe('boolean');
    });

    it('produces all stat names', () => {
      const bones = generateBones('stats-test');
      for (const name of STAT_NAMES) {
        expect(bones.stats[name]).toBeDefined();
        expect(bones.stats[name]).toBeGreaterThanOrEqual(0);
        expect(bones.stats[name]).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('generateSoul', () => {
    it('produces deterministic output for the same seed', () => {
      const soul1 = generateSoul('soul-test');
      const soul2 = generateSoul('soul-test');
      expect(soul1).toEqual(soul2);
    });

    it('produces a name and personality', () => {
      const soul = generateSoul('soul-check');
      expect(soul.name).toBeTruthy();
      expect(soul.personality).toBeTruthy();
      expect(typeof soul.name).toBe('string');
      expect(typeof soul.personality).toBe('string');
    });
  });

  describe('generateBuddy', () => {
    it('combines bones and soul', () => {
      const buddy = generateBuddy('full-buddy');
      // Has bones
      expect(buddy.species).toBeTruthy();
      expect(buddy.rarity).toBeTruthy();
      expect(buddy.stats).toBeTruthy();
      // Has soul
      expect(buddy.name).toBeTruthy();
      expect(buddy.personality).toBeTruthy();
    });

    it('accepts custom soul', () => {
      const customSoul = {
        name: 'TestBuddy',
        personality: 'very testy',
      };
      const buddy = generateBuddy('custom-soul', customSoul);
      expect(buddy.name).toBe('TestBuddy');
      expect(buddy.personality).toBe('very testy');
    });

    it('is fully deterministic', () => {
      const buddy1 = generateBuddy('deterministic-check');
      const buddy2 = generateBuddy('deterministic-check');
      expect(buddy1).toEqual(buddy2);
    });
  });

  describe('rarity distribution', () => {
    it('produces a reasonable distribution over many seeds', () => {
      const counts: Record<string, number> = {};
      const total = 1000;

      for (let i = 0; i < total; i++) {
        const bones = generateBones(`dist-test-${i}`);
        counts[bones.rarity] = (counts[bones.rarity] || 0) + 1;
      }

      // Common should be the most frequent (55% weight)
      expect(counts['common']).toBeGreaterThan(total * 0.3);
      // Legendary should be rare (2% weight)
      expect(counts['legendary'] || 0).toBeLessThan(total * 0.1);
    });
  });
});
