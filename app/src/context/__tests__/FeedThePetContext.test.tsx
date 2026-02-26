import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FeedThePetProvider, useFeedThePet } from '../FeedThePetContext';

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-123' }, isGuest: false }),
}));

let hook: ReturnType<typeof useFeedThePet>;

const Consumer = () => {
  hook = useFeedThePet();
  return <Text>best:{hook.bestScore}</Text>;
};

const renderProvider = () =>
  render(
    <FeedThePetProvider>
      <Consumer />
    </FeedThePetProvider>
  );

describe('FeedThePetContext', () => {
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
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('450');

    renderProvider();
    await act(async () => {});

    expect(hook.bestScore).toBe(450);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      '@feed_the_pet:bestScore:test-user-123'
    );
  });

  it('updates best score when new score is higher', async () => {
    renderProvider();
    await act(async () => {});

    act(() => {
      hook.updateBestScore(500);
    });
    await act(async () => {});

    expect(hook.bestScore).toBe(500);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@feed_the_pet:bestScore:test-user-123',
      '500'
    );
  });

  it('does not update best score when new score is lower', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('500');

    renderProvider();
    await act(async () => {});

    act(() => {
      hook.updateBestScore(300);
    });
    await act(async () => {});

    expect(hook.bestScore).toBe(500);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('throws error when used outside provider', () => {
    const Orphan = () => {
      useFeedThePet();
      return null;
    };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Orphan />)).toThrow(
      'useFeedThePet must be used within FeedThePetProvider'
    );

    spy.mockRestore();
  });
});
