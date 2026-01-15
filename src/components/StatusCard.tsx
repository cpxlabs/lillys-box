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
      {/* Top Row: Pet Info and Money */}
      <View style={styles.topRow}>
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{petName}</Text>
          <Text style={styles.petAge}>{petAge}</Text>
        </View>
        <View style={styles.moneyContainer}>
          <Text style={styles.coinIcon}>💰</Text>
          <Text style={styles.moneyValue}>{pet.money ?? 0}</Text>
        </View>
      </View>

      {/* Status Bars - No Percentages */}
      <EnhancedStatusBar pet={pet} compact={compact} showPercentage={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardCompact: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  petAge: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  coinIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  moneyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
