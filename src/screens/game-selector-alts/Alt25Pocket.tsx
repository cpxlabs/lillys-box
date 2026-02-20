/**
 * Alt 25: Pocket
 * Games as large rounded pill/pocket shapes, single column.
 * Maximum touch area, extremely simple, toddler-proof.
 * Each pocket has a colored left side and white right info area.
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

const POCKET_COLORS = [
  '#F87171', '#FB923C', '#FBBF24', '#34D399',
  '#60A5FA', '#A78BFA', '#F472B6', '#2DD4BF',
];

export const Alt25Pocket: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderPocket = ({ item, index }: { item: GameDefinition; index: number }) => {
    const color = POCKET_COLORS[index % POCKET_COLORS.length];
    return (
      <TouchableOpacity
        style={styles.pocket}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.75}
      >
        <View style={[styles.pocketLeft, { backgroundColor: color }]}>
          <EmojiIcon emoji={item.emoji} size={40} />
        </View>
        <View style={styles.pocketRight}>
          <Text style={styles.pocketName} numberOfLines={1}>
            {t(item.nameKey)}
          </Text>
          <Text style={styles.pocketDesc} numberOfLines={1}>
            {t(item.descriptionKey)}
          </Text>
        </View>
        <View style={[styles.playDot, { backgroundColor: color }]}>
          <Text style={styles.playArrow}>▶</Text>
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
        renderItem={renderPocket}
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#334155',
    textAlign: 'center',
    paddingTop: 32,
    paddingBottom: 12,
  },
  filterRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  chipActive: { backgroundColor: '#6366F1' },
  chipText: { fontSize: 14, fontWeight: '700', color: '#6366F1' },
  chipTextActive: { color: '#fff' },
  list: { paddingHorizontal: 14, paddingBottom: 8 },
  pocket: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 28,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  pocketLeft: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  pocketRight: {
    flex: 1,
    paddingHorizontal: 14,
  },
  pocketName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  pocketDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
  playDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  playArrow: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 2,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
