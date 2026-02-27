import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
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
    t: (key: string) => key,
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

const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockGetParent = jest.fn(() => ({
  goBack: jest.fn(),
  canGoBack: () => false,
  getParent: () => undefined,
}));

describe('SleepScene', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockNavigation: any = {
    goBack: mockGoBack,
    canGoBack: mockCanGoBack,
    getParent: mockGetParent,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(true);
  });

  it('renders the screen title using i18n key', () => {
    const { getByText } = render(<SleepScene navigation={mockNavigation} />);
    // Title uses t('sleep.title') - mock returns the key
    expect(getByText('sleep.title')).toBeTruthy();
  });

  it('shows energy high i18n key on the sleep button when energy is above threshold', () => {
    const { getByText } = render(<SleepScene navigation={mockNavigation} />);
    // With energy at 90 (above 80 threshold), button shows sleep.energyHigh key
    expect(getByText('sleep.energyHigh')).toBeTruthy();
  });

  it('shows not tired i18n key as message when energy is high', () => {
    const { getByText } = render(<SleepScene navigation={mockNavigation} />);
    expect(getByText('sleep.notTired')).toBeTruthy();
  });

  it('navigates back when ScreenHeader back button is pressed', () => {
    const { getByTestId } = render(<SleepScene navigation={mockNavigation} />);
    fireEvent.press(getByTestId('screen-header-back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('navigates back when standalone back button is pressed', () => {
    const { getAllByText } = render(<SleepScene navigation={mockNavigation} />);
    // The standalone back button uses t('common.back'); there are two back buttons (header + standalone)
    const backButtons = getAllByText('common.back');
    expect(backButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.press(backButtons[backButtons.length - 1]);
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

    const { getByTestId } = render(<SleepScene navigation={mockNavigation} />);
    fireEvent.press(getByTestId('screen-header-back'));
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(mockParentGoBack).toHaveBeenCalledTimes(1);
  });
});
