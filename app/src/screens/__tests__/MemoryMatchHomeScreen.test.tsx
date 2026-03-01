import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MemoryMatchHomeScreen } from '../MemoryMatchHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();

const defaultBestScores = {
  classic: { easy: 0, medium: 0, hard: 0, expert: 0 },
  timeAttack: { easy: 0, medium: 0, hard: 0, expert: 0 },
};

const mockUseMemoryMatch = jest.fn(() => ({
  bestScores: defaultBestScores,
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/MemoryMatchContext', () => ({
  useMemoryMatch: () => mockUseMemoryMatch(),
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

describe('MemoryMatchHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMemoryMatch.mockReturnValue({
      bestScores: defaultBestScores,
      updateBestScore: mockUpdateBestScore,
    });
  });

  it('renders title and play button', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    expect(getByText('memoryMatch.title')).toBeTruthy();
    expect(getByText('memoryMatch.play')).toBeTruthy();
  });

  it('renders all four difficulty buttons', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    expect(getByText('memoryMatch.difficulty.easy')).toBeTruthy();
    expect(getByText('memoryMatch.difficulty.medium')).toBeTruthy();
    expect(getByText('memoryMatch.difficulty.hard')).toBeTruthy();
    expect(getByText('memoryMatch.difficulty.expert')).toBeTruthy();
  });

  it('renders both mode buttons', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    expect(getByText('memoryMatch.mode.classic')).toBeTruthy();
    expect(getByText('memoryMatch.mode.timeAttack')).toBeTruthy();
  });

  it('shows best score when selected difficulty+mode has score > 0', () => {
    mockUseMemoryMatch.mockReturnValue({
      bestScores: {
        classic: { easy: 300, medium: 0, hard: 0, expert: 0 },
        timeAttack: { easy: 0, medium: 0, hard: 0, expert: 0 },
      },
      updateBestScore: mockUpdateBestScore,
    });
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    expect(getByText('300')).toBeTruthy();
    expect(getByText('memoryMatch.bestScore')).toBeTruthy();
  });

  it('does not show best score when 0', () => {
    const { queryByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    expect(queryByText('memoryMatch.bestScore')).toBeNull();
  });

  it('navigates to game with default easy+classic on play', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('memoryMatch.play'));
    expect(mockNavigate).toHaveBeenCalledWith('MemoryMatchGame', {
      difficulty: 'easy',
      mode: 'classic',
    });
  });

  it('navigates with selected difficulty and mode', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('memoryMatch.difficulty.expert'));
    fireEvent.press(getByText('memoryMatch.mode.timeAttack'));
    fireEvent.press(getByText('memoryMatch.play'));
    expect(mockNavigate).toHaveBeenCalledWith('MemoryMatchGame', {
      difficulty: 'expert',
      mode: 'timeAttack',
    });
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
