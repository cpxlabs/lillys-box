import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ScreenHeader } from '../ScreenHeader';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/useBackButton', () => ({
  useBackButton: () => () => null,
}));

const MockBackIcon = () => null;

describe('ScreenHeader', () => {
  it('renders the given title', () => {
    const { getByText } = render(
      <ScreenHeader title="bath.title" />
    );
    expect(getByText('bath.title')).toBeTruthy();
  });

  it('does not render back button when onBackPress is not provided', () => {
    const { queryByText } = render(
      <ScreenHeader title="some.title" />
    );
    // common.back key should not appear if there is no back handler
    expect(queryByText('common.back')).toBeNull();
  });

  it('does not render back button when BackButtonIcon is not provided', () => {
    const onBackPress = jest.fn();
    const { queryByText } = render(
      <ScreenHeader title="some.title" onBackPress={onBackPress} />
    );
    expect(queryByText('common.back')).toBeNull();
  });

  it('renders back button with i18n text when both onBackPress and BackButtonIcon are provided', () => {
    const onBackPress = jest.fn();
    const { getByText } = render(
      <ScreenHeader
        title="some.title"
        onBackPress={onBackPress}
        BackButtonIcon={MockBackIcon}
      />
    );
    // Uses t('common.back') - mock returns the key
    expect(getByText('common.back')).toBeTruthy();
  });

  it('calls onBackPress when back button is pressed', () => {
    const onBackPress = jest.fn();
    const { getByText } = render(
      <ScreenHeader
        title="some.title"
        onBackPress={onBackPress}
        BackButtonIcon={MockBackIcon}
      />
    );
    fireEvent.press(getByText('common.back'));
    expect(onBackPress).toHaveBeenCalledTimes(1);
  });

  it('does not display hardcoded Portuguese text', () => {
    const onBackPress = jest.fn();
    const { queryByText } = render(
      <ScreenHeader
        title="some.title"
        onBackPress={onBackPress}
        BackButtonIcon={MockBackIcon}
      />
    );
    // Should never show 'Voltar' hardcoded
    expect(queryByText('Voltar')).toBeNull();
  });
});
