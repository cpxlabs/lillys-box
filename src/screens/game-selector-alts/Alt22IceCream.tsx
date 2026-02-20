/**
 * Alt 22: Ice Cream
 * Pastel "scoop" shapes — each game is a flavor.
 * Rounded dome-top cards, waffle-cone warm bg.
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

const FLAVORS = [
  '#FFB6C1', '#FFDAB9', '#B0E0E6', '#DDA0DD',
  '#98FB98', '#FFE4B5', '#ADD8E6', '#F0E68C',
  '#E6E6FA', '#FFC0CB', '#AFEEEE', '#FAFAD2',
];

export const Alt22IceCream: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderScoop = ({ item, index }: { item: GameDefinition; index: number }) => {
    const flavor = FLAVORS[index % FLAVORS.length];
    return (
      <TouchableOpacity
        style={styles.scoopWrapper}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.scoop, { backgroundColor: flavor }]}>
          <EmojiIcon emoji={item.emoji} size={36} />
        </View>
        <View style={styles.cone}>
          <Text style={styles.scoopName} numberOfLines={1}>
            {t(item.nameKey)}
          </Text>
        </View>
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
        renderItem={renderScoop}
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
  container: { flex: 1, backgroundColor: '#FFF5EB' },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#BE185D',
    textAlign: 'center',
    paddingTop: 32,
    paddingBottom: 12,
  },
  filterRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FECDD3',
  },
  chipActive: { backgroundColor: '#BE185D' },
  chipText: { fontSize: 13, fontWeight: '700', color: '#BE185D' },
  chipTextActive: { color: '#fff' },
  grid: { paddingHorizontal: 12, paddingBottom: 8 },
  gridRow: { justifyContent: 'space-around' },
  scoopWrapper: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 18,
  },
  scoop: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cone: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 28,
    borderRightWidth: 28,
    borderTopWidth: 36,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#F5D6A0',
    marginTop: -6,
  },
  scoopName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78350F',
    textAlign: 'center',
    position: 'absolute',
    top: 40,
    width: 90,
    left: -45,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
