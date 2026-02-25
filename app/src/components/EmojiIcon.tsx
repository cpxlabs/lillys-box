import React from 'react';
import { Text, Platform, StyleSheet, TextStyle } from 'react-native';
import { EMOJI_FONT_FAMILY, getEmojiFallback } from '../services/EmojiService';

type EmojiIconProps = {
  emoji: string;
  size?: number;
  style?: TextStyle;
  /** Accessible label describing the emoji. Falls back to text fallback. */
  label?: string;
};

/**
 * Platform-aware emoji renderer.
 *
 * - On native (iOS / Android): renders the emoji character in a <Text> as-is.
 * - On web: applies a dedicated emoji font-family stack so the browser picks a
 *   color-emoji font.  If the font stack fails to produce a glyph the
 *   component falls back to a short text label via EmojiService.
 */
export const EmojiIcon: React.FC<EmojiIconProps> = React.memo(
  ({ emoji, size = 24, style, label }) => {
    if (Platform.OS === 'web') {
      const fallbackText = getEmojiFallback(emoji);

      return (
        <Text
          style={[
            styles.webEmoji,
            { fontSize: size, lineHeight: size * 1.3 },
            style,
          ]}
          role="img"
          accessibilityLabel={label ?? fallbackText}
        >
          {emoji}
        </Text>
      );
    }

    // Native platforms – emoji rendering is handled by the OS
    return (
      <Text
        style={[{ fontSize: size }, style]}
        accessibilityLabel={label ?? emoji}
      >
        {emoji}
      </Text>
    );
  },
);

EmojiIcon.displayName = 'EmojiIcon';

const styles = StyleSheet.create({
  webEmoji: {
    fontFamily: EMOJI_FONT_FAMILY,
    textAlign: 'center',
    // Prevent web browsers from applying text decoration or selection styles
    userSelect: 'none',
  } as TextStyle,
});
