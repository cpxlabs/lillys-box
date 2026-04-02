/**
 * BuddyProfile - Full profile view for a buddy.
 *
 * Shows species, rarity, stats, personality, and pet count.
 * Accessed by long-pressing the BuddyWidget.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useBuddy } from '../context/BuddyContext';
import { getSpeciesEmoji, getAccessoryEmoji, renderFace } from '../buddy/sprites';
import { RARITY_COLORS, RARITY_STARS, STAT_NAMES } from '../buddy/types';
import { useResponsive } from '../hooks/useResponsive';

type BuddyProfileProps = {
  /** Called when the close/dismiss button is pressed */
  onClose?: () => void;
};

// Stat emojis for kid-friendly display
const STAT_EMOJI: Record<string, string> = {
  KINDNESS: '💕',
  BRAVERY: '⚡',
  CURIOSITY: '🔍',
  CREATIVITY: '🎨',
  SILLINESS: '🤪',
};

// Stat colors for visual variety
const STAT_COLORS: Record<string, string> = {
  KINDNESS: '#ec4899',
  BRAVERY: '#f59e0b',
  CURIOSITY: '#3b82f6',
  CREATIVITY: '#8b5cf6',
  SILLINESS: '#10b981',
};

export const BuddyProfile: React.FC<BuddyProfileProps> = React.memo(
  ({ onClose }) => {
    const { buddy, petCount } = useBuddy();
    const { t } = useTranslation();
    const { fs, spacing } = useResponsive();

    if (!buddy) return null;

    const emoji = getSpeciesEmoji(buddy.species);
    const accessory = getAccessoryEmoji(buddy.accessory);
    const face = renderFace(buddy);
    const rarityColor = RARITY_COLORS[buddy.rarity];
    const stars = RARITY_STARS[buddy.rarity];

    return (
      <View style={[styles.overlay]}>
        <View
          style={[
            styles.card,
            {
              borderColor: rarityColor,
              padding: spacing(16),
              borderRadius: spacing(16),
            },
          ]}
        >
          {/* Close button */}
          {onClose && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel={t('common.close')}
              accessibilityRole="button"
            >
              <Text style={[styles.closeText, { fontSize: fs(18) }]}>✕</Text>
            </TouchableOpacity>
          )}

          {/* Buddy display */}
          <View style={[styles.buddyDisplay, { marginBottom: spacing(12) }]}>
            {accessory ? (
              <Text style={{ fontSize: fs(20), textAlign: 'center' }}>
                {accessory}
              </Text>
            ) : null}
            <Text style={{ fontSize: fs(56), textAlign: 'center' }}>
              {emoji}
            </Text>
            {buddy.sparkle && (
              <Text style={{ fontSize: fs(16), textAlign: 'center' }}>✨</Text>
            )}
          </View>

          {/* Name & species */}
          <Text
            style={[
              styles.name,
              { fontSize: fs(20), color: rarityColor, marginBottom: spacing(2) },
            ]}
          >
            {buddy.name}
          </Text>
          <Text
            style={[
              styles.species,
              { fontSize: fs(14), marginBottom: spacing(4) },
            ]}
          >
            {face} • {t(`buddy.species.${buddy.species}`)}
          </Text>

          {/* Rarity */}
          <View
            style={[
              styles.rarityBadge,
              {
                backgroundColor: `${rarityColor}20`,
                borderColor: rarityColor,
                paddingVertical: spacing(3),
                paddingHorizontal: spacing(10),
                borderRadius: spacing(12),
                marginBottom: spacing(10),
              },
            ]}
          >
            <Text style={[styles.rarityText, { fontSize: fs(12), color: rarityColor }]}>
              {stars} {t(`buddy.rarity.${buddy.rarity}`)}
            </Text>
          </View>

          {/* Personality */}
          <Text
            style={[
              styles.personality,
              { fontSize: fs(13), marginBottom: spacing(12) },
            ]}
          >
            &quot;{buddy.personality}&quot;
          </Text>

          {/* Stats */}
          <View style={[styles.statsContainer, { gap: spacing(6) }]}>
            {STAT_NAMES.map((stat) => {
              const value = buddy.stats[stat];
              const statEmoji = STAT_EMOJI[stat] || '📊';
              const statColor = STAT_COLORS[stat] || '#666';
              return (
                <View key={stat} style={styles.statRow}>
                  <Text style={[styles.statLabel, { fontSize: fs(12) }]}>
                    {statEmoji} {t(`buddy.stats.${stat}`)}
                  </Text>
                  <View style={styles.statBarOuter}>
                    <View
                      style={[
                        styles.statBarInner,
                        {
                          width: `${value}%`,
                          backgroundColor: statColor,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.statValue,
                      { fontSize: fs(11), color: statColor },
                    ]}
                  >
                    {value}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Pet count */}
          <Text
            style={[
              styles.petCount,
              { fontSize: fs(12), marginTop: spacing(10) },
            ]}
          >
            🐾 {t('buddy.petCount', { count: petCount })}
          </Text>
        </View>
      </View>
    );
  },
);

BuddyProfile.displayName = 'BuddyProfile';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 2,
    width: '85%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 14,
    zIndex: 1,
  },
  closeText: {
    color: '#999',
    fontWeight: '600',
  },
  buddyDisplay: {
    alignItems: 'center',
  },
  name: {
    fontWeight: '800',
    textAlign: 'center',
  },
  species: {
    color: '#666',
    textAlign: 'center',
  },
  rarityBadge: {
    alignSelf: 'center',
    borderWidth: 1,
  },
  rarityText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  personality: {
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  statsContainer: {},
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    width: 100,
    color: '#444',
    fontWeight: '600',
  },
  statBarOuter: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  statBarInner: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    width: 28,
    textAlign: 'right',
    fontWeight: '700',
  },
  petCount: {
    color: '#888',
    textAlign: 'center',
  },
});
