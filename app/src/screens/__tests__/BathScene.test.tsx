import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BathScene } from '../BathScene';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../context/PetContext', () => ({
  usePet: () => ({
    pet: {
      id: 'pet-1',
      name: 'Buddy',
      type: 'dog',
      hunger: 50,
      energy: 80,
      happiness: 70,
      hygiene: 40,
      health: 100,
      money: 100,
      createdAt: Date.now(),
      clothes: { head: null, eyes: null, torso: null, paws: null },
    },
    bathe: jest.fn(),
    earnMoney: jest.fn(),
  }),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock('../../hooks/useDoubleReward', () => ({
  useDoubleReward: () => ({
    triggerReward: jest.fn(),
    DoubleRewardModal: () => null,
  }),
}));

jest.mock('../../hooks/useBackButton', () => ({
  useBackButton: () => () => null,
}));

jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    deviceType: 'phone',
    spacing: (val: number) => val,
    fs: (val: number) => val,
  }),
}));

jest.mock('../../config/responsive', () => ({
  ACTION_PET_SIZE: { phone: 120 },
  SPONGE_SIZE: {
    phone: { spongeSize: 60 },
  },
  SCENE_TEXT_SIZE: {
    phone: { titleSize: 20, messageSize: 14, labelSize: 12 },
  },
}));

jest.mock('../../config/ads.config', () => ({
  AdsConfig: {
    rewards: { bathReward: 10 },
  },
}));

jest.mock('../../config/constants', () => ({
  ANIMATION_DURATION: 1000,
  SCRUBS_NEEDED: 5,
}));

jest.mock('../../utils/age', () => ({
  calculatePetAge: () => 2,
}));

jest.mock('react-native-gesture-handler', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  const createGesture = () => {
    const gesture: Record<string, jest.Mock> = {};
    const methods = ['onStart', 'onBegin', 'onUpdate', 'onChange', 'onEnd', 'onFinalize', 'enabled', 'minDistance', 'maxPointers'];
    methods.forEach((m) => {
      gesture[m] = jest.fn(() => gesture);
    });
    return gesture;
  };
  return {
    GestureDetector: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    Gesture: {
      Pan: createGesture,
      Tap: createGesture,
      Simultaneous: jest.fn(() => ({})),
    },
  };
});

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  // Animated.View must be a valid component (not undefined)
  const Animated = { View };
  return {
    __esModule: true,
    default: Animated,
    useSharedValue: jest.fn((val: number) => ({ value: val })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((val: number) => val),
    withTiming: jest.fn((val: number) => val),
    withSequence: jest.fn(),
  };
});

jest.mock('../../components/ScreenHeader', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    ScreenHeader: ({
      title,
      onBackPress,
    }: {
      title: string;
      onBackPress?: () => void;
    }) => (
      <View>
        <Text>{title}</Text>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} testID="screen-header-back">
            <Text>common.back</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
  };
});

jest.mock('../../components/StatusCard', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return { StatusCard: () => <View testID="status-card" /> };
});

jest.mock('../../components/PetRenderer', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return { PetRenderer: () => <View testID="pet-renderer" /> };
});

const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockGetParent = jest.fn(() => ({
  goBack: jest.fn(),
  canGoBack: () => false,
  getParent: () => undefined,
}));

const mockNavigation = {
  goBack: mockGoBack,
  canGoBack: mockCanGoBack,
  getParent: mockGetParent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as unknown as any;

describe('BathScene', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(true);
  });

  it('renders the title using the i18n key', () => {
    const { getByText } = render(<BathScene navigation={mockNavigation} />);
    // Title uses t('bath.title') - mock returns the key
    expect(getByText('bath.title')).toBeTruthy();
  });

  it('navigates back when ScreenHeader back button is pressed', () => {
    const { getByTestId } = render(<BathScene navigation={mockNavigation} />);
    fireEvent.press(getByTestId('screen-header-back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('uses parent navigation when canGoBack returns false', () => {
    const mockParentGoBack = jest.fn();
    mockCanGoBack.mockReturnValue(false);
    mockGetParent.mockReturnValue({
      goBack: mockParentGoBack,
      canGoBack: () => true,
      getParent: () => undefined,
    });

    const { getByTestId } = render(<BathScene navigation={mockNavigation} />);
    fireEvent.press(getByTestId('screen-header-back'));
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(mockParentGoBack).toHaveBeenCalledTimes(1);
  });
});
