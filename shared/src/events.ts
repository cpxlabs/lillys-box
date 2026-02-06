/** All Socket.IO event names used between client and server. */
export const Events = {
  // ── client → server ──────────────────────────────────────────
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  START_GAME: 'start_game',
  ANSWER: 'answer',

  // ── server → client ──────────────────────────────────────────
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

// ── payload types ─────────────────────────────────────────────────

export interface PlayerInfo {
  userId: string;
  displayName: string;
}

/** Emitted to the host after create_room succeeds. */
export interface RoomCreatedPayload {
  code: string;
}

/** Emitted to the whole room whenever the player list changes. */
export interface PlayerJoinedPayload {
  players: PlayerInfo[];
  totalPlayers: number;
}

export interface PlayerLeftPayload {
  players: PlayerInfo[];
}

/** Emitted once at the start of a game. */
export interface GameStartedPayload {
  totalRounds: number;
}

/** Emitted at the beginning of each round. */
export interface RoundPayload {
  roundNumber: number;
  emoji: string;
  count: number;
  options: number[];
  /** Server timestamp (Date.now()) when the round started — used by clients to sync the countdown. */
  startedAt: number;
}

/** Emitted after every round resolves. */
export interface RoundResultPayload {
  roundNumber: number;
  /** userId of the winner, or null when no one scored. */
  winnerId: string | null;
  /** Running totals keyed by userId. */
  scores: Record<string, number>;
  correctAnswer: number;
  isTie: boolean;
}

/** Emitted once the final round has resolved. */
export interface GameOverPayload {
  winnerId: string | null;
  scores: Record<string, number>;
  isTie: boolean;
}

export interface ErrorPayload {
  message: string;
}

// ── client → server payload types ─────────────────────────────────

export interface JoinRoomPayload {
  code: string;
}

export interface AnswerPayload {
  option: number;
}
