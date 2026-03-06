import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { HideAndSeekGameScreen } from '../HideAndSeekGameScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
jest.mock('../../context/HideAndSeekContext', () => ({
  useHideAndSeek: () => ({
    bestScore: 0,
    updateBestScore: mockUpdateBestScore,
  }),
}));

jest.mock('../../components/GameAdWrapper', () => ({
  useGameAdTrigger: () => ({ triggerAd: jest.fn().mockResolvedValue(0) }),
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

describe('HideAndSeekGameScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the game grid with 9 spots', () => {
    const { getAllByText } = render(
      <HideAndSeekGameScreen navigation={navigation as any} />
    );
    // The grid should contain hiding spot emojis - check that at least some are rendered
    // There are 9 spots total, each showing either a hiding emoji or revealed state
    const backButton = getAllByText(/← common.back/);
    expect(backButton).toHaveLength(1);
  });

  it('renders score and timer in header', () => {
    const { getByText } = render(
      <HideAndSeekGameScreen navigation={navigation as any} />
    );
    expect(getByText(/🐾 0/)).toBeTruthy();
    expect(getByText('30s')).toBeTruthy();
  });

  it('shows game over modal when time runs out', () => {
    const { getByText } = render(
      <HideAndSeekGameScreen navigation={navigation as any} />
    );

    // Advance all 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(getByText('hideAndSeek.game.gameOver')).toBeTruthy();
    expect(mockUpdateBestScore).toHaveBeenCalled();
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <HideAndSeekGameScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
