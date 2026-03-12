import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { logger } from '../utils/logger';

type GbaRomSummary = {
  id: string;
  title: string;
};

type SelectedRomFile = {
  name: string;
  size: number;
  lastModified: number;
};

type WebRomInput = {
  type: string;
  accept: string;
  files?: ArrayLike<SelectedRomFile> | null;
  remove: () => void;
  click: () => void;
  addEventListener: (event: string, listener: () => void, options?: { once?: boolean }) => void;
};

type WebDocumentLike = {
  createElement: (tagName: string) => WebRomInput;
  body?: { appendChild: (node: WebRomInput) => void };
};

type WebWindowLike = {
  addEventListener: (event: string, listener: () => void, options?: { once?: boolean }) => void;
  removeEventListener: (event: string, listener: () => void) => void;
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
};

type GbaEmulatorContextType = {
  recentRoms: GbaRomSummary[];
  hasImportedRoms: boolean;
  isImportAvailable: boolean;
  importRom: () => Promise<void>;
};

const GbaEmulatorContext = createContext<GbaEmulatorContextType | undefined>(undefined);
const GBA_RECENT_ROMS_KEY = '@gba_recent_roms';
const MAX_RECENT_ROMS = 5;

const normalizeRomSummary = (rom: unknown): GbaRomSummary | null => {
  if (!rom || typeof rom !== 'object') return null;

  const { id, title } = rom as Partial<GbaRomSummary>;
  if (typeof id !== 'string' || typeof title !== 'string' || !id || !title) return null;

  return { id, title };
};

const getDocument = (): WebDocumentLike | null => {
  if (typeof globalThis !== 'object' || !('document' in globalThis)) {
    return null;
  }

  return (globalThis as typeof globalThis & { document?: WebDocumentLike }).document ?? null;
};

const getWindow = (): WebWindowLike | null => {
  if (typeof globalThis !== 'object' || !('window' in globalThis)) {
    return null;
  }

  return (globalThis as typeof globalThis & { window?: WebWindowLike }).window ?? null;
};

const createRomSummaryFromFile = (file: SelectedRomFile): GbaRomSummary | null => {
  const trimmedName = file.name.trim();
  if (!/\.gba$/i.test(trimmedName)) {
    return null;
  }

  const title = trimmedName.replace(/\.gba$/i, '').trim() || trimmedName;
  return {
    id: `${trimmedName.toLowerCase()}:${file.size}:${file.lastModified}`,
    title,
  };
};

const isWebImportSupported = () => (
  Platform.OS === 'web'
  && typeof getDocument()?.createElement === 'function'
);

const pickWebRom = async (): Promise<GbaRomSummary | null> => {
  if (!isWebImportSupported()) {
    return null;
  }

  return new Promise((resolve) => {
    const currentDocument = getDocument();
    if (!currentDocument?.body) {
      resolve(null);
      return;
    }

    const currentWindow = getWindow();
    const input = currentDocument.createElement('input');
    input.type = 'file';
    input.accept = '.gba';
    let hasResolved = false;
    let cancelTimeout: ReturnType<typeof setTimeout> | null = null;

    const finalize = (rom: GbaRomSummary | null) => {
      if (hasResolved) {
        return;
      }

      hasResolved = true;
      if (currentWindow) {
        currentWindow.removeEventListener('focus', handleWindowFocus);
      }
      if (cancelTimeout) {
        (currentWindow?.clearTimeout ?? clearTimeout)(cancelTimeout);
      }
      input.remove();
      resolve(rom);
    };

    const handleWindowFocus = () => {
      if (hasResolved) {
        return;
      }
      if (cancelTimeout) {
        (currentWindow?.clearTimeout ?? clearTimeout)(cancelTimeout);
      }
      cancelTimeout = (currentWindow?.setTimeout ?? setTimeout)(() => {
        if (!input.files?.length) {
          finalize(null);
        }
      }, 0);
    };

    input.addEventListener('change', () => {
      if (cancelTimeout) {
        (currentWindow?.clearTimeout ?? clearTimeout)(cancelTimeout);
        cancelTimeout = null;
      }
      const nextRom = input.files?.[0] ? createRomSummaryFromFile(input.files[0]) : null;
      finalize(nextRom);
    }, { once: true });

    if (currentWindow) {
      currentWindow.addEventListener('focus', handleWindowFocus, { once: true });
    }

    currentDocument.body.appendChild(input);
    input.click();
  });
};

export const GbaEmulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentRoms, setRecentRoms] = useState<GbaRomSummary[]>([]);
  const isImportAvailable = isWebImportSupported();

  useEffect(() => {
    let isMounted = true;

    const loadRecentRoms = async () => {
      try {
        const stored = await AsyncStorage.getItem(GBA_RECENT_ROMS_KEY);
        if (!stored || !isMounted) {
          return;
        }

        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) {
          return;
        }

        const nextRoms = parsed
          .map(normalizeRomSummary)
          .filter((rom): rom is GbaRomSummary => rom !== null)
          .slice(0, MAX_RECENT_ROMS);

        setRecentRoms(nextRoms);
      } catch (error) {
        logger.warn('Failed to load recent GBA ROMs', error);
      }
    };

    void loadRecentRoms();

    return () => {
      isMounted = false;
    };
  }, []);

  const importRom = useCallback(async () => {
    const importedRom = await pickWebRom();
    if (!importedRom) {
      return;
    }

    setRecentRoms((currentRoms) => {
      const nextRoms = [
        importedRom,
        ...currentRoms.filter((rom) => rom.id !== importedRom.id),
      ].slice(0, MAX_RECENT_ROMS);

      AsyncStorage.setItem(GBA_RECENT_ROMS_KEY, JSON.stringify(nextRoms)).catch((error) => {
        logger.warn('Failed to save recent GBA ROMs', error);
      });

      return nextRoms;
    });
  }, []);

  const hasImportedRoms = recentRoms.length > 0;

  const value = useMemo<GbaEmulatorContextType>(() => ({
    recentRoms,
    hasImportedRoms,
    isImportAvailable,
    importRom,
  }), [hasImportedRoms, importRom, isImportAvailable, recentRoms]);

  return <GbaEmulatorContext.Provider value={value}>{children}</GbaEmulatorContext.Provider>;
};

export const useGbaEmulator = () => {
  const ctx = useContext(GbaEmulatorContext);
  if (!ctx) throw new Error('useGbaEmulator must be used within GbaEmulatorProvider');
  return ctx;
};
