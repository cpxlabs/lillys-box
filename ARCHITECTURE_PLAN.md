# Multi-Game App Architecture Plan

## Overview
Transform the Pet Care Game into a multi-game platform where users can select which game to play from a start screen. The architecture will support adding new games in the future while maintaining clean separation of concerns.

---

## Current State Analysis

### Current Architecture
- **Single-game focused**: All code assumes the Pet Care Game
- **Context-driven**: React Context API for state management
- **Screen-based navigation**: React Navigation stack
- **Provider stack**: Nested contexts (Auth → Pet → Ads → Language → Toast)
- **Monolithic structure**: Game logic mixed with app infrastructure

### Current Flow
```
Login → Menu Screen → Pet Dashboard/Activities
```

### Issues with Current Architecture
1. ❌ No game selection - directly enters pet game
2. ❌ Pet context always loaded even if not needed
3. ❌ Game-specific logic mixed with app infrastructure
4. ❌ No clear boundary between "app shell" and "game"
5. ❌ Hard to add new games without refactoring

---

## Proposed Architecture

### New Flow
```
Login → Game Selection Screen → Selected Game → Game Content
```

### Core Principles
1. **Game Isolation**: Each game is a self-contained module
2. **Lazy Loading**: Only load the selected game's code/contexts
3. **Shared Infrastructure**: Auth, Ads, Language, Toast remain app-level
4. **Plugin Architecture**: Games register themselves with the app shell
5. **Consistent API**: All games follow the same interface contract

---

## Architecture Layers

### Layer 1: App Shell (Infrastructure)
**Purpose**: Provides core services shared across all games

**Components**:
- `App.tsx` - Root component
- `AppNavigator.tsx` - Top-level routing
- Authentication (AuthContext)
- Ad Management (AdContext)
- Internationalization (LanguageContext)
- Toast Notifications (ToastContext)
- Game Registry

**Screens**:
- `LoginScreen` - Authentication entry point
- `GameSelectionScreen` - NEW: Choose which game to play
- Error boundaries and loading states

**Folder Structure**:
```
/src
├── app/                      # App shell infrastructure
│   ├── App.tsx
│   ├── AppNavigator.tsx
│   ├── context/              # App-level contexts
│   │   ├── AuthContext.tsx
│   │   ├── AdContext.tsx
│   │   ├── LanguageContext.tsx
│   │   └── ToastContext.tsx
│   ├── screens/              # App-level screens
│   │   ├── LoginScreen.tsx
│   │   └── GameSelectionScreen.tsx  # NEW
│   ├── components/           # Shared UI components
│   │   ├── BannerAd.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── IconButton.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── ...
│   ├── services/
│   │   └── AdService.ts
│   ├── hooks/
│   │   ├── useRewardedAd.ts
│   │   └── useResponsive.ts
│   └── registry/             # NEW: Game registry
│       ├── GameRegistry.ts   # Game registration system
│       └── types.ts          # Game interface definitions
```

---

### Layer 2: Game Modules
**Purpose**: Self-contained game implementations

**Each game contains**:
- Game-specific contexts
- Game screens
- Game components
- Game hooks
- Game data
- Game configuration

**Game Interface Contract**:
```typescript
interface Game {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Short description
  icon: ImageSourcePropType;     // Game icon/thumbnail
  category: 'pet' | 'puzzle' | 'adventure' | 'casual';

  // Navigation
  navigator: React.ComponentType;  // Game's root navigator
  initialRoute: string;            // Starting screen

  // Providers
  providers?: React.ComponentType[];  // Game-specific contexts

  // Localization
  translations: {
    en: Record<string, any>;
    'pt-BR': Record<string, any>;
  };

  // Metadata
  version: string;
  minAppVersion: string;
  isEnabled: boolean;              // Feature flag
}
```

**Folder Structure**:
```
/src
├── games/                         # All game modules
│   ├── pet-care/                 # Existing pet care game
│   │   ├── index.ts              # Game registration
│   │   ├── PetGameNavigator.tsx  # Game navigation
│   │   ├── context/              # Pet-specific contexts
│   │   │   └── PetContext.tsx
│   │   ├── screens/              # Pet game screens
│   │   │   ├── MenuScreen.tsx
│   │   │   ├── CreatePetScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── FeedScene.tsx
│   │   │   ├── BathScene.tsx
│   │   │   └── ...
│   │   ├── components/           # Pet-specific components
│   │   │   ├── PetRenderer.tsx
│   │   │   ├── StatusBar.tsx
│   │   │   ├── SpriteSheetAnimation.tsx
│   │   │   └── ...
│   │   ├── hooks/                # Pet-specific hooks
│   │   │   ├── usePetActions.ts
│   │   │   ├── useSpriteSheet.ts
│   │   │   └── ...
│   │   ├── data/                 # Pet game data
│   │   │   ├── foodItems.ts
│   │   │   ├── playActivities.ts
│   │   │   └── clothingItems.ts
│   │   ├── config/               # Pet game config
│   │   │   ├── gameBalance.ts
│   │   │   ├── actionConfig.ts
│   │   │   └── spriteSheets.ts
│   │   ├── utils/                # Pet-specific utils
│   │   │   ├── petStats.ts
│   │   │   ├── storage.ts
│   │   │   ├── age.ts
│   │   │   └── ...
│   │   ├── types/                # Pet game types
│   │   │   └── types.ts
│   │   └── locales/              # Pet game translations
│   │       ├── en.json
│   │       └── pt-BR.json
│   │
│   └── [future-games]/           # Future game modules
│       ├── puzzle-game/
│       ├── rpg-adventure/
│       └── ...
│
├── shared/                        # Shared utilities across games
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── haptics.ts
│   │   ├── debounce.ts
│   │   └── validation.ts
│   └── hooks/
│       └── useBackButton.tsx
```

---

### Layer 3: Game Registry System
**Purpose**: Dynamically register and manage games

**Implementation**:
```typescript
// src/app/registry/GameRegistry.ts
class GameRegistry {
  private games: Map<string, Game> = new Map();

  register(game: Game): void {
    if (this.games.has(game.id)) {
      throw new Error(`Game ${game.id} already registered`);
    }
    this.games.set(game.id, game);
  }

  getGame(id: string): Game | undefined {
    return this.games.get(id);
  }

  getAllGames(): Game[] {
    return Array.from(this.games.values())
      .filter(game => game.isEnabled)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getGamesByCategory(category: string): Game[] {
    return this.getAllGames()
      .filter(game => game.category === category);
  }
}

export const gameRegistry = new GameRegistry();
```

**Game Registration**:
```typescript
// src/games/pet-care/index.ts
import { gameRegistry } from '@/app/registry/GameRegistry';
import PetGameNavigator from './PetGameNavigator';
import petTranslations from './locales';

const petCareGame: Game = {
  id: 'pet-care',
  name: 'Pet Care',
  description: 'Take care of your virtual pet!',
  icon: require('./assets/icon.png'),
  category: 'pet',
  navigator: PetGameNavigator,
  initialRoute: 'Menu',
  providers: [PetProvider],
  translations: petTranslations,
  version: '1.0.0',
  minAppVersion: '1.0.0',
  isEnabled: true,
};

gameRegistry.register(petCareGame);

export default petCareGame;
```

---

## New Components

### 1. GameSelectionScreen
**Purpose**: Display available games and handle selection

**Features**:
- Grid/list view of available games
- Game cards with icon, name, description
- Category filtering (optional)
- Search functionality (future)
- Recent games (future)
- Game recommendations (future)

**UI Design**:
```
┌─────────────────────────────────┐
│   Choose Your Game              │
├─────────────────────────────────┤
│                                 │
│  ┌────────┐  ┌────────┐        │
│  │  🐾    │  │  🧩    │        │
│  │ Pet    │  │ Puzzle │        │
│  │ Care   │  │ Game   │        │
│  └────────┘  └────────┘        │
│                                 │
│  ┌────────┐  ┌────────┐        │
│  │  ⚔️     │  │  🎯    │        │
│  │  RPG   │  │ Arcade │        │
│  │(soon)  │  │(soon)  │        │
│  └────────┘  └────────┘        │
│                                 │
└─────────────────────────────────┘
```

**Implementation**:
```typescript
// src/app/screens/GameSelectionScreen.tsx
const GameSelectionScreen = ({ navigation }) => {
  const games = gameRegistry.getAllGames();
  const { t } = useTranslation();

  const handleGameSelect = (gameId: string) => {
    navigation.navigate('GameContainer', { gameId });
  };

  return (
    <View>
      <Text>{t('selectGame.title')}</Text>
      <FlatList
        data={games}
        numColumns={2}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            onPress={() => handleGameSelect(item.id)}
          />
        )}
      />
    </View>
  );
};
```

---

### 2. GameContainer Component
**Purpose**: Wrapper that loads selected game with its providers

**Features**:
- Lazy load game module
- Mount game-specific providers
- Handle game navigation
- Manage game lifecycle
- Handle back navigation to game selection

**Implementation**:
```typescript
// src/app/screens/GameContainer.tsx
const GameContainer = ({ route }) => {
  const { gameId } = route.params;
  const game = gameRegistry.getGame(gameId);

  if (!game) {
    return <ErrorScreen message="Game not found" />;
  }

  // Wrap game navigator with game-specific providers
  const GameNavigatorWithProviders = () => {
    let navigator = <game.navigator />;

    // Wrap with game providers (innermost first)
    if (game.providers) {
      game.providers.reverse().forEach(Provider => {
        navigator = <Provider>{navigator}</Provider>;
      });
    }

    return navigator;
  };

  return <GameNavigatorWithProviders />;
};
```

---

### 3. Updated AppNavigator
**Purpose**: Route between app shell and game containers

**Navigation Structure**:
```typescript
// src/app/AppNavigator.tsx
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen
              name="GameSelection"
              component={GameSelectionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GameContainer"
              component={GameContainer}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

---

## Migration Strategy

### Phase 1: Restructure Current Code ✅
**Goal**: Reorganize existing pet care game into new structure

**Tasks**:
1. Create new folder structure (`/app`, `/games/pet-care`, `/shared`)
2. Move pet-specific code to `/games/pet-care`
3. Keep shared infrastructure in `/app`
4. Move reusable utilities to `/shared`
5. Update all imports
6. Ensure tests still pass

**Impact**: No functional changes, just reorganization

---

### Phase 2: Implement Game Registry ✅
**Goal**: Create game registration system

**Tasks**:
1. Create `GameRegistry` class
2. Define `Game` interface
3. Create `gameRegistry` singleton
4. Register pet care game
5. Add game metadata and configuration

**Impact**: Pet care game now registered but flow unchanged

---

### Phase 3: Add Game Selection Screen ✅
**Goal**: Create game selection UI

**Tasks**:
1. Create `GameSelectionScreen` component
2. Create `GameCard` component
3. Add game selection translations
4. Style game grid/list
5. Implement game selection handler

**Impact**: New screen created but not yet in navigation flow

---

### Phase 4: Implement Game Container ✅
**Goal**: Create game loading wrapper

**Tasks**:
1. Create `GameContainer` component
2. Implement provider wrapping logic
3. Handle game not found errors
4. Add loading states
5. Test with pet care game

**Impact**: Game can now be loaded dynamically

---

### Phase 5: Update Navigation Flow ✅
**Goal**: Insert game selection into navigation

**Tasks**:
1. Update `AppNavigator` to show GameSelection first
2. Remove direct PetProvider from App.tsx
3. Update navigation types
4. Handle back button from game to selection
5. Test full user flow

**Impact**: **USER FLOW CHANGES** - Game selection now appears after login

---

### Phase 6: Refactor Pet Care Game ✅
**Goal**: Make pet care game a proper module

**Tasks**:
1. Create `PetGameNavigator` (extract from AppNavigator)
2. Move PetProvider to game module
3. Update pet game screens to work in module
4. Test all pet game features
5. Ensure ads and other integrations work

**Impact**: Pet care game fully modularized

---

### Phase 7: Testing & Polish ✅
**Goal**: Ensure quality and performance

**Tasks**:
1. Update all tests for new structure
2. Test navigation flows
3. Test game isolation (multiple plays)
4. Performance testing (lazy loading)
5. Accessibility testing
6. Update documentation

---

### Phase 8: Future Game Support 🚀
**Goal**: Prepare for adding new games

**Tasks**:
1. Create game template/boilerplate
2. Document game creation guide
3. Add game scaffolding CLI (optional)
4. Create example simple game
5. Test adding a second game

---

## File Changes Summary

### New Files
```
src/app/registry/GameRegistry.ts           # Game registration system
src/app/registry/types.ts                  # Game interface definitions
src/app/screens/GameSelectionScreen.tsx    # Game selection UI
src/app/screens/GameContainer.tsx          # Game loader wrapper
src/app/components/GameCard.tsx            # Game card component
src/games/pet-care/index.ts                # Pet game registration
src/games/pet-care/PetGameNavigator.tsx    # Pet game navigation
```

### Modified Files
```
src/App.tsx                                # Remove PetProvider, update structure
src/app/AppNavigator.tsx                   # Add game selection flow
src/app/context/AuthContext.tsx            # No changes (stays in app)
src/app/context/AdContext.tsx              # No changes (stays in app)
src/types/navigation.ts                    # Add new screen types
src/locales/en.json                        # Add game selection translations
src/locales/pt-BR.json                     # Add game selection translations
```

### Moved Files
```
src/context/PetContext.tsx         → src/games/pet-care/context/PetContext.tsx
src/screens/*                      → src/games/pet-care/screens/*
src/components/PetRenderer.tsx     → src/games/pet-care/components/PetRenderer.tsx
src/components/StatusBar.tsx       → src/games/pet-care/components/StatusBar.tsx
src/hooks/usePetActions.ts         → src/games/pet-care/hooks/usePetActions.ts
src/data/*                         → src/games/pet-care/data/*
src/config/gameBalance.ts          → src/games/pet-care/config/gameBalance.ts
... (all pet-specific files)
```

---

## State Management Changes

### App-Level State (Unchanged)
- ✅ AuthContext - User authentication
- ✅ AdContext - Ad management
- ✅ LanguageContext - Internationalization
- ✅ ToastContext - Notifications

### Game-Level State (New Pattern)
- 🎮 **PetContext** - Moved to pet-care game module
- 🎮 **[FutureGameContext]** - Each game has its own contexts

### Benefits
- Game state isolated per game
- App state shared across games
- No memory overhead for unselected games
- Clean separation of concerns

---

## Data Persistence Strategy

### Current: Single Pet Per User
```
AsyncStorage
└─ pets:${userId} → Pet data
```

### Future: Multiple Games Per User
```
AsyncStorage
├─ pets:${userId}              → Pet Care game data
├─ muito_game:bestScore:${userId} → Molto best-score (implemented)
├─ @memory_match:bestScore:*   → Memory Match best scores (implemented)
├─ @pet_runner:bestScore:*     → Pet Runner best score (implemented)
├─ rpg:${userId}               → RPG game data (future)
└─ gameProgress:${userId}      → Cross-game metadata
    ├─ lastPlayedGame: 'pet-care'
    ├─ playCounts: { 'pet-care': 50, 'puzzle': 10 }
    └─ achievements: [...]
```

### Storage Key Convention
```
{gameId}:{userId} → Game-specific data
gameProgress:{userId} → Cross-game metadata
```

---

## Localization Strategy

### Current: Single Namespace
```json
{
  "feed": { "title": "Feed" },
  "bath": { "title": "Bath" }
}
```

### Future: Namespaced by Game
```json
{
  "app": {
    "selectGame": {
      "title": "Choose Your Game",
      "recent": "Recently Played"
    }
  },
  "games": {
    "petCare": {
      "feed": { "title": "Feed" },
      "bath": { "title": "Bath" }
    },
    "puzzle": {
      "level": { "title": "Level" }
    }
  }
}
```

### Implementation
```typescript
// In game module
const { t } = useTranslation('petCare');
t('feed.title'); // "Feed"

// In app shell
const { t } = useTranslation('app');
t('selectGame.title'); // "Choose Your Game"
```

---

## Ad Strategy Per Game

### Option A: Shared Ad Pool (Recommended)
- Single AdContext manages all ads
- Ads shown between games and within games
- Frequency control applies globally
- Simpler implementation

### Option B: Game-Specific Ads
- Each game can configure its own ad strategy
- Different ad units per game
- Independent frequency control
- More complex but more flexible

**Recommendation**: Start with Option A (shared), move to Option B if needed.

---

## Performance Considerations

### Lazy Loading
- ✅ Only load selected game code
- ✅ Game contexts only mount when game active
- ✅ Reduce initial bundle size

### Memory Management
- Clean up game state when returning to selection
- Use React Navigation's unmountOnBlur for heavy games
- Preload next likely game (optional optimization)

### Bundle Splitting (Future)
- Use Metro/Expo dynamic imports
- Load game assets on-demand
- Reduce app download size

---

## Testing Strategy

### Unit Tests
- ✅ GameRegistry registration logic
- ✅ Game interface validation
- ✅ Context isolation
- ✅ Navigation flows

### Integration Tests
- ✅ Full user flow (login → select → play)
- ✅ Game switching
- ✅ State persistence per game
- ✅ Ad integration across games

### E2E Tests (Optional)
- User plays multiple games in one session
- Data isolation between games
- Navigation edge cases

---

## Developer Experience

### Adding a New Game - Simple Process

**Step 1**: Create game folder
```bash
mkdir -p src/games/my-game/{screens,components,context,config,locales}
```

**Step 2**: Implement game navigator
```typescript
// src/games/my-game/MyGameNavigator.tsx
const MyGameNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} />
      {/* Add game screens */}
    </Stack.Navigator>
  );
};
```

**Step 3**: Register game
```typescript
// src/games/my-game/index.ts
import { gameRegistry } from '@/app/registry/GameRegistry';

gameRegistry.register({
  id: 'my-game',
  name: 'My Awesome Game',
  description: 'A fun new game!',
  icon: require('./assets/icon.png'),
  category: 'puzzle',
  navigator: MyGameNavigator,
  initialRoute: 'Main',
  translations: require('./locales'),
  version: '1.0.0',
  minAppVersion: '1.0.0',
  isEnabled: true,
});
```

**Step 4**: Import in app
```typescript
// src/app/App.tsx
import '@/games/pet-care';
import '@/games/my-game';  // Add this line
```

**Done!** Game now appears in selection screen.

---

## Security Considerations

### Game Isolation
- Each game has isolated state
- No cross-game data access without explicit API
- Game code cannot access other game's storage

### Data Validation
- Validate game registration config
- Prevent malicious game configs
- Sanitize game metadata for display

### User Data
- Each game namespaced by user ID
- No game can access another user's data
- Maintain COPPA compliance per game

---

## Future Enhancements

### Phase 9+: Advanced Features

**1. Game Discovery**
- Featured games section
- New games badge
- Game ratings/reviews
- Play count leaderboard

**2. Cross-Game Features**
- Shared achievement system
- Cross-game currency (optional)
- Global player profile
- Friend system

**3. Game Updates**
- In-app game updates (CodePush)
- Game versioning
- Backward compatibility checks
- Migration tools

**4. Analytics**
- Per-game analytics
- Play time tracking
- User engagement metrics
- A/B testing framework

**5. Monetization**
- Per-game purchases
- Premium games
- Subscription for ad-free
- Cross-game bundles

---

## Success Metrics

### Technical Metrics
- [ ] Code organization (clear game boundaries)
- [ ] Test coverage (>80% for new code)
- [ ] Performance (game load <1s)
- [ ] Bundle size (manageable with splitting)

### User Experience Metrics
- [ ] Game selection intuitive
- [ ] Navigation smooth
- [ ] No regressions in pet care game
- [ ] Easy to add new games

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|----------|
| Breaking existing pet game | HIGH | Thorough testing, staged rollout |
| Navigation complexity | MEDIUM | Clear navigation structure, documentation |
| State management bugs | MEDIUM | Isolated contexts, integration tests |
| Performance regression | LOW | Lazy loading, profiling |
| User confusion | LOW | Clear UI, onboarding |

---

## Timeline Estimate

**Note**: No time estimates provided per guidelines. Tasks are listed for planning purposes.

- Phase 1: Restructure code
- Phase 2: Implement registry
- Phase 3: Game selection UI
- Phase 4: Game container
- Phase 5: Update navigation
- Phase 6: Refactor pet game
- Phase 7: Testing & polish
- Phase 8: Documentation

---

## Conclusion

This architecture provides:
- ✅ **Modularity**: Clean separation between games
- ✅ **Scalability**: Easy to add new games
- ✅ **Maintainability**: Clear code organization
- ✅ **Performance**: Lazy loading and isolation
- ✅ **User Experience**: Intuitive game selection
- ✅ **Developer Experience**: Simple game creation process

The pet care game continues to work exactly as before. **Muito** (a kids' counting game), **Memory Match** (a card-flipping puzzle), and **Pet Runner** (an endless runner) are now live, demonstrating the registry → selection → container flow scales to multiple games. Adding further games follows the same four-step pattern documented in the Developer Experience section above.

---

## Next Steps

1. ✅ Architecture plan reviewed and approved
2. ✅ Feature branches created and merged
3. ✅ Phases 1–8 implemented (registry, selection, container, pet-care module, Muito game)
4. ✅ Memory Match game added as third game
5. ✅ Pet Runner (endless runner) added as fourth game
6. Add additional games following the Developer Experience pattern
7. Evaluate Phase 9+ enhancements (achievements, analytics, cross-game currency)

---

**Document Version**: 3.0
**Last Updated**: 2026-02-06
**Author**: Claude (AI Assistant)
**Status**: Implemented — Pet Care + Muito + Memory Match + Pet Runner live
