import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorMixerProvider, useColorMixer } from '../ColorMixerContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-203' }, isGuest: false }),
}));

let hook: ReturnType<typeof useColorMixer>;

const Consumer = () => {
  hook = useColorMixer();
  return <Text>stars:{hook.getTotalStars()}</Text>;
};

const renderProvider = () =>
  render(
    <ColorMixerProvider>
      <Consumer />
    </ColorMixerProvider>
  );

describe('ColorMixerContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('initializes with level 1 unlocked', async () => {
    renderProvider();
    await act(async () => {});
    const level1 = hook.getLevelProgress(1);
    expect(level1.unlocked).toBe(true);
    expect(level1.completed).toBe(false);
    expect(level1.stars).toBe(0);
  });

  it('updates level progress and unlocks next level', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateLevelProgress(1, 3); });
    await act(async () => {});
    const level1 = hook.getLevelProgress(1);
    expect(level1.completed).toBe(true);
    expect(level1.stars).toBe(3);
    const level2 = hook.getLevelProgress(2);
    expect(level2.unlocked).toBe(true);
  });

  it('returns total stars across levels', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateLevelProgress(1, 3); });
    await act(async () => {});
    act(() => { hook.updateLevelProgress(2, 2); });
    await act(async () => {});
    expect(hook.getTotalStars()).toBe(5);
  });

  it('resets progress', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateLevelProgress(1, 3); });
    await act(async () => {});
    act(() => { hook.resetProgress(); });
    await act(async () => {});
    expect(hook.getTotalStars()).toBe(0);
    expect(hook.getCompletedLevelsCount()).toBe(0);
  });

  it('throws error when used outside provider', () => {
    const Orphan = () => { useColorMixer(); return null; };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('useColorMixer must be used within ColorMixerProvider');
    spy.mockRestore();
  });
});
