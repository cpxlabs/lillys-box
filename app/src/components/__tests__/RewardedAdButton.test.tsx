import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RewardedAdButton } from '../RewardedAdButton';
import { useToast } from '../../context/ToastContext';
import { hapticFeedback } from '../../utils/haptics';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/useRewardedAd', () => ({
  useRewardedAd: jest.fn(),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: jest.fn(),
}));

jest.mock('../../utils/haptics', () => ({
  hapticFeedback: {
    light: jest.fn(),
  },
}));

import { useRewardedAd } from '../../hooks/useRewardedAd';

describe('RewardedAdButton', () => {
  const mockShowRewardedAd = jest.fn();
  const mockOnRewardEarned = jest.fn();
  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRewardedAd as jest.Mock).mockReturnValue({
      showRewardedAd: mockShowRewardedAd,
      isAdReady: true,
      isLoading: false,
    });
    (useToast as jest.Mock).mockReturnValue({
      showToast: mockShowToast,
    });
  });

  it('renders correctly when ad is ready', () => {
    const { getByText, getByLabelText } = render(
      <RewardedAdButton rewardText="Get Reward" onRewardEarned={mockOnRewardEarned} />
    );

    expect(getByText('Get Reward')).toBeTruthy();

    // Check accessibility
    const button = getByLabelText('Get Reward');
    expect(button).toBeTruthy();
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityState.disabled).toBe(false);
  });

  it('calls showRewardedAd when pressed', () => {
    const { getByLabelText } = render(
      <RewardedAdButton rewardText="Get Reward" onRewardEarned={mockOnRewardEarned} />
    );

    fireEvent.press(getByLabelText('Get Reward'));
    expect(mockShowRewardedAd).toHaveBeenCalledWith(mockOnRewardEarned);
    expect(hapticFeedback.light).not.toHaveBeenCalled();
  });

  it('shows toast and feedback when pressed while not ready', () => {
    (useRewardedAd as jest.Mock).mockReturnValue({
      showRewardedAd: mockShowRewardedAd,
      isAdReady: false,
      isLoading: false,
    });

    const { getByLabelText } = render(
      <RewardedAdButton rewardText="Get Reward" onRewardEarned={mockOnRewardEarned} />
    );

    const button = getByLabelText('Get Reward');
    // Verify it is visually disabled (via accessibilityState)
    expect(button.props.accessibilityState.disabled).toBe(true);
    // Verify accessibility hint
    expect(button.props.accessibilityHint).toBe('ads.notAvailable');

    // Press it
    fireEvent.press(button);

    // Should NOT call showRewardedAd
    expect(mockShowRewardedAd).not.toHaveBeenCalled();
    // Should call haptic feedback
    expect(hapticFeedback.light).toHaveBeenCalled();
    // Should show toast
    expect(mockShowToast).toHaveBeenCalledWith('ads.notAvailable', 'info');
  });

  it('shows toast and feedback when pressed while loading', () => {
    (useRewardedAd as jest.Mock).mockReturnValue({
      showRewardedAd: mockShowRewardedAd,
      isAdReady: true,
      isLoading: true,
    });

    const { getByLabelText } = render(
      <RewardedAdButton rewardText="Get Reward" onRewardEarned={mockOnRewardEarned} />
    );

    const button = getByLabelText('common.loading');
    expect(button.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(button);

    expect(mockShowRewardedAd).not.toHaveBeenCalled();
    expect(hapticFeedback.light).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith('common.loading', 'info');
  });
});
