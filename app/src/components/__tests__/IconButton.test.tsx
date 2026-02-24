import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { IconButton } from '../IconButton';

// Mock dependencies
jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    deviceType: 'phone',
    spacing: (v: number) => v,
  }),
}));

jest.mock('../../config/responsive', () => ({
  ICON_BUTTON_SIZE: {
    phone: { width: 50, padding: 10, emoji: 20, label: 12 },
  },
}));

const mockShowToast = jest.fn();

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('../../utils/haptics', () => ({
  hapticFeedback: {
    light: jest.fn(),
  },
}));

describe('IconButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<IconButton emoji="👋" label="Hello" onPress={() => {}} />);
    expect(getByText('👋')).toBeTruthy();
    expect(getByText('Hello')).toBeTruthy();
  });

  it('calls onPress when enabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<IconButton emoji="👋" label="Hello" onPress={onPressMock} />);

    fireEvent.press(getByText('Hello'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('shows toast and does not call onPress when disabled WITH reason', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <IconButton
        emoji="👋"
        label="Hello"
        onPress={onPressMock}
        disabled
        disabledReason="Not allowed"
      />
    );

    fireEvent.press(getByText('Hello'));
    expect(onPressMock).not.toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith('Not allowed', 'info');
  });
});
