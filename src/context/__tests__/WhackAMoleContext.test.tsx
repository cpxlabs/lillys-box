import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WhackAMoleProvider, useWhackAMole } from '../WhackAMoleContext';
import { useAuth } from '../AuthContext';

jest.mock('../AuthContext');
jest.mock('@react-native-async-storage/async-storage');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('WhackAMoleContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user-456' },
      isGuest: false,
    } as any);
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
  });

  it('initializes with bestScore 0', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WhackAMoleProvider>{children}</WhackAMoleProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useWhackAMole(), {
      wrapper,
    });

    await waitForNextUpdate();
    expect(result.current.bestScore).toBe(0);
  });

  it('loads best score from AsyncStorage', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('850');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WhackAMoleProvider>{children}</WhackAMoleProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useWhackAMole(), {
      wrapper,
    });

    await waitForNextUpdate();
    expect(result.current.bestScore).toBe(850);
    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
      '@whack_a_mole:bestScore:test-user-456'
    );
  });

  it('updates best score when new score is higher', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WhackAMoleProvider>{children}</WhackAMoleProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useWhackAMole(), {
      wrapper,
    });

    await waitForNextUpdate();

    act(() => {
      result.current.updateBestScore(950);
    });

    expect(result.current.bestScore).toBe(950);
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@whack_a_mole:bestScore:test-user-456',
      '950'
    );
  });

  it('does not update best score when new score is lower', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('850');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WhackAMoleProvider>{children}</WhackAMoleProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useWhackAMole(), {
      wrapper,
    });

    await waitForNextUpdate();

    const setItemCalls = mockAsyncStorage.setItem.mock.calls.length;

    act(() => {
      result.current.updateBestScore(600);
    });

    expect(result.current.bestScore).toBe(850);
    expect(mockAsyncStorage.setItem.mock.calls.length).toBe(setItemCalls);
  });

  it('uses guest id when user is guest', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isGuest: true,
    } as any);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WhackAMoleProvider>{children}</WhackAMoleProvider>
    );

    renderHook(() => useWhackAMole(), { wrapper });

    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
      '@whack_a_mole:bestScore:guest'
    );
  });

  it('throws error when used outside provider', () => {
    const { result } = renderHook(() => useWhackAMole());
    expect(result.error).toEqual(
      Error('useWhackAMole must be used within WhackAMoleProvider')
    );
  });
});
