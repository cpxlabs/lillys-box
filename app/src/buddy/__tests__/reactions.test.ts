import { generateBuddy } from '../generator';
import { getReaction } from '../reactions';
import type { BuddyEvent, BuddyEventType } from '../types';

describe('Buddy Reactions', () => {
  const buddy = generateBuddy('reaction-test-buddy');

  describe('getReaction', () => {
    it('returns a non-empty string', () => {
      const event: BuddyEvent = {
        type: 'greeting',
        timestamp: 1000,
      };
      const reaction = getReaction(buddy, event);
      expect(reaction).toBeTruthy();
      expect(typeof reaction).toBe('string');
    });

    it('is deterministic for the same buddy and event', () => {
      const event: BuddyEvent = {
        type: 'game_win',
        timestamp: 12345,
      };
      const reaction1 = getReaction(buddy, event);
      const reaction2 = getReaction(buddy, event);
      expect(reaction1).toBe(reaction2);
    });

    it('produces different reactions for different event types', () => {
      const types: BuddyEventType[] = ['greeting', 'game_win', 'game_lose', 'pet_fed', 'idle'];
      const reactions = types.map((type) => getReaction(buddy, { type, timestamp: 999 }));
      // Not all reactions should be the same
      const unique = new Set(reactions);
      expect(unique.size).toBeGreaterThan(1);
    });

    it('handles all event types without errors', () => {
      const allTypes: BuddyEventType[] = [
        'greeting',
        'farewell',
        'pet_fed',
        'pet_played',
        'pet_bathed',
        'pet_sleeping',
        'game_start',
        'game_win',
        'game_lose',
        'game_highscore',
        'idle',
        'pet_happy',
        'pet_sad',
        'petting',
      ];

      for (const type of allTypes) {
        const event: BuddyEvent = { type, timestamp: Date.now() };
        const reaction = getReaction(buddy, event);
        expect(reaction).toBeTruthy();
      }
    });

    it('produces varied reactions for different timestamps', () => {
      const reactions = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const event: BuddyEvent = { type: 'idle', timestamp: i * 1000 };
        reactions.add(getReaction(buddy, event));
      }
      // Should produce at least 2 different reactions over 100 timestamps
      expect(reactions.size).toBeGreaterThan(1);
    });
  });
});
