import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { WhackAMoleGameScreen } from '../WhackAMoleGameScreen';
import { createMockNavigation, describeStandardBackNavigation } from '../../testUtils/backNavigation';

jest.mock('../../context/WhackAMoleContext', () => ({
  useWhackAMole: () => ({ bestScore: 0, updateBestScore: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const { navigation: mockNavigation } = createMockNavigation();

describeStandardBackNavigation({
  screenName: 'WhackAMoleGameScreen',
  renderScreen: (navigation) => render(<WhackAMoleGameScreen navigation={navigation as any} />),
  getBackControl: ({ getByText }) => getByText(/common\.back/),
});

describe('WhackAMoleGameScreen hammer feedback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('shows a hammer briefly when a hole is tapped', () => {
    const { getByTestId, queryByText } = render(<WhackAMoleGameScreen navigation={mockNavigation} />);

    expect(queryByText('🔨')).toBeNull();

    fireEvent.press(getByTestId('hole-0'));
    expect(queryByText('🔨')).not.toBeNull();

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(queryByText('🔨')).toBeNull();
  });
});
