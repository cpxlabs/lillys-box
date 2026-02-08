# Multi-Game App - Architecture Diagrams

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          MOBILE APP                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                     APP SHELL (Layer 1)                       │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │  • Authentication (AuthContext)                               │ │
│  │  • Ad Management (AdContext)                                  │ │
│  │  • Localization (LanguageContext)                             │ │
│  │  • Notifications (ToastContext)                               │ │
│  │  • Game Registry                                              │ │
│  │  • App Navigation                                             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                   GAME SELECTION SCREEN                       │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │ │
│  │  │   Pet    │  │  Puzzle  │  │   RPG    │  │  Arcade  │     │ │
│  │  │   Care   │  │   Game   │  │   Game   │  │   Game   │     │ │
│  │  │  [Play]  │  │ (Soon)   │  │ (Soon)   │  │ (Soon)   │     │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                  GAME CONTAINER (Layer 3)                     │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │           GAME MODULES (Layer 2)                        │ │ │
│  │  ├─────────────────────────────────────────────────────────┤ │ │
│  │  │                                                         │ │ │
│  │  │  ┌────────────────┐  ┌────────────────┐               │ │ │
│  │  │  │  Pet Care Game │  │  Puzzle Game   │  ...          │ │ │
│  │  │  ├────────────────┤  ├────────────────┤               │ │ │
│  │  │  │ • PetContext   │  │ • PuzzleCtx    │               │ │ │
│  │  │  │ • Screens      │  │ • Screens      │               │ │ │
│  │  │  │ • Components   │  │ • Components   │               │ │ │
│  │  │  │ • Game Logic   │  │ • Game Logic   │               │ │ │
│  │  │  │ • Data/Config  │  │ • Data/Config  │               │ │ │
│  │  │  └────────────────┘  └────────────────┘               │ │ │
│  │  │                                                         │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Navigation Flow

### Current Flow (Before)
```
┌─────────┐     ┌──────────────┐     ┌─────────────┐
│ Login   │────>│  Pet Menu    │────>│ Pet Scenes  │
│ Screen  │     │  Screen      │     │ (Feed/Bath) │
└─────────┘     └──────────────┘     └─────────────┘
```

### New Flow (After)
```
┌─────────┐     ┌─────────────┐     ┌──────────────┐     ┌────────────┐
│ Login   │────>│    Game     │────>│     Game     │────>│    Game    │
│ Screen  │     │  Selection  │     │  Container   │     │  Content   │
└─────────┘     └─────────────┘     └──────────────┘     └────────────┘
                      │                     │                    │
                      │                     │              ┌─────┴─────┐
                      │                     │              │           │
                      │                     │         Pet Care    Puzzle
                      │                     │           Game       Game
                      │                     │
                      │                     └──> Loads selected game
                      │                          with its contexts
                      │
                      └──> User selects which game to play
```

---

## 3. Component Hierarchy

```
App.tsx
│
├─ ErrorBoundary
│  └─ GestureHandlerRootView
│     └─ LanguageProvider              ← App-level context
│        └─ AuthProvider                ← App-level context
│           └─ AdProvider               ← App-level context
│              └─ ToastProvider         ← App-level context
│                 └─ NavigationContainer
│                    └─ Stack.Navigator
│                       │
│                       ├─ LoginScreen
│                       │
│                       ├─ GameSelectionScreen
│                       │  └─ GameCard (for each game)
│                       │
│                       └─ GameContainer
│                          └─ GameProviderWrapper
│                             └─ PetProvider      ← Game-level context
│                                └─ PetGameNavigator
│                                   └─ Stack.Navigator
│                                      ├─ Menu (Patchwork Quilt theme)
│                                      ├─ CreatePet
│                                      ├─ Home
│                                      ├─ Feed
│                                      ├─ Bath
│                                      └─ ...
```

---

## 4. Folder Structure (Before vs After)

### Before (Current)
```
src/
├── components/          # All components mixed
├── screens/             # All screens together
├── context/             # All contexts together
├── hooks/               # All hooks together
├── config/              # All config together
├── data/                # All data together
├── utils/               # Utilities
├── services/            # Services
├── types/               # Types
└── locales/             # Translations
```

### After (New Structure)
```
src/
├── app/                           # App shell infrastructure
│   ├── App.tsx
│   ├── AppNavigator.tsx
│   ├── context/                   # App-level contexts only
│   │   ├── AuthContext.tsx
│   │   ├── AdContext.tsx
│   │   ├── LanguageContext.tsx
│   │   └── ToastContext.tsx
│   ├── screens/                   # App-level screens
│   │   ├── LoginScreen.tsx
│   │   ├── GameSelectionScreen.tsx
│   │   └── GameContainer.tsx
│   ├── components/                # Shared components
│   │   ├── BannerAd.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── GameCard.tsx
│   │   └── ...
│   ├── services/
│   │   └── AdService.ts
│   ├── hooks/
│   │   └── useRewardedAd.ts
│   └── registry/                  # NEW: Game registry
│       ├── GameRegistry.ts
│       └── types.ts
│
├── games/                         # NEW: Game modules
│   ├── pet-care/                  # Pet care game module
│   │   ├── index.ts               # Game registration
│   │   ├── PetGameNavigator.tsx
│   │   ├── context/               # Pet-specific contexts
│   │   │   └── PetContext.tsx
│   │   ├── screens/               # Pet game screens
│   │   │   ├── MenuScreen.tsx
│   │   │   ├── CreatePetScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   └── ...
│   │   ├── components/            # Pet-specific components
│   │   │   ├── PetRenderer.tsx
│   │   │   ├── StatusBar.tsx
│   │   │   └── ...
│   │   ├── hooks/                 # Pet-specific hooks
│   │   │   ├── usePetActions.ts
│   │   │   └── ...
│   │   ├── data/                  # Pet game data
│   │   ├── config/                # Pet game config
│   │   ├── utils/                 # Pet-specific utils
│   │   └── locales/               # Pet translations
│   │
│   └── [future-game]/             # Future game modules
│       └── ...
│
├── shared/                        # NEW: Shared utilities
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── haptics.ts
│   │   └── ...
│   └── hooks/
│       └── useBackButton.tsx
│
└── types/                         # Shared types
    └── navigation.ts
```

---

## 5. Data Flow Diagram

### User Plays Pet Care Game

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Opens app
     ▼
┌─────────────────┐
│  Login Screen   │
└────┬────────────┘
     │
     │ 2. Authenticates
     ▼
┌─────────────────────┐
│  AuthContext        │────┐
│  (sets user)        │    │ 3. User authenticated
└─────────────────────┘    │
                           ▼
                    ┌──────────────────────┐
                    │  Game Selection      │
                    │  Screen              │
                    │                      │
                    │  [Pet Care] [Puzzle] │
                    └──────┬───────────────┘
                           │
                           │ 4. User selects "Pet Care"
                           ▼
                    ┌──────────────────────┐
                    │  GameContainer       │
                    │  (loads game)        │
                    └──────┬───────────────┘
                           │
                           │ 5. Mounts game providers
                           ▼
                    ┌──────────────────────┐
                    │  PetProvider         │───> AsyncStorage
                    │  (loads pet data)    │<─── pets:userId
                    └──────┬───────────────┘
                           │
                           │ 6. Renders game
                           ▼
                    ┌──────────────────────┐
                    │  PetGameNavigator    │
                    │  - Menu              │
                    │  - Home              │
                    │  - Feed/Bath/Play    │
                    └──────┬───────────────┘
                           │
                           │ 7. User feeds pet
                           ▼
                    ┌──────────────────────┐
                    │  usePetActions       │
                    │  performAction()     │
                    └──────┬───────────────┘
                           │
                           │ 8. Updates pet stats
                           ▼
                    ┌──────────────────────┐
                    │  PetContext          │
                    │  updatePet()         │───> AsyncStorage
                    └──────────────────────┘    pets:userId
```

---

## 6. Game Registry Flow

```
┌──────────────────────────────────────────────────────────────┐
│                      App Startup                             │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ Import statements execute
                              ▼
           ┌──────────────────────────────────────┐
           │  src/games/pet-care/index.ts         │
           │  gameRegistry.register(petCareGame)  │
           └──────────────┬───────────────────────┘
                          │
                          │ Register
                          ▼
           ┌──────────────────────────────────────┐
           │      GameRegistry (Singleton)        │
           │                                      │
           │  games: Map<string, Game>            │
           │  ├─ 'pet-care' → PetCareGame         │
           │  ├─ 'puzzle' → PuzzleGame (future)   │
           │  └─ 'rpg' → RPGGame (future)         │
           └──────────────┬───────────────────────┘
                          │
                          │ Query
                          ▼
           ┌──────────────────────────────────────┐
           │   GameSelectionScreen                │
           │   games = registry.getAllGames()     │
           │                                      │
           │   Display game cards                 │
           └──────────────────────────────────────┘
                          │
                          │ User selects game
                          ▼
           ┌──────────────────────────────────────┐
           │   GameContainer                      │
           │   game = registry.getGame(id)        │
           │                                      │
           │   Load game navigator + providers    │
           └──────────────────────────────────────┘
```

---

## 7. Context Isolation

### Shared Contexts (Always Active)
```
┌─────────────────────────────────────────────┐
│           App-Level Contexts                │
├─────────────────────────────────────────────┤
│  AuthContext     - User authentication      │
│  AdContext       - Ad management            │
│  LanguageContext - i18n                     │
│  ToastContext    - Notifications            │
└─────────────────────────────────────────────┘
                    ▲
                    │ Available to all games
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐       ┌───────────────┐
│  Pet Care     │       │  Puzzle Game  │
│  Game         │       │               │
├───────────────┤       ├───────────────┤
│  PetContext   │       │  PuzzleCtx    │
│  (isolated)   │       │  (isolated)   │
└───────────────┘       └───────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌───────────────┐       ┌───────────────┐
│ AsyncStorage  │       │ AsyncStorage  │
│ pets:userId   │       │ puzzles:userId│
└───────────────┘       └───────────────┘
```

### Benefits of Isolation
- ✅ Pet game state doesn't leak to puzzle game
- ✅ Each game can have different state management
- ✅ Games can be developed independently
- ✅ Easier to test in isolation
- ✅ Better memory management (only active game loaded)

---

## 8. Migration Phases Visualization

```
Phase 1: Restructure          Phase 2: Registry
┌─────────────┐              ┌─────────────┐
│ Reorganize  │              │   Create    │
│   folders   │─────────────>│   game      │
│             │              │  registry   │
└─────────────┘              └─────────────┘
                                    │
                                    │
Phase 3: Game Selection       Phase 4: Container
┌─────────────┐              ┌─────────────┐
│   Create    │              │   Create    │
│  selection  │<─────────────│    game     │
│   screen    │              │  container  │
└─────────────┘              └─────────────┘
      │                            │
      │                            │
      ▼                            ▼
Phase 5: Navigation           Phase 6: Refactor
┌─────────────┐              ┌─────────────┐
│   Update    │              │  Modularize │
│ navigation  │─────────────>│  pet care   │
│    flow     │              │    game     │
└─────────────┘              └─────────────┘
                                    │
                                    │
                                    ▼
                             Phase 7: Testing
                             ┌─────────────┐
                             │    Test     │
                             │     and     │
                             │   polish    │
                             └─────────────┘
```

---

## 9. State Lifecycle

### Pet Care Game Session
```
┌─────────────────────────────────────────────────────────────┐
│                    Game Lifecycle                           │
└─────────────────────────────────────────────────────────────┘

1. Mount
   ┌──────────────────┐
   │  GameContainer   │
   │  mounts          │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │  PetProvider     │
   │  initializes     │───> Load from AsyncStorage
   └────────┬─────────┘     pets:userId
            │
            ▼
   ┌──────────────────┐
   │  PetContext      │
   │  - Start decay   │
   │  - Start updates │
   └────────┬─────────┘
            │

2. Active
   │
   ├─> User plays (feed, bath, etc.)
   │   └─> State updates
   │       └─> Debounced save to AsyncStorage
   │
   ├─> Every 10s: Apply stat decay
   │   └─> Auto-save
   │
   └─> Ad triggers (reward/interstitial)
       └─> Via shared AdContext

3. Unmount (User returns to Game Selection)
   │
   ▼
   ┌──────────────────┐
   │  PetProvider     │
   │  cleanup         │
   │  - Stop timers   │
   │  - Final save    │───> Save to AsyncStorage
   └────────┬─────────┘     pets:userId
            │
            ▼
   ┌──────────────────┐
   │  GameContainer   │
   │  unmounts        │
   └──────────────────┘

Note: App-level contexts (Auth, Ads, Language, Toast) remain active
```

---

## 10. Adding a New Game (Developer Flow)

```
┌─────────────────────────────────────────────────────────────┐
│              New Game Development Process                   │
└─────────────────────────────────────────────────────────────┘

Step 1: Create folder structure
┌──────────────────────────────┐
│ mkdir src/games/my-game      │
│ - screens/                   │
│ - components/                │
│ - context/                   │
│ - config/                    │
│ - locales/                   │
└──────────────┬───────────────┘
               │
               ▼
Step 2: Implement game logic
┌──────────────────────────────┐
│ - Create game screens        │
│ - Create game navigator      │
│ - Create game context (opt)  │
│ - Add game data/config       │
│ - Add translations           │
└──────────────┬───────────────┘
               │
               ▼
Step 3: Register game
┌──────────────────────────────┐
│ src/games/my-game/index.ts   │
│                              │
│ gameRegistry.register({      │
│   id: 'my-game',             │
│   name: 'My Game',           │
│   navigator: MyNavigator,    │
│   ...                        │
│ })                           │
└──────────────┬───────────────┘
               │
               ▼
Step 4: Import in App.tsx
┌──────────────────────────────┐
│ import '@/games/my-game';    │
└──────────────┬───────────────┘
               │
               ▼
Step 5: Done! ✅
┌──────────────────────────────┐
│ Game appears in selection    │
│ screen automatically         │
└──────────────────────────────┘
```

---

## 11. Data Storage Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    AsyncStorage Keys                        │
└─────────────────────────────────────────────────────────────┘

App-Level Data
├─ auth:token              → Authentication token
├─ language                → User's language preference
└─ lastAdTimestamp         → Last ad shown time

Game-Specific Data (Namespaced by game and user)
├─ pets:user123            → Pet Care save data (user 123)
├─ pets:user456            → Pet Care save data (user 456)
├─ puzzles:user123         → Puzzle game save data (user 123)
├─ rpg:user123             → RPG game save data (user 123)
└─ ...

Cross-Game Metadata
└─ gameProgress:user123    → User 123's cross-game data
   ├─ lastPlayedGame: 'pet-care'
   ├─ playCounts: { 'pet-care': 50, 'puzzle': 10 }
   ├─ totalPlayTime: 3600000
   └─ achievements: [...]

Pattern: {gameId}:{userId} → Game-specific user data
         gameProgress:{userId} → Cross-game metadata
```

---

## 12. Ad Integration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Ad Flow (Shared Across Games)              │
└─────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │   AdContext     │
                    │   (App-level)   │
                    └────────┬────────┘
                             │
                             │ Manages all ads
                             │
              ┌──────────────┼──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐          ┌─────────────────┐
     │  Interstitial   │          │   Rewarded Ad   │
     │      Ad         │          │                 │
     └────────┬────────┘          └────────┬────────┘
              │                             │
              │                             │
     5min + 4 screens                 On-demand
     frequency limit                  (user initiated)
              │                             │
              ▼                             ▼
     ┌─────────────────────────────────────────────┐
     │          Any Game Screen                    │
     │  (Pet Care, Puzzle, RPG, etc.)             │
     │                                             │
     │  - Can show interstitials between actions  │
     │  - Can offer rewarded ads for bonuses      │
     └─────────────────────────────────────────────┘

Benefits:
✅ Consistent ad experience across games
✅ Single frequency control
✅ Unified revenue tracking
✅ Less complex per-game
```

---

## 13. Testing Strategy Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                          │
└─────────────────────────────────────────────────────────────┘

                         ┌────────┐
                         │  E2E   │ (Optional)
                         │ Tests  │ - Full user journeys
                         └────────┘ - Multi-game sessions
                       ┌────────────┐
                       │Integration │
                       │   Tests    │ - Navigation flows
                       │            │ - Game switching
                       └────────────┘ - State persistence
                 ┌──────────────────────┐
                 │     Unit Tests       │
                 │                      │ - GameRegistry
                 │  - Components        │ - Contexts
                 │  - Hooks             │ - Navigation
                 │  - Utils             │ - Game modules
                 └──────────────────────┘

Test Coverage Goals:
├─ App Shell: >90% (critical infrastructure)
├─ Game Registry: 100% (core feature)
├─ Game Modules: >80% (game-specific logic)
└─ Shared Utils: >85% (reusable code)
```

---

## 14. Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                  Performance Strategy                       │
└─────────────────────────────────────────────────────────────┘

1. Lazy Loading
   ┌────────────────────┐
   │  Game Selection    │
   │  (lightweight)     │
   └─────────┬──────────┘
             │
             │ User selects game
             ▼
   ┌────────────────────┐
   │  Load game code    │────> Only selected game
   │  dynamically       │
   └────────────────────┘

2. Code Splitting (Future)
   ┌────────────────────┐
   │  Main bundle       │ (App shell + selection)
   └────────────────────┘
             │
             ├─> pet-care.bundle.js  (lazy)
             ├─> puzzle.bundle.js    (lazy)
             └─> rpg.bundle.js       (lazy)

3. Memory Management
   Game Active     Game Inactive
   ┌─────────┐     ┌─────────┐
   │ Context │     │ Context │
   │ Mounted │────>│Unmounted│
   │ Memory  │     │ Freed   │
   └─────────┘     └─────────┘

4. Asset Loading
   ┌────────────────────┐
   │  Preload critical  │ (Selection screen assets)
   └────────────────────┘
             │
             │ On game select
             ▼
   ┌────────────────────┐
   │  Load game assets  │ (Sprite sheets, images)
   └────────────────────┘
```

---

**Last Updated**: 2026-02-01
**Version**: 1.0
