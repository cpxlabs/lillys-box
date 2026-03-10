import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CreatePetScreen } from '../CreatePetScreen';

// Mock dependencies
jest.mock('../../context/PetContext', () => ({
  usePet: () => ({
    createPet: jest.fn(),
  }),
}));

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const Animated = {
    View,
    createAnimatedComponent: (component: React.ComponentType) => component,
  };
  return {
    __esModule: true,
    default: Animated,
    useSharedValue: jest.fn((val) => ({ value: val })),
    useAnimatedStyle: jest.fn((cb) => cb()),
    withSpring: jest.fn((val) => val),
    withTiming: jest.fn((val) => val),
    withSequence: jest.fn((...args) => args[args.length - 1]),
    withRepeat: jest.fn((val) => val),
    cancelAnimation: jest.fn(),
    Easing: { out: jest.fn((fn) => fn), linear: jest.fn() },
    runOnJS: jest.fn((fn) => fn),
  };
});

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../utils/haptics', () => ({
  hapticFeedback: {
    light: jest.fn(),
    selection: jest.fn(),
  },
}));

jest.mock('../../hooks/useBackButton', () => ({
  BackButtonIcon: () => null,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  setOptions: jest.fn(),
  dispatch: jest.fn(),
  isFocused: jest.fn(),
  canGoBack: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
} as unknown as any;

describe('CreatePetScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<CreatePetScreen navigation={mockNavigation} />);

    expect(getByText('createPet.title')).toBeTruthy();
  });

  it('has accessible character count', () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <CreatePetScreen navigation={mockNavigation} />
    );

    // Initially empty name
    const input = getByPlaceholderText('createPet.namePlaceholder');
    fireEvent.changeText(input, 'Fluffy');

    // Check if accessibility label is present (initially 0/20, then 6/20)
    // The current implementation uses t('common.of') which mocks to "common.of"
    expect(getByLabelText('6 common.of 20')).toBeTruthy();
  });
});
