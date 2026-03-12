import React from 'react';
import { Platform, Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GbaEmulatorProvider, useGbaEmulator } from '../GbaEmulatorContext';

type TestDocument = {
  createElement: jest.Mock;
  body: { appendChild: jest.Mock };
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
  const globalWithDocument = global as typeof globalThis & { document?: TestDocument };
  let originalDocument: TestDocument | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    originalOS = Platform.OS;
    originalDocument = globalWithDocument.document;
    (Platform as { OS: string }).OS = 'web';
  });

  afterEach(() => {
    (Platform as { OS: string }).OS = originalOS;

    if (originalDocument) {
      globalWithDocument.document = originalDocument;
      return;
    }

    delete globalWithDocument.document;
  });

  it('loads recent ROMs from storage on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify([{ id: 'emerald.gba:1:2', title: 'Pokémon Emerald' }])
    );

    globalWithDocument.document = {
      createElement: jest.fn(),
      body: { appendChild: jest.fn() },
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

    globalWithDocument.document = {
      createElement: jest.fn(() => input),
      body: { appendChild: jest.fn() },
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
