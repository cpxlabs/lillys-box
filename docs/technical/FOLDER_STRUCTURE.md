# Project Structure

Comprehensive guide to Lilly's Box folder structure and architecture.

## Project Overview

Lilly's Box is a React Native/Expo application built with TypeScript. It follows a component-based architecture with clear separation of concerns.

## Root Directory

```
pet-care-game/
├── app/                 # App source (React Native/Expo)
├── backend/             # Backend services (if applicable)
├── docs/                # Documentation (you are here)
├── scripts/             # Developer tooling
├── CONTRIBUTING.md      # Contribution guidelines
├── README.md            # Project overview
└── package.json         # Root dependencies
```

## App Structure

```
app/
├── src/                 # Application source code
├── assets/              # Static assets (sprites, sounds, etc.)
├── app/                 # Expo Router app directory
├── __mocks__/           # Jest mocks for testing
├── docs/                # (Legacy) Old docs - see /docs
├── app.config.js        # Expo configuration
├── package.json         # App dependencies
├── tsconfig.json        # TypeScript config
├── jest.config.js       # Jest testing config
└── README.md            # App-specific README
```

## Source Code (`/src`)

### Directory Map

```
src/
├── components/          # Reusable UI components
├── screens/            # Full-screen views
├── context/            # React Context (state)
├── hooks/              # Custom React hooks
├── services/           # Business logic & APIs
├── utils/              # Helper functions
├── data/               # Static data
├── config/             # App configuration
├── types/              # TypeScript definitions
├── locales/            # i18n translations
└── gameRegistrations.ts # Game context registration
```

## Components (`/src/components`)

Reusable UI components used across screens:

| Component | Purpose |
|-----------|---------|
| `BannerAd` | Advertisement banner |
| `ConfirmModal` | Confirmation dialog |
| `ErrorBoundary` | Crash handling |
| `IconButton` | Reusable button with icon |
| `LanguageSelector` | Change app language |
| `PetRenderer` | Render pet with clothes/accessories |
| `RewardedAdButton` | Trigger rewarded ads |
| `ScreenHeader` | Standard screen header |
| `SettingsModal` | Audio, language, interface settings |
| `SpriteSheetAnimation` | Sprite sheet animation handler |
| `StatusCard` | Display individual stat |
| `StatusBar` | Pet status (hunger, happiness, etc.) |
| `StarRating` | 1-5 star rating widget |

All components follow:
- TypeScript for type safety
- Props-based configuration
- Reusability across screens
- Consistent styling

## Screens (`/src/screens`)

Full-screen views representing distinct interactions:

| Screen | Purpose |
|--------|---------|
| `LoginScreen` | Google OAuth + guest mode |
| `MenuScreen` | Main navigation hub |
| `HomeScreen` | Pet display & cuddle |
| `CreatePetScreen` | Pet creation |
| `FeedScene` | Feed pet action |
| `BathScene` | Bath pet action |
| `PlayScene` | Play with pet |
| `SleepScene` | Pet sleep |
| `VetScene` | Veterinary care |
| `WardrobeScene` | Change pet clothes |
| `GameSelectionScreen` | Game hub with reviews |
| `GameReviewsScreen` | Full reviews list |

**Navigation Flow:**
1. LoginScreen (authentication)
2. MenuScreen (entry point)
3. HomeScreen (pet view)
4. Action screens (feed, play, etc.)
5. Games → Reviews

## Context (`/src/context`)

Global state management via React Context:

| Context | Purpose |
|---------|---------|
| `AuthContext` | Google OAuth & guest mode |
| `PetContext` | Pet state (user-scoped) |
| `AdContext` | Advertisement state |
| `LanguageContext` | i18n language selection |
| `ToastContext` | Toast notifications |

Each context has:
- Provider component (wraps app)
- Custom hook (useAuth, usePet, etc.)
- Persistent state (AsyncStorage)
- Type definitions

## Hooks (`/src/hooks`)

Custom React hooks encapsulating reusable logic:

| Hook | Purpose |
|------|---------|
| `useAuth` | Auth state & sign-in/out |
| `useAudio` | Sound effects & music |
| `usePetActions` | **All pet actions** (feed, play, etc.) |
| `useGameBestScore` | Per-user high score persistence |
| `useResponsive` | Responsive layout helpers |
| `useBackButton` | Android back button |
| `useRewardedAd` | Rewarded ad management |
| `useReview` | Review state management |
| `useSpriteSheet` | Sprite animation loading |

**Key Achievements:**
- `usePetActions`: Consolidated 200+ lines of duplicated action logic across 7 scenes into one reusable hook (-87-94% per scene)
- `useGameBestScore`: Eliminates ~60 lines of AsyncStorage duplication per game context

## Services (`/src/services`)

Business logic layer for complex operations:

| Service | Purpose |
|---------|---------|
| `AdService` | AdMob integration |
| `AudioService` | expo-av audio playback |
| `ReviewService` | AsyncStorage + Firestore |
| `ErrorService` | Error handling & reporting |

Services handle:
- External API integration
- Config-based initialization
- Error handling
- Data transformation

## Utils (`/src/utils`)

Helper functions for common operations:

| Utility | Purpose |
|---------|---------|
| `age.ts` | Pet age calculation |
| `authStorage.ts` | Auth state persistence |
| `storage.ts` | Pet data (AsyncStorage) |
| `debounce.ts` | Function debouncing |
| `haptics.ts` | Haptic feedback |
| `logger.ts` | Logging |
| `migration.ts` | Data migrations |
| `petStats.ts` | Stat calculations |
| `validation.ts` | Input validation |

All utilities:
- Export pure functions
- Are extensively tested
- Handle errors gracefully
- Support both guest & user data

## Config (`/src/config`)

Centralized configuration files:

| Config | Purpose |
|--------|---------|
| `actionConfig.ts` | Pet action settings (rewards, animations) |
| `ads.config.ts` | Ad unit IDs, settings |
| `constants.ts` | App constants (colors, timers, thresholds) |
| `gameBalance.ts` | Game balance (costs, rewards) |
| `responsive.ts` | Responsive breakpoints |

**Benefits:**
- No "magic numbers" in code
- Easy game balancing
- Environment variable support
- Type-safe configuration

## Data (`/src/data`)

Static data and lookup tables:

| Data | Purpose |
|------|---------|
| `clothingItems.ts` | Pet clothes/accessories catalog |
| `foodItems.ts` | Food catalog |
| `playActivities.ts` | Available play activities |

## Types (`/src/types`)

TypeScript definitions for type safety:

| Types | Defines |
|-------|---------|
| `types.ts` | Pet, Stat, User interfaces |
| `ads.ts` | Ad-related types |
| `review.ts` | Review, ReviewMedia interfaces |
| `navigation.ts` | Navigator types |

## Locales (`/src/locales`)

Internationalization (i18n) translation files:

```json
// en.json (English)
{
  "screens": {
    "home": "Home",
    "menu": "Menu"
  },
  "actions": {
    "feed": "Feed",
    "play": "Play"
  }
}
```

```json
// pt-BR.json (Portuguese)
{
  "screens": {
    "home": "Casa",
    "menu": "Menu"
  },
  "actions": {
    "feed": "Alimentar",
    "play": "Brincar"
  }
}
```

Validation via CI: `pnpm check-locale` ensures all keys are synchronized.

## Assets (`/assets`)

Static resources organized by type:

```
assets/
├── sprites/
│   ├── cats/           # Cat character sprites
│   ├── dogs/           # Dog character sprites
│   ├── clothes/        # Clothing/accessories
│   ├── food/           # Food items
│   ├── toys/           # Toy sprites
│   └── backgrounds/    # Scene backgrounds
├── sounds/
│   ├── music/          # Background music
│   ├── ui/             # UI sounds
│   ├── activities/     # Action sounds
│   └── pet/            # Pet sounds (barking, etc.)
└── icon.png            # App icon
```

## App Directory (`/app`)

Expo Router setup (file-based routing):

```
app/
├── _layout.tsx         # Root layout & AppNavigator
├── index.tsx           # Redirect to login or menu
├── login.tsx           # LoginScreen route
└── game/
    └── [gameId].tsx    # Game screen parameterized route
```

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `PetRenderer.tsx` |
| Screens | PascalCase | `HomeScreen.tsx` |
| Hooks | camelCase + 'use' | `useAudio.ts` |
| Utils | camelCase | `storage.ts` |
| Contexts | PascalCase | `PetContext.tsx` |
| Types | PascalCase | `Pet`, `Stat` |
| Configs | camelCase + '.config' | `ads.config.ts` |

## Architecture Layers

```
Presentation (UI)
    ├── Screens (full-screen views)
    └── Components (reusable UI)
         │
State Management
    ├── Context (global state)
    └── Hooks (logic encapsulation)
         │
Business Logic
    ├── Services (complex operations)
    └── Utils (helper functions)
         │
Data Layer
    ├── AsyncStorage (local persistence)
    ├── Firestore (cloud sync)
    └── Static Data (constants, configs)
```

## Recent Features

### OAuth Authentication (2025-12)

- `AuthContext`: Google Sign-In integration
- `LoginScreen`: New login UI
- User-scoped data isolation
- Multi-user support
- Guest mode

**Files Added:**
- `src/context/AuthContext.tsx`
- `src/screens/LoginScreen.tsx`
- `src/utils/authStorage.ts`

### Game Review System (2026-02)

- `ReviewModal`: Bottom sheet for writing reviews
- `StarRating`: 1-5 star widget
- `ReviewService`: AsyncStorage + Firestore
- Review ratings on game cards
- Full reviews list screen

**Files Added:**
- `src/components/ReviewModal.tsx`
- `src/components/StarRating.tsx`
- `src/components/MediaAttachment.tsx`
- `src/screens/GameReviewsScreen.tsx`
- `src/services/ReviewService.ts`

### Action Hook Consolidation (2026-01)

Unified all pet actions into `usePetActions` hook:
- Single source of truth for action logic
- Eliminated 200+ lines of duplication
- Consistent animation & reward handling
- Centralized validation

**Benefits:**
- -87-94% code reduction per action scene
- Easier to maintain and extend
- Better code quality

## Design Principles

1. **Separation of Concerns**: UI, logic, and data separated
2. **Reusability**: Hooks and components shared across screens
3. **Type Safety**: TypeScript for development confidence
4. **Testability**: Pure functions and mocked dependency injection
5. **Performance**: Debounced saves, memoized components
6. **Maintainability**: Clear naming, documentation, constants

## CI/CD Integration

- **Locale validation**: `pnpm check-locale` in CI
- **TypeScript**: Full type checking
- **ESLint**: Code quality standards
- **Jest**: Unit & integration tests
- **Expo**: Mobile & web builds

---

**Last Updated**: 2026-03-04  
**Status**: Complete
