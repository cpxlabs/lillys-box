import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GbaEmulatorHomeScreen } from '../GbaEmulatorHomeScreen';
import { GbaEmulatorGameScreen } from '../GbaEmulatorGameScreen';

const mockHandleBack = jest.fn();
const mockUseGbaEmulator = jest.fn();
const mockImportRom = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => (
      typeof options?.count === 'number' ? `${key}:${options.count}` : key
    ),
  }),
}));

jest.mock('../../hooks/useGameBack', () => ({
  useGameBack: () => mockHandleBack,
}));

jest.mock('../../context/GbaEmulatorContext', () => ({
  useGbaEmulator: () => mockUseGbaEmulator(),
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
    mockUseGbaEmulator.mockReturnValue({
      recentRoms: [],
      hasImportedRoms: false,
      isImportAvailable: false,
      importRom: mockImportRom,
    });
  });

  it('renders the home screen empty state, disables import, and opens the player preview', () => {
    const navigation = { navigate: jest.fn() } as any;
    const { getByText, getByTestId } = render(<GbaEmulatorHomeScreen navigation={navigation} />);

    expect(getByText('gbaEmulator.home.emptyStateTitle')).toBeTruthy();
    expect(getByText('gbaEmulator.home.legalDescription')).toBeTruthy();
    expect(getByTestId('gba-emulator-import-button').props.disabled).toBe(true);

    fireEvent.press(getByText('gbaEmulator.home.playerPreview'));

    expect(navigation.navigate).toHaveBeenCalledWith('GbaEmulatorGame');
  });

  it('renders the home screen ready state when roms are available', () => {
    mockUseGbaEmulator.mockReturnValue({
      recentRoms: [
        { id: 'emerald', title: 'Pokémon Emerald' },
        { id: 'minish-cap', title: 'The Minish Cap' },
      ],
      hasImportedRoms: true,
      isImportAvailable: true,
      importRom: mockImportRom,
    });

    const navigation = { navigate: jest.fn() } as any;
    const { getByText, getByTestId } = render(<GbaEmulatorHomeScreen navigation={navigation} />);

    expect(getByText('gbaEmulator.home.libraryReadyTitle')).toBeTruthy();
    expect(getByText('gbaEmulator.home.libraryReadyDescription:2')).toBeTruthy();
    expect(getByTestId('gba-emulator-import-button').props.disabled).toBe(false);
    expect(getByText('gbaEmulator.home.importButton')).toBeTruthy();
  });

  it('triggers ROM import when the import button is available', () => {
    mockUseGbaEmulator.mockReturnValue({
      recentRoms: [],
      hasImportedRoms: false,
      isImportAvailable: true,
      importRom: mockImportRom,
    });

    const navigation = { navigate: jest.fn() } as any;
    const { getByTestId } = render(<GbaEmulatorHomeScreen navigation={navigation} />);

    fireEvent.press(getByTestId('gba-emulator-import-button'));

    expect(mockImportRom).toHaveBeenCalledTimes(1);
  });

  it('uses the shared back handler on the home screen', () => {
    const navigation = { navigate: jest.fn() } as any;
    const { getByText } = render(<GbaEmulatorHomeScreen navigation={navigation} />);

    fireEvent.press(getByText('← common.back'));

    expect(mockHandleBack).toHaveBeenCalledTimes(1);
  });

  it('renders the game shell empty state and returns to the library', () => {
    const navigation = { navigate: jest.fn() } as any;
    const { getByText } = render(<GbaEmulatorGameScreen navigation={navigation} />);

    expect(getByText('gbaEmulator.game.emptyStateTitle')).toBeTruthy();
    expect(getByText('gbaEmulator.game.saveStateHint')).toBeTruthy();

    fireEvent.press(getByText('gbaEmulator.game.returnToLibrary'));

    expect(navigation.navigate).toHaveBeenCalledWith('GbaEmulatorHome');
  });

  it('renders the ready-to-play state when roms are available', () => {
    mockUseGbaEmulator.mockReturnValue({
      recentRoms: [{ id: 'emerald', title: 'Pokémon Emerald' }],
      hasImportedRoms: true,
      isImportAvailable: true,
    });

    const navigation = { navigate: jest.fn() } as any;
    const { getByText } = render(<GbaEmulatorGameScreen navigation={navigation} />);

    expect(getByText('gbaEmulator.game.readyTitle')).toBeTruthy();
    expect(getByText('gbaEmulator.game.readyDescription')).toBeTruthy();
  });

  it('uses the shared back handler on the game screen', () => {
    const navigation = { navigate: jest.fn() } as any;
    const { getByText } = render(<GbaEmulatorGameScreen navigation={navigation} />);

    fireEvent.press(getByText('← common.back'));

    expect(mockHandleBack).toHaveBeenCalledTimes(1);
  });
});
