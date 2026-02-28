import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GardenGrowProvider, useGardenGrow } from '../GardenGrowContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-120' }, isGuest: false }),
}));

let hook: ReturnType<typeof useGardenGrow>;

const Consumer = () => {
  hook = useGardenGrow();
  return <Text>best:{hook.bestScore}</Text>;
};

const renderProvider = () =>
  render(
    <GardenGrowProvider>
      <Consumer />
    </GardenGrowProvider>
  );

describe('GardenGrowContext', () => {
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
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@garden_grow:bestScore:test-user-120');
  });

  it('updates best score when new score is higher', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore(750); });
    await act(async () => {});
    expect(hook.bestScore).toBe(750);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@garden_grow:bestScore:test-user-120', '750');
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
    const Orphan = () => { useGardenGrow(); return null; };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('useGardenGrow must be used within GardenGrowProvider');
    spy.mockRestore();
  });
});
