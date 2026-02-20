/**
 * Alt 18: Lunchbox Grid
 * Square compartments like a bento box / lunchbox.
 * Tight grid with divider lines, each compartment a game.
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

const COMPARTMENT_BG = ['#FFF7ED', '#FDF2F8', '#EFF6FF', '#F0FDF4', '#FEF3C7', '#FAF5FF'];

export const Alt18LunchboxGrid: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderCompartment = ({ item, index }: { item: GameDefinition; index: number }) => {
    const bg = COMPARTMENT_BG[index % COMPARTMENT_BG.length];
    return (
      <TouchableOpacity
        style={[styles.compartment, { backgroundColor: bg }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.75}
      >
        <EmojiIcon emoji={item.emoji} size={34} />
        <Text style={styles.compName} numberOfLines={1}>
          {t(item.nameKey)}
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

      <View style={styles.lunchbox}>
        <FlatList
          data={sortedGames}
          renderItem={renderCompartment}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.footer}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEF7EE' },
  title: {
    fontSize: 24,
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
    borderRadius: 16,
    backgroundColor: '#FDE68A',
  },
  chipActive: { backgroundColor: '#92400E' },
  chipText: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  chipTextActive: { color: '#fff' },
  lunchbox: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: '#FEFCE8',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#D97706',
    overflow: 'hidden',
  },
  grid: { padding: 6 },
  gridRow: { justifyContent: 'flex-start' },
  compartment: {
    width: '31.5%',
    aspectRatio: 1,
    margin: '0.9%',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(217,119,6,0.15)',
    gap: 6,
  },
  compName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78350F',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
