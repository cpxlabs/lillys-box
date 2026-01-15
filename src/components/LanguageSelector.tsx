import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, language === 'en' && styles.buttonActive]}
        onPress={() => setLanguage('en')}
      >
        <Text style={[styles.flag, language === 'en' && styles.flagActive]}>🇺🇸</Text>
        <Text style={[styles.text, language === 'en' && styles.textActive]}>EN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, language === 'pt-BR' && styles.buttonActive]}
        onPress={() => setLanguage('pt-BR')}
      >
        <Text style={[styles.flag, language === 'pt-BR' && styles.flagActive]}>🇧🇷</Text>
        <Text style={[styles.text, language === 'pt-BR' && styles.textActive]}>PT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  buttonActive: {
    borderColor: '#9b59b6',
    backgroundColor: '#f3e5f5',
  },
  flag: {
    fontSize: 20,
    marginRight: 6,
  },
  flagActive: {
    fontSize: 22,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  textActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9b59b6',
  },
});
