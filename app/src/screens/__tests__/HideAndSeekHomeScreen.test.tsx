import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HideAndSeekHomeScreen } from '../HideAndSeekHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockUseHook = jest.fn(() => ({
  bestScore: 0,
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/HideAndSeekContext', () => ({
  useHideAndSeek: () => mockUseHook(),
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

describe('HideAndSeekHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHook.mockReturnValue({
      bestScore: 0,
      updateBestScore: mockUpdateBestScore,
    });
  });

  it('renders title and play button', () => {
    const { getByText } = render(
      <HideAndSeekHomeScreen navigation={navigation as any} />
    );
    expect(getByText('hideAndSeek.home.title')).toBeTruthy();
    expect(getByText('hideAndSeek.home.play')).toBeTruthy();
  });

  it('shows best score when greater than 0', () => {
    mockUseHook.mockReturnValue({
      bestScore: 500,
      updateBestScore: mockUpdateBestScore,
    });
    const { getByText } = render(
      <HideAndSeekHomeScreen navigation={navigation as any} />
    );
    expect(getByText('500')).toBeTruthy();
    expect(getByText('hideAndSeek.home.bestScore')).toBeTruthy();
  });

  it('does not show best score when 0', () => {
    const { queryByText } = render(
      <HideAndSeekHomeScreen navigation={navigation as any} />
    );
    expect(queryByText('hideAndSeek.home.bestScore')).toBeNull();
  });

  it('navigates to game on play press', () => {
    const { getByText } = render(
      <HideAndSeekHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('hideAndSeek.home.play'));
    expect(mockNavigate).toHaveBeenCalledWith('HideAndSeekGame');
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <HideAndSeekHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
