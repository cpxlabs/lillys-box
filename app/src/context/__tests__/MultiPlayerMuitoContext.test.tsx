import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import {
  MultiPlayerMuitoProvider,
  useMultiPlayerMuito,
  MultiGamePhase,
} from '../MultiPlayerMuitoContext';

// ── mocks ───────────────────────────────────────────────────────────────────

jest.mock('../../hooks/useSocket', () => {
  const mockEmit = jest.fn();
  const mockOn = jest.fn();
  const mockOff = jest.fn();
  const mockDisconnect = jest.fn();

  const socketMock = {
    emit: mockEmit,
    on: mockOn,
    off: mockOff,
    disconnect: mockDisconnect,
  };

  return {
    useSocket: () => ({
      socketRef: { current: socketMock },
      connected: true,
      connectionError: null,
      connect: jest.fn(),
      disconnect: jest.fn(),
    }),
    __socketMock: socketMock,
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('../AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', name: 'Tester' },
    isGuest: false,
  }),
}));

// ── consumer component for testing ─────────────────────────────────────────

let capturedContext: ReturnType<typeof useMultiPlayerMuito> | null = null;

function Consumer() {
  capturedContext = useMultiPlayerMuito();
  return <Text>{capturedContext.phase}</Text>;
}

// ── tests ───────────────────────────────────────────────────────────────────

describe('MultiPlayerMuitoContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedContext = null;
  });

  it('initial phase is IDLE', () => {
    render(
      <MultiPlayerMuitoProvider>
        <Consumer />
      </MultiPlayerMuitoProvider>
    );
    expect(capturedContext!.phase).toBe(MultiGamePhase.IDLE);
  });

  it('initial state has no room, no players, no puzzle', () => {
    render(
      <MultiPlayerMuitoProvider>
        <Consumer />
      </MultiPlayerMuitoProvider>
    );
    expect(capturedContext!.roomCode).toBeNull();
    expect(capturedContext!.players).toHaveLength(0);
    expect(capturedContext!.puzzle).toBeNull();
    expect(capturedContext!.gameResult).toBeNull();
    expect(capturedContext!.selectedAnswer).toBeNull();
  });

  it('createRoom emits create_room event', () => {
    render(
      <MultiPlayerMuitoProvider>
        <Consumer />
      </MultiPlayerMuitoProvider>
    );

    const { __socketMock } = require('../../hooks/useSocket');

    act(() => {
      capturedContext!.createRoom();
    });

    expect(__socketMock.emit).toHaveBeenCalledWith('create_room');
  });

  it('joinRoom emits join_room event with the code', () => {
    render(
      <MultiPlayerMuitoProvider>
        <Consumer />
      </MultiPlayerMuitoProvider>
    );

    const { __socketMock } = require('../../hooks/useSocket');

    act(() => {
      capturedContext!.joinRoom('ABC123');
    });

    expect(__socketMock.emit).toHaveBeenCalledWith('join_room', { code: 'ABC123' });
  });

  it('startGame emits start_game event', () => {
    render(
      <MultiPlayerMuitoProvider>
        <Consumer />
      </MultiPlayerMuitoProvider>
    );

    const { __socketMock } = require('../../hooks/useSocket');

    act(() => {
      capturedContext!.startGame();
    });

    expect(__socketMock.emit).toHaveBeenCalledWith('start_game');
  });

  it('submitAnswer emits answer event and sets selectedAnswer optimistically', () => {
    render(
      <MultiPlayerMuitoProvider>
        <Consumer />
      </MultiPlayerMuitoProvider>
    );

    const { __socketMock } = require('../../hooks/useSocket');

    act(() => {
      capturedContext!.submitAnswer(3);
    });

    expect(__socketMock.emit).toHaveBeenCalledWith('answer', { option: 3 });
    expect(capturedContext!.selectedAnswer).toBe(3);
  });

  it('submitAnswer is a no-op when already answered', () => {
    render(
      <MultiPlayerMuitoProvider>
        <Consumer />
      </MultiPlayerMuitoProvider>
    );

    const { __socketMock } = require('../../hooks/useSocket');

    act(() => {
      capturedContext!.submitAnswer(3);
    });
    __socketMock.emit.mockClear();

    act(() => {
      capturedContext!.submitAnswer(5); // second tap — should be ignored
    });

    expect(__socketMock.emit).not.toHaveBeenCalled();
  });

  it('leaveRoom resets all game state', () => {
    render(
      <MultiPlayerMuitoProvider>
        <Consumer />
      </MultiPlayerMuitoProvider>
    );

    // Simulate some state by submitting an answer first
    act(() => {
      capturedContext!.submitAnswer(2);
    });
    expect(capturedContext!.selectedAnswer).toBe(2);

    act(() => {
      capturedContext!.leaveRoom();
    });

    expect(capturedContext!.phase).toBe(MultiGamePhase.IDLE);
    expect(capturedContext!.roomCode).toBeNull();
    expect(capturedContext!.players).toHaveLength(0);
    expect(capturedContext!.selectedAnswer).toBeNull();
    expect(capturedContext!.gameResult).toBeNull();
  });
});
