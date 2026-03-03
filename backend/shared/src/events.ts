/** All Socket.IO event names used between client and server. */
export const Events = {
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

export interface PlayerInfo {
  userId: string;
  displayName: string;
}

export interface RoomCreatedPayload {
  code: string;
}

export interface PlayerJoinedPayload {
  players: PlayerInfo[];
  totalPlayers: number;
}

export interface PlayerLeftPayload {
  players: PlayerInfo[];
}

export interface GameStartedPayload {
  totalRounds: number;
}

export interface RoundPayload {
  roundNumber: number;
  emoji: string;
  count: number;
  options: number[];
  startedAt: number;
}

export interface RoundResultPayload {
  roundNumber: number;
  winnerId: string | null;
  scores: Record<string, number>;
  correctAnswer: number;
  isTie: boolean;
}

export interface GameOverPayload {
  winnerId: string | null;
  scores: Record<string, number>;
  isTie: boolean;
}

export interface ErrorPayload {
  message: string;
}

export interface JoinRoomPayload {
  code: string;
}

export interface AnswerPayload {
  option: number;
}
