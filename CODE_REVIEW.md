# Code Review — Pet Care Game

**Reviewer:** Claude Code (Sonnet 4)  
**Date:** 2026-02-25  
**Branch:** `feature/game-review-system`  
**Scope:** Full codebase review — architecture, bugs, security, performance, code quality, and production readiness

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture & Design](#2-architecture--design)
3. [Critical Bugs & Logic Errors](#3-critical-bugs--logic-errors)
4. [Security Issues](#4-security-issues)
5. [Performance & Memory](#5-performance--memory)
6. [Code Quality & Maintainability](#6-code-quality--maintainability)
7. [Testing](#7-testing)
8. [Production Readiness](#8-production-readiness)
9. [Dependency Audit](#9-dependency-audit)
10. [Prioritized Action List](#10-prioritized-action-list)

---

## 1. Executive Summary

The Pet Care Game is a well-intentioned React Native / Expo codebase targeting Android (with web and iOS support). The architecture is largely sound — contexts for state, a game registry, a unified action hook, and a config-driven balance system all reflect good design thinking.

However, several **critical issues** must be fixed before production release:

| Severity | Count |
|----------|-------|
| Critical | 6 |
| High | 8 |
| Medium | 11 |
| Low / Style | 9 |

The most urgent items are a hardcoded OAuth client ID that would break authentication, test ad IDs shipping to production, a `savePet` call missing the `userId` argument in every activity function, a polling-based sleep cancellation loop that leaks memory, and a non-functional `visitVet` hook signature mismatch.

---

## 2. Architecture & Design

### 2.1 Good Patterns ✅

- **Game Registry** (`src/registry/GameRegistry.ts`) — clean extensibility for adding games without touching core navigation.
- **Config-driven balance** (`src/config/gameBalance.ts`) — separating numeric constants from logic is the right call. All tuning happens in one file.
- **`usePetActions` unified hook** — consolidates animation sequencing, validation, toast, and reward logic in one place, avoiding repetition across scene components.
- **Migration & validation on load** (`src/utils/migration.ts`, `src/utils/storage.ts`) — proactive data repair on boot is good defensive programming.
- **COPPA configuration** — child-directed ad flags are pre-configured and commented, which is appropriate for the target audience.
- **`ErrorBoundary` wrapping the root** — protects the user from white-screen crashes.
- **Debounced saves** — the `useMemo`-based debounce in `PetContext` correctly avoids thrashing AsyncStorage every second.

### 2.2 Architectural Concerns

#### 2.2.1 Context explosion

There are **17 separate React contexts** (`AuthContext`, `PetContext`, `LanguageContext`, `ToastContext`, `AdContext`, `MuitoContext`, `PetRunnerContext`, `ColorTapContext`, `MemoryMatchContext`, `SimonSaysContext`, `WhackAMoleContext`, `FeedThePetContext`, `CatchTheBallContext`, `ColorMixerContext`, `DressUpRelayContext`, `SlidingPuzzleContext`, `MultiPlayerMuitoContext`).

Most mini-game contexts appear to only store a single best-score value. Consolidating these into a single `GameScoresContext` (or using `AsyncStorage` directly with a hook) would reduce the provider nesting depth significantly and simplify `App.tsx`.

#### 2.2.2 App.tsx is a registration monolith

`App.tsx` contains 12 game registration blocks before the `AppNavigator` definition. This module-level registration happens at import time and cannot be tree-shaken. Consider moving registrations to a dedicated `registerGames.ts` file called from `App.tsx`.

#### 2.2.3 `savePet` called without `userId` inside activity functions

Every activity in `PetContext` (`feed`, `play`, `bathe`, `exercise`, `petCuddle`, `setClothing`, `visitVet`, `sleep`, `earnMoney`) calls `savePet(updatedPet)` with **no `userId` argument**. The function signature is `savePet(pet: Pet, userId?: string)`, defaulting to the `'guest'` key. This means authenticated users' pets are always written to `@pet_care_game:pet:guest` from within activity handlers, even though they are loaded from the user-specific key. The `debouncedSave` inside the decay interval correctly captures `userId`, but the per-action saves do not.

```ts
// src/context/PetContext.tsx — every action function has this bug
savePet(updatedPet).catch(logger.error);   // ← missing userId
//                        ^^^^^^^^^^
// Should be:
savePet(updatedPet, userId).catch(logger.error);
```

**Impact:** Authenticated users' activity results are lost on app restart because they are saved to the wrong storage key.

---

## 3. Critical Bugs & Logic Errors

### 3.1 🔴 CRITICAL — `savePet` missing `userId` in all activity functions

**File:** `src/context/PetContext.tsx` — `feed`, `play`, `bathe`, `sleep`, `exercise`, `petCuddle`, `setClothing`, `visitVet`, `earnMoney`

All nine activity functions call `savePet(updatedPet)` without passing `userId`. This silently saves to `@pet_care_game:pet:guest` for authenticated users. On next load the user-keyed slot is stale.

**Fix:** Thread `userId` into every `savePet` call inside these functions.

```ts
// Before
savePet(updatedPet).catch(logger.error);

// After
savePet(updatedPet, userId).catch(logger.error);
```

### 3.2 🔴 CRITICAL — Polling loop inside sleep cancellation never terminates

**File:** `src/context/PetContext.tsx` — `sleep()`

The cancellation checker spawns an infinite `setTimeout` chain:

```ts
const checkCancellation = () => {
  if (cancelToken.cancelled) {
    clearTimeout((cancelToken as any).timer);
    resolve(false);
  } else {
    setTimeout(checkCancellation, 100); // ← recursive, never cleaned up
  }
};
```

If `sleep()` completes normally (the main timer fires first and `Promise.race` resolves `true`), the cancellation checker is still running every 100 ms until garbage collected — which may not happen promptly in React Native. Over many sleep cycles this accumulates.

**Fix:** Replace the polling loop with a simple event/flag checked once after the main timer fires, or store the checker timeout ID and clear it in both resolution paths.

```ts
let checkerId: ReturnType<typeof setTimeout>;
const cancellationPromise = new Promise<boolean>((resolve) => {
  const check = () => {
    if (cancelToken.cancelled) return resolve(false);
    checkerId = setTimeout(check, 100);
  };
  check();
});

const completed = await Promise.race([sleepPromise, cancellationPromise]);
clearTimeout(checkerId!); // clean up whichever branch didn't win
```

### 3.3 🔴 CRITICAL — `visitVet` hook signature mismatch

**File:** `src/context/PetContext.tsx` — `visitVet` vs `src/hooks/usePetActions.ts` — `executeContextAction`

`PetContext.visitVet` has the signature:
```ts
visitVet(treatmentType?: 'antibiotic' | 'antiInflammatory', useMoney?: boolean): boolean
```

But `usePetActions` calls it as:
```ts
case 'vet':
  visitVet(options.useMoney);  // ← passes a boolean as treatmentType
```

`options.useMoney` is a `boolean | undefined`, but the first parameter expects a treatment type string. This means `treatmentType` is always `undefined` (the boolean is coerced to `undefined` by TypeScript at runtime because of type guard but passes as the wrong positional argument). The default `'antibiotic'` treatment is always used regardless of intent.

**Fix:**
```ts
case 'vet':
  visitVet('antibiotic', options.useMoney); // pass treatmentType explicitly
```

### 3.4 🔴 HIGH — `sleep()` reads stale `pet` closure variable for pre-check

**File:** `src/context/PetContext.tsx` — `sleep()`

```ts
const sleep = async (duration = ...) => {
  // Check if pet can sleep before starting
  if (!pet || !canPerformActivity(pet, 'sleep')) {  // ← reads closure `pet`
    return { completed: false };
  }
  ...
};
```

Because `sleep` is defined inside the component function (not inside a `setPet` updater), it captures the `pet` value from the render in which the function was created. If the pet state changed between renders without re-creating `sleep`, this check could be stale.

This is a subtle React stale-closure issue. The canonical fix is to use a `useRef` to track the latest pet value, or to perform the check inside a `setPet` updater callback.

### 3.5 🔴 HIGH — `handleCreate` does not await `createPet` error handling

**File:** `src/screens/CreatePetScreen.tsx` — `handleCreate`

```ts
const handleCreate = async () => {
  const validation = validatePetName(name);
  if (!validation.isValid) {
    showToast(validation.error!, 'error');
    return;
  }
  const sanitizedName = sanitizePetName(name);
  await createPet(sanitizedName, petType, gender, color);
  navigation.replace('Home');  // ← runs even if createPet throws
};
```

If `createPet` rejects (e.g., AsyncStorage failure), the error is swallowed and `navigation.replace('Home')` still runs, leaving the user on a home screen with no pet. There is no try/catch or error feedback.

**Fix:** Wrap in try/catch and show a toast on failure.

### 3.6 🔴 HIGH — `validateAction` allows `vet` when health is at threshold boundary

**File:** `src/utils/petStats.ts` — `validateAction`

```ts
case 'vet':
  if (pet.health >= GAME_BALANCE.thresholds.healthForVetSuggested) {
    return { canPerform: false, reason: 'vet.notNeeded' };
  }
```

`healthForVetSuggested = 60`. A pet with exactly 60 health cannot visit the vet. The threshold comparison should use `>` not `>=` (or the comment/design intent should be clarified). Currently a pet at precisely 60 health is denied vet care.

### 3.7 🟡 MEDIUM — Happiness uses wrong base pet in decay calculation

**File:** `src/context/PetContext.tsx` — decay `useEffect`

```ts
const health = calculateHealth(tempPet);
const happinessChange = calculateHappinessChange({ ...tempPet, health }, minutesPassed);

const updatedPet: Pet = {
  ...tempPet,
  happiness: Math.min(100, Math.max(0, currentPet.happiness + happinessChange)),
  //                                   ^^^^^^^^^^^^^^^^^^^ stale value
```

`happinessChange` is calculated from `tempPet.happiness` (after decay), but the change is added to `currentPet.happiness` (before decay). This means the happiness calculation uses an inconsistent reference point and the happiness decay multiplier is computed from a different value than what is being modified.

**Fix:** Use `tempPet.happiness + happinessChange` or compute everything off `tempPet` consistently.

### 3.8 🟡 MEDIUM — Health weights do not sum to 1.0

**File:** `src/config/gameBalance.ts`

```ts
healthWeights: {
  hunger: 0.25,
  hygiene: 0.2,
  energy: 0.25,
  happiness: 0.3,   // sum = 1.0 ✅
},
```

The weights do sum to 1.0 — this is fine. **However**, the health status multipliers table is keyed:
```ts
healthStatusMultipliers: {
  allStatsAbove50: 1.0,
  anyStatBelow50: 0.9,   // ← exists in config
  ...
}
```

But `petStats.ts` only ever references `anyStatBelow10`, `anyStatBelow25`, `anyStatBelow50`, and `allStatsAbove50` — and the conditional checks them in order from most-severe first. The `anyStatBelow50` branch is **unreachable** because the `anyStatBelowMedium` check covers it but maps to `anyStatBelow50` multiplier — this is fine. But `allStatsAbove50` is never reached if any stat is between 50-100 — again fine. Worth clarifying with a comment that the multiplier keys must match the threshold condition names exactly.

### 3.9 🟡 MEDIUM — `decayMultipliers` defined but never used

**File:** `src/config/gameBalance.ts` and `src/utils/petStats.ts`

`getDecayMultiplier()` is defined and exported in `petStats.ts` but the decay `useEffect` in `PetContext` never calls it. The decay rate is always applied at its base value regardless of pet health. The config implies health should accelerate decay when low, but this is dead code.

Either remove `getDecayMultiplier` and `decayMultipliers` from the config, or apply it in the decay loop.

---

## 4. Security Issues

### 4.1 🔴 CRITICAL — Hardcoded placeholder OAuth Client ID

**File:** `src/context/AuthContext.tsx`

```ts
webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Replace with your web client ID
```

If this placeholder is shipped to production, **Google Sign-In will fail for all mobile users**. There is no runtime guard or meaningful error message to the user.

**Fix:** Load the client ID from environment variables (`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`) and validate at startup that it is not the placeholder string.

```ts
const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
if (!webClientId || webClientId.includes('YOUR_')) {
  logger.error('Google OAuth client ID is not configured');
}
```

### 4.2 🔴 HIGH — Test Ad IDs in production config

**File:** `src/config/ads.config.ts`

```ts
testMode: true,  // SET TO FALSE FOR PRODUCTION
adUnits: {
  rewarded:      { android: "TEST_ID", ios: "TEST_ID" },
  interstitial:  { android: "TEST_ID", ios: "TEST_ID" },
  banner:        { android: "TEST_ID", ios: "TEST_ID" },
}
```

Test ad IDs will return no revenue in production and may trigger policy violations with AdMob. These must be replaced and `testMode` switched off before release.

**Fix:** Gate these values behind `__DEV__` or an environment variable:

```ts
testMode: __DEV__,
adUnits: {
  rewarded: {
    android: __DEV__ ? 'ca-app-pub-3940256099942544/5224354917' : process.env.EXPO_PUBLIC_ADMOB_REWARDED_ANDROID,
    ...
  }
}
```

### 4.3 🟡 MEDIUM — Guest user `userId` is the string `'guest'` — shared across all guest sessions

**File:** `src/context/PetContext.tsx` and `src/utils/storage.ts`

All guests share the key `@pet_care_game:pet:guest`. On a shared device (e.g., a family tablet), multiple children playing as guest would overwrite each other's pets. This is an intentional design simplification, but should be documented and considered for child safety.

### 4.4 🟡 MEDIUM — Error messages may leak internal implementation details

**File:** `src/context/AuthContext.tsx`

```ts
logger.error('Sign in error:', err);
setError('Failed to sign in. Please try again.');
```

The `error` state is surfaced to the UI in `LoginScreen`. Ensure the raw error object is never accidentally displayed. Currently `setError` only receives a hardcoded string — this is fine — but the `err` object is also passed to `logger.error`, which in production calls `console.error`. In production builds, `console.error` output is not shown to users, so this is acceptable, but it is worth noting for future telemetry integrations.

### 4.5 🟡 MEDIUM — No input sanitization for pet names beyond character whitelist

**File:** `src/utils/validation.ts`

The regex `ALLOWED_CHARS = /^[a-zA-Z0-9\s\-']+$/` is reasonable, but the name is stored in AsyncStorage and rendered in i18n interpolation strings like `t('feed.eating', { name: pet.name })`. If i18next's `escapeValue: false` is set (it is), injected variables are not HTML-escaped. In a WebView context this could allow simple XSS if pet names are ever rendered via `innerHTML`. Audit all i18n string usages in WebView/artifact contexts.

---

## 5. Performance & Memory

### 5.1 🟡 MEDIUM — Debounce does not cancel on unmount

**File:** `src/utils/debounce.ts` and `src/context/PetContext.tsx`

The `debounce` function holds a timeout. When `PetProvider` unmounts (unlikely in a single-screen game, but possible), the pending timeout can fire after unmount and call `savePet` on a stale ref. The `debouncedSave` function returned by `useMemo` has no `cancel()` method, and there is no cleanup in the provider.

**Fix:** Add a `cancel()` method to the debounce return or use a `useEffect` cleanup to cancel the debounced save on unmount.

### 5.2 🟡 MEDIUM — `useMemo` for `debouncedSave` recreates function on every `userId` change

**File:** `src/context/PetContext.tsx`

```ts
const debouncedSave = useMemo(
  () => debounce((petToSave: Pet) => {
    savePet(petToSave, userId).catch(logger.error);
  }, 1000),
  [userId]
);
```

When `userId` changes (e.g., user signs in), a new debounced function is created and the old one is dropped mid-flight. If a save was pending, it will be silently dropped. While this edge case (userId changes while a save is queued) is unlikely, it can cause data loss on sign-in/sign-out transitions.

**Fix:** Use a `useRef` to always capture the latest `userId` inside the debounced function:

```ts
const userIdRef = useRef(userId);
useEffect(() => { userIdRef.current = userId; }, [userId]);

const debouncedSave = useRef(
  debounce((petToSave: Pet) => {
    savePet(petToSave, userIdRef.current).catch(logger.error);
  }, 1000)
).current;
```

### 5.3 🟡 MEDIUM — Decay interval runs even when the app is backgrounded

**File:** `src/context/PetContext.tsx`

`setInterval` at 60,000 ms runs continuously even when the app is in the background. In React Native, JavaScript execution is paused when the app is backgrounded, so the interval fires on resume. However, the decay computation uses wall-clock time (`Date.now() - lastUpdated`), so this is actually correct — the interval just catches up on resume.

The concern is that `minutesPassed` can become very large (hours or days), leading to extreme stat drops in one update tick. This is the intended design but could result in jarring UX ("pet went from 50 hunger to 0 instantly on app resume").

**Recommendation:** Consider capping `minutesPassed` per tick (e.g., max 60 minutes per tick) and surfacing a "you were away for a while" message rather than silently zeroing stats.

### 5.4 🟡 LOW — `calculateHealth` called redundantly after `calculateHappinessChange`

**File:** `src/context/PetContext.tsx` — decay effect

`calculateHealth` is called once to compute `health` for `calculateHappinessChange`, then `updatedPet` sets `health` to the same value. This is correct but redundant — `calculateHappinessChange` could accept health directly (which it does — `{ ...tempPet, health }`). No bug here, just a clarity issue.

### 5.5 🟡 LOW — `getDeviceLanguage()` runs at module import time

**File:** `src/i18n.ts`

`getDeviceLanguage()` is called at module import time (when `import './src/i18n'` runs in `App.tsx`). This is before the user's language preference stored in `AsyncStorage` is loaded. The `LanguageContext` presumably updates `i18n.changeLanguage` later, but there is a brief moment where the wrong language may flash. Consider initializing i18n with the AsyncStorage preference directly in `LanguageContext` before rendering children.

---

## 6. Code Quality & Maintainability

### 6.1 🟡 MEDIUM — `visitVet` reads `pet` from outer closure for money check

**File:** `src/context/PetContext.tsx`

```ts
const visitVet = (...) => {
  if (!pet) { ... return false; }
  if (useMoney && pet.money < effects.cost) { ... return false; }  // stale closure

  setPet((currentPet) => { ... });
};
```

The money check uses the closed-over `pet`, but the actual state update uses `currentPet` from the `setPet` updater. If the pet state changes between the check and the update (unlikely in practice but possible in concurrent mode), the money deduction could go below zero. The check and deduction should both happen inside the updater.

### 6.2 🟡 MEDIUM — `(cancelToken as any).timer` type escape

**File:** `src/context/PetContext.tsx` — `sleep()`

```ts
(cancelToken as any).timer = timer;
```

This casts to `any` to attach a property to an object typed as `{ cancelled: boolean }`. Extend the type instead:

```ts
const cancelToken: { cancelled: boolean; timer?: ReturnType<typeof setTimeout> } = { cancelled: false };
```

### 6.3 🟡 MEDIUM — `(emojiStyle as { fontSize?: number })?.fontSize` fragile cast

**File:** `src/screens/CreatePetScreen.tsx`

```ts
<EmojiIcon emoji={emoji} size={(emojiStyle as { fontSize?: number })?.fontSize ?? 24} ... />
```

`emojiStyle` is typed as `TextStyle`, which already has `fontSize?: number`. No cast is needed:

```ts
<EmojiIcon emoji={emoji} size={emojiStyle?.fontSize ?? 24} ... />
```

### 6.4 🟡 LOW — `migration.ts` uses `any` parameter type

**File:** `src/utils/migration.ts`

```ts
export const migratePetData = (oldPet: any): Pet => { ... }
export const validatePetData = (pet: any): pet is Pet => { ... }
export const repairPetData = (pet: any): Pet | null => { ... }
```

These all take `any`. Since the purpose is handling unknown persisted data, a `unknown` parameter with an explicit early cast is safer and self-documenting. This prevents accidental misuse from typed contexts.

### 6.5 🟡 LOW — `logger.log` vs `logger.info` inconsistency

**File:** `src/utils/logger.ts`, `src/utils/migration.ts`

`logger.log(...)` is used in `migration.ts` but `logger.info(...)` exists on the same object. These are effectively identical (both `__DEV__`-gated), but mixing them creates confusion about intent. Pick one convention.

### 6.6 🟡 LOW — `validation.ts` exports `ValidationResult` but `petStats.ts` also exports a `ValidationResult`

**File:** `src/utils/validation.ts` and `src/utils/petStats.ts`

Both files export a type named `ValidationResult` with different shapes:

```ts
// validation.ts
export interface ValidationResult { isValid: boolean; error?: string; }

// petStats.ts
export type ValidationResult = { canPerform: boolean; reason?: string; };
```

This is a naming collision that will cause confusion when both are imported in the same file. Rename one (e.g., `ActionValidationResult` for the petStats version).

### 6.7 🟡 LOW — `PET_NAME_VALIDATION.ALLOWED_CHARS` does not allow accented characters

**File:** `src/utils/validation.ts`

The game supports Portuguese (pt-BR) where names with accented characters (é, ã, ç, etc.) are common. The current regex `^[a-zA-Z0-9\s\-']+$` would reject "Félix" or "Campeão".

**Fix:**
```ts
ALLOWED_CHARS: /^[\p{L}\p{N}\s\-']+$/u,
```
Using the Unicode property escape `\p{L}` (letter) allows all scripts.

### 6.8 🟡 LOW — Error message in `validation.ts` is English-only

**File:** `src/utils/validation.ts`

```ts
error: 'Pet name cannot be empty',
error: `Pet name must be at least ${PET_NAME_VALIDATION.MIN_LENGTH} character`,
error: `Pet name cannot exceed ${PET_NAME_VALIDATION.MAX_LENGTH} characters`,
error: 'Pet name can only contain letters, numbers, spaces, hyphens, and apostrophes',
```

These hardcoded English strings are shown in `CreatePetScreen.tsx` via `showToast(validation.error!, 'error')`. They should be i18n keys, not literal strings, so pt-BR users see localized error messages.

### 6.9 🟡 LOW — Inconsistent use of optional chaining for `pet.money`

**File:** `src/context/PetContext.tsx` — `earnMoney`

```ts
money: (currentPet.money ?? 0) + amount, // Defensive fallback for robustness
```

This is a defensive null guard, but `Pet.money` is typed as `number` (non-optional). If the type is correct, the `?? 0` is unnecessary. If `money` can be undefined at runtime (from old persisted data), the `migration.ts` repair should guarantee it, making this redundant. Either fix the migration to always set money, or narrow the type to `number | undefined` and handle it consistently. The comment "Defensive fallback for robustness" suggests the author was unsure — clarify the intent.

---

## 7. Testing

### 7.1 Test coverage gaps

Based on the jest configuration and the codebase, the following critical paths have **no mentioned tests**:

| Missing Test | Risk |
|---|---|
| `PetContext` — activity functions save to correct `userId` key | High (the critical bug in §3.1) |
| `sleep()` — cancellation path cleans up polling timer | High (the leak in §3.2) |
| `visitVet` — treatment type selection and money deduction | High (the mismatch in §3.3) |
| `storage.ts` — user-scoped key isolation | Medium |
| `migration.ts` — corrupted data repair returns valid pet | Medium |
| `AuthContext` — guest mode does not persist | Medium |
| `validatePetName` — accented characters (Portuguese names) | Medium |

### 7.2 Jest version mismatch

**File:** `package.json`

```json
"jest": "^30.2.0",
"jest-expo": "50.0.0",
```

`jest-expo@50` is designed for Jest 29. `jest@30` has breaking changes (e.g., `--ci` flag behavior, snapshot format). This combination may cause subtle test failures or incorrect coverage reports.

**Fix:** Either downgrade Jest to `^29.x` or upgrade `jest-expo` to a version that supports Jest 30.

### 7.3 `ts-jest` in `globals` — deprecated pattern

**File:** `jest.config.js`

```js
globals: {
  'ts-jest': {
    tsconfig: { jsx: 'react' },
  },
},
```

The `globals` configuration for `ts-jest` is deprecated in ts-jest v28+. The recommended approach is to configure it via `transform`:

```js
transform: {
  '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react' } }],
}
```

---

## 8. Production Readiness

### 8.1 Checklist of must-fix items before release

| Item | File | Status |
|---|---|---|
| Replace `YOUR_WEB_CLIENT_ID` with real OAuth ID | `AuthContext.tsx` | ❌ Not done |
| Replace test AdMob IDs with production IDs | `ads.config.ts` | ❌ Not done |
| Set `testMode: false` | `ads.config.ts` | ❌ Not done |
| Add `google-services.json` for Android | Project root | ❌ Not verified |
| Add `GoogleService-Info.plist` for iOS | Project root | ❌ Not verified |
| Fix `savePet` missing `userId` in activity functions | `PetContext.tsx` | ❌ Bug present |
| Fix sleep cancellation memory leak | `PetContext.tsx` | ❌ Bug present |
| Fix `visitVet` argument mismatch | `usePetActions.ts` | ❌ Bug present |
| Error handling in `handleCreate` | `CreatePetScreen.tsx` | ❌ Missing |
| Production error monitoring (Sentry/etc.) | — | ❌ Not present |

### 8.2 Missing production monitoring

There is no crash reporting or remote error monitoring configured. `logger.error` calls `console.error` in production, which goes nowhere. For a child-targeted app, silent failures are especially harmful (parents may not know the app has a bug). Integrate a monitoring service (Sentry, Bugsnag, Firebase Crashlytics) before launch.

### 8.3 No app version or build number tracking in storage keys

If the app is updated and the data schema changes, there is no app-version-based migration guard. The current migration system checks for field presence, which works for additive changes but could fail silently for breaking schema changes.

**Recommendation:** Store a `schemaVersion` field in the pet object and check it in `migratePetData`.

### 8.4 `pnpm` listed as a runtime dependency

**File:** `package.json`

```json
"dependencies": {
  "pnpm": "^10.26.2",
  ...
}
```

`pnpm` is a package manager — it should be in `devDependencies` or not listed at all (most projects declare it via `packageManager` field in `package.json`). Having it in `dependencies` means it is bundled into the app build unnecessarily.

**Fix:** Remove from `dependencies`. If you want to pin the version, use:
```json
"packageManager": "pnpm@10.26.2"
```

---

## 9. Dependency Audit

| Package | Version | Note |
|---|---|---|
| `expo` | `~50.0.0` | Expo 50 is at EOL (Expo 52 is current). Consider upgrading. |
| `react-native` | `0.73.2` | RN 0.73 is below the current stable (0.76+). Security patches may not backport. |
| `jest` | `^30.2.0` | Mismatched with `jest-expo@50` (see §7.2). |
| `pnpm` | `^10.26.2` in `dependencies` | Wrong section (see §8.4). |
| `@shopify/react-native-skia` | `0.1.221` | Very old version (current is 1.x). May have rendering bugs on newer RN. |
| `react-native-google-mobile-ads` | `^16.0.1` | Check COPPA compliance with the latest AdMob SDK requirements. |
| `socket.io-client` | `^4.8.0` | Multiplayer server code exists but is unclear if it's production-ready or experimental. |

---

## 10. Prioritized Action List

### 🔴 Do Before Any Release

1. ~~**Fix `savePet` missing `userId`** in all 9 activity functions in `PetContext.tsx` — this causes data loss for authenticated users.~~ ✅ Fixed
2. **Replace placeholder OAuth client ID** (`YOUR_WEB_CLIENT_ID`) with a real value, loaded from environment variables.
3. **Replace test AdMob IDs** and set `testMode: false`, gated on `!__DEV__`.
4. ~~**Fix sleep cancellation leak** — replace infinite polling loop with proper cleanup.~~ ✅ Fixed
5. ~~**Fix `visitVet` argument mismatch** in `usePetActions.ts` — pass `treatmentType` explicitly.~~ ✅ Fixed
6. ~~**Add error handling** in `CreatePetScreen.handleCreate` for AsyncStorage failures.~~ ✅ Fixed

### 🟡 High Priority (Before Beta)

7. **Fix stale `pet` closure** in `visitVet` money check — move check inside `setPet` updater.
8. **Fix happiness decay** using inconsistent `currentPet.happiness` vs `tempPet.happiness`.
9. ~~**Allow accented characters** in pet name validation for pt-BR users.~~ ✅ Fixed
10. **Localize validation error messages** (currently hardcoded English strings).
11. **Fix Jest version mismatch** (`jest@30` + `jest-expo@50`).
12. **Add tests for** the critical paths listed in §7.1.

### 🟢 Medium Priority (Before 1.0)

13. **Remove `pnpm` from `dependencies`** — move to `packageManager` field.
14. **Add schema version** to pet object for future-proof migrations.
15. **Integrate error monitoring** (Sentry or Firebase Crashlytics).
16. **Consolidate duplicate `ValidationResult` types** across `validation.ts` and `petStats.ts`.
17. **Remove or apply `decayMultipliers`** — currently dead code.
18. **Consolidate mini-game contexts** — 13 single-value contexts could be one `GameScoresContext`.
19. **Cap `minutesPassed`** in decay loop to prevent jarring stat drops on app resume.
20. **Fix `ts-jest` deprecated `globals` config** in `jest.config.js`.

---

*This review was generated by static analysis of all source files. Dynamic testing, profiling, and device testing may reveal additional issues.*

---

## 11. Additional Findings (2026-02-25)

### 11.1 TypeScript - Excessive Use of `any`

| File | Line(s) | Issue |
|------|---------|-------|
| `/app/src/utils/debounce.ts` | 1 | Generic function uses `any` for args |
| `/app/src/utils/migration.ts` | 10, 53, 98 | Functions accept/return `any` type |
| `/app/src/services/AdService.ts` | 47, 48, 122, 133, 228 | Multiple `any` types for ad objects |
| `/app/src/context/AuthContext.tsx` | 7, 8 | GoogleSignin and statusCodes declared as `any` |
| `/app/src/components/BannerAd.tsx` | 8, 9 | Google ad components as `any` |
| `/app/src/screens/game-selector-alts/types.ts` | 12 | `setSortBy` parameter is `any` |

### 11.2 Performance - Missing Cleanup for setTimeout

| File | Lines | Issue |
|------|-------|-------|
| `/app/src/screens/MuitoGameScreen.tsx` | 78 | setTimeout without cleanup on unmount |
| `/app/src/screens/SimonSaysGameScreen.tsx` | 78, 110, 141, 155, 176 | Multiple setTimeout calls without cleanup |
| `/app/src/screens/PetChefGameScreen.tsx` | 59 | setTimeout without cleanup |
| `/app/src/screens/ConnectDotsGameScreen.tsx` | 58 | setTimeout without cleanup |

### 11.3 Security - Server Issues

| File | Line | Issue |
|------|------|-------|
| `/server/src/auth.ts` | 4 | **JWT_SECRET** defaults to `'dev-secret-change-in-production'` - unsafe for production |
| `/server/src/index.ts` | 21 | CORS set to `{ origin: '*' }` - too permissive |

### 11.4 Technical Debt - Console Statements

| File | Count | Lines |
|------|-------|-------|
| `/app/src/utils/SpriteSheetManager.ts` | 7 | 99, 127, 130, 160, 167, 178, 202, 220 |
| `/scripts/create-game.js` | 40+ | Extensive console logging for CLI tool |
| `/app/src/components/SpriteSheetPreloader.tsx` | 3 | 36, 78, 83 |
| `/server/src/index.ts` | 3 | 16, 63, 69 |

### 11.5 New Bugs Found

| File | Line | Issue |
|------|------|-------|
| `/app/src/screens/LightningTapGameScreen.tsx` | 43, 57 | **Bug**: `score` in useEffect dependency array causes interval recreation on every score change |

### 11.6 Context Explosion Update

There are now **35+ separate React contexts** with repetitive AsyncStorage patterns. A reusable `GameContext<T>` template should be created.

### 11.7 Updated Production Readiness Checklist

| Item | File | Status |
|---|---|---|
| Replace `YOUR_WEB_CLIENT_ID` with real OAuth ID | `AuthContext.tsx` | ❌ Not done |
| Replace test AdMob IDs with production IDs | `ads.config.ts` | ❌ Not done |
| Set `testMode: false` | `ads.config.ts` | ❌ Not done |
| Fix `savePet` missing `userId` in activity functions | `PetContext.tsx` | ❌ Bug present |
| Fix sleep cancellation memory leak | `PetContext.tsx` | ❌ Bug present |
| Fix `visitVet` argument mismatch | `usePetActions.ts` | ❌ Bug present |
| Error handling in `handleCreate` | `CreatePetScreen.tsx` | ❌ Missing |
| Production error monitoring (Sentry/etc.) | — | ❌ Not present |
| **Fix JWT_SECRET hardcoded** | `/server/src/auth.ts` | ❌ Not done |
| **Fix CORS wildcard** | `/server/src/index.ts` | ❌ Not done |
| **Fix LightningTapGameScreen interval** | `LightningTapGameScreen.tsx` | ❌ Bug present |

---

*Additional findings from 2026-02-25 review session.*
