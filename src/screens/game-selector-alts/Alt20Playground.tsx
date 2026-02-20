/**
 * Alt 20: Playground
 * Bright primary colors, chunky rounded shapes, bold sans-serif.
 * Feels like a playground sign — red, blue, yellow, green.
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

const PRIMARY = [
  { bg: '#EF4444', light: '#FEE2E2' },
  { bg: '#3B82F6', light: '#DBEAFE' },
  { bg: '#EAB308', light: '#FEF9C3' },
  { bg: '#22C55E', light: '#DCFCE7' },
];

const CAT_PRIMARY: Record<string, number> = {
  pet: 3,
  puzzle: 1,
  adventure: 2,
  casual: 0,
};

export const Alt20Playground: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderCard = ({ item, index }: { item: GameDefinition; index: number }) => {
    const colorIdx = CAT_PRIMARY[item.category] ?? (index % PRIMARY.length);
    const color = PRIMARY[colorIdx];
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: color.light, borderColor: color.bg }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.75}
      >
        <View style={[styles.topStripe, { backgroundColor: color.bg }]}>
          <EmojiIcon emoji={item.emoji} size={32} />
          <Text style={styles.stripeName} numberOfLines={1}>
            {t(item.nameKey)}
          </Text>
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {t(item.descriptionKey)}
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
          style={[styles.filterBtn, !selectedCategory && styles.filterBtnActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.filterText, !selectedCategory && styles.filterTextActive]}>
            {t('selectGame.allGames')}
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          const color = PRIMARY[CAT_PRIMARY[cat] ?? 0];
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterBtn,
                active && { backgroundColor: color.bg, borderColor: color.bg },
              ]}
              onPress={() => setSelectedCategory(active ? null : cat)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    paddingTop: 32,
    paddingBottom: 12,
  },
  filterRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  filterBtnActive: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
  filterText: { fontSize: 14, fontWeight: '800', color: '#475569' },
  filterTextActive: { color: '#fff' },
  grid: { paddingHorizontal: 12, paddingBottom: 8 },
  gridRow: { justifyContent: 'space-between' },
  card: {
    width: '47%',
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 3,
  },
  topStripe: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  stripeName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
  },
  cardDesc: {
    fontSize: 11,
    color: '#666',
    padding: 10,
    lineHeight: 15,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
