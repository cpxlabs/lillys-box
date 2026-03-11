import { afterEach, describe, expect, it } from 'vitest';
import { createJwt, verifyJwt } from './auth';

const originalJwtSecret = process.env.JWT_SECRET;

afterEach(() => {
  if (originalJwtSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalJwtSecret;
  }
});

describe('JWT auth helpers', () => {
  it('requires JWT_SECRET to create a token', () => {
    delete process.env.JWT_SECRET;

    expect(() => createJwt('user-1', 'Player One')).toThrow(
      'JWT_SECRET environment variable is required'
    );
  });

  it('creates and verifies a token when JWT_SECRET is configured', () => {
    process.env.JWT_SECRET = 'test-secret';

    const token = createJwt('user-1', 'Player One');

    expect(verifyJwt(token)).toMatchObject({
      userId: 'user-1',
      displayName: 'Player One',
    });
  });
});
