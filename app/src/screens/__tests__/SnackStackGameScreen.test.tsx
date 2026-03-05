import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SnackStackGameScreen } from '../SnackStackGameScreen';

jest.mock('../../context/SnackStackContext', () => ({
  useSnackStack: () => ({ bestScore: 0, updateBestScore: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/useGameBack', () => ({
  useGameBack: (navigation: any) => () => {
    if (navigation.canGoBack()) return navigation.goBack();
    const p = navigation.getParent?.();
    if (p && p.canGoBack()) return p.goBack();
  },
}));

const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockGetParent = jest.fn(() => undefined);
const mockNavigation = { goBack: mockGoBack, canGoBack: mockCanGoBack, getParent: mockGetParent } as any;

describe('SnackStackGameScreen back navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(true);
  });

  it('navigates back when header back is pressed', () => {
    const { getByText } = render(<SnackStackGameScreen navigation={mockNavigation} />);
    fireEvent.press(getByText(/common\.back/));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('uses parent navigation when cannot go back', () => {
    const parentGoBack = jest.fn();
    mockCanGoBack.mockReturnValue(false);
    mockGetParent.mockReturnValue({ goBack: parentGoBack, canGoBack: () => true, getParent: () => undefined });

    const { getByText } = render(<SnackStackGameScreen navigation={mockNavigation} />);
    fireEvent.press(getByText(/common\.back/));
    expect(parentGoBack).toHaveBeenCalledTimes(1);
  });
});
