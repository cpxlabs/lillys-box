import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ColorMixerHomeScreen } from '../ColorMixerHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: (props: any) => <View {...props} /> };
});

jest.mock('../../data/colorMixerLevels', () => ({
  TOTAL_LEVELS: 10,
}));

const mockUseColorMixer = jest.fn(() => ({
  getTotalStars: () => 0,
  getCompletedLevelsCount: () => 0,
  getLevelProgress: jest.fn(),
  updateLevelProgress: jest.fn(),
  resetProgress: jest.fn(),
}));

jest.mock('../../context/ColorMixerContext', () => ({
  useColorMixer: () => mockUseColorMixer(),
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

describe('ColorMixerHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorMixer.mockReturnValue({
      getTotalStars: () => 0,
      getCompletedLevelsCount: () => 0,
      getLevelProgress: jest.fn(),
      updateLevelProgress: jest.fn(),
      resetProgress: jest.fn(),
    });
  });

  it('renders title and play button', () => {
    const { getByText } = render(
      <ColorMixerHomeScreen navigation={navigation as any} />
    );
    expect(getByText('colorMixer.title')).toBeTruthy();
    expect(getByText('colorMixer.play')).toBeTruthy();
  });

  it('shows progress information', () => {
    mockUseColorMixer.mockReturnValue({
      getTotalStars: () => 15,
      getCompletedLevelsCount: () => 5,
      getLevelProgress: jest.fn(),
      updateLevelProgress: jest.fn(),
      resetProgress: jest.fn(),
    });
    const { getByText } = render(
      <ColorMixerHomeScreen navigation={navigation as any} />
    );
    expect(getByText('colorMixer.levelsCompleted')).toBeTruthy();
    expect(getByText('5/10')).toBeTruthy();
    expect(getByText('colorMixer.totalStars')).toBeTruthy();
    expect(getByText('15/30')).toBeTruthy();
  });

  it('navigates to levels on play press', () => {
    const { getByText } = render(
      <ColorMixerHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('colorMixer.play'));
    expect(mockNavigate).toHaveBeenCalledWith('ColorMixerLevels');
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <ColorMixerHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
