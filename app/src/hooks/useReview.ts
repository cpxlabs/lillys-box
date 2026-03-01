import { useState, useEffect, useCallback, useMemo } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Review, ReviewMedia, ReviewSummary } from '../types/review';
import { ReviewService } from '../services/ReviewService';
import { isFirebaseConfigured } from '../config/firebase.config';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';

type SubmitData = {
  rating: number;
  comment: string;
  media: ReviewMedia[];
};

export const useReview = (gameId: string) => {
  const { user } = useAuth();
  const currentUserId = user?.id ?? 'guest';

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Derive summary in-memory — no separate fetch needed
  const summary = useMemo<ReviewSummary | null>(() => {
    if (reviews.length === 0) return null;
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    reviews.forEach((r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
      total += r.rating;
    });
    return {
      gameId,
      averageRating: total / reviews.length,
      totalReviews: reviews.length,
      ratingDistribution: dist as ReviewSummary['ratingDistribution'],
    };
  }, [reviews, gameId]);

  // Current user's existing review for this game
  const userReview = useMemo(
    () => reviews.find((r) => r.userId === currentUserId) ?? null,
    [reviews, currentUserId],
  );

  // Fallback refresh for local-only mode
  const refreshReviews = useCallback(async () => {
    if (isFirebaseConfigured) return; // onSnapshot handles updates
    setLoading(true);
    try {
      const r = await ReviewService.getReviews(gameId);
      setReviews(r);
    } catch (error) {
      logger.error('[useReview] Failed to refresh reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    if (isFirebaseConfigured) {
      setLoading(true);
      const unsubscribe = ReviewService.subscribeToReviews(
        gameId,
        (r) => {
          setReviews(r);
          setLoading(false);
        },
        () => setLoading(false),
      );
      return () => unsubscribe();
    } else {
      refreshReviews();
    }
  }, [gameId, refreshReviews]);

  const submitReview = useCallback(
    async (data: SubmitData) => {
      const review: Review = {
        id: uuidv4(),
        userId: currentUserId,
        userNickname: user?.name ?? 'Guest',
        userAvatar: user?.photo ?? '🐾',
        gameId,
        rating: data.rating,
        comment: data.comment,
        media: data.media,
        createdAt: Date.now(),
        helpfulUserIds: [],
      };
      await ReviewService.saveReview(review);
      if (!isFirebaseConfigured) await refreshReviews();
    },
    [user, currentUserId, gameId, refreshReviews],
  );

  const updateReview = useCallback(
    async (reviewId: string, data: SubmitData) => {
      const existing = reviews.find((r) => r.id === reviewId);
      if (!existing) return;
      await ReviewService.updateReview({ ...existing, ...data, updatedAt: Date.now() });
      if (!isFirebaseConfigured) await refreshReviews();
    },
    [reviews, refreshReviews],
  );

  const deleteReview = useCallback(
    async (reviewId: string) => {
      await ReviewService.deleteReview(gameId, reviewId);
      if (!isFirebaseConfigured) await refreshReviews();
    },
    [gameId, refreshReviews],
  );

  const flagReview = useCallback(
    async (reviewId: string) => {
      await ReviewService.flagReview(gameId, reviewId);
      if (!isFirebaseConfigured) await refreshReviews();
    },
    [gameId, refreshReviews],
  );

  const reactToReview = useCallback(
    async (reviewId: string) => {
      await ReviewService.reactToReview(gameId, reviewId, currentUserId);
      if (!isFirebaseConfigured) await refreshReviews();
    },
    [gameId, currentUserId, refreshReviews],
  );

  return {
    reviews,
    summary,
    loading,
    userReview,
    submitReview,
    updateReview,
    deleteReview,
    flagReview,
    reactToReview,
    refreshReviews,
  };
};
