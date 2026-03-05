import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

export function buildServer() {
  const server = Fastify({
    logger: false,
  });

  // ---------------------------------------------------------------------------
  // Plugins
  // ---------------------------------------------------------------------------
  // CORS – use an explicit allowlist in production; reflect origin in development only.
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : null;

  server.register(cors, {
    origin: (origin, cb) => {
      // Always allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return cb(null, true);
      // In development (no explicit allowlist configured) reflect the origin
      if (!allowedOrigins) return cb(null, true);
      // In production, only allow listed origins
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });

  // Rate limiting – protect all routes from excessive requests.
  server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // ---------------------------------------------------------------------------
  // Health check
  // ---------------------------------------------------------------------------
  server.get('/health', async () => {
    return { status: 'ok' };
  });

  return server;
}
