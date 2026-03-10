import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GbaEmulatorProvider } from '../../context/GbaEmulatorContext';
import { GbaEmulatorHomeScreen } from '../GbaEmulatorHomeScreen';
import { GbaEmulatorGameScreen } from '../GbaEmulatorGameScreen';

const mockHandleBack = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/useGameBack', () => ({
  useGameBack: () => mockHandleBack,
}));

jest.mock('../../components/EmojiIcon', () => ({
  EmojiIcon: ({ emoji }: { emoji: string }) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, null, emoji);
  },
}));

describe('GbaEmulator shell screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the home screen empty state and opens the player preview', () => {
    const navigation = { navigate: jest.fn() } as any;
    const { getByText } = render(
      <GbaEmulatorProvider>
        <GbaEmulatorHomeScreen navigation={navigation} />
      </GbaEmulatorProvider>,
    );

    expect(getByText('gbaEmulator.home.emptyStateTitle')).toBeTruthy();
    expect(getByText('gbaEmulator.home.legalDescription')).toBeTruthy();

    fireEvent.press(getByText('gbaEmulator.home.playerPreview'));

    expect(navigation.navigate).toHaveBeenCalledWith('GbaEmulatorGame');
  });

  it('renders the game shell empty state and returns to the library', () => {
    const navigation = { navigate: jest.fn() } as any;
    const { getByText } = render(
      <GbaEmulatorProvider>
        <GbaEmulatorGameScreen navigation={navigation} />
      </GbaEmulatorProvider>,
    );

    expect(getByText('gbaEmulator.game.emptyStateTitle')).toBeTruthy();
    expect(getByText('gbaEmulator.game.saveStateHint')).toBeTruthy();

    fireEvent.press(getByText('gbaEmulator.game.returnToLibrary'));

    expect(navigation.navigate).toHaveBeenCalledWith('GbaEmulatorHome');
  });
});
