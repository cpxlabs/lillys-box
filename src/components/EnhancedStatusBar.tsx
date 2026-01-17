import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from './StatusBar';
import { Pet } from '../types';
import { getStatLevel } from '../utils/petStats';

type EnhancedStatusBarProps = {
  pet: Pet;
  compact?: boolean;
  showPercentage?: boolean;
  twoColumnLayout?: boolean;
};

export const EnhancedStatusBar: React.FC<EnhancedStatusBarProps> = ({
  pet,
  compact = false,
  showPercentage = false,
  twoColumnLayout = false,
}) => {
  const hungerLevel = getStatLevel(pet.hunger);
  const hygieneLevel = getStatLevel(pet.hygiene);
  const energyLevel = getStatLevel(pet.energy);
  const happinessLevel = getStatLevel(pet.happiness);
  const healthLevel = getStatLevel(pet.health);

  // Determine happiness emoji based on level
  const happinessEmoji = pet.happiness > 70 ? '😊' : pet.happiness > 40 ? '😐' : '😢';

  if (twoColumnLayout) {
    return (
      <View style={styles.twoColumnContainer}>
        <View style={styles.column}>
          <StatusBar
            value={pet.hunger}
            color={hungerLevel.color}
            emoji="🍖"
            showPercentage={showPercentage}
          />
          <StatusBar
            value={pet.hygiene}
            color={hygieneLevel.color}
            emoji="🛁"
            showPercentage={showPercentage}
          />
          <StatusBar
            value={pet.energy}
            color={energyLevel.color}
            emoji="⚡"
            showPercentage={showPercentage}
          />
        </View>
        <View style={styles.column}>
          <StatusBar
            value={pet.happiness}
            color={happinessLevel.color}
            emoji={happinessEmoji}
            showPercentage={showPercentage}
          />
          <StatusBar
            value={pet.health}
            color={healthLevel.color}
            emoji="❤️"
            showPercentage={showPercentage}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, compact && styles.compact]}>
      <StatusBar
        value={pet.hunger}
        color={hungerLevel.color}
        emoji="🍖"
        showPercentage={showPercentage}
      />
      <StatusBar
        value={pet.hygiene}
        color={hygieneLevel.color}
        emoji="🛁"
        showPercentage={showPercentage}
      />
      <StatusBar
        value={pet.energy}
        color={energyLevel.color}
        emoji="⚡"
        showPercentage={showPercentage}
      />
      <StatusBar
        value={pet.happiness}
        color={happinessLevel.color}
        emoji={happinessEmoji}
        showPercentage={showPercentage}
      />
      <StatusBar
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
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
});
