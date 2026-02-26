import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MuitoHomeScreen } from '../MuitoHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockResetScore = jest.fn();
const mockUseMuito = jest.fn(() => ({
  bestScore: 0,
  resetScore: mockResetScore,
}));

jest.mock('../../context/MuitoContext', () => ({
  useMuito: () => mockUseMuito(),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockParentGoBack = jest.fn();

const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  canGoBack: jest.fn(() => false),
  getParent: jest.fn(() => ({
    goBack: mockParentGoBack,
    canGoBack: () => true,
    getParent: () => undefined,
  })),
};

describe('MuitoHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMuito.mockReturnValue({ bestScore: 0, resetScore: mockResetScore });
  });

  // ── rendering ─────────────────────────────────────────────────
  it('renders title, subtitle and instructions', () => {
    const { getByText } = render(
      <MuitoHomeScreen navigation={navigation as any} />
    );
    expect(getByText('muito.title')).toBeTruthy();
    expect(getByText('muito.subtitle')).toBeTruthy();
    expect(getByText('muito.instructions')).toBeTruthy();
  });

  it('renders the game emoji', () => {
    const { getByText } = render(
      <MuitoHomeScreen navigation={navigation as any} />
    );
    expect(getByText('🔢')).toBeTruthy();
  });

  // ── bestScore card visibility ─────────────────────────────────
  it('hides bestScore card when bestScore is 0', () => {
    const { queryByText } = render(
      <MuitoHomeScreen navigation={navigation as any} />
    );
    expect(queryByText('muito.bestScore')).toBeNull();
  });

  it('shows bestScore card and value when bestScore is positive', () => {
    mockUseMuito.mockReturnValue({ bestScore: 55, resetScore: mockResetScore });

    const { getByText } = render(
      <MuitoHomeScreen navigation={navigation as any} />
    );
    expect(getByText('muito.bestScore')).toBeTruthy();
    expect(getByText('55')).toBeTruthy();
  });

  // ── Play button ───────────────────────────────────────────────
  it('Play button resets score and navigates to MuitoGame', () => {
    const { getByText } = render(
      <MuitoHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('muito.play'));

    expect(mockResetScore).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('MuitoGame');
  });

  // ── Back button ───────────────────────────────────────────────
  it('Back delegates to parent goBack when canGoBack is false', () => {
    const { getByText } = render(
      <MuitoHomeScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('common.back'));

    expect(mockParentGoBack).toHaveBeenCalledTimes(1);
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  it('Back calls own goBack when canGoBack is true', () => {
    const nav = {
      ...navigation,
      canGoBack: jest.fn(() => true),
      goBack: jest.fn(),
    };

    const { getByText } = render(
      <MuitoHomeScreen navigation={nav as any} />
    );
    fireEvent.press(getByText('common.back'));

    expect(nav.goBack).toHaveBeenCalledTimes(1);
  });
});
