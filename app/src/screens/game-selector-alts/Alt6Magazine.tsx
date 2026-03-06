/**
 * Alt 6: Magazine / Editorial Layout
 * Alternating large hero card + two smaller cards per row.
 * Bold typography, editorial feel.
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { EmojiIcon } from '../../components/EmojiIcon';
import { LanguageSelector } from '../../components/LanguageSelector';
import { GameDefinition } from '../../registry/GameRegistry';
import { GameSelectorAltProps } from './types';

const ACCENT: Record<string, string> = {
  pet: '#2e7d32',
  puzzle: '#1565c0',
  adventure: '#e65100',
  casual: '#c62828',
};

export const Alt6Magazine: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  isFavorite,
  toggleFavorite,
  handleGameSelect,
  t,
}) => {
  // Group into sets: [hero, small, small, hero, small, small, ...]
  const rows: { hero: GameDefinition; smalls: GameDefinition[] }[] = [];
  let i = 0;
  while (i < sortedGames.length) {
    const hero = sortedGames[i];
    const smalls = sortedGames.slice(i + 1, i + 3);
    rows.push({ hero, smalls });
    i += 3;
  }

  const renderHero = (item: GameDefinition) => {
    const fav = isFavorite(item.id);
    const accent = ACCENT[item.category] || '#555';
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.heroCard}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.85}
      >
        <View style={styles.heroTop}>
          <EmojiIcon emoji={item.emoji} size={52} />
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.fav, fav && styles.favActive]}>
              {fav ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.heroName}>{t(item.nameKey)}</Text>
        <Text style={styles.heroDesc} numberOfLines={3}>
          {t(item.descriptionKey)}
        </Text>
        <Text style={[styles.heroCat, { color: accent }]}>
          {t(`selectGame.categories.${item.category}`)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSmall = (item: GameDefinition) => {
    const fav = isFavorite(item.id);
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.smallCard}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.85}
      >
        <View style={styles.smallTop}>
          <EmojiIcon emoji={item.emoji} size={32} />
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.fav, fav && styles.favActive]}>
              {fav ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.smallName} numberOfLines={1}>
          {t(item.nameKey)}
        </Text>
        <Text style={styles.smallDesc} numberOfLines={2}>
          {t(item.descriptionKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.title}>{t('selectGame.title')}</Text>
        <Text style={styles.subtitle}>{t('selectGame.subtitle')}</Text>

        {rows.map((row) => (
          <View key={row.hero.id}>
            {renderHero(row.hero)}
            {row.smalls.length > 0 && (
              <View style={styles.smallRow}>
                {row.smalls.map(renderSmall)}
              </View>
            )}
          </View>
        ))}

        <View style={styles.footer}>
          <LanguageSelector />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111',
    paddingTop: 36,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  heroName: { fontSize: 22, fontWeight: '800', color: '#222' },
  heroDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    lineHeight: 20,
  },
  heroCat: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  smallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  smallCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  smallTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  smallName: { fontSize: 15, fontWeight: '700', color: '#333' },
  smallDesc: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    lineHeight: 15,
  },
  fav: { fontSize: 18, color: '#ddd' },
  favActive: { color: '#f0c040' },
  footer: { paddingVertical: 20, alignItems: 'center' },
});
