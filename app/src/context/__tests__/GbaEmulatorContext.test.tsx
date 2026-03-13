import React from 'react';
import { Platform, Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GbaEmulatorProvider, useGbaEmulator } from '../GbaEmulatorContext';

type TestDocument = {
  createElement: jest.Mock;
  body: { appendChild: jest.Mock };
};

type TestWindow = {
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
};

let hook: ReturnType<typeof useGbaEmulator>;

const Consumer = () => {
  hook = useGbaEmulator();
  return <Text>{hook.recentRoms.length}</Text>;
};

const renderProvider = () =>
  render(
    <GbaEmulatorProvider>
      <Consumer />
    </GbaEmulatorProvider>
  );

describe('GbaEmulatorContext', () => {
  let originalOS: typeof Platform.OS;
  const globalWithDom = global as typeof globalThis & { document?: TestDocument; window?: TestWindow };
  let originalDocument: TestDocument | undefined;
  let originalWindow: TestWindow | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    originalOS = Platform.OS;
    originalDocument = globalWithDom.document;
    originalWindow = globalWithDom.window;
    (Platform as { OS: string }).OS = 'web';
  });

  afterEach(() => {
    (Platform as { OS: string }).OS = originalOS;

    if (originalDocument) {
      globalWithDom.document = originalDocument;
    } else {
      delete globalWithDom.document;
    }

    if (originalWindow) {
      globalWithDom.window = originalWindow;
    } else {
      delete globalWithDom.window;
    }
  });

  it('loads recent ROMs from storage on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify([{ id: 'emerald.gba:1:2', title: 'Pokémon Emerald' }])
    );

    globalWithDom.document = {
      createElement: jest.fn(),
      body: { appendChild: jest.fn() },
    };
    globalWithDom.window = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      setTimeout,
      clearTimeout,
    };

    renderProvider();
    await act(async () => {});

    expect(hook.isImportAvailable).toBe(true);
    expect(hook.hasImportedRoms).toBe(true);
    expect(hook.recentRoms).toEqual([{ id: 'emerald.gba:1:2', title: 'Pokémon Emerald' }]);
  });

  it('imports a web ROM and stores it as a recent game', async () => {
    const eventHandlers: Record<string, () => void> = {};
    const input = {
      files: [{ name: 'Pokemon Emerald.gba', size: 1024, lastModified: 7 }],
      remove: jest.fn(),
      click: jest.fn(() => {
        eventHandlers.change?.();
      }),
      addEventListener: jest.fn((event: string, handler: () => void) => {
        eventHandlers[event] = handler;
      }),
    };

    globalWithDom.document = {
      createElement: jest.fn(() => input),
      body: { appendChild: jest.fn() },
    };
    globalWithDom.window = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      setTimeout,
      clearTimeout,
    };

    renderProvider();
    await act(async () => {});

    await act(async () => {
      await hook.importRom();
    });

    expect(hook.hasImportedRoms).toBe(true);
    expect(hook.recentRoms).toEqual([
      { id: 'pokemon emerald.gba:1024:7', title: 'Pokemon Emerald' },
    ]);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@gba_recent_roms',
      JSON.stringify([{ id: 'pokemon emerald.gba:1024:7', title: 'Pokemon Emerald' }])
    );
  });
});
