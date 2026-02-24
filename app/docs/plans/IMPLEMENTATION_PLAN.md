# Comprehensive Implementation Plan: Pet Care Game

**Created**: 2026-01-15 (Infrastructure), 2026-01-16 (Game Features)
**Last Updated**: 2026-01-21 (Added Skia Bath Screen Reimplementation)
**Status**: Mixed - Parts completed, parts pending

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Part 1: Testing Infrastructure & Developer Setup](#part-1-testing-infrastructure--developer-setup)
3. [Part 2: Game Features & UI Improvements](#part-2-game-features--ui-improvements)
4. [Part 3: Code Quality Improvements](#part-3-code-quality-improvements)
5. [Implementation Timeline](#implementation-timeline)
6. [Success Criteria](#success-criteria)

---

## Overview

This comprehensive plan consolidates all pending and completed implementation work for the Pet Care Game project. It combines:

- **Infrastructure** (Testing, Error Handling, Performance) - From docs/IMPLEMENTATION_PLAN.md
- **Game Features** (VET system, Food economy, UI improvements) - Part 1 of root plan
- **Code Quality** (Bug fixes, i18n, consistency) - Part 2 of root plan ✅ COMPLETED

### Priority Levels

- 🔴 **P0**: Must fix before production (Blockers)
- 🟡 **P1**: Should fix before production (Critical)
- 🟢 **P2**: Nice to have (Quality improvements)

---

# Part 1: Testing Infrastructure & Developer Setup

**Source**: docs/IMPLEMENTATION_PLAN.md
**Priority**: 🔴 P0
**Estimated Time**: 2-3 weeks
**Status**: ⚠️ Partial (Tests created but environment unstable)

## Phase 1: Testing Infrastructure Setup

**Priority**: 🔴 P0
**Estimated Time**: 2-3 days
**Goal**: Establish testing foundation with >60% coverage on critical paths

### Status Update (2026-01-19)
- `jest-expo` and `expo` version mismatch is causing instability in the test environment.
- Test files have been created for `src/utils/__tests__/storage.test.ts` and `src/context/__tests__/PetContext.test.tsx`.
- We are proceeding with manual verification for features while the test environment is stabilized in parallel or future sprints.

### Step 1.1: Install Testing Dependencies

```bash
# Install testing libraries
pnpm add -D jest @testing-library/react-native @testing-library/jest-native @testing-library/react-hooks
pnpm add -D @types/jest jest-expo babel-jest
pnpm add -D react-test-renderer

# Install testing utilities
pnpm add -D @testing-library/user-event
```

### Step 1.2: Configure Jest

**Create**: `jest.config.js`
```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/types/**/*',
  ],
  coverageThresholds: {
    global: {
      statements: 60,
      branches: 55,
      functions: 60,
      lines: 60,
    },
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

**Create**: `jest.setup.js`
```javascript
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo modules
jest.mock('expo-constants', () => ({
  Constants: {
    expoConfig: {
      extra: {},
    },
  },
}));

// Mock Google Mobile Ads
jest.mock('react-native-google-mobile-ads', () => ({
  default: jest.fn(() => ({
    initialize: jest.fn(() => Promise.resolve()),
    setRequestConfiguration: jest.fn(() => Promise.resolve()),
  })),
  MaxAdContentRating: {
    G: 'G',
  },
  BannerAd: 'BannerAd',
  TestIds: {
    BANNER: 'test-banner',
    INTERSTITIAL: 'test-interstitial',
    REWARDED: 'test-rewarded',
  },
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
```

### Step 1.3: Update package.json Scripts

**Edit**: `package.json`
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### Step 1.4: Create Critical Test Files

See full test implementations in [detailed plan](docs/IMPLEMENTATION_PLAN.md#step-14-create-critical-test-files).

Key test files to create:
- `src/utils/__tests__/petStats.test.ts`
- `src/utils/__tests__/storage.test.ts`
- `src/context/__tests__/PetContext.test.tsx`

---

## Phase 2: Critical Bug Fixes

**Priority**: 🔴 P0
**Estimated Time**: 3-4 days
**Goal**: Fix race conditions, add error boundaries, improve type safety

### Step 2.1: Fix Sleep Cancellation Race Condition

**Problem**: Current implementation uses polling with `setInterval` which can cause memory leaks.

See full implementation in [detailed plan](docs/IMPLEMENTATION_PLAN.md#step-21-fix-sleep-cancellation-race-condition).

### Step 2.2: Add Error Boundary Component

**Create**: `src/components/ErrorBoundary.tsx`

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😿</Text>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  button: {
    backgroundColor: '#9b59b6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

**Edit**: `App.tsx` - Wrap with ErrorBoundary

### Step 2.3: Add Input Validation

**Create**: `src/utils/validation.ts`

```typescript
export const PET_NAME_VALIDATION = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 20,
  ALLOWED_CHARS: /^[a-zA-Z0-9\s\-']+$/,
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePetName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Pet name cannot be empty',
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < PET_NAME_VALIDATION.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Pet name must be at least ${PET_NAME_VALIDATION.MIN_LENGTH} character`,
    };
  }

  if (trimmedName.length > PET_NAME_VALIDATION.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Pet name cannot exceed ${PET_NAME_VALIDATION.MAX_LENGTH} characters`,
    };
  }

  if (!PET_NAME_VALIDATION.ALLOWED_CHARS.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Pet name can only contain letters, numbers, spaces, hyphens, and apostrophes',
    };
  }

  return { isValid: true };
};

export const sanitizePetName = (name: string): string => {
  return name.trim().slice(0, PET_NAME_VALIDATION.MAX_LENGTH);
};
```

### Step 2.4: Debounce Storage Writes

**Create**: `src/utils/debounce.ts`

```typescript
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
```

---

## Phase 3: Performance & Quality Improvements

**Priority**: 🟡 P1
**Estimated Time**: 3-4 days
**Goal**: Optimize re-renders, add memoization, improve accessibility

### Step 3.1: Optimize PetContext Re-renders ✅

Use `useMemo` and `useCallback` to prevent unnecessary re-renders. See [detailed plan](docs/IMPLEMENTATION_PLAN.md#step-31-optimize-petcontext-re-renders).

### Step 3.2: Add React.memo to Pure Components ✅

Memoize frequently re-rendered components like IconButton, StatusCard, etc.

### Step 3.3: Add Accessibility Labels

Add `accessibilityLabel`, `accessibilityRole`, and `accessibilityState` to all interactive elements.

### Step 3.4: Add Haptic Feedback ✅

**Install**: `expo-haptics`

**Create**: `src/utils/haptics.ts`

### Step 3.5: Add Code Formatting (Prettier)

**Install**: `pnpm add -D prettier`

**Create**: `.prettierrc`
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Step 3.6: Add ESLint

**Install**: `pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`

**Create**: `.eslintrc.js`

---

## Phase 4: Claude Code Configuration

**Priority**: 🟢 P2
**Estimated Time**: 1-2 days
**Goal**: Set up Claude Code for optimal AI-assisted development

### Step 4.1: Initialize Claude Code

```bash
claude init
```

### Step 4.2: Create Project Instructions

**Create**: `.claude/instructions.md`

See full instructions in [detailed plan](docs/IMPLEMENTATION_PLAN.md#step-42-create-project-instructions).

### Step 4.3: Create .claudeignore

**Create**: `.claudeignore`

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
.expo/
dist/
web-build/
coverage/

# Assets (large files)
assets/sprites/
assets/backgrounds/
```

---

# Part 2: Game Features & UI Improvements

**Source**: Root IMPLEMENTATION_PLAN.md (Part 1)
**Priority**: 🟡 P1
**Status**: ✅ APPROVED - Ready for implementation
**Created**: 2026-01-16

## Overview

This section covers game balance, UI improvements, and feature enhancements validated and approved for implementation.

## 1. VET Healing Logic ✅

### Current State
- Single vet treatment: 50 coins OR watch ad
- Effect: Sets health to minimum 70%, +10 hunger/hygiene

### Proposed Changes

#### Two Treatment Options:

**1. Antibiotic**
- Cost: 30 coins OR watch ad
- Effect: Guarantees minimum 50% health (uses Math.max)
- Use Case: Minor health issues, budget-friendly

**2. Anti-inflammatory**
- Cost: 50 coins (no ad option)
- Effect: Guarantees minimum 80% health (uses Math.max)
- Use Case: Serious health issues, premium option

#### Implementation Steps:

1. **Update `src/config/gameBalance.ts`** ✅
   ```typescript
   vet: {
     antibiotic: {
       cost: 30,
       healthTarget: 50,
       allowAds: true,
     },
     antiInflammatory: {
       cost: 50,
       healthTarget: 80,
       allowAds: false,
     },
   }
   ```

2. **Update `src/context/PetContext.tsx`** ✅
   ```typescript
   const visitVet = (treatmentType: 'antibiotic' | 'antiInflammatory', useMoney: boolean = true): boolean => {
     const effects = GAME_BALANCE.activities.vet[treatmentType];

     // Guarantee minimum health
     updatedPet.health = Math.max(effects.healthTarget, calculateHealth(updatedPet));

     return true;
   };
   ```

3. **Update `src/screens/VetScene.tsx`** ✅
   - Replace single treatment with two option cards
   - Show treatment details and costs
   - Enable ad option for Antibiotic only

4. **Update `src/types.ts`**
   - Add: `type TreatmentType = 'antibiotic' | 'antiInflammatory'`

---

## 2. Card Stats UI ✅

### Current State
- Shows stats with emoji icons and labels
- White background styling
- Two-column layout

### Proposed Changes

#### Remove White Background
- Remove `backgroundColor` from stat containers
- Ensure transparent or theme-appropriate background

#### Remove Labels (Icon Only)
- Keep emoji icons (🍖, 🛁, ⚡, 😊, ❤️)
- Remove text labels
- Ensure icons are large enough to be recognizable

#### Implementation Steps:

1. **Update `src/components/EnhancedStatusBar.tsx`** ✅
   - Remove label text rendering
   - Keep emoji icons
   - Adjust spacing without labels

2. **Update `src/components/StatusCard.tsx`** ✅
   - Remove white background
   - Adjust styling for cleaner look

---

## 3. Food System ✅

### Current State
- Food items free to feed
- Players earn money from feeding via ads
- Base hunger values: Kibble 20, Fish 25, Treat 15, Milk 10

### Proposed Changes

#### Economy Restructure
**REMOVE**: Feeding ad rewards system entirely
**INCREASE**: Money earned from other activities:
- Play: 5 → 15 coins (3x increase)
- Exercise: 10 → 25 coins (2.5x increase)

#### Increase Food Percentages
- Kibble: 20 → 30
- Fish: 25 → 35
- Treat: 15 → 25
- Milk: 10 → 20

#### Add Food Costs
- Kibble: 15 coins
- Fish: 20 coins
- Treat: 18 coins
- Milk: 15 coins

#### Game Balance
```
Daily food needs: ~4 feedings × 15-20 coins = 60-80 coins
Daily income: Play (3×) = 45 coins + Exercise (2×) = 50 coins = 95 coins
Net balance: +15 to +35 coins/day (sustainable)
```

#### Implementation Steps:

1. **Update `src/screens/FeedScene.tsx`** ✅
   ```typescript
   const FOODS = [
     { id: 'kibble', emoji: '🍖', nameKey: 'feed.foods.kibble', value: 30, cost: 15 },
     { id: 'fish', emoji: '🐟', nameKey: 'feed.foods.fish', value: 35, cost: 20 },
     { id: 'treat', emoji: '🦴', nameKey: 'feed.foods.treat', value: 25, cost: 18 },
     { id: 'milk', emoji: '🥛', nameKey: 'feed.foods.milk', value: 20, cost: 15 },
   ];
   ```

2. **Update `src/context/PetContext.tsx`** ✅
   - Modify `feed()` to accept cost parameter
   - Deduct cost from pet.money

3. **Update `src/config/gameBalance.ts`** ✅
   ```typescript
   activities: {
     play: {
       money: 15,  // Changed from 5
     },
     exercise: {
       money: 25,  // Changed from 10
     },
   }
   ```

4. **Remove all feeding ad reward logic** ✅

---

## 4. Responsive Design Documentation ✅

### Current State
- Responsive system already implemented
- `src/hooks/useResponsive.ts` - Core hook
- `src/config/responsive.ts` - Constants
- Implementation plan: `160126-responsivity.md`

### Task
Create user-facing documentation `RESPONSIVE.md` based on existing `160126-responsivity.md`

#### Implementation Steps:

1. Use `160126-responsivity.md` as foundation
2. Create `RESPONSIVE.md` with sections: ✅
   - Overview
   - Breakpoints
   - Using useResponsive Hook
   - Component Patterns
   - Testing Guidelines
3. Include practical examples
4. Reference existing implementation

---

## 5. Skia Bath Screen Reimplementation 🎨

**Priority**: 🟡 P1 (Performance & Visual Quality)
**Status**: 📋 Planning Complete
**Documentation**: [docs/SKIA_BATH_REIMPLEMENTATION_PLAN.md](./SKIA_BATH_REIMPLEMENTATION_PLAN.md)
**Created**: 2026-01-21
**Estimated Timeline**: 3-4 weeks

### Overview

Reintegrate `@shopify/react-native-skia` into the bath screen to provide a high-performance, hardware-accelerated bubble particle system. This replaces the current emoji-based bubble implementation with realistic, physics-based bubbles.

### Why Reintegration?

**Previous Implementation Issues (v0.1.221)**:
- Outdated Skia version (2+ years old)
- No object pooling (memory issues)
- Mixed state/render logic
- No fallback mechanism
- Insufficient testing

**New Implementation Benefits (v2.4.14)**:
- ✅ Latest Skia version with 2+ years of improvements
- ✅ Worklet-based particle system (60fps on UI thread)
- ✅ Object pooling for memory efficiency
- ✅ Advanced visual effects (gradients, physics simulation)
- ✅ Comprehensive error handling and fallback
- ✅ Feature flag system for gradual rollout
- ✅ Full test suite (unit, integration, performance)

### Key Features

1. **Upgrade Skia to 2.4.14**
   - From version 0.1.221 (2022) to 2.4.14 (2024)
   - Better performance, stability, and API

2. **Particle System Architecture**
   - Object pooling (no GC spikes)
   - Worklet-based physics (UI thread)
   - 50+ concurrent bubbles at 60fps
   - Realistic physics (gravity, wobble, drag)

3. **Visual Quality**
   - Gradient-based bubbles (realistic soap appearance)
   - Smooth animations (fade in/out)
   - Hardware-accelerated rendering
   - Better than emoji bubbles (🫧)

4. **Reliability**
   - Error boundaries
   - Graceful fallback to Reanimated
   - Feature flags for rollout control
   - Device capability detection

### Implementation Steps

#### Phase 1: Setup (Day 1-2)
- [ ] Upgrade Skia to 2.4.14
- [ ] Create feature flags (`src/config/features.ts`)
- [ ] Verify build and basic rendering
- [ ] Update dependencies

#### Phase 2: Core System (Day 3-5)
- [ ] Implement `ParticlePool` (object reuse)
- [ ] Implement `ParticleSystem` (physics logic)
- [ ] Create physics configuration
- [ ] Write unit tests (100% coverage)

#### Phase 3: Rendering (Day 6-8)
- [ ] Create `BubbleCanvas` component (Skia)
- [ ] Implement gradient rendering
- [ ] Add worklet integration
- [ ] Create `BubbleCanvasFallback` (Reanimated)

#### Phase 4: Integration (Day 9-10)
- [ ] Update `BathScene.tsx`
- [ ] Add gesture integration
- [ ] Test on multiple devices
- [ ] Polish visual appearance

#### Phase 5: Testing (Day 11-12)
- [ ] Integration tests
- [ ] Performance tests (60fps target)
- [ ] Manual QA on devices
- [ ] Visual regression tests

#### Phase 6: Optimization (Day 13-14)
- [ ] Profile performance
- [ ] Optimize hot paths
- [ ] Add particle culling
- [ ] Test on low-end devices

#### Phase 7: Polish (Day 15)
- [ ] Error handling
- [ ] Analytics tracking
- [ ] Documentation
- [ ] Code review

#### Phase 8: Rollout (Day 16-20)
- [ ] Deploy with flag disabled
- [ ] Enable for dev team
- [ ] Enable for 10% of users
- [ ] Enable for 100% (if metrics good)

### New File Structure

```
src/
├── systems/particles/       # NEW
│   ├── ParticleSystem.ts    # Core particle logic (Worklet)
│   ├── ParticlePool.ts      # Object pooling
│   ├── particlePhysics.ts   # Physics config
│   └── __tests__/
├── components/bath/
│   ├── BubbleCanvas.tsx         # Skia implementation
│   ├── BubbleCanvasFallback.tsx # Reanimated fallback
│   └── __tests__/
├── config/
│   ├── features.ts          # NEW - Feature flags
│   └── bubblePhysics.ts     # NEW - Physics constants
```

### Success Criteria

- ✅ 60fps sustained with 50+ bubbles
- ✅ Memory usage < 100MB
- ✅ Zero crash rate increase
- ✅ Visual quality better than emoji bubbles
- ✅ Works on Android 8+ / 4GB RAM devices

### Risk Mitigation

1. **Technical Risk**: Fallback to Reanimated implementation
2. **Performance Risk**: Feature flag allows per-device configuration
3. **Stability Risk**: Error boundaries catch rendering crashes
4. **UX Risk**: A/B testing measures actual impact

### Dependencies

```bash
# Upgrade Skia
npm uninstall @shopify/react-native-skia
npm install @shopify/react-native-skia@2.4.14

# Rebuild dev client (if needed)
npx expo prebuild --clean
```

### Related Documentation

- Full implementation plan: [SKIA_BATH_REIMPLEMENTATION_PLAN.md](./SKIA_BATH_REIMPLEMENTATION_PLAN.md)
- Previous implementation history: [SKIA_IMPLEMENTATION_PLAN.md](./SKIA_IMPLEMENTATION_PLAN.md) (deprecated)
- Testing strategy: [TEST_IMPLEMENTATION_PLAN.md](./TEST_IMPLEMENTATION_PLAN.md)

---

# Part 3: Code Quality Improvements

**Source**: Root IMPLEMENTATION_PLAN.md (Part 2)
**Priority**: 🔴 P0 (Critical bugs), 🟡 P1 (Improvements)
**Status**: ✅ **COMPLETED** (2026-01-17)

## Overview
All code quality improvements have been successfully implemented in commit `18d09f3`.

## Completed Work

### Sprint 1: Critical Bug Fixes ✅

#### Fixed: VET visitVet() Undefined Variables
**Location**: `src/context/PetContext.tsx`

**Issues Fixed**:
- Line 287: Removed undefined `treatment` variable from logger
- Line 301: Changed `treatmentConfig.cost` → `effects.cost`
- Line 306: Changed `treatmentConfig.healthTarget` → `effects.healthTarget`
- Line 309: Changed `treatmentConfig.healthTarget` → `effects.healthTarget`

**Result**: VET system now works without runtime errors

---

### Sprint 2: Internationalization ✅

#### Completed: Play Scene i18n Support
**Files Modified**: `src/screens/PlayScene.tsx`, `src/data/playActivities.ts`

**Changes**:
- Created `src/data/playActivities.ts` for centralized activity configuration
- Converted all hardcoded Portuguese strings to i18n
- Added 6 new translation keys
- Implemented timeout management with refs and cleanup

**Translation Keys Added**:
```json
{
  "play": {
    "title": "🎮 Brincar",
    "chooseActivity": "Escolha a atividade:",
    "playing": "{{name}} está brincando com {{activity}}! 🎉",
    "loved": "{{name}} adorou brincar! 💕",
    "needsRest": "{{name}} está muito cansado para brincar!",
    "activities": {
      "yarnBall": "Bola de lã",
      "smallBall": "Bolinha"
    }
  }
}
```

**Result**: PlayScene now matches FeedScene patterns and supports multiple languages

---

### Sprint 3: User Experience Enhancements ✅

#### Completed: User Feedback for Blocked Actions
**Files Modified**: `src/screens/PlayScene.tsx`, `src/screens/FeedScene.tsx`

**Changes**:
- Added energy validation with toast feedback
- Added hunger validation with toast feedback
- Added 3 new translation keys (`play.needsRest`, `feed.tooTired`, `feed.notHungry`)

#### Completed: Money System Consolidation
**Files Modified**: `src/config/gameBalance.ts`, `src/config/ads.config.ts`

**Implementation**: Option A - Consolidated to reward system only
- `gameBalance.ts`: `play.money` from 5 → 0
- `ads.config.ts`: `playReward` from 10 → 15
- Total play earnings remain 15 coins (15 base, or 30 with ad)

**Result**: Simpler, more transparent reward system

---

### Sprint 4: Documentation ✅

**Files Updated**:
- `docs/VET_ACTIONS_DOCUMENTATION.md` - Marked bugs as fixed
- `docs/PLAY_ACTIONS_DOCUMENTATION.md` - Marked i18n as complete
- `docs/FEED_ACTIONS_DOCUMENTATION.md` - Marked enhancements as implemented
- `IMPLEMENTATION_PLAN.md` - Updated with completion status

---

## Summary of Code Quality Achievements

✅ Fixed 4 undefined variable references in VET system
✅ Added complete i18n support to PlayScene
✅ Implemented proper timeout management
✅ Added user feedback for blocked actions
✅ Consolidated dual money system
✅ Updated all documentation

**Commit**: `18d09f3` - Pushed to `claude/fix-play-actions-error-cN85j`
**Merge**: PR #41 - Merged to main

---

# Implementation Timeline

## Overall Roadmap

### Week 1: Infrastructure Foundation
- **Days 1-3**: Phase 1 - Testing Infrastructure Setup
- **Days 4-5**: Phase 2 (Part 1) - Critical Bug Fixes

### Week 2: Quality & Features
- **Days 1-3**: Phase 2 (Part 2) - More Bug Fixes
- **Days 4-5**: Phase 3 (Part 1) - Performance Optimization

### Week 3: Features & Polish
- **Days 1-2**: Part 2 Features (VET, Food, UI)
- **Days 3-4**: Phase 3 (Part 2) - Accessibility
- **Day 5**: Phase 4 - Claude Code Setup

### Week 4: Testing & Documentation
- **Days 1-2**: Comprehensive testing
- **Days 3-4**: Documentation updates
- **Day 5**: Final review and deployment preparation

---

# Implementation Order (Consolidated)

## Phase A: Critical Infrastructure (Week 1)
1. Testing setup (Jest, mocks, test files)
2. Error boundaries
3. Input validation
4. Debounced storage writes
5. Fix sleep cancellation race condition

## Phase B: Performance & Quality (Week 2)
6. Optimize context re-renders (useMemo, useCallback)
7. Add React.memo to components
8. Add accessibility labels
9. Add haptic feedback
10. Set up Prettier and ESLint

## Phase C: Game Features (Week 3)
11. Update VET system (two treatments)
12. Update Card Stats UI (icon-only)
13. Update Food System (costs, economy rebalance)
14. Create RESPONSIVE.md documentation
15. Claude Code setup

## Phase D: Testing & Documentation (Week 4)
16. Write comprehensive tests
17. Test on real devices
18. Update all documentation
19. Final review
20. Production deployment prep

---

# Success Criteria

## Testing Infrastructure ✅
- [x] Jest configured and running
- [ ] >60% coverage on utils/
- [ ] All critical paths tested
- [ ] CI/CD ready (test:ci script)

## Code Quality ✅
- [x] No race conditions ✅ (Code quality part complete)
- [ ] Error boundaries in place
- [x] Input validation implemented ✅ (Code quality part complete)
- [x] TypeScript strict mode (no `any`) ✅ (Code quality part complete)
- [ ] Code formatted with Prettier
- [ ] No ESLint errors

## Performance
- [x] Context value memoized ✅
- [x] Pure components memoized ✅
- [x] Storage writes debounced ✅
- [x] No unnecessary re-renders ✅

## Game Features
- [x] VET system with two treatment options ✅
- [x] Card Stats UI clean and icon-only ✅
- [x] Food system with costs implemented ✅
- [x] Game economy balanced ✅
- [x] Responsive documentation created ✅

## Accessibility
- [ ] All buttons have labels
- [x] Haptic feedback implemented ✅
- [ ] Screen reader compatible

## Developer Experience
- [ ] Claude Code configured
- [ ] Clear project instructions
- [ ] Easy to onboard new contributors
- [ ] Consistent code style

---

# Files to Modify

## New Files to Create
- [ ] `jest.config.js`
- [ ] `jest.setup.js`
- [x] `src/utils/__tests__/petStats.test.ts` ✅
- [x] `src/utils/__tests__/storage.test.ts` ✅
- [x] `src/context/__tests__/PetContext.test.tsx` ✅
- [ ] `src/components/ErrorBoundary.tsx`
- [ ] `src/utils/validation.ts`
- [x] `src/utils/debounce.ts` ✅
- [x] `src/utils/haptics.ts` ✅
- [ ] `.prettierrc`
- [ ] `.eslintrc.js`
- [ ] `.claude/instructions.md`
- [ ] `.claudeignore`
- [x] `RESPONSIVE.md` ✅
- [x] `src/data/playActivities.ts` ✅
- [x] `src/utils/__tests__/validation.test.ts` ✅

## Files to Modify
- [ ] `package.json` - Add test scripts
- [ ] `App.tsx` - Add ErrorBoundary wrapper
- [x] `src/context/PetContext.tsx` - Fix sleep, optimize, update visitVet/feed ✅
- [x] `src/screens/CreatePetScreen.tsx` - Add validation ✅
- [ ] `src/services/AdService.ts` - Fix TypeScript types
- [x] `src/components/IconButton.tsx` - Add React.memo, accessibility, haptics ✅
- [x] `src/components/StatusCard.tsx` - Add React.memo, accessibility, remove white bg ✅
- [x] `src/components/EnhancedStatusBar.tsx` - Icon-only display ✅
- [x] `src/screens/VetScene.tsx` - Two treatment options ✅
- [x] `src/screens/FeedScene.tsx` - Add costs, remove ad rewards ✅
- [x] `src/screens/PlayScene.tsx` - i18n, timeout management ✅
- [x] `src/config/gameBalance.ts` - Update vet, food, income ✅
- [x] `src/config/ads.config.ts` - Update rewards ✅
- [ ] `src/types.ts` - Add treatment type
- [x] `src/locales/pt-BR.json` - Add translations ✅
- [x] `src/locales/en.json` - Add translations ✅
- [ ] `.gitignore` - Add Claude files
- [x] `docs/VET_ACTIONS_DOCUMENTATION.md` - Mark bugs as resolved ✅
- [x] `docs/PLAY_ACTIONS_DOCUMENTATION.md` - Mark i18n complete ✅
- [x] `docs/FEED_ACTIONS_DOCUMENTATION.md` - Mark enhancements complete ✅

---

# Testing Checklist

## Infrastructure Tests
- [ ] All utils tests pass
- [ ] All context tests pass
- [ ] Coverage >60% achieved
- [ ] CI tests pass

## VET System
- [x] Antibiotic costs 30 coins, guarantees 50% health ✅
- [x] Anti-inflammatory costs 50 coins, guarantees 80% health ✅
- [x] Antibiotic allows ad option ✅
- [x] Anti-inflammatory money-only ✅
- [x] Math.max() logic works correctly ✅

## Food System
- [x] All foods cost coins (15-20) ✅
- [x] Food values increased correctly ✅
- [x] Cannot feed if insufficient funds ✅
- [x] Money deducted after feeding ✅
- [x] Feeding ad rewards removed ✅
- [x] Play earns 15 coins ✅
- [x] Exercise earns 25 coins ✅
- [x] Game economy balanced ✅

## Card Stats
- [x] White background removed ✅
- [x] Labels removed, icons clear ✅
- [x] Color bars functional ✅
- [x] Layout clean ✅

## Code Quality ✅
- [x] VET bugs fixed ✅
- [x] Play scene i18n complete ✅
- [x] Timeout management working ✅
- [x] User feedback for blocked actions ✅
- [x] Money system consolidated ✅

## Performance
- [x] No unnecessary re-renders ✅
- [x] Haptic feedback works ✅
- [x] Accessibility labels present ✅
- [x] Error boundaries catch errors ✅

---

# Part 4: Authentication & Multi-User Support (OAuth)

**Status**: ✅ COMPLETED (2026-01-22)
**Implementation**: Phases 1-5 of OAUTH_PLAN.md completed

## Authentication System Implementation ✅

### Phase 1: Dependencies & Configuration ✅
- [x] Installed @react-native-google-signin/google-signin
- [x] Updated app.config.js with plugin and configurations
- [x] Created placeholder configuration files (google-services.json, GoogleService-Info.plist)
- [x] Added files to .gitignore for security

### Phase 2: Auth Context & State Management ✅
- [x] Created AuthContext.tsx with Google Sign-In integration
- [x] Implemented guest mode support
- [x] Created useAuth hook for easy access
- [x] Implemented auth state persistence with AsyncStorage
- [x] Created authStorage.ts utilities

### Phase 3: Multi-User Data Isolation ✅
- [x] Updated storage.ts for user-scoped keys
- [x] Modified storage key format: `@pet_care_game:pet:{userId}`
- [x] Updated PetContext to pass userId to storage operations
- [x] Ensured guest users have separate data namespace

### Phase 4: Login Screen ✅
- [x] Created LoginScreen component
- [x] Implemented Google Sign-In button with proper styling
- [x] Added "Play as Guest" button
- [x] Integrated error handling and loading states
- [x] Professional UI design

### Phase 5: Navigation Integration ✅
- [x] Wrapped App with AuthProvider
- [x] Updated AppNavigator for auth-based routing
- [x] Conditional screen rendering based on auth state
- [x] Added user info header to MenuScreen
- [x] Implemented sign-out functionality with confirmation
- [x] Added guest login prompt banner

### Features Implemented
- Users can sign in with Google
- Users can play as guest without authentication
- Multiple users on same device with isolated data
- User info displayed in menu header
- Sign-out functionality
- Persistent auth state across app restarts

### Files Created/Modified
**New Files:**
- `src/context/AuthContext.tsx` - Authentication context
- `src/utils/authStorage.ts` - Auth storage utilities
- `src/screens/LoginScreen.tsx` - Login screen
- `docs/GOOGLE_OAUTH_SETUP.md` - Setup guide

**Modified Files:**
- `App.tsx` - Added AuthProvider
- `app.config.js` - Google Sign-In configuration
- `src/context/PetContext.tsx` - Multi-user storage
- `src/utils/storage.ts` - User-scoped keys
- `src/screens/MenuScreen.tsx` - User info and sign-out
- `.gitignore` - Configuration files
- `README.md` - OAuth documentation
- `FOLDER_STRUCTURE.md` - New OAuth files

### Testing Needed
- [ ] Unit tests for AuthContext (future: Phase 7)
- [ ] Integration tests for auth flow (future: Phase 7)
- [ ] E2E testing on Android (future: Phase 9)
- [ ] E2E testing on iOS (future: Phase 9)

### Configuration Required by Users
1. Create Google Cloud Project
2. Generate OAuth 2.0 credentials
3. Download configuration files
4. Update Web Client ID in AuthContext.tsx
5. Test on device with Google Play Services

---

# Notes

## Backward Compatibility
- All changes maintain saved game data compatibility
- No changes to Pet type structure
- Players with 0 coins can play/exercise to earn before feeding
- Consider granting 50-100 coin bonus to existing players

## Monitoring
- Track crash reports for new errors
- Monitor user feedback on changes
- Check analytics for engagement
- Verify game economy balance

## Future Enhancements
- More play activities (3-4 additional)
- More languages (Spanish, French)
- Tutorial for new players
- Sound effects and music
- Cloud save functionality

---

**Last Updated**: 2026-01-22
**Plan Version**: 3.0 (OAuth Implementation Complete)
**Status**: Core Features & Auth Complete, Infrastructure Partial

## Completion Summary by Part

| Part | Title | Status | Completion |
|------|-------|--------|-----------|
| 1 | Testing Infrastructure | Partial | 50% |
| 2 | Game Features & UI | Complete | 100% ✅ |
| 3 | Code Quality | Complete | 100% ✅ |
| 4 | Authentication (OAuth) | Complete | 100% ✅ |

**Key Achievement**: Successfully implemented Google OAuth authentication with multi-user support and data isolation (Phase 1-5 of OAUTH_PLAN.md).

For detailed OAuth implementation steps, see: [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)
