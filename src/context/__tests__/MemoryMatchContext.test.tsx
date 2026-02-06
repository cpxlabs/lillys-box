import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import { MemoryMatchProvider, useMemoryMatch } from '../MemoryMatchContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'memory-ctx-test' }, isGuest: false }),
}));

let hook: ReturnType<typeof useMemoryMatch>;

const Consumer = () => {
  hook = useMemoryMatch();
  return (
    <Text>
      easy:{hook.bestScores.easy} medium:{hook.bestScores.medium} hard:{hook.bestScores.hard}
    </Text>
  );
};

const renderProvider = () =>
  render(
    <MemoryMatchProvider>
      <Consumer />
    </MemoryMatchProvider>
  );

describe('MemoryMatchContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  // ── initial state ─────────────────────────────────────────────
  it('starts with all bestScores at 0 when nothing is stored', async () => {
    renderProvider();
    await act(async () => {});

    expect(hook.bestScores).toEqual({ easy: 0, medium: 0, hard: 0 });
  });

  // ── loading from storage ──────────────────────────────────────
  it('loads bestScores from AsyncStorage on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === '@memory_match:bestScore:easy:memory-ctx-test') return Promise.resolve('30');
      if (key === '@memory_match:bestScore:medium:memory-ctx-test') return Promise.resolve('50');
      if (key === '@memory_match:bestScore:hard:memory-ctx-test') return Promise.resolve('80');
      return Promise.resolve(null);
    });

    renderProvider();
    await act(async () => {});

    expect(hook.bestScores).toEqual({ easy: 30, medium: 50, hard: 80 });
  });

  // ── updating best score ───────────────────────────────────────
  it('updates bestScore when new score exceeds previous best', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === '@memory_match:bestScore:easy:memory-ctx-test') return Promise.resolve('10');
      return Promise.resolve(null);
    });

    renderProvider();
    await act(async () => {});
    expect(hook.bestScores.easy).toBe(10);

    act(() => {
      hook.updateBestScore('easy', 25);
    });
    await act(async () => {});

    expect(hook.bestScores.easy).toBe(25);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@memory_match:bestScore:easy:memory-ctx-test',
      '25'
    );
  });

  it('does not update bestScore when score stays below it', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === '@memory_match:bestScore:medium:memory-ctx-test') return Promise.resolve('100');
      return Promise.resolve(null);
    });

    renderProvider();
    await act(async () => {});

    act(() => {
      hook.updateBestScore('medium', 50);
    });
    await act(async () => {});

    expect(hook.bestScores.medium).toBe(100);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('updates different difficulty levels independently', async () => {
    renderProvider();
    await act(async () => {});

    act(() => {
      hook.updateBestScore('easy', 20);
    });
    await act(async () => {});

    act(() => {
      hook.updateBestScore('hard', 60);
    });
    await act(async () => {});

    expect(hook.bestScores.easy).toBe(20);
    expect(hook.bestScores.medium).toBe(0);
    expect(hook.bestScores.hard).toBe(60);
  });

  // ── guard ─────────────────────────────────────────────────────
  it('useMemoryMatch throws when used outside MemoryMatchProvider', () => {
    const Orphan = () => {
      useMemoryMatch();
      return null;
    };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Orphan />)).toThrow(
      'useMemoryMatch must be used within MemoryMatchProvider'
    );

    spy.mockRestore();
  });
});
