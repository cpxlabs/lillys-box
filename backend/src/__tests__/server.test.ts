import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildServer } from '../buildServer.js';

describe('Backend – health endpoint', () => {
  let server: FastifyInstance;

  beforeEach(() => {
    server = buildServer();
  });

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
  let server: FastifyInstance;
  const originalNodeEnv = process.env.NODE_ENV;
  const originalAllowedOrigins = process.env.ALLOWED_ORIGINS;

  beforeEach(() => {
    server = buildServer();
  });

  afterEach(async () => {
    process.env.NODE_ENV = originalNodeEnv;
    if (originalAllowedOrigins === undefined) {
      delete process.env.ALLOWED_ORIGINS;
    } else {
      process.env.ALLOWED_ORIGINS = originalAllowedOrigins;
    }
    await server.close();
  });

  it('allows requests with no origin (mobile apps)', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health',
    });
    expect(response.statusCode).toBe(200);
  });

  it('reflects origin when ALLOWED_ORIGINS is not set', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.ALLOWED_ORIGINS;
    await server.close();
    server = buildServer();
    process.env.NODE_ENV = 'test';
    const response = await server.inject({
      method: 'GET',
      url: '/health',
      headers: { origin: 'http://localhost:3000' },
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  it('blocks cross-origin requests in production when ALLOWED_ORIGINS is not set', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.ALLOWED_ORIGINS;
    await server.close();
    server = buildServer();
    const response = await server.inject({
      method: 'GET',
      url: '/health',
      headers: { origin: 'https://attacker.com' },
    });
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('blocks disallowed origins when ALLOWED_ORIGINS is set', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ALLOWED_ORIGINS = 'https://example.com';
    await server.close();
    server = buildServer(); // rebuild with new env var
    const response = await server.inject({
      method: 'GET',
      url: '/health',
      headers: { origin: 'https://attacker.com' },
    });
    delete process.env.ALLOWED_ORIGINS;
    // CORS plugin rejects unlisted origins; the origin header must NOT be echoed back
    expect(response.statusCode).toBe(500);
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('blocks origins in production when ALLOWED_ORIGINS is not set', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.ALLOWED_ORIGINS;
    await server.close();
    server = buildServer();
    const response = await server.inject({
      method: 'GET',
      url: '/health',
      headers: { origin: 'https://example.com' },
    });
    expect(response.statusCode).toBe(500);
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('allows listed origins when ALLOWED_ORIGINS is set', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ALLOWED_ORIGINS = 'https://example.com';
    await server.close();
    server = buildServer(); // rebuild with new env var
    const response = await server.inject({
      method: 'GET',
      url: '/health',
      headers: { origin: 'https://example.com' },
    });
    delete process.env.ALLOWED_ORIGINS;
    expect(response.statusCode).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('https://example.com');
  });
});
