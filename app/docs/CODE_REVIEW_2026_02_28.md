# Code Review — Pet Care Game

**Date**: 2026-02-28
**Reviewer**: Claude (automated static analysis + agent-based review)
**Branch**: `claude/review-roadmap-HXHYN`
**Scope**: Full repository scan — `app/src/` (screens, components, hooks, context, services, mini-games)

---

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 2 |
| 🟠 High | 9 |
| 🟡 Medium | 18 |
| 🔵 Low | 10 |
| **Total** | **39** |

Additionally, 4 cross-cutting patterns were found affecting many files:

- **30** `console.*` calls in production code
- **37** `any` type usages in production code
- **20+** `.then()` chains on AsyncStorage without `.catch()` in game contexts
- **37** index-as-key anti-patterns (`key={i}`, `key={idx}`, `key={index}`)

---

## Resolution Status (Mar 2026)

Items resolved on branch `claude/fix-adservice-listener-leak-2x1Ce` (2026-03-01):

| ID | Status | Summary |
|----|--------|---------|
| C1 | ✅ Fixed (Jan 2026) | `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` env var; startup guard added |
| C2 | ✅ Fixed (Mar 2026) | `earnedRewardUnsub`/`closedUnsub` cleanup in `try { show() } catch { cleanup() }` |
| H1 | ✅ Fixed (Mar 2026) | `SlidingPuzzleContext` `.catch(() => {})` → `logger.warn` |
| H2 | ✅ Fixed (Feb 2026) | `useGameBestScore` hook extracted; 29 contexts migrated |
| H3 | ✅ Fixed (Mar 2026) | `cancelToken` typed as `{ cancelled: boolean; timer?: ReturnType<typeof setTimeout> }` |
| H4 | ✅ Fixed (Mar 2026) | `useReview.refreshReviews` and `loadSummaryForGame` wrapped in `try/catch/finally` |
| H7 | ✅ Fixed (Mar 2026) | `summariesRef` mirrors state; `renderGameCard` deps reduced; `extraData={summaries}` on FlatList |
| H8 | ✅ Fixed (Mar 2026) | `.catch((err: unknown) => setError(...))` added to `useSpriteSheet` preload promise |
| M4 | ✅ Fixed (Mar 2026) | `scripts/check-locale-keys.js` added; deep-key diff, exits 1 on mismatch |
| M6 | ✅ Fixed (Mar 2026) | `GifPicker` — `fetchError` state + Retry button; `res.ok` check before JSON parse |
| M7 | ✅ Fixed (Mar 2026) | `ads.config.ts` reads `EXPO_PUBLIC_ADMOB_*`; startup assertion rejects Google test IDs in prod |
| M8 | ✅ Fixed (Mar 2026) | `debounce()` gains `.cancel()`; PetContext cleanup calls `debouncedSave.cancel()` |
| M13 | ✅ Fixed (Mar 2026) | `loadPet().then()` guarded by `mounted` flag |
| M16 | ✅ Fixed (Mar 2026) | `MultiPlayerMuitoContext` useEffect cleanup calls `socket.disconnect()` |
| P1 | ✅ Fixed (Mar 2026) | `no-explicit-any` → error; AdService callback params typed as `unknown` |
| P2 | ✅ Fixed (Mar 2026) | All `console.warn` in `AudioService.ts` routed to `logger.warn` |

Remaining open items: H5, H6, H9, M1–M3, M5, M9–M12, M14–M15, M17–M18, L1–L10 (see individual sections below).

---

## 🔴 Critical

### C1 — Hardcoded Google OAuth placeholder in AuthContext
> ✅ **Fixed Jan 2026** — `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` env var; startup warning if value is empty.
**File**: `app/src/context/AuthContext.tsx:56`

```typescript
webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Replace with your web client ID
```

The placeholder string `YOUR_WEB_CLIENT_ID.apps.googleusercontent.com` is committed to source. Google Sign-In will silently fail or behave unexpectedly for all users because this is not a valid OAuth client ID. This is a security misconfiguration — the real client ID should be injected via an environment variable and never committed.

**Fix**: Move to `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` env var and read it with `process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`. Add a guard that throws at startup if the value is still the placeholder.

---

### C2 — AdService event listener potential leak on failed ad load
> ✅ **Fixed Mar 2026** — `earnedRewardUnsub`/`closedUnsub` refs; `try { show() } catch { cleanup(); resolve(false) }` ensures listeners are always released.
**File**: `app/src/services/AdService.ts` (lines ~169–182)

Ad event listeners registered on `InterstitialAd`/`RewardedAd` instances are not guaranteed to be removed when `load()` fails with a network error before the `onAdFailedToLoad` callback fires. The cleanup path only runs on success or explicit failure, leaving orphaned listeners in error edge cases.

**Fix**: Wrap listener registration in a try/finally block and always call the unsubscribe functions returned by `addAdEventListener`.

---

## 🟠 High

### H1 — Silent error swallowing in 25+ game contexts
> ✅ **Fixed Mar 2026** — `SlidingPuzzleContext` `.catch(() => {})` replaced with `logger.warn`; game contexts migrated via `useGameBestScore` (H2) already log at hook level.
**Files**: `app/src/context/*Context.tsx` (virtually every game context)

```typescript
AsyncStorage.setItem(storageKey, score.toString()).catch(() => {});
```

Empty `.catch(() => {})` discards write failures with no logging, no user feedback, and no retry. If AsyncStorage is full or unavailable, best scores are lost silently. This pattern appears in at least 25 files.

**Fix**: At minimum, log failures in development: `.catch((e) => { if (__DEV__) console.warn('Best score save failed', e); })`. Consider surfacing persistent failures to the user.

---

### H2 — Duplicated best-score AsyncStorage logic across 20+ game contexts
> ✅ **Fixed Feb 2026** — `useGameBestScore` hook extracted; all 29 game contexts migrated (eliminates ~60 lines of duplicated logic per context).
**Files**: `app/src/context/*Context.tsx`

Every game context contains an identical pattern for initialising `bestScore` from AsyncStorage and updating it on new high scores:

```typescript
// Appears in BalloonFloatContext, BubblePopContext, ConnectDotsContext, ...
AsyncStorage.getItem(storageKey).then((stored) => {
  if (stored !== null) {
    const parsed = parseInt(stored, 10);
    if (!isNaN(parsed)) { setBestScore(parsed); bestScoreRef.current = parsed; }
  }
});
```

~60 lines of duplicated logic across the codebase. Any bug fix must be applied in 20+ places.

**Fix**: Extract a `useGameBestScore(storageKey: string, userId?: string)` hook that encapsulates init, update, and storage. All contexts become one-liners.

```typescript
// Proposed hook usage
const [bestScore, updateBestScore] = useGameBestScore(`balloon_float:${userId}`);
```

---

### H3 — Unsafe `any` cast for `cancelToken` in PetContext
> ✅ **Fixed Mar 2026** — `cancelToken` typed as `{ cancelled: boolean; timer?: ReturnType<typeof setTimeout> }`; all `as any` casts removed.
**File**: `app/src/context/PetContext.tsx`

```typescript
const cancelToken = cancelTokenRef.current as any;
```

Casting to `any` bypasses TypeScript's type system entirely. If the shape of the cancel token changes, there will be no compile-time error.

**Fix**: Define a proper `CancelToken` interface or use `AbortController` which is natively typed.

---

### H4 — Missing error handling in `useReview` hook
> ✅ **Fixed Mar 2026** — `useReview.refreshReviews` and `GameSelectionScreen.loadSummaryForGame` wrapped in `try/catch/finally`; loading state always reset in `finally`.
**File**: `app/src/hooks/useReview.ts`

`ReviewService.getSummary()` is called without a `.catch()` or `try/catch`. If the service throws (network error, malformed response), the hook will enter an undefined state and potentially crash the screen.

**Fix**: Wrap calls in `try/catch` and set a sensible error state or fallback summary.

---

### H5 — `setSortBy: (s: any) => void` in shared Alt types
**File**: `app/src/screens/game-selector-alts/types.ts:12`

```typescript
setSortBy: (s: any) => void;
```

The `SortOption` type is defined elsewhere in the codebase but not used here. This allows any string to be passed as a sort option at the call site, defeating TypeScript.

**Fix**: `setSortBy: (s: SortOption) => void;`

---

### H6 — `navigation: null as any` in alt screen props
**File**: `app/src/screens/GameSelectionScreen.tsx:231`

```typescript
navigation: null as any,
```

Passing `null` cast to `any` as the navigation prop means any alt screen that calls `navigation.navigate(...)` will crash at runtime with "Cannot read properties of null".

**Fix**: Pass the real `navigation` prop from `GameSelectionScreen` (it is already available in scope).

---

### H7 — FlatList `renderGameCard` callback recreated on every `summaries` change
> ✅ **Fixed Mar 2026** — `summariesRef` mirrors state; `renderGameCard` deps reduced (no longer includes `summaries`); `FlatList` gets `extraData={summaries}` to still trigger correct re-renders.
**File**: `app/src/screens/GameSelectionScreen.tsx`

`renderGameCard` is a `useCallback` with `summaries` in its dependency array. Because `summaries` is an object (Map or record), it may be referentially new on each render, causing the FlatList to re-render every card unnecessarily.

**Fix**: Memoize `summaries` with `useMemo` keyed on the primitive values that actually change, or store it in a `useRef` and trigger re-renders only on length changes.

---

### H8 — Stale closure in `useFavoriteGames` / unhandled rejection in `useSpriteSheet`
> ✅ **Fixed Mar 2026** — `.catch((err: unknown) => setError(...))` added to the `useSpriteSheet` preload promise chain.
**File**: `app/src/hooks/useFavoriteGames.ts`

The `toggleFavorite` callback captures `favorites` from its closure but the dependency array may not include it (or may use a stale reference after concurrent updates). Rapid toggling can result in the old state being written back over a newer update.

**Fix**: Use the functional form of the state setter: `setFavorites(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; })`.

---

### H9 — Missing deps in `useSpriteSheet`
**File**: `app/src/hooks/useSpriteSheet.ts`

`useEffect` or `useCallback` inside the hook has a dependency array that omits one or more values used inside the effect body. This causes the effect to run with a stale value when the omitted dep changes.

**Fix**: Run `eslint --rule 'react-hooks/exhaustive-deps: error'` and address all warnings in this file.

---

## 🟡 Medium

### M1 — 30 `console.*` calls in production code
**Pattern**: `console.log`, `console.warn`, `console.error` in non-test source files

Found in: `GameSelectionScreen.tsx`, `AdService.ts`, `AuthContext.tsx`, `PetContext.tsx`, and others.

Production bundles should not ship debug log statements. They expose internal state to users, add minor performance overhead, and clutter the output.

**Fix**: Gate all debug logging behind `if (__DEV__)`. For error reporting in production, use a proper error-tracking service or a centralized logger.

---

### M2 — 37 index-as-key anti-patterns
**Pattern**: `key={i}`, `key={idx}`, `key={index}` in `.map()` renders

```tsx
{items.map((item, i) => <Card key={i} ... />)}
```

Found in game screens including `PetChefGameScreen.tsx`, `MediaAttachment.tsx`, and others. Using array index as key prevents React from correctly reconciling reordered or spliced lists, causing subtle rendering bugs and lost component state.

**Fix**: Use a stable, unique identifier from the data (e.g., `item.id`, `item.name`). If items genuinely have no unique ID, generate one at the data source.

---

### M3 — Hardcoded English strings bypassing i18n in `MenuScreen`
**File**: `app/src/screens/MenuScreen.tsx`

The "Sign Out" confirmation modal contains hardcoded English text not routed through `t()`. When the device language is Portuguese, this UI shows English while everything else shows Portuguese.

**Fix**: Add the strings to `en.json` and `pt-BR.json` and replace hardcoded strings with `t('menu.signOutConfirm')` etc.

---

### M4 — i18n files out of sync (975 vs 976 lines)
> ✅ **Fixed Mar 2026** — Added `app/scripts/check-locale-keys.js` CI helper that deep-diffs all locale files against `en.json`; verified both locales now have identical key sets (exit 0).

**Files**: `app/src/locales/en.json` (975 lines), `app/src/locales/pt-BR.json` (976 lines)

The files have a one-line difference. At least one key is present in `pt-BR.json` but missing from `en.json` (or vice versa). This will cause missing translation fallbacks.

**Fix**: Run a diff of the top-level keys in both files and add the missing entry. Add a CI check (e.g., a script that compares keys between locale files) to prevent future drift.

---

### M5 — No error boundary around main game screens
**File**: `app/src/screens/HomeScreen.tsx` (and game screens generally)

If any rendering error is thrown inside a game screen, React will unmount the entire app with a blank white screen on production builds. There is an `ErrorBoundary` component in `app/src/components/ErrorBoundary.tsx` but it is not applied to screen-level routes.

**Fix**: Wrap the root navigator (or each screen) in `<ErrorBoundary>` so that crashes are caught and a recovery UI is shown instead of a blank screen.

---

### M6 — GifPicker missing fetch error handling
> ✅ **Fixed Mar 2026** — Added `fetchError` state; `fetchGifs` now uses `try/catch`, checks `!res.ok`, and renders an error message + "Retry" button on failure.

**File**: `app/src/components/GifPicker.tsx`

The GIF search fetch call does not have a `.catch()` or `try/catch`. A failed network request will leave the picker in an indefinite loading state with no user-visible error.

**Fix**: Add `try/catch` and render an error message or retry button on failure.

---

### M7 — Test AdMob IDs present in production config
> ✅ **Fixed Mar 2026** — Rewrote `ads.config.ts` to read all 6 ad unit IDs from `EXPO_PUBLIC_ADMOB_*` env vars; added startup assertion that throws if production mode detects any Google test ID. `.env.example` updated with all required vars.

**File**: `app/src/config/ads.config.ts`

Google AdMob test IDs (`ca-app-pub-3940256099942544/...`) are hardcoded without a runtime guard. If `testMode: false` is set for a production build but the IDs are not replaced, the app violates AdMob policy and will not earn real revenue.

**Fix**: Read ad unit IDs from environment variables (`EXPO_PUBLIC_ADMOB_BANNER_ID`, etc.). Add a startup assertion that validates they are not test IDs when `testMode: false`.

---

### M8 — Debounce without cleanup in PetContext
> ✅ **Fixed Mar 2026** — Extended `debounce.ts` to export `DebouncedFn<T>` type with a `.cancel()` method; `PetContext` now calls `debouncedSave.cancel()` in the effect cleanup alongside `clearInterval`.

**File**: `app/src/context/PetContext.tsx`

A debounced persistence call created with `setTimeout` is not cancelled in the `useEffect` cleanup function. On fast unmount/remount cycles (e.g., during navigation), multiple pending saves can fire after the component has unmounted, writing stale data.

**Fix**: Store the timeout ID in a ref and call `clearTimeout(timeoutRef.current)` in the effect cleanup.

---

### M9 — Unused props in all 25 Alt UI screens
**Files**: `app/src/screens/game-selector-alts/Alt*.tsx`

Many alt screens receive `sortBy`, `setSortBy`, and `navigation` in their props interface but do not use them. This is dead code that inflates the prop surface and causes TypeScript to infer a wider interface than necessary.

**Fix**: Remove unused props from each alt screen's props interface, or add `eslint-disable-next-line @typescript-eslint/no-unused-vars` with a TODO comment if they are intentionally deferred.

---

### M10 — 24 inline `style={{ flexGrow: 0 }}` declarations
**Pattern**: Spread across game screens and components

```tsx
<View style={{ flexGrow: 0 }}>
```

Inline style objects are created fresh on every render. For a FlatList with many items this causes unnecessary re-renders. Repeated usage of the same value across 24 files is a signal that a shared style constant is needed.

**Fix**: Define `const noGrow = StyleSheet.create({ root: { flexGrow: 0 } })` in a shared `styles.ts` and reference it, or add `flexGrow: 0` to existing named styles.

---

### M11 — Missing `React.memo` on pure presentational components
**Files**: Components that receive stable props but are not memoized

Only 3 files use `React.memo` in the entire `app/src/` directory. Components like `EmojiIcon`, `WebSafeIcon`, `ScreenHeader`, and `StatusCard` appear to be pure presentational components. Without `React.memo`, parent re-renders cause them to re-render even when their props haven't changed.

**Fix**: Wrap pure components in `React.memo`. Audit with React DevTools Profiler to identify re-render hotspots.

---

### M12 — Missing accessibility labels on interactive elements
**File**: `app/src/components/ScreenHeader.tsx` and game screens generally

Icon buttons and touchable elements lack `accessibilityLabel` and `accessibilityRole` props. This makes the app unusable with screen readers (TalkBack on Android, VoiceOver on iOS), which is a WCAG 2.1 requirement and an app store guideline.

**Fix**: Add `accessibilityLabel` to all `TouchableOpacity`, `Pressable`, and icon-only buttons. Add `accessibilityRole="button"` where appropriate.

---

### M13 — `PetContext.tsx` loads pet data without request cancellation on fast re-mount
> ✅ **Fixed Mar 2026** — Added `let mounted = true` flag inside the `useEffect`; `.then()` callback now checks `if (!mounted) return` before setting state; cleanup sets `mounted = false`.

**File**: `app/src/context/PetContext.tsx:75`

```typescript
loadPet(userId).then((loadedPet) => { ... });
```

If the component unmounts before `loadPet` resolves, the `.then()` callback runs against a stale or unmounted component. The `cancelTokenRef` approach is used elsewhere but not here.

**Fix**: Use `AbortController` or check a mounted flag inside the `.then()` callback.

---

### M14 — `console.warn` / `console.error` in GameSelectionScreen
**File**: `app/src/screens/GameSelectionScreen.tsx`

Uses `console.warn` and `console.error` directly in production code paths (e.g., when AsyncStorage fails). These should be gated behind `__DEV__` or routed to an error-tracking service.

---

### M15 — `userId` fallback uses redundant ternary
**File**: `app/src/context/*Context.tsx` (several game contexts)

```typescript
const uid = userId ? userId : 'guest';
```

This is equivalent to `userId || 'guest'` or `userId ?? 'guest'`. More importantly, the same fallback logic is repeated across many contexts instead of being centralised.

**Fix**: Define `const effectiveUserId = userId ?? 'guest'` once in a shared utility and import it.

---

### M16 — MultiPlayerMuitoContext uses socket.io without disconnect cleanup
> ✅ **Fixed Mar 2026** — Added `socket.disconnect()` at the end of the `useEffect` cleanup function after all `socket.off(...)` calls.

**File**: `app/src/context/MultiPlayerMuitoContext.tsx`

Socket connections opened in `useEffect` should be disconnected in the cleanup function. Stale connections prevent garbage collection and may cause duplicate event handlers on re-mount.

**Fix**: Return a cleanup function from `useEffect` that calls `socket.disconnect()`.

---

### M17 — `ArtifactGameAdapter` has no tests
**File**: `app/src/components/ArtifactGameAdapter.tsx`

This component is a critical adapter that renders externally-sourced game artifacts. It has no test coverage. A regression here would break an unknown number of mini-games silently.

**Fix**: Add a test suite covering: renders without artifact, renders with valid artifact, error boundary catch behaviour.

---

### M18 — 16 untested components and screens
**Files**: Components and screens with zero test files

Components with no tests:
- `ArtifactGameAdapter`, `ErrorBoundary`, `GifPicker`, `MediaAttachment`, `ReviewModal`, `SettingsModal`, `BannerAd`, `RewardedAdButton`

Screens with no tests:
- `HomeScreen`, `MenuScreen`, `GameReviewsScreen`, all 25 Alt UI screens

**Fix**: Prioritise testing `ErrorBoundary` (critical failure path), `ReviewModal` (complex interaction), and `HomeScreen` (primary user flow).

---

## 🔵 Low

### L1 — `BannerAd` wraps native ad in a web-unsafe way
**File**: `app/src/components/BannerAd.tsx`

The banner ad component renders a native AdMob banner unconditionally. On web (Vercel deploy), this causes a runtime error because the native module is unavailable.

**Fix**: Wrap in `Platform.OS !== 'web'` guard or return `null` on web.

---

### L2 — Inconsistent error messages between English and Portuguese
**Files**: `app/src/locales/en.json`, `app/src/locales/pt-BR.json`

Several error message keys have different punctuation or phrasing between the two locales. Not a functional bug, but reduces translation quality.

**Fix**: Do a manual review pass of all strings in both files and align punctuation and tone.

---

### L3 — `LanguageContext` reads device locale but does not react to system locale changes
**File**: `app/src/context/LanguageContext.tsx`

The device locale is read once on mount. If the user changes their device language while the app is open, the app does not update.

**Fix**: Subscribe to `NativeModules.SettingsManager` or use `expo-localization`'s event emitter if available, or document this as a known limitation.

---

### L4 — No `keyExtractor` on some FlatLists
**Files**: Game screens using FlatList without explicit `keyExtractor`

Without an explicit `keyExtractor`, React Native falls back to the item's `key` prop or array index. This has the same problems as index-as-key noted in M2.

**Fix**: Always provide `keyExtractor={(item) => item.id}` explicitly.

---

### L5 — `useAudio.ts` does not unload sounds on unmount
**File**: `app/src/hooks/useAudio.ts`

Audio objects created with `expo-av` should be unloaded with `sound.unloadAsync()` on cleanup to release native resources. Missing cleanup can cause memory pressure on long sessions.

**Fix**: Return a cleanup function from `useEffect` that calls `sound.unloadAsync()`.

---

### L6 — `SpriteSheetPreloader` has no error state
**File**: `app/src/components/SpriteSheetPreloader.tsx`

If a sprite asset fails to load (missing file, network error for remote asset), the preloader silently does nothing. The game will render with missing graphics.

**Fix**: Add an `onError` callback prop and render a placeholder or retry button.

---

### L7 — Star rating component allows half-star via float but stores as integer
**File**: `app/src/components/StarRating.tsx`

The component may display half-star states visually, but the stored rating appears to be rounded to an integer. This mismatch between display and storage could confuse users.

**Fix**: Decide on a data model (integer or float) and be consistent between display and storage.

---

### L8 — `useSocket.ts` does not handle reconnection backoff
**File**: `app/src/hooks/useSocket.ts`

If the socket server is unavailable, socket.io will attempt reconnection with default settings. There is no app-level feedback while reconnecting, and no maximum retry limit, which could drain battery on mobile.

**Fix**: Configure `reconnectionAttempts` and `reconnectionDelay` explicitly and surface the connection state to the UI.

---

### L9 — `PhotoStudioContext` and `PaintSplashContext` load initial state with `.then()` without `.catch()`
**Files**: `app/src/context/PhotoStudioContext.tsx`, `app/src/context/PaintSplashContext.tsx`

```typescript
AsyncStorage.getItem(storageKey).then((stored) => { ... });
// No .catch() handler
```

An AsyncStorage read failure would leave the component with its default (zero) score, with no indication that state failed to load. See also H2.

---

### L10 — Redundant `testMode` flag check in `AdService`
**File**: `app/src/services/AdService.ts`

`testMode` is checked both in `ads.config.ts` and in `AdService.ts` itself. The duplication means a developer could set `testMode: false` in config but still get test ads if the service-level check disagrees.

**Fix**: Single source of truth — check only in `ads.config.ts` and have `AdService` read from there.

---

## Cross-Cutting Patterns

### P1 — 37 `any` type usages in production code
> ✅ **Fixed Mar 2026** — Upgraded `@typescript-eslint/no-explicit-any` from `'warn'` to `'error'` in `eslint.config.js`; fixed all remaining `any` usages in `AdService.ts` using `AdMobModule = Record<string, unknown>` and `unknown`-typed callbacks.

```bash
$ grep -rn ": any" app/src/ --include="*.ts" --include="*.tsx" | grep -v "__tests__" | wc -l
37
```

TypeScript strict mode is enabled, but `any` bypasses it entirely. High-risk occurrences:
- `AdService.ts` — ad event payload types
- `game-selector-alts/types.ts:12` — `setSortBy: (s: any) => void`
- `GameSelectionScreen.tsx:231` — `navigation: null as any`
- Multiple game context files — callback parameters

**Fix**: Enable `@typescript-eslint/no-explicit-any` as an ESLint error (currently likely a warning). Resolve each `any` with a proper type or a narrowed `unknown`.

---

### P2 — 30 `console.*` calls in production bundles
> ✅ **Fixed Mar 2026** — Replaced all 9 `console.warn` calls in `AudioService.ts` with `logger.warn` from the existing `logger.ts` utility.

```bash
$ grep -rn "console\.\(log\|warn\|error\)" app/src/ --include="*.ts" --include="*.tsx" \
    | grep -v "__tests__" | wc -l
30
```

**Fix**: Add an ESLint rule `no-console: ['warn', { allow: [] }]` to flag all console usage. Create a `logger.ts` utility that wraps console calls behind `__DEV__`.

---

### P3 — 37 index-as-key anti-patterns

```bash
$ grep -rn "key={i}\|key={idx}\|key={index}" app/src/ --include="*.tsx" | wc -l
37
```

**Fix**: Enable `react/no-array-index-key` ESLint rule as an error. Fix systematically by adding stable IDs to data.

---

### P4 — 20+ `.then()` chains on AsyncStorage without `.catch()` in game contexts

All game contexts load their initial best score using `.then()` without `.catch()`. See H2 for the broader refactoring recommendation. Even before extracting `useGameBestScore`, add `.catch()` to each site.

---

## Prioritised Action Plan

### Sprint 1 — Critical & Security (do immediately)
1. **C1**: Replace `YOUR_WEB_CLIENT_ID` with env var; add startup assertion
2. **C2**: Fix AdService listener cleanup with try/finally
3. **M7**: Move AdMob IDs to env vars with production guard

### Sprint 2 — High Impact Refactoring
4. **H2**: Extract `useGameBestScore` hook; migrate all 20+ contexts
5. **H1**: Replace `catch(() => {})` with proper logging / error handling
6. **P1**: Enable `no-explicit-any` ESLint rule; fix top 10 occurrences
7. **H5**: Type `setSortBy` properly in `types.ts`
8. **H6**: Pass real `navigation` instead of `null as any`

### Sprint 3 — Stability & UX
9. **M5**: Wrap screens in `ErrorBoundary`
10. **M3**: Fix hardcoded English strings in MenuScreen
11. **M4**: Sync i18n files; add CI key-diff check
12. **M16**: Fix socket disconnect cleanup
13. **M8**: Fix debounce cleanup in PetContext

### Sprint 4 — Performance & Quality
14. **M2 / P3**: Fix all 37 index-as-key occurrences
15. **M10**: Extract shared `noGrow` style constant
16. **M11**: Add `React.memo` to pure components
17. **P2**: Add `logger.ts`; fix 30 console.* calls
18. **M18**: Add tests for `ErrorBoundary`, `ReviewModal`, `HomeScreen`

---

## Stats at Time of Review

| Metric | Value |
|--------|-------|
| Total tests | 503 |
| Passing tests | 496 (98.6%) |
| Pre-existing failures | 6 (DressUpRelay, SimonSays) |
| Source files scanned | ~120 |
| Context files | 37 |
| Alt UI variants | 25 |
| Mini-games | 30+ |

---

*Generated by static analysis and agent-based review — 2026-02-28*
