import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaintSplashHomeScreen } from '../PaintSplashHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockUseHook = jest.fn(() => ({
  bestScore: 0,
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/PaintSplashContext', () => ({
  usePaintSplash: () => mockUseHook(),
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

describe('PaintSplashHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHook.mockReturnValue({
      bestScore: 0,
      updateBestScore: mockUpdateBestScore,
    });
  });

  it('renders title and play button', () => {
    const { getByText } = render(
      <PaintSplashHomeScreen navigation={navigation as any} />
    );
    expect(getByText('paintSplash.home.title')).toBeTruthy();
    expect(getByText('paintSplash.home.play')).toBeTruthy();
  });

  it('shows best score when greater than 0', () => {
    mockUseHook.mockReturnValue({
      bestScore: 500,
      updateBestScore: mockUpdateBestScore,
    });
    const { getByText } = render(
      <PaintSplashHomeScreen navigation={navigation as any} />
    );
    expect(getByText('500')).toBeTruthy();
    expect(getByText('paintSplash.home.bestScore')).toBeTruthy();
  });

  it('does not show best score when 0', () => {
    const { queryByText } = render(
      <PaintSplashHomeScreen navigation={navigation as any} />
    );
    expect(queryByText('paintSplash.home.bestScore')).toBeNull();
  });

  it('navigates to game on play press', () => {
    const { getByText } = render(
      <PaintSplashHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('paintSplash.home.play'));
    expect(mockNavigate).toHaveBeenCalledWith('PaintSplashGame');
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <PaintSplashHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
