import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RewardedAdButton } from '../RewardedAdButton';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/useRewardedAd', () => ({
  useRewardedAd: jest.fn(),
}));

import { useRewardedAd } from '../../hooks/useRewardedAd';

describe('RewardedAdButton', () => {
  const mockShowRewardedAd = jest.fn();
  const mockOnRewardEarned = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRewardedAd as jest.Mock).mockReturnValue({
      showRewardedAd: mockShowRewardedAd,
      isAdReady: true,
      isLoading: false,
    });
  });

  it('renders correctly when ad is ready', () => {
    const { getByText } = render(
      <RewardedAdButton rewardText="Get Reward" onRewardEarned={mockOnRewardEarned} />
    );

    expect(getByText('Get Reward')).toBeTruthy();
    expect(getByText('📺')).toBeTruthy();
  });

  it('calls showRewardedAd when pressed', () => {
    const { getByText } = render(
      <RewardedAdButton rewardText="Get Reward" onRewardEarned={mockOnRewardEarned} />
    );

    fireEvent.press(getByText('Get Reward'));
    expect(mockShowRewardedAd).toHaveBeenCalledWith(mockOnRewardEarned);
  });

  it('shows not-available subtitle when ad is not ready', () => {
    (useRewardedAd as jest.Mock).mockReturnValue({
      showRewardedAd: mockShowRewardedAd,
      isAdReady: false,
      isLoading: false,
    });

    const { getByText } = render(
      <RewardedAdButton rewardText="Get Reward" onRewardEarned={mockOnRewardEarned} />
    );

    // Shows "not available" subtitle
    expect(getByText('ads.notAvailable')).toBeTruthy();
    // Reward text still displays
    expect(getByText('Get Reward')).toBeTruthy();
  });

  it('shows loading text when loading', () => {
    (useRewardedAd as jest.Mock).mockReturnValue({
      showRewardedAd: mockShowRewardedAd,
      isAdReady: true,
      isLoading: true,
    });

    const { getByText, queryByText } = render(
      <RewardedAdButton rewardText="Get Reward" onRewardEarned={mockOnRewardEarned} />
    );

    // Shows loading text instead of reward text
    expect(getByText('common.loading')).toBeTruthy();
    expect(queryByText('Get Reward')).toBeNull();
  });
});
