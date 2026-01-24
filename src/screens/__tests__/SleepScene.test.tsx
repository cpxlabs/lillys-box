import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { SleepScene } from '../SleepScene';

// Mock dependencies
const mockShowToast = jest.fn();

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast,
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

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
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

  it('shows toast when sleep button is pressed and energy is high', () => {
    const { getByText } = render(<SleepScene navigation={mockNavigation} />);

    // The button text should be 'Energy is high' because energy is 90
    const sleepButton = getByText('Energy is high');

    // In the original code, the button is disabled, so onPress won't fire.
    // After our fix, it should be enabled and fire onPress.

    fireEvent.press(sleepButton);

    // Verify showToast was called
    expect(mockShowToast).toHaveBeenCalledWith('Energy is high', 'info');
  });
});
