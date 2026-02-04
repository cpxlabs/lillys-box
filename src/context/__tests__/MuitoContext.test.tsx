import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import { MuitoProvider, useMuito } from '../MuitoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'muito-ctx-test' }, isGuest: false }),
}));

// Capture the hook's return value from a thin consumer so tests can call it directly
let hook: ReturnType<typeof useMuito>;

const Consumer = () => {
  hook = useMuito();
  return <Text>score:{hook.score} best:{hook.bestScore}</Text>;
};

const renderProvider = () =>
  render(
    <MuitoProvider>
      <Consumer />
    </MuitoProvider>
  );

describe('MuitoContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  // ── initial state ─────────────────────────────────────────────
  it('starts with score 0 and bestScore 0 when nothing is stored', async () => {
    renderProvider();
    await act(async () => {});

    expect(hook.score).toBe(0);
    expect(hook.bestScore).toBe(0);
  });

  // ── addScore / resetScore ─────────────────────────────────────
  it('addScore accumulates points', async () => {
    renderProvider();
    await act(async () => {});

    act(() => {
      hook.addScore(10);
    });
    expect(hook.score).toBe(10);

    act(() => {
      hook.addScore(7);
    });
    expect(hook.score).toBe(17);
  });

  it('resetScore sets score back to 0', async () => {
    renderProvider();
    await act(async () => {});

    act(() => {
      hook.addScore(25);
    });
    expect(hook.score).toBe(25);

    act(() => {
      hook.resetScore();
    });
    expect(hook.score).toBe(0);
  });

  // ── bestScore loading ─────────────────────────────────────────
  it('loads bestScore from AsyncStorage on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('42');

    renderProvider();
    await act(async () => {});

    expect(hook.bestScore).toBe(42);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      '@muito_game:bestScore:muito-ctx-test'
    );
  });

  // ── bestScore persistence ─────────────────────────────────────
  it('persists new bestScore when score exceeds previous best', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('10');

    renderProvider();
    await act(async () => {});
    expect(hook.bestScore).toBe(10);

    // Push score past the stored best
    act(() => {
      hook.addScore(25); // score → 25 > bestScore 10
    });
    await act(async () => {});

    expect(hook.bestScore).toBe(25);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@muito_game:bestScore:muito-ctx-test',
      '25'
    );
  });

  it('does not update bestScore when score stays below it', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('100');

    renderProvider();
    await act(async () => {});

    act(() => {
      hook.addScore(5); // score → 5 < bestScore 100
    });
    await act(async () => {});

    expect(hook.bestScore).toBe(100);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  // ── guard ─────────────────────────────────────────────────────
  it('useMuito throws when used outside MuitoProvider', () => {
    const Orphan = () => {
      useMuito();
      return null;
    };
    // Suppress the React error-boundary console noise
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Orphan />)).toThrow('useMuito must be used within MuitoProvider');

    spy.mockRestore();
  });
});
