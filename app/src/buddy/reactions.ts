/**
 * Buddy reactions system.
 *
 * Kid-friendly reactions to game and pet care events.
 * Personality-influenced responses based on buddy stats.
 */

import { mulberry32, hashString } from './prng';
import type { Buddy, BuddyEvent } from './types';

// ── Reaction pools by event type ─────────────────────────────────────
const REACTIONS: Record<BuddyEvent['type'], string[]> = {
  greeting: [
    'Hi hi hi! 👋',
    'You came back! 🎉',
    "Let's play! 🌟",
    'Hey friend! 💕',
    'Yay, hello! ✨',
  ],
  farewell: [
    'Bye bye! 👋',
    'See you soon! 💫',
    'Come back soon! 🌈',
    "I'll miss you! 💕",
    'Sweet dreams! 🌙',
  ],
  pet_fed: [
    'Yummy! 🍖',
    'Nom nom nom! 😋',
    'Delicious! ⭐',
    'More please! 🤤',
    'Thank you! 💕',
  ],
  pet_played: [
    'So fun! 🎮',
    'Again again! 🎉',
    'Wheee! 🌟',
    'That was awesome! ✨',
    'Best time ever! 💖',
  ],
  pet_bathed: [
    'So clean! 🛁',
    'Splish splash! 💧',
    'Sparkly clean! ✨',
    'Fresh and fluffy! 🧼',
    'Squeaky clean! 🫧',
  ],
  pet_sleeping: [
    'Shhh... 💤',
    'Sweet dreams... 🌙',
    'Night night... 😴',
    'Zzz... 💫',
    'So cozy... 🌟',
  ],
  game_start: [
    "Let's go! 🚀",
    'You got this! 💪',
    'Game time! 🎮',
    'Ready? GO! ⭐',
    'Adventure awaits! ✨',
  ],
  game_win: [
    'You did it! 🏆',
    'Amazing! 🌟',
    'Champion! 👑',
    'Incredible! 🎉',
    'So proud! 💖',
  ],
  game_lose: [
    'Try again! 💪',
    "You're learning! 📚",
    'Almost there! 🌟',
    'Next time! ✨',
    'Never give up! 💕',
  ],
  game_highscore: [
    'NEW RECORD!! 🏆',
    'AMAZING!! 🌟🌟🌟',
    "You're the best! 👑",
    'Unbelievable! 🎆',
    'LEGEND! ✨✨✨',
  ],
  idle: [
    '...💭',
    '*stretches* 🌿',
    '~♪~♫~',
    '*blinks* 👀',
    '*wiggles* 🐾',
    '*yawns* 😊',
  ],
  pet_happy: [
    'So happy! 🥰',
    'Best day! ☀️',
    'Love this! 💖',
    'Wonderful! 🌈',
    'Pure joy! ✨',
  ],
  pet_sad: [
    "It's okay... 💕",
    'Cheer up! 🌟',
    "I'm here! 🤗",
    'Hugs! 💖',
    "We'll be fine! 🌈",
  ],
  petting: [
    '❤️❤️❤️',
    'That feels nice! 💕',
    'More pets please! 🥰',
    '*purrrr* 💖',
    'So happy! ✨',
  ],
};

// ── Personality-influenced reactions ──────────────────────────────────
const KINDNESS_LINES = [
  "You're so kind! 💕",
  'That was sweet! 🌸',
  'Kindness is magic! ✨',
];
const BRAVERY_LINES = [
  "Let's be brave! 💪",
  'No fear! 🦁',
  'Adventure time! ⚡',
];
const CURIOSITY_LINES = [
  'I wonder why... 🔍',
  'How interesting! 📚',
  'Tell me more! 🌟',
];
const CREATIVITY_LINES = [
  'I have an idea! 💡',
  'So creative! 🎨',
  'Imagine that! 🌈',
];
const SILLINESS_LINES = [
  'Hehehehe! 🤪',
  '*does a silly dance* 💃',
  'Wheeeee! 🎢',
];

/**
 * Get a reaction for a buddy based on an event.
 * Deterministic: same buddy + same event timestamp = same reaction.
 */
export function getReaction(buddy: Buddy, event: BuddyEvent): string {
  const rng = mulberry32(
    hashString(
      `${buddy.name}-${event.type}-${event.timestamp ?? Date.now()}`,
    ),
  );

  // 20% chance of personality-influenced reaction
  if (rng() < 0.2) {
    const statEntries = Object.entries(buddy.stats) as [string, number][];
    const top = statEntries.sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] > 60) {
      let pool: string[] | null = null;
      switch (top[0]) {
        case 'KINDNESS':
          pool = KINDNESS_LINES;
          break;
        case 'BRAVERY':
          pool = BRAVERY_LINES;
          break;
        case 'CURIOSITY':
          pool = CURIOSITY_LINES;
          break;
        case 'CREATIVITY':
          pool = CREATIVITY_LINES;
          break;
        case 'SILLINESS':
          pool = SILLINESS_LINES;
          break;
      }
      if (pool) return pool[Math.floor(rng() * pool.length)];
    }
  }

  const lines = REACTIONS[event.type] ?? REACTIONS.idle;
  return lines[Math.floor(rng() * lines.length)];
}
