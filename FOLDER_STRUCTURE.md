# Pet Care Game - Folder Structure Documentation

This document provides a comprehensive overview of the project's folder structure, explaining the purpose of each directory and the types of files they contain.

## Project Overview

The Pet Care Game is a React Native/Expo application built with TypeScript. The project follows a standard React Native architecture with clear separation of concerns.

## Root Directory Structure

```
pet-care-game/
├── assets/              # Static assets (images, sprites, backgrounds)
├── src/                 # Source code
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

**Examples:**
- Cat sprite sheets for animations
- Background images for different scenes (park, home, etc.)
- Clothing items for pet customization
- UI elements and icons

---

### `/src` - Source Code

The main source directory containing all application code.

```
src/
├── components/         # Reusable React components
├── screens/           # Screen-level components
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── services/          # Business logic and external services
├── utils/             # Utility functions and helpers
├── data/              # Static data and configurations
├── config/            # App configuration files
└── types/             # TypeScript type definitions
```

---

### `/src/components` - Reusable Components

Contains UI components that are used across multiple screens.

**Files:**
- `PetRenderer.tsx` - Renders the pet with customizations (clothes, accessories)
- `StatusBar.tsx` - Displays pet status (hunger, happiness, cleanliness)
- `IconButton.tsx` - Reusable button component with icon support
- `ConfirmModal.tsx` - Confirmation dialog modal
- `SpriteSheetAnimation.tsx` - Handles sprite sheet animations
- `BannerAd.tsx` - Banner advertisement component
- `RewardedAdButton.tsx` - Button that triggers rewarded ads

**Purpose:** Promotes code reusability and maintains consistent UI across the app.

**Example Usage:**
```typescript
import { PetRenderer } from '../components/PetRenderer';
import { StatusBar } from '../components/StatusBar';

// In your screen component
<StatusBar hunger={pet.hunger} happiness={pet.happiness} cleanliness={pet.cleanliness} />
<PetRenderer pet={pet} />
```

---

### `/src/screens` - Screen Components

Contains full-screen components that represent different views in the application.

**Files:**
- `HomeScreen.tsx` - Main home screen showing the pet
- `MenuScreen.tsx` - Navigation menu for different activities
- `CreatePetScreen.tsx` - Pet creation and customization screen
- `FeedScene.tsx` - Feeding interaction screen
- `BathScene.tsx` - Bathing/cleaning interaction screen
- `PlayScene.tsx` - Play interaction screen
- `WardrobeScene.tsx` - Clothing customization screen
- `BackgroundScene.tsx` - Background selection screen

**Purpose:** Each screen represents a distinct user interaction flow or feature.

**Example Navigation:**
```typescript
// Navigating between screens
navigation.navigate('FeedScene');
navigation.navigate('WardrobeScene');
```

---

### `/src/context` - React Context Providers

Contains Context API providers for global state management.

**Files:**
- `PetContext.tsx` - Manages pet state (hunger, happiness, cleanliness, appearance)
- `AdContext.tsx` - Manages advertisement state and functionality
- `ToastContext.tsx` - Manages toast notifications

**Purpose:** Provides shared state across the application without prop drilling.

**Example Usage:**
```typescript
import { usePet } from '../context/PetContext';

function MyComponent() {
  const { pet, feedPet, bathePet } = usePet();

  return (
    <Button onPress={() => feedPet('apple')} />
  );
}
```

---

### `/src/hooks` - Custom React Hooks

Contains reusable custom hooks for common functionality.

**Files:**
- `useBackButton.tsx` - Handles Android back button behavior
- `useNavigationList.ts` - Navigation helper hook
- `useRewardedAd.ts` - Hook for managing rewarded advertisements

**Purpose:** Encapsulates reusable logic and side effects.

**Example Usage:**
```typescript
import { useRewardedAd } from '../hooks/useRewardedAd';

function RewardButton() {
  const { showRewardedAd, isAdLoaded } = useRewardedAd();

  return (
    <Button
      disabled={!isAdLoaded}
      onPress={() => showRewardedAd('double_coins')}
    />
  );
}
```

---

### `/src/services` - Business Logic & Services

Contains service layer code for complex business logic and external integrations.

**Files:**
- `AdService.ts` - Advertisement integration (AdMob)

**Purpose:** Separates business logic from UI components, handles external API integrations.

**Example Usage:**
```typescript
import { AdService } from '../services/AdService';

// Initialize ads
await AdService.initialize();

// Show rewarded ad
await AdService.showRewardedAd('reward_id');
```

---

### `/src/utils` - Utility Functions

Contains helper functions and utilities used throughout the app.

**Files:**
- `storage.ts` - AsyncStorage wrapper functions
- `age.ts` - Pet age calculation utilities

**Purpose:** Provides reusable utility functions for common operations.

**Example Usage:**
```typescript
import { saveData, loadData } from '../utils/storage';

// Save pet data
await saveData('petData', { name: 'Fluffy', type: 'cat' });

// Load pet data
const petData = await loadData('petData');
```

---

### `/src/data` - Static Data

Contains static data, constants, and configuration objects.

**Files:**
- `clothingItems.ts` - Available clothing items and accessories

**Purpose:** Centralizes static data for easy maintenance and updates.

**Example Structure:**
```typescript
// clothingItems.ts
export const clothingItems = [
  { id: 'hat_01', name: 'Red Hat', category: 'hat', price: 100 },
  { id: 'shirt_01', name: 'Blue Shirt', category: 'shirt', price: 150 },
];
```

---

### `/src/config` - Configuration Files

Contains application configuration settings.

**Files:**
- `ads.config.ts` - Advertisement configuration (Ad Unit IDs, settings)

**Purpose:** Centralizes configuration for easy environment management.

**Example Usage:**
```typescript
// ads.config.ts
export const ADS_CONFIG = {
  bannerAdUnitId: process.env.BANNER_AD_UNIT_ID,
  rewardedAdUnitId: process.env.REWARDED_AD_UNIT_ID,
};
```

---

### `/src/types` - TypeScript Type Definitions

Contains TypeScript type definitions and interfaces.

**Files:**
- `ads.ts` - Advertisement-related type definitions
- `types.ts` (in src root) - General type definitions

**Purpose:** Provides type safety and better IDE support.

**Example:**
```typescript
// ads.ts
export interface AdConfig {
  unitId: string;
  enabled: boolean;
}

export type AdType = 'banner' | 'interstitial' | 'rewarded';
```

---

## File Naming Conventions

- **Components/Screens:** PascalCase (e.g., `PetRenderer.tsx`, `HomeScreen.tsx`)
- **Hooks:** camelCase with 'use' prefix (e.g., `useBackButton.tsx`)
- **Utilities:** camelCase (e.g., `storage.ts`, `age.ts`)
- **Types:** camelCase or PascalCase (e.g., `ads.ts`)
- **Config:** camelCase with '.config' suffix (e.g., `ads.config.ts`)

## Adding New Files

When adding new files to the project, follow these guidelines:

1. **New Component:** Place in `/src/components` if reusable, or `/src/screens` if it's a full screen
2. **New Feature:** Consider creating a new service in `/src/services` for complex logic
3. **New Data:** Add to `/src/data` for static content
4. **New Types:** Add to appropriate file in `/src/types`
5. **New Asset:** Place in `/assets` or appropriate subdirectory

## Architecture Pattern

The project follows a component-based architecture with:

- **Presentation Layer:** Components and Screens
- **State Management:** Context API (PetContext, AdContext, ToastContext)
- **Business Logic:** Services and Hooks
- **Data Layer:** Utils (storage) and Static Data

This structure promotes:
- Code reusability
- Separation of concerns
- Easy testing
- Maintainability
- Scalability

## Quick Reference

| Need to... | Look in... |
|------------|------------|
| Add a reusable UI component | `/src/components` |
| Create a new screen | `/src/screens` |
| Add global state | `/src/context` |
| Add reusable logic | `/src/hooks` |
| Integrate external service | `/src/services` |
| Add utility function | `/src/utils` |
| Add static data | `/src/data` |
| Configure the app | `/src/config` |
| Define types | `/src/types` |
| Add images/sprites | `/assets` |

---

**Last Updated:** 2026-01-14
**Version:** 1.0.0
