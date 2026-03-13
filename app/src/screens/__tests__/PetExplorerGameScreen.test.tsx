import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PetExplorerGameScreen } from '../PetExplorerGameScreen';
import { createMockNavigation } from '../../testUtils/backNavigation';

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

describe('PetExplorerGameScreen', () => {
  const {
    navigation,
    mockGoBack,
    mockCanGoBack,
    mockGetParent,
  } = createMockNavigation() as {
    navigation: React.ComponentProps<typeof PetExplorerGameScreen>['navigation'];
    mockGoBack: jest.Mock;
    mockCanGoBack: jest.Mock<boolean, []>;
    mockGetParent: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(true);
  });

  it('renders retro console header and controls', () => {
    const { getByText } = render(<PetExplorerGameScreen navigation={navigation} />);

    expect(getByText('PET EXPLORER DX')).toBeTruthy();
    expect(getByText('↑')).toBeTruthy();
    expect(getByText('←')).toBeTruthy();
    expect(getByText('→')).toBeTruthy();
    expect(getByText('↓')).toBeTruthy();
  });

  it('uses the real shared back handler when back button is pressed', () => {
    const { getByText } = render(<PetExplorerGameScreen navigation={navigation} />);

    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('uses parent navigation when the current navigator cannot go back', () => {
    const parentGoBack = jest.fn();

    mockCanGoBack.mockReturnValue(false);
    mockGetParent.mockReturnValue({
      goBack: parentGoBack,
      canGoBack: () => true,
      getParent: () => undefined,
    });

    const { getByText } = render(<PetExplorerGameScreen navigation={navigation} />);

    fireEvent.press(getByText('← common.back'));

    expect(parentGoBack).toHaveBeenCalledTimes(1);
  });
});
