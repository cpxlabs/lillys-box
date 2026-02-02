# Multi-Game Architecture - Implementation Tasks

## Overview
This document contains all tasks needed to transform the pet care game into a multi-game platform. Each task includes context, acceptance criteria, and implementation guidance.

**Total Phases**: 8
**Current Status**: Phase 5 Complete - Architecture Ready for Testing
**Completed Phases**: 1, 2, 3, 4, 5
**Next Phase**: Phase 6 - Refactor Pet Care Game (Optional)

---

## Phase 1: Restructure Current Code

**Goal**: Reorganize existing pet care game into new folder structure without breaking functionality

**Estimated Complexity**: Medium
**Dependencies**: None
**Risk Level**: Medium (large file moves, import updates)

### Task 1.1: Create New Folder Structure

**Context**: We need to separate app-level code (authentication, ads, navigation) from game-specific code (pet care game). This creates a clear boundary between infrastructure and game modules.

**Implementation Steps**:
1. Create new folder structure:
   ```bash
   mkdir -p src/app/context
   mkdir -p src/app/screens
   mkdir -p src/app/components
   mkdir -p src/app/services
   mkdir -p src/app/hooks
   mkdir -p src/app/registry
   mkdir -p src/games/pet-care/context
   mkdir -p src/games/pet-care/screens
   mkdir -p src/games/pet-care/components
   mkdir -p src/games/pet-care/hooks
   mkdir -p src/games/pet-care/data
   mkdir -p src/games/pet-care/config
   mkdir -p src/games/pet-care/utils
   mkdir -p src/games/pet-care/types
   mkdir -p src/games/pet-care/locales
   mkdir -p src/shared/utils
   mkdir -p src/shared/hooks
   ```

**Files Created**:
- Multiple new directories

**Acceptance Criteria**:
- [x] All new folders exist
- [x] Folder structure matches architecture plan
- [x] No files in folders yet (just structure)

**Status**: ✅ COMPLETE

---

### Task 1.2: Move App-Level Contexts

**Context**: Contexts that are shared across all games (Auth, Ads, Language, Toast) should live in the app shell, not in the game module.

**Files to Move**:
```
src/context/AuthContext.tsx       → src/app/context/AuthContext.tsx
src/context/AdContext.tsx         → src/app/context/AdContext.tsx
src/context/LanguageContext.tsx   → src/app/context/LanguageContext.tsx
src/context/ToastContext.tsx      → src/app/context/ToastContext.tsx
```

**Implementation Steps**:
1. Move each context file to new location
2. Update imports in the moved files
3. Update all files that import these contexts
4. Verify tests still reference correct paths

**Files Modified**:
- All files that import these contexts (App.tsx, screens, components)
- Test files

**Acceptance Criteria**:
- [ ] All 4 context files moved to src/app/context/
- [ ] All imports updated throughout codebase
- [ ] No broken imports
- [ ] Tests pass

---

### Task 1.3: Move Pet-Specific Context

**Context**: PetContext is specific to the pet care game and should live within the game module, not at app level.

**Files to Move**:
```
src/context/PetContext.tsx → src/games/pet-care/context/PetContext.tsx
```

**Implementation Steps**:
1. Move PetContext.tsx to game folder
2. Update imports in PetContext (relative paths may change)
3. Update all pet game screens that use PetContext
4. Keep PetContext in App.tsx for now (will change in Phase 5)

**Files Modified**:
- All pet game screens (Menu, Home, Feed, Bath, etc.)
- App.tsx (update import path)
- Test files

**Acceptance Criteria**:
- [ ] PetContext.tsx moved to src/games/pet-care/context/
- [ ] All imports updated
- [ ] Pet game still works
- [ ] Tests pass

---

### Task 1.4: Move App-Level Screens

**Context**: Only LoginScreen is truly app-level. All other screens are pet-game specific.

**Files to Move**:
```
src/screens/LoginScreen.tsx → src/app/screens/LoginScreen.tsx
```

**Implementation Steps**:
1. Move LoginScreen to app screens folder
2. Update imports in LoginScreen
3. Update App.tsx or AppNavigator to import from new location

**Files Modified**:
- App.tsx or navigation file
- Test files

**Acceptance Criteria**:
- [ ] LoginScreen moved to src/app/screens/
- [ ] Imports updated
- [ ] Login flow works
- [ ] Tests pass

---

### Task 1.5: Move Pet Game Screens

**Context**: All pet-related screens should live in the pet-care game module.

**Files to Move**:
```
src/screens/MenuScreen.tsx        → src/games/pet-care/screens/MenuScreen.tsx
src/screens/CreatePetScreen.tsx   → src/games/pet-care/screens/CreatePetScreen.tsx
src/screens/HomeScreen.tsx        → src/games/pet-care/screens/HomeScreen.tsx
src/screens/FeedScene.tsx         → src/games/pet-care/screens/FeedScene.tsx
src/screens/BathScene.tsx         → src/games/pet-care/screens/BathScene.tsx
src/screens/WardrobeScene.tsx     → src/games/pet-care/screens/WardrobeScene.tsx
src/screens/PlayScene.tsx         → src/games/pet-care/screens/PlayScene.tsx
src/screens/SleepScene.tsx        → src/games/pet-care/screens/SleepScene.tsx
src/screens/VetScene.tsx          → src/games/pet-care/screens/VetScene.tsx
```

**Implementation Steps**:
1. Move all pet screens to game screens folder
2. Update imports in each screen file
3. Update navigation configuration
4. Update test files

**Files Modified**:
- Navigation configuration
- All screen files (imports)
- Test files

**Acceptance Criteria**:
- [ ] All 9 pet screens moved to src/games/pet-care/screens/
- [ ] All imports updated in each screen
- [ ] Navigation works for all screens
- [ ] Tests pass

---

### Task 1.6: Move App-Level Components

**Context**: Components used across all games or for app infrastructure should be in app/components. Pet-specific components go to the game module.

**App-Level Components to Move**:
```
src/components/BannerAd.tsx           → src/app/components/BannerAd.tsx
src/components/ErrorBoundary.tsx      → src/app/components/ErrorBoundary.tsx
src/components/ConfirmModal.tsx       → src/app/components/ConfirmModal.tsx
src/components/IconButton.tsx         → src/app/components/IconButton.tsx
src/components/LanguageSelector.tsx   → src/app/components/LanguageSelector.tsx
src/components/RewardedAdButton.tsx   → src/app/components/RewardedAdButton.tsx
```

**Implementation Steps**:
1. Move each component to app components folder
2. Update imports in component files
3. Update all files that import these components
4. Update test files

**Files Modified**:
- Screens and other components that use these
- Test files

**Acceptance Criteria**:
- [ ] All 6 app components moved to src/app/components/
- [ ] Imports updated
- [ ] Components render correctly
- [ ] Tests pass

---

### Task 1.7: Move Pet Game Components

**Context**: Components specific to pet care game should live in the game module.

**Pet-Specific Components to Move**:
```
src/components/PetRenderer.tsx              → src/games/pet-care/components/PetRenderer.tsx
src/components/StatusBar.tsx                → src/games/pet-care/components/StatusBar.tsx
src/components/StatusCard.tsx               → src/games/pet-care/components/StatusCard.tsx
src/components/SpriteSheetAnimation.tsx     → src/games/pet-care/components/SpriteSheetAnimation.tsx
src/components/SpriteSheetPreloader.tsx     → src/games/pet-care/components/SpriteSheetPreloader.tsx
src/components/ScreenHeader.tsx             → src/games/pet-care/components/ScreenHeader.tsx
src/components/EnhancedStatusBar.tsx        → src/games/pet-care/components/EnhancedStatusBar.tsx
```

**Implementation Steps**:
1. Move each pet component to game components folder
2. Update imports in component files
3. Update pet game screens that use these components
4. Update test files

**Files Modified**:
- Pet game screens
- Test files

**Acceptance Criteria**:
- [ ] All 7 pet components moved to src/games/pet-care/components/
- [ ] Imports updated
- [ ] Pet game screens render correctly
- [ ] Tests pass

---

### Task 1.8: Move App-Level Hooks

**Context**: Hooks used app-wide should be in app/hooks. Pet-specific hooks go to game module. Truly shared utilities go to shared/hooks.

**App-Level Hooks to Move**:
```
src/hooks/useRewardedAd.ts        → src/app/hooks/useRewardedAd.ts
src/hooks/useResponsive.ts        → src/app/hooks/useResponsive.ts
src/hooks/useNavigationList.ts    → src/app/hooks/useNavigationList.ts
```

**Shared Hooks to Move**:
```
src/hooks/useBackButton.tsx       → src/shared/hooks/useBackButton.tsx
```

**Implementation Steps**:
1. Move app hooks to app/hooks
2. Move shared hooks to shared/hooks
3. Update imports throughout codebase
4. Update test files

**Files Modified**:
- All files using these hooks
- Test files

**Acceptance Criteria**:
- [ ] App hooks moved to src/app/hooks/
- [ ] Shared hooks moved to src/shared/hooks/
- [ ] All imports updated
- [ ] Tests pass

---

### Task 1.9: Move Pet Game Hooks

**Context**: Hooks specific to pet care game logic should live in the game module.

**Pet-Specific Hooks to Move**:
```
src/hooks/usePetActions.ts        → src/games/pet-care/hooks/usePetActions.ts
src/hooks/useDoubleReward.tsx     → src/games/pet-care/hooks/useDoubleReward.tsx
src/hooks/useSpriteSheet.ts       → src/games/pet-care/hooks/useSpriteSheet.ts
```

**Implementation Steps**:
1. Move each pet hook to game hooks folder
2. Update imports in hook files
3. Update pet game screens/components that use these hooks
4. Update test files

**Files Modified**:
- Pet game screens and components
- Test files

**Acceptance Criteria**:
- [ ] All 3 pet hooks moved to src/games/pet-care/hooks/
- [ ] Imports updated
- [ ] Pet game functionality works
- [ ] Tests pass

---

### Task 1.10: Move Services

**Context**: AdService is app-level infrastructure (used across games).

**Files to Move**:
```
src/services/AdService.ts → src/app/services/AdService.ts
```

**Implementation Steps**:
1. Move AdService to app services folder
2. Update imports in AdService
3. Update AdContext and components that use AdService
4. Update test files

**Files Modified**:
- AdContext
- Components using AdService
- Test files

**Acceptance Criteria**:
- [ ] AdService moved to src/app/services/
- [ ] Imports updated
- [ ] Ads still work
- [ ] Tests pass

---

### Task 1.11: Move Pet Game Data

**Context**: Static game data (food items, activities, clothing) is specific to pet care game.

**Files to Move**:
```
src/data/foodItems.ts        → src/games/pet-care/data/foodItems.ts
src/data/playActivities.ts   → src/games/pet-care/data/playActivities.ts
src/data/clothingItems.ts    → src/games/pet-care/data/clothingItems.ts
```

**Implementation Steps**:
1. Move all data files to game data folder
2. Update imports in pet game screens that use this data
3. Update test files

**Files Modified**:
- FeedScene, PlayScene, WardrobeScene
- Test files

**Acceptance Criteria**:
- [ ] All 3 data files moved to src/games/pet-care/data/
- [ ] Imports updated
- [ ] Game data loads correctly
- [ ] Tests pass

---

### Task 1.12: Move Pet Game Config

**Context**: Game balance and configuration files are specific to pet care game.

**Files to Move**:
```
src/config/gameBalance.ts      → src/games/pet-care/config/gameBalance.ts
src/config/actionConfig.ts     → src/games/pet-care/config/actionConfig.ts
src/config/spriteSheets.ts     → src/games/pet-care/config/spriteSheets.ts
```

**App-Level Config to Move**:
```
src/config/ads.config.ts       → src/app/config/ads.config.ts
src/config/constants.ts        → src/app/config/constants.ts (or shared)
src/config/responsive.ts       → src/app/config/responsive.ts (or shared)
```

**Implementation Steps**:
1. Create src/app/config/ folder
2. Move pet configs to game config folder
3. Move app configs to app config folder
4. Update all imports
5. Update test files

**Files Modified**:
- All files using config (contexts, screens, components)
- Test files

**Acceptance Criteria**:
- [ ] Pet configs moved to src/games/pet-care/config/
- [ ] App configs moved to src/app/config/
- [ ] All imports updated
- [ ] Game balance works correctly
- [ ] Tests pass

---

### Task 1.13: Move Pet Game Utils

**Context**: Utilities specific to pet logic go to game module. Truly shared utilities go to shared/utils.

**Pet-Specific Utils to Move**:
```
src/utils/petStats.ts         → src/games/pet-care/utils/petStats.ts
src/utils/storage.ts          → src/games/pet-care/utils/storage.ts
src/utils/age.ts              → src/games/pet-care/utils/age.ts
src/utils/SpriteSheetManager.ts → src/games/pet-care/utils/SpriteSheetManager.ts
src/utils/migration.ts        → src/games/pet-care/utils/migration.ts
```

**Shared Utils to Move**:
```
src/utils/logger.ts           → src/shared/utils/logger.ts
src/utils/haptics.ts          → src/shared/utils/haptics.ts
src/utils/debounce.ts         → src/shared/utils/debounce.ts
src/utils/validation.ts       → src/shared/utils/validation.ts
src/utils/authStorage.ts      → src/app/utils/authStorage.ts
```

**Implementation Steps**:
1. Create src/app/utils/ folder
2. Move pet utils to game utils folder
3. Move shared utils to shared/utils folder
4. Move auth utils to app/utils folder
5. Update all imports
6. Update test files

**Files Modified**:
- PetContext, pet screens, components
- AuthContext
- Test files

**Acceptance Criteria**:
- [ ] Pet utils moved to src/games/pet-care/utils/
- [ ] Shared utils moved to src/shared/utils/
- [ ] App utils moved to src/app/utils/
- [ ] All imports updated
- [ ] Tests pass

---

### Task 1.14: Move Pet Game Types

**Context**: Type definitions specific to pet game should be in game module. Navigation types stay app-level.

**Pet-Specific Types to Move**:
```
src/types/types.ts            → src/games/pet-care/types/types.ts
```

**App-Level Types to Keep/Move**:
```
src/types/navigation.ts       → src/app/types/navigation.ts (update later)
src/types/ads.ts              → src/app/types/ads.ts
```

**Implementation Steps**:
1. Create src/app/types/ folder
2. Move pet types to game types folder
3. Move app types to app types folder
4. Update all imports
5. Update test files

**Files Modified**:
- All files using these types
- Test files

**Acceptance Criteria**:
- [ ] Pet types moved to src/games/pet-care/types/
- [ ] App types moved to src/app/types/
- [ ] All imports updated
- [ ] TypeScript compiles without errors
- [ ] Tests pass

---

### Task 1.15: Move Pet Game Locales

**Context**: Game-specific translations should be in the game module. App-level translations stay in root or move to app.

**Current Structure**:
```
src/locales/en.json
src/locales/pt-BR.json
src/i18n.ts
```

**New Structure**:
```
src/games/pet-care/locales/en.json      (pet-specific translations)
src/games/pet-care/locales/pt-BR.json   (pet-specific translations)
src/app/locales/en.json                 (app-level translations - will add later)
src/app/locales/pt-BR.json              (app-level translations - will add later)
src/app/i18n.ts                         (i18n configuration)
```

**Implementation Steps**:
1. For now, move existing locales to pet-care (they're all pet-specific)
2. Create copies for app-level use (will be minimal)
3. Move i18n.ts to app folder
4. Update imports
5. Plan for namespace separation in Phase 3

**Files Modified**:
- i18n.ts
- LanguageContext
- All files using translations

**Acceptance Criteria**:
- [ ] Pet locales moved to src/games/pet-care/locales/
- [ ] i18n.ts moved to src/app/
- [ ] Translations still work
- [ ] Both languages work correctly

---

### Task 1.16: Move Main App Files

**Context**: Core app files (App.tsx, AppNavigator) should be in app folder for clarity.

**Files to Move**:
```
App.tsx → src/app/App.tsx
(AppNavigator might be inline in App.tsx or separate)
```

**Implementation Steps**:
1. Move App.tsx to src/app/
2. Update index.js to import from new location
3. Update any relative imports in App.tsx
4. Ensure all context providers are imported correctly

**Files Modified**:
- index.js
- App.tsx (imports)

**Acceptance Criteria**:
- [ ] App.tsx in src/app/
- [ ] index.js updated
- [ ] App starts correctly
- [ ] All providers work

---

### Task 1.17: Update Test Files

**Context**: All test files need to reference new file locations.

**Directories to Update**:
```
src/components/__tests__/
src/screens/__tests__/
src/hooks/__tests__/
src/utils/__tests__/
```

**Implementation Steps**:
1. Move test files to match new source structure
2. Update imports in all test files
3. Run test suite
4. Fix any failing tests due to import issues

**Files Modified**:
- All __tests__ directories
- All test files

**Acceptance Criteria**:
- [ ] All test files moved to match source structure
- [ ] All test imports updated
- [ ] `npm test` passes
- [ ] No import errors in tests

---

### Task 1.18: Clean Up Old Directories

**Context**: After moving all files, old directories should be empty and can be removed.

**Directories to Remove**:
```
src/components/
src/screens/
src/context/
src/hooks/
src/data/
src/config/
src/services/
src/utils/
src/types/
src/locales/ (if fully moved)
```

**Implementation Steps**:
1. Verify each directory is empty
2. Remove empty directories
3. Verify app still works
4. Run tests

**Acceptance Criteria**:
- [ ] All old directories removed
- [ ] Only new structure remains
- [ ] App works correctly
- [ ] Tests pass

---

### Task 1.19: Update TypeScript Paths (Optional)

**Context**: Can add path aliases in tsconfig.json to make imports cleaner.

**Add to tsconfig.json**:
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/app/*": ["app/*"],
      "@/games/*": ["games/*"],
      "@/shared/*": ["shared/*"]
    }
  }
}
```

**Implementation Steps**:
1. Update tsconfig.json
2. Optionally update imports to use aliases
3. Verify TypeScript compilation
4. Update tests if needed

**Acceptance Criteria**:
- [ ] Path aliases configured (optional)
- [ ] TypeScript compiles
- [ ] Imports work with or without aliases

---

### Task 1.20: Phase 1 Verification

**Context**: Ensure Phase 1 is complete and nothing is broken.

**Verification Checklist**:
1. App starts without errors
2. Login flow works
3. Pet game fully functional (all scenes)
4. Ads work (banner, interstitial, rewarded)
5. Language switching works
6. All tests pass
7. TypeScript compiles without errors
8. No console errors

**Implementation Steps**:
1. Run app in development
2. Test all major user flows
3. Run test suite
4. Check TypeScript compilation
5. Document any issues

**Acceptance Criteria**:
- [ ] All verification checks pass
- [ ] No regressions in functionality
- [ ] Ready to proceed to Phase 2

---

## Phase 2: Implement Game Registry

**Goal**: Create the game registration system that allows games to register themselves with the app

**Estimated Complexity**: Low-Medium
**Dependencies**: Phase 1 complete
**Risk Level**: Low

### Task 2.1: Define Game Interface

**Context**: Need a TypeScript interface that defines what a "game" is. This is the contract all games must follow.

**File to Create**: `src/app/registry/types.ts`

**Implementation**:
```typescript
import { ComponentType } from 'react';
import { ImageSourcePropType } from 'react-native';

export type GameCategory = 'pet' | 'puzzle' | 'adventure' | 'casual' | 'arcade';

export interface GameTranslations {
  en: Record<string, any>;
  'pt-BR': Record<string, any>;
}

export interface Game {
  // Identification
  id: string;
  name: string;
  description: string;
  icon: ImageSourcePropType;
  category: GameCategory;

  // Navigation
  navigator: ComponentType<any>;
  initialRoute: string;

  // Providers (optional game-specific contexts)
  providers?: ComponentType<{ children: React.ReactNode }>[];

  // Localization
  translations: GameTranslations;

  // Metadata
  version: string;
  minAppVersion: string;
  isEnabled: boolean;

  // Optional features
  requiresAuth?: boolean;
  isPremium?: boolean;
  comingSoon?: boolean;
}

export interface GameRegistryInterface {
  register(game: Game): void;
  unregister(gameId: string): void;
  getGame(gameId: string): Game | undefined;
  getAllGames(): Game[];
  getEnabledGames(): Game[];
  getGamesByCategory(category: GameCategory): Game[];
  hasGame(gameId: string): boolean;
}
```

**Acceptance Criteria**:
- [ ] types.ts file created
- [ ] Game interface defined with all required fields
- [ ] GameRegistryInterface defined
- [ ] TypeScript compiles without errors

---

### Task 2.2: Implement GameRegistry Class

**Context**: Singleton class that manages game registration and retrieval.

**File to Create**: `src/app/registry/GameRegistry.ts`

**Implementation**:
```typescript
import { Game, GameCategory, GameRegistryInterface } from './types';

class GameRegistry implements GameRegistryInterface {
  private games: Map<string, Game> = new Map();
  private static instance: GameRegistry;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): GameRegistry {
    if (!GameRegistry.instance) {
      GameRegistry.instance = new GameRegistry();
    }
    return GameRegistry.instance;
  }

  register(game: Game): void {
    if (this.games.has(game.id)) {
      console.warn(`Game with id "${game.id}" is already registered. Skipping.`);
      return;
    }

    // Validate game object
    this.validateGame(game);

    this.games.set(game.id, game);
    console.log(`✓ Game registered: ${game.name} (${game.id})`);
  }

  unregister(gameId: string): void {
    if (this.games.has(gameId)) {
      this.games.delete(gameId);
      console.log(`✓ Game unregistered: ${gameId}`);
    }
  }

  getGame(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  getAllGames(): Game[] {
    return Array.from(this.games.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getEnabledGames(): Game[] {
    return this.getAllGames()
      .filter(game => game.isEnabled && !game.comingSoon);
  }

  getGamesByCategory(category: GameCategory): Game[] {
    return this.getAllGames()
      .filter(game => game.category === category);
  }

  hasGame(gameId: string): boolean {
    return this.games.has(gameId);
  }

  private validateGame(game: Game): void {
    const required = ['id', 'name', 'description', 'icon', 'category', 'navigator', 'initialRoute', 'translations', 'version'];

    for (const field of required) {
      if (!(field in game)) {
        throw new Error(`Game registration failed: missing required field "${field}"`);
      }
    }

    if (typeof game.id !== 'string' || game.id.trim() === '') {
      throw new Error('Game registration failed: id must be a non-empty string');
    }

    if (typeof game.isEnabled !== 'boolean') {
      throw new Error('Game registration failed: isEnabled must be a boolean');
    }
  }
}

// Export singleton instance
export const gameRegistry = GameRegistry.getInstance();
export default gameRegistry;
```

**Acceptance Criteria**:
- [ ] GameRegistry.ts created
- [ ] Singleton pattern implemented
- [ ] All interface methods implemented
- [ ] Game validation logic included
- [ ] Logging for registration events
- [ ] TypeScript compiles without errors

---

### Task 2.3: Create Registry Index File

**Context**: Export public API from registry module.

**File to Create**: `src/app/registry/index.ts`

**Implementation**:
```typescript
export { gameRegistry } from './GameRegistry';
export type { Game, GameCategory, GameTranslations, GameRegistryInterface } from './types';
```

**Acceptance Criteria**:
- [ ] index.ts created
- [ ] Exports gameRegistry and types
- [ ] Clean public API

---

### Task 2.4: Write Tests for GameRegistry

**Context**: Test game registration, validation, and retrieval.

**File to Create**: `src/app/registry/__tests__/GameRegistry.test.ts`

**Test Cases**:
1. Register a valid game
2. Prevent duplicate registration
3. Retrieve game by ID
4. Get all games (sorted by name)
5. Get enabled games only
6. Filter by category
7. Validate required fields
8. Handle invalid game objects
9. Unregister a game

**Acceptance Criteria**:
- [ ] Test file created
- [ ] All test cases implemented
- [ ] Tests pass
- [ ] Coverage >90% for GameRegistry

---

## Phase 3: Add Game Selection Screen

**Goal**: Create UI for users to select which game to play

**Estimated Complexity**: Medium
**Dependencies**: Phase 2 complete
**Risk Level**: Low

### Task 3.1: Create GameCard Component

**Context**: Reusable component to display a game option in the selection screen.

**File to Create**: `src/app/components/GameCard.tsx`

**Implementation Requirements**:
- Display game icon
- Show game name
- Show game description
- Handle press event
- Support "Coming Soon" badge
- Support "Premium" badge (future)
- Responsive design
- Accessibility labels

**Props Interface**:
```typescript
interface GameCardProps {
  game: Game;
  onPress: () => void;
  disabled?: boolean;
}
```

**Acceptance Criteria**:
- [ ] GameCard.tsx created
- [ ] Displays all game info
- [ ] Handles press events
- [ ] Shows badges appropriately
- [ ] Accessible
- [ ] Responsive

---

### Task 3.2: Create GameSelectionScreen

**Context**: Main screen that shows all available games in a grid/list.

**File to Create**: `src/app/screens/GameSelectionScreen.tsx`

**Implementation Requirements**:
- Fetch games from gameRegistry
- Display games in grid (2 columns on mobile)
- Handle game selection
- Navigate to GameContainer with gameId
- Show empty state if no games
- Loading state (if needed)
- Header with app branding
- Logout button (optional)

**Acceptance Criteria**:
- [ ] GameSelectionScreen.tsx created
- [ ] Uses gameRegistry.getEnabledGames()
- [ ] Grid layout works
- [ ] Navigation to games works
- [ ] Handles edge cases (no games, loading)

---

### Task 3.3: Add Game Selection Translations

**Context**: Add translations for the new game selection screen.

**Files to Modify**:
- `src/app/locales/en.json` (create if doesn't exist)
- `src/app/locales/pt-BR.json` (create if doesn't exist)

**Translations to Add**:
```json
{
  "gameSelection": {
    "title": "Choose Your Game",
    "subtitle": "Select a game to start playing",
    "comingSoon": "Coming Soon",
    "premium": "Premium",
    "noGames": "No games available",
    "logout": "Logout"
  }
}
```

**Acceptance Criteria**:
- [ ] App-level locale files created
- [ ] Game selection translations added
- [ ] Both languages supported
- [ ] Translations render correctly

---

### Task 3.4: Style GameSelectionScreen

**Context**: Make the game selection screen visually appealing.

**Design Considerations**:
- Clean, modern design
- Game cards with shadows/elevation
- Consistent spacing
- Brand colors
- Smooth animations (optional)
- Dark mode support (future)

**Acceptance Criteria**:
- [ ] Screen looks polished
- [ ] Consistent with app design
- [ ] Works on different screen sizes
- [ ] Smooth interactions

---

### Task 3.5: Write Tests for Game Selection

**Context**: Test the game selection screen and card component.

**Files to Create**:
- `src/app/components/__tests__/GameCard.test.tsx`
- `src/app/screens/__tests__/GameSelectionScreen.test.tsx`

**Test Cases**:
1. GameCard renders correctly
2. GameCard handles press
3. GameCard shows badges
4. GameSelectionScreen renders game list
5. GameSelectionScreen navigates on selection
6. GameSelectionScreen shows empty state
7. GameSelectionScreen handles multiple games

**Acceptance Criteria**:
- [ ] Test files created
- [ ] All test cases pass
- [ ] Coverage >80%

---

## Phase 4: Implement Game Container

**Goal**: Create wrapper that loads selected game with its providers

**Estimated Complexity**: Medium
**Dependencies**: Phase 3 complete
**Risk Level**: Medium

### Task 4.1: Create GameContainer Component

**Context**: Component that receives a gameId, loads the game, wraps it with providers, and renders it.

**File to Create**: `src/app/screens/GameContainer.tsx`

**Implementation Requirements**:
- Receive gameId from route params
- Retrieve game from registry
- Handle game not found
- Wrap game navigator with game providers
- Handle loading state
- Handle errors
- Support back navigation to game selection

**Props Interface**:
```typescript
interface GameContainerProps {
  route: {
    params: {
      gameId: string;
    };
  };
  navigation: any;
}
```

**Acceptance Criteria**:
- [ ] GameContainer.tsx created
- [ ] Loads game from registry
- [ ] Wraps with game providers correctly
- [ ] Handles errors gracefully
- [ ] Back navigation works

---

### Task 4.2: Implement Provider Wrapping Logic

**Context**: Need to dynamically wrap the game navigator with game-specific providers.

**Implementation in GameContainer**:
```typescript
const wrapWithProviders = (
  component: React.ReactElement,
  providers?: ComponentType<{ children: ReactNode }>[]
): React.ReactElement => {
  if (!providers || providers.length === 0) {
    return component;
  }

  return providers.reduceRight(
    (wrapped, Provider) => <Provider>{wrapped}</Provider>,
    component
  );
};
```

**Acceptance Criteria**:
- [ ] Provider wrapping implemented
- [ ] Supports multiple providers
- [ ] Correct provider order (innermost first)
- [ ] Works with zero providers

---

### Task 4.3: Add Error Handling

**Context**: Handle cases where game doesn't exist or fails to load.

**Error Cases**:
1. Game ID not found in registry
2. Game is disabled
3. Game requires authentication but user not logged in
4. Game navigator throws error

**Implementation**:
- Error screen component
- Retry button
- Navigate back to selection button
- Helpful error messages

**Acceptance Criteria**:
- [ ] All error cases handled
- [ ] User-friendly error messages
- [ ] Recovery options provided
- [ ] Errors logged

---

### Task 4.4: Add Loading State

**Context**: Show loading indicator while game initializes.

**Implementation**:
- Loading screen component
- Game icon/name while loading
- Smooth transition to game

**Acceptance Criteria**:
- [ ] Loading state implemented
- [ ] Smooth user experience
- [ ] No flicker

---

### Task 4.5: Write Tests for GameContainer

**Context**: Test game loading, provider wrapping, error handling.

**File to Create**: `src/app/screens/__tests__/GameContainer.test.tsx`

**Test Cases**:
1. Loads and renders game correctly
2. Wraps with single provider
3. Wraps with multiple providers
4. Shows error for invalid game ID
5. Shows loading state
6. Handles back navigation
7. Cleans up on unmount

**Acceptance Criteria**:
- [ ] Test file created
- [ ] All test cases pass
- [ ] Coverage >80%

---

## Phase 5: Update Navigation Flow

**Goal**: Insert game selection into navigation and route to games

**Estimated Complexity**: Medium
**Dependencies**: Phase 4 complete
**Risk Level**: High (changes user flow)

### Task 5.1: Create/Update AppNavigator

**Context**: Update navigation to show GameSelection after login, then GameContainer for selected game.

**File to Create/Modify**: `src/app/AppNavigator.tsx`

**New Navigation Structure**:
```
Stack.Navigator
├─ LoginScreen (if not authenticated)
├─ GameSelection (after login)
└─ GameContainer (when game selected)
```

**Implementation**:
```typescript
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen
              name="GameSelection"
              component={GameSelectionScreen}
            />
            <Stack.Screen
              name="GameContainer"
              component={GameContainer}
              options={{ gestureEnabled: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

**Acceptance Criteria**:
- [ ] AppNavigator created/updated
- [ ] Navigation structure matches plan
- [ ] Conditional rendering works
- [ ] Screen transitions smooth

---

### Task 5.2: Update Navigation Types

**Context**: Update TypeScript navigation types for new screens.

**File to Modify**: `src/app/types/navigation.ts`

**Add New Types**:
```typescript
export type RootStackParamList = {
  Login: undefined;
  GameSelection: undefined;
  GameContainer: {
    gameId: string;
  };
};
```

**Acceptance Criteria**:
- [ ] Navigation types updated
- [ ] Type-safe navigation
- [ ] TypeScript compiles without errors

---

### Task 5.3: Remove PetProvider from App.tsx

**Context**: PetProvider should no longer be in App.tsx - it will be loaded by the game module in GameContainer.

**File to Modify**: `src/app/App.tsx`

**Changes**:
- Remove PetProvider import
- Remove PetProvider from context stack
- Keep only app-level providers (Auth, Ad, Language, Toast)

**New Provider Structure in App.tsx**:
```typescript
<ErrorBoundary>
  <GestureHandlerRootView>
    <LanguageProvider>
      <AuthProvider>
        <AdProvider>
          <ToastProvider>
            <AppNavigator />
          </ToastProvider>
        </AdProvider>
      </AuthProvider>
    </LanguageProvider>
  </GestureHandlerRootView>
</ErrorBoundary>
```

**Acceptance Criteria**:
- [ ] PetProvider removed from App.tsx
- [ ] Only app-level providers remain
- [ ] App still starts correctly
- [ ] No errors in console

---

### Task 5.4: Handle Back Button from Game

**Context**: Pressing back from a game should return to game selection, not exit app.

**Implementation**:
- Add back handler in GameContainer
- Navigate to GameSelection on back press
- Confirm dialog for unsaved changes (optional)

**Acceptance Criteria**:
- [ ] Back button navigates to game selection
- [ ] No app exit unless on game selection
- [ ] Smooth navigation experience

---

### Task 5.5: Test Navigation Flow

**Context**: Test complete user flow through navigation.

**Test Flow**:
1. App starts → Login screen
2. User logs in → Game selection screen
3. User selects pet care → Pet game loads
4. User plays pet game → All features work
5. User presses back → Returns to game selection
6. User selects game again → Game loads

**Acceptance Criteria**:
- [ ] All navigation works
- [ ] No broken flows
- [ ] State persists correctly
- [ ] Clean transitions

---

## Phase 6: Refactor Pet Care Game

**Goal**: Convert pet care game into a proper game module

**Estimated Complexity**: Medium
**Dependencies**: Phase 5 complete
**Risk Level**: Medium

### Task 6.1: Create PetGameNavigator

**Context**: Extract pet game navigation from AppNavigator into its own navigator.

**File to Create**: `src/games/pet-care/PetGameNavigator.tsx`

**Implementation**:
```typescript
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from './screens/MenuScreen';
import CreatePetScreen from './screens/CreatePetScreen';
import HomeScreen from './screens/HomeScreen';
import FeedScene from './screens/FeedScene';
// ... import all pet screens

const Stack = createNativeStackNavigator();

const PetGameNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="CreatePet" component={CreatePetScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Feed" component={FeedScene} />
      <Stack.Screen name="Bath" component={BathScene} />
      <Stack.Screen name="Wardrobe" component={WardrobeScene} />
      <Stack.Screen name="Play" component={PlayScene} />
      <Stack.Screen name="Sleep" component={SleepScene} />
      <Stack.Screen name="Vet" component={VetScene} />
    </Stack.Navigator>
  );
};

export default PetGameNavigator;
```

**Acceptance Criteria**:
- [ ] PetGameNavigator.tsx created
- [ ] All pet screens configured
- [ ] Navigation options set
- [ ] Navigator exports properly

---

### Task 6.2: Create Pet Game Registration File

**Context**: Register the pet care game with the game registry.

**File to Create**: `src/games/pet-care/index.ts`

**Implementation**:
```typescript
import { gameRegistry } from '@/app/registry';
import { Game } from '@/app/registry/types';
import PetGameNavigator from './PetGameNavigator';
import { PetProvider } from './context/PetContext';
import enTranslations from './locales/en.json';
import ptBRTranslations from './locales/pt-BR.json';

const petCareGame: Game = {
  id: 'pet-care',
  name: 'Pet Care',
  description: 'Take care of your virtual pet! Feed, bathe, and play with your furry friend.',
  icon: require('./assets/icon.png'), // You'll need to add this
  category: 'pet',

  navigator: PetGameNavigator,
  initialRoute: 'Menu',

  providers: [PetProvider],

  translations: {
    en: enTranslations,
    'pt-BR': ptBRTranslations,
  },

  version: '1.0.0',
  minAppVersion: '1.0.0',
  isEnabled: true,
  requiresAuth: false,
  isPremium: false,
  comingSoon: false,
};

// Register the game
gameRegistry.register(petCareGame);

export default petCareGame;
```

**Acceptance Criteria**:
- [ ] index.ts created in pet-care folder
- [ ] Pet game registered with all required fields
- [ ] PetProvider included in providers array
- [ ] Translations configured
- [ ] Game metadata accurate

---

### Task 6.3: Add Pet Game Icon

**Context**: Need an icon to represent the pet care game in the selection screen.

**File to Add**: `src/games/pet-care/assets/icon.png`

**Implementation**:
- Create or find a pet-themed icon
- Optimize for mobile (different sizes)
- Place in assets folder

**Icon Requirements**:
- Clear and recognizable
- Works at multiple sizes
- Matches game theme

**Acceptance Criteria**:
- [ ] Icon file added
- [ ] Icon displays in GameCard
- [ ] Icon looks good at all sizes

---

### Task 6.4: Import Pet Game in App

**Context**: Import the pet game module so it registers itself on app startup.

**File to Modify**: `src/app/App.tsx`

**Add Import**:
```typescript
// Register games
import '@/games/pet-care';
```

**Placement**: Add near top of file, before component definition

**Acceptance Criteria**:
- [ ] Import added to App.tsx
- [ ] Pet game registers on app startup
- [ ] Console shows registration message
- [ ] Game appears in selection screen

---

### Task 6.5: Update Pet Game Navigation Types

**Context**: Pet game needs its own navigation types.

**File to Create**: `src/games/pet-care/types/navigation.ts`

**Implementation**:
```typescript
export type PetGameStackParamList = {
  Menu: undefined;
  CreatePet: undefined;
  Home: undefined;
  Feed: undefined;
  Bath: undefined;
  Wardrobe: undefined;
  Play: undefined;
  Sleep: undefined;
  Vet: undefined;
};
```

**Acceptance Criteria**:
- [ ] Navigation types created
- [ ] All pet screens typed
- [ ] Used in PetGameNavigator

---

### Task 6.6: Test Pet Game as Module

**Context**: Verify pet game works as a standalone module.

**Test Checklist**:
1. Pet game appears in game selection
2. Clicking pet game loads the game
3. PetContext initializes correctly
4. All pet screens accessible
5. All pet features work (feed, bath, play, etc.)
6. Stats update correctly
7. Data persists
8. Ads work within game
9. Back navigation returns to game selection
10. Re-selecting game works

**Acceptance Criteria**:
- [ ] All test items pass
- [ ] No regressions
- [ ] Game fully functional as module

---

### Task 6.7: Verify Pet Context Lifecycle

**Context**: Ensure PetContext mounts/unmounts correctly with game.

**Verification**:
1. PetContext mounts when game loads
2. Pet data loads from storage
3. Decay timers start
4. Context unmounts when leaving game
5. Timers clean up
6. Data saves on unmount
7. Context re-mounts correctly on re-entry

**Add Logging**:
- Log in PetContext useEffect for mount/unmount
- Verify in console

**Acceptance Criteria**:
- [ ] Context lifecycle correct
- [ ] No memory leaks
- [ ] Data persists properly
- [ ] Timers clean up

---

## Phase 7: Testing & Polish

**Goal**: Ensure quality, fix bugs, optimize performance

**Estimated Complexity**: Medium
**Dependencies**: Phase 6 complete
**Risk Level**: Low

### Task 7.1: Update All Tests

**Context**: Ensure all tests pass with new architecture.

**Test Suites to Update**:
1. App-level context tests
2. Pet game context tests
3. Screen tests (all)
4. Component tests (all)
5. Hook tests (all)
6. Utility tests (all)
7. Registry tests

**Implementation**:
- Fix broken imports
- Update mocks for new structure
- Add new tests for new components
- Ensure coverage remains high

**Acceptance Criteria**:
- [ ] All test suites pass
- [ ] Coverage >80% overall
- [ ] No flaky tests
- [ ] Tests run fast

---

### Task 7.2: Integration Testing

**Context**: Test complete user flows end-to-end.

**Test Scenarios**:
1. **New User Flow**:
   - Open app → Login → See game selection → Select pet game → Create pet → Play

2. **Returning User Flow**:
   - Open app → Auto-login → Game selection → Select pet game → Pet loads → Continue playing

3. **Game Switching**:
   - In pet game → Back to selection → (future: select different game)

4. **Data Persistence**:
   - Play pet game → Make changes → Exit app → Reopen → Verify data persisted

5. **Ad Flow**:
   - Play game → Trigger interstitial → Watch rewarded ad → Verify rewards

**Acceptance Criteria**:
- [ ] All scenarios tested manually
- [ ] Integration tests written (optional)
- [ ] No critical bugs found

---

### Task 7.3: Performance Testing

**Context**: Ensure app performance hasn't regressed.

**Metrics to Check**:
1. App startup time
2. Game selection screen render time
3. Game load time
4. Memory usage
5. Navigation transition smoothness
6. Frame rate during gameplay

**Tools**:
- React DevTools Profiler
- React Native Performance Monitor
- Manual testing

**Acceptance Criteria**:
- [ ] Performance metrics acceptable
- [ ] No significant regressions
- [ ] Smooth 60fps during gameplay
- [ ] Memory usage reasonable

---

### Task 7.4: Accessibility Audit

**Context**: Ensure app is accessible.

**Check Items**:
1. All interactive elements have accessibility labels
2. Screen reader support
3. Touch target sizes (min 44x44)
4. Color contrast ratios
5. Focus management
6. Keyboard navigation (web)

**Acceptance Criteria**:
- [ ] Accessibility labels on all buttons
- [ ] GameCard accessible
- [ ] Navigation accessible
- [ ] Screen reader tested

---

### Task 7.5: Error Boundary Testing

**Context**: Ensure errors are caught and handled gracefully.

**Test Cases**:
1. Game throws error during render
2. Context initialization fails
3. Navigation error
4. Network error (ads, auth)

**Acceptance Criteria**:
- [ ] Error boundaries catch errors
- [ ] User sees friendly error messages
- [ ] App doesn't crash
- [ ] Errors logged properly

---

### Task 7.6: Polish UI/UX

**Context**: Final visual polish and UX improvements.

**Areas to Polish**:
1. Game selection screen animations
2. GameCard hover/press states
3. Loading transitions
4. Error screens
5. Empty states
6. Consistent spacing/typography
7. Icon/image quality

**Acceptance Criteria**:
- [ ] UI looks polished
- [ ] Animations smooth
- [ ] Consistent design language
- [ ] No visual bugs

---

### Task 7.7: Code Review & Cleanup

**Context**: Clean up code before finalizing.

**Cleanup Tasks**:
1. Remove commented code
2. Remove console.logs (except intentional logging)
3. Fix linting warnings
4. Improve code documentation
5. Remove unused imports
6. Remove dead code

**Acceptance Criteria**:
- [ ] No linting errors
- [ ] No linting warnings
- [ ] Code well-documented
- [ ] Clean codebase

---

### Task 7.8: Update Documentation

**Context**: Update README and documentation for new architecture.

**Documentation to Update**:
1. README.md - Update project description
2. Add architecture overview
3. Document how to add a new game
4. Update setup instructions
5. Update testing instructions
6. Document folder structure

**Acceptance Criteria**:
- [ ] README.md updated
- [ ] Architecture documented
- [ ] Game creation guide added
- [ ] Documentation accurate

---

### Task 7.9: Final Smoke Test

**Context**: Final end-to-end test before deployment.

**Test Everything**:
1. Fresh install
2. Login flow
3. Game selection
4. Pet game (all features)
5. Data persistence
6. Ads
7. Language switching
8. Error handling
9. Back navigation
10. Performance

**Acceptance Criteria**:
- [ ] All features work
- [ ] No critical bugs
- [ ] Ready for deployment

---

## Phase 8: Future Game Support

**Goal**: Prepare infrastructure for adding more games easily

**Estimated Complexity**: Low
**Dependencies**: Phase 7 complete
**Risk Level**: Low

### Task 8.1: Create Game Template

**Context**: Create a boilerplate/template for new games.

**File to Create**: `docs/GAME_TEMPLATE.md`

**Template Structure**:
```
src/games/[game-name]/
├── index.ts                    # Game registration
├── GameNavigator.tsx           # Navigation
├── screens/                    # Game screens
├── components/                 # Game components
├── context/                    # Game contexts (optional)
├── hooks/                      # Game hooks
├── data/                       # Game data
├── config/                     # Game config
├── utils/                      # Game utilities
├── types/                      # Game types
├── locales/                    # Game translations
│   ├── en.json
│   └── pt-BR.json
├── assets/                     # Game assets
│   └── icon.png
└── __tests__/                  # Game tests
```

**Acceptance Criteria**:
- [ ] Template documented
- [ ] Example files provided
- [ ] Clear instructions

---

### Task 8.2: Document Game Creation Process

**Context**: Step-by-step guide for developers to add a new game.

**File to Create**: `docs/ADDING_A_GAME.md`

**Content**:
1. Overview of game architecture
2. Game interface requirements
3. Step-by-step creation process
4. Code examples
5. Testing guidelines
6. Best practices
7. Common pitfalls

**Acceptance Criteria**:
- [ ] Guide is comprehensive
- [ ] Easy to follow
- [ ] Includes examples
- [ ] Covers edge cases

---

### Task 8.3: Create Simple Example Game

**Context**: Create a minimal example game to demonstrate the pattern.

**Game Idea**: Simple clicker game or puzzle

**Implementation**:
- Create in `src/games/example-game/`
- Follow template exactly
- Keep it minimal
- Document thoroughly
- Mark as comingSoon: true

**Acceptance Criteria**:
- [ ] Example game created
- [ ] Follows template
- [ ] Well documented
- [ ] Demonstrates all patterns

---

### Task 8.4: Create Game Scaffolding Script (Optional)

**Context**: CLI tool to generate game boilerplate.

**Script**: `scripts/create-game.js`

**Functionality**:
- Prompt for game name, category, etc.
- Generate folder structure
- Create boilerplate files
- Register game in App.tsx

**Usage**:
```bash
npm run create-game
```

**Acceptance Criteria**:
- [ ] Script works
- [ ] Generates correct structure
- [ ] Saves development time

---

### Task 8.5: Plan Second Game (Optional)

**Context**: Plan what the second game should be.

**Considerations**:
- Different category than pet care
- Simpler to start
- Demonstrates modularity
- Appeals to target audience

**Potential Games**:
1. Puzzle game (match-3, sliding puzzle)
2. Memory card game
3. Simple platformer
4. Trivia quiz game

**Acceptance Criteria**:
- [ ] Second game decided
- [ ] Design documented
- [ ] Ready to implement (future)

---

## Rollout Plan

### Development Environment Testing
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test web build (if applicable)

### Staging Deployment
- [ ] Deploy to staging environment
- [ ] Run full test suite
- [ ] Manual QA testing
- [ ] Performance testing
- [ ] Collect feedback

### Production Deployment
- [ ] Merge to main branch
- [ ] Create release tag
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Monitor analytics
- [ ] Collect user feedback

---

## Risk Mitigation

### Identified Risks

**Risk 1: Breaking Pet Care Game**
- **Mitigation**: Comprehensive testing after each phase
- **Rollback**: Keep Phase 1 as backup branch

**Risk 2: Performance Regression**
- **Mitigation**: Performance testing in Phase 7
- **Rollback**: Optimize lazy loading if needed

**Risk 3: Data Loss**
- **Mitigation**: Test data persistence thoroughly
- **Rollback**: Keep old storage format compatible

**Risk 4: Navigation Issues**
- **Mitigation**: Test all navigation paths
- **Rollback**: Fallback navigation structure

---

## Success Criteria

### Technical Success
- [ ] All tests pass (>80% coverage)
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] Performance metrics acceptable
- [ ] Code is maintainable

### Functional Success
- [ ] Pet care game works identically
- [ ] Game selection screen works
- [ ] Navigation flows work
- [ ] Data persists correctly
- [ ] Ads work correctly

### User Experience Success
- [ ] Smooth transitions
- [ ] Intuitive navigation
- [ ] Fast load times
- [ ] No crashes
- [ ] Accessible

### Developer Experience Success
- [ ] Easy to add new games
- [ ] Clear documentation
- [ ] Good code organization
- [ ] Simple game template

---

## Notes for Implementation

### Best Practices
1. **Commit Often**: After each task, commit with clear message
2. **Test Continuously**: Run tests after each change
3. **One Phase at a Time**: Complete each phase before moving to next
4. **Document Changes**: Update docs as you go
5. **Ask Questions**: Clarify requirements when uncertain

### When to Ask for Help
- Architecture doesn't make sense
- Tests failing unexpectedly
- Performance issues arise
- Unexpected edge cases
- Design decisions needed

### When to Take Breaks
- After completing a phase
- After a complex refactor
- When tests are all passing
- Before making major changes

---

## Appendix

### Key Files Reference

**App Shell**:
- `src/app/App.tsx` - Root component
- `src/app/AppNavigator.tsx` - Top-level navigation
- `src/app/registry/GameRegistry.ts` - Game registration system
- `src/app/screens/GameSelectionScreen.tsx` - Game selection UI
- `src/app/screens/GameContainer.tsx` - Game loader

**Pet Care Game**:
- `src/games/pet-care/index.ts` - Game registration
- `src/games/pet-care/PetGameNavigator.tsx` - Game navigation
- `src/games/pet-care/context/PetContext.tsx` - Game state

### Important Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Format code
npm run format

# Run app
npm start

# Create new game (future)
npm run create-game
```

---

**Document Version**: 1.0
**Created**: 2026-02-01
**Status**: Ready for Implementation
**Estimated Total Tasks**: 60+

---

## Quick Start Guide

### For Agent Sessions

When starting an implementation session:

1. **Review the current phase** you're working on
2. **Read the specific task** description and context
3. **Check dependencies** - ensure previous tasks are complete
4. **Review acceptance criteria** - know what "done" looks like
5. **Implement the task** following the guidance
6. **Test your changes** - run tests and manual checks
7. **Mark task complete** - check off acceptance criteria
8. **Commit your work** - clear commit message
9. **Move to next task** or summarize progress

### Task Status Tracking

Use this format in commit messages or progress reports:
```
Phase X Task Y: [Task Name]
Status: ✅ Complete | 🚧 In Progress | ⏸️ Blocked | ❌ Failed

Acceptance Criteria: X/Y complete
Notes: [any important notes]
```

Good luck with the implementation! 🚀
