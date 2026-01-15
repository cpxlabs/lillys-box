import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from './StatusBar';
import { Pet } from '../types';
import { getStatLevel } from '../utils/petStats';

type EnhancedStatusBarProps = {
  pet: Pet;
  compact?: boolean;
};

export const EnhancedStatusBar: React.FC<EnhancedStatusBarProps> = ({
  pet,
  compact = false,
}) => {
  const hungerLevel = getStatLevel(pet.hunger);
  const hygieneLevel = getStatLevel(pet.hygiene);
  const energyLevel = getStatLevel(pet.energy);
  const happinessLevel = getStatLevel(pet.happiness);
  const healthLevel = getStatLevel(pet.health);

  // Determine happiness emoji based on level
  const happinessEmoji = pet.happiness > 70 ? '😊' : pet.happiness > 40 ? '😐' : '😢';

  return (
    <View style={[styles.container, compact && styles.compact]}>
      <StatusBar
        label="Hunger"
        value={pet.hunger}
        color={hungerLevel.color}
        emoji="🍖"
      />
      <StatusBar
        label="Hygiene"
        value={pet.hygiene}
        color={hygieneLevel.color}
        emoji="🛁"
      />
      <StatusBar
        label="Energy"
        value={pet.energy}
        color={energyLevel.color}
        emoji="⚡"
      />
      <StatusBar
        label="Happiness"
        value={pet.happiness}
        color={happinessLevel.color}
        emoji={happinessEmoji}
      />
      <StatusBar
        label="Health"
        value={pet.health}
        color={healthLevel.color}
        emoji="❤️"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  compact: {
    paddingVertical: 4,
  },
});
