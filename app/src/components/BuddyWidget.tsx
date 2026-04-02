/**
 * BuddyWidget - A small floating companion that appears on the Pet Care home screen.
 *
 * Shows the buddy emoji, speech bubble, and responds to taps (petting).
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useBuddy } from '../context/BuddyContext';
import { getSpeciesEmoji, getAccessoryEmoji } from '../buddy/sprites';
import { RARITY_COLORS } from '../buddy/types';
import { useResponsive } from '../hooks/useResponsive';

type BuddyWidgetProps = {
  /** Optional callback when buddy profile is requested */
  onProfilePress?: () => void;
};

export const BuddyWidget: React.FC<BuddyWidgetProps> = React.memo(
  ({ onProfilePress }) => {
    const { buddy, speechBubble, isPetting, petBuddy } = useBuddy();
    const { fs, spacing } = useResponsive();
    const [bounceAnim] = useState(() => new Animated.Value(0));
    const [bubbleOpacity] = useState(() => new Animated.Value(0));

    // Bounce animation on petting
    useEffect(() => {
      if (isPetting) {
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -12,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 0,
            friction: 3,
            tension: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [isPetting, bounceAnim]);

    // Speech bubble fade in/out
    useEffect(() => {
      if (speechBubble) {
        Animated.timing(bubbleOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(bubbleOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }, [speechBubble, bubbleOpacity]);

    if (!buddy) return null;

    const emoji = getSpeciesEmoji(buddy.species);
    const accessory = getAccessoryEmoji(buddy.accessory);
    const rarityColor = RARITY_COLORS[buddy.rarity];

    return (
      <View style={[styles.container, { padding: spacing(6) }]}>
        {/* Speech Bubble */}
        {speechBubble && (
          <Animated.View
            style={[
              styles.speechBubble,
              {
                opacity: bubbleOpacity,
                borderColor: rarityColor,
                padding: spacing(6),
                paddingHorizontal: spacing(10),
                marginBottom: spacing(4),
              },
            ]}
          >
            <Text style={[styles.speechText, { fontSize: fs(11) }]}>
              {speechBubble}
            </Text>
            <View style={[styles.speechArrow, { borderTopColor: rarityColor }]} />
          </Animated.View>
        )}

        {/* Buddy Character */}
        <TouchableOpacity
          onPress={petBuddy}
          onLongPress={onProfilePress}
          activeOpacity={0.7}
          accessibilityLabel={`${buddy.name} the ${buddy.species}. Tap to pet.`}
          accessibilityRole="button"
        >
          <Animated.View
            style={[
              styles.buddyContainer,
              {
                borderColor: rarityColor,
                transform: [{ translateY: bounceAnim }],
              },
            ]}
          >
            {/* Accessory above */}
            {accessory ? (
              <Text style={[styles.accessory, { fontSize: fs(14) }]}>
                {accessory}
              </Text>
            ) : null}

            {/* Main emoji */}
            <Text style={[styles.emoji, { fontSize: fs(32) }]}>{emoji}</Text>

            {/* Hearts when petting */}
            {isPetting && (
              <View style={styles.heartsContainer}>
                <Text style={[styles.hearts, { fontSize: fs(12) }]}>
                  ❤️❤️❤️
                </Text>
              </View>
            )}

            {/* Sparkle indicator */}
            {buddy.sparkle && (
              <Text style={[styles.sparkle, { fontSize: fs(10) }]}>✨</Text>
            )}
          </Animated.View>
        </TouchableOpacity>

        {/* Name label */}
        <Text
          style={[
            styles.nameLabel,
            { fontSize: fs(10), color: rarityColor, marginTop: spacing(2) },
          ]}
        >
          {buddy.name}
        </Text>
      </View>
    );
  },
);

BuddyWidget.displayName = 'BuddyWidget';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 10,
  },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    maxWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  speechText: {
    color: '#333',
    textAlign: 'center',
  },
  speechArrow: {
    position: 'absolute',
    bottom: -8,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  buddyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 2,
    width: 60,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  accessory: {
    position: 'absolute',
    top: -10,
  },
  emoji: {
    textAlign: 'center',
  },
  heartsContainer: {
    position: 'absolute',
    top: -20,
  },
  hearts: {
    textAlign: 'center',
  },
  sparkle: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  nameLabel: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
