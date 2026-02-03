import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { gameRegistry, GameDefinition } from '../registry/GameRegistry';
import { LanguageSelector } from '../components/LanguageSelector';
import { ScreenNavigationProp } from '../types/navigation';

type Props = {
  navigation: ScreenNavigationProp<'GameSelection'>;
};

export const GameSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const games = gameRegistry.getAllGames();

  const handleGameSelect = (gameId: string) => {
    navigation.navigate('GameContainer', { gameId });
  };

  const renderGameCard = ({ item }: { item: GameDefinition }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => handleGameSelect(item.id)}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${t(item.nameKey)}: ${t(item.descriptionKey)}`}
    >
      <Text style={styles.gameEmoji}>{item.emoji}</Text>
      <Text style={styles.gameName}>{t(item.nameKey)}</Text>
      <Text style={styles.gameDescription}>{t(item.descriptionKey)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('selectGame.title')}</Text>
        <Text style={styles.subtitle}>{t('selectGame.subtitle')}</Text>
      </View>

      <FlatList
        data={games}
        renderItem={renderGameCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
      />

      <View style={styles.footer}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#9b59b6',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 20,
    flex: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  gameEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  gameDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
