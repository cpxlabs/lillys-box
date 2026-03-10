import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SlidingPuzzleHomeScreen } from '../SlidingPuzzleHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestMoves = jest.fn();
const mockUseSlidingPuzzle = jest.fn(() => ({
  bestMoves: { easy: null, hard: null },
  updateBestMoves: mockUpdateBestMoves,
}));

jest.mock('../../context/SlidingPuzzleContext', () => ({
  useSlidingPuzzle: () => mockUseSlidingPuzzle(),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockGetParent = jest.fn(() => ({ goBack: jest.fn() }));

const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  canGoBack: mockCanGoBack,
  getParent: mockGetParent,
};

describe('SlidingPuzzleHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSlidingPuzzle.mockReturnValue({
      bestMoves: { easy: null, hard: null },
      updateBestMoves: mockUpdateBestMoves,
    });
  });

  it('renders title and difficulty buttons', () => {
    const { getByText } = render(
      <SlidingPuzzleHomeScreen navigation={navigation as any} />
    );
    expect(getByText('slidingPuzzle.home.title')).toBeTruthy();
    expect(getByText('slidingPuzzle.home.easy')).toBeTruthy();
    expect(getByText('slidingPuzzle.home.hard')).toBeTruthy();
  });

  it('shows best moves when not null', () => {
    mockUseSlidingPuzzle.mockReturnValue({
      bestMoves: { easy: 15, hard: null },
      updateBestMoves: mockUpdateBestMoves,
    });
    const { getByText, queryAllByText: _queryAllByText } = render(
      <SlidingPuzzleHomeScreen navigation={navigation as any} />
    );
    expect(getByText(/15/)).toBeTruthy();
  });

  it('does not show best moves when null', () => {
    const { queryByText } = render(
      <SlidingPuzzleHomeScreen navigation={navigation as any} />
    );
    expect(queryByText('slidingPuzzle.home.best')).toBeNull();
  });

  it('navigates to game with easy difficulty', () => {
    const { getByText } = render(
      <SlidingPuzzleHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('slidingPuzzle.home.easy'));
    expect(mockNavigate).toHaveBeenCalledWith('SlidingPuzzleGame', { difficulty: 'easy' });
  });

  it('navigates to game with hard difficulty', () => {
    const { getByText } = render(
      <SlidingPuzzleHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('slidingPuzzle.home.hard'));
    expect(mockNavigate).toHaveBeenCalledWith('SlidingPuzzleGame', { difficulty: 'hard' });
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <SlidingPuzzleHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
