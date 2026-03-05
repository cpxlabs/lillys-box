import { buildServer } from './buildServer.js';

const server = buildServer();

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
const PORT = Number(process.env.PORT ?? 3000);

server.listen({ port: PORT, host: '0.0.0.0' }).then((address) => {
  server.log.info(`Lilly's Box backend listening at ${address}`);
});
