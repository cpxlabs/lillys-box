import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useReview } from '../hooks/useReview';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/StarRating';
import { ReviewModal } from '../components/ReviewModal';
import { Review, ReviewSortOption } from '../types/review';

type Props = {
  gameId: string;
  gameName: string;
  onBack: () => void;
};

export const GameReviewsScreen: React.FC<Props> = ({ gameId, gameName, onBack }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { reviews, summary, loading, deleteReview, flagReview, reactToReview } = useReview(gameId);
  const [writeVisible, setWriteVisible] = useState(false);
  const [sortBy, setSortBy] = useState<ReviewSortOption>('recent');

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'helpful':
        return sorted.sort((a, b) => (b.helpfulUserIds?.length ?? 0) - (a.helpfulUserIds?.length ?? 0));
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'recent':
      default:
        return sorted.sort((a, b) => b.createdAt - a.createdAt);
    }
  }, [reviews, sortBy]);

  const renderRatingBar = (star: 1 | 2 | 3 | 4 | 5) => {
    const count = summary?.ratingDistribution[star] ?? 0;
    const total = summary?.totalReviews ?? 0;
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
      <View key={star} style={styles.barRow}>
        <Text style={styles.barLabel}>{'★'.repeat(star)}</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.barCount}>{count}</Text>
      </View>
    );
  };

  const renderReview = ({ item }: { item: Review }) => {
    const isOwn = item.userId === (user?.id ?? 'guest');
    const date = new Date(item.createdAt).toLocaleDateString();

    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.avatarRow}>
            {typeof item.userAvatar === 'string' && item.userAvatar.startsWith('http') ? (
              <Image source={{ uri: item.userAvatar }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarEmoji}>
                <Text style={styles.avatarEmojiText}>{item.userAvatar}</Text>
              </View>
            )}
            <View>
              <Text style={styles.nickname}>{item.userNickname}</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>
          <StarRating value={item.rating} readonly size={16} />
        </View>

        {item.comment.length > 0 && <Text style={styles.comment}>{item.comment}</Text>}

        {item.media.length > 0 && (
          <View style={styles.mediaRow}>
            {item.media.map((m, i) => (
              <Image key={i} source={{ uri: m.thumbnailUri ?? m.uri }} style={styles.mediaThumbnail} />
            ))}
          </View>
        )}

        <View style={styles.reviewActions}>
          {!isOwn && (
            <>
              <TouchableOpacity
                onPress={() => reactToReview(item.id)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={styles.helpfulBtn}>
                  {item.helpfulUserIds?.includes(user?.id ?? 'guest') ? '👍' : '👍 '}
                  {item.helpfulUserIds?.length ?? 0}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => flagReview(item.id)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={styles.flagBtn}>{item.flagged ? '🚩 ' : '⚑ '}{t('review.flag')}</Text>
              </TouchableOpacity>
            </>
          )}
          {isOwn && (
            <TouchableOpacity
              onPress={() => deleteReview(item.id)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={styles.deleteBtn}>{t('review.delete')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nav header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backBtn}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {gameName}
        </Text>
        <View style={styles.navSpacer} />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#9b59b6" />
      ) : (
        <FlatList
          data={sortedReviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReview}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.summaryCard}>
              <Text style={styles.avgRating}>
                {summary && summary.totalReviews > 0
                  ? summary.averageRating.toFixed(1)
                  : '—'}
              </Text>
              <StarRating
                value={summary?.averageRating ?? 0}
                readonly
                size={22}
              />
              <Text style={styles.totalCount}>
                {t('review.totalReviews', { count: summary?.totalReviews ?? 0 })}
              </Text>
              <View style={styles.barsContainer}>
                {([5, 4, 3, 2, 1] as const).map(renderRatingBar)}
              </View>
              <View style={styles.sortRow}>
                {(['recent', 'helpful', 'highest', 'lowest'] as const).map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.sortBtn, sortBy === opt && styles.sortBtnActive]}
                    onPress={() => setSortBy(opt)}
                  >
                    <Text style={[styles.sortBtnText, sortBy === opt && styles.sortBtnTextActive]}>
                      {t(`review.sort.${opt}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t('review.noReviews')}</Text>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setWriteVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>⭐ {t('review.writeReview')}</Text>
      </TouchableOpacity>

      <ReviewModal
        gameId={gameId}
        gameName={gameName}
        visible={writeVisible}
        onClose={() => setWriteVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
    minWidth: 60,
  },
  navTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
  navSpacer: {
    minWidth: 60,
  },
  loader: {
    marginTop: 60,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
      default: {
        shadowColor: '#9b59b6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },
  avgRating: {
    fontSize: 48,
    fontWeight: '800',
    color: '#222',
    lineHeight: 56,
  },
  totalCount: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
    marginBottom: 12,
  },
  barsContainer: {
    width: '100%',
    gap: 5,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    width: 48,
    fontSize: 12,
    color: '#f0c040',
    textAlign: 'right',
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0e6f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#9b59b6',
    borderRadius: 4,
  },
  barCount: {
    width: 24,
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    justifyContent: 'center',
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0e6f6',
  },
  sortBtnActive: {
    backgroundColor: '#9b59b6',
  },
  sortBtnText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sortBtnTextActive: {
    color: '#fff',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      web: { boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
      },
    }),
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarEmoji: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmojiText: {
    fontSize: 18,
  },
  nickname: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#bbb',
  },
  comment: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 10,
  },
  mediaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  mediaThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  helpfulBtn: {
    fontSize: 12,
    color: '#666',
  },
  flagBtn: {
    fontSize: 12,
    color: '#bbb',
  },
  deleteBtn: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 15,
    marginTop: 32,
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    left: 20,
    right: 20,
    backgroundColor: '#9b59b6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(155,89,182,0.4)' },
      default: {
        shadowColor: '#9b59b6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
      },
    }),
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
