import { Server, Socket } from 'socket.io';
import { Events } from '../../../shared/src/events';
import { roomManager } from '../roomManager';
import { GameLoop } from '../gameLoop';
import { DEFAULT_TOTAL_ROUNDS } from '../../../shared/src/constants';

export function registerGameHandlers(
  io: Server,
  socket: Socket,
  userId: string
): void {
  socket.on(Events.START_GAME, () => {
    const room = roomManager.getRoomBySocket(socket.id);
    if (!room) {
      socket.emit(Events.ERROR, { message: 'Not in a room' });
      return;
    }
    if (room.players.length < 2) {
      socket.emit(Events.ERROR, { message: 'Need 2 players to start' });
      return;
    }
    if (room.gameLoop) {
      socket.emit(Events.ERROR, { message: 'Game already started' });
      return;
    }
    if (room.players[0].userId !== userId) {
      socket.emit(Events.ERROR, { message: 'Only the host can start the game' });
      return;
    }

    const playerIds = room.players.map((p) => p.userId);
    const gameLoop = new GameLoop(io, room.code, playerIds, DEFAULT_TOTAL_ROUNDS);
    roomManager.setGameLoop(room.code, gameLoop);

    io.to(room.code).emit(Events.GAME_STARTED, { totalRounds: DEFAULT_TOTAL_ROUNDS });
    gameLoop.start();
  });

  socket.on(Events.ANSWER, (payload: { option?: number }) => {
    const room = roomManager.getRoomBySocket(socket.id);
    if (!room || !room.gameLoop) {
      socket.emit(Events.ERROR, { message: 'No active game' });
      return;
    }
    if (typeof payload?.option !== 'number') {
      socket.emit(Events.ERROR, { message: 'Invalid answer format' });
      return;
    }
    room.gameLoop.handleAnswer(userId, payload.option);
  });
}
