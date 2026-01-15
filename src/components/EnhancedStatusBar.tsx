import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from './StatusBar';
import { Pet } from '../types';
import { getStatLevel } from '../utils/petStats';

type EnhancedStatusBarProps = {
  pet: Pet;
  compact?: boolean;
  showPercentage?: boolean;
};

export const EnhancedStatusBar: React.FC<EnhancedStatusBarProps> = ({
  pet,
  compact = false,
  showPercentage = false,
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
        label="Fome"
        value={pet.hunger}
        color={hungerLevel.color}
        emoji="🍖"
        showPercentage={showPercentage}
      />
      <StatusBar
        label="Higiene"
        value={pet.hygiene}
        color={hygieneLevel.color}
        emoji="🛁"
        showPercentage={showPercentage}
      />
      <StatusBar
        label="Energia"
        value={pet.energy}
        color={energyLevel.color}
        emoji="⚡"
        showPercentage={showPercentage}
      />
      <StatusBar
        label="Felicidade"
        value={pet.happiness}
        color={happinessLevel.color}
        emoji={happinessEmoji}
        showPercentage={showPercentage}
      />
      <StatusBar
        label="Saúde"
        value={pet.health}
        color={healthLevel.color}
        emoji="❤️"
        showPercentage={showPercentage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  compact: {
    paddingVertical: 2,
  },
});
