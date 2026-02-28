import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetChefProvider, usePetChef } from '../PetChefContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-118' }, isGuest: false }),
}));

let hook: ReturnType<typeof usePetChef>;

const Consumer = () => {
  hook = usePetChef();
  return <Text>best:{hook.bestScore}</Text>;
};

const renderProvider = () =>
  render(
    <PetChefProvider>
      <Consumer />
    </PetChefProvider>
  );

describe('PetChefContext', () => {
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
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@pet_chef:bestScore:test-user-118');
  });

  it('updates best score when new score is higher', async () => {
    renderProvider();
    await act(async () => {});
    act(() => { hook.updateBestScore(750); });
    await act(async () => {});
    expect(hook.bestScore).toBe(750);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@pet_chef:bestScore:test-user-118', '750');
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
    const Orphan = () => { usePetChef(); return null; };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('usePetChef must be used within PetChefProvider');
    spy.mockRestore();
  });
});
