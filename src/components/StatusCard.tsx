import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Pet } from '../types';
import { EnhancedStatusBar } from './EnhancedStatusBar';
import { useResponsive } from '../hooks/useResponsive';

type StatusCardProps = {
  pet: Pet;
  compact?: boolean;
  petName: string;
  petAge: string;
};

export const StatusCard: React.FC<StatusCardProps> = ({
  pet,
  compact = false,
  petName,
  petAge,
}) => {
  const { t } = useTranslation();
  const { fs, spacing } = useResponsive();

  const dynamicStyles = {
    card: {
      marginHorizontal: spacing(compact ? 8 : 10),
      marginVertical: spacing(compact ? 4 : 6),
      padding: spacing(compact ? 8 : 10),
      borderRadius: spacing(10),
    },
    petName: {
      fontSize: fs(compact ? 14 : 15),
      marginBottom: spacing(3),
    },
    petAge: {
      fontSize: fs(compact ? 11 : 12),
      marginBottom: spacing(5),
    },
    moneyContainer: {
      paddingVertical: spacing(2),
      paddingHorizontal: spacing(6),
      borderRadius: spacing(5),
    },
    coinIcon: {
      fontSize: fs(12),
      marginRight: spacing(2),
    },
    moneyValue: {
      fontSize: fs(12),
    },
  };

  return (
    <View style={[styles.card, dynamicStyles.card]}>
      <View style={styles.splitLayout}>
        {/* Left Column (30%): Pet Info */}
        <View style={styles.leftColumn}>
          <Text style={[styles.petName, dynamicStyles.petName]}>{petName}</Text>
          <Text style={[styles.petAge, dynamicStyles.petAge]}>{petAge}</Text>
          <View
            style={[styles.moneyContainer, dynamicStyles.moneyContainer]}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`${pet.money ?? 0} ${t('common.coins')}`}
          >
            <Text style={[styles.coinIcon, dynamicStyles.coinIcon]}>💰</Text>
            <Text style={[styles.moneyValue, dynamicStyles.moneyValue]}>{pet.money ?? 0}</Text>
          </View>
        </View>

        {/* Middle (40%): Empty */}
        <View style={styles.middleColumn} />

        {/* Right Column (30%): Status Bars */}
        <View style={styles.rightColumn}>
          <EnhancedStatusBar pet={pet} compact={compact} showPercentage={false} twoColumnLayout />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
  },
  splitLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftColumn: {
    width: '30%',
    paddingRight: 6,
  },
  middleColumn: {
    width: '40%',
  },
  rightColumn: {
    width: '30%',
    paddingLeft: 6,
  },
  petName: {
    fontWeight: 'bold',
    color: '#333',
  },
  petAge: {
    color: '#666',
  },
  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    alignSelf: 'flex-start',
  },
  coinIcon: {},
  moneyValue: {
    fontWeight: 'bold',
    color: '#333',
  },
});
