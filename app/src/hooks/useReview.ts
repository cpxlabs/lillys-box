import { useState, useEffect, useCallback, useMemo } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Review, ReviewMedia, ReviewSummary } from '../types/review';
import { ReviewService } from '../services/ReviewService';
import { isFirebaseConfigured } from '../config/firebase.config';
import { useAuth } from '../context/AuthContext';

type SubmitData = {
  rating: number;
  comment: string;
  media: ReviewMedia[];
};

export const useReview = (gameId: string) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Derive summary from reviews in memory — no separate fetch needed
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

  // Fallback refresh for local-only mode
  const refreshReviews = useCallback(async () => {
    if (isFirebaseConfigured) return; // onSnapshot handles updates
    setLoading(true);
    const r = await ReviewService.getReviews(gameId);
    setReviews(r);
    setLoading(false);
  }, [gameId]);

  useEffect(() => {
    if (isFirebaseConfigured) {
      // Real-time Firestore subscription
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
      // Local AsyncStorage load
      refreshReviews();
    }
  }, [gameId, refreshReviews]);

  const submitReview = useCallback(
    async (data: SubmitData) => {
      const review: Review = {
        id: uuidv4(),
        userId: user?.id ?? 'guest',
        userNickname: user?.name ?? 'Guest',
        userAvatar: user?.photo ?? '🐾',
        gameId,
        rating: data.rating,
        comment: data.comment,
        media: data.media,
        createdAt: Date.now(),
      };
      await ReviewService.saveReview(review);
      if (!isFirebaseConfigured) await refreshReviews();
      // Firebase: onSnapshot auto-updates state
    },
    [user, gameId, refreshReviews],
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

  return { reviews, summary, loading, submitReview, deleteReview, flagReview, refreshReviews };
};
