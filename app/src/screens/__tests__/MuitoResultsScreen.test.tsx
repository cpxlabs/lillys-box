import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MuitoResultsScreen } from '../MuitoResultsScreen';

// ── mocks ───────────────────────────────────────────────────────────────────

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockLeaveRoom = jest.fn();

let mockGameResult: { winnerId: string | null; scores: Record<string, number>; isTie: boolean } | null = null;
let mockScores: Record<string, number> = {};

jest.mock('../../context/MultiPlayerMuitoContext', () => ({
  useMultiPlayerMuito: () => ({
    gameResult: mockGameResult,
    scores: mockScores,
    leaveRoom: mockLeaveRoom,
  }),
}));

// Auth mock — "me" is always user-1
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user-1', name: 'Alice' }, isGuest: false }),
}));

const mockNavigate = jest.fn();
const navigation = { navigate: mockNavigate };

// ── helpers ─────────────────────────────────────────────────────────────────

function resetMocks() {
  jest.clearAllMocks();
  mockGameResult = null;
  mockScores = {};
}

// ── tests ───────────────────────────────────────────────────────────────────

describe('MuitoResultsScreen – I won', () => {
  beforeEach(() => {
    resetMocks();
    mockScores = { 'user-1': 80, 'user-2': 50 };
    mockGameResult = { winnerId: 'user-1', scores: mockScores, isTie: false };
  });

  it('shows win headline', () => {
    const { getByText } = render(
      <MuitoResultsScreen navigation={navigation as any} />
    );
    expect(getByText('muito.multiplayer.resultWin')).toBeTruthy();
  });

  it('displays my score', () => {
    const { getByText } = render(
      <MuitoResultsScreen navigation={navigation as any} />
    );
    expect(getByText('80')).toBeTruthy();
  });

  it('displays opponent score', () => {
    const { getByText } = render(
      <MuitoResultsScreen navigation={navigation as any} />
    );
    expect(getByText('50')).toBeTruthy();
  });

  it('Play Again navigates to MuitoLobby', () => {
    const { getByText } = render(
      <MuitoResultsScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('muito.multiplayer.playAgain'));
    expect(mockNavigate).toHaveBeenCalledWith('MuitoLobby');
  });

  it('Back to Menu calls leaveRoom and navigates to MuitoHome', () => {
    const { getByText } = render(
      <MuitoResultsScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('muito.multiplayer.backToMenu'));
    expect(mockLeaveRoom).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('MuitoHome');
  });
});

describe('MuitoResultsScreen – I lost', () => {
  beforeEach(() => {
    resetMocks();
    mockScores = { 'user-1': 30, 'user-2': 70 };
    mockGameResult = { winnerId: 'user-2', scores: mockScores, isTie: false };
  });

  it('shows loss headline', () => {
    const { getByText } = render(
      <MuitoResultsScreen navigation={navigation as any} />
    );
    expect(getByText('muito.multiplayer.resultLose')).toBeTruthy();
  });
});

describe('MuitoResultsScreen – tie', () => {
  beforeEach(() => {
    resetMocks();
    mockScores = { 'user-1': 50, 'user-2': 50 };
    mockGameResult = { winnerId: null, scores: mockScores, isTie: true };
  });

  it('shows tie headline', () => {
    const { getByText } = render(
      <MuitoResultsScreen navigation={navigation as any} />
    );
    expect(getByText('muito.multiplayer.resultTie')).toBeTruthy();
  });
});
