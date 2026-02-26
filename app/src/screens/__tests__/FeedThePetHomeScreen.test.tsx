import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FeedThePetHomeScreen } from '../FeedThePetHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockUseFeedThePet = jest.fn(() => ({
  bestScore: 0,
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/FeedThePetContext', () => ({
  useFeedThePet: () => mockUseFeedThePet(),
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

describe('FeedThePetHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFeedThePet.mockReturnValue({
      bestScore: 0,
      updateBestScore: mockUpdateBestScore,
    });
  });

  it('renders title and play button', () => {
    const { getByText } = render(
      <FeedThePetHomeScreen navigation={navigation as any} />
    );
    expect(getByText('feedThePet.home.title')).toBeTruthy();
    expect(getByText('feedThePet.home.play')).toBeTruthy();
    expect(getByText('feedThePet.home.subtitle')).toBeTruthy();
    expect(getByText('feedThePet.home.instructions')).toBeTruthy();
  });

  it('shows best score when greater than 0', () => {
    mockUseFeedThePet.mockReturnValue({
      bestScore: 350,
      updateBestScore: mockUpdateBestScore,
    });
    const { getByText } = render(
      <FeedThePetHomeScreen navigation={navigation as any} />
    );
    expect(getByText('350')).toBeTruthy();
    expect(getByText('feedThePet.home.bestScore')).toBeTruthy();
  });

  it('does not show best score when 0', () => {
    const { queryByText } = render(
      <FeedThePetHomeScreen navigation={navigation as any} />
    );
    expect(queryByText('feedThePet.home.bestScore')).toBeNull();
  });

  it('navigates to FeedThePetGame on play press', () => {
    const { getByText } = render(
      <FeedThePetHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('feedThePet.home.play'));
    expect(mockNavigate).toHaveBeenCalledWith('FeedThePetGame');
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <FeedThePetHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('uses parent navigation when canGoBack returns false', () => {
    const mockParentGoBack = jest.fn();
    mockCanGoBack.mockReturnValue(false);
    mockGetParent.mockReturnValue({
      goBack: mockParentGoBack,
      canGoBack: () => true,
      getParent: () => undefined,
    });

    const { getByText } = render(
      <FeedThePetHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(mockParentGoBack).toHaveBeenCalledTimes(1);
  });
});
