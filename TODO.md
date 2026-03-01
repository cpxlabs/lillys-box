# Pet Care Game - Tasks

## To Do
- [ ] Replace placeholder WAV files with real audio assets
- [ ] Bundle size analysis with `npx expo-doctor`

## Done
- [x] Create project specification (SPEC.md)
- [x] Set up project structure (monorepo with app, backend, server, shared)
- [x] Implement shared game logic
- [x] Implement 20+ mini-games
- [x] Implement pet care system (feed, play, bathe, sleep, etc.)
- [x] Add clothing/customization system
- [x] Add Firebase auth setup
- [x] Set up server and backend
- [x] Add tests for various screens
- [x] Fix return button not working on web build across all games
- [x] Add Sentry integration for error tracking and source maps
- [x] Add placeholder WAV sound files to assets/sounds/ (activities, music, pet, ui)
- [x] Fix @react-native-google-signin/google-signin web build compatibility
- [x] Add global TypeScript type definitions (global.d.ts)
- [x] Add navigation type definitions (navigation.ts)
- [x] Ensure all screens compile without errors (web build verified)
- [x] Interface variant persistence (save uiIndex to AsyncStorage)
- [x] Fix rules-of-hooks violation in GameSelectionScreen (renderGameCard moved before early return)
- [x] Add GameSelectionScreen test suite (7 tests for uiIndex persistence)
- [x] Extract useGameBestScore hook; migrate all 29 game contexts (eliminates ~60 lines of duplicated AsyncStorage logic per context)
- [x] Fix Google OAuth client ID — now read from EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID env var (was hardcoded placeholder)
- [x] Replace hardcoded English strings in MenuScreen with i18n t() calls; add missing keys to both locales
- [x] Type setSortBy with SortOption (removed `any`) and pass real navigation to alt UI screens
- [x] Fix AdService rewarded-ad listener leak (C2) — replaced self-referential listener pattern with named `earnedRewardUnsub`/`closedUnsub` refs and a `cleanup()` helper
- [x] Fix silent catch in SlidingPuzzleContext → logger.warn (H1)
- [x] Type cancelToken explicitly in PetContext — removed all `as any` casts from debounce cancel token (H3)
- [x] Add try/catch to useReview refreshReviews and GameSelectionScreen loadSummaryForGame with retry logic (H4)
- [x] Fix summariesRef FlatList thrash in GameSelectionScreen — use ref for renderGameCard stability + extraData for re-renders (H7)
- [x] Add catch handler to useSpriteSheet preload with mounted guard (H8)
- [x] Add i18n locale key parity CI script — app/scripts/check-locale-keys.js deep-diffs all locales against en.json (M4)
- [x] Add error state and retry button to GifPicker fetch (M6)
- [x] Move AdMob IDs to EXPO_PUBLIC_ADMOB_* env vars with startup assertion if test IDs detected in production (M7)
- [x] Extend debounce.ts with DebouncedFn<T> type and .cancel() method; call in PetContext cleanup (M8)
- [x] Fix PetContext loadPet race condition — add mounted flag to prevent setState after unmount (M13)
- [x] Fix MultiPlayerMuitoContext socket.io — add socket.disconnect() to useEffect cleanup (M16)
- [x] Upgrade @typescript-eslint/no-explicit-any from warn to error; fix all any usages in AdService.ts (P1)
- [x] Replace all console.warn calls in AudioService.ts with logger.warn (P2)
