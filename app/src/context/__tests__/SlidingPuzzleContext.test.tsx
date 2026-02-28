import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SlidingPuzzleProvider, useSlidingPuzzle } from '../SlidingPuzzleContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-202' }, isGuest: false }),
}));

let hook: ReturnType<typeof useSlidingPuzzle>;

const Consumer = () => {
  hook = useSlidingPuzzle();
  return <Text>easy:{String(hook.bestMoves.easy)}</Text>;
};

const renderProvider = () =>
  render(
    <SlidingPuzzleProvider>
      <Consumer />
    </SlidingPuzzleProvider>
  );

describe('SlidingPuzzleContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('initializes with null bestMoves', async () => {
    renderProvider();
    await act(async () => {});
    expect(hook.bestMoves).toEqual({ easy: null, hard: null });
  });

  it('loads best moves from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ easy: 15, hard: 30 }));
    renderProvider();
    await act(async () => {});
    expect(hook.bestMoves).toEqual({ easy: 15, hard: 30 });
  });

  it('updates best moves when new moves are fewer', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestMoves('easy', 20); });
    await act(async () => {});
    expect(hook.bestMoves.easy).toBe(20);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@sliding_puzzle:bestMoves:test-user-202',
      JSON.stringify({ easy: 20, hard: null })
    );
  });

  it('does not update best moves when new moves are more', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ easy: 15, hard: null }));
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestMoves('easy', 25); });
    await act(async () => {});
    expect(hook.bestMoves.easy).toBe(15);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('throws error when used outside provider', () => {
    const Orphan = () => { useSlidingPuzzle(); return null; };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('useSlidingPuzzle must be used within SlidingPuzzleProvider');
    spy.mockRestore();
  });
});
