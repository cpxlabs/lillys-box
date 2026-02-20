/**
 * Alt 11: Toy Box
 * Primary-colored building-block cards. Bold, chunky, toddler-friendly.
 * Big rounded corners, thick borders, bright saturated colors.
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

const BLOCK_COLORS = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77', '#4D96FF', '#FF922B', '#C084FC', '#F472B6'];

export const Alt11ToyBox: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderCard = ({ item, index }: { item: GameDefinition; index: number }) => {
    const color = BLOCK_COLORS[index % BLOCK_COLORS.length];
    return (
      <TouchableOpacity
        style={[styles.block, { backgroundColor: color }]}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.emojiCircle}>
          <EmojiIcon emoji={item.emoji} size={38} />
        </View>
        <Text style={styles.blockName} numberOfLines={1}>
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
          style={[styles.filterBtn, !selectedCategory && styles.filterBtnActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.filterText, !selectedCategory && styles.filterTextActive]}>
            {t('selectGame.allGames')}
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.filterBtn, active && styles.filterBtnActive]}
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
  container: { flex: 1, backgroundColor: '#FFF9DB' },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#5B21B6',
    textAlign: 'center',
    paddingTop: 32,
    paddingBottom: 12,
  },
  filterRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    borderWidth: 3,
    borderColor: '#FDE68A',
  },
  filterBtnActive: {
    backgroundColor: '#5B21B6',
    borderColor: '#5B21B6',
  },
  filterText: { fontSize: 15, fontWeight: '800', color: '#92400E' },
  filterTextActive: { color: '#fff' },
  grid: { paddingHorizontal: 12, paddingBottom: 8 },
  gridRow: { justifyContent: 'space-between' },
  block: {
    width: '47%',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  emojiCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  blockName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
