import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PetExplorerGameScreen } from '../PetExplorerGameScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
jest.mock('../../context/PetExplorerContext', () => ({
  usePetExplorer: () => ({
    bestScore: 0,
    updateBestScore: mockUpdateBestScore,
  }),
}));

const mockTriggerAd = jest.fn(async () => 0);
jest.mock('../../components/GameAdWrapper', () => ({
  useGameAdTrigger: () => ({ triggerAd: mockTriggerAd }),
}));

const mockHandleBack = jest.fn();
jest.mock('../../hooks/useGameBack', () => ({
  useGameBack: () => mockHandleBack,
}));

describe('PetExplorerGameScreen', () => {
  const navigation: React.ComponentProps<typeof PetExplorerGameScreen>['navigation'] = {
    goBack: jest.fn(),
    canGoBack: jest.fn(() => true),
    getParent: jest.fn(() => undefined),
  } as React.ComponentProps<typeof PetExplorerGameScreen>['navigation'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders retro console header and controls', () => {
    const { getByText } = render(<PetExplorerGameScreen navigation={navigation} />);

    expect(getByText('PET EXPLORER DX')).toBeTruthy();
    expect(getByText('↑')).toBeTruthy();
    expect(getByText('←')).toBeTruthy();
    expect(getByText('→')).toBeTruthy();
    expect(getByText('↓')).toBeTruthy();
  });

  it('triggers back handler when back button is pressed', () => {
    const { getByText } = render(<PetExplorerGameScreen navigation={navigation} />);

    fireEvent.press(getByText('← common.back'));
    expect(mockHandleBack).toHaveBeenCalledTimes(1);
  });
});
