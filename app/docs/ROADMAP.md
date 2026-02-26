# Pet Care Game - Next Steps

This document outlines the roadmap for future development, improvements, and features for the Pet Care Game project.

## 🎯 Priority Levels

- 🔴 **High Priority** - Critical features or blockers
- 🟡 **Medium Priority** - Important improvements
- 🟢 **Low Priority** - Nice-to-have enhancements

---

## 📋 Immediate Tasks (From Checklist)

### 🔴 Add Sounds and Audio Effects
**Status:** In Progress
**Priority:** High

- [x] Integrate `expo-av` for audio playback
- [x] Create AudioService.ts with background music and sound effects management
- [x] Create useAudio hook for easy usage in components
- [x] Add button click sounds to IconButton component
- [x] Add pet action sounds to usePetActions hook (feed, play, bathe, sleep, cuddle, exercise, vet)
- [x] Add sound settings to SettingsModal (sound effects, music, volume toggles)
- [ ] Add interface variant persistence (save uiIndex to AsyncStorage)
- [ ] Add actual MP3 sound files to assets/sounds/
- [ ] Add background music (with mute toggle)
- [ ] Activity-specific sounds:
  - Eating/chewing sounds for feeding
  - Water/splash sounds for bathing
  - Play sounds (ball bounce, toy squeaks)
  - Clothing swap sounds for wardrobe
- [ ] Respect device silent mode

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

### 🟡 Mini-Games and Activities
**Priority:** Medium

- [ ] Add "Play" scene with interactive mini-games:
  - Catch the ball game
  - Find the toy (memory game)
  - Simple puzzle games
- [ ] Each mini-game rewards coins and increases happiness
- [ ] Difficulty scales with pet age
- [ ] Daily mini-game challenges

**Files to create:**
- `/src/screens/PlayScene.tsx`
- `/src/components/MiniGame/`
- `/src/data/minigames.ts`

---

### 🟡 Pet Needs System Enhancement
**Priority:** Medium

- [ ] Add "Energy" stat (decreases over time, increases with sleep)
- [ ] Add "Health" stat (overall wellness indicator)
- [ ] Implement sleep/rest activity
- [ ] Add vet visits for when pet is sick
- [ ] Visual indicators when stats are critical (shaking, sad animations)
- [ ] Push notifications for critical needs (with user permission)

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
  - [x] Custom hooks (usePetActions - 29/30 tests passing)
  - [x] Critical components (IconButton, StatusBar)
- [x] Test scripts configured (test, test:watch, test:coverage, test:ci)
- [x] 99% test pass rate (71/72 tests passing)
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

### 🟡 Error Handling and Logging
**Priority:** Medium

- [ ] Implement centralized error handling
- [ ] Add error boundaries for crash prevention
- [ ] Integrate crash reporting (Sentry or Bugsnag)
- [ ] Add analytics (Firebase Analytics or Amplitude)
- [ ] Log user flows for debugging
- [ ] Track ad performance metrics

**Files to create:**
- `/src/services/AnalyticsService.ts`
- `/src/services/ErrorService.ts`
- `/src/components/ErrorBoundary.tsx`

---

### 🟡 UX Improvements
**Priority:** Low

- [ ] **Interface setting persistence** - Save uiIndex to AsyncStorage so UI variant selection survives app restart
  - Files to update:
    - `/src/screens/GameSelectionScreen.tsx` - Load/save uiIndex from AsyncStorage
  - See: `docs/SETTINGS_MODAL_TESTING.md` (KI-001)

---

### ✅ Code Quality
**Priority:** Medium
**Status:** MOSTLY COMPLETED (Jan 2026)

- [x] Add ESLint with React Native config
- [x] Add Prettier for code formatting (with format scripts)
- [x] TypeScript strict mode enabled
- [x] Centralized configuration (actionConfig, constants, gameBalance)
- [x] Magic numbers eliminated (~90% reduction via constants)
- [x] usePetActions hook created (~90% code duplication reduction)
- [ ] Set up Husky for pre-commit hooks (Future)
- [ ] Document complex functions with JSDoc (In Progress)
- [ ] Create contribution guidelines (CONTRIBUTING.md) (Future)

---

### ✅ Internationalization (i18n)
**Priority:** Low
**Status:** COMPLETED (Jan 2026)

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
- [ ] Right-to-left (RTL) support (Future if needed)
- [ ] Test with pseudo-localization (Future)

---

### ✅ Authentication System (Google OAuth)
**Priority:** High
**Status:** COMPLETED (Jan 2026)

- [x] Google Sign-In integration with @react-native-google-signin/google-signin
- [x] Guest mode support for users who don't want to login
- [x] AuthContext for global authentication state management
- [x] Multi-user data isolation (per-user pet storage)
- [x] Auth state persistence across app restarts
- [x] LoginScreen with professional UI
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

- [ ] Replace AdMob test IDs with production IDs
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
**Status:** 90% COMPLETE
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
- [ ] Sounds and audio (Next Priority)
- [x] Advanced performance optimizations (In Progress - virtual lists, React.memo, useCallback)

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

**Last Updated:** 2026-02-26
**Current Version:** 1.2.0
**Status:** ✅ Core features complete — OAuth, 30+ mini-games, web deploy on Vercel, Game Review System
**Features Completed:** 90% (core game + OAuth + web deploy + review system)
**Next Version Target:** 1.3.0 (Sounds + Performance)

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
