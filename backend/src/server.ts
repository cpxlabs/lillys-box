import Fastify from 'fastify';
import cors from '@fastify/cors';

const server = Fastify({
  logger: true,
});

// ---------------------------------------------------------------------------
// Plugins
// ---------------------------------------------------------------------------
// CORS – origin is reflected in development; tighten to an explicit list before
// deploying to production.
server.register(cors, {
  origin: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
server.get('/health', async () => {
  return { status: 'ok' };
});

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
const PORT = Number(process.env.PORT ?? 3000);

server.listen({ port: PORT, host: '0.0.0.0' }).then((address) => {
  server.log.info(`Lilly's Box backend listening at ${address}`);
});
