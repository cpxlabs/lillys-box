# Games System Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GAMES SYSTEM 2.0 ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          GAME REGISTRATION                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  gameRegistrations.ts                                                │
│  ├─ Imports all game Providers & Navigators                         │
│  ├─ registerAllGames()                                              │
│  │  └─ gameRegistry.register({ id, emoji, category, ... })         │
│  └─ GameSelectionScreen shows all registered games                  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

                              ↓

┌─────────────────────────────────────────────────────────────────────┐
│                        GAME RENDERING FLOW                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. User selects game from GameSelectionScreen                       │
│     ↓                                                                 │
│  2. Navigation routes to Game Stack                                  │
│     ↓                                                                 │
│  3. Game Providers wrap the Stack                                    │
│     ┌──────────────────────────────────┐                             │
│     │  MyGameProvider (Context)         │                             │
│     │  ├─ bestScore, updateBestScore   │                             │
│     │  └─ Custom game state            │                             │
│     │                                   │                             │
│     │  MyGameNavigator (Stack)          │                             │
│     │  ├─ MyGameHomeScreen             │                             │
│     │  │  └─ Shows intro + best score  │                             │
│     │  │                                │                             │
│     │  └─ MyGameGameScreen             │                             │
│     │     ├─ useGameState()            │                             │
│     │     ├─ useGameTimer()            │                             │
│     │     ├─ useGameAnalytics()        │                             │
│     │     └─ Custom game logic         │                             │
│     │                                   │                             │
│     └──────────────────────────────────┘                             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

                              ↓

┌─────────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT LAYERS                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Layer 1: Game Context (Long-lived)                                 │
│  ┌─────────────────────────────────────┐                             │
│  │ MyGameContext                        │                             │
│  ├─ bestScore (persisted via AsyncStor│ │                             │
│  ├─ updateBestScore()                 │ │                             │
│  ├─ difficulty (optional)              │ │                             │
│  └─ toggleSound() (optional)           │ │                             │
│  └─────────────────────────────────────┘                             │
│           ↓ useMyGame()                                              │
│                                                                       │
│  Layer 2: Session State (Per game session)                           │
│  ┌─────────────────────────────────────┐                             │
│  │ useGameState('@game_xxx_best')      │                             │
│  ├─ state.currentScore                 │                             │
│  ├─ state.bestScore                    │                             │
│  ├─ state.isRunning                    │                             │
│  ├─ state.elapsedTime                  │                             │
│  ├─ state.sessionId                    │                             │
│  ├─ startGame()                        │                             │
│  ├─ endGame()                          │                             │
│  ├─ setScore()                         │                             │
│  └─ updateBestScore()                  │                             │
│  └─────────────────────────────────────┘                             │
│           ↓ useGameProgress(), useGameTimer(), etc.                  │
│                                                                       │
│  Layer 3: Game-Specific Logic (Frame-by-frame)                      │
│  ┌─────────────────────────────────────┐                             │
│  │ Game Screen State                    │                             │
│  ├─ refs (no re-renders)               │                             │
│  ├─ requestAnimationFrame loops        │                             │
│  └─ Physics/collision detection        │                             │
│  └─────────────────────────────────────┘                             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

                              ↓

┌─────────────────────────────────────────────────────────────────────┐
│                        DATA PERSISTENCE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  AsyncStorage Keys:                                                  │
│  @game_my-game_best_score      → 1500                               │
│  @game_my-game_stats           → { totalPlayed: 5, ... }            │
│  @game_my-game_settings        → { difficulty: 'hard', ... }        │
│                                                                       │
│  (Future: Firebase Cloud Sync for multiplayer)                      │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Hook Hierarchy

```
useMyGame()
├─ From Context
├─ Returns: { bestScore, updateBestScore }
└─ Scope: Entire app session

  ↓

useGameState('@storage_key')
├─ Manages: Session state
├─ Returns: { state, startGame, setScore, updateBestScore, ... }
└─ Scope: One game session

  ├─ useGameProgress(maxLevels)
  │  ├─ Manages: Level/difficulty
  │  └─ Returns: { level, nextLevel, goToLevel, ... }
  │
  ├─ useGameTimer(duration, onEnd)
  │  ├─ Manages: Countdown timer
  │  └─ Returns: { timeLeft, start, pause, resume, ... }
  │
  ├─ useGameStreak(storageKey)
  │  ├─ Manages: Combo/streak
  │  └─ Returns: { currentStreak, bestStreak, addToStreak, ... }
  │
  └─ useGameAnalytics(gameId)
     ├─ Tracks: Game events
     └─ Returns: { trackEvent, getEvents, clearEvents, ... }
```

---

## File Organization

```
app/src/
├── context/
│   ├── MyGameContext.tsx (created by generator)
│   ├── ColorTapContext.tsx
│   └── ... (36 game contexts + 5 app contexts)
│
├── screens/
│   ├── MyGameNavigator.tsx (created by generator)
│   ├── MyGameHomeScreen.tsx (created by generator)
│   ├── MyGameGameScreen.tsx (created by generator)
│   ├── ColorTapNavigator.tsx
│   ├── ColorTapHomeScreen.tsx
│   ├── ColorTapGameScreen.tsx
│   └── ... (85 screens total)
│
├── hooks/
│   ├── useGameBestScore.ts (existing)
│   ├── useGameState.ts (NEW - 5 hooks)
│   └── ... (other hooks)
│
├── types/
│   ├── gameState.ts (NEW - unified types)
│   └── ... (other types)
│
├── gameRegistrations.ts (main registry)
└── registry/
    └── GameRegistry.ts (registry implementation)

scripts/
└── generate-game.js (NEW - code generator)

docs/
├── GAMES_SYSTEM_UPGRADE.md (NEW - full reference)
├── GAMES_QUICK_REFERENCE.md (NEW - cheat sheet)
├── guides/
│   └── GAME_CREATION.md (NEW - creation guide)
└── design-system/
    └── ... (23 game specifications)
```

---

## Data Flow Diagram

```
┌──────────────────┐
│  User Interaction │
├──────────────────┤
│  onPress/onTap   │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Game Handler    │ updateScore()
├──────────────────┤
│  Calculates      │
│  Physics/Collision
└────────┬─────────┘
         ↓
┌──────────────────┐
│  setScore()      │ (from useGameState)
├──────────────────┤
│  Updates          │
│  ref (no re-render)
└────────┬─────────┘
         ↓
    (game loop continues)
         ↓
    (game ends)
         ↓
┌──────────────────┐
│  endGame()       │
├──────────────────┤
│  Sets endTime,   │
│  Calculates      │
│  final metrics   │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Check High Score │
├──────────────────┤
│  score > bestScore?
└─────┬──────────────┘
      │
      ├─→ YES → updateBestScore() → AsyncStorage
      │
      └─→ NO → Log stats
      
         ↓
┌──────────────────┐
│  Show Game Over  │
├──────────────────┤
│  Overlay/Modal   │
│  with score      │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  User Choice     │
├──────────────────┤
│  Play Again or   │
│  Back to Home    │
└──────────────────┘
```

---

## Type System Hierarchy

```
BaseGameState
├─ sessionId: string
├─ isRunning: boolean
├─ currentScore: number
├─ bestScore: number
├─ startTime: number
├─ endTime: number | null
└─ elapsedTime: number

    ↓ Extends ↓

MyGameState
├─ level: number
├─ combo: number
└─ difficulty: 'easy' | 'normal' | 'hard'

GameProgressState
├─ level: number
├─ completedLevels: number
├─ isLastLevel: boolean
└─ progressPercentage: number

GameDifficulty
├─ level: 'easy' | 'normal' | 'hard'
├─ speedMultiplier: number
├─ maxLives: number
├─ timeLimit: number
└─ customOptions: Record<string, unknown>

GameResult
├─ gameId: string
├─ finalScore: number
├─ isWin: boolean
├─ duration: number
├─ completedAt: number
├─ stars: number (1-3)
└─ achievements: string[]
```

---

## Performance Optimization Strategy

```
┌─────────────────────────────────────────┐
│  Game Rendering Optimization             │
├─────────────────────────────────────────┤
│                                          │
│  Component Layer:                        │
│  GameBoard = React.memo()                │
│  GameScore = React.memo()                │
│  → Only re-render on prop change        │
│                                          │
│  State Layer:                            │
│  useRef() for game loop                  │
│  → No re-renders during updates         │
│  Debounce context updates                │
│  → Batch high-frequency changes          │
│                                          │
│  Asset Layer:                            │
│  Lazy load sprites                       │
│  Skip unneeded sounds                    │
│  → Reduce bundle size                    │
│                                          │
└─────────────────────────────────────────┘
```

---

## New Files Created in Upgrade

```
✨ NEW
├── scripts/generate-game.js
│   └─ Generates Context + Navigator + 2 Screens
│
├── app/src/types/gameState.ts
│   └─ 8 unified game state interfaces
│
├── app/src/hooks/useGameState.ts
│   └─ 5 shared hooks + utilities
│
├── docs/GAMES_SYSTEM_UPGRADE.md
│   └─ Complete system reference (500+ lines)
│
├── docs/GAMES_QUICK_REFERENCE.md
│   └─ One-page cheat sheet
│
└── docs/guides/GAME_CREATION.md
    └─ Step-by-step creation guide
```

---

## Upgrade Impact Summary

```
BEFORE UPGRADE                AFTER UPGRADE
──────────────────           ──────────────────
Time to create game: 1-2h    Time to create game: ~5 min
Code duplication: HIGH       Code duplication: LOW
Type safety: MEDIUM          Type safety: HIGH
Documentation: BASIC         Documentation: COMPREHENSIVE
Consistency: MEDIUM          Consistency: HIGH

Features added:
+ Code generator (5 min per game)
+ 5 shared hooks (eliminate boilerplate)
+ Unified type system (consistency)
+ 3 comprehensive docs (faster onboarding)
+ Analytics framework (built-in)
```

---

## Next Steps for Developers

```
1️⃣  Read GAMES_QUICK_REFERENCE.md (5 min)
    ↓
2️⃣  Run game generator (1 min)
    ↓
3️⃣  Implement game logic (varies)
    ↓
4️⃣  Test on device
    ↓
5️⃣  Deploy! 🚀
```
