import { EMOJIS } from './constants';

export interface Puzzle {
  emoji: string;
  count: number;
  options: number[];
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generatePuzzle(round: number): Puzzle {
  const minCount = round < 4 ? 2 : round < 8 ? 3 : 4;
  const maxCount = round < 4 ? 4 : round < 8 ? 6 : 9;
  const count = minCount + Math.floor(Math.random() * (maxCount - minCount + 1));
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  const pool: number[] = [];
  for (let i = Math.max(1, count - 3); i <= count + 3; i++) {
    if (i !== count) pool.push(i);
  }

  const shuffledPool = shuffle(pool);
  const options = shuffle([count, ...shuffledPool.slice(0, 3)]);

  return { emoji, count, options };
}
