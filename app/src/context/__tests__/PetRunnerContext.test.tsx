import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import { PetRunnerProvider, usePetRunner } from '../PetRunnerContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'runner-ctx-test' }, isGuest: false }),
}));

let hook: ReturnType<typeof usePetRunner>;

const Consumer = () => {
  hook = usePetRunner();
  return <Text>best:{hook.bestScore}</Text>;
};

const renderProvider = () =>
  render(
    <PetRunnerProvider>
      <Consumer />
    </PetRunnerProvider>
  );

describe('PetRunnerContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('starts with bestScore 0 when nothing is stored', async () => {
    renderProvider();
    await act(async () => {});

    expect(hook.bestScore).toBe(0);
  });

  it('loads bestScore from AsyncStorage on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('150');

    renderProvider();
    await act(async () => {});

    expect(hook.bestScore).toBe(150);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      '@pet_runner:bestScore:runner-ctx-test'
    );
  });

  it('updates bestScore when new score exceeds previous best', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('50');

    renderProvider();
    await act(async () => {});
    expect(hook.bestScore).toBe(50);

    act(() => {
      hook.updateBestScore(120);
    });
    await act(async () => {});

    expect(hook.bestScore).toBe(120);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@pet_runner:bestScore:runner-ctx-test',
      '120'
    );
  });

  it('does not update bestScore when score stays below it', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('200');

    renderProvider();
    await act(async () => {});

    act(() => {
      hook.updateBestScore(50);
    });
    await act(async () => {});

    expect(hook.bestScore).toBe(200);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('usePetRunner throws when used outside PetRunnerProvider', () => {
    const Orphan = () => {
      usePetRunner();
      return null;
    };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Orphan />)).toThrow(
      'usePetRunner must be used within PetRunnerProvider'
    );

    spy.mockRestore();
  });
});
