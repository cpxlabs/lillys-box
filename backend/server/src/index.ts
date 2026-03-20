import express from 'express';
import { Server } from 'socket.io';
import { verifyGoogleToken, verifyJwt } from './auth';
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

// ── Socket.IO CORS ────────────────────────────────────────────────
const allowedOrigins = process.env.MUITO_ALLOWED_ORIGINS
  ? process.env.MUITO_ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : [];
const hasAllowlist = allowedOrigins.length > 0;
const isProduction = process.env.NODE_ENV === 'production';

const io = new Server(httpServer, {
  cors: {
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g., mobile apps, non-browser clients)
      if (!origin) return cb(null, true);
      // Enforce allowlist when configured
      if (hasAllowlist && allowedOrigins.includes(origin)) return cb(null, true);
      if (hasAllowlist) return cb(new Error('Not allowed by CORS'), false);
      // In production with no allowlist, block cross-origin requests
      if (isProduction) return cb(new Error('Not allowed by CORS'), false);
      // In non-production without an explicit allowlist, reflect the origin
      return cb(null, true);
    },
  },
});

// ── Authentication middleware ─────────────────────────────────────
const devAuthBypass = process.env.MUITO_DEV_AUTH_BYPASS === 'true';
if (devAuthBypass) {
  console.warn(
    '[WARNING] MUITO_DEV_AUTH_BYPASS is enabled — connections are accepted without token verification. ' +
      'Do NOT use this in production.'
  );
}

io.use(async (socket, next) => {
  const auth = (socket.handshake.auth || {}) as Record<string, unknown>;
  const token = auth.token as string | undefined;
  const userId = auth.userId as string | undefined;
  const displayName = auth.displayName as string | undefined;

  // Dev-only bypass: accept userId + displayName directly (must be explicitly enabled)
  if (devAuthBypass && userId && displayName) {
    (socket as any).userId = userId;
    (socket as any).displayName = displayName;
    return next();
  }

  if (token) {
    // Try verifying as a JWT first
    const jwtPayload = verifyJwt(token);
    if (jwtPayload) {
      (socket as any).userId = jwtPayload.userId;
      (socket as any).displayName = jwtPayload.displayName;
      return next();
    }

    // Fall back to Google ID token verification
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
