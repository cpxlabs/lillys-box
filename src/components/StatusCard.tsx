import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pet } from '../types';
import { EnhancedStatusBar } from './EnhancedStatusBar';

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
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.splitLayout}>
        {/* Left Column (30%): Pet Info */}
        <View style={styles.leftColumn}>
          <Text style={styles.petName}>{petName}</Text>
          <Text style={styles.petAge}>{petAge}</Text>
          <View style={styles.moneyContainer}>
            <Text style={styles.coinIcon}>💰</Text>
            <Text style={styles.moneyValue}>{pet.money ?? 0}</Text>
          </View>
        </View>

        {/* Middle (40%): Empty */}
        <View style={styles.middleColumn} />

        {/* Right Column (30%): Status Bars */}
        <View style={styles.rightColumn}>
          <EnhancedStatusBar
            pet={pet}
            compact={compact}
            showPercentage={false}
            twoColumnLayout
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 16,
  },
  cardCompact: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 12,
  },
  splitLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftColumn: {
    width: '30%',
    paddingRight: 12,
  },
  middleColumn: {
    width: '40%',
  },
  rightColumn: {
    width: '30%',
    paddingLeft: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  petAge: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  coinIcon: {
    fontSize: 14,
    marginRight: 3,
  },
  moneyValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
