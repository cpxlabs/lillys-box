import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

// Get device language
import { Platform, NativeModules } from 'react-native';

const getDeviceLanguage = () => {
  const locale =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
        'en'
      : Platform.OS === 'android'
        ? NativeModules.I18nManager?.localeIdentifier || 'en'
        : // For web, use browser language
          navigator.language || 'en';

  // Normalize locale (e.g., 'pt-BR', 'pt_BR', 'pt' -> 'pt-BR')
  if (locale.toLowerCase().startsWith('pt')) {
    return 'pt-BR';
  }

  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    'pt-BR': {
      translation: ptBR,
    },
  },
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
