import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MemoryMatchHomeScreen } from '../MemoryMatchHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockUseMemoryMatch = jest.fn(() => ({
  bestScores: { easy: 0, medium: 0, hard: 0 },
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/MemoryMatchContext', () => ({
  useMemoryMatch: () => mockUseMemoryMatch(),
  Difficulty: {},
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockParentGoBack = jest.fn();

const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  canGoBack: jest.fn(() => false),
  getParent: jest.fn(() => ({ goBack: mockParentGoBack })),
};

describe('MemoryMatchHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMemoryMatch.mockReturnValue({
      bestScores: { easy: 0, medium: 0, hard: 0 },
      updateBestScore: mockUpdateBestScore,
    });
  });

  // ── rendering ─────────────────────────────────────────────────
  it('renders title, subtitle and instructions', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    expect(getByText('memoryMatch.title')).toBeTruthy();
    expect(getByText('memoryMatch.subtitle')).toBeTruthy();
    expect(getByText('memoryMatch.instructions')).toBeTruthy();
  });

  it('renders the game emoji', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    expect(getByText('🧠')).toBeTruthy();
  });

  // ── difficulty selector ───────────────────────────────────────
  it('renders all three difficulty buttons', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    expect(getByText('memoryMatch.difficulty.easy')).toBeTruthy();
    expect(getByText('memoryMatch.difficulty.medium')).toBeTruthy();
    expect(getByText('memoryMatch.difficulty.hard')).toBeTruthy();
  });

  it('navigates with selected difficulty when play is pressed', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );

    // Select medium difficulty
    fireEvent.press(getByText('memoryMatch.difficulty.medium'));
    fireEvent.press(getByText('memoryMatch.play'));

    expect(mockNavigate).toHaveBeenCalledWith('MemoryMatchGame', { difficulty: 'medium' });
  });

  it('defaults to easy difficulty', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );

    fireEvent.press(getByText('memoryMatch.play'));

    expect(mockNavigate).toHaveBeenCalledWith('MemoryMatchGame', { difficulty: 'easy' });
  });

  // ── bestScore card visibility ─────────────────────────────────
  it('hides bestScore card when bestScore is 0', () => {
    const { queryByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    expect(queryByText('memoryMatch.bestScore')).toBeNull();
  });

  it('shows bestScore card when selected difficulty has a positive score', () => {
    mockUseMemoryMatch.mockReturnValue({
      bestScores: { easy: 45, medium: 0, hard: 0 },
      updateBestScore: mockUpdateBestScore,
    });

    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );
    expect(getByText('memoryMatch.bestScore')).toBeTruthy();
    expect(getByText('45')).toBeTruthy();
  });

  it('updates displayed bestScore when switching difficulty', () => {
    mockUseMemoryMatch.mockReturnValue({
      bestScores: { easy: 20, medium: 55, hard: 0 },
      updateBestScore: mockUpdateBestScore,
    });

    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
    );

    // Default is easy, should show 20
    expect(getByText('20')).toBeTruthy();

    // Switch to medium, should show 55
    fireEvent.press(getByText('memoryMatch.difficulty.medium'));
    expect(getByText('55')).toBeTruthy();
  });

  // ── Back button ───────────────────────────────────────────────
  it('Back delegates to parent goBack when canGoBack is false', () => {
    const { getByText } = render(
      <MemoryMatchHomeScreen navigation={navigation as any} />
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
      <MemoryMatchHomeScreen navigation={nav as any} />
    );
    fireEvent.press(getByText('common.back'));

    expect(nav.goBack).toHaveBeenCalledTimes(1);
  });
});
