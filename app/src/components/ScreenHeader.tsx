import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

type ScreenHeaderProps = {
  title: string;
  onBackPress?: () => void;
  BackButtonIcon?: React.ComponentType;
};

export const ScreenHeader: React.FC<ScreenHeaderProps> = React.memo(({
  title,
  onBackPress,
  BackButtonIcon,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {onBackPress && BackButtonIcon && (
          <TouchableOpacity
            onPress={onBackPress}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
          >
            <BackButtonIcon />
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightSection} />
    </View>
  );
});
ScreenHeader.displayName = 'ScreenHeader';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  rightSection: {
    flex: 1,
  },
});
