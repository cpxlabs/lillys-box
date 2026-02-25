/**
 * Alt 9: Flat Material
 * Material Design 3 inspired — flat surfaces, tonal colors, rounded shapes.
 * Clean with generous whitespace and system font emphasis.
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

const TONAL: Record<string, { surface: string; on: string }> = {
  pet: { surface: '#d7f0d4', on: '#1b5e20' },
  puzzle: { surface: '#d0e8ff', on: '#0d47a1' },
  adventure: { surface: '#ffe0b2', on: '#bf360c' },
  casual: { surface: '#f8bbd0', on: '#880e4f' },
};

export const Alt9FlatMaterial: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  isFavorite,
  toggleFavorite,
  handleGameSelect,
  t,
}) => {
  const renderCard = ({ item }: { item: GameDefinition }) => {
    const fav = isFavorite(item.id);
    const tonal = TONAL[item.category] || TONAL.casual;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.emojiCircle, { backgroundColor: tonal.surface }]}>
          <EmojiIcon emoji={item.emoji} size={30} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>
            {t(item.nameKey)}
          </Text>
          <Text style={styles.cardDesc} numberOfLines={1}>
            {t(item.descriptionKey)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavorite(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.fav, fav && { color: '#f0c040' }]}>
            {fav ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>{t('selectGame.title')}</Text>
        <Text style={styles.subtitle}>{t('selectGame.subtitle')}</Text>
      </View>

      {/* Segmented category buttons */}
      <View style={styles.segmentContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.segmentRow}
        style={{ flexGrow: 0 }}
        >
          <TouchableOpacity
            style={[styles.segment, !selectedCategory && styles.segmentActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.segmentText,
                !selectedCategory && styles.segmentTextActive,
              ]}
            >
              {t('selectGame.allGames')}
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            const tonal = TONAL[cat] || TONAL.casual;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.segment,
                  active && { backgroundColor: tonal.on },
                ]}
                onPress={() => setSelectedCategory(active ? null : cat)}
              >
                <Text
                  style={[styles.segmentText, active && styles.segmentTextActive]}
                >
                  {t(`selectGame.categories.${cat}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sort chips */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>{t('selectGame.sortBy')}</Text>
        {(['default', 'name', 'category', 'favorites'] as const).map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.sortChip, sortBy === opt && styles.sortChipActive]}
            onPress={() => setSortBy(opt)}
          >
            <Text
              style={[
                styles.sortChipText,
                sortBy === opt && styles.sortChipTextActive,
              ]}
            >
              {t(`selectGame.sort.${opt}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={sortedGames}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.footer}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffbfe' },
  topBar: { paddingHorizontal: 24, paddingTop: 36, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#1c1b1f' },
  subtitle: { fontSize: 14, color: '#79747e', marginTop: 4 },
  segmentContainer: { paddingBottom: 8 },
  segmentRow: { paddingHorizontal: 20, gap: 8 },
  segment: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#e7e0ec',
  },
  segmentActive: { backgroundColor: '#6750a4' },
  segmentText: { fontSize: 14, fontWeight: '500', color: '#49454f' },
  segmentTextActive: { color: '#fff' },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
    gap: 6,
  },
  sortLabel: { fontSize: 12, color: '#79747e', marginRight: 4 },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#f3edf7',
  },
  sortChipActive: { backgroundColor: '#e8def8' },
  sortChipText: { fontSize: 11, fontWeight: '500', color: '#79747e' },
  sortChipTextActive: { color: '#6750a4', fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 8 },
  separator: { height: 2 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  emojiCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '600', color: '#1c1b1f' },
  cardDesc: { fontSize: 12, color: '#79747e', marginTop: 3 },
  favBtn: { paddingHorizontal: 10 },
  fav: { fontSize: 22, color: '#d0d0d0' },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
