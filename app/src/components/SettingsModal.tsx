import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

type UIVariant = {
  key: string;
  label: string;
  component?: React.ComponentType<any>;
};

const UI_VARIANTS: UIVariant[] = [
  { key: 'default', label: 'Default Grid' },
  { key: 'alt1', label: '1 Compact List' },
  { key: 'alt2', label: '2 Categories' },
  { key: 'alt3', label: '3 Favorites Only' },
  { key: 'alt4', label: '4 Large Cards' },
  { key: 'alt5', label: '5 Carousel' },
  { key: 'alt6', label: '6 Alphabetical' },
  { key: 'alt7', label: '7 Recent' },
  { key: 'alt8', label: '8 Most Played' },
  { key: 'alt9', label: '9 Search' },
  { key: 'alt10', label: '10 Grid + List' },
  { key: 'alt11', label: '11 Compact Grid' },
  { key: 'alt12', label: '12 Wide Cards' },
  { key: 'alt13', label: '13 Tabs' },
  { key: 'alt14', label: '14 Drawer' },
  { key: 'alt15', label: '15 Bottom Nav' },
  { key: 'alt16', label: '16 Floating' },
  { key: 'alt17', label: '17 Minimal' },
  { key: 'alt18', label: '18 Fullscreen' },
  { key: 'alt19', label: '19 Icon Only' },
  { key: 'alt20', label: '20 Color Coded' },
  { key: 'alt21', label: '21 Badge Count' },
  { key: 'alt22', label: '22 Preview' },
  { key: 'alt23', label: '23 ABC Blocks' },
  { key: 'alt24', label: '24 Watercolor' },
  { key: 'alt25', label: '25 Pocket' },
];

const LANGUAGES = [
  { code: 'en' as const, label: 'English', flag: '🇺🇸' },
  { code: 'pt-BR' as const, label: 'Português (BR)', flag: '🇧🇷' },
];

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
  uiIndex: number;
  onUiIndexChange: (index: number) => void;
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  uiIndex,
  onUiIndexChange,
}) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'language' | 'ui'>('language');

  const handleLanguageSelect = async (langCode: 'en' | 'pt-BR') => {
    await setLanguage(langCode);
  };

  const handleUiSelect = (index: number) => {
    onUiIndexChange(index);
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable 
        style={styles.backdrop} 
        onPress={onClose}
      />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings.title', 'Settings')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'language' && styles.tabActive]}
            onPress={() => setActiveTab('language')}
          >
            <Text style={[styles.tabText, activeTab === 'language' && styles.tabTextActive]}>
              {t('settings.language', 'Language')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ui' && styles.tabActive]}
            onPress={() => setActiveTab('ui')}
          >
            <Text style={[styles.tabText, activeTab === 'ui' && styles.tabTextActive]}>
              {t('settings.interface', 'Interface')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'language' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('settings.selectLanguage', 'Select Language')}</Text>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.option,
                    language === lang.code && styles.optionActive,
                  ]}
                  onPress={() => handleLanguageSelect(lang.code)}
                >
                  <Text style={styles.optionFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.optionLabel,
                    language === lang.code && styles.optionLabelActive,
                  ]}>
                    {lang.label}
                  </Text>
                  {language === lang.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'ui' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('settings.selectInterface', 'Select Interface')}</Text>
              <Text style={styles.sectionHint}>{t('settings.interfaceHint', 'Choose how games are displayed')}</Text>
              {UI_VARIANTS.map((variant, idx) => (
                <TouchableOpacity
                  key={variant.key}
                  style={[
                    styles.option,
                    uiIndex === idx && styles.optionActive,
                  ]}
                  onPress={() => handleUiSelect(idx)}
                >
                  <Text style={[
                    styles.optionLabel,
                    uiIndex === idx && styles.optionLabelActive,
                  ]}>
                    {variant.label}
                  </Text>
                  {uiIndex === idx && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#9b59b6',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#9b59b6',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    marginTop: -8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  optionActive: {
    backgroundColor: '#f5f0ff',
    borderColor: '#9b59b6',
    borderWidth: 2,
  },
  optionFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  optionLabelActive: {
    fontWeight: '600',
    color: '#9b59b6',
  },
  checkmark: {
    fontSize: 18,
    color: '#9b59b6',
    fontWeight: '700',
  },
});
