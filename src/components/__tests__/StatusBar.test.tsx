import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusBar } from '../StatusBar';

describe('StatusBar', () => {
  const mockProps = {
    label: 'Hunger',
    value: 50,
    color: 'red',
    emoji: '🍖',
  };

  it('renders correctly', () => {
    const { getByText } = render(<StatusBar {...mockProps} />);

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
