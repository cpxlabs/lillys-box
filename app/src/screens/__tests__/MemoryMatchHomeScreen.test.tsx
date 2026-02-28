import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MemoryMatchHomeScreen } from '../MemoryMatchHomeScreen';

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
      bestScores: { easy: 0, medium: 0, hard: 0 },
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

  it('renders difficulty selection buttons', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    expect(getByText('memoryMatch.difficulty.easy')).toBeTruthy();
    expect(getByText('memoryMatch.difficulty.medium')).toBeTruthy();
    expect(getByText('memoryMatch.difficulty.hard')).toBeTruthy();
  });

  it('shows best score when selected difficulty has score > 0', () => {
    mockUseMemoryMatch.mockReturnValue({
      bestScores: { easy: 300, medium: 0, hard: 0 },
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

  it('navigates to game with default easy difficulty', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('memoryMatch.play'));
    expect(mockNavigate).toHaveBeenCalledWith('MemoryMatchGame', { difficulty: 'easy' });
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
