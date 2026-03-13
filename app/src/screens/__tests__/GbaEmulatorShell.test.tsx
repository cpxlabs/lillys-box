import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { GbaEmulatorHomeScreen } from '../GbaEmulatorHomeScreen';
import { GbaEmulatorGameScreen } from '../GbaEmulatorGameScreen';
import { createMockNavigation } from '../../testUtils/backNavigation';

const mockUseGbaEmulator = jest.fn();
const mockImportRom = jest.fn();
const mockSelectRom = jest.fn();
const mockGetRomBlob = jest.fn().mockReturnValue(null);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => (
      typeof options?.count === 'number' ? `${key}:${options.count}` : key
    ),
  }),
}));

jest.mock('../../context/GbaEmulatorContext', () => ({
  useGbaEmulator: () => mockUseGbaEmulator(),
}));

jest.mock('react-native-webview', () => ({
  WebView: ({ testID }: { testID?: string }) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { testID });
  },
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
    mockGetRomBlob.mockReturnValue(null);
    mockUseGbaEmulator.mockReturnValue({
      recentRoms: [],
      hasImportedRoms: false,
      isImportAvailable: false,
      importRom: mockImportRom,
      selectedRomId: null,
      selectRom: mockSelectRom,
      getRomBlob: mockGetRomBlob,
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
      selectedRomId: null,
      selectRom: mockSelectRom,
      getRomBlob: mockGetRomBlob,
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
      selectedRomId: null,
      selectRom: mockSelectRom,
      getRomBlob: mockGetRomBlob,
    });

    const navigation = { navigate: jest.fn() } as any;
    const { getByTestId } = render(<GbaEmulatorHomeScreen navigation={navigation} />);

    fireEvent.press(getByTestId('gba-emulator-import-button'));

    expect(mockImportRom).toHaveBeenCalledTimes(1);
  });

  it('uses the real shared back handler on the home screen', () => {
    const { navigation, mockGoBack } = createMockNavigation({ navigate: jest.fn() });
    const { getByText } = render(<GbaEmulatorHomeScreen navigation={navigation} />);

    fireEvent.press(getByText('← common.back'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
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
      importRom: mockImportRom,
      selectedRomId: null,
      selectRom: mockSelectRom,
      getRomBlob: mockGetRomBlob,
    });

    const navigation = { navigate: jest.fn() } as any;
    const { getByText } = render(<GbaEmulatorGameScreen navigation={navigation} />);

    expect(getByText('gbaEmulator.game.readyTitle')).toBeTruthy();
    expect(getByText('gbaEmulator.game.readyDescription')).toBeTruthy();
  });

  it('uses the real shared back handler on the game screen', () => {
    const { navigation, mockGoBack } = createMockNavigation({ navigate: jest.fn() });
    const { getByText } = render(<GbaEmulatorGameScreen navigation={navigation} />);

    fireEvent.press(getByText('← common.back'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('uses parent navigation when the home screen cannot go back directly', () => {
    const { navigation, mockCanGoBack, mockGetParent } = createMockNavigation({ navigate: jest.fn() });
    const parentGoBack = jest.fn();

    mockCanGoBack.mockReturnValue(false);
    mockGetParent.mockReturnValue({
      goBack: parentGoBack,
      canGoBack: () => true,
      getParent: () => undefined,
    });

    const { getByText } = render(<GbaEmulatorHomeScreen navigation={navigation} />);

    fireEvent.press(getByText('← common.back'));

    expect(parentGoBack).toHaveBeenCalledTimes(1);
  });

  it('creates and cleans up blob URLs for the web emulator shell', () => {
    const originalPlatform = Platform.OS;
    const originalUrl = global.URL;

    try {
      Object.defineProperty(Platform, 'OS', { configurable: true, value: 'web' });

      const createObjectURL = jest
        .fn()
        .mockReturnValueOnce('blob:rom')
        .mockReturnValueOnce('blob:html');
      const revokeObjectURL = jest.fn();

      global.URL = {
        ...originalUrl,
        createObjectURL,
        revokeObjectURL,
      } as typeof URL;

      mockGetRomBlob.mockReturnValue(new Blob(['rom-data'], { type: 'application/octet-stream' }));
      mockUseGbaEmulator.mockReturnValue({
        recentRoms: [{ id: 'emerald', title: 'Pokémon Emerald' }],
        hasImportedRoms: true,
        isImportAvailable: true,
        importRom: mockImportRom,
        selectedRomId: 'emerald',
        selectRom: mockSelectRom,
        getRomBlob: mockGetRomBlob,
      });

      const navigation = { navigate: jest.fn() } as any;
      const { getByTestId, unmount } = render(<GbaEmulatorGameScreen navigation={navigation} />);

      expect(getByTestId('gba-emulator-webview')).toBeTruthy();
      expect(createObjectURL).toHaveBeenCalledTimes(2);

      unmount();

      expect(revokeObjectURL).toHaveBeenCalledWith('blob:rom');
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:html');
    } finally {
      Object.defineProperty(Platform, 'OS', { configurable: true, value: originalPlatform });
      global.URL = originalUrl;
    }
  });
});
