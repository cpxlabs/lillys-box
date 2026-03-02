import React from 'react';
import { render } from '@testing-library/react-native';
import { BannerAd } from '../BannerAd';

jest.mock('../../utils/logger', () => ({
  logger: { log: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

jest.mock('../../services/AdService', () => ({
  __esModule: true,
  default: {
    getBannerAdUnitId: jest.fn(() => 'test-banner-id'),
  },
}));

jest.mock('../../config/ads.config', () => ({
  AdsConfig: { enabled: true },
}));

describe('BannerAd', () => {
  it('renders null on web platform (test environment)', () => {
    // In jest/web test environment Platform.OS is 'web', so BannerAd returns null
    const { toJSON } = render(<BannerAd />);
    expect(toJSON()).toBeNull();
  });

  it('renders without crashing', () => {
    // Should not throw regardless of environment
    expect(() => render(<BannerAd />)).not.toThrow();
  });
});
