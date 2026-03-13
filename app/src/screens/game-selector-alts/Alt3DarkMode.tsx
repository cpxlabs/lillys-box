/**
 * Alt 3: Dark Mode
 * Dark background with vibrant gradient-tinted cards.
 * Modern, sleek gaming aesthetic.
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
} from 'react-native';
import { EmojiIcon } from '../../components/EmojiIcon';
import { LanguageSelector } from '../../components/LanguageSelector';
import { GameDefinition } from '../../registry/GameRegistry';
import { GameSelectorAltProps } from './types';
import { sharedStyles } from './sharedStyles';

const CAT_ACCENT: Record<string, string> = {
  pet: '#66bb6a',
  puzzle: '#42a5f5',
  adventure: '#ffa726',
  casual: '#ef5350',
  emulator: '#ab47bc',
  board: '#4db6ac',
};

export const Alt3DarkMode: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  isFavorite,
  toggleFavorite,
  handleGameSelect,
  t,
}) => {
  const renderCard = ({ item }: { item: GameDefinition }) => {
    const fav = isFavorite(item.id);
    const accent = CAT_ACCENT[item.category] || '#aaa';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardTop}>
          <View style={[styles.accentDot, { backgroundColor: accent }]} />
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.fav, fav && { color: '#f0c040' }]}>
              {fav ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
        <EmojiIcon emoji={item.emoji} size={40} />
        <Text style={styles.cardName} numberOfLines={1}>
          {t(item.nameKey)}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {t(item.descriptionKey)}
        </Text>
        <View style={[styles.catTag, { backgroundColor: accent + '33' }]}>
          <Text style={[styles.catTagText, { color: accent }]}>
            {t(`selectGame.categories.${item.category}`)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('selectGame.title')}</Text>
      <Text style={styles.subtitle}>{t('selectGame.subtitle')}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={sharedStyles.noGrow}
        >
        <TouchableOpacity
          style={[styles.chip, !selectedCategory && styles.chipActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>
            {t('selectGame.allGames')}
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                active && { backgroundColor: CAT_ACCENT[cat] || '#666' },
              ]}
              onPress={() => setSelectedCategory(active ? null : cat)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {t(`selectGame.categories.${cat}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={sortedGames}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.colWrap}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    paddingHorizontal: 20,
    paddingTop: 36,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 20,
    paddingBottom: 14,
    marginTop: 4,
  },
  filterRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 14 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1e1e1e',
  },
  chipActive: { backgroundColor: '#fff' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#888' },
  chipTextActive: { color: '#121212' },
  list: { paddingHorizontal: 14, paddingBottom: 8 },
  colWrap: { justifyContent: 'space-between' },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 18,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  accentDot: { width: 8, height: 8, borderRadius: 4 },
  fav: { fontSize: 18, color: '#444' },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#eee',
    marginTop: 10,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },
  catTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 10,
  },
  catTagText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
