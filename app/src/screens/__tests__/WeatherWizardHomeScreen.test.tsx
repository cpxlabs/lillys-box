import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WeatherWizardHomeScreen } from '../WeatherWizardHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockSetDifficulty = jest.fn();
const mockUseHook = jest.fn(() => ({
  bestScore: 0,
  updateBestScore: mockUpdateBestScore,
  difficulty: 'normal',
  setDifficulty: mockSetDifficulty,
}));

jest.mock('../../context/WeatherWizardContext', () => ({
  useWeatherWizard: () => mockUseHook(),
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

describe('WeatherWizardHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHook.mockReturnValue({
      bestScore: 0,
      updateBestScore: mockUpdateBestScore,
      difficulty: 'normal',
      setDifficulty: mockSetDifficulty,
    });
  });

  it('renders title, play button and difficulty controls', () => {
    const { getByText } = render(
      <WeatherWizardHomeScreen navigation={navigation as any} />
    );
    expect(getByText('weatherWizard.home.title')).toBeTruthy();
    expect(getByText('weatherWizard.home.play')).toBeTruthy();
    // difficulty buttons should show labels
    expect(getByText('weatherWizard.home.easy')).toBeTruthy();
    expect(getByText('weatherWizard.home.normal')).toBeTruthy();
    expect(getByText('weatherWizard.home.hard')).toBeTruthy();
  });

  it('shows best score when greater than 0', () => {
    mockUseHook.mockReturnValue({
      bestScore: 500,
      updateBestScore: mockUpdateBestScore,
      difficulty: 'normal',
      setDifficulty: mockSetDifficulty,
    });
    const { getByText } = render(
      <WeatherWizardHomeScreen navigation={navigation as any} />
    );
    expect(getByText('500')).toBeTruthy();
    expect(getByText('weatherWizard.home.bestScore')).toBeTruthy();
  });

  it('does not show best score when 0', () => {
    const { queryByText } = render(
      <WeatherWizardHomeScreen navigation={navigation as any} />
    );
    expect(queryByText('weatherWizard.home.bestScore')).toBeNull();
  });

  it('navigates to game on play press', () => {
    const { getByText } = render(
      <WeatherWizardHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('weatherWizard.home.play'));
    expect(mockNavigate).toHaveBeenCalledWith('WeatherWizardGame');
  });

  it('changes difficulty when a button is pressed', () => {
    const { getByText } = render(
      <WeatherWizardHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('weatherWizard.home.hard'));
    expect(mockSetDifficulty).toHaveBeenCalledWith('hard');
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <WeatherWizardHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
