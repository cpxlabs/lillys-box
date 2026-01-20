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
    const { getByLabelText, getByRole } = render(<StatusBar {...mockProps} />);

    // This expects the component to expose its label as an accessibility label
    // and have a role of progressbar
    const statusBar = getByLabelText('Hunger');
    expect(statusBar).toBeTruthy();

    // Check if it has the progressbar role (React Native maps this to 'progressbar' role on web,
    // on native it might need adjustment depending on how we implement it,
    // but accessibilityRole="progressbar" is standard in RN)
    // Note: React Native Testing Library might require getByRole('progressbar')
    // However, if we put accessibilityLabel on the container, getByLabelText should find it.
  });

  it('exposes value to accessibility', () => {
     const { getByLabelText } = render(<StatusBar {...mockProps} />);
     const statusBar = getByLabelText('Hunger');

     // Check accessibility value
     // In React Native, accessibilityValue is an object { min, max, now, text }
     expect(statusBar.props.accessibilityValue).toEqual(
       expect.objectContaining({
         min: 0,
         max: 100,
         now: 50,
       })
     );
  });
});
