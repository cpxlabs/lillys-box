import { Server } from 'socket.io';
import { Events, RoundPayload, RoundResultPayload, GameOverPayload } from '../../shared/src/events';
import { generatePuzzle } from '../../shared/src/gameLogic';
import {
  DEFAULT_TOTAL_ROUNDS,
  ROUND_TIMEOUT_MS,
  TIE_THRESHOLD_MS,
  POINTS_PER_CORRECT,
} from '../../shared/src/constants';

interface PlayerAnswer {
  userId: string;
  option: number;
  timestamp: number;
}

interface GameState {
  roomCode: string;
  playerIds: string[];
  currentRound: number;
  totalRounds: number;
  scores: Record<string, number>;
  currentPuzzle: { emoji: string; count: number; options: number[] } | null;
  answers: PlayerAnswer[];
  roundTimer: ReturnType<typeof setTimeout> | null;
  interRoundTimer: ReturnType<typeof setTimeout> | null;
  roundStartedAt: number;
  roundActive: boolean;
}

export class GameLoop {
  private io: Server;
  private state: GameState;
  private destroyed = false;

  constructor(
    io: Server,
    roomCode: string,
    playerIds: string[],
    totalRounds: number = DEFAULT_TOTAL_ROUNDS
  ) {
    this.io = io;
    this.state = {
      roomCode,
      playerIds,
      currentRound: 0,
      totalRounds,
      scores: Object.fromEntries(playerIds.map((id) => [id, 0])),
      currentPuzzle: null,
      answers: [],
      roundTimer: null,
      interRoundTimer: null,
      roundStartedAt: 0,
      roundActive: false,
    };
  }

  start(): void {
    this.advanceRound();
  }

  destroy(): void {
    this.destroyed = true;
    if (this.state.roundTimer) {
      clearTimeout(this.state.roundTimer);
      this.state.roundTimer = null;
    }
    if (this.state.interRoundTimer) {
      clearTimeout(this.state.interRoundTimer);
      this.state.interRoundTimer = null;
    }
  }

  handleAnswer(userId: string, option: number): void {
    if (this.destroyed || !this.state.roundActive) return;
    if (!this.state.playerIds.includes(userId)) return;
    if (this.state.answers.some((a) => a.userId === userId)) return;

    this.state.answers.push({ userId, option, timestamp: Date.now() });

    if (this.state.answers.length >= 2) {
      this.resolveRound();
    }
  }

  private advanceRound(): void {
    if (this.destroyed) return;

    this.state.currentRound += 1;
    if (this.state.currentRound > this.state.totalRounds) {
      this.endGame();
      return;
    }

    const puzzle = generatePuzzle(this.state.currentRound);
    this.state.currentPuzzle = puzzle;
    this.state.answers = [];
    this.state.roundActive = true;
    this.state.roundStartedAt = Date.now();

    const payload: RoundPayload = {
      roundNumber: this.state.currentRound,
      emoji: puzzle.emoji,
      count: puzzle.count,
      options: puzzle.options,
      startedAt: this.state.roundStartedAt,
    };

    this.io.to(this.state.roomCode).emit(Events.ROUND, payload);

    this.state.roundTimer = setTimeout(() => {
      if (!this.destroyed) this.resolveRound();
    }, ROUND_TIMEOUT_MS);
  }

  private resolveRound(): void {
    if (this.destroyed) return;

    this.state.roundActive = false;

    if (this.state.roundTimer) {
      clearTimeout(this.state.roundTimer);
      this.state.roundTimer = null;
    }

    const correctAnswer = this.state.currentPuzzle?.count ?? -1;
    const correctAnswers = this.state.answers.filter((a) => a.option === correctAnswer);

    let winnerId: string | null = null;
    let isTie = false;

    if (correctAnswers.length === 0) {
    } else if (correctAnswers.length === 1) {
      winnerId = correctAnswers[0].userId;
      this.state.scores[winnerId] += POINTS_PER_CORRECT;
    } else {
      const sorted = [...correctAnswers].sort((a, b) => a.timestamp - b.timestamp);
      if (sorted[1].timestamp - sorted[0].timestamp < TIE_THRESHOLD_MS) {
        isTie = true;
        this.state.scores[sorted[0].userId] += POINTS_PER_CORRECT;
        this.state.scores[sorted[1].userId] += POINTS_PER_CORRECT;
      } else {
        winnerId = sorted[0].userId;
        this.state.scores[winnerId] += POINTS_PER_CORRECT;
      }
    }

    const payload: RoundResultPayload = {
      roundNumber: this.state.currentRound,
      winnerId,
      scores: { ...this.state.scores },
      correctAnswer,
      isTie,
    };

    this.io.to(this.state.roomCode).emit(Events.ROUND_RESULT, payload);

    this.state.interRoundTimer = setTimeout(() => {
      this.state.interRoundTimer = null;
      if (!this.destroyed) this.advanceRound();
    }, 2000);
  }

  private endGame(): void {
    if (this.destroyed) return;

    const { scores, playerIds } = this.state;
    const [p1, p2] = playerIds;

    let winnerId: string | null = null;
    let isTie = false;

    if (scores[p1] > scores[p2]) {
      winnerId = p1;
    } else if (scores[p2] > scores[p1]) {
      winnerId = p2;
    } else {
      isTie = true;
    }

    const payload: GameOverPayload = { winnerId, scores, isTie };
    this.io.to(this.state.roomCode).emit(Events.GAME_OVER, payload);

    this.destroy();
  }
}
