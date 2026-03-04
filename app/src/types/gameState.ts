/**
 * Unified Game State Types
 * Provides consistent state management interfaces for all games
 */

/**
 * Base game state that all games should implement
 */
export interface BaseGameState {
  /** Game instance ID (unique per play session) */
  sessionId: string;
  /** Whether the game is currently running */
  isRunning: boolean;
  /** Current score in the game */
  currentScore: number;
  /** Best score achieved (all-time) */
  bestScore: number;
  /** Game start timestamp */
  startTime: number;
  /** Game end timestamp (null if still running) */
  endTime: number | null;
  /** Elapsed time in milliseconds */
  elapsedTime: number;
}

/**
 * Game progress/difficulty state
 */
export interface GameProgressState {
  /** Current level/difficulty (1-based) */
  level: number;
  /** Number of levels completed */
  completedLevels: number;
  /** Is the game on the last level */
  isLastLevel: boolean;
  /** Progress percentage (0-100) */
  progressPercentage: number;
}

/**
 * Game stats tracked over time
 */
export interface GameStats {
  /** Total games played */
  totalPlayed: number;
  /** Games won/completed */
  gamesWon: number;
  /** Win rate (0-100) */
  winRate: number;
  /** Average score */
  averageScore: number;
  /** Best score all-time */
  bestScore: number;
  /** Number of times played today */
  playedToday: number;
  /** Timestamps of last 10 plays */
  recentSessions: number[];
}

/**
 * Multiplayer game state
 */
export interface MultiplayerGameState extends BaseGameState {
  /** Players in the game */
  players: MultiplayerPlayer[];
  /** Current turn player ID */
  currentPlayerIndex: number;
  /** Game type: turn-based, competitive, cooperative */
  gameType: 'turn-based' | 'competitive' | 'cooperative';
}

export interface MultiplayerPlayer {
  /** Player ID (usually user ID) */
  id: string;
  /** Player display name */
  name: string;
  /** Current score */
  score: number;
  /** Is this player AI */
  isAI: boolean;
  /** Player status */
  status: 'connecting' | 'ready' | 'playing' | 'finished' | 'disconnected';
}

/**
 * Rich game result/completion data
 */
export interface GameResult {
  /** Game ID */
  gameId: string;
  /** Session ID */
  sessionId: string;
  /** Final score */
  finalScore: number;
  /** Best score in this session */
  bestScoreInSession: number;
  /** Whether player won/completed */
  isWin: boolean;
  /** Time spent playing (ms) */
  duration: number;
  /** Timestamp when game ended */
  completedAt: number;
  /** Star rating (1-3 stars) */
  stars?: number;
  /** Achievements unlocked this session */
  achievements?: string[];
  /** Replay data (for deterministic games like puzzles) */
  replayData?: Record<string, unknown>;
}

/**
 * Game difficulty/settings
 */
export interface GameDifficulty {
  /** Difficulty level: easy, normal, hard */
  level: 'easy' | 'normal' | 'hard';
  /** Speed multiplier (1 = normal) */
  speedMultiplier: number;
  /** Lives/health available */
  maxLives: number;
  /** Time limit in seconds (0 = no limit) */
  timeLimit: number;
  /** Custom options per game */
  customOptions?: Record<string, unknown>;
}

/**
 * Game session data (persisted)
 */
export interface GameSession {
  /** Unique session ID */
  id: string;
  /** Game ID */
  gameId: string;
  /** Session state */
  state: BaseGameState;
  /** Optional progress state */
  progress?: GameProgressState;
  /** Difficulty settings */
  difficulty: GameDifficulty;
  /** Final result */
  result?: GameResult;
  /** Whether session can be resumed */
  isReusable: boolean;
}

/**
 * Hook return type for standard game state management
 */
export interface UseGameStateReturn<T extends BaseGameState = BaseGameState> {
  /** Current game state */
  state: T;
  /** Start a new game */
  startGame: () => void;
  /** End the current game */
  endGame: () => void;
  /** Update current score */
  setScore: (score: number) => void;
  /** Update best score if applicable */
  updateBestScore: (score: number) => void;
  /** Reset to saved state */
  reset: () => void;
  /** Pause game */
  pause: () => void;
  /** Resume paused game */
  resume: () => void;
  /** Check if score is new best */
  isNewBest: boolean;
}

/**
 * Hook return type for game progress (level/difficulty)
 */
export interface UseGameProgressReturn extends GameProgressState {
  /** Move to next level */
  nextLevel: () => void;
  /** Move to previous level */
  previousLevel: () => void;
  /** Jump to specific level */
  goToLevel: (level: number) => void;
  /** Mark level as completed */
  completeLevel: () => void;
}
