import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';

export const ConfigMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [soundEnabled, setSoundEnabled] = useState(true); // Mock state for now

  return (
    <View>
      {/* Config Icon Button */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.iconText}>⚙️</Text>
      </TouchableOpacity>

      {/* Config Menu Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>{t('config.title', 'Settings')}</Text>

            {/* Language Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('config.language', 'Language')}</Text>
              <View style={styles.languageButtons}>
                <TouchableOpacity
                  style={[styles.langButton, language === 'en' && styles.langButtonActive]}
                  onPress={() => setLanguage('en')}
                >
                  <Text style={styles.flag}>🇺🇸</Text>
                  <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>
                    EN
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.langButton, language === 'pt-BR' && styles.langButtonActive]}
                  onPress={() => setLanguage('pt-BR')}
                >
                  <Text style={styles.flag}>🇧🇷</Text>
                  <Text style={[styles.langText, language === 'pt-BR' && styles.langTextActive]}>
                    PT
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sound Section (Mocked) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('config.sound', 'Sound')}</Text>
              <TouchableOpacity
                style={styles.soundToggle}
                onPress={() => setSoundEnabled(!soundEnabled)}
              >
                <Text style={styles.soundIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
                <Text style={styles.soundText}>
                  {soundEnabled ? t('config.soundOn', 'On') : t('config.soundOff', 'Off')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsOpen(false)}
            >
              <Text style={styles.closeButtonText}>{t('config.close', 'Close')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  iconText: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'web' ? 60 : 50,
    paddingRight: 10,
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  langButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  langButtonActive: {
    borderColor: '#9b59b6',
    backgroundColor: '#f3e5f5',
  },
  flag: {
    fontSize: 18,
    marginRight: 6,
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  langTextActive: {
    fontWeight: 'bold',
    color: '#9b59b6',
  },
  soundToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  soundIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  soundText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
