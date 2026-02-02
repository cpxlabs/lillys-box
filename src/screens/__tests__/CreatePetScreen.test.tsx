import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CreatePetScreen } from '../CreatePetScreen';
import { COLORS } from '../../config/constants';

// Mock dependencies
jest.mock('../../context/PetContext', () => ({
  usePet: () => ({
    createPet: jest.fn(),
  }),
}));

jest.mock('react-native-reanimated', () => {
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

  it('updates character count color based on length', () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <CreatePetScreen navigation={mockNavigation} />
    );
    const input = getByPlaceholderText('createPet.namePlaceholder');

    // Default color (< 15 chars)
    fireEvent.changeText(input, 'ShortName');
    const charCountDefault = getByLabelText('9 common.of 20');
    expect(charCountDefault.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: '#666' })])
    );

    // Warning color (>= 15 chars)
    fireEvent.changeText(input, 'ThisNameIsLong!'); // 15 chars
    const charCountWarning = getByLabelText('15 common.of 20');
    expect(charCountWarning.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: COLORS.STAT_LEVELS.MEDIUM,
          fontWeight: 'bold',
        }),
      ])
    );

    // Limit color (20 chars)
    fireEvent.changeText(input, 'ThisNameIsVeryLong!!'); // 20 chars
    const charCountLimit = getByLabelText('20 common.of 20');
    expect(charCountLimit.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: COLORS.STAT_LEVELS.LOW,
          fontWeight: 'bold',
        }),
      ])
    );
  });
});
