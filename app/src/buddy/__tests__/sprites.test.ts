import { generateBones } from '../generator';
import {
  getSpeciesEmoji,
  renderFace,
  getMoodEmoji,
  getIdleFrame,
  getAccessoryEmoji,
  getFrameCount,
} from '../sprites';
import { SPECIES } from '../types';
import type { BuddyMood, Accessory } from '../types';

describe('Buddy Sprites', () => {
  describe('getSpeciesEmoji', () => {
    it('returns an emoji for every species', () => {
      for (const species of SPECIES) {
        const emoji = getSpeciesEmoji(species);
        expect(emoji).toBeTruthy();
        expect(typeof emoji).toBe('string');
      }
    });
  });

  describe('renderFace', () => {
    it('returns a face string for any buddy', () => {
      const bones = generateBones('face-test');
      const face = renderFace(bones);
      expect(face).toBeTruthy();
      expect(typeof face).toBe('string');
    });

    it('includes accessory for non-common buddies', () => {
      // Find a non-common buddy
      let found = false;
      for (let i = 0; i < 200; i++) {
        const bones = generateBones(`accessory-face-${i}`);
        if (bones.accessory !== 'none') {
          const face = renderFace(bones);
          const accessoryEmoji = getAccessoryEmoji(bones.accessory);
          expect(face).toContain(accessoryEmoji);
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });
  });

  describe('getMoodEmoji', () => {
    it('returns an emoji for every mood', () => {
      const moods: BuddyMood[] = ['happy', 'excited', 'sleepy', 'playful', 'calm'];
      for (const mood of moods) {
        const emoji = getMoodEmoji(mood);
        expect(emoji).toBeTruthy();
      }
    });
  });

  describe('getIdleFrame', () => {
    it('returns a frame for any species and index', () => {
      for (const species of SPECIES) {
        const frame = getIdleFrame(species, 0);
        expect(frame).toBeTruthy();
      }
    });

    it('wraps around when index exceeds frame count', () => {
      const frame0 = getIdleFrame('duck', 0);
      const frameWrapped = getIdleFrame('duck', getFrameCount('duck'));
      expect(frameWrapped).toBe(frame0);
    });
  });

  describe('getAccessoryEmoji', () => {
    it('returns empty string for none', () => {
      expect(getAccessoryEmoji('none')).toBe('');
    });

    it('returns non-empty for other accessories', () => {
      const accessories: Accessory[] = [
        'crown',
        'flower',
        'bow',
        'star',
        'heart',
        'ribbon',
        'sparkle',
      ];
      for (const acc of accessories) {
        expect(getAccessoryEmoji(acc)).toBeTruthy();
      }
    });
  });

  describe('getFrameCount', () => {
    it('returns a positive number for every species', () => {
      for (const species of SPECIES) {
        expect(getFrameCount(species)).toBeGreaterThan(0);
      }
    });
  });
});
