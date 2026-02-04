import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { useSocket } from '../hooks/useSocket';

// ---------------------------------------------------------------------------
// Event name constants (kept in sync with shared/src/events.ts)
// ---------------------------------------------------------------------------
const Events = {
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  START_GAME: 'start_game',
  ANSWER: 'answer',
  ROOM_CREATED: 'room_created',
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  GAME_STARTED: 'game_started',
  ROUND: 'round',
  ROUND_RESULT: 'round_result',
  GAME_OVER: 'game_over',
  OPPONENT_DISCONNECTED: 'opponent_disconnected',
  ERROR: 'error',
} as const;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------
export interface MPPlayerInfo {
  userId: string;
  displayName: string;
}

export interface MPPuzzle {
  emoji: string;
  count: number;
  options: number[];
}

export interface MPRoundResult {
  roundNumber: number;
  winnerId: string | null;
  scores: Record<string, number>;
  correctAnswer: number;
  isTie: boolean;
}

export interface MPGameResult {
  winnerId: string | null;
  scores: Record<string, number>;
  isTie: boolean;
}

export enum MultiGamePhase {
  IDLE = 'idle',
  LOBBY = 'lobby',
  PLAYING = 'playing',
  RESULTS = 'results',
}

export interface MultiPlayerMuitoContextType {
  // ── state ───────────────────────────────────────────────────────
  phase: MultiGamePhase;
  connected: boolean;
  connectionError: string | null;
  error: string | null;
  roomCode: string | null;
  players: MPPlayerInfo[];
  isHost: boolean;
  totalRounds: number;
  currentRound: number;
  puzzle: MPPuzzle | null;
  roundStartedAt: number;
  scores: Record<string, number>;
  lastRoundResult: MPRoundResult | null;
  gameResult: MPGameResult | null;
  selectedAnswer: number | null;
  opponentDisconnected: boolean;

  // ── actions ─────────────────────────────────────────────────────
  connect: () => void;
  disconnect: () => void;
  createRoom: () => void;
  joinRoom: (code: string) => void;
  leaveRoom: () => void;
  startGame: () => void;
  submitAnswer: (option: number) => void;
  clearError: () => void;
}

// ---------------------------------------------------------------------------
// Context & Provider
// ---------------------------------------------------------------------------
const MultiPlayerMuitoContext = createContext<MultiPlayerMuitoContextType | undefined>(undefined);

export const MultiPlayerMuitoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const myUserId = user?.id || (isGuest ? 'guest' : 'guest');
  const myDisplayName = user?.name || 'Guest';

  const { socketRef, connected, connectionError, connect: socketConnect, disconnect: socketDisconnect } =
    useSocket({ userId: myUserId, displayName: myDisplayName });

  // ── local state ───────────────────────────────────────────────────
  const [phase, setPhase] = useState(MultiGamePhase.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<MPPlayerInfo[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [totalRounds, setTotalRounds] = useState(10);
  const [currentRound, setCurrentRound] = useState(0);
  const [puzzle, setPuzzle] = useState<MPPuzzle | null>(null);
  const [roundStartedAt, setRoundStartedAt] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [lastRoundResult, setLastRoundResult] = useState<MPRoundResult | null>(null);
  const [gameResult, setGameResult] = useState<MPGameResult | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  // ── subscribe to server events (runs once after connect) ────────
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onRoomCreated = (payload: { code: string }) => {
      setRoomCode(payload.code);
      setIsHost(true);
      setPhase(MultiGamePhase.LOBBY);
    };

    const onPlayerJoined = (payload: { players: MPPlayerInfo[]; totalPlayers: number }) => {
      setPlayers(payload.players);
    };

    const onPlayerLeft = (payload: { players: MPPlayerInfo[] }) => {
      setPlayers(payload.players);
    };

    const onGameStarted = (payload: { totalRounds: number }) => {
      setTotalRounds(payload.totalRounds);
      setPhase(MultiGamePhase.PLAYING);
      setScores({});
      setCurrentRound(0);
      setGameResult(null);
      setLastRoundResult(null);
    };

    const onRound = (payload: {
      roundNumber: number;
      emoji: string;
      count: number;
      options: number[];
      startedAt: number;
    }) => {
      setCurrentRound(payload.roundNumber);
      setPuzzle({ emoji: payload.emoji, count: payload.count, options: payload.options });
      setRoundStartedAt(payload.startedAt);
      setSelectedAnswer(null);
      setLastRoundResult(null);
    };

    const onRoundResult = (payload: MPRoundResult) => {
      setScores(payload.scores);
      setLastRoundResult(payload);
    };

    const onGameOver = async (payload: MPGameResult) => {
      setGameResult(payload);
      setPhase(MultiGamePhase.RESULTS);

      // ── persist best score ──────────────────────────────────────
      const myScore = payload.scores[myUserId] || 0;
      if (myScore > 0) {
        const storageKey = `@muito_game:bestScore:${myUserId}`;
        try {
          const stored = await AsyncStorage.getItem(storageKey);
          const currentBest = stored ? parseInt(stored, 10) : 0;
          if (myScore > currentBest) {
            await AsyncStorage.setItem(storageKey, myScore.toString());
          }
        } catch {
          // non-critical — ignore
        }
      }
    };

    const onOpponentDisconnected = () => {
      setOpponentDisconnected(true);
      setPhase(MultiGamePhase.LOBBY);
    };

    const onError = (payload: { message: string }) => {
      setError(payload.message);
    };

    socket.on(Events.ROOM_CREATED, onRoomCreated);
    socket.on(Events.PLAYER_JOINED, onPlayerJoined);
    socket.on(Events.PLAYER_LEFT, onPlayerLeft);
    socket.on(Events.GAME_STARTED, onGameStarted);
    socket.on(Events.ROUND, onRound);
    socket.on(Events.ROUND_RESULT, onRoundResult);
    socket.on(Events.GAME_OVER, onGameOver);
    socket.on(Events.OPPONENT_DISCONNECTED, onOpponentDisconnected);
    socket.on(Events.ERROR, onError);

    return () => {
      socket.off(Events.ROOM_CREATED, onRoomCreated);
      socket.off(Events.PLAYER_JOINED, onPlayerJoined);
      socket.off(Events.PLAYER_LEFT, onPlayerLeft);
      socket.off(Events.GAME_STARTED, onGameStarted);
      socket.off(Events.ROUND, onRound);
      socket.off(Events.ROUND_RESULT, onRoundResult);
      socket.off(Events.GAME_OVER, onGameOver);
      socket.off(Events.OPPONENT_DISCONNECTED, onOpponentDisconnected);
      socket.off(Events.ERROR, onError);
    };
    // Re-run when the underlying socket instance changes (after connect)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  // ── actions ─────────────────────────────────────────────────────

  const connect = useCallback(() => {
    socketConnect();
  }, [socketConnect]);

  const disconnect = useCallback(() => {
    socketDisconnect();
    setPhase(MultiGamePhase.IDLE);
    setRoomCode(null);
    setPlayers([]);
    setIsHost(false);
  }, [socketDisconnect]);

  const createRoom = useCallback(() => {
    setError(null);
    socketRef.current?.emit(Events.CREATE_ROOM);
  }, [socketRef]);

  const joinRoom = useCallback((code: string) => {
    setError(null);
    socketRef.current?.emit(Events.JOIN_ROOM, { code });
  }, [socketRef]);

  const leaveRoom = useCallback(() => {
    socketRef.current?.emit(Events.LEAVE_ROOM);
    setPhase(MultiGamePhase.IDLE);
    setRoomCode(null);
    setPlayers([]);
    setIsHost(false);
    setOpponentDisconnected(false);
    setGameResult(null);
    setLastRoundResult(null);
    setScores({});
    setCurrentRound(0);
    setPuzzle(null);
    setSelectedAnswer(null);
    setTotalRounds(10);
  }, [socketRef]);

  const startGame = useCallback(() => {
    setError(null);
    socketRef.current?.emit(Events.START_GAME);
  }, [socketRef]);

  const submitAnswer = useCallback(
    (option: number) => {
      if (selectedAnswer !== null) return; // already answered this round
      setSelectedAnswer(option); // optimistic highlight
      socketRef.current?.emit(Events.ANSWER, { option });
    },
    [selectedAnswer, socketRef]
  );

  const clearError = useCallback(() => setError(null), []);

  return (
    <MultiPlayerMuitoContext.Provider
      value={{
        phase,
        connected,
        connectionError,
        error,
        roomCode,
        players,
        isHost,
        totalRounds,
        currentRound,
        puzzle,
        roundStartedAt,
        scores,
        lastRoundResult,
        gameResult,
        selectedAnswer,
        opponentDisconnected,
        connect,
        disconnect,
        createRoom,
        joinRoom,
        leaveRoom,
        startGame,
        submitAnswer,
        clearError,
      }}
    >
      {children}
    </MultiPlayerMuitoContext.Provider>
  );
};

export const useMultiPlayerMuito = () => {
  const ctx = useContext(MultiPlayerMuitoContext);
  if (!ctx) throw new Error('useMultiPlayerMuito must be used within MultiPlayerMuitoProvider');
  return ctx;
};
