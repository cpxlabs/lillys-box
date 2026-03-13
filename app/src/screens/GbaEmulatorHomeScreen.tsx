import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { EmojiIcon } from '../components/EmojiIcon';
import { useGbaEmulator } from '../context/GbaEmulatorContext';
import { useGameBack } from '../hooks/useGameBack';
import { ScreenNavigationProp } from '../types/navigation';

type Props = { navigation: ScreenNavigationProp<'GbaEmulatorHome'> };

export const GbaEmulatorHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { recentRoms, hasImportedRoms, isImportAvailable, importRom, selectRom, getRomBlob } = useGbaEmulator();
  const handleBack = useGameBack(navigation);

  const handlePlayRom = (id: string) => {
    selectRom(id);
    navigation.navigate('GbaEmulatorGame');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <EmojiIcon emoji="🕹️" size={72} style={styles.emoji} />
        <Text style={styles.title}>{t('selectGame.gbaEmulator.name')}</Text>
        <Text style={styles.subtitle}>{t('gbaEmulator.home.subtitle')}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('gbaEmulator.home.recentGamesTitle')}</Text>
          <Text style={styles.cardHeadline}>
            {hasImportedRoms ? t('gbaEmulator.home.libraryReadyTitle') : t('gbaEmulator.home.emptyStateTitle')}
          </Text>
          <Text style={styles.cardBody}>
            {hasImportedRoms
              ? t('gbaEmulator.home.libraryReadyDescription', { count: recentRoms.length })
              : t('gbaEmulator.home.emptyStateDescription')}
          </Text>

          {hasImportedRoms && (
            <View style={styles.romList}>
              {recentRoms.map((rom) => {
                const hasData = getRomBlob(rom.id) !== null;
                return (
                  <View key={rom.id} style={styles.romItem} testID={`rom-item-${rom.id}`}>
                    <Text style={styles.romTitle} numberOfLines={1}>{rom.title}</Text>
                    <TouchableOpacity
                      style={[styles.playButton, !hasData && styles.playButtonDisabled]}
                      onPress={() => handlePlayRom(rom.id)}
                      disabled={!hasData}
                      testID={`gba-play-${rom.id}`}
                    >
                      <Text style={styles.playButtonText}>
                        {hasData ? t('gbaEmulator.home.playButton') : t('gbaEmulator.home.reImportToPlay')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.secondaryButton, !isImportAvailable && styles.disabledButton]}
          disabled={!isImportAvailable}
          onPress={importRom}
          activeOpacity={0.85}
          testID="gba-emulator-import-button"
        >
          <Text style={styles.secondaryButtonText}>
            {t(isImportAvailable ? 'gbaEmulator.home.importButton' : 'gbaEmulator.home.importButtonComingSoon')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('GbaEmulatorGame')}
          activeOpacity={0.85}
          testID="gba-emulator-player-preview-button"
        >
          <Text style={styles.primaryButtonText}>{t('gbaEmulator.home.playerPreview')}</Text>
        </TouchableOpacity>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{t('gbaEmulator.home.controlsTitle')}</Text>
            <Text style={styles.infoText}>{t('gbaEmulator.home.controlsDescription')}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{t('gbaEmulator.home.legalTitle')}</Text>
            <Text style={styles.infoText}>{t('gbaEmulator.home.legalDescription')}</Text>
          </View>
        </View>

        <Text style={styles.footnote}>{t('gbaEmulator.home.featureFlagNote')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f1ff' },
  backButton: { paddingHorizontal: 20, paddingTop: 16 },
  backText: { fontSize: 16, color: '#5b4db1', fontWeight: '600' },
  content: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24 },
  emoji: { fontSize: 72, marginTop: 8, marginBottom: 12 },
  title: { fontSize: 34, fontWeight: '800', color: '#3d2f8f', marginBottom: 8 },
  subtitle: { fontSize: 17, color: '#5f5f74', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 13, color: '#7a74a8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  cardHeadline: { fontSize: 22, color: '#2f295f', fontWeight: '800', marginTop: 10, marginBottom: 8 },
  cardBody: { fontSize: 15, color: '#5f5f74', lineHeight: 22 },
  romList: { marginTop: 16, gap: 10 },
  romItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f4f1ff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 12,
  },
  romTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#2f295f' },
  playButton: {
    backgroundColor: '#5b4db1',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  playButtonDisabled: { backgroundColor: '#c0bce0' },
  playButtonText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  primaryButton: {
    width: '100%',
    backgroundColor: '#5b4db1',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#d8d2ff',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: { opacity: 0.55 },
  secondaryButtonText: { fontSize: 17, fontWeight: '700', color: '#514693' },
  infoRow: { width: '100%', gap: 12, marginTop: 8 },
  infoCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  infoTitle: { fontSize: 15, fontWeight: '700', color: '#3d2f8f', marginBottom: 6 },
  infoText: { fontSize: 14, color: '#5f5f74', lineHeight: 20 },
  footnote: { fontSize: 13, color: '#7a74a8', textAlign: 'center', marginTop: 16, lineHeight: 18 },
});
