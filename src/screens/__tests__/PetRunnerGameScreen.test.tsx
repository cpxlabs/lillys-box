import React from 'react';
import { Dimensions } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { PetRunnerGameScreen } from '../PetRunnerGameScreen';

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

const mockGoBack = jest.fn();
const navigation = { goBack: mockGoBack };

describe('PetRunnerGameScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePetRunner.mockReturnValue({
      bestScore: 0,
      updateBestScore: mockUpdateBestScore,
    });

    jest.spyOn(Dimensions, 'get').mockReturnValue({
      width: 400,
      height: 800,
      scale: 2,
      fontScale: 1,
    });

    global.requestAnimationFrame = jest.fn((cb) => 1) as any;
    global.cancelAnimationFrame = jest.fn() as any;
  });

  it('renders initial ready state with tap to start message', () => {
    const { getByText } = render(
      <PetRunnerGameScreen navigation={navigation as any} />
    );
    expect(getByText('petRunner.tapToStart')).toBeTruthy();
  });

  it('renders the back button and distance header', () => {
    const { getByText } = render(
      <PetRunnerGameScreen navigation={navigation as any} />
    );
    expect(getByText('common.back')).toBeTruthy();
    expect(getByText('0m')).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const { getByText } = render(
      <PetRunnerGameScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders the pet emoji on screen', () => {
    const { getAllByText } = render(
      <PetRunnerGameScreen navigation={navigation as any} />
    );
    // Pet emoji appears at least once (in game area) plus possibly in start overlay
    const cats = getAllByText('🐱');
    expect(cats.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the ground element', () => {
    const { toJSON } = render(
      <PetRunnerGameScreen navigation={navigation as any} />
    );
    // The component should render without crashing (ground is a View)
    expect(toJSON()).toBeTruthy();
  });
});
