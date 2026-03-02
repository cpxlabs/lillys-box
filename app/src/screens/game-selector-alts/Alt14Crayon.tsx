/**
 * Alt 14: Crayon
 * Thick colorful crayon-like borders on a paper/cream background.
 * Hand-drawn feel with wobbly thick outlines and warm colors.
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

const CRAYON = ['#E53E3E', '#DD6B20', '#D69E2E', '#38A169', '#3182CE', '#805AD5', '#D53F8C', '#2B6CB0'];

export const Alt14Crayon: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderCard = ({ item, index }: { item: GameDefinition; index: number }) => {
    const color = CRAYON[index % CRAYON.length];
    return (
      <TouchableOpacity
        style={[styles.card, { borderColor: color }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <EmojiIcon emoji={item.emoji} size={42} />
        <Text style={[styles.cardName, { color }]} numberOfLines={1}>
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
      <Text style={styles.title}>{t('selectGame.title')}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      style={sharedStyles.noGrow}
      >
        <TouchableOpacity
          style={[styles.tab, !selectedCategory && styles.tabActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.tabText, !selectedCategory && styles.tabTextActive]}>
            {t('selectGame.allGames')}
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setSelectedCategory(active ? null : cat)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
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
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#744210',
    textAlign: 'center',
    paddingTop: 32,
    paddingBottom: 12,
  },
  filterRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFF1E0',
    borderWidth: 3,
    borderColor: '#F6E0C0',
  },
  tabActive: { backgroundColor: '#DD6B20', borderColor: '#DD6B20' },
  tabText: { fontSize: 14, fontWeight: '800', color: '#C05621' },
  tabTextActive: { color: '#fff' },
  grid: { paddingHorizontal: 12, paddingBottom: 8 },
  gridRow: { justifyContent: 'space-between' },
  card: {
    width: '47%',
    backgroundColor: '#FFFDF8',
    borderRadius: 16,
    borderWidth: 4,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  cardName: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 8,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 11,
    color: '#A08060',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
