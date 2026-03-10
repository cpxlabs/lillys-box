import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { KidsChessHomeScreen } from '../KidsChessHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockUseKidsChess = jest.fn(() => ({
  bestScore: 0,
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/KidsChessContext', () => ({
  useKidsChess: () => mockUseKidsChess(),
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

describe('KidsChessHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseKidsChess.mockReturnValue({
      bestScore: 0,
      updateBestScore: mockUpdateBestScore,
    });
  });

  it('renders title and play button', () => {
    const { getByText } = render(
      <KidsChessHomeScreen navigation={navigation as any} />,
    );
    expect(getByText('kidsChess.title')).toBeTruthy();
    expect(getByText('kidsChess.play')).toBeTruthy();
  });

  it('renders all five difficulty options', () => {
    const { getByText } = render(
      <KidsChessHomeScreen navigation={navigation as any} />,
    );
    expect(getByText('kidsChess.difficulty.puppy')).toBeTruthy();
    expect(getByText('kidsChess.difficulty.kitten')).toBeTruthy();
    expect(getByText('kidsChess.difficulty.bunny')).toBeTruthy();
    expect(getByText('kidsChess.difficulty.fox')).toBeTruthy();
    expect(getByText('kidsChess.difficulty.owl')).toBeTruthy();
  });

  it('shows best score when greater than 0', () => {
    mockUseKidsChess.mockReturnValue({
      bestScore: 300,
      updateBestScore: mockUpdateBestScore,
    });
    const { getByText } = render(
      <KidsChessHomeScreen navigation={navigation as any} />,
    );
    expect(getByText('kidsChess.bestScore')).toBeTruthy();
    expect(getByText('300')).toBeTruthy();
  });

  it('does not show best score when 0', () => {
    const { queryByText } = render(
      <KidsChessHomeScreen navigation={navigation as any} />,
    );
    expect(queryByText('kidsChess.bestScore')).toBeNull();
  });

  it('navigates to game with default puppy difficulty on play press', () => {
    const { getByText } = render(
      <KidsChessHomeScreen navigation={navigation as any} />,
    );
    fireEvent.press(getByText('kidsChess.play'));
    expect(mockNavigate).toHaveBeenCalledWith('KidsChessGame', { difficulty: 'puppy' });
  });

  it('navigates to game with selected difficulty', () => {
    const { getByText } = render(
      <KidsChessHomeScreen navigation={navigation as any} />,
    );
    fireEvent.press(getByText('kidsChess.difficulty.owl'));
    fireEvent.press(getByText('kidsChess.play'));
    expect(mockNavigate).toHaveBeenCalledWith('KidsChessGame', { difficulty: 'owl' });
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <KidsChessHomeScreen navigation={navigation as any} />,
    );
    fireEvent.press(getByText('common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
