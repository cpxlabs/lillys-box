import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BubblePopProvider, useBubblePop } from '../BubblePopContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-104' }, isGuest: false }),
}));

let hook: ReturnType<typeof useBubblePop>;

const Consumer = () => {
  hook = useBubblePop();
  return <Text>best:{hook.bestScore}</Text>;
};

const renderProvider = () =>
  render(
    <BubblePopProvider>
      <Consumer />
    </BubblePopProvider>
  );

describe('BubblePopContext', () => {
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
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@bubble_pop:bestScore:test-user-104');
  });

  it('updates best score when new score is higher', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore(750); });
    await act(async () => {});
    expect(hook.bestScore).toBe(750);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@bubble_pop:bestScore:test-user-104', '750');
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
    const Orphan = () => { useBubblePop(); return null; };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('useBubblePop must be used within BubblePopProvider');
    spy.mockRestore();
  });
});
