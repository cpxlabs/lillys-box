import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetExplorerProvider, usePetExplorer } from '../PetExplorerContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-116' }, isGuest: false }),
}));

let hook: ReturnType<typeof usePetExplorer>;

const Consumer = () => {
  hook = usePetExplorer();
  return <Text>best:{hook.bestScore}</Text>;
};

const renderProvider = () =>
  render(
    <PetExplorerProvider>
      <Consumer />
    </PetExplorerProvider>
  );

describe('PetExplorerContext', () => {
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
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@pet_explorer:bestScore:test-user-116');
  });

  it('updates best score when new score is higher', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore(750); });
    await act(async () => {});
    expect(hook.bestScore).toBe(750);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@pet_explorer:bestScore:test-user-116', '750');
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
    const Orphan = () => { usePetExplorer(); return null; };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('usePetExplorer must be used within PetExplorerProvider');
    spy.mockRestore();
  });
});
