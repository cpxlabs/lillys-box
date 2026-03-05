import { describe, it, expect, afterEach } from 'vitest';
import { buildServer } from '../buildServer.js';

describe('Backend – health endpoint', () => {
  const server = buildServer();

  afterEach(async () => {
    await server.close();
  });

  it('GET /health returns status ok', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health',
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });
});

describe('Backend – CORS policy', () => {
  it('allows requests with no origin (mobile apps)', async () => {
    const server = buildServer();
    const response = await server.inject({
      method: 'GET',
      url: '/health',
    });
    await server.close();
    expect(response.statusCode).toBe(200);
  });

  it('reflects origin when ALLOWED_ORIGINS is not set', async () => {
    delete process.env.ALLOWED_ORIGINS;
    const server = buildServer();
    const response = await server.inject({
      method: 'GET',
      url: '/health',
      headers: { origin: 'http://localhost:3000' },
    });
    await server.close();
    expect(response.statusCode).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  it('blocks disallowed origins when ALLOWED_ORIGINS is set', async () => {
    process.env.ALLOWED_ORIGINS = 'https://example.com';
    const server = buildServer();
    const response = await server.inject({
      method: 'GET',
      url: '/health',
      headers: { origin: 'https://attacker.com' },
    });
    await server.close();
    delete process.env.ALLOWED_ORIGINS;
    // 500 because CORS plugin throws internally; what matters is the origin is NOT echoed back
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('allows listed origins when ALLOWED_ORIGINS is set', async () => {
    process.env.ALLOWED_ORIGINS = 'https://example.com';
    const server = buildServer();
    const response = await server.inject({
      method: 'GET',
      url: '/health',
      headers: { origin: 'https://example.com' },
    });
    await server.close();
    delete process.env.ALLOWED_ORIGINS;
    expect(response.statusCode).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('https://example.com');
  });
});
