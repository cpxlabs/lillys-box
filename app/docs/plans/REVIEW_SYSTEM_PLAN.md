# Game Review System — Implementation Plan

**Status:** ✅ Implemented (Phase 1 & 2 complete)
**Last Updated:** 2026-02-25
**Target Version:** 1.2.0

---

## Overview

A modal-based review system that lets players rate and comment on any mini-game directly from the game screen. Reviews support text, star ratings, image attachments (from camera or gallery), and GIF search. MVP uses local AsyncStorage; Phase 2 syncs to Firebase.

---

## User Flow

```
Game Screen
    └── "Review this game" button (top-right or post-game screen)
            └── ReviewModal opens (bottom sheet)
                    ├── Star rating (1–5)
                    ├── Text comment (multiline, 500 char max)
                    ├── Media strip
                    │       ├── [+ Image] → expo-image-picker (camera / gallery)
                    │       └── [+ GIF]   → GifPicker modal (Tenor search)
                    ├── Media previews (thumbnails with × remove)
                    └── [Submit] → saves review → modal closes → success toast
```

---

## Data Model

```typescript
// src/types/review.ts

type ReviewMedia = {
  type: 'image' | 'gif';
  uri: string;          // local URI (images) or Tenor CDN URL (GIFs)
  thumbnailUri?: string;
  width?: number;
  height?: number;
};

type Review = {
  id: string;           // uuid
  userId: string;       // from AuthContext
  userNickname: string; // displayName or 'Guest'
  userAvatar: string;   // emoji or photoURL
  gameId: string;       // from GameRegistry
  rating: number;       // 1–5
  comment: string;      // max 500 chars
  media: ReviewMedia[]; // max 3 attachments
  createdAt: number;    // Date.now()
  updatedAt?: number;
  flagged?: boolean;    // moderation
  helpfulUserIds?: string[]; // users who marked this as helpful
};

type ReviewSortOption = 'recent' | 'helpful' | 'highest' | 'lowest';

type ReviewSummary = {
  gameId: string;
  averageRating: number;
  totalReviews: number;
};
```

**AsyncStorage keys:**
```
reviews:{gameId}          → Review[]     (reviews for a specific game)
review_summary:{gameId}   → ReviewSummary
```

---

## Components

### `ReviewModal.tsx`
`src/components/ReviewModal.tsx`

Main modal. Receives `gameId` and `visible` + `onClose` props. Internally manages form state.

```typescript
type ReviewModalProps = {
  gameId: string;
  visible: boolean;
  onClose: () => void;
};
```

**Behavior:**
- Bottom sheet (slides up from bottom, 80% screen height)
- Keyboard-aware scroll (scrolls up when keyboard opens on comment input)
- Disabled submit until rating > 0
- Shows character counter on comment input
- On submit: calls `useReview.submitReview()` → success toast → `onClose()`

---

### `StarRating.tsx`
`src/components/StarRating.tsx`

Interactive 1–5 star picker. Also has a read-only `readonly` prop for displaying ratings in the reviews list.

```typescript
type StarRatingProps = {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
};
```

---

### `MediaAttachment.tsx`
`src/components/MediaAttachment.tsx`

Horizontal strip showing media action buttons and selected media thumbnails.

```typescript
type MediaAttachmentProps = {
  media: ReviewMedia[];
  onAdd: (item: ReviewMedia) => void;
  onRemove: (index: number) => void;
  maxItems?: number; // default 3
};
```

**Buttons:**
- `[📷 Photo]` → `expo-image-picker` (camera or gallery, resized to max 1024px, JPEG 80%)
- `[GIF]` → opens `GifPicker` modal

---

### `GifPicker.tsx`
`src/components/GifPicker.tsx`

Modal with a search input and grid of GIF results from Tenor API.

```typescript
type GifPickerProps = {
  visible: boolean;
  onSelect: (gif: ReviewMedia) => void;
  onClose: () => void;
};
```

**Behavior:**
- Search input with 500ms debounce
- Shows trending GIFs on open (no search query)
- Grid of thumbnails (2 columns), lazy-loaded
- Tapping a GIF: selects it → closes picker → adds to media strip
- Uses Tenor API v2 (free tier, requires API key in env)

**Env variable:** `EXPO_PUBLIC_TENOR_API_KEY`

---

### `GameReviewsScreen.tsx`
`src/screens/GameReviewsScreen.tsx`

Full-screen view of all reviews for a game. Accessible from the game card (long-press or a "See reviews" link).

**Sections:**
- Summary header: average stars, total count, rating distribution bar chart
- Sort buttons: Recent, Helpful, Highest, Lowest
- Flat list of review cards (avatar, nickname, stars, comment, media thumbnails, date)
- Helpful reaction button with count on each card
- Flag button on each card (marks review as flagged in local storage)
- Delete button for own reviews
- "Write a Review" FAB button → opens `ReviewModal`

---

## Hook

### `useReview.ts`
`src/hooks/useReview.ts`

```typescript
const useReview = (gameId: string) => {
  // State
  reviews: Review[]
  summary: ReviewSummary | null
  loading: boolean
  userReview: Review | null  // current user's existing review for this game

  // Actions
  submitReview: (data: Omit<Review, 'id' | 'userId' | 'userNickname' | 'userAvatar' | 'createdAt' | 'helpfulUserIds'>) => Promise<void>
  updateReview: (reviewId: string, data: Partial<Review>) => Promise<void>
  deleteReview: (reviewId: string) => Promise<void>
  flagReview: (reviewId: string) => Promise<void>
  reactToReview: (reviewId: string) => Promise<void>  // toggle "helpful" reaction
  refreshReviews: () => Promise<void>
}
```

Reads/writes via `ReviewService`. On submit, recomputes and stores `ReviewSummary`.

---

## Service

### `ReviewService.ts`
`src/services/ReviewService.ts`

Thin data layer. Phase 1 uses AsyncStorage; Phase 2 adds Firestore behind the same interface.

```typescript
class ReviewService {
  static async getReviews(gameId: string): Promise<Review[]>
  static async saveReview(review: Review): Promise<void>
  static async updateReview(review: Review): Promise<void>
  static async deleteReview(gameId: string, reviewId: string): Promise<void>
  static async flagReview(gameId: string, reviewId: string): Promise<void>
  static async reactToReview(gameId: string, reviewId: string, userId: string): Promise<void>
  static async getSummary(gameId: string): Promise<ReviewSummary>
}
```

---

## Integration Points

### Opening the modal from a game screen

Add a review button to each game's screen (or to the post-game overlay). The game already has a `gameId` from its context/route. Example:

```typescript
// In any game screen component
const [reviewVisible, setReviewVisible] = useState(false);

<IconButton icon="star" onPress={() => setReviewVisible(true)} />
<ReviewModal
  gameId={gameId}
  visible={reviewVisible}
  onClose={() => setReviewVisible(false)}
/>
```

### Game Selection Screen

Add average star rating badge to each game card in `GameSelectionScreen`. Read from `ReviewService.getSummary(gameId)` on mount.

---

## Phase 2: Firebase Sync

After the Firebase auth overhaul (see `PLAN.md`) is complete:

1. Upload images to **Firebase Storage** at `reviews/{gameId}/{reviewId}/{filename}`
2. Store review documents in **Firestore** at `reviews/{autoId}`
3. Store summaries in `review_summaries/{gameId}` (updated via Cloud Function or client-side on submit)
4. Add real-time listener in `useReview` for the Firestore collection
5. Moderation: admin flagging via Firestore security rules

---

## Implementation Order

```
Phase 1 (MVP — local only)              ~2-3 days
  1. src/types/review.ts                ← types first
  2. ReviewService.ts (AsyncStorage)    ← data layer
  3. useReview.ts                       ← hook
  4. StarRating.tsx                     ← simplest component
  5. MediaAttachment.tsx                ← image picker integration
  6. GifPicker.tsx                      ← Tenor API
  7. ReviewModal.tsx                    ← main modal (uses all above)
  8. Add review button to HomeScreen    ← first integration point
  9. GameReviewsScreen.tsx              ← full list view
  10. Average rating on game cards      ← GameSelectionScreen update

Phase 2 (Firebase sync)                 ~1-2 days
  — After PLAN.md Firebase setup is done —
  11. Upload images to Firebase Storage
  12. Sync reviews to Firestore
  13. Real-time listener in useReview
  14. review_summaries Cloud Function
```

---

## New Files

| File | Purpose |
|------|---------|
| `src/types/review.ts` | Type definitions |
| `src/services/ReviewService.ts` | AsyncStorage / Firestore data layer |
| `src/hooks/useReview.ts` | Review state + actions hook |
| `src/components/ReviewModal.tsx` | Main review modal (bottom sheet) |
| `src/components/StarRating.tsx` | Interactive + read-only star widget |
| `src/components/MediaAttachment.tsx` | Image/GIF strip + picker buttons |
| `src/components/GifPicker.tsx` | Tenor GIF search modal |
| `src/screens/GameReviewsScreen.tsx` | Full reviews list per game |

## Modified Files

| File | Change |
|------|--------|
| `src/screens/HomeScreen.tsx` | Add review button + `ReviewModal` |
| `src/screens/GameSelectionScreen.tsx` | Show average star rating on game cards |
| `app/app.config.js` | Add `EXPO_PUBLIC_TENOR_API_KEY` env var |
| `src/locales/en.json` | Add review-related translation strings |
| `src/locales/pt-BR.json` | Add review-related translation strings |

---

## Dependencies to Add

```bash
# Already present — no new native dependencies needed for MVP
# expo-image-picker is part of expo SDK

# If not already installed:
expo install expo-image-picker
```

For GIF search: Tenor API v2 (free, no SDK needed — plain fetch calls).

No new native modules needed. The entire Phase 1 implementation works in Expo Go and the Vercel web build.
