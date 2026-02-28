import React from 'react';
import { Dimensions, Animated } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import { PetTaxiGameScreen } from '../PetTaxiGameScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockUsePetTaxi = jest.fn(() => ({
  bestScore: 0,
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/PetTaxiContext', () => ({
  usePetTaxi: () => mockUsePetTaxi(),
}));

const mockGoBack = jest.fn();
const navigation = {
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(() => undefined),
};

describe('PetTaxiGameScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUsePetTaxi.mockReturnValue({
      bestScore: 0,
      updateBestScore: mockUpdateBestScore,
    });

    jest.spyOn(Dimensions, 'get').mockReturnValue({
      width: 390,
      height: 844,
      scale: 2,
      fontScale: 1,
    });

    jest.spyOn(Animated, 'timing').mockReturnValue({
      start: jest.fn(),
      stop: jest.fn(),
      reset: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial game state with score, timer, and controls', () => {
    const { getByText } = render(
      <PetTaxiGameScreen navigation={navigation as any} />
    );
    expect(getByText('60s')).toBeTruthy();
    expect(getByText('Lane 2/3')).toBeTruthy();
    expect(getByText('◀')).toBeTruthy();
    expect(getByText('▶')).toBeTruthy();
  });

  it('renders the back button', () => {
    const { getByText } = render(
      <PetTaxiGameScreen navigation={navigation as any} />
    );
    expect(getByText('← common.back')).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const { getByText } = render(
      <PetTaxiGameScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders the taxi emoji', () => {
    const { getAllByText } = render(
      <PetTaxiGameScreen navigation={navigation as any} />
    );
    const taxis = getAllByText('🚕');
    expect(taxis.length).toBeGreaterThanOrEqual(1);
  });

  it('moves car left when left control is pressed', () => {
    const { getByText } = render(
      <PetTaxiGameScreen navigation={navigation as any} />
    );
    // Start at lane 2 (index 1)
    expect(getByText('Lane 2/3')).toBeTruthy();

    fireEvent.press(getByText('◀'));
    expect(getByText('Lane 1/3')).toBeTruthy();
  });

  it('moves car right when right control is pressed', () => {
    const { getByText } = render(
      <PetTaxiGameScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('▶'));
    expect(getByText('Lane 3/3')).toBeTruthy();
  });

  it('does not move car past left boundary', () => {
    const { getByText } = render(
      <PetTaxiGameScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('◀'));
    expect(getByText('Lane 1/3')).toBeTruthy();

    fireEvent.press(getByText('◀'));
    expect(getByText('Lane 1/3')).toBeTruthy();
  });

  it('does not move car past right boundary', () => {
    const { getByText } = render(
      <PetTaxiGameScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('▶'));
    expect(getByText('Lane 3/3')).toBeTruthy();

    fireEvent.press(getByText('▶'));
    expect(getByText('Lane 3/3')).toBeTruthy();
  });

  it('spawns passengers after interval', () => {
    const { queryAllByText } = render(
      <PetTaxiGameScreen navigation={navigation as any} />
    );

    // No passengers initially
    const passengerEmojis = ['🐱', '🐶', '🐰', '🦊', '🐻'];
    const initialCount = passengerEmojis.reduce(
      (sum, e) => sum + queryAllByText(e).length,
      0
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const afterSpawnCount = passengerEmojis.reduce(
      (sum, e) => sum + queryAllByText(e).length,
      0
    );
    expect(afterSpawnCount).toBeGreaterThan(initialCount);
  });

  it('decrements timer every second', () => {
    const { getByText } = render(
      <PetTaxiGameScreen navigation={navigation as any} />
    );
    expect(getByText('60s')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getByText('57s')).toBeTruthy();
  });

  it('shows game over modal when timer reaches zero', () => {
    const { getByText } = render(
      <PetTaxiGameScreen navigation={navigation as any} />
    );

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(getByText('petTaxi.game.gameOver')).toBeTruthy();
    expect(getByText('petTaxi.game.playAgain')).toBeTruthy();
  });

  it('calls updateBestScore when game ends', () => {
    render(<PetTaxiGameScreen navigation={navigation as any} />);

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(mockUpdateBestScore).toHaveBeenCalledWith(0);
  });

  it('restarts game when play again is pressed', () => {
    const { getByText } = render(
      <PetTaxiGameScreen navigation={navigation as any} />
    );

    // End the game
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    expect(getByText('petTaxi.game.gameOver')).toBeTruthy();

    // Restart
    fireEvent.press(getByText('petTaxi.game.playAgain'));
    expect(getByText('60s')).toBeTruthy();

    // Timer should be running again after restart
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getByText('57s')).toBeTruthy();
  });
});
