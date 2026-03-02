import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SettingsModal } from '../SettingsModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback: string) => fallback ?? key,
  }),
}));

jest.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'en',
    setLanguage: jest.fn(),
  }),
}));

jest.mock('../../hooks/useAudio', () => ({
  useAudio: () => ({
    soundEnabled: true,
    musicEnabled: false,
    respectSilentMode: false,
    setSoundEnabled: jest.fn(),
    setMusicEnabled: jest.fn(),
    setRespectSilentMode: jest.fn(),
  }),
}));

const baseProps = {
  visible: true,
  onClose: jest.fn(),
  uiIndex: 0,
  onUiIndexChange: jest.fn(),
};

describe('SettingsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders null when not visible', () => {
    const { toJSON } = render(<SettingsModal {...baseProps} visible={false} />);
    expect(toJSON()).toBeNull();
  });

  it('renders the settings title', () => {
    const { getByText } = render(<SettingsModal {...baseProps} />);
    expect(getByText('Settings')).toBeTruthy();
  });

  it('shows the language tab by default', () => {
    const { getByText } = render(<SettingsModal {...baseProps} />);
    expect(getByText('Select Language')).toBeTruthy();
  });

  it('switches to audio tab when audio tab button is pressed', () => {
    const { getByText } = render(<SettingsModal {...baseProps} />);
    fireEvent.press(getByText('Audio'));
    expect(getByText('Audio Settings')).toBeTruthy();
  });

  it('switches to interface tab when interface tab button is pressed', () => {
    const { getByText } = render(<SettingsModal {...baseProps} />);
    fireEvent.press(getByText('Interface'));
    expect(getByText('Select Interface')).toBeTruthy();
  });

  it('calls onUiIndexChange and onClose when an interface variant is selected', () => {
    const onUiIndexChange = jest.fn();
    const onClose = jest.fn();
    const { getByText } = render(
      <SettingsModal
        {...baseProps}
        onUiIndexChange={onUiIndexChange}
        onClose={onClose}
      />,
    );
    fireEvent.press(getByText('Interface'));
    fireEvent.press(getByText('Default Grid'));
    expect(onUiIndexChange).toHaveBeenCalledWith(0);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders language options', () => {
    const { getByText } = render(<SettingsModal {...baseProps} />);
    expect(getByText('English')).toBeTruthy();
  });
});
