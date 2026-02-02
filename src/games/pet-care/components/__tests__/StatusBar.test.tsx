import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusBar } from '../StatusBar';

// Mock dependencies
jest.mock('../../../app/hooks/useResponsive', () => ({
  useResponsive: () => ({
    deviceType: 'phone',
    spacing: (v: number) => v,
  }),
}));

jest.mock('../../../app/config/responsive', () => ({
  STATUS_BAR_SIZE: {
    phone: { emojiSize: 20, fontSize: 12, barHeight: 10 },
  },
}));

describe('StatusBar', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <StatusBar
        label="Hunger"
        value={50}
        color="red"
        emoji="🍖"
      />
    );
    expect(getByText('🍖')).toBeTruthy();
    expect(getByText('50%')).toBeTruthy();
  });

  it('has correct accessibility attributes', () => {
    const { getByLabelText } = render(
      <StatusBar
        label="Hunger"
        value={50}
        color="red"
        emoji="🍖"
      />
    );

    const progressBar = getByLabelText('Hunger');

    expect(progressBar.props.accessibilityRole).toBe('progressbar');
    expect(progressBar.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 50 });
  });
});
