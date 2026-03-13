import React from 'react';
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { SimonSaysGameScreen } from '../SimonSaysGameScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockHandleBack = jest.fn();
const mockTriggerAd = jest.fn();

jest.mock('../../context/SimonSaysContext', () => ({
  useSimonSays: () => ({
    bestScore: 0,
    updateBestScore: mockUpdateBestScore,
  }),
}));

jest.mock('../../hooks/useGameBack', () => ({
  useGameBack: () => mockHandleBack,
}));

jest.mock('../../components/GameAdWrapper', () => ({
  useGameAdTrigger: () => ({
    triggerAd: mockTriggerAd,
  }),
}));

describe('SimonSaysGameScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders a full-width button grid with four color buttons', () => {
    const { getByTestId, getAllByLabelText } = render(
      <SimonSaysGameScreen navigation={{ goBack: jest.fn() } as any} />
    );

    expect(getAllByLabelText(/button$/i)).toHaveLength(4);
    expect(StyleSheet.flatten(getByTestId('simon-says-button-grid').props.style)).toEqual(
      expect.objectContaining({
        width: '100%',
        maxWidth: 400,
      })
    );
  });
});
