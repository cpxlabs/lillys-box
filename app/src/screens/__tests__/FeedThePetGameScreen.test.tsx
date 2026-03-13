import React from 'react';
import { render } from '@testing-library/react-native';
import { FeedThePetGameScreen } from '../FeedThePetGameScreen';
import { describeStandardBackNavigation } from '../../testUtils/backNavigation';

jest.mock('../../context/FeedThePetContext', () => ({
  useFeedThePet: () => ({ bestScore: 0, updateBestScore: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describeStandardBackNavigation({
  screenName: 'FeedThePetGameScreen',
  renderScreen: (navigation) => render(<FeedThePetGameScreen navigation={navigation as any} />),
  getBackControl: ({ getByText }) => getByText(/feedThePet\.game\.back/),
});
