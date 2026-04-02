import { mulberry32, hashString, pick } from '../prng';

describe('PRNG utilities', () => {
  describe('mulberry32', () => {
    it('produces deterministic output for the same seed', () => {
      const rng1 = mulberry32(42);
      const rng2 = mulberry32(42);
      const values1 = Array.from({ length: 10 }, () => rng1());
      const values2 = Array.from({ length: 10 }, () => rng2());
      expect(values1).toEqual(values2);
    });

    it('produces different output for different seeds', () => {
      const rng1 = mulberry32(42);
      const rng2 = mulberry32(99);
      const val1 = rng1();
      const val2 = rng2();
      expect(val1).not.toEqual(val2);
    });

    it('produces numbers between 0 and 1', () => {
      const rng = mulberry32(12345);
      for (let i = 0; i < 1000; i++) {
        const val = rng();
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
      }
    });
  });

  describe('hashString', () => {
    it('produces consistent hashes', () => {
      expect(hashString('hello')).toBe(hashString('hello'));
    });

    it('produces different hashes for different strings', () => {
      expect(hashString('hello')).not.toBe(hashString('world'));
    });

    it('returns a positive integer', () => {
      const hash = hashString('test');
      expect(hash).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(hash)).toBe(true);
    });
  });

  describe('pick', () => {
    it('picks an element from the array', () => {
      const rng = mulberry32(42);
      const arr = ['a', 'b', 'c', 'd'] as const;
      const result = pick(rng, arr);
      expect(arr).toContain(result);
    });

    it('picks deterministically for the same seed', () => {
      const arr = ['a', 'b', 'c', 'd', 'e'] as const;
      const rng1 = mulberry32(42);
      const rng2 = mulberry32(42);
      expect(pick(rng1, arr)).toBe(pick(rng2, arr));
    });
  });
});
