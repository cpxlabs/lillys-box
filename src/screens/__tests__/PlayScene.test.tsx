import React from 'react';
import { render } from '@testing-library/react-native';
import { PlayScene } from '../PlayScene';

// Mock dependencies
jest.mock('../../context/PetContext', () => ({
  usePet: () => ({
    pet: {
      id: 'test-pet-id',
      name: 'Fluffy',
      type: 'cat',
      gender: 'female',
      color: 'base',
      hunger: 50,
      hygiene: 50,
      energy: 50,
      happiness: 50,
      health: 100,
      money: 100,
      clothes: { head: null, eyes: null, torso: null, paws: null },
      createdAt: Date.now(),
      user_id: 'test-user',
    },
  }),
}));

jest.mock('../../hooks/usePetActions', () => ({
  usePetActions: () => ({
    animationState: 'idle',
    message: '',
    isAnimating: false,
    performAction: jest.fn(),
    DoubleRewardModal: null,
  }),
}));

jest.mock('../../hooks/useNavigationList', () => ({
  useNavigationList: () => ({
    currentItem: { emoji: '🧶', nameKey: 'play.activities.yarnBall' },
    currentIndex: 0,
    goToNext: jest.fn(),
    goToPrevious: jest.fn(),
    totalItems: 5,
  }),
}));

jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    deviceType: 'mobile',
    spacing: (n: number) => n,
    fs: (n: number) => n,
  }),
}));

jest.mock('../../hooks/useBackButton', () => ({
  useBackButton: () => () => null,
}));

jest.mock('../../components/StatusCard', () => ({
  StatusCard: () => null,
}));

jest.mock('../../components/PetRenderer', () => ({
  PetRenderer: () => null,
}));

jest.mock('../../components/ScreenHeader', () => ({
  ScreenHeader: () => null,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      // Simple mock for t function to return predictable strings
      if (key === 'common.previous') return 'Previous';
      if (key === 'common.next') return 'Next';
      if (key === 'common.of') return 'of';
      if (key === 'play.activity') return 'Activity';
      return key;
    },
  }),
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as unknown as any;

describe('PlayScene', () => {
  it('renders with accessible navigation controls', () => {
    const { getByLabelText } = render(<PlayScene navigation={mockNavigation} />);

    // Check for Previous arrow
    expect(getByLabelText('Previous Activity')).toBeTruthy();

    // Check for Next arrow
    expect(getByLabelText('Next Activity')).toBeTruthy();

    // Check for Page Indicator (currentIndex 0 means "1", totalItems 5)
    expect(getByLabelText('1 of 5')).toBeTruthy();
  });
});
