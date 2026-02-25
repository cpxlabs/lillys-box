import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WhackAMoleHomeScreen } from '../WhackAMoleHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockUseWhackAMole = jest.fn(() => ({
  bestScore: 0,
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/WhackAMoleContext', () => ({
  useWhackAMole: () => mockUseWhackAMole(),
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

describe('WhackAMoleHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWhackAMole.mockReturnValue({
      bestScore: 0,
      updateBestScore: mockUpdateBestScore,
    });
  });

  it('renders title and play button', () => {
    const { getByText } = render(
      <WhackAMoleHomeScreen navigation={navigation as any} />
    );
    expect(getByText('whackAMole.home.title')).toBeTruthy();
    expect(getByText('whackAMole.home.play')).toBeTruthy();
    expect(getByText('whackAMole.home.subtitle')).toBeTruthy();
    expect(getByText('whackAMole.home.instructions')).toBeTruthy();
  });

  it('shows best score when greater than 0', () => {
    mockUseWhackAMole.mockReturnValue({
      bestScore: 850,
      updateBestScore: mockUpdateBestScore,
    });
    const { getByText } = render(
      <WhackAMoleHomeScreen navigation={navigation as any} />
    );
    expect(getByText('850')).toBeTruthy();
    expect(getByText('whackAMole.home.bestScore')).toBeTruthy();
  });

  it('does not show best score when 0', () => {
    const { queryByText } = render(
      <WhackAMoleHomeScreen navigation={navigation as any} />
    );
    expect(queryByText('whackAMole.home.bestScore')).toBeNull();
  });

  it('navigates to WhackAMoleGame on play press', () => {
    const { getByText } = render(
      <WhackAMoleHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('whackAMole.home.play'));
    expect(mockNavigate).toHaveBeenCalledWith('WhackAMoleGame');
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <WhackAMoleHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('uses parent navigation when canGoBack returns false', () => {
    const mockParentGoBack = jest.fn();
    mockCanGoBack.mockReturnValue(false);
    mockGetParent.mockReturnValue({ goBack: mockParentGoBack });

    const { getByText } = render(
      <WhackAMoleHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(mockParentGoBack).toHaveBeenCalledTimes(1);
  });
});
