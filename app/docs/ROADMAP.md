# Pet Care Game - Next Steps

This document outlines the roadmap for future development, improvements, and features for the Pet Care Game project.

## 🎯 Priority Levels

- 🔴 **High Priority** - Critical features or blockers
- 🟡 **Medium Priority** - Important improvements
- 🟢 **Low Priority** - Nice-to-have enhancements

---

## 📋 Immediate Tasks (From Checklist)

### 🟡 Add Sounds and Audio Effects
**Status:** Mostly Complete
**Priority:** Medium

- [x] Integrate `expo-av` for audio playback
- [x] Create AudioService.ts with background music and sound effects management
- [x] Create useAudio hook for easy usage in components
- [x] Add button click sounds to IconButton component
- [x] Add pet action sounds to usePetActions hook (feed, play, bathe, sleep, cuddle, exercise, vet)
- [x] Add sound settings to SettingsModal (sound effects, music, volume toggles)
- [x] Add placeholder WAV sound files to `assets/sounds/` (activities, music, pet, ui categories)
- [x] Add interface variant persistence (save uiIndex to AsyncStorage) ✅ (Feb 2026)
- [x] Add background music (with mute toggle) ✅ (Mar 2026)
- [x] Respect device silent mode ✅ (Mar 2026)
- [x] Audio tab in SettingsModal (sound effects, music, silent mode toggles) ✅ (Mar 2026)
- [x] AppState-aware background music (auto-pause on background, resume on foreground) ✅ (Mar 2026)
- [ ] Replace placeholder WAVs with real/polished audio assets
- [ ] Activity-specific sounds:
  - Eating/chewing sounds for feeding
  - Water/splash sounds for bathing
  - Play sounds (ball bounce, toy squeaks)
  - Clothing swap sounds for wardrobe

**Files created/updated:**
- `/assets/sounds/` directory structure
- `/src/services/AudioService.ts`
- `/src/hooks/useAudio.ts`
- `/src/components/IconButton.tsx` (sound integration)
- `/src/hooks/usePetActions.ts` (sound integration)
- `/src/components/SettingsModal.tsx` (sound settings)

---

### 🔴 Performance Optimizations
**Status:** In Progress
**Priority:** High

- [x] Implement image caching and lazy loading
- [x] Optimize sprite sheet rendering
- [x] Use `React.memo()` for expensive components
- [x] Implement `useMemo()` and `useCallback()` where appropriate
- [x] Optimize state updates to prevent unnecessary re-renders
- [x] Implement virtual lists for scrollable content (FlatList with onViewableItemsChanged)
- [ ] Analyze bundle size with `npx expo-doctor`
- [ ] Profile with React DevTools and Flipper
- [ ] Consider using `react-native-fast-image` for better image performance
- [ ] Test on low-end Android devices (4GB RAM or less)

**Performance Metrics to Track:**
- App startup time
- Screen transition animations (should be 60fps)
- Memory usage
- Battery consumption

---

### 🟡 Skia Bath Screen Reimplementation
**Status:** Planning Complete
**Priority:** Medium
**Documentation:** [docs/SKIA_BATH_REIMPLEMENTATION_PLAN.md](./SKIA_BATH_REIMPLEMENTATION_PLAN.md)

Reintegrate Skia 2.4.14 into the bath screen for high-performance bubble particle system.

**Key Features:**
- [ ] Upgrade Skia from 0.1.221 to 2.4.14
- [ ] Implement worklet-based particle system (60fps on UI thread)
- [ ] Add object pooling for memory efficiency
- [ ] Create gradient-based realistic bubble rendering
- [ ] Implement physics simulation (gravity, wobble, drag)
- [ ] Add comprehensive error handling and fallback
- [ ] Create feature flag system for gradual rollout
- [ ] Write full test suite (unit, integration, performance)
- [ ] Implement staged rollout (dev → 10% → 100%)

**Timeline:** 3-4 weeks
**Success Criteria:**
- 60fps sustained with 50+ bubbles
- Memory usage < 100MB
- Zero crash rate increase
- Better visual quality than emoji bubbles

**Benefits:**
- Hardware-accelerated rendering
- Realistic soap bubble effects
- Smooth 60fps animations
- Reduced JS thread blocking

---

## 🎮 Feature Enhancements

### ✅ Mini-Games and Activities
**Status:** COMPLETED
**Priority:** Medium

- [x] 30+ mini-games implemented (Color Tap, Memory Match, Simon Says, Bubble Pop, Catch The Ball, Sliding Puzzle, and many more)
- [x] Each mini-game rewards coins
- [x] Best score tracking per user (useGameBestScore hook)
- [ ] Difficulty scales with pet age (Future)
- [ ] Daily mini-game challenges (Future)

---

### ✅ Pet Needs System
**Status:** COMPLETED
**Priority:** Medium

- [x] Energy stat (decreases over time, increases with sleep)
- [x] Health stat (weighted average of all stats)
- [x] Sleep/rest activity implemented
- [x] Vet visits for when pet is sick (health < 60)
- [x] Visual indicators when stats are critical
- [ ] Push notifications for critical needs (Future)

---

### ✅ Game Review System
**Status:** COMPLETED (Feb 2026)
**Priority:** Medium
**Documentation:** [docs/plans/REVIEW_SYSTEM_PLAN.md](./plans/REVIEW_SYSTEM_PLAN.md)

Allow players to leave reviews on individual games directly from the game screen. Reviews include text comments, star ratings, and optional image/GIF attachments.

- [x] `ReviewModal` component (bottom sheet, opens from any game screen)
- [x] Star rating widget (1–5 stars)
- [x] Text comment input (multiline, max 500 chars)
- [x] Image attachment via `expo-image-picker`
- [x] GIF search via Tenor API with inline browser
- [x] Media preview strip with remove capability
- [x] Local persistence (AsyncStorage) for MVP
- [x] Firebase Firestore + Storage sync (Phase 2)
- [x] Reviews list screen per game
- [x] Moderation flag button on each review
- [x] Helpful reaction on reviews
- [x] Sort reviews (recent, helpful, highest, lowest)
- [x] Delete own reviews
- [x] Update existing reviews

**Files created:**
- `src/components/ReviewModal.tsx`
- `src/components/StarRating.tsx`
- `src/components/MediaAttachment.tsx`
- `src/components/GifPicker.tsx`
- `src/hooks/useReview.ts`
- `src/services/ReviewService.ts`
- `src/screens/GameReviewsScreen.tsx`
- `src/types/review.ts`

---

### 🟢 Social Features
**Priority:** Low

- [ ] Pet profiles with shareable cards
- [ ] Take photos of your pet (screenshot with filters)
- [ ] Share pet photos to social media
- [ ] Pet achievements and badges
- [ ] Pet comparison with friends (age, happiness, etc.)

**Note:** Ensure COPPA compliance for any social features targeting children.

---

### 🟢 Expanded Customization
**Priority:** Low

- [ ] More clothing items and accessories:
  - Seasonal items (winter hats, summer glasses)
  - Themed sets (pirate, superhero, princess)
  - Unlock system with level progression
- [ ] Pet color variations (different fur colors)
- [ ] Accessories that provide stat bonuses
- [ ] Pet home customization (furniture, decorations)
- [ ] Animated backgrounds (day/night cycle, weather effects)

---

### 🟢 Shop System
**Priority:** Low

- [ ] In-game shop for items:
  - Food items (different types, different effects)
  - Clothing and accessories
  - Toys and decorations
  - Special power-ups
- [ ] Coin economy balancing
- [ ] Daily deals and limited-time items
- [ ] Watch ad to unlock exclusive items

---

## 🛠️ Technical Improvements

### ✅ Vercel Web Deployment
**Priority:** High
**Status:** COMPLETED (Feb 2026)

- [x] `vercel.json` configured with `installCommand: npm install --legacy-peer-deps`
- [x] `buildCommand: EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export --platform web`
- [x] SPA rewrites configured (all routes → index.html)
- [x] `pnpm-lock.yaml` moved into `app/` directory (monorepo fix)
- [x] `pnpm` removed from `dependencies` (packageManager field is canonical)

---

### ✅ Testing Infrastructure
**Priority:** Medium
**Status:** COMPLETED (Jan 2026)

- [x] Set up Jest for unit testing
- [x] Add test coverage for:
  - [x] Utility functions (`storage.ts`, `petStats.ts`, `validation.ts`)
  - [x] Context providers (PetContext)
  - [x] Custom hooks (usePetActions)
  - [x] Critical components (IconButton, StatusBar)
  - [x] All 25 mini-game home screens and contexts
  - [x] `GameSelectionScreen` (uiIndex persistence — 7 tests)
- [x] Test scripts configured (test, test:watch, test:coverage, test:ci)
- [x] 508+ tests total, 502+ passing (99%+) — Mar 2026
- [ ] Set up Detox for E2E testing (Future)
- [ ] Add CI/CD pipeline (GitHub Actions) (Future)

**Test structure:**
```
src/
├── components/__tests__/
├── hooks/__tests__/
├── context/__tests__/
└── utils/__tests__/
```

---

### ✅ Error Handling and Logging
**Priority:** Medium
**Status:** MOSTLY COMPLETED (Mar 2026)

- [x] Implement centralized error handling ✅ (ErrorService with Sentry + global handlers)
- [x] Add error boundaries for crash prevention ✅ (Mar 2026)
  - Root-level ErrorBoundary wrapping entire app
  - Per-game ErrorBoundary in `[gameId].tsx` with game-specific recovery UI ("Try Again" + "Go Back")
- [x] Integrate crash reporting (Sentry) — wizard configured, source maps + debug symbols
- [x] ErrorBoundary test suite (5 tests) ✅ (Mar 2026)
- [ ] Add analytics (Firebase Analytics or Amplitude)
- [ ] Log user flows for debugging
- [ ] Track ad performance metrics

**Files created/updated:**
- `/src/services/ErrorService.ts` ✅
- `/src/components/ErrorBoundary.tsx` ✅
- `/src/components/__tests__/ErrorBoundary.test.tsx` ✅ (Mar 2026)
- `/app/game/[gameId].tsx` ✅ (per-game error boundary, Mar 2026)

---

### ✅ UX Improvements
**Status:** COMPLETED (Feb 2026)

- [x] **Interface setting persistence** - uiIndex saved to AsyncStorage; selection survives app restart ✅
  - Fixed rules-of-hooks violation (`renderGameCard` useCallback moved before early return)
  - Added `GameSelectionScreen` test suite (7 tests covering load, save, validation)
  - See: `docs/SETTINGS_MODAL_TESTING.md` (KI-001)

---

### ✅ Code Quality
**Priority:** Medium
**Status:** MOSTLY COMPLETED (Mar 2026)

- [x] Add ESLint with React Native config
- [x] Add Prettier for code formatting (with format scripts)
- [x] TypeScript strict mode enabled
- [x] Centralized configuration (actionConfig, constants, gameBalance)
- [x] Magic numbers eliminated (~90% reduction via constants)
- [x] usePetActions hook created (~90% code duplication reduction)
- [x] `useGameBestScore` hook extracted ✅ (Mar 2026) — all 29 game contexts migrated from ~60 lines of duplicated AsyncStorage logic to a single 3-line hook call each
- [x] `SortOption` type exported and used in `GameSelectorAltProps` (no more `any`) ✅ (Mar 2026)
- [x] Real `navigation` prop passed to alt UI screens (removed `null as any`) ✅ (Mar 2026)
- [x] **C2** `AdService` rewarded-ad listener leak fixed — `try/finally` cleanup via `earnedRewardUnsub`/`closedUnsub` ✅ (Mar 2026)
- [x] **M7** AdMob IDs moved to `EXPO_PUBLIC_ADMOB_*` env vars; startup assertion rejects Google test IDs in production ✅ (Mar 2026)
- [x] **H1** Silent `catch(() => {})` in `SlidingPuzzleContext` replaced with `logger.warn` ✅ (Mar 2026)
- [x] **H3** `cancelToken as any` removed from `PetContext` — typed as `{ cancelled: boolean; timer?: ReturnType<typeof setTimeout> }` ✅ (Mar 2026)
- [x] **H4** `try/catch` added to `useReview.refreshReviews` and `GameSelectionScreen.loadSummaryForGame` ✅ (Mar 2026)
- [x] **H7** `summariesRef` introduced in `GameSelectionScreen`; `renderGameCard` dependency on `summaries` state removed; `extraData={summaries}` on FlatList ✅ (Mar 2026)
- [x] **H8** `.catch()` added to `useSpriteSheet` preload promise ✅ (Mar 2026)
- [x] **P1** `@typescript-eslint/no-explicit-any` upgraded from `warn` → `error`; `any` occurrences in `AdService.ts` replaced with `unknown` ✅ (Mar 2026)
- [x] **M4** Locale key parity CI script added (`scripts/check-locale-keys.js`) — diffs all `src/locales/*.json` against `en.json` ✅ (Mar 2026)
- [x] **M8** `debounce` utility gains a `.cancel()` method; PetContext calls `debouncedSave.cancel()` in effect cleanup ✅ (Mar 2026)
- [x] **M13** `loadPet().then()` guarded by mounted flag in PetContext ✅ (Mar 2026)
- [x] **M16** `socket.disconnect()` added to `MultiPlayerMuitoContext` useEffect cleanup ✅ (Mar 2026)
- [x] **M6** `GifPicker` now has error state + retry button on fetch failure ✅ (Mar 2026)
- [x] **P2** All `console.warn` calls in `AudioService.ts` routed to `logger.warn` ✅ (Mar 2026)
- [x] Create contribution guidelines (CONTRIBUTING.md) ✅
- [ ] Set up Husky for pre-commit hooks (Future)
- [ ] Document complex functions with JSDoc (In Progress)

---

### ✅ Internationalization (i18n)
**Priority:** Low
**Status:** COMPLETED (Jan 2026) / Extended (Mar 2026)

- [x] Integrated `react-i18next`
- [x] Extracted all strings to translation files
- [x] Support multiple languages:
  - [x] Portuguese (pt-BR) - default
  - [x] English (en)
  - [ ] Spanish (Future)
  - [ ] French (Future)
- [x] Language selector in menu screen
- [x] Automatic device language detection
- [x] Persistence of language preference
- [x] Replaced hardcoded English strings in MenuScreen (welcome greeting, sign-out button, guest banner, sign-out modal, error alerts) with `t()` calls ✅ (Mar 2026)
- [x] Added `common.error`, `menu.welcomeUser`, `menu.guestUser`, `menu.signOut`, `menu.loginBanner`, `menu.signOutError`, `menu.signOutModal.*` keys to both locales ✅ (Mar 2026)
- [ ] Right-to-left (RTL) support (Future if needed)
- [ ] Test with pseudo-localization (Future)

---

### ✅ Authentication System (Google OAuth)
**Priority:** High
**Status:** COMPLETED (Jan 2026) / Security fix (Mar 2026)

- [x] Google Sign-In integration with @react-native-google-signin/google-signin
- [x] Guest mode support for users who don't want to login
- [x] AuthContext for global authentication state management
- [x] Multi-user data isolation (per-user pet storage)
- [x] Auth state persistence across app restarts
- [x] LoginScreen with professional UI
- [x] Google OAuth client ID read from `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` env var ✅ (Mar 2026) — removed hardcoded placeholder, added missing-config warning
- [x] User info display in MenuScreen header
- [x] Sign-out functionality with confirmation
- [x] Guest login prompt banner
- [x] Comprehensive setup guide (GOOGLE_OAUTH_SETUP.md)

**Features Implemented:**
- User can sign in with Google account
- User can play as guest without authentication
- Each user has isolated pet data on the same device
- User info displayed at top of menu screen
- Smooth auth-based routing in navigation stack

---

### 🟡 Accessibility
**Priority:** Low
**Status:** PARTIALLY COMPLETED

- [x] Add accessibility labels for screen readers (IconButton, CreatePet screen)
- [x] Add haptic feedback for interactions (expo-haptics)
- [ ] Ensure proper color contrast ratios (In Progress)
- [ ] Add support for larger text sizes (Future)
- [ ] Test with TalkBack (Android) and VoiceOver (iOS) (Future)
- [ ] Keyboard navigation support (Future)

---

## 🚀 Deployment and Distribution

### 🔴 Production Preparation
**Priority:** High

- [x] AdMob IDs moved to env vars; startup assertion guards against test IDs in production ✅ (Mar 2026 — M7)
- [ ] Populate `EXPO_PUBLIC_ADMOB_*` env vars in Vercel/EAS production environment
- [ ] Create production builds for testing
- [ ] Test on multiple devices (various screen sizes, Android versions)
- [ ] Optimize app size (remove unused dependencies, compress assets)
- [ ] Create app icon in all required sizes
- [ ] Create splash screen variants
- [ ] Write privacy policy (COPPA compliant)
- [ ] Write terms of service

---

### 🔴 Google Play Store Submission
**Priority:** High

**Prerequisites:**
- [ ] Google Play Developer account ($25 one-time fee)
- [ ] App signing key configured
- [ ] Privacy policy hosted and linked
- [ ] Content rating questionnaire completed
- [ ] Age-appropriate content verified

**Store Listing:**
- [ ] App title and short description
- [ ] Full description (translate to multiple languages)
- [ ] Screenshots (at least 2, up to 8)
- [ ] Feature graphic (1024x500)
- [ ] App icon (512x512)
- [ ] Promotional video (optional but recommended)
- [ ] Categorization (Family/Education)

---

### 🟡 Release Strategy
**Priority:** Medium

- [ ] Soft launch in select regions
- [ ] Beta testing program (Google Play Beta)
- [ ] Gather user feedback
- [ ] Monitor crash reports and reviews
- [ ] Plan update cadence (bi-weekly or monthly)
- [ ] Create release notes template

---

## 📚 Documentation

### 🟡 User Documentation
**Priority:** Medium

- [ ] In-app tutorial for first-time users
- [ ] Help/FAQ screen
- [ ] Tips and tricks section
- [ ] Parental controls documentation
- [ ] Contact/support information

---

### 🟡 Developer Documentation
**Priority:** Medium

- [x] Folder structure guide ✅
- [ ] API documentation (if adding backend)
- [ ] Component documentation with Storybook
- [ ] Architecture decision records (ADR)
- [ ] Setup guide for new developers
- [ ] Troubleshooting guide

---

### 🟢 Marketing Materials
**Priority:** Low

- [ ] Landing page/website
- [ ] Press kit with screenshots and descriptions
- [ ] Demo video for app stores
- [ ] Social media presence (Twitter, Instagram, Facebook)
- [ ] App Store Optimization (ASO) research

---

## 💰 Monetization Optimization

### 🟡 Ad Experience Improvement
**Priority:** Medium

- [ ] A/B test ad placement and frequency
- [ ] Monitor ad fill rates and eCPM
- [ ] Optimize rewarded ad rewards (current: 50 coins base, 2x activity)
- [ ] Consider mediation with multiple ad networks
- [ ] Track user engagement with ads
- [ ] Balance monetization with user experience

---

### 🟢 Additional Revenue Streams
**Priority:** Low

- [ ] In-app purchases (IAP) for:
  - Remove ads option
  - Starter packs with coins
  - Premium clothing sets
  - Exclusive pets or breeds
- [ ] Subscription model (monthly coin allowance, exclusive content)
- [ ] Sponsorships with pet brands (ethically, kid-safe)

**Note:** Ensure COPPA compliance for any payment features.

---

## 🔒 Security and Compliance

### 🟡 Privacy and Safety
**Priority:** Medium

- [ ] COPPA compliance audit
- [ ] GDPR compliance (if targeting EU)
- [ ] Implement parental gate for external links
- [ ] Secure data storage (encrypt sensitive data)
- [ ] No collection of personal information
- [ ] Third-party SDK audit (ensure all are kid-safe)

---

## 🐛 Known Issues and Technical Debt

### Issues to Address:

1. **Web Build Support**
   - AdMob doesn't work on web builds
   - Consider feature flags for platform-specific functionality

2. **Dependency Updates**
   - Some packages use `--legacy-peer-deps`
   - Plan migration to newer Expo SDK version

3. **TypeScript Coverage**
   - Some files still use `.js` extension
   - Convert remaining JS files to TypeScript

4. **State Management Complexity**
   - Consider Redux or Zustand if state becomes more complex
   - Evaluate if Context API scales well

---

## 📊 Analytics and Metrics to Track

### User Engagement:
- Daily Active Users (DAU)
- Session length
- Retention rate (Day 1, Day 7, Day 30)
- Feature usage (which activities are most popular)

### Monetization:
- Ad impressions and clicks
- eCPM (effective cost per mille)
- ARPDAU (average revenue per daily active user)
- Rewarded ad completion rate

### Technical:
- Crash-free rate (target: >99.5%)
- App load time
- Screen transition performance
- API response times (if adding backend)

---

## 🎯 Milestones

### Milestone 1: MVP Enhancement (v1.2)
**Status:** 95% COMPLETE
- [x] Folder structure documentation ✅
- [x] Testing infrastructure ✅ (99% tests passing)
- [x] Code quality improvements ✅ (ESLint, Prettier, usePetActions hook)
- [x] i18n support ✅ (English + Portuguese)
- [x] Accessibility improvements ✅ (partial - haptics, labels)
- [x] Authentication system with Google OAuth ✅ (Jan 2026)
  - [x] Google Sign-In integration
  - [x] Guest mode support
  - [x] Multi-user data isolation
  - [x] Comprehensive setup documentation
- [x] Game Review System ✅ (Feb 2026)
  - [x] Review modal with stars, comments, media
  - [x] Image/GIF attachments
  - [x] Firebase Firestore sync
  - [x] Helpful reactions
  - [x] Sort and filter
- [ ] Skia bath screen reimplementation (Planning Complete - [Plan](./SKIA_BATH_REIMPLEMENTATION_PLAN.md))
- [x] Audio system with background music, sound effects, and silent mode support ✅ (Mar 2026)
- [x] Advanced performance optimizations (virtual lists, React.memo, useCallback)

### Milestone 2: Feature Complete (v1.5)
**Target:** 4-6 weeks
- [ ] All core features polished
- [ ] Mini-games implemented
- [ ] Shop system
- [ ] Enhanced pet needs

### Milestone 3: Production Ready (v2.0)
**Target:** 8-10 weeks
- [ ] All testing completed
- [ ] Store assets prepared
- [ ] Privacy policy and legal docs
- [ ] Production AdMob setup
- [ ] Beta testing completed

### Milestone 4: Public Launch (v2.0)
**Target:** 10-12 weeks
- [ ] Google Play Store submission
- [ ] Marketing materials ready
- [ ] Support channels established
- [ ] Analytics and monitoring active

---

## 🤝 Community and Contribution

### Future Considerations:

- [ ] Open source the project (if desired)
- [ ] Accept community contributions
- [ ] Create Discord/Slack for users
- [ ] Regular dev blogs or updates
- [ ] User feedback system

---

## 📝 Notes

- Always maintain backward compatibility for user data
- Test thoroughly before each release
- Keep parents informed of updates and new features
- Monitor app store reviews and respond promptly
- Stay updated on COPPA and child privacy regulations

---

**Last Updated:** 2026-03-02
**Current Version:** 1.2.2
**Status:** ✅ Core features complete — OAuth, 30+ mini-games, web deploy on Vercel, Game Review System, UI persistence, error boundaries, audio system with background music, Sprint 1–2 code review fixes (C1, C2, H1–H4, H7–H8, P1–P2, M4, M6–M8, M13, M16)
**Features Completed:** 95%+ (core game + OAuth + web deploy + review system + uiIndex persistence + error handling + audio + code quality + sprint 1-2 fixes)
**Next Version Target:** 1.3.0 (Real audio assets + Skia bath + remaining Sprint 3-4 items)

---

## 🚦 Getting Started with Next Steps

To begin working on any of the above tasks:

1. **Check current status** - Review what's marked as completed
2. **Choose a task** - Pick based on priority and your skills
3. **Create a branch** - Use naming convention: `feature/task-name` or `fix/issue-name`
4. **Update documentation** - Mark tasks as in-progress
5. **Test thoroughly** - Ensure no regressions
6. **Update this file** - Check off completed items

For questions or discussions about priorities, please create a GitHub issue.
