import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pet } from '../types';
import { EnhancedStatusBar } from './EnhancedStatusBar';

type StatusCardProps = {
  pet: Pet;
  compact?: boolean;
  petName?: string;
  petAge?: string;
};

export const StatusCard: React.FC<StatusCardProps> = ({
  pet,
  compact = false,
  petName,
  petAge,
}) => {
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      {/* Pet Name and Age - Optional */}
      {(petName || petAge) && (
        <View style={styles.petInfoSection}>
          {petName && <Text style={styles.petName}>{petName}</Text>}
          {petAge && <Text style={styles.petAge}>{petAge}</Text>}
        </View>
      )}

      {/* Money Display - Icon Only */}
      <View style={styles.moneyRow}>
        <Text style={styles.coinIcon}>💰</Text>
        <Text style={styles.moneyValue}>{pet.money ?? 0}</Text>
      </View>

      {/* Status Bars - No Percentages */}
      <EnhancedStatusBar pet={pet} compact={compact} showPercentage={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardCompact: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
  },
  petInfoSection: {
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  petAge: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  moneyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'center',
    minWidth: 100,
  },
  coinIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  moneyValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
