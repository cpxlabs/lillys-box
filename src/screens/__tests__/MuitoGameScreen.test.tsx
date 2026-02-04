import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { MuitoGameScreen } from '../MuitoGameScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockAddScore = jest.fn();
const mockUseMuito = jest.fn(() => ({
  score: 0,
  addScore: mockAddScore,
}));

jest.mock('../../context/MuitoContext', () => ({
  useMuito: () => mockUseMuito(),
}));

const mockGoBack = jest.fn();
const navigation = { goBack: mockGoBack };

/*
 * Deterministic puzzle when Math.random always returns 0 and round = 1
 *
 *   minCount = 2, maxCount = 4
 *   count    = 2 + floor(0 × 3) = 2
 *   emoji    = EMOJIS[floor(0 × 12)] = '🍎'
 *   pool     = [1, 3, 4, 5]  (max(1, 2-3)..2+3 minus 2)
 *   pool after Fisher-Yates (j always 0) = [3, 4, 5, 1]
 *   options  = [2, 3, 4, 5]  (count + pool[0..2])
 *   options after Fisher-Yates (j always 0) = [3, 4, 5, 2]
 *
 *   → 2 copies of 🍎 rendered, correct answer is 2
 */

describe('MuitoGameScreen', () => {
  const originalRandom = Math.random;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseMuito.mockReturnValue({ score: 0, addScore: mockAddScore });
    Math.random = jest.fn(() => 0) as any;
  });

  afterEach(() => {
    Math.random = originalRandom;
    jest.useRealTimers();
  });

  // ── initial render ────────────────────────────────────────────
  it('renders 4 answer option buttons', () => {
    const { getByText } = render(
      <MuitoGameScreen navigation={navigation as any} />
    );
    expect(getByText('3')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  it('renders the correct number of emoji objects inside the card', () => {
    const { getAllByText } = render(
      <MuitoGameScreen navigation={navigation as any} />
    );
    // count = 2 → two 🍎 rendered
    const emojis = getAllByText('🍎');
    expect(emojis).toHaveLength(2);
  });

  it('renders the score label', () => {
    const { getByText } = render(
      <MuitoGameScreen navigation={navigation as any} />
    );
    // The score label and value are siblings inside one <Text>, so match via regex
    expect(getByText(/muito\.score/)).toBeTruthy();
  });

  // ── correct answer ────────────────────────────────────────────
  it('shows correct feedback and awards 10 points', () => {
    const { getByText } = render(
      <MuitoGameScreen navigation={navigation as any} />
    );

    fireEvent.press(getByText('2')); // correct answer

    expect(getByText('muito.correct')).toBeTruthy();
    expect(mockAddScore).toHaveBeenCalledTimes(1);
    expect(mockAddScore).toHaveBeenCalledWith(10);
  });

  // ── wrong answer ──────────────────────────────────────────────
  it('shows wrong feedback and does not award points', () => {
    const { getByText } = render(
      <MuitoGameScreen navigation={navigation as any} />
    );

    fireEvent.press(getByText('3')); // wrong answer

    expect(getByText('muito.wrong')).toBeTruthy();
    expect(mockAddScore).not.toHaveBeenCalled();
  });

  // ── input lock after selection ────────────────────────────────
  it('ignores taps after the first selection', () => {
    const { getByText } = render(
      <MuitoGameScreen navigation={navigation as any} />
    );

    fireEvent.press(getByText('2')); // first tap – correct
    fireEvent.press(getByText('3')); // second tap – should be ignored

    expect(mockAddScore).toHaveBeenCalledTimes(1);
  });

  // ── auto-advance ──────────────────────────────────────────────
  it('clears feedback and advances round after 1500 ms', () => {
    const { getByText, queryByText } = render(
      <MuitoGameScreen navigation={navigation as any} />
    );

    fireEvent.press(getByText('2')); // answer → feedback shown
    expect(getByText('muito.correct')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // New round: isCorrect reset → feedback gone
    expect(queryByText('muito.correct')).toBeNull();
    // Options re-rendered (new puzzle, same values because random is 0)
    expect(getByText('2')).toBeTruthy();
  });

  it('does not advance before 1500 ms have elapsed', () => {
    const { getByText } = render(
      <MuitoGameScreen navigation={navigation as any} />
    );

    fireEvent.press(getByText('3')); // wrong
    expect(getByText('muito.wrong')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1499); // just shy of the delay
    });

    // Feedback still visible
    expect(getByText('muito.wrong')).toBeTruthy();
  });

  // ── back navigation ───────────────────────────────────────────
  it('back button navigates back to home', () => {
    const { getByText } = render(
      <MuitoGameScreen navigation={navigation as any} />
    );

    fireEvent.press(getByText('common.back'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
