import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ConfigMenu } from './ConfigMenu';

type ScreenHeaderProps = {
  title: string;
  onBackPress?: () => void;
  BackButtonIcon?: React.ComponentType;
};

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBackPress,
  BackButtonIcon,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {onBackPress && BackButtonIcon && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <BackButtonIcon />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightSection}>
        <ConfigMenu />
      </View>
    </View>
  );
};

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
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  backButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginLeft: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
