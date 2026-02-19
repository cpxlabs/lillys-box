/**
 * Alt 4: Carousel
 * Games grouped by category in horizontal scrollable rows.
 * Each category is its own section with a heading.
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { EmojiIcon } from '../../components/EmojiIcon';
import { LanguageSelector } from '../../components/LanguageSelector';
import { GameDefinition } from '../../registry/GameRegistry';
import { GameSelectorAltProps } from './types';

const CAT_BG: Record<string, string> = {
  pet: '#e8f5e9',
  puzzle: '#e3f2fd',
  adventure: '#fff3e0',
  casual: '#fce4ec',
};

const CAT_EMOJI: Record<string, string> = {
  pet: '🐾',
  puzzle: '🧩',
  adventure: '🗺️',
  casual: '🎲',
};

export const Alt4Carousel: React.FC<GameSelectorAltProps> = ({
  games,
  categories,
  isFavorite,
  toggleFavorite,
  handleGameSelect,
  t,
}) => {
  const gamesByCategory = categories.map((cat) => ({
    category: cat,
    data: games.filter((g) => g.category === cat),
  }));

  const renderGameCard = (item: GameDefinition) => {
    const fav = isFavorite(item.id);
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, { backgroundColor: CAT_BG[item.category] || '#f5f5f5' }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavorite(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.favIcon, fav && styles.favActive]}>
            {fav ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
        <EmojiIcon emoji={item.emoji} size={36} />
        <Text style={styles.cardName} numberOfLines={1}>
          {t(item.nameKey)}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {t(item.descriptionKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('selectGame.title')}</Text>
        <Text style={styles.subtitle}>{t('selectGame.subtitle')}</Text>

        {gamesByCategory.map(({ category, data }) => (
          <View key={category} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>{CAT_EMOJI[category] || '🎮'}</Text>
              <Text style={styles.sectionTitle}>
                {t(`selectGame.categories.${category}`)}
              </Text>
              <Text style={styles.sectionCount}>{data.length}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
            >
              {data.map(renderGameCard)}
            </ScrollView>
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
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#222',
    paddingHorizontal: 20,
    paddingTop: 36,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 20,
    paddingBottom: 8,
    marginTop: 4,
  },
  section: { marginTop: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionEmoji: { fontSize: 20, marginRight: 8 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textTransform: 'capitalize',
  },
  sectionCount: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: '600',
  },
  carousel: { paddingHorizontal: 16, gap: 12 },
  card: {
    width: 140,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  favBtn: { alignSelf: 'flex-end', marginBottom: 4 },
  favIcon: { fontSize: 16, color: '#ccc' },
  favActive: { color: '#f0c040' },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },
  footer: { paddingVertical: 20, alignItems: 'center' },
});
