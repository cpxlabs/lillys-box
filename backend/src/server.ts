import { buildServer } from './buildServer.js';

const server = buildServer();

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
const rawPort = process.env.PORT;
const PORT = rawPort !== undefined ? Number(rawPort) : 3000;
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error(`Invalid PORT value: "${rawPort}"`);
  process.exit(1);
}

server.listen({ port: PORT, host: '0.0.0.0' }).then((address) => {
  server.log.info(`Lilly's Box backend listening at ${address}`);
}).catch((err: unknown) => {
  server.log.error(err, 'Failed to start server');
  process.exit(1);
});
