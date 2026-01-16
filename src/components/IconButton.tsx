import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { hapticFeedback } from '../utils/haptics';
import { useResponsive } from '../hooks/useResponsive';
import { ICON_BUTTON_SIZE } from '../config/responsive';

type IconButtonProps = {
  emoji: string;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export const IconButton: React.FC<IconButtonProps> = React.memo(({
  emoji,
  label,
  onPress,
  style,
  disabled = false,
}) => {
  const { deviceType, spacing } = useResponsive();
  const sizes = ICON_BUTTON_SIZE[deviceType];

  const handlePress = () => {
    hapticFeedback.light();
    onPress();
  };

  const dynamicStyles = {
    button: {
      minWidth: sizes.width,
      padding: sizes.padding,
      borderRadius: spacing(12),
    },
    emoji: {
      fontSize: sizes.emoji,
    },
    label: {
      fontSize: sizes.label,
    },
  };

  return (
    <TouchableOpacity
      style={[styles.button, dynamicStyles.button, style, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.emoji, dynamicStyles.emoji]}>{emoji}</Text>
      <Text style={[styles.label, dynamicStyles.label]}>{label}</Text>
    </TouchableOpacity>
  );
});

IconButton.displayName = 'IconButton';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    opacity: 0.5,
  },
  emoji: {
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
