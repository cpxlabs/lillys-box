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
  return <Text>classic-easy:{hook.bestScores.classic.easy}</Text>;
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
    expect(hook.bestScores.classic).toEqual({ easy: 0, medium: 0, hard: 0, expert: 0 });
    expect(hook.bestScores.timeAttack).toEqual({ easy: 0, medium: 0, hard: 0, expert: 0 });
  });

  it('loads classic best scores from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === '@memory_match:bestScore:easy:test-user-201') return Promise.resolve('300');
      if (key === '@memory_match:bestScore:medium:test-user-201') return Promise.resolve('500');
      if (key === '@memory_match:bestScore:hard:test-user-201') return Promise.resolve('800');
      if (key === '@memory_match:bestScore:expert:test-user-201') return Promise.resolve('1200');
      return Promise.resolve(null);
    });
    renderProvider();
    await act(async () => {});
    expect(hook.bestScores.classic).toEqual({ easy: 300, medium: 500, hard: 800, expert: 1200 });
  });

  it('loads timeAttack best scores from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === '@memory_match:bestScore:timeAttack:easy:test-user-201') return Promise.resolve('150');
      if (key === '@memory_match:bestScore:timeAttack:hard:test-user-201') return Promise.resolve('400');
      return Promise.resolve(null);
    });
    renderProvider();
    await act(async () => {});
    expect(hook.bestScores.timeAttack.easy).toBe(150);
    expect(hook.bestScores.timeAttack.hard).toBe(400);
    expect(hook.bestScores.timeAttack.medium).toBe(0);
  });

  it('updates classic best score when new score is higher', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore('easy', 'classic', 450); });
    await act(async () => {});
    expect(hook.bestScores.classic.easy).toBe(450);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@memory_match:bestScore:easy:test-user-201', '450');
  });

  it('updates timeAttack best score when new score is higher', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore('medium', 'timeAttack', 200); });
    await act(async () => {});
    expect(hook.bestScores.timeAttack.medium).toBe(200);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@memory_match:bestScore:timeAttack:medium:test-user-201', '200');
  });

  it('does not update best score when new score is lower', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === '@memory_match:bestScore:easy:test-user-201') return Promise.resolve('500');
      return Promise.resolve(null);
    });
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore('easy', 'classic', 200); });
    await act(async () => {});
    expect(hook.bestScores.classic.easy).toBe(500);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('updates expert difficulty best score', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore('expert', 'classic', 900); });
    await act(async () => {});
    expect(hook.bestScores.classic.expert).toBe(900);
  });

  it('throws error when used outside provider', () => {
    const Orphan = () => { useMemoryMatch(); return null; };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('useMemoryMatch must be used within MemoryMatchProvider');
    spy.mockRestore();
  });
});
