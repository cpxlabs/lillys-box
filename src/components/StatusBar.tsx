import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StatusBarProps = {
  label: string;
  value: number;
  color: string;
  emoji: string;
  showPercentage?: boolean;
};

export const StatusBar: React.FC<StatusBarProps> = ({
  label,
  value,
  color,
  emoji,
  showPercentage = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.barContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              { width: `${value}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
      {showPercentage && (
        <Text style={styles.value}>{Math.round(value)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    paddingHorizontal: 2,
  },
  emoji: {
    fontSize: 14,
    marginRight: 4,
  },
  barContainer: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  barBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  value: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
    width: 35,
    textAlign: 'right',
  },
});