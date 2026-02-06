import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PetRunnerHomeScreen } from '../PetRunnerHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockUsePetRunner = jest.fn(() => ({
  bestScore: 0,
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/PetRunnerContext', () => ({
  usePetRunner: () => mockUsePetRunner(),
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

describe('PetRunnerHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePetRunner.mockReturnValue({
      bestScore: 0,
      updateBestScore: mockUpdateBestScore,
    });
  });

  it('renders title and play button', () => {
    const { getByText } = render(
      <PetRunnerHomeScreen navigation={navigation as any} />
    );
    expect(getByText('petRunner.title')).toBeTruthy();
    expect(getByText('petRunner.play')).toBeTruthy();
    expect(getByText('petRunner.instructions')).toBeTruthy();
  });

  it('shows best score when greater than 0', () => {
    mockUsePetRunner.mockReturnValue({
      bestScore: 250,
      updateBestScore: mockUpdateBestScore,
    });
    const { getByText } = render(
      <PetRunnerHomeScreen navigation={navigation as any} />
    );
    expect(getByText('250')).toBeTruthy();
    expect(getByText('petRunner.bestScore')).toBeTruthy();
  });

  it('does not show best score when 0', () => {
    const { queryByText } = render(
      <PetRunnerHomeScreen navigation={navigation as any} />
    );
    expect(queryByText('petRunner.bestScore')).toBeNull();
  });

  it('navigates to PetRunnerGame on play press', () => {
    const { getByText } = render(
      <PetRunnerHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('petRunner.play'));
    expect(mockNavigate).toHaveBeenCalledWith('PetRunnerGame');
  });

  it('navigates back on back press', () => {
    const { getByText } = render(
      <PetRunnerHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
