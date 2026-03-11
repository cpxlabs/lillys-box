# Games System Upgrade - Complete Reference

## Overview

This document describes the upgraded games system with new utilities, types, and tools to improve game development efficiency and code consistency.

**Date**: March 4, 2026  
**Version**: 2.0  
**Status**: Active

---

## What's New

### 1. Game Code Generator ✨

**File**: `scripts/generate-game.js`

Automatically generates game boilerplate files (Context, Navigator, Screens).

```bash
node scripts/generate-game.js \
  --name="Game Name" \
  --id="game-id" \
  --emoji="🎮" \
  --category="casual"
```

**Creates**:
- `src/context/{GameName}Context.tsx`
- `src/screens/{GameName}Navigator.tsx`
- `src/screens/{GameName}HomeScreen.tsx`
- `src/screens/{GameName}GameScreen.tsx`

**Benefit**: Eliminates repetitive boilerplate, ensures consistency across games.

---

### 2. Unified Game State Types

**File**: `src/types/gameState.ts`

Provides TypeScript interfaces for consistent game state management:

#### Key Types:

- **BaseGameState**: Core game state (score, time, status)
- **GameProgressState**: Level/difficulty tracking
- **GameStats**: Aggregate statistics
- **GameDifficulty**: Difficulty settings
- **GameResult**: Game completion data
- **GameSession**: Persisted session data
- **MultiplayerGameState**: Multiplayer-specific state

#### Usage:

```typescript
import { BaseGameState, GameProgressState } from '../types/gameState';

interface MyGameState extends BaseGameState {
  level: number;
  combo: number;
}
```

**Benefit**: Type safety, consistency, self-documenting code.

---

### 3. Shared Game Hooks Library

**File**: `src/hooks/useGameState.ts`

Collection of reusable hooks for common game patterns:

#### `useGameState(storageKey)`

Standard game state management with persistence.

```typescript
const { state, startGame, setScore, updateBestScore, isNewBest } = 
  useGameState('@game_my-game_best_score');

// state includes:
// - currentScore, bestScore, isRunning
// - startTime, endTime, elapsedTime
// - sessionId
```

#### `useGameProgress(maxLevels, startLevel)`

Level/difficulty progression management.

```typescript
const { level, nextLevel, goToLevel, isLastLevel, progressPercentage } = 
  useGameProgress(10);
```

#### `useGameTimer(duration, onTimeEnd)`

Countdown timer with pause/resume.

```typescript
const { timeLeft, start, pause, resume, percentageLeft } = 
  useGameTimer(60, () => endGame());
```

#### `useGameStreak(storageKey)`

Combo/streak tracking.

```typescript
const { currentStreak, bestStreak, addToStreak, breakStreak } = 
  useGameStreak('@game_my-game_streak');
```

#### `useGameAnalytics(gameId)`

Event tracking for analytics.

```typescript
const analytics = useGameAnalytics('my-game');
analytics.trackEvent('level_complete', { level: 5, time: 125 });
```

**Benefit**: Reduced code duplication, proven patterns, less bugs.

---

### 4. Games System Documentation

**File**: `docs/guides/GAME_CREATION.md`

Comprehensive guide covering:
- Quick start with code generator
- Game architecture patterns
- Context patterns (simple & complex)
- Component structure guidelines
- Testing patterns
- Performance tips
- Complete working examples
- Development checklist

**Benefit**: Faster onboarding, consistent implementation.

---

## Migration Guide

### Updating Existing Games (Optional)

If you want to modernize existing games to use the new patterns:

#### Step 1: Extract State Logic

Before:
```typescript
// Old context
const [bestScore, setBestScore] = useState(0);
// ... AsyncStorage loading/saving ...
```

After:
```typescript
// New context
const { bestScore, updateBestScore } = useGameBestScore('@game_xxx');
```

#### Step 2: Use Game State Hook

Before:
```typescript
const [score, setScore] = useState(0);
const [gameRunning, setGameRunning] = useState(false);
const [startTime, setStartTime] = useState(0);
// ... manual time tracking ...
```

After:
```typescript
const { state, startGame, setScore, endGame } = useGameState('@game_xxx_best');
// state.currentScore, state.isRunning, state.elapsedTime all handled
```

#### Step 3: Add Typed Game State

```typescript
import { BaseGameState } from '../types/gameState';

interface MyGameState extends BaseGameState {
  level: number;
  combo: number;
}
```

#### Step 4: Run Type Checking

```bash
cd app
npm run type-check
```

---

## Architecture Overview

### Game Registration Flow

```
registerAllGames()
├─ gameRegistry.register(gameDefinition)
│  ├─ id: string
│  ├─ providers: [Context1, Context2, ...]
│  ├─ navigator: StackNavigator
│  └─ metadata: name, description, emoji, category
│
└─ GameSelectionScreen displays all games
   └─ User selects game
      └─ Providers wrap Navigator
         └─ Navigator (Stack)
            ├─ HomeScreen
            └─ GameScreen
```

### State Management Pattern

```
Game-Level Context (e.g., ColorTapContext)
├─ Manages: game-specific state
├─ Persists: AsyncStorage via useGameBestScore
└─ Provides: Best score, update function

Game Screen
├─ Uses: useGameState() for session state
├─ Uses: Game context for best score
├─ Uses: useGameTimer() for countdown
└─ Tracks: Session events with analytics
```

---

## Current Games (34 Total)

### Categories

**Pet Care** (1)
- pet-care

**Casual** (19)
- muito, color-tap, dress-up-relay, feed-the-pet, whack-a-mole
- catch-the-ball, bubble-pop, pet-dance-party, treasure-dig
- balloon-float, paint-splash, snack-stack, lightning-tap
- pet-chef, music-maker, garden-grow, photo-studio
- hide-and-seek, star-catcher

**Puzzle** (10)
- memory-match, simon-says, color-mixer, sliding-puzzle
- path-finder, shape-sorter, mirror-match-new, word-bubbles
- jigsaw-pets, connect-dots

**Adventure** (4)
- pet-runner, pet-explorer, weather-wizard, pet-taxi

---

## Best Practices

### Do ✅

- Use `useGameState` for standard game state
- Use provided hooks for common patterns
- Type your game state with extended interfaces
- Persist best scores with AsyncStorage keys
- Track analytics events
- Test context providers
- Lazy load game assets
- Memoize game components

### Don't ❌

- Create new state management patterns from scratch
- Duplicate scoretracking logic
- Ignore TypeScript typing
- Update context on every frame (use refs)
- Forget to cleanup timers in useEffect
- Create new hooks without documenting
- Skip testing context logic

---

## Performance Considerations

### Bundle Size

Each game is independently lazy-loaded. Total bundle estimated:
- Core app: ~500KB
- Per game: ~50-150KB
- Total with all 36 games: ~4-5MB (not all loaded at once)

### Optimization Strategies

1. **Lazy Load Screens**: Use `lazy()` + `Suspense`
   ```typescript
   const MyGameScreen = lazy(() => import('./MyGameGameScreen'));
   ```

2. **Memoize Components**:
   ```typescript
   export const GameBoard = React.memo(({ score }) => {
     // Only re-renders if score changes
   });
   ```

3. **Use Refs for Game Loops**:
   ```typescript
   const gameLoopRef = useRef<number>();
   gameLoopRef.current = requestAnimationFrame(() => {
     // Update without re-rendering
   });
   ```

4. **Debounce Score Updates**:
   ```typescript
   const updateScoreDebounced = useCallback(
     debounce((score) => setScore(score), 100),
     []
   );
   ```

---

## Testing Strategy

### Unit Tests

```typescript
// Test context
describe('ColorTapContext', () => {
  it('should update best score', () => {
    // Test provider and hook
  });
});

// Test hooks
describe('useGameState', () => {
  it('should track session state', () => {
    // Test hook behavior
  });
});
```

### Integration Tests (Maestro E2E)

```yaml
appId: com.lillybox.game
---
- launchApp
- tapOn:
    id: "game_color-tap"
- assertVisible:
    text: "Best Score"
- tapOn:
    text: "Play"
- (game interaction tests...)
```

### Manual Testing

1. Test on Android, iOS, Web
2. Test best score persistence (restart app)
3. Test transitions between games
4. Test memory management (play many games)

---

## Common Issues & Solutions

### Issue: Best Score Not Persisting

**Check**:
- Using correct AsyncStorage key format: `@game_xyz`
- Context provider wraps the game components
- `updateBestScore()` called with new score

```typescript
// ✅ Correct
const { bestScore, updateBestScore } = useGameBestScore('@game_xyz');

// ❌ Wrong
const { bestScore, updateBestScore } = useGameBestScore('xyz');
```

### Issue: Memory Leak (unfinished cleanup)

**Always cleanup**:
```typescript
useEffect(() => {
  const timerRef = setInterval(...);
  return () => clearInterval(timerRef);  // ← Important!
}, []);
```

### Issue: Stale Context

**Ensure provider wraps screen**:
```typescript
// In Navigator Component:
<GameContextProvider>
  <Stack.Navigator>
    <Stack.Screen component={HomeScreen} />
    <Stack.Screen component={GameScreen} />
  </Stack.Navigator>
</GameContextProvider>
```

---

## Future Improvements

### Planned for v2.1

- [ ] Game templates (leaderboards, achievements)
- [ ] Shared state between players (multiplayer foundation)
- [ ] Cross-game progression system
- [ ] Advanced analytics dashboard
- [ ] Automated performance profiling
- [ ] Game preview system

### Planned for v3.0

- [ ] WebAssembly game runtime
- [ ] Advanced physics engine integration
- [ ] Social features (replays, challenges)
- [ ] In-game streaming (Twitch integration)
- [ ] AI opponent system

---

## Troubleshooting

### Debug Mode

Enable detailed logging:

```typescript
// In gameState.ts or context
const DEBUG = true;

if (DEBUG) {
  console.log('[Game State]', state);
  analytics.trackEvent('debug_state_change', state);
}
```

### Inspect State

React DevTools:
1. Install React DevTools extension
2. Open DevTools
3. Go to "Profiler" tab
4. Start recording
5. Interact with game
6. Analyze component updates

### Check AsyncStorage

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const checkStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  keys.forEach(async (key) => {
    if (key.startsWith('@game_')) {
      const value = await AsyncStorage.getItem(key);
      console.log(`${key}:`, value);
    }
  });
};
```

---

## Support & Questions

For issues or questions:
1. Check [GAME_CREATION.md](./GAME_CREATION.md)
2. Review existing games as examples
3. Check TypeScript types in `src/types/gameState.ts`
4. Look at hook implementation in `src/hooks/useGameState.ts`

---

## Related Documentation

- [Game Creation Guide](./GAME_CREATION.md)
- [Folder Structure](./FOLDER_STRUCTURE.md)
- [Design System](../design-system/)
- [Technical API Reference](../technical/API_REFERENCE.md)
- [Testing Guide](../testing/TESTING.md)
