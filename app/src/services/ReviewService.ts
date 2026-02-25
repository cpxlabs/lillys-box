import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  onSnapshot,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Review, ReviewMedia, ReviewSummary } from '../types/review';
import { isFirebaseConfigured, getFirestoreDB, getFirebaseStorage } from '../config/firebase.config';
import { logger } from '../utils/logger';

// ── AsyncStorage keys (local fallback) ───────────────────────────────────────
const reviewsKey = (gameId: string) => `@pet_care_game:reviews:${gameId}`;
const summaryKey = (gameId: string) => `@pet_care_game:review_summary:${gameId}`;

// ── Firestore collection names ────────────────────────────────────────────────
const REVIEWS_COLLECTION = 'reviews';
const SUMMARIES_COLLECTION = 'review_summaries';

const EMPTY_SUMMARY = (gameId: string): ReviewSummary => ({
  gameId,
  averageRating: 0,
  totalReviews: 0,
  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
});

export class ReviewService {
  // ── Media upload ─────────────────────────────────────────────────────────

  static async uploadMedia(
    media: ReviewMedia[],
    reviewId: string,
    gameId: string,
  ): Promise<ReviewMedia[]> {
    const storage = getFirebaseStorage();
    if (!storage || media.length === 0) return media;

    return Promise.all(
      media.map(async (item, i) => {
        // GIFs and already-uploaded URLs don't need uploading
        if (item.type === 'gif' || item.uri.startsWith('http')) return item;

        try {
          const response = await fetch(item.uri);
          const blob = await response.blob();
          const storageRef = ref(storage, `reviews/${gameId}/${reviewId}/${i}.jpg`);
          await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageRef);
          return { ...item, uri: downloadUrl };
        } catch (error) {
          logger.error('ReviewService.uploadMedia error for item', i, error);
          return item; // Keep local URI on upload failure
        }
      }),
    );
  }

  // ── Save ─────────────────────────────────────────────────────────────────

  static async saveReview(review: Review): Promise<void> {
    try {
      // Upload local images to Storage before persisting
      const reviewWithUploads: Review = isFirebaseConfigured
        ? { ...review, media: await ReviewService.uploadMedia(review.media, review.id, review.gameId) }
        : review;

      if (isFirebaseConfigured) {
        await ReviewService._saveToFirestore(reviewWithUploads);
      } else {
        await ReviewService._saveToLocal(reviewWithUploads);
      }
    } catch (error) {
      logger.error('ReviewService.saveReview error:', error);
      throw error;
    }
  }

  static async _saveToFirestore(review: Review): Promise<void> {
    const db = getFirestoreDB();
    if (!db) return;

    // Use review.id as the Firestore document ID for easy lookup
    await setDoc(doc(db, REVIEWS_COLLECTION, review.id), review);
    await ReviewService._recomputeSummaryFirestore(review.gameId);
  }

  static async _saveToLocal(review: Review): Promise<void> {
    const reviews = await ReviewService._getFromLocal(review.gameId);
    const idx = reviews.findIndex((r) => r.id === review.id);
    if (idx >= 0) {
      reviews[idx] = review;
    } else {
      reviews.unshift(review);
    }
    await AsyncStorage.setItem(reviewsKey(review.gameId), JSON.stringify(reviews));
    await ReviewService._recomputeSummaryLocal(review.gameId, reviews);
  }

  // ── Get ──────────────────────────────────────────────────────────────────

  static async getReviews(gameId: string): Promise<Review[]> {
    if (isFirebaseConfigured) {
      return ReviewService._getFromFirestore(gameId);
    }
    return ReviewService._getFromLocal(gameId);
  }

  static async _getFromFirestore(gameId: string): Promise<Review[]> {
    try {
      const db = getFirestoreDB();
      if (!db) return [];
      const q = query(
        collection(db, REVIEWS_COLLECTION),
        where('gameId', '==', gameId),
        orderBy('createdAt', 'desc'),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => d.data() as Review);
    } catch (error) {
      logger.error('ReviewService._getFromFirestore error:', error);
      return [];
    }
  }

  static async _getFromLocal(gameId: string): Promise<Review[]> {
    try {
      const json = await AsyncStorage.getItem(reviewsKey(gameId));
      return json ? (JSON.parse(json) as Review[]) : [];
    } catch (error) {
      logger.error('ReviewService._getFromLocal error:', error);
      return [];
    }
  }

  // ── Real-time subscription ────────────────────────────────────────────────

  static subscribeToReviews(
    gameId: string,
    onUpdate: (reviews: Review[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const db = getFirestoreDB();
    if (!db) {
      onUpdate([]);
      return () => {};
    }

    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('gameId', '==', gameId),
      orderBy('createdAt', 'desc'),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const reviews = snapshot.docs
          .map((d) => d.data() as Review)
          .filter((r) => !r.flagged);
        onUpdate(reviews);
      },
      (error) => {
        logger.error('ReviewService.subscribeToReviews error:', error);
        onError?.(error);
      },
    );
  }

  // ── Update (edit) ────────────────────────────────────────────────────────

  static async updateReview(review: Review): Promise<void> {
    const updated = { ...review, updatedAt: Date.now() };
    // Upload any new local images
    const withMedia: Review = isFirebaseConfigured
      ? { ...updated, media: await ReviewService.uploadMedia(updated.media, updated.id, updated.gameId) }
      : updated;

    if (isFirebaseConfigured) {
      const db = getFirestoreDB();
      if (db) {
        await setDoc(doc(db, REVIEWS_COLLECTION, withMedia.id), withMedia);
        await ReviewService._recomputeSummaryFirestore(withMedia.gameId);
      }
    } else {
      await ReviewService._saveToLocal(withMedia);
    }
  }

  // ── React (helpful) ───────────────────────────────────────────────────────

  static async reactToReview(
    gameId: string,
    reviewId: string,
    userId: string,
  ): Promise<void> {
    try {
      if (isFirebaseConfigured) {
        const db = getFirestoreDB();
        if (!db) return;
        const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return;
        const review = snap.data() as Review;
        const helpfulUserIds = review.helpfulUserIds ?? [];
        const already = helpfulUserIds.includes(userId);
        await updateDoc(docRef, {
          helpfulUserIds: already
            ? helpfulUserIds.filter((id) => id !== userId)
            : [...helpfulUserIds, userId],
        });
      } else {
        const reviews = await ReviewService._getFromLocal(gameId);
        const updated = reviews.map((r) => {
          if (r.id !== reviewId) return r;
          const helpfulUserIds = r.helpfulUserIds ?? [];
          const already = helpfulUserIds.includes(userId);
          return {
            ...r,
            helpfulUserIds: already
              ? helpfulUserIds.filter((id) => id !== userId)
              : [...helpfulUserIds, userId],
          };
        });
        await AsyncStorage.setItem(reviewsKey(gameId), JSON.stringify(updated));
      }
    } catch (error) {
      logger.error('ReviewService.reactToReview error:', error);
      throw error;
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  static async deleteReview(gameId: string, reviewId: string): Promise<void> {
    try {
      if (isFirebaseConfigured) {
        const db = getFirestoreDB();
        if (db) {
          await deleteDoc(doc(db, REVIEWS_COLLECTION, reviewId));
          await ReviewService._recomputeSummaryFirestore(gameId);
        }
      } else {
        const reviews = await ReviewService._getFromLocal(gameId);
        const updated = reviews.filter((r) => r.id !== reviewId);
        await AsyncStorage.setItem(reviewsKey(gameId), JSON.stringify(updated));
        await ReviewService._recomputeSummaryLocal(gameId, updated);
      }
    } catch (error) {
      logger.error('ReviewService.deleteReview error:', error);
      throw error;
    }
  }

  // ── Flag ──────────────────────────────────────────────────────────────────

  static async flagReview(gameId: string, reviewId: string): Promise<void> {
    try {
      if (isFirebaseConfigured) {
        const db = getFirestoreDB();
        if (db) {
          await updateDoc(doc(db, REVIEWS_COLLECTION, reviewId), { flagged: true });
          await ReviewService._recomputeSummaryFirestore(gameId);
        }
      } else {
        const reviews = await ReviewService._getFromLocal(gameId);
        const updated = reviews.map((r) => (r.id === reviewId ? { ...r, flagged: true } : r));
        await AsyncStorage.setItem(reviewsKey(gameId), JSON.stringify(updated));
        await ReviewService._recomputeSummaryLocal(gameId, updated);
      }
    } catch (error) {
      logger.error('ReviewService.flagReview error:', error);
      throw error;
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────

  static async getSummary(gameId: string): Promise<ReviewSummary> {
    try {
      if (isFirebaseConfigured) {
        const db = getFirestoreDB();
        if (db) {
          const snap = await getDoc(doc(db, SUMMARIES_COLLECTION, gameId));
          return snap.exists() ? (snap.data() as ReviewSummary) : EMPTY_SUMMARY(gameId);
        }
      }
      const json = await AsyncStorage.getItem(summaryKey(gameId));
      return json ? (JSON.parse(json) as ReviewSummary) : EMPTY_SUMMARY(gameId);
    } catch (error) {
      logger.error('ReviewService.getSummary error:', error);
      return EMPTY_SUMMARY(gameId);
    }
  }

  // ── Summary recomputation ─────────────────────────────────────────────────

  static async _recomputeSummaryFirestore(gameId: string): Promise<void> {
    try {
      const db = getFirestoreDB();
      if (!db) return;
      const reviews = await ReviewService._getFromFirestore(gameId);
      const visible = reviews.filter((r) => !r.flagged);
      const summary = ReviewService._computeSummary(gameId, visible);
      await setDoc(doc(db, SUMMARIES_COLLECTION, gameId), summary);
    } catch (error) {
      logger.error('ReviewService._recomputeSummaryFirestore error:', error);
    }
  }

  static async _recomputeSummaryLocal(gameId: string, reviews: Review[]): Promise<void> {
    const visible = reviews.filter((r) => !r.flagged);
    const summary = ReviewService._computeSummary(gameId, visible);
    await AsyncStorage.setItem(summaryKey(gameId), JSON.stringify(summary));
  }

  static _computeSummary(gameId: string, visible: Review[]): ReviewSummary {
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    visible.forEach((r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
      total += r.rating;
    });
    return {
      gameId,
      averageRating: visible.length ? total / visible.length : 0,
      totalReviews: visible.length,
      ratingDistribution: dist as ReviewSummary['ratingDistribution'],
    };
  }
}
