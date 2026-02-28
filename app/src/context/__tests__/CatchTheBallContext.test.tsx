import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CatchTheBallProvider, useCatchTheBall } from '../CatchTheBallContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-103' }, isGuest: false }),
}));

let hook: ReturnType<typeof useCatchTheBall>;

const Consumer = () => {
  hook = useCatchTheBall();
  return <Text>best:{hook.bestScore}</Text>;
};

const renderProvider = () =>
  render(
    <CatchTheBallProvider>
      <Consumer />
    </CatchTheBallProvider>
  );

describe('CatchTheBallContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('initializes with bestScore 0', async () => {
    renderProvider();
    await act(async () => {});
    expect(hook.bestScore).toBe(0);
  });

  it('loads best score from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('500');
    renderProvider();
    await act(async () => {});
    expect(hook.bestScore).toBe(500);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@catch_the_ball:bestScore:test-user-103');
  });

  it('updates best score when new score is higher', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore(750); });
    await act(async () => {});
    expect(hook.bestScore).toBe(750);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@catch_the_ball:bestScore:test-user-103', '750');
  });

  it('does not update best score when new score is lower', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('500');
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore(200); });
    await act(async () => {});
    expect(hook.bestScore).toBe(500);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('throws error when used outside provider', () => {
    const Orphan = () => { useCatchTheBall(); return null; };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('useCatchTheBall must be used within CatchTheBallProvider');
    spy.mockRestore();
  });
});
