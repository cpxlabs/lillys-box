# Implementation Plans — Pet Care Game

> **Last Updated:** 2026-02-25
>
> This file tracks the active implementation plans for the project.
> See `app/docs/ROADMAP.md` for the full feature roadmap.

## Active Plans

| Plan | Status | Doc |
|------|--------|-----|
| User Stats, Auth & Firebase | 📋 Not started | [Details below](#user-stats-auth--profile---implementation-plan) |
| Game Review System | ✅ Complete | [`app/docs/plans/REVIEW_SYSTEM_PLAN.md`](./app/docs/plans/REVIEW_SYSTEM_PLAN.md) |

---

# User Stats, Auth & Profile - Implementation Plan

## Current State Summary (Feb 2026)

| Area | Current State |
|------|--------------|
| **Auth** | Google Sign-In (mobile only) + guest mode + web demo fallback |
| **Backend** | Fastify server with only `/health` endpoint; SQLite unused |
| **Data** | 100% local via AsyncStorage, per-userId isolation |
| **User Profile** | Only Google account info (id, email, name, photo) |
| **Scores** | Stored locally per game, no cross-device sync, no leaderboards |
| **Registration** | No email/password flow. Google or Guest only |
| **Web Deploy** | ✅ Live on Vercel — `npm install --legacy-peer-deps` + expo export |

---

## Architecture Decision: Firebase as MVP Backend

**Why Firebase fits this project:**
- Firebase Auth replaces custom auth code with email/password, Google, Apple, and anonymous (guest) providers — all in one SDK
- Firestore gives real-time leaderboards and profile sync without building REST endpoints
- React Native Firebase (`@react-native-firebase`) is mature and Expo-compatible
- Guest-to-account upgrade is built-in (anonymous auth → link credentials)
- The existing Fastify backend stays untouched — Firebase runs alongside it
- When MVP is validated, you can migrate to your own backend by swapping the data layer (Firestore calls) behind a repository interface

**Abstraction strategy for future migration:**
All Firebase access goes through a `DataService` abstraction layer. Screens/contexts never import Firebase directly. When you want to swap Firebase for a custom backend, you only replace the service implementations.

```
Screens/Contexts → DataService (interface) → FirebaseDataService (implementation)
                                           → CustomBackendService (future)
```

---

## Phase 1: Firebase Setup & Auth Overhaul

### 1.1 Install & Configure Firebase

**New dependencies (frontend):**
```
@react-native-firebase/app
@react-native-firebase/auth
@react-native-firebase/firestore
```

**Config files to create/update:**
- `firebase.config.ts` — Firebase project config (apiKey, projectId, etc.)
- `app.config.js` — Add Firebase plugin to Expo config
- `google-services.json` (Android) / `GoogleService-Info.plist` (iOS) — from Firebase Console

**Files changed:**
- `package.json` — new dependencies
- `app.config.js` — Firebase plugin registration

### 1.2 Data Service Abstraction Layer

Create `src/services/data/` directory:

```
src/services/data/
├── DataService.ts          # Interface/types definition
├── FirebaseDataService.ts  # Firebase implementation
├── LocalDataService.ts     # AsyncStorage fallback (offline/guest)
└── index.ts                # Factory that picks the right implementation
```

**`DataService` interface:**
```typescript
interface DataService {
  // Auth
  registerWithEmail(email: string, password: string, displayName: string): Promise<UserProfile>
  signInWithEmail(email: string, password: string): Promise<UserProfile>
  signInWithGoogle(): Promise<UserProfile>
  signInAsGuest(): Promise<UserProfile>
  upgradeGuestAccount(email: string, password: string): Promise<UserProfile>
  signOut(): Promise<void>
  resetPassword(email: string): Promise<void>
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void

  // Profile
  getProfile(userId: string): Promise<UserProfile>
  updateProfile(userId: string, data: Partial<UserProfile>): Promise<void>

  // Scores
  submitScore(userId: string, gameId: string, score: GameScore): Promise<void>
  getUserScores(userId: string, gameId?: string): Promise<GameScore[]>
  getLeaderboard(gameId: string, limit?: number): Promise<LeaderboardEntry[]>
  getUserRank(userId: string, gameId: string): Promise<number>
}
```

### 1.3 Refactor AuthContext to use DataService

**`src/context/AuthContext.tsx` changes:**
- Replace direct Google Sign-In calls with `DataService` methods
- Add `register()`, `resetPassword()`, `upgradeAccount()` methods
- Keep backward compatibility with existing `signIn()` / `signOut()` / `playAsGuest()`
- Auth state now driven by Firebase `onAuthStateChanged` listener

**Updated `AuthContextType`:**
```typescript
interface AuthContextType {
  user: UserProfile | null;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  // Existing
  signIn: () => Promise<void>;              // Google sign-in
  signOut: () => Promise<void>;
  playAsGuest: () => Promise<void>;
  // New
  register: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  upgradeAccount: (email: string, password: string) => Promise<void>;
}
```

### 1.4 New UserProfile Type

**`src/types.ts` — add:**
```typescript
type UserProfile = {
  id: string;
  email: string | null;
  displayName: string;
  photoURL: string | null;
  // Profile fields (editable)
  nickname: string;          // Unique display name for leaderboards
  avatarEmoji: string;       // Emoji avatar (default: pet emoji)
  bio: string;               // Short bio (max 140 chars)
  favoriteGame: string | null;
  // Stats (read-only, computed)
  totalGamesPlayed: number;
  totalScore: number;
  memberSince: number;       // timestamp
  lastActive: number;        // timestamp
  // Auth metadata
  authProvider: 'google' | 'email' | 'guest';
  isGuest: boolean;
};
```

---

## Phase 2: Register & Login Forms

### 2.1 New Screen: RegisterScreen

**`src/screens/RegisterScreen.tsx`**

Form fields:
- Display Name (text input, required)
- Email (text input, validated)
- Password (text input, min 6 chars, show/hide toggle)
- Confirm Password
- Submit button
- "Already have an account? Sign In" link

Validation: inline field errors, password strength indicator.

### 2.2 Refactor LoginScreen

**`src/screens/LoginScreen.tsx` changes:**

Current buttons: "Sign in with Google" + "Play as Guest"

New layout:
- Email input
- Password input
- "Sign In" button (email/password)
- "Forgot Password?" link → triggers `resetPassword()`
- Divider: "or continue with"
- "Sign in with Google" button (existing)
- "Play as Guest" button (existing)
- "Don't have an account? Register" → navigates to RegisterScreen

### 2.3 New Screen: ForgotPasswordScreen

**`src/screens/ForgotPasswordScreen.tsx`**

- Email input
- "Send Reset Email" button
- Success/error feedback
- "Back to Sign In" link

### 2.4 Navigation Updates

**`App.tsx` changes:**
- Add `Register` and `ForgotPassword` to the unauthenticated stack
- Auth stack: `Login` → `Register` | `ForgotPassword`

---

## Phase 3: Profile Editing

### 3.1 New Screen: ProfileScreen

**`src/screens/ProfileScreen.tsx`**

Sections:
1. **Avatar & Identity** — Emoji avatar picker, display name, nickname
2. **Account Info** — Email (read-only), auth provider badge, member since
3. **Bio** — Editable text (140 char max)
4. **Favorite Game** — Picker from registered games
5. **Stats Summary** — Total games played, total score, days active
6. **Actions** — Sign Out, Delete Account (with confirmation)

For guest users: show a CTA banner "Create an account to save your progress" → triggers `upgradeAccount()` flow.

### 3.2 New Screen: EditProfileScreen

**`src/screens/EditProfileScreen.tsx`**

Focused edit form for:
- Nickname (unique check against Firestore)
- Avatar emoji (grid picker)
- Bio text
- Save / Cancel buttons

### 3.3 New Context: UserProfileContext

**`src/context/UserProfileContext.tsx`**

```typescript
interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}
```

Listens to Firestore document `users/{userId}` in real-time. Auto-syncs profile changes.

### 3.4 Navigation for Profile

- Add profile icon/button to `GameSelectionScreen` header
- Add `Profile` and `EditProfile` screens to the authenticated stack

---

## Phase 4: Score Syncing & Leaderboards

### 4.1 Firestore Data Model

```
Firestore Collections:

users/{userId}
  ├── displayName: string
  ├── nickname: string
  ├── avatarEmoji: string
  ├── bio: string
  ├── favoriteGame: string
  ├── totalGamesPlayed: number
  ├── totalScore: number
  ├── memberSince: timestamp
  └── lastActive: timestamp

scores/{autoId}
  ├── userId: string
  ├── gameId: string        (e.g. "muito", "color-tap", "memory-match")
  ├── score: number
  ├── metadata: object      (game-specific: difficulty, moves, time, etc.)
  ├── timestamp: timestamp
  └── userNickname: string  (denormalized for leaderboard queries)

leaderboards/{gameId}
  └── entries[] (top 100, updated via Cloud Function or client-side)
      ├── userId: string
      ├── nickname: string
      ├── avatarEmoji: string
      ├── bestScore: number
      └── updatedAt: timestamp
```

### 4.2 Score Submission Hook

**`src/hooks/useScoreSubmit.ts`**

Each game context calls this after a game ends:
```typescript
const useScoreSubmit = () => {
  const { user } = useAuth();
  const submitScore = async (gameId: string, score: number, metadata?: object) => {
    // 1. Save locally (AsyncStorage — existing behavior preserved)
    // 2. If authenticated (not guest), also push to Firestore
    // 3. Update user's totalGamesPlayed and totalScore
  };
  return { submitScore };
};
```

### 4.3 Integrate Score Submission into Existing Games

Modify each game context to call `submitScore()` at game-end. Games to update:
- `MuitoContext` — score per round
- `ColorTapContext` — best score
- `MemoryMatchContext` — best score per difficulty
- `PetRunnerContext` — distance/score
- `SimonSaysContext` — highest round
- `DressUpRelayContext` — completion score
- `ColorMixerContext` — levels completed
- `FeedThePetContext` — score
- `WhackAMoleContext` — score
- `CatchTheBallContext` — best score
- `SlidingPuzzleContext` — best moves per difficulty

### 4.4 New Screen: LeaderboardScreen

**`src/screens/LeaderboardScreen.tsx`**

- Game selector tabs/dropdown (all registered games)
- Top 100 list with rank, avatar, nickname, score
- Highlight current user's row
- Pull-to-refresh
- "Your Rank" badge at top if user isn't in top 100

### 4.5 New Screen: UserStatsScreen

**`src/screens/UserStatsScreen.tsx`**

Personal stats dashboard:
- Best scores per game (table/cards)
- Games played count per game
- Total play time (if tracked)
- Rank per game
- Recent activity (last 10 scores)
- Progress chart (scores over time, simple line chart)

### 4.6 Navigation for Stats

- Add "Leaderboard" button to `GameSelectionScreen`
- Add "My Stats" link to `ProfileScreen`
- Add post-game "View Leaderboard" button on game-end screens

---

## Phase 5: Guest-to-Account Upgrade Flow

### 5.1 Upgrade Prompt

When a guest user achieves a high score or finishes a game:
- Show a non-intrusive banner: "Create an account to save your score to the leaderboard!"
- Banner links to upgrade flow

### 5.2 Upgrade Flow

**`src/screens/UpgradeAccountScreen.tsx`**

- Same form as RegisterScreen but calls `upgradeAccount()` instead
- Firebase `linkWithCredential()` under the hood — preserves the anonymous UID
- All local data stays intact (same userId)
- After upgrade, automatically sync local scores to Firestore

---

## Implementation Order & Dependencies

```
Phase 1 (Foundation)          ~2-3 days
  1.1 Firebase setup          ← no dependencies
  1.2 DataService layer       ← depends on 1.1
  1.3 AuthContext refactor    ← depends on 1.2
  1.4 UserProfile type        ← depends on 1.2

Phase 2 (Auth Forms)          ~1-2 days
  2.1 RegisterScreen          ← depends on 1.3
  2.2 LoginScreen refactor    ← depends on 1.3
  2.3 ForgotPasswordScreen    ← depends on 1.3
  2.4 Navigation updates      ← depends on 2.1-2.3

Phase 3 (Profile)             ~1-2 days
  3.1 ProfileScreen           ← depends on 1.4, 3.3
  3.2 EditProfileScreen       ← depends on 3.3
  3.3 UserProfileContext      ← depends on 1.2, 1.4
  3.4 Navigation              ← depends on 3.1

Phase 4 (Stats & Leaderboard) ~2-3 days
  4.1 Firestore model         ← depends on 1.1
  4.2 useScoreSubmit hook     ← depends on 1.2, 4.1
  4.3 Game context updates    ← depends on 4.2 (11 files)
  4.4 LeaderboardScreen       ← depends on 4.1
  4.5 UserStatsScreen         ← depends on 4.1, 4.2
  4.6 Navigation              ← depends on 4.4, 4.5

Phase 5 (Guest Upgrade)       ~1 day
  5.1 Upgrade prompts         ← depends on 4.2
  5.2 UpgradeAccountScreen    ← depends on 1.3, 2.1
```

---

## File Change Summary

### New Files (16)
| File | Purpose |
|------|---------|
| `src/services/data/DataService.ts` | Interface definition |
| `src/services/data/FirebaseDataService.ts` | Firebase implementation |
| `src/services/data/LocalDataService.ts` | AsyncStorage fallback |
| `src/services/data/index.ts` | Factory/export |
| `src/config/firebase.config.ts` | Firebase project config |
| `src/context/UserProfileContext.tsx` | Profile state management |
| `src/screens/RegisterScreen.tsx` | Email/password registration |
| `src/screens/ForgotPasswordScreen.tsx` | Password reset |
| `src/screens/ProfileScreen.tsx` | Profile view |
| `src/screens/EditProfileScreen.tsx` | Profile editing |
| `src/screens/LeaderboardScreen.tsx` | Global rankings |
| `src/screens/UserStatsScreen.tsx` | Personal stats dashboard |
| `src/screens/UpgradeAccountScreen.tsx` | Guest → account upgrade |
| `src/hooks/useScoreSubmit.ts` | Score submission hook |
| `android/app/google-services.json` | Firebase Android config |
| `ios/GoogleService-Info.plist` | Firebase iOS config |

### Modified Files (17)
| File | Changes |
|------|---------|
| `package.json` | Add Firebase dependencies |
| `app.config.js` | Firebase plugin config |
| `App.tsx` | New screens in navigator, UserProfileProvider |
| `src/types.ts` | UserProfile, GameScore, LeaderboardEntry types |
| `src/context/AuthContext.tsx` | Use DataService, add register/email-sign-in/reset |
| `src/screens/LoginScreen.tsx` | Add email/password form, navigation links |
| `src/screens/GameSelectionScreen.tsx` | Add profile icon + leaderboard button |
| `src/context/MuitoContext.tsx` | Integrate useScoreSubmit |
| `src/context/ColorTapContext.tsx` | Integrate useScoreSubmit |
| `src/context/MemoryMatchContext.tsx` | Integrate useScoreSubmit |
| `src/context/PetRunnerContext.tsx` | Integrate useScoreSubmit |
| `src/context/SimonSaysContext.tsx` | Integrate useScoreSubmit |
| `src/context/DressUpRelayContext.tsx` | Integrate useScoreSubmit |
| `src/context/ColorMixerContext.tsx` | Integrate useScoreSubmit |
| `src/context/FeedThePetContext.tsx` | Integrate useScoreSubmit |
| `src/context/WhackAMoleContext.tsx` | Integrate useScoreSubmit |
| `src/context/CatchTheBallContext.tsx` | Integrate useScoreSubmit |

---

## Key Architectural Decisions

1. **Firebase Auth handles all auth providers** — Google, email/password, and anonymous (guest) under one system. No custom token management needed.

2. **DataService abstraction** — All Firebase calls go through an interface. This is the single layer you replace when migrating away from Firebase. Screens never import `@react-native-firebase` directly.

3. **Dual persistence** — Scores save locally first (AsyncStorage, existing behavior) and sync to Firestore second. Offline play works exactly as it does today. Sync happens when online.

4. **Denormalized leaderboard** — User nickname/avatar stored alongside scores to avoid extra reads. Updated when profile changes.

5. **Guest upgrade preserves data** — Firebase `linkWithCredential` keeps the same UID, so all local data and scores carry over seamlessly.

6. **Existing backend untouched** — The Fastify server keeps serving the multiplayer Socket.IO game. Firebase handles auth + data. These can merge later when you build a custom backend.
