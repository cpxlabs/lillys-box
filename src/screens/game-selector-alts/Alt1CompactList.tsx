/**
 * Alt 1: Compact List
 * Single-column list with horizontal rows — icon left, info right.
 * Dense, scannable, no-nonsense layout.
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

const CAT_COLORS: Record<string, string> = {
  pet: '#4caf50',
  puzzle: '#2196f3',
  adventure: '#ff9800',
  casual: '#e91e63',
};

export const Alt1CompactList: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  isFavorite,
  toggleFavorite,
  handleGameSelect,
  t,
}) => {
  const renderRow = ({ item }: { item: GameDefinition }) => {
    const fav = isFavorite(item.id);
    const catColor = CAT_COLORS[item.category] || '#999';

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.catStripe, { backgroundColor: catColor }]} />
        <View style={styles.emojiBox}>
          <EmojiIcon emoji={item.emoji} size={28} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {t(item.nameKey)}
          </Text>
          <Text style={styles.desc} numberOfLines={1}>
            {t(item.descriptionKey)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavorite(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.favIcon, fav && styles.favActive]}>
            {fav ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('selectGame.title')}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={{ flexGrow: 0 }}
        >
        <TouchableOpacity
          style={[styles.chip, !selectedCategory && styles.chipActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>
            {t('selectGame.allGames')}
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selectedCategory === cat && styles.chipActive]}
            onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >
            <Text
              style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}
            >
              {t(`selectGame.categories.${cat}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={sortedGames}
        renderItem={renderRow}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 12,
  },
  filterRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  chipActive: { backgroundColor: '#333' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  chipTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    height: 60,
  },
  catStripe: { width: 4, height: '100%' },
  emojiBox: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, paddingRight: 8 },
  name: { fontSize: 15, fontWeight: '600', color: '#222' },
  desc: { fontSize: 12, color: '#888', marginTop: 2 },
  favBtn: { paddingHorizontal: 14 },
  favIcon: { fontSize: 20, color: '#ccc' },
  favActive: { color: '#f0c040' },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
