import { Server, Socket } from 'socket.io';
import { Events } from '../../shared/src/events';
import { GameLoop } from './gameLoop';

export const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const ROOM_CODE_LENGTH = 6;
export const MAX_CODE_ATTEMPTS = 100;

export interface RoomPlayer {
  socketId: string;
  userId: string;
  displayName: string;
}

export interface RoomState {
  code: string;
  players: RoomPlayer[];
  gameLoop: GameLoop | null;
  createdAt: number;
}

class RoomManager {
  private rooms = new Map<string, RoomState>();
  private socketToRoom = new Map<string, string>();

  generateRoomCode(): string {
    let code = '';
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
    }
    return code;
  }

  createRoom(socket: Socket, userId: string, displayName: string): string {
    let code = this.generateRoomCode();
    let attempts = 1;
    while (this.rooms.has(code) && attempts < MAX_CODE_ATTEMPTS) {
      code = this.generateRoomCode();
      attempts++;
    }
    if (this.rooms.has(code)) {
      throw new Error('Unable to generate a unique room code');
    }
    const room: RoomState = {
      code,
      players: [{ socketId: socket.id, userId, displayName }],
      gameLoop: null,
      createdAt: Date.now(),
    };
    this.rooms.set(code, room);
    this.socketToRoom.set(socket.id, code);
    socket.join(code);
    return code;
  }

  joinRoom(
    socket: Socket,
    code: string,
    userId: string,
    displayName: string
  ): { success: boolean; error?: string; room?: RoomState } {
    const room = this.rooms.get(code);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.players.length >= 2) return { success: false, error: 'Room is full' };
    if (room.players.some((p) => p.userId === userId))
      return { success: false, error: 'Already in this room' };
    if (room.gameLoop) return { success: false, error: 'Game already started' };

    room.players.push({ socketId: socket.id, userId, displayName });
    this.socketToRoom.set(socket.id, code);
    socket.join(code);
    return { success: true, room };
  }

  getRoomBySocket(socketId: string): RoomState | undefined {
    const code = this.socketToRoom.get(socketId);
    return code ? this.rooms.get(code) : undefined;
  }

  getRoomByCode(code: string): RoomState | undefined {
    return this.rooms.get(code);
  }

  removePlayerFromRoom(socketId: string): {
    room?: RoomState;
    removedPlayer?: RoomPlayer;
  } {
    const code = this.socketToRoom.get(socketId);
    if (!code) return {};
    const room = this.rooms.get(code);
    if (!room) return {};

    const idx = room.players.findIndex((p) => p.socketId === socketId);
    if (idx === -1) return {};

    const [removed] = room.players.splice(idx, 1);
    this.socketToRoom.delete(socketId);

    if (room.players.length === 0) {
      this.rooms.delete(code);
    }
    return { room, removedPlayer: removed };
  }

  handleDisconnect(io: Server, socketId: string): void {
    const code = this.socketToRoom.get(socketId);
    if (!code) return;

    const room = this.rooms.get(code);
    if (!room) return;

    if (room.gameLoop) {
      room.gameLoop.destroy();
      room.gameLoop = null;
    }

    const { removedPlayer } = this.removePlayerFromRoom(socketId);

    if (room.players.length > 0) {
      io.to(code).emit(Events.OPPONENT_DISCONNECTED, {
        message: removedPlayer?.displayName || 'Opponent',
      });
    }
  }

  setGameLoop(code: string, gameLoop: GameLoop): void {
    const room = this.rooms.get(code);
    if (room) room.gameLoop = gameLoop;
  }
}

export const roomManager = new RoomManager();
