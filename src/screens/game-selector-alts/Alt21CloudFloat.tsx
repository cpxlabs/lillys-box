/**
 * Alt 21: Cloud Float
 * Soft blue sky background, games on cloud-shaped white cards.
 * Light, airy, dreamy — perfect for young children.
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

export const Alt21CloudFloat: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleGameSelect,
  t,
}) => {
  const renderCloud = ({ item }: { item: GameDefinition }) => {
    return (
      <TouchableOpacity
        style={styles.cloud}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <EmojiIcon emoji={item.emoji} size={38} />
        <Text style={styles.cloudName} numberOfLines={1}>
          {t(item.nameKey)}
        </Text>
        <Text style={styles.cloudDesc} numberOfLines={2}>
          {t(item.descriptionKey)}
        </Text>
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
        renderItem={renderCloud}
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
  container: { flex: 1, backgroundColor: '#E0F2FE' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E40AF',
    textAlign: 'center',
    paddingTop: 32,
  },
  subtitle: {
    fontSize: 14,
    color: '#60A5FA',
    textAlign: 'center',
    marginTop: 4,
    paddingBottom: 12,
  },
  filterRow: { paddingHorizontal: 14, gap: 8, paddingBottom: 14 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  chipActive: { backgroundColor: '#2563EB' },
  chipText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  chipTextActive: { color: '#fff' },
  grid: { paddingHorizontal: 14, paddingBottom: 8 },
  gridRow: { justifyContent: 'space-between' },
  cloud: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#93C5FD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  cloudName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E3A8A',
    marginTop: 10,
    textAlign: 'center',
  },
  cloudDesc: {
    fontSize: 11,
    color: '#93C5FD',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
