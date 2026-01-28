import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CreatePetScreen } from '../CreatePetScreen';
import { usePet } from '../../context/PetContext';

// Mock dependencies
jest.mock('../../context/PetContext', () => ({
  usePet: jest.fn(),
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
  const mockCreatePet = jest.fn();

  beforeEach(() => {
    (usePet as jest.Mock).mockReturnValue({
      createPet: mockCreatePet,
    });
  });

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

  it('shows loading state during pet creation', async () => {
    let resolveCreate: (value: void | PromiseLike<void>) => void;
    const createPromise = new Promise<void>((resolve) => {
      resolveCreate = resolve;
    });
    mockCreatePet.mockReturnValue(createPromise);

    const { getByLabelText, getByPlaceholderText, queryByText } = render(
      <CreatePetScreen navigation={mockNavigation} />
    );

    // Enter valid name
    const input = getByPlaceholderText('createPet.namePlaceholder');
    fireEvent.changeText(input, 'Fluffy');

    // Find create button
    const createButton = getByLabelText('createPet.createButton');

    // Press button
    fireEvent.press(createButton);

    // Verify loading state: Text should be gone (replaced by ActivityIndicator)
    expect(queryByText('createPet.createButton')).toBeNull();

    // Verify button is disabled/busy via accessibility
    expect(createButton.props.accessibilityState).toEqual({
      disabled: true,
      busy: true,
    });

    // Resolve promise to clean up
    resolveCreate!();
    await waitFor(() => expect(mockCreatePet).toHaveBeenCalled());
  });
});
