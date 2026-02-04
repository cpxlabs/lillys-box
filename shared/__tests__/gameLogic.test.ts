import { generatePuzzle } from '../src/gameLogic';
import { EMOJIS } from '../src/constants';

describe('generatePuzzle', () => {
  // ── structure ───────────────────────────────────────────────────────

  it('returns exactly 4 options', () => {
    for (let i = 0; i < 50; i++) {
      expect(generatePuzzle(i + 1).options).toHaveLength(4);
    }
  });

  it('includes the correct answer among the options', () => {
    for (let i = 0; i < 50; i++) {
      const { count, options } = generatePuzzle(i + 1);
      expect(options).toContain(count);
    }
  });

  it('returns an emoji from the shared pool', () => {
    for (let i = 0; i < 50; i++) {
      expect(EMOJIS).toContain(generatePuzzle(i + 1).emoji);
    }
  });

  it('all options are unique', () => {
    for (let i = 0; i < 50; i++) {
      const { options } = generatePuzzle(i + 1);
      expect(new Set(options).size).toBe(options.length);
    }
  });

  // ── difficulty tiers ─────────────────────────────────────────────────

  it('count is in [2, 4] for rounds 1-3', () => {
    for (let round = 1; round <= 3; round++) {
      for (let trial = 0; trial < 30; trial++) {
        const { count } = generatePuzzle(round);
        expect(count).toBeGreaterThanOrEqual(2);
        expect(count).toBeLessThanOrEqual(4);
      }
    }
  });

  it('count is in [3, 6] for rounds 4-7', () => {
    for (let round = 4; round <= 7; round++) {
      for (let trial = 0; trial < 30; trial++) {
        const { count } = generatePuzzle(round);
        expect(count).toBeGreaterThanOrEqual(3);
        expect(count).toBeLessThanOrEqual(6);
      }
    }
  });

  it('count is in [4, 9] for rounds 8+', () => {
    for (let round = 8; round <= 15; round++) {
      for (let trial = 0; trial < 30; trial++) {
        const { count } = generatePuzzle(round);
        expect(count).toBeGreaterThanOrEqual(4);
        expect(count).toBeLessThanOrEqual(9);
      }
    }
  });

  // ── deterministic with seeded random ──────────────────────────────────

  it('produces the same puzzle when Math.random is constant', () => {
    const original = Math.random;
    Math.random = () => 0;

    const a = generatePuzzle(1);
    const b = generatePuzzle(1);

    expect(a).toEqual(b);

    Math.random = original;
  });
});
