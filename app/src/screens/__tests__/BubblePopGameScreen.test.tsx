import React from 'react';
import { render } from '@testing-library/react-native';
import { BubblePopGameScreen } from '../BubblePopGameScreen';
import { describeStandardBackNavigation } from '../../testUtils/backNavigation';

jest.mock('../../context/BubblePopContext', () => ({
  useBubblePop: () => ({ bestScore: 0, updateBestScore: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describeStandardBackNavigation({
  screenName: 'BubblePopGameScreen',
  renderScreen: (navigation) => render(<BubblePopGameScreen navigation={navigation as any} />),
  getBackControl: ({ getByText }) => getByText(/common\.back/),
});
