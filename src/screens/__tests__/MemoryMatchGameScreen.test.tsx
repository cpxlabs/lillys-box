import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import { MemoryMatchGameScreen } from '../MemoryMatchGameScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockUseMemoryMatch = jest.fn(() => ({
  bestScores: { easy: 0, medium: 0, hard: 0 },
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/MemoryMatchContext', () => ({
  useMemoryMatch: () => mockUseMemoryMatch(),
}));

const mockGoBack = jest.fn();
const navigation = { goBack: mockGoBack };

const makeRoute = (difficulty: 'easy' | 'medium' | 'hard' = 'easy') => ({
  params: { difficulty },
  key: 'test-key',
  name: 'MemoryMatchGame' as const,
});

describe('MemoryMatchGameScreen', () => {
  const originalRandom = Math.random;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseMemoryMatch.mockReturnValue({
      bestScores: { easy: 0, medium: 0, hard: 0 },
      updateBestScore: mockUpdateBestScore,
    });

    jest.spyOn(Dimensions, 'get').mockReturnValue({
      width: 400,
      height: 800,
      scale: 2,
      fontScale: 1,
    });

    // Deterministic random for predictable card layouts
    Math.random = jest.fn(() => 0) as any;
  });

  afterEach(() => {
    Math.random = originalRandom;
    jest.useRealTimers();
  });

  // ── initial render ────────────────────────────────────────────
  it('renders the header with back, moves, and timer', () => {
    const { getByText } = render(
      <MemoryMatchGameScreen navigation={navigation as any} route={makeRoute()} />
    );
    expect(getByText('common.back')).toBeTruthy();
    expect(getByText(/memoryMatch\.moves/)).toBeTruthy();
    expect(getByText('0:00')).toBeTruthy();
  });

  it('renders the difficulty label', () => {
    const { getByText } = render(
      <MemoryMatchGameScreen navigation={navigation as any} route={makeRoute('medium')} />
    );
    expect(getByText('memoryMatch.difficulty.medium')).toBeTruthy();
  });

  it('renders 6 cards for easy difficulty (3 pairs)', () => {
    const { getAllByText } = render(
      <MemoryMatchGameScreen navigation={navigation as any} route={makeRoute('easy')} />
    );
    // Easy = 3 pairs = 6 face-down cards showing "?"
    const questionMarks = getAllByText('?');
    expect(questionMarks.length).toBe(6);
  });

  it('renders 12 cards for medium difficulty (6 pairs)', () => {
    const { getAllByText } = render(
      <MemoryMatchGameScreen navigation={navigation as any} route={makeRoute('medium')} />
    );
    // Medium = 6 pairs = 12 face-down cards showing "?"
    const questionMarks = getAllByText('?');
    expect(questionMarks.length).toBe(12);
  });

  it('renders ? marks on face-down cards', () => {
    const { getAllByText } = render(
      <MemoryMatchGameScreen navigation={navigation as any} route={makeRoute('easy')} />
    );
    const questionMarks = getAllByText('?');
    expect(questionMarks.length).toBe(6);
  });

  // ── card flipping ─────────────────────────────────────────────
  it('reveals emoji when a card is pressed', () => {
    const { getAllByText } = render(
      <MemoryMatchGameScreen navigation={navigation as any} route={makeRoute('easy')} />
    );

    // Press a face-down card (the "?" marks)
    const cards = getAllByText('?');
    fireEvent.press(cards[0]);

    // After pressing, one card should show an emoji instead of "?"
    const remaining = getAllByText('?');
    expect(remaining.length).toBe(5);
  });

  it('increments move counter after flipping two cards', () => {
    const { getAllByText, getByText } = render(
      <MemoryMatchGameScreen navigation={navigation as any} route={makeRoute('easy')} />
    );

    const cards = getAllByText('?');
    fireEvent.press(cards[0]);
    fireEvent.press(cards[1]);

    expect(getByText(/memoryMatch\.moves.*1|1.*memoryMatch\.moves/)).toBeTruthy();
  });

  // ── timer ─────────────────────────────────────────────────────
  it('timer increments each second', () => {
    const { getByText } = render(
      <MemoryMatchGameScreen navigation={navigation as any} route={makeRoute('easy')} />
    );

    expect(getByText('0:00')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(getByText('0:03')).toBeTruthy();
  });

  // ── back navigation ───────────────────────────────────────────
  it('navigates back when back button is pressed', () => {
    const { getByText } = render(
      <MemoryMatchGameScreen navigation={navigation as any} route={makeRoute()} />
    );
    fireEvent.press(getByText('common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  // ── no game over initially ────────────────────────────────────
  it('does not show game over overlay on initial render', () => {
    const { queryByText } = render(
      <MemoryMatchGameScreen navigation={navigation as any} route={makeRoute()} />
    );
    expect(queryByText('memoryMatch.gameOver.title')).toBeNull();
  });
});
