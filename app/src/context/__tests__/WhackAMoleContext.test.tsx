import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WhackAMoleProvider, useWhackAMole } from '../WhackAMoleContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-456' }, isGuest: false }),
}));

let hook: ReturnType<typeof useWhackAMole>;

const Consumer = () => {
  hook = useWhackAMole();
  return <Text>best:{hook.bestScore}</Text>;
};

const renderProvider = () =>
  render(
    <WhackAMoleProvider>
      <Consumer />
    </WhackAMoleProvider>
  );

describe('WhackAMoleContext', () => {
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
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('850');

    renderProvider();
    await act(async () => {});

    expect(hook.bestScore).toBe(850);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      '@whack_a_mole:bestScore:test-user-456'
    );
  });

  it('updates best score when new score is higher', async () => {
    renderProvider();
    await act(async () => {});

    act(() => {
      hook.updateBestScore(950);
    });
    await act(async () => {});

    expect(hook.bestScore).toBe(950);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@whack_a_mole:bestScore:test-user-456',
      '950'
    );
  });

  it('does not update best score when new score is lower', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('850');

    renderProvider();
    await act(async () => {});

    act(() => {
      hook.updateBestScore(600);
    });
    await act(async () => {});

    expect(hook.bestScore).toBe(850);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('throws error when used outside provider', () => {
    const Orphan = () => {
      useWhackAMole();
      return null;
    };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Orphan />)).toThrow(
      'useWhackAMole must be used within WhackAMoleProvider'
    );

    spy.mockRestore();
  });
});
