import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

export function buildServer() {
  const server = Fastify({
    logger: process.env.NODE_ENV !== 'test',
  });

  // ---------------------------------------------------------------------------
  // Plugins
  // ---------------------------------------------------------------------------
  // CORS – use an explicit allowlist in production; reflect origin in development only.
  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : [];
  const hasAllowlist = allowedOrigins.length > 0;
  const isProduction = process.env.NODE_ENV === 'production';

  server.register(cors, {
    origin: (origin, cb) => {
      // Always allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return cb(null, true);
      // Always enforce allowlist when configured
      if (hasAllowlist && allowedOrigins.includes(origin)) return cb(null, true);
      if (hasAllowlist) return cb(new Error('Not allowed by CORS'), false);
      // In production with no allowlist, block cross-origin browser requests by default
      if (isProduction) return cb(new Error('Not allowed by CORS'), false);
      // In non-production with no explicit allowlist configured, reflect the origin
      return cb(null, true);
      // In development/test (no explicit allowlist configured) reflect the origin
      if (!isProduction && allowedOrigins.length === 0) return cb(null, true);
      // In production, require explicit allowlist
      if (isProduction && allowedOrigins.length === 0) {
        return cb(new Error('CORS allowlist is required in production'), false);
      }
      // Only allow listed origins
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
