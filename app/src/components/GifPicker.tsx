import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ReviewMedia } from '../types/review';
import { logger } from '../utils/logger';

const TENOR_API_KEY = process.env.EXPO_PUBLIC_TENOR_API_KEY ?? '';
const TENOR_BASE = 'https://tenor.googleapis.com/v2';
const GIF_LIMIT = 20;

type TenorGif = {
  id: string;
  title: string;
  media_formats: {
    tinygif: { url: string; dims: number[] };
    gif: { url: string; dims: number[] };
  };
};

type Props = {
  visible: boolean;
  onSelect: (gif: ReviewMedia) => void;
  onClose: () => void;
};

export const GifPicker: React.FC<Props> = ({ visible, onSelect, onClose }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState<TenorGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const fetchGifs = useCallback(async (searchQuery: string) => {
    if (!TENOR_API_KEY) return;
    setLoading(true);
    setFetchError(null);
    try {
      const endpoint = searchQuery.trim()
        ? `${TENOR_BASE}/search?q=${encodeURIComponent(searchQuery)}&key=${TENOR_API_KEY}&limit=${GIF_LIMIT}&media_filter=tinygif,gif`
        : `${TENOR_BASE}/featured?key=${TENOR_API_KEY}&limit=${GIF_LIMIT}&media_filter=tinygif,gif`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setGifs(data.results ?? []);
    } catch (error) {
      logger.error('GifPicker fetch error:', error);
      setFetchError(t('review.gifFetchError', 'Failed to load GIFs. Tap to retry.'));
      setGifs([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Load trending on open
  useEffect(() => {
    if (visible && TENOR_API_KEY) {
      fetchGifs('');
    }
  }, [visible, fetchGifs]);

  // Debounced search
  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => fetchGifs(text), 500);
    setDebounceTimer(timer);
  };

  const handleSelect = (gif: TenorGif) => {
    const tiny = gif.media_formats.tinygif;
    const full = gif.media_formats.gif;
    onSelect({
      type: 'gif',
      uri: full.url,
      thumbnailUri: tiny.url,
      width: full.dims[0],
      height: full.dims[1],
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('review.gifPickerTitle')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {!TENOR_API_KEY ? (
            <View style={styles.noKeyContainer}>
              <Text style={styles.noKeyText}>{t('review.gifNoApiKey')}</Text>
              <Text style={styles.noKeyHint}>EXPO_PUBLIC_TENOR_API_KEY</Text>
            </View>
          ) : (
            <>
              <View style={styles.searchRow}>
                <TextInput
                  style={styles.searchInput}
                  placeholder={t('review.gifSearchPlaceholder')}
                  value={query}
                  onChangeText={handleQueryChange}
                  returnKeyType="search"
                  autoCapitalize="none"
                />
              </View>

              {loading ? (
                <ActivityIndicator style={styles.loader} size="large" color="#9b59b6" />
              ) : fetchError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{fetchError}</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => fetchGifs(query)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.retryButtonText}>{t('common.retry', 'Retry')}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={gifs}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  contentContainerStyle={styles.grid}
                  renderItem={({ item }) => {
                    const thumb = item.media_formats.tinygif;
                    const aspect =
                      thumb.dims[1] && thumb.dims[0] ? thumb.dims[1] / thumb.dims[0] : 1;
                    return (
                      <TouchableOpacity
                        style={styles.gifCell}
                        onPress={() => handleSelect(item)}
                        activeOpacity={0.8}
                      >
                        <Image
                          source={{ uri: thumb.url }}
                          style={[styles.gifImage, { height: 80 * aspect }]}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    );
                  }}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>{t('review.gifNoResults')}</Text>
                  }
                />
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '75%',
    ...Platform.select({
      web: { boxShadow: '0 -4px 16px rgba(0,0,0,0.15)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  closeBtn: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: '#f5f0ff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  loader: {
    marginTop: 40,
  },
  grid: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  gifCell: {
    flex: 1,
    margin: 4,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0e6f6',
    minHeight: 60,
  },
  gifImage: {
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
    fontSize: 15,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#9b59b6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  noKeyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noKeyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  noKeyHint: {
    fontSize: 13,
    color: '#9b59b6',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#f5f0ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
