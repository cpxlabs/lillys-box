import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';
import { useGbaEmulator } from '../context/GbaEmulatorContext';
import { useGameBack } from '../hooks/useGameBack';
import { ScreenNavigationProp } from '../types/navigation';

type Props = { navigation: ScreenNavigationProp<'GbaEmulatorGame'> };

const CONTROL_GROUPS = ['← ↑ ↓ →', 'A  B', 'Start  Select'];

const buildEmulatorHtml = (romBlobUrl: string, title: string): string => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; width: 100vw; height: 100vh; overflow: hidden; }
    #game { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="game"></div>
  <script>
    window.EJS_player = '#game';
    window.EJS_core = 'gba';
    window.EJS_gameName = ${JSON.stringify(title)};
    window.EJS_gameUrl = ${JSON.stringify(romBlobUrl)};
    window.EJS_startOnLoaded = true;
    window.EJS_color = '#5b4db1';
    window.EJS_defaultControls = true;
  </script>
  <script src="https://cdn.emulatorjs.org/stable/data/loader.js"></script>
</body>
</html>`;

const useEmulatorUri = (romBlob: Blob | null, title: string): string | null => {
  const uriRef = useRef<{ htmlUrl: string; romUrl: string } | null>(null);

  // Cleanup old blob URLs when ROM changes or component unmounts
  useEffect(() => {
    return () => {
      if (uriRef.current) {
        URL.revokeObjectURL(uriRef.current.romUrl);
        URL.revokeObjectURL(uriRef.current.htmlUrl);
        uriRef.current = null;
      }
    };
  }, [romBlob]);

  if (Platform.OS !== 'web' || !romBlob) {
    return null;
  }

  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
    return null;
  }

  // Revoke previous URLs before creating new ones
  if (uriRef.current) {
    URL.revokeObjectURL(uriRef.current.romUrl);
    URL.revokeObjectURL(uriRef.current.htmlUrl);
  }

  const romUrl = URL.createObjectURL(romBlob);
  const html = buildEmulatorHtml(romUrl, title);
  const htmlBlob = new Blob([html], { type: 'text/html' });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  uriRef.current = { htmlUrl, romUrl };

  return htmlUrl;
};

export const GbaEmulatorGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { hasImportedRoms, selectedRomId, getRomBlob, recentRoms } = useGbaEmulator();
  const handleBack = useGameBack(navigation);

  const selectedRom = recentRoms.find((r) => r.id === selectedRomId) ?? null;
  const romBlob = selectedRomId ? getRomBlob(selectedRomId) : null;
  const emulatorUri = useEmulatorUri(romBlob, selectedRom?.title ?? 'GBA ROM');

  if (emulatorUri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backText}>← {t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selectedRom?.title ?? t('gbaEmulator.game.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <WebView
          source={{ uri: emulatorUri }}
          style={styles.emulatorView}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          testID="gba-emulator-webview"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backText}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('gbaEmulator.game.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.viewport}>
        <Text style={styles.viewportLabel}>{t('gbaEmulator.game.viewportLabel')}</Text>
        <Text style={styles.emptyTitle}>
          {hasImportedRoms ? t('gbaEmulator.game.readyTitle') : t('gbaEmulator.game.emptyStateTitle')}
        </Text>
        <Text style={styles.emptyText}>
          {hasImportedRoms ? t('gbaEmulator.game.readyDescription') : t('gbaEmulator.game.emptyStateDescription')}
        </Text>
      </View>

      <View style={styles.controlsPanel}>
        <Text style={styles.controlsTitle}>{t('gbaEmulator.game.controlsTitle')}</Text>
        <View style={styles.controlsRow}>
          {CONTROL_GROUPS.map((group) => (
            <View key={group} style={styles.controlChip}>
              <Text style={styles.controlText}>{group}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.helperText}>{t('gbaEmulator.game.controlsDescription')}</Text>
        <Text style={styles.helperText}>{t('gbaEmulator.game.saveStateHint')}</Text>
      </View>

      <TouchableOpacity
        style={styles.libraryButton}
        onPress={() => navigation.navigate('GbaEmulatorHome')}
        activeOpacity={0.85}
        testID="gba-emulator-return-library-button"
      >
        <Text style={styles.libraryButtonText}>{t('gbaEmulator.game.returnToLibrary')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1b2f', paddingHorizontal: 16, paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 16 },
  backText: { fontSize: 16, color: '#d3cbff', fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerSpacer: { width: 52 },
  emulatorView: { flex: 1, backgroundColor: '#000', borderRadius: 12, overflow: 'hidden' },
  viewport: {
    flex: 1,
    minHeight: 240,
    backgroundColor: '#111019',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#5b4db1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  viewportLabel: { fontSize: 12, fontWeight: '700', color: '#8e88b8', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 },
  emptyTitle: { fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 10 },
  emptyText: { fontSize: 15, color: '#cbc7e6', textAlign: 'center', lineHeight: 22, maxWidth: 320 },
  controlsPanel: { backgroundColor: '#2a2640', borderRadius: 20, padding: 18, marginTop: 16, marginBottom: 16 },
  controlsTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 12 },
  controlChip: { flex: 1, backgroundColor: '#3a345a', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center' },
  controlText: { fontSize: 14, fontWeight: '700', color: '#f7f5ff' },
  helperText: { fontSize: 13, color: '#cbc7e6', lineHeight: 18, marginTop: 4 },
  libraryButton: { backgroundColor: '#5b4db1', borderRadius: 26, paddingVertical: 16, alignItems: 'center' },
  libraryButtonText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
