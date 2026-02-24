/**
 * Alt 10: Sidebar Categories
 * Left vertical sidebar for category navigation, right side shows games.
 * Tablet-friendly, content-focused layout.
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { EmojiIcon } from '../../components/EmojiIcon';
import { LanguageSelector } from '../../components/LanguageSelector';
import { GameDefinition } from '../../registry/GameRegistry';
import { GameSelectorAltProps } from './types';

const SIDEBAR_ICONS: Record<string, string> = {
  pet: '🐾',
  puzzle: '🧩',
  adventure: '🗺️',
  casual: '🎲',
};

const SIDEBAR_COLORS: Record<string, string> = {
  pet: '#4caf50',
  puzzle: '#2196f3',
  adventure: '#ff9800',
  casual: '#e91e63',
};

export const Alt10SidebarCategories: React.FC<GameSelectorAltProps> = ({
  sortedGames,
  categories,
  selectedCategory,
  setSelectedCategory,
  isFavorite,
  toggleFavorite,
  handleGameSelect,
  t,
}) => {
  const renderCard = ({ item }: { item: GameDefinition }) => {
    const fav = isFavorite(item.id);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleGameSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardRow}>
          <View style={styles.cardEmoji}>
            <EmojiIcon emoji={item.emoji} size={28} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardName} numberOfLines={1}>
              {t(item.nameKey)}
            </Text>
            <Text style={styles.cardDesc} numberOfLines={2}>
              {t(item.descriptionKey)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.fav, fav && styles.favActive]}>
              {fav ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <TouchableOpacity
            style={[
              styles.sidebarItem,
              !selectedCategory && styles.sidebarItemActive,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.sidebarIcon}>🎮</Text>
            <Text
              style={[
                styles.sidebarLabel,
                !selectedCategory && styles.sidebarLabelActive,
              ]}
              numberOfLines={1}
            >
              {t('selectGame.allGames')}
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            const color = SIDEBAR_COLORS[cat] || '#999';
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.sidebarItem, active && styles.sidebarItemActive]}
                onPress={() => setSelectedCategory(active ? null : cat)}
              >
                {active && (
                  <View
                    style={[styles.activeIndicator, { backgroundColor: color }]}
                  />
                )}
                <Text style={styles.sidebarIcon}>
                  {SIDEBAR_ICONS[cat] || '🎮'}
                </Text>
                <Text
                  style={[
                    styles.sidebarLabel,
                    active && styles.sidebarLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {t(`selectGame.categories.${cat}`)}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.sidebarFooter}>
            <Text style={styles.sidebarCount}>{sortedGames.length}</Text>
            <Text style={styles.sidebarCountLabel}>games</Text>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.main}>
          <View style={styles.mainHeader}>
            <Text style={styles.title}>{t('selectGame.title')}</Text>
            <Text style={styles.subtitle}>
              {selectedCategory
                ? t(`selectGame.categories.${selectedCategory}`)
                : t('selectGame.allGames')}
            </Text>
          </View>
          <FlatList
            data={sortedGames}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  body: { flex: 1, flexDirection: 'row' },
  sidebar: {
    width: 80,
    backgroundColor: '#fff',
    paddingTop: 36,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  sidebarItem: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  sidebarItemActive: { backgroundColor: '#f0f0f0' },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 2,
  },
  sidebarIcon: { fontSize: 22, marginBottom: 4 },
  sidebarLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#999',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  sidebarLabelActive: { color: '#333', fontWeight: '700' },
  sidebarFooter: { marginTop: 'auto', paddingBottom: 20, alignItems: 'center' },
  sidebarCount: { fontSize: 20, fontWeight: '800', color: '#333' },
  sidebarCountLabel: { fontSize: 10, color: '#999' },
  main: { flex: 1 },
  mainHeader: { paddingHorizontal: 16, paddingTop: 36, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#222' },
  subtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  list: { paddingHorizontal: 12, paddingBottom: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    padding: 12,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardEmoji: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '600', color: '#222' },
  cardDesc: { fontSize: 11, color: '#999', marginTop: 3, lineHeight: 15 },
  fav: { fontSize: 20, color: '#ddd', paddingHorizontal: 8 },
  favActive: { color: '#f0c040' },
  footer: { paddingVertical: 10, alignItems: 'center' },
});
