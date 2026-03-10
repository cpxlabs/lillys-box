import express from 'express';
import { Server } from 'socket.io';
import { verifyGoogleToken } from './auth';
import { roomManager } from './roomManager';
import { registerLobbyHandlers } from './handlers/lobby';
import { registerGameHandlers } from './handlers/game';

const app = express();
const PORT = process.env.PORT || 3000;

// ── health check (liveness probe for cloud hosting) ──────────────
app.get('/health', (_req, res) => res.sendStatus(200));

// ── HTTP server ───────────────────────────────────────────────────
const httpServer = app.listen(PORT, () => {
  console.log(`Muito game server listening on port ${PORT}`);
});

// ── Socket.IO ─────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

io.use(async (socket, next) => {
  const auth = (socket.handshake.auth || {}) as Record<string, unknown>;
  const token = auth.token as string | undefined;
  const userId = auth.userId as string | undefined;
  const displayName = auth.displayName as string | undefined;

  if (userId && displayName) {
    (socket as any).userId = userId;
    (socket as any).displayName = displayName;
    return next();
  }

  if (token) {
    try {
      const userData = await verifyGoogleToken(token);
      (socket as any).userId = userData.sub;
      (socket as any).displayName = userData.name || 'Player';
      return next();
    } catch {
      return next(new Error('Invalid auth token'));
    }
  }

  next(new Error('Authentication required'));
});

io.on('connection', (socket) => {
  const userId = (socket as any).userId as string;
  const displayName = (socket as any).displayName as string;

  console.log(`[connect] ${displayName} (${userId}) → ${socket.id}`);

  registerLobbyHandlers(io, socket, userId, displayName);
  registerGameHandlers(io, socket, userId);

  socket.on('disconnect', () => {
    console.log(`[disconnect] ${userId} → ${socket.id}`);
    roomManager.handleDisconnect(io, socket.id);
  });
});
