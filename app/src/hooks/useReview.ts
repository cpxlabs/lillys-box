import { useState, useEffect, useCallback } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Review, ReviewMedia, ReviewSummary } from '../types/review';
import { ReviewService } from '../services/ReviewService';
import { useAuth } from '../context/AuthContext';

type SubmitData = {
  rating: number;
  comment: string;
  media: ReviewMedia[];
};

export const useReview = (gameId: string) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshReviews = useCallback(async () => {
    setLoading(true);
    const [r, s] = await Promise.all([
      ReviewService.getReviews(gameId),
      ReviewService.getSummary(gameId),
    ]);
    setReviews(r);
    setSummary(s);
    setLoading(false);
  }, [gameId]);

  useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

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
      await refreshReviews();
    },
    [user, gameId, refreshReviews],
  );

  const deleteReview = useCallback(
    async (reviewId: string) => {
      await ReviewService.deleteReview(gameId, reviewId);
      await refreshReviews();
    },
    [gameId, refreshReviews],
  );

  const flagReview = useCallback(
    async (reviewId: string) => {
      await ReviewService.flagReview(gameId, reviewId);
      await refreshReviews();
    },
    [gameId, refreshReviews],
  );

  return { reviews, summary, loading, submitReview, deleteReview, flagReview, refreshReviews };
};
