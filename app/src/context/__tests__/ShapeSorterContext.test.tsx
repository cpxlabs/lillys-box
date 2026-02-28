import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShapeSorterProvider, useShapeSorter } from '../ShapeSorterContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-112' }, isGuest: false }),
}));

let hook: ReturnType<typeof useShapeSorter>;

const Consumer = () => {
  hook = useShapeSorter();
  return <Text>best:{hook.bestScore}</Text>;
};

const renderProvider = () =>
  render(
    <ShapeSorterProvider>
      <Consumer />
    </ShapeSorterProvider>
  );

describe('ShapeSorterContext', () => {
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
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@shape_sorter:bestScore:test-user-112');
  });

  it('updates best score when new score is higher', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore(750); });
    await act(async () => {});
    expect(hook.bestScore).toBe(750);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@shape_sorter:bestScore:test-user-112', '750');
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
    const Orphan = () => { useShapeSorter(); return null; };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('useShapeSorter must be used within ShapeSorterProvider');
    spy.mockRestore();
  });
});
