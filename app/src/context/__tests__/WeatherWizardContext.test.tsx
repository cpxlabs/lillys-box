import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherWizardProvider, useWeatherWizard, Difficulty } from '../WeatherWizardContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-117' }, isGuest: false }),
}));

let hook: ReturnType<typeof useWeatherWizard>;

const Consumer = () => {
  hook = useWeatherWizard();
  return <Text>best:{hook.bestScore}</Text>;
};

const renderProvider = () =>
  render(
    <WeatherWizardProvider>
      <Consumer />
    </WeatherWizardProvider>
  );

describe('WeatherWizardContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('initializes with normal difficulty and all bestScores 0', async () => {
    renderProvider();
    await act(async () => {});
    expect(hook.difficulty).toBe('normal');
    expect(hook.bestScores).toEqual({ easy: 0, normal: 0, hard: 0 });
    expect(hook.bestScore).toBe(0);
  });

  it('allows difficulty to change', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.setDifficulty('hard'); });
    expect(hook.difficulty).toBe('hard');
  });

  it('loads the correct key based on difficulty', async () => {
    // simulate stored values for each difficulty
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key.endsWith(':easy:test-user-117')) return Promise.resolve('100');
      if (key.endsWith(':normal:test-user-117')) return Promise.resolve('200');
      if (key.endsWith(':hard:test-user-117')) return Promise.resolve('300');
      return Promise.resolve(null);
    });
    renderProvider();
    await act(async () => {});
    // initial difficulty normal
    expect(hook.bestScores).toEqual({ easy: 100, normal: 200, hard: 300 });
    expect(hook.bestScore).toBe(200);
    // switch difficulty and verify bestScore updates
    act(() => { hook.setDifficulty('easy'); });
    expect(hook.bestScore).toBe(100);
    act(() => { hook.setDifficulty('hard'); });
    expect(hook.bestScore).toBe(300);
  });

  it('updates best score for current difficulty only', async () => {
    renderProvider();
    await act(async () => {});
    // default normal
    act(() => { hook.updateBestScore(250); });
    await act(async () => {});
    expect(hook.bestScores.normal).toBe(250);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@weather_wizard:bestScore:normal:test-user-117', '250');
    // changing difficulty should not affect previous values
    act(() => { hook.setDifficulty('easy'); });
    expect(hook.bestScores.easy).toBe(0);
  });

  it('does not update when new score is lower', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('400');
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore(100); });
    await act(async () => {});
    expect(hook.bestScores.normal).toBe(400);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('throws error when used outside provider', () => {
    const Orphan = () => { useWeatherWizard(); return null; };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('useWeatherWizard must be used within WeatherWizardProvider');
    spy.mockRestore();
  });
});
