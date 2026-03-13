import React from 'react';
import { render } from '@testing-library/react-native';
import { WordBubblesGameScreen } from '../WordBubblesGameScreen';
import { describeStandardBackNavigation } from '../../testUtils/backNavigation';

jest.mock('../../context/WordBubblesContext', () => ({
  useWordBubbles: () => ({ bestScore: 0, updateBestScore: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describeStandardBackNavigation({
  screenName: 'WordBubblesGameScreen',
  renderScreen: (navigation) => render(<WordBubblesGameScreen navigation={navigation as any} />),
  getBackControl: ({ getByText }) => getByText(/common\.back/),
});
