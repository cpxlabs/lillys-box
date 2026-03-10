import express from 'express';
import { Server } from 'socket.io';
import { verifyGoogleToken } from './auth';
import { roomManager } from './roomManager';
import { registerLobbyHandlers } from './handlers/lobby';
import { registerGameHandlers } from './handlers/game';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SocketData {
  userId: string;
  displayName: string;
}

const app = express();
const PORT = (() => {
  const raw = process.env.PORT;
  if (!raw) return 3000;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`Invalid PORT value: "${raw}"`);
  }
  return parsed;
})();

// ── health check (liveness probe for cloud hosting) ──────────────
app.get('/health', (_req, res) => res.sendStatus(200));

// ── HTTP server ───────────────────────────────────────────────────
const httpServer = app.listen(PORT, () => {
  console.log(`Muito game server listening on port ${PORT}`);
});

httpServer.on('error', (err) => {
  console.error('Failed to start Muito game server:', err.message);
  process.exit(1);
});

// ── Socket.IO CORS ───────────────────────────────────────────────
// Use the same ALLOWED_ORIGINS strategy as the Fastify HTTP server.
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : [];
const hasAllowlist = allowedOrigins.length > 0;

const corsOrigin = (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
  if (hasAllowlist) {
    callback(null, allowedOrigins.includes(origin));
  } else if (isProduction) {
    callback(new Error('Not allowed by CORS'), false);
  } else {
    callback(null, true);
  }
};

// ── Socket.IO ─────────────────────────────────────────────────────
const io = new Server<Record<string, never>, Record<string, never>, Record<string, never>, SocketData>(httpServer, {
  cors: { origin: corsOrigin },
});

io.use(async (socket, next) => {
  const auth = (socket.handshake.auth || {}) as Record<string, unknown>;
  const token = auth.token as string | undefined;
  const userId = auth.userId as string | undefined;
  const displayName = auth.displayName as string | undefined;

  if (userId && displayName) {
    socket.data.userId = userId;
    socket.data.displayName = displayName;
    return next();
  }

  if (token) {
    try {
      const userData = await verifyGoogleToken(token);
      socket.data.userId = userData.sub;
      socket.data.displayName = userData.name || 'Player';
      return next();
    } catch {
      return next(new Error('Invalid auth token'));
    }
  }

  next(new Error('Authentication required'));
});

io.on('connection', (socket) => {
  const userId = socket.data.userId;
  const displayName = socket.data.displayName;

  console.log(`[connect] ${displayName} (${userId}) → ${socket.id}`);

  registerLobbyHandlers(io, socket, userId, displayName);
  registerGameHandlers(io, socket, userId);

  socket.on('disconnect', () => {
    console.log(`[disconnect] ${userId} → ${socket.id}`);
    roomManager.handleDisconnect(io, socket.id);
  });
});
