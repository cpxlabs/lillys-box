/**
 * Game Ads Types & Events
 * Defines types for ad integration in games and event tracking
 */

export type AdType = 'rewarded' | 'interstitial' | 'banner';

export type GameAdEventType =
  | 'game_started'
  | 'game_ended'
  | 'level_complete'
  | 'game_over'
  | 'score_milestone'
  | 'hint_used'
  | 'power_up_activated'
  | 'feature_unlocked'
  | 'daily_bonus_claimed'
  | 'activity_completed'
  | 'checkpoint_reached';

export interface GameAdEvent {
  gameId: string;
  eventType: GameAdEventType;
  adType: AdType;
  timestamp: number;
  userCompleted: boolean; // Did user complete the ad?
  rewardAmount?: number; // For rewarded ads
  metadata?: Record<string, unknown >; // Additional event data
}

export interface GameAdConfig {
  gameId: string;
  gameName: string;
  category: 'casual' | 'puzzle' | 'adventure' | 'pet-care' | 'emulator' | 'board';
  adPlacements: AdPlacement[];
  rewardMultiplier?: number; // Multiplier for reward amount
  frequencyLimit?: {
    type: 'per_session' | 'per_day';
    maxAds: number;
  };
}

export interface AdPlacement {
  id: string;
  trigger: GameAdEventType;
  adType: AdType;
  optional?: boolean; // If true, user can skip this ad
  delayMs?: number; // Delay before showing ad
  message?: string; // Custom message to show ("Watch ad to earn bonus coins", etc)
  rewardAmount?: number; // Bonus for this specific ad
}

export interface GameAdSession {
  gameId: string;
  sessionStartTime: number;
  adsShown: GameAdEvent[];
  totalRewardsEarned: number;
}

export interface GameAdMetrics {
  gameId: string;
  totalAdsShown: number;
  totalAdsCompleted: number;
  completionRate: number;
  totalRewardsFromAds: number;
  lastAdShownTime: number;
  sessionAdCount: number;
}

export type GameCategory = 'casual' | 'puzzle' | 'adventure' | 'pet-care' | 'emulator' | 'board';

export interface AdStrategyResponse {
  shouldShow: boolean;
  placement?: AdPlacement;
  reason?: string; // Why this ad should/shouldn't be shown
}
