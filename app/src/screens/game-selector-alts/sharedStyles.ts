import { StyleSheet } from 'react-native';

/**
 * Shared style constants used across multiple game selector alt screens.
 * Using StyleSheet.create avoids creating new objects on every render.
 */
export const sharedStyles = StyleSheet.create({
  noGrow: {
    flexGrow: 0,
  },
});
