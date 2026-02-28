import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MemoryMatchProvider, useMemoryMatch } from '../MemoryMatchContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-201' }, isGuest: false }),
}));

let hook: ReturnType<typeof useMemoryMatch>;

const Consumer = () => {
  hook = useMemoryMatch();
  return <Text>easy:{hook.bestScores.easy}</Text>;
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

  it('initializes with all bestScores 0', async () => {
    renderProvider();
    await act(async () => {});
    expect(hook.bestScores).toEqual({ easy: 0, medium: 0, hard: 0 });
  });

  it('loads best scores from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === '@memory_match:bestScore:easy:test-user-201') return Promise.resolve('300');
      if (key === '@memory_match:bestScore:medium:test-user-201') return Promise.resolve('500');
      if (key === '@memory_match:bestScore:hard:test-user-201') return Promise.resolve('800');
      return Promise.resolve(null);
    });
    renderProvider();
    await act(async () => {});
    expect(hook.bestScores).toEqual({ easy: 300, medium: 500, hard: 800 });
  });

  it('updates best score for a difficulty when new score is higher', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore('easy', 450); });
    await act(async () => {});
    expect(hook.bestScores.easy).toBe(450);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@memory_match:bestScore:easy:test-user-201', '450');
  });

  it('does not update best score when new score is lower', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === '@memory_match:bestScore:easy:test-user-201') return Promise.resolve('500');
      return Promise.resolve(null);
    });
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore('easy', 200); });
    await act(async () => {});
    expect(hook.bestScores.easy).toBe(500);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('throws error when used outside provider', () => {
    const Orphan = () => { useMemoryMatch(); return null; };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('useMemoryMatch must be used within MemoryMatchProvider');
    spy.mockRestore();
  });
});
