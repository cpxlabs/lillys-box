import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MuitoLobbyScreen } from '../MuitoLobbyScreen';

// ── mocks ───────────────────────────────────────────────────────────────────

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockConnect = jest.fn();
const mockLeaveRoom = jest.fn();
const mockCreateRoom = jest.fn();
const mockJoinRoom = jest.fn();
const mockStartGame = jest.fn();
const mockClearError = jest.fn();

let mockPhase = 'idle';
let mockConnected = true;
let mockRoomCode: string | null = null;
let mockPlayers: { userId: string; displayName: string }[] = [];
let mockIsHost = false;
let mockError: string | null = null;
let mockOpponentDisconnected = false;

jest.mock('../../context/MultiPlayerMuitoContext', () => ({
  useMultiPlayerMuito: () => ({
    phase: mockPhase,
    connected: mockConnected,
    error: mockError,
    roomCode: mockRoomCode,
    players: mockPlayers,
    isHost: mockIsHost,
    opponentDisconnected: mockOpponentDisconnected,
    connect: mockConnect,
    createRoom: mockCreateRoom,
    joinRoom: mockJoinRoom,
    leaveRoom: mockLeaveRoom,
    startGame: mockStartGame,
    clearError: mockClearError,
  }),
  MultiGamePhase: {
    IDLE: 'idle',
    LOBBY: 'lobby',
    PLAYING: 'playing',
    RESULTS: 'results',
  },
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = { navigate: mockNavigate, goBack: mockGoBack };

// ── helpers ─────────────────────────────────────────────────────────────────

function resetMocks() {
  jest.clearAllMocks();
  mockPhase = 'idle';
  mockConnected = true;
  mockRoomCode = null;
  mockPlayers = [];
  mockIsHost = false;
  mockError = null;
  mockOpponentDisconnected = false;
}

// ── tests ───────────────────────────────────────────────────────────────────

describe('MuitoLobbyScreen – create/join tabs', () => {
  beforeEach(resetMocks);

  it('renders Host and Join tabs', () => {
    const { getByText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    expect(getByText('muito.multiplayer.host')).toBeTruthy();
    expect(getByText('muito.multiplayer.join')).toBeTruthy();
  });

  it('shows "Create Room" button on Host tab by default', () => {
    const { getByText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    expect(getByText('muito.multiplayer.createRoom')).toBeTruthy();
  });

  it('tapping Create Room calls createRoom()', () => {
    const { getByText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('muito.multiplayer.createRoom'));
    expect(mockCreateRoom).toHaveBeenCalledTimes(1);
  });

  it('switching to Join tab shows the code input and Join Room button', () => {
    const { getByText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('muito.multiplayer.join'));
    expect(getByText('muito.multiplayer.joinRoom')).toBeTruthy();
  });

  it('tapping Join Room with a code calls joinRoom(code)', () => {
    const { getByText, getByLabelText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    // Switch to join tab
    fireEvent.press(getByText('muito.multiplayer.join'));
    // Type a code
    const input = getByLabelText('muito.multiplayer.codePlaceholder');
    fireEvent.changeText(input, 'ABC123');
    // Press join
    fireEvent.press(getByText('muito.multiplayer.joinRoom'));
    expect(mockJoinRoom).toHaveBeenCalledWith('ABC123');
  });

  it('back button calls leaveRoom and goBack', () => {
    const { getByText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('common.back'));
    expect(mockLeaveRoom).toHaveBeenCalled();
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('shows connecting text when not connected', () => {
    mockConnected = false;
    const { getByText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    expect(getByText('muito.multiplayer.connecting')).toBeTruthy();
  });
});

describe('MuitoLobbyScreen – waiting room', () => {
  beforeEach(() => {
    resetMocks();
    mockRoomCode = 'XYZ789';
    mockIsHost = true;
    mockPlayers = [{ userId: 'user1', displayName: 'Alice' }];
  });

  it('displays the room code', () => {
    const { getByText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    expect(getByText('XYZ789')).toBeTruthy();
  });

  it('shows waiting indicator when only one player', () => {
    const { getByText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    expect(getByText('muito.multiplayer.waitingForOpponent')).toBeTruthy();
  });

  it('shows Start Game button when both players present and host', () => {
    mockPlayers = [
      { userId: 'user1', displayName: 'Alice' },
      { userId: 'user2', displayName: 'Bob' },
    ];
    const { getByText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    expect(getByText('muito.multiplayer.start')).toBeTruthy();
  });

  it('tapping Start Game calls startGame()', () => {
    mockPlayers = [
      { userId: 'user1', displayName: 'Alice' },
      { userId: 'user2', displayName: 'Bob' },
    ];
    const { getByText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('muito.multiplayer.start'));
    expect(mockStartGame).toHaveBeenCalledTimes(1);
  });

  it('non-host does not see the Start button with one player', () => {
    mockIsHost = false;
    const { queryByText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    expect(queryByText('muito.multiplayer.start')).toBeNull();
  });

  it('displays server error when present', () => {
    mockError = 'Room not found';
    const { getByText } = render(
      <MuitoLobbyScreen navigation={navigation as any} />
    );
    expect(getByText('Room not found')).toBeTruthy();
  });
});
