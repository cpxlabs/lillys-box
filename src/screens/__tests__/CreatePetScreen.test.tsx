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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return {
    ...Reanimated,
    useSharedValue: jest.fn((val) => ({ value: val })),
    useAnimatedStyle: jest.fn((cb) => cb()),
    withSpring: jest.fn((val) => val),
    withTiming: jest.fn((val) => val),
    withSequence: jest.fn((...args) => args[args.length - 1]),
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as unknown as any;

describe('CreatePetScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<CreatePetScreen navigation={mockNavigation} />);

    expect(getByText('createPet.title')).toBeTruthy();
  });

  it('has accessible character count', () => {
    const { getByLabelText, getByPlaceholderText } = render(<CreatePetScreen navigation={mockNavigation} />);

    // Initially empty name
    const input = getByPlaceholderText('createPet.namePlaceholder');
    fireEvent.changeText(input, 'Fluffy');

    // Check if accessibility label is present (initially 0/20, then 6/20)
    // The current implementation uses t('common.of') which mocks to "common.of"
    expect(getByLabelText('6 common.of 20')).toBeTruthy();
  });

  it('button is accessible and interactive even when name is empty', () => {
    const { getByLabelText } = render(<CreatePetScreen navigation={mockNavigation} />);

    const createButton = getByLabelText('createPet.createButton');

    // Should NOT have disabled state for screen reader (so it's clickable to show toast)
    expect(createButton.props.accessibilityState).not.toEqual(
      expect.objectContaining({ disabled: true })
    );

    // Should have hint explaining requirement
    expect(createButton.props.accessibilityHint).toBe('createPet.nameRequired');
  });
});
