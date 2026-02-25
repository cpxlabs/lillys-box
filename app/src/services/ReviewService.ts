import AsyncStorage from '@react-native-async-storage/async-storage';
import { Review, ReviewSummary } from '../types/review';
import { logger } from '../utils/logger';

const reviewsKey = (gameId: string) => `@pet_care_game:reviews:${gameId}`;
const summaryKey = (gameId: string) => `@pet_care_game:review_summary:${gameId}`;

const EMPTY_SUMMARY = (gameId: string): ReviewSummary => ({
  gameId,
  averageRating: 0,
  totalReviews: 0,
  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
});

export class ReviewService {
  static async getReviews(gameId: string): Promise<Review[]> {
    try {
      const json = await AsyncStorage.getItem(reviewsKey(gameId));
      return json ? (JSON.parse(json) as Review[]) : [];
    } catch (error) {
      logger.error('ReviewService.getReviews error:', error);
      return [];
    }
  }

  static async saveReview(review: Review): Promise<void> {
    try {
      const reviews = await ReviewService.getReviews(review.gameId);
      const idx = reviews.findIndex((r) => r.id === review.id);
      if (idx >= 0) {
        reviews[idx] = review;
      } else {
        reviews.unshift(review); // newest first
      }
      await AsyncStorage.setItem(reviewsKey(review.gameId), JSON.stringify(reviews));
      await ReviewService._recomputeSummary(review.gameId, reviews);
    } catch (error) {
      logger.error('ReviewService.saveReview error:', error);
      throw error;
    }
  }

  static async deleteReview(gameId: string, reviewId: string): Promise<void> {
    try {
      const reviews = await ReviewService.getReviews(gameId);
      const updated = reviews.filter((r) => r.id !== reviewId);
      await AsyncStorage.setItem(reviewsKey(gameId), JSON.stringify(updated));
      await ReviewService._recomputeSummary(gameId, updated);
    } catch (error) {
      logger.error('ReviewService.deleteReview error:', error);
      throw error;
    }
  }

  static async flagReview(gameId: string, reviewId: string): Promise<void> {
    try {
      const reviews = await ReviewService.getReviews(gameId);
      const updated = reviews.map((r) => (r.id === reviewId ? { ...r, flagged: true } : r));
      await AsyncStorage.setItem(reviewsKey(gameId), JSON.stringify(updated));
      await ReviewService._recomputeSummary(gameId, updated);
    } catch (error) {
      logger.error('ReviewService.flagReview error:', error);
      throw error;
    }
  }

  static async getSummary(gameId: string): Promise<ReviewSummary> {
    try {
      const json = await AsyncStorage.getItem(summaryKey(gameId));
      return json ? (JSON.parse(json) as ReviewSummary) : EMPTY_SUMMARY(gameId);
    } catch (error) {
      logger.error('ReviewService.getSummary error:', error);
      return EMPTY_SUMMARY(gameId);
    }
  }

  static async _recomputeSummary(gameId: string, reviews: Review[]): Promise<void> {
    const visible = reviews.filter((r) => !r.flagged);
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    visible.forEach((r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
      total += r.rating;
    });
    const summary: ReviewSummary = {
      gameId,
      averageRating: visible.length ? total / visible.length : 0,
      totalReviews: visible.length,
      ratingDistribution: dist as ReviewSummary['ratingDistribution'],
    };
    await AsyncStorage.setItem(summaryKey(gameId), JSON.stringify(summary));
  }
}
