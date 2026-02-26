import React from 'react';
import { render } from '@testing-library/react-native';
import { SleepScene } from '../SleepScene';

// Mock dependencies
jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../context/PetContext', () => ({
  usePet: () => ({
    pet: {
      id: 'test-pet',
      name: 'Fluffy',
      type: 'cat',
      energy: 90, // High energy -> canSleep = false
      happiness: 50,
      hunger: 50,
      hygiene: 50,
      createdAt: Date.now(),
      clothes: {
        head: null,
        eyes: null,
        torso: null,
        paws: null,
      },
    },
    sleep: jest.fn(),
    cancelSleep: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'sleep.energyHigh') return 'Energy is high';
      if (key === 'sleep.notTired') return 'Not tired';
      return key;
    },
  }),
}));

jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    deviceType: 'mobile',
    spacing: (val: number) => val,
    fs: (val: number) => val,
  }),
}));

jest.mock('../../hooks/useBackButton', () => ({
  useBackButton: () => () => null,
}));

jest.mock('../../components/ScreenHeader', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View, Text } = require('react-native');
  return {
    ScreenHeader: ({ title }: { title: string }) => <View><Text>{title}</Text></View>,
  };
});

jest.mock('../../components/StatusCard', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return {
    StatusCard: () => <View testID="status-card" />,
  };
});

jest.mock('../../components/PetRenderer', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return {
    PetRenderer: () => <View testID="pet-renderer" />,
  };
});

jest.mock('../../config/responsive', () => ({
  PET_SIZE_SMALL: { mobile: 100 },
  SCENE_TEXT_SIZE: {
    mobile: {
      titleSize: 24,
      sidebarTitle: 14,
      sidebarText: 12,
      progressText: 20,
      buttonText: 18,
    },
  },
}));

jest.mock('../../config/gameBalance', () => ({
  GAME_BALANCE: {
    thresholds: { energyForSleep: 80 },
    activities: {
      sleep: { duration: 5000, energy: 30, happiness: 10, hunger: -5 },
    },
  },
}));

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withRepeat: jest.fn(),
    withSequence: jest.fn(),
    withTiming: jest.fn(),
  };
});

describe('SleepScene', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockNavigation: any = {
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows "Energy is high" on the sleep button when energy is above threshold', () => {
    const { getByText } = render(<SleepScene navigation={mockNavigation} />);

    // With energy at 90 (above 80 threshold), button shows energy high text
    expect(getByText('Energy is high')).toBeTruthy();
  });

  it('shows "Not tired" message when energy is high', () => {
    const { getByText } = render(<SleepScene navigation={mockNavigation} />);

    expect(getByText('Not tired')).toBeTruthy();
  });

  it('renders the screen header', () => {
    const { getByText } = render(<SleepScene navigation={mockNavigation} />);

    expect(getByText('💤 Dormir')).toBeTruthy();
  });
});
