import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ColorTapGameScreen } from '../ColorTapGameScreen';

const mockHandleBack = jest.fn();
const mockUpdateBestScore = jest.fn();
const mockTriggerAd = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../hooks/useGameBack', () => ({
  useGameBack: () => mockHandleBack,
}));

jest.mock('../../context/ColorTapContext', () => ({
  useColorTap: () => ({
    updateBestScore: mockUpdateBestScore,
  }),
}));

jest.mock('../../components/GameAdWrapper', () => ({
  useGameAdTrigger: () => ({
    triggerAd: mockTriggerAd,
  }),
}));

jest.mock('../../components/ArtifactGameAdapter', () => ({
  ArtifactGameAdapter: ({
    htmlContent,
    onGameOver,
    onScoreUpdate,
  }: {
    htmlContent: string;
    onGameOver?: (score: number) => void;
    onScoreUpdate?: (score: number) => void;
  }) => {
    const React = require('react');
    const { Text, TouchableOpacity, View } = require('react-native');

    return React.createElement(
      View,
      null,
      React.createElement(
        Text,
        { testID: 'artifact-html-check' },
        htmlContent.includes('data-presets="react"') &&
          !htmlContent.includes('data-presets="react,typescript"') &&
          !htmlContent.includes('interface ColorOption') &&
          !htmlContent.includes('useState<ColorOption>')
          ? 'color-tap-html'
          : 'invalid-html'
      ),
      React.createElement(
        TouchableOpacity,
        { onPress: () => onScoreUpdate?.(42) },
        React.createElement(Text, null, 'score-update')
      ),
      React.createElement(
        TouchableOpacity,
        { onPress: () => onGameOver?.(99) },
        React.createElement(Text, null, 'finish-game')
      )
    );
  },
}));

describe('ColorTapGameScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes runtime-safe artifact HTML and shows the game-over overlay when the artifact finishes', () => {
    const navigation = { replace: jest.fn() } as any;
    const { getByText } = render(<ColorTapGameScreen navigation={navigation} />);

    expect(getByText('color-tap-html')).toBeTruthy();

    fireEvent.press(getByText('score-update'));
    expect(getByText('42')).toBeTruthy();

    fireEvent.press(getByText('finish-game'));

    expect(mockUpdateBestScore).toHaveBeenCalledWith(99);
    expect(getByText('colorTap.gameOver.playAgain')).toBeTruthy();

    fireEvent.press(getByText('colorTap.gameOver.playAgain'));
    expect(navigation.replace).toHaveBeenCalledWith('ColorTapGame');
  });
});
