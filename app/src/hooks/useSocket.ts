import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = process.env.EXPO_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3000';

interface UseSocketOptions {
  userId: string | null;
  displayName: string;
}

/**
 * Manages a single Socket.IO connection lifecycle.
 *
 * - Exposes `connect` / `disconnect` so the caller decides when to open the socket.
 * - Returns the live socket via a ref (stable across renders).
 * - Tracks `connected` status and the last `connectionError`.
 */
export function useSocket({ userId, displayName }: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current || !userId) return;

    const socket = io(SERVER_URL, {
      auth: { userId, displayName },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      setConnected(true);
      setConnectionError(null);
    });

    socket.on('connect_error', (err) => {
      setConnectionError(err.message);
      setConnected(false);
    });

    socketRef.current = socket;
  }, [userId, displayName]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setConnected(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return { socketRef, connected, connectionError, connect, disconnect };
}
