import { Server, Socket } from 'socket.io';
import { Events } from '../../../shared/src/events';
import { roomManager } from '../roomManager';

export function registerLobbyHandlers(
  io: Server,
  socket: Socket,
  userId: string,
  displayName: string
): void {
  socket.on(Events.CREATE_ROOM, () => {
    roomManager.removePlayerFromRoom(socket.id);

    const code = roomManager.createRoom(socket, userId, displayName);

    socket.emit(Events.ROOM_CREATED, { code });

    const room = roomManager.getRoomByCode(code)!;
    io.to(code).emit(Events.PLAYER_JOINED, {
      players: room.players.map((p) => ({ userId: p.userId, displayName: p.displayName })),
      totalPlayers: room.players.length,
    });
  });

  socket.on(Events.JOIN_ROOM, (payload: unknown) => {
    const code = (typeof payload === 'object' && payload !== null && 'code' in payload
      ? String((payload as Record<string, unknown>).code)
      : ''
    ).toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!code) {
      socket.emit(Events.ERROR, { message: 'Room code is required' });
      return;
    }

    roomManager.removePlayerFromRoom(socket.id);

    const result = roomManager.joinRoom(socket, code, userId, displayName);
    if (!result.success) {
      socket.emit(Events.ERROR, { message: result.error || 'Failed to join room' });
      return;
    }

    const room = result.room!;
    io.to(code).emit(Events.PLAYER_JOINED, {
      players: room.players.map((p) => ({ userId: p.userId, displayName: p.displayName })),
      totalPlayers: room.players.length,
    });
  });

  socket.on(Events.LEAVE_ROOM, () => {
    const room = roomManager.getRoomBySocket(socket.id);
    if (!room) return;

    const code = room.code;
    roomManager.removePlayerFromRoom(socket.id);
    socket.leave(code);

    if (room.players.length > 0) {
      io.to(code).emit(Events.PLAYER_LEFT, {
        players: room.players.map((p) => ({ userId: p.userId, displayName: p.displayName })),
      });
    }
  });
}
