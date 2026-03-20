import { describe, expect, it, vi } from 'vitest';
import { roomManager, ROOM_CODE_CHARS, ROOM_CODE_LENGTH, MAX_CODE_ATTEMPTS } from './roomManager';

describe('RoomManager.generateRoomCode', () => {
  it('returns a code of the expected length', () => {
    const code = roomManager.generateRoomCode();
    expect(code).toHaveLength(ROOM_CODE_LENGTH);
  });

  it('uses only allowed characters (no ambiguous 0, 1, I, O)', () => {
    const allowed = new Set(ROOM_CODE_CHARS.split(''));
    for (let i = 0; i < 200; i++) {
      const code = roomManager.generateRoomCode();
      for (const ch of code) {
        expect(allowed.has(ch)).toBe(true);
      }
    }
  });
});

describe('RoomManager.createRoom – deduplication', () => {
  it('regenerates code when a collision occurs', () => {
    const socket1 = { id: 'socket-1', join: vi.fn() } as any;
    const firstCode = roomManager.createRoom(socket1, 'user-1', 'Player 1');
    expect(firstCode).toHaveLength(ROOM_CODE_LENGTH);

    // Spy on generateRoomCode: first call returns colliding code, second returns unique
    let callCount = 0;
    const spy = vi.spyOn(roomManager, 'generateRoomCode').mockImplementation(() => {
      callCount++;
      return callCount === 1 ? firstCode : 'UNIQ01';
    });

    const socket2 = { id: 'socket-2', join: vi.fn() } as any;
    const secondCode = roomManager.createRoom(socket2, 'user-2', 'Player 2');
    expect(secondCode).toBe('UNIQ01');
    expect(callCount).toBe(2);

    spy.mockRestore();

    // Cleanup: remove players so other tests are not affected
    roomManager.removePlayerFromRoom('socket-1');
    roomManager.removePlayerFromRoom('socket-2');
  });

  it('throws when unable to generate a unique code after max attempts', () => {
    const socket1 = { id: 'sock-a', join: vi.fn() } as any;
    const existingCode = roomManager.createRoom(socket1, 'ua', 'PA');

    // Make generateRoomCode always return the colliding code
    const spy = vi.spyOn(roomManager, 'generateRoomCode').mockReturnValue(existingCode);

    const socket2 = { id: 'sock-b', join: vi.fn() } as any;
    expect(() => roomManager.createRoom(socket2, 'ub', 'PB')).toThrow(
      'Unable to generate a unique room code'
    );
    expect(spy).toHaveBeenCalledTimes(MAX_CODE_ATTEMPTS);

    spy.mockRestore();
    roomManager.removePlayerFromRoom('sock-a');
  });
});

