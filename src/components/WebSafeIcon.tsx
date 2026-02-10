import React from 'react';
import { Text, Platform, StyleSheet, TextStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FEATHER_TO_EMOJI, EMOJI_FONT_FAMILY } from '../services/EmojiService';

type WebSafeIconProps = {
  name: keyof typeof Feather.glyphMap;
  size?: number;
  color?: string;
  style?: TextStyle;
};

/**
 * Platform-aware vector icon component.
 *
 * - On native (iOS / Android): renders a Feather icon from @expo/vector-icons.
 * - On web: renders an emoji / Unicode character fallback because @expo/vector-icons
 *   fonts frequently fail to load in web builds.
 */
export const WebSafeIcon: React.FC<WebSafeIconProps> = React.memo(
  ({ name, size = 24, color = '#333', style }) => {
    if (Platform.OS === 'web') {
      const fallback = FEATHER_TO_EMOJI[name] ?? '•';

      return (
        <Text
          style={[
            styles.webIcon,
            { fontSize: size, lineHeight: size * 1.2, color },
            style,
          ]}
          role="img"
          accessibilityLabel={name}
        >
          {fallback}
        </Text>
      );
    }

    return <Feather name={name} size={size} color={color} style={style} />;
  },
);

WebSafeIcon.displayName = 'WebSafeIcon';

const styles = StyleSheet.create({
  webIcon: {
    fontFamily: EMOJI_FONT_FAMILY,
    textAlign: 'center',
    userSelect: 'none',
  } as TextStyle,
});
