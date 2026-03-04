# Lilly's Box - Folder Structure Documentation

This document provides a comprehensive overview of the project's folder structure, explaining the purpose of each directory and the types of files they contain.

## Project Overview

The Lilly's Box is a React Native/Expo application built with TypeScript. The project follows a standard React Native architecture with clear separation of concerns.

## Root Directory Structure

```
lillys-box/
├── assets/              # Static assets (images, sprites, backgrounds)
├── src/                 # Source code
├── docs/                # Project documentation
├── App.tsx              # Main application entry point
├── app.config.js        # Expo configuration
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## Detailed Folder Structure

### `/assets` - Static Assets

Contains all static resources used in the application, including images, sprites, and backgrounds.

```
assets/
├── backgrounds/         # Background images for scenes
├── sprites/            # Character and item sprites
│   ├── backgrounds/    # Sprite versions of backgrounds
│   ├── cats/           # Cat character sprites
│   ├── dogs/           # Dog character sprites
│   ├── clothes/        # Clothing and accessory sprites
│   └── sponge.png      # Individual sprite files
├── icon.png            # App icon
├── splash.png          # Splash screen image
└── adaptive-icon.png   # Adaptive icon for Android
```

**Purpose:** Centralized location for all visual assets, organized by category for easy management.

---

### `/src` - Source Code

The main source directory containing all application code.

```
src/
├── components/         # Reusable React components (+ __tests__)
├── screens/           # Screen-level components
├── context/           # React Context providers
├── hooks/             # Custom React hooks (+ __tests__)
├── services/          # Business logic and external services
├── utils/             # Utility functions and helpers (+ __tests__)
├── data/              # Static data and configurations
├── config/            # App configuration files
├── types/             # TypeScript type definitions
└── locales/           # i18n translation files
```

---

### `/src/components` - Reusable Components

Contains UI components that are used across multiple screens.

**Files:**
- `BannerAd.tsx` - Banner advertisement component
- `ConfirmModal.tsx` - Confirmation dialog modal
- `EnhancedStatusBar.tsx` - Improved status bar component
- `ErrorBoundary.tsx` - Error boundary for crash handling
- `GifPicker.tsx` - Tenor GIF search modal for review attachments (with error/retry state)
- `IconButton.tsx` - Reusable button component with icon support
- `LanguageSelector.tsx` - Component for changing app language
- `MediaAttachment.tsx` - Image/GIF strip component for reviews
- `PetRenderer.tsx` - Renders the pet with customizations (clothes, accessories)
- `RewardedAdButton.tsx` - Button that triggers rewarded ads
- `ScreenHeader.tsx` - Standard header for screens
- `SettingsModal.tsx` - Settings modal (audio, language, interface preferences)
- `SpriteSheetAnimation.tsx` - Handles sprite sheet animations
- `StarRating.tsx` - Interactive star rating widget (1-5 stars)
- `StatusBar.tsx` - Displays pet status (hunger, happiness, cleanliness)
- `StatusCard.tsx` - Card component for displaying individual stats

**Purpose:** Promotes code reusability and maintains consistent UI across the app.

---

### `/src/screens` - Screen Components

Contains full-screen components that represent different views in the application.

**Files:**
- `LoginScreen.tsx` - Authentication screen with Google Sign-In and guest mode
- `HomeScreen.tsx` - Main home screen showing the pet
- `MenuScreen.tsx` - Navigation menu for different activities (includes user info header and sign-out)
- `CreatePetScreen.tsx` - Pet creation and customization screen
- `FeedScene.tsx` - Feeding interaction screen
- `BathScene.tsx` - Bathing/cleaning interaction screen
- `PlayScene.tsx` - Play interaction screen
- `SleepScene.tsx` - Sleeping interaction screen
- `VetScene.tsx` - Veterinary interaction screen
- `WardrobeScene.tsx` - Clothing customization screen
- `GameReviewsScreen.tsx` - Full reviews list per game
- `GameSelectionScreen.tsx` - Game hub with reviews integration and UI variant persistence

**Purpose:** Each screen represents a distinct user interaction flow or feature.

**Authentication Flow:**
- Users see `LoginScreen` before authentication
- After login/guest mode, `MenuScreen` becomes the entry point
- User info displayed in header with sign-out option

---

### `/src/context` - React Context Providers

Contains Context API providers for global state management.

**Files:**
- `AdContext.tsx` - Manages advertisement state and functionality
- `AuthContext.tsx` - Manages Google OAuth authentication and guest mode
- `LanguageContext.tsx` - Manages language selection and i18n state
- `PetContext.tsx` - Manages pet state (hunger, happiness, cleanliness, appearance) with user-scoped storage
- `ToastContext.tsx` - Manages toast notifications

**Purpose:** Provides shared state across the application without prop drilling.

**Auth Context Features:**
- Google Sign-In integration
- Guest mode support
- User data isolation
- Auth state persistence

---

### `/src/hooks` - Custom React Hooks

Contains reusable custom hooks for common functionality.

**Files:**
- `useAudio.ts` - Audio playback hook (sound effects + background music)
- `useBackButton.tsx` - Handles Android back button behavior
- `useDoubleReward.tsx` - Hook for handling double reward logic
- `useGameBestScore.ts` - Shared hook for per-user best score persistence (used by all 29 game contexts)
- `useNavigationList.ts` - Navigation helper hook
- `usePetActions.ts` - **Unified hook for all pet actions** (animation, validation, rewards)
- `useResponsive.ts` - Hook for responsive design
- `useReview.ts` - Review state management hook
- `useRewardedAd.ts` - Hook for managing rewarded advertisements
- `useSpriteSheet.ts` - Sprite sheet loading and animation hook

**Purpose:** Encapsulates reusable logic and side effects. The `usePetActions` hook provides centralized action management, reducing code duplication by ~90% across action scenes. The `useGameBestScore` hook eliminates ~60 lines of duplicated AsyncStorage logic per game context.

---

### `/src/services` - Business Logic & Services

Contains service layer code for complex business logic and external integrations.

**Files:**
- `AdService.ts` - Advertisement integration (AdMob) with env-var-based config
- `AudioService.ts` - Background music and sound effects management (expo-av)
- `ErrorService.ts` - Centralized error handling with Sentry integration
- `ReviewService.ts` - Review data layer (AsyncStorage + Firebase Firestore)

**Purpose:** Separates business logic from UI components, handles external API integrations.

---

### `/src/utils` - Utility Functions

Contains helper functions and utilities used throughout the app.

**Files:**
- `age.ts` - Pet age calculation utilities
- `authStorage.ts` - AsyncStorage wrapper for authentication state
- `debounce.ts` - Utility for debouncing functions
- `haptics.ts` - Haptic feedback utilities
- `logger.ts` - Logging utility
- `migration.ts` - Data migration utilities
- `petStats.ts` - Pet statistics calculation
- `storage.ts` - AsyncStorage wrapper functions with user-scoped keys
- `validation.ts` - Input validation utilities

**Purpose:** Provides reusable utility functions for common operations.

**Auth Storage Features:**
- Save/load/clear auth state
- Persist user information across app restarts
- Handle multi-user scenarios

---

### `/src/data` - Static Data

Contains static data, constants, and configuration objects.

**Files:**
- `clothingItems.ts` - Available clothing items and accessories
- `foodItems.ts` - Available food items
- `playActivities.ts` - Available play activities

**Purpose:** Centralizes static data for easy maintenance and updates.

---

### `/src/config` - Configuration Files

Contains application configuration settings.

**Files:**
- `actionConfig.ts` - **Centralized action configuration** (animations, messages, rewards)
- `ads.config.ts` - Advertisement configuration (Ad Unit IDs, settings)
- `constants.ts` - General app constants (thresholds, timers, colors)
- `gameBalance.ts` - Game balance configuration (stats, costs, rewards)
- `responsive.ts` - Responsive design constants

**Purpose:** Centralizes configuration for easy environment management and game balancing. All magic numbers have been replaced with named constants.

---

### `/src/types` - TypeScript Type Definitions

Contains TypeScript type definitions and interfaces.

**Files:**
- `ads.ts` - Advertisement-related type definitions
- `navigation.ts` - Navigation-related type definitions
- `review.ts` - Review system type definitions (Review, ReviewMedia, ReviewSummary)
- `types.ts` (in src root) - General type definitions

**Purpose:** Provides type safety and better IDE support.

---

### `/src/locales` - i18n Translations

Contains translation files for internationalization.

**Files:**
- `en.json` - English translations
- `pt-BR.json` - Portuguese (Brazil) translations

---

### `/scripts` - Developer & CI Tooling

Contains Node.js helper scripts used in local development and CI pipelines.

```
scripts/
└── check-locale-keys.js   # CI helper: deep-diffs all locales/*.json against en.json
```

**Files:**
- `check-locale-keys.js` - Recursively flattens all keys in each locale file and compares them against `en.json`. Exits with code `1` if any locale has missing or extra keys. Run via `pnpm check-locale` or `node scripts/check-locale-keys.js`.

**Purpose:** Prevents i18n key drift between locale files from shipping undetected. Intended to be run in CI on every PR (see `.github/workflows/maestro.yml` quality job).

---

## File Naming Conventions

- **Components/Screens:** PascalCase (e.g., `PetRenderer.tsx`, `HomeScreen.tsx`)
- **Hooks:** camelCase with 'use' prefix (e.g., `useBackButton.tsx`)
- **Utilities:** camelCase (e.g., `storage.ts`, `age.ts`)
- **Types:** camelCase or PascalCase (e.g., `ads.ts`)
- **Config:** camelCase with '.config' suffix or descriptive name (e.g., `ads.config.ts`)

## Architecture Pattern

The project follows a component-based architecture with:

- **Presentation Layer:** Components and Screens
- **State Management:** Context API (PetContext, AdContext, ToastContext, LanguageContext)
- **Business Logic:** Services and Hooks
- **Data Layer:** Utils (storage) and Static Data

This structure promotes:
- Code reusability
- Separation of concerns
- Easy testing
- Maintainability
- Scalability

---

---

## Recent Updates (OAuth Implementation)

### New Authentication System
- **AuthContext** (`src/context/AuthContext.tsx`): Manages Google OAuth and guest mode
- **LoginScreen** (`src/screens/LoginScreen.tsx`): Handles authentication UI
- **authStorage** (`src/utils/authStorage.ts`): Persists auth state
- **User-scoped Storage**: Pet data now isolated per user
- **Multi-user Support**: Multiple users can play on same device with separate data

### Modified Files for OAuth
- `PetContext.tsx`: Now uses user ID for storage operations
- `storage.ts`: Updated to namespace keys by user ID
- `MenuScreen.tsx`: Added user info header and sign-out functionality
- `App.tsx`: Integrated AuthProvider and auth-based routing

---

## Recent Updates (Game Review System - Feb 2026)

### New Review System
- **ReviewModal** (`src/components/ReviewModal.tsx`): Bottom sheet modal for writing reviews
- **StarRating** (`src/components/StarRating.tsx`): Interactive 1-5 star rating widget
- **MediaAttachment** (`src/components/MediaAttachment.tsx`): Image/GIF strip for review attachments
- **GifPicker** (`src/components/GifPicker.tsx`): Tenor API integration for GIF search
- **useReview** (`src/hooks/useReview.ts`): Review state management hook
- **ReviewService** (`src/services/ReviewService.ts`): Data layer with AsyncStorage + Firebase Firestore
- **GameReviewsScreen** (`src/screens/GameReviewsScreen.tsx`): Full reviews list per game
- **GameSelectionScreen**: Integrated with reviews (show ratings on game cards)

### Features Implemented
- Star ratings (1-5)
- Text comments (max 500 chars)
- Image attachments via expo-image-picker
- GIF search via Tenor API
- Firebase Firestore sync for cloud backup
- Helpful reactions on reviews
- Sort reviews (recent, helpful, highest, lowest)
- Delete and update own reviews
- Moderation flag button

**Last Updated:** 2026-03-02
