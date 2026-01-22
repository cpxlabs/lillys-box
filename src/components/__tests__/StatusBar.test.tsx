import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusBar } from '../StatusBar';

// Mock dependencies
jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    deviceType: 'phone',
    spacing: (v: number) => v,
  }),
}));

jest.mock('../../config/responsive', () => ({
  STATUS_BAR_SIZE: {
    phone: { fontSize: 14, emojiSize: 20, barHeight: 10 },
  },
}));

describe('StatusBar', () => {
  it('renders correctly with accessibility props', () => {
    const { getByRole, getByText } = render(
      <StatusBar
        label="Health"
        value={75}
        color="red"
        emoji="❤️"
      />
    );

    // Check if the emoji and percentage are rendered
    expect(getByText('❤️')).toBeTruthy();
    expect(getByText('75%')).toBeTruthy();

    // Check accessibility
    // Note: getByRole('progressbar') corresponds to accessibilityRole="progressbar"
    const progressBar = getByRole('progressbar');
    expect(progressBar).toBeTruthy();
    expect(progressBar.props.accessibilityLabel).toBe('Health');
    expect(progressBar.props.accessibilityValue).toEqual({
      min: 0,
      max: 100,
      now: 75,
    });
  });
});
