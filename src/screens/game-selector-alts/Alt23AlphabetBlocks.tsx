/**
 * Alt 23: Alphabet Blocks
 * Square toy blocks — primary colors, bold letter from game name,
 * big emoji. Each card looks like a wooden alphabet block.
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

const BLOCK_FACES = [
  { bg: '#FCA5A5', border: '#DC2626' },
  { bg: '#93C5FD', border: '#2563EB' },
  { bg: '#FDE047', border: '#CA8A04' },
  { bg: '#86EFAC', border: '#16A34A' },
  { bg: '#C4B5FD', border: '#7C3AED' },
  { bg: '#FBCFE8', border: '#DB2777' },
];

export const Alt23AlphabetBlocks: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderBlock = ({ item, index }: { item: GameDefinition; index: number }) => {
    const face = BLOCK_FACES[index % BLOCK_FACES.length];
    const name = t(item.nameKey);
    const letter = name.charAt(0).toUpperCase();

    return (
      <TouchableOpacity
        style={[styles.block, { backgroundColor: face.bg, borderColor: face.border }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.75}
      >
        <Text style={[styles.letter, { color: face.border }]}>{letter}</Text>
        <EmojiIcon emoji={item.emoji} size={32} />
        <Text style={styles.blockName} numberOfLines={1}>
          {name}
        </Text>
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
              style={[styles.chip, active && styles.chipActive]}
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
        renderItem={renderBlock}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBEB' },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#92400E',
    textAlign: 'center',
    paddingTop: 32,
    paddingBottom: 12,
  },
  filterRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  chipActive: { backgroundColor: '#D97706', borderColor: '#D97706' },
  chipText: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  chipTextActive: { color: '#fff' },
  grid: { paddingHorizontal: 10, paddingBottom: 8 },
  gridRow: { justifyContent: 'flex-start', gap: 8 },
  block: {
    width: '31%',
    aspectRatio: 0.9,
    borderRadius: 12,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 2,
  },
  letter: {
    fontSize: 28,
    fontWeight: '900',
    opacity: 0.3,
  },
  blockName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5A3510',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
