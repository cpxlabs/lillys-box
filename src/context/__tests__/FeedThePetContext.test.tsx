import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FeedThePetProvider, useFeedThePet } from '../FeedThePetContext';
import { useAuth } from '../AuthContext';

jest.mock('../AuthContext');
jest.mock('@react-native-async-storage/async-storage');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('FeedThePetContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user-123' },
      isGuest: false,
    } as any);
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
  });

  it('initializes with bestScore 0', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FeedThePetProvider>{children}</FeedThePetProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useFeedThePet(), {
      wrapper,
    });

    await waitForNextUpdate();
    expect(result.current.bestScore).toBe(0);
  });

  it('loads best score from AsyncStorage', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('450');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FeedThePetProvider>{children}</FeedThePetProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useFeedThePet(), {
      wrapper,
    });

    await waitForNextUpdate();
    expect(result.current.bestScore).toBe(450);
    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
      '@feed_the_pet:bestScore:test-user-123'
    );
  });

  it('updates best score when new score is higher', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FeedThePetProvider>{children}</FeedThePetProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useFeedThePet(), {
      wrapper,
    });

    await waitForNextUpdate();

    act(() => {
      result.current.updateBestScore(500);
    });

    expect(result.current.bestScore).toBe(500);
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@feed_the_pet:bestScore:test-user-123',
      '500'
    );
  });

  it('does not update best score when new score is lower', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('500');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FeedThePetProvider>{children}</FeedThePetProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useFeedThePet(), {
      wrapper,
    });

    await waitForNextUpdate();

    const setItemCalls = mockAsyncStorage.setItem.mock.calls.length;

    act(() => {
      result.current.updateBestScore(300);
    });

    expect(result.current.bestScore).toBe(500);
    expect(mockAsyncStorage.setItem.mock.calls.length).toBe(setItemCalls);
  });

  it('uses guest id when user is guest', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isGuest: true,
    } as any);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FeedThePetProvider>{children}</FeedThePetProvider>
    );

    renderHook(() => useFeedThePet(), { wrapper });

    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
      '@feed_the_pet:bestScore:guest'
    );
  });

  it('throws error when used outside provider', () => {
    const { result } = renderHook(() => useFeedThePet());
    expect(result.error).toEqual(
      Error('useFeedThePet must be used within FeedThePetProvider')
    );
  });
});
