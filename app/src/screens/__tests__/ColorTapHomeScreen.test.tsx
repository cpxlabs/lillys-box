import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ColorTapHomeScreen } from '../ColorTapHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockUseColorTap = jest.fn(() => ({
  bestScore: 0,
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/ColorTapContext', () => ({
  useColorTap: () => mockUseColorTap(),
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

describe('ColorTapHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorTap.mockReturnValue({
      bestScore: 0,
      updateBestScore: mockUpdateBestScore,
    });
  });

  it('renders title and play button', () => {
    const { getByText } = render(
      <ColorTapHomeScreen navigation={navigation as any} />
    );
    expect(getByText('colorTap.title')).toBeTruthy();
    expect(getByText('colorTap.play')).toBeTruthy();
  });

  it('shows best score when greater than 0', () => {
    mockUseColorTap.mockReturnValue({
      bestScore: 500,
      updateBestScore: mockUpdateBestScore,
    });
    const { getByText } = render(
      <ColorTapHomeScreen navigation={navigation as any} />
    );
    expect(getByText('500')).toBeTruthy();
    expect(getByText('colorTap.bestScore')).toBeTruthy();
  });

  it('does not show best score when 0', () => {
    const { queryByText } = render(
      <ColorTapHomeScreen navigation={navigation as any} />
    );
    expect(queryByText('colorTap.bestScore')).toBeNull();
  });

  it('navigates to game on play press', () => {
    const { getByText } = render(
      <ColorTapHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('colorTap.play'));
    expect(mockNavigate).toHaveBeenCalledWith('ColorTapGame');
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <ColorTapHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
