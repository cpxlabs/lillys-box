# Game Creation Guide

Guide to creating a new game in the Lilly's Box system with best practices and patterns.

## Quick Start

### 1. Generate Game Scaffold

Use the game generator script to create boilerplate:

```bash
cd /workspaces/pet-care-game
node scripts/generate-game.js \
  --name="My Game Name" \
  --id="my-game-id" \
  --emoji="🎮" \
  --category="casual|puzzle|adventure|pet"
```

This creates:
- Context provider (`src/context/MyGameContext.tsx`)
- Navigator component (`src/screens/MyGameNavigator.tsx`)
- Home screen (`src/screens/MyGameHomeScreen.tsx`)
- Game screen (`src/screens/MyGameGameScreen.tsx`)

### 2. Register Game

Add imports and registration in `src/gameRegistrations.ts`:

```typescript
import { MyGameProvider } from './context/MyGameContext';
import { MyGameNavigator } from './screens/MyGameNavigator';

// In registerAllGames():
gameRegistry.register({
  id: 'my-game-id',
  nameKey: 'selectGame.mygameid.name',
  descriptionKey: 'selectGame.mygameid.description',
  emoji: '🎮',
  category: 'casual',
  navigator: MyGameNavigator,
  providers: [MyGameProvider],
  isEnabled: true,
});
```

### 3. Add Translations

Add i18n keys to `src/locales/en.json` and `src/locales/pt-br.json`:

```json
{
  "selectGame": {
    "mygameid": {
      "name": "My Game Name",
      "description": "Description of what the game does"
    }
  }
}
```

### 4. Implement Game Logic

Update `MyGameGameScreen.tsx` with your game logic.

---

## Architecture Patterns

### Standard Game State

Use `useGameState` hook for basic game state:

```typescript
import { useGameState } from '../hooks/useGameState';

export const MyGameGameScreen: React.FC<any> = () => {
  const { state, startGame, setScore, updateBestScore, isNewBest } = 
    useGameState('@game_my-game-id_best_score');

  // state has:
  // - currentScore: number
  // - bestScore: number
  // - isRunning: boolean
  // - elapsedTime: number
  // - sessionId: string
```

### Game with Levels/Progress

Use `useGameProgress` for level management:

```typescript
import { useGameProgress } from '../hooks/useGameState';

const { level, nextLevel, goToLevel, isLastLevel, progressPercentage } = 
  useGameProgress(10); // 10 levels max

if (levelComplete) {
  nextLevel();
}
```

### Timed Games

Use `useGameTimer` for countdown mechanics:

```typescript
import { useGameTimer } from '../hooks/useGameState';

const { timeLeft, start, pause, reset } = useGameTimer(60, () => {
  // This runs when time is up
  endGame();
});

useEffect(() => {
  start();
}, []);
```

### Analytics Tracking

Track game events:

```typescript
import { useGameAnalytics } from '../hooks/useGameState';

const analytics = useGameAnalytics('my-game-id');

analytics.trackEvent('level_complete', { level: 1, time: 125 });
analytics.trackEvent('score_achieved', { score: 1500 });
```

---

## Context Pattern

### Simple Context (Best Score Only)

```typescript
import { useGameBestScore } from '../hooks/useGameBestScore';

export const MyGameProvider: React.FC<{ children }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_my-game-id_best_score');
  
  return (
    <MyGameContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </MyGameContext.Provider>
  );
};
```

### Complex Context (Game Settings)

```typescript
interface MyGameContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
  difficulty: 'easy' | 'normal' | 'hard';
  setDifficulty: (diff: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const MyGameContext = createContext<MyGameContextType | null>(null);

export const MyGameProvider: React.FC<{ children }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_my-game-id_best_score');
  const [difficulty, setDifficulty] = useState('normal');
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <MyGameContext.Provider value={{
      bestScore,
      updateBestScore,
      difficulty,
      setDifficulty,
      soundEnabled,
      toggleSound: () => setSoundEnabled(!soundEnabled),
    }}>
      {children}
    </MyGameContext.Provider>
  );
};
```

---

## Component Structure

### Navigator Structure

```
MyGameNavigator
├── MyGameHomeScreen (intro, best score, start button)
└── MyGameGameScreen (actual gameplay)
```

Optional additional screens:
- `MyGameLevelScreen` - Level selection
- `MyGameSettingsScreen` - Game settings
- `MyGameResultsScreen` - Game over details

### Home Screen Best Practices

```typescript
export const MyGameHomeScreen: React.FC<NavigationProp> = ({ navigation }) => {
  const { bestScore } = useMyGame();

  return (
    <View>
      <ScreenHeader title="selectGame.mygameid.name" />
      
      {/* Show best score */}
      <ScoreDisplay score={bestScore} />
      
      {/* Game description/rules */}
      <GameDescription />
      
      {/* Start button */}
      <IconButton
        label="Play"
        backgroundColor="#007AFF"
        onPress={() => navigation.navigate('MyGameGame')}
      />
    </View>
  );
};
```

### Game Screen Best Practices

```typescript
export const MyGameGameScreen: React.FC<NavigationProp> = ({ navigation }) => {
  const { updateBestScore } = useMyGame();
  const { state, startGame, setScore, endGame } = useGameState('@game_...');

  useEffect(() => {
    startGame();
  }, []);

  const handleGameOver = () => {
    endGame();
    if (state.currentScore > state.bestScore) {
      updateBestScore(state.currentScore);
    }
    // Show game over screen or modal
  };

  return (
    <View style={styles.container}>
      {/* Header with back button and score */}
      <GameHeader
        score={state.currentScore}
        onBack={() => navigation.goBack()}
      />
      
      {/* Game content */}
      <GameBoard />
      
      {/* Game over overlay if needed */}
      {!state.isRunning && <GameOverModal />}
    </View>
  );
};
```

---

## Testing

### Context Testing

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { MyGameProvider, useMyGame } from '../context/MyGameContext';

test('should update best score', () => {
  const wrapper = ({ children }) => (
    <MyGameProvider>{children}</MyGameProvider>
  );
  
  const { result } = renderHook(() => useMyGame(), { wrapper });
  
  act(() => {
    result.current.updateBestScore(100);
  });
  
  expect(result.current.bestScore).toBe(100);
});
```

### Game State Testing

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useGameState } from '../hooks/useGameState';

test('should track game progress', () => {
  const { result } = renderHook(() => useGameState('@test_game'));
  
  act(() => {
    result.current.startGame();
    result.current.setScore(50);
  });
  
  expect(result.current.state.currentScore).toBe(50);
  expect(result.current.state.isRunning).toBe(true);
});
```

---

## Performance Tips

1. **Memoize components** - Use `React.memo()` for game components
2. **Lazy load assets** - Load sprites/images only when needed
3. **Use refs for rapid updates** - Game loops should use refs, not state
4. **Debounce score updates** - Don't update context on every frame
5. **Clear timers** - Always cleanup intervals in useEffect

---

## Example: Simple Tap Game

```typescript
// Context
export const TapGameProvider: React.FC<{ children }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_tap-game');
  return (
    <TapGameContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </TapGameContext.Provider>
  );
};

// Game Screen
export const TapGameGameScreen: React.FC = ({ navigation }) => {
  const { updateBestScore } = useTapGame();
  const { state, startGame, setScore, endGame } = useGameState('@game_tap-game');
  const { timeLeft, start: startTimer } = useGameTimer(30, handleGameOver);

  useEffect(() => {
    startGame();
    startTimer();
  }, []);

  const handleTap = () => {
    setScore(state.currentScore + 1);
  };

  const handleGameOver = () => {
    endGame();
    if (state.currentScore > state.bestScore) {
      updateBestScore(state.currentScore);
    }
    // Show results
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timeLeft}s</Text>
      <Text style={styles.score}>{state.currentScore}</Text>
      
      <Pressable
        style={styles.button}
        onPress={handleTap}
      >
        <Text style={styles.buttonText}>TAP!</Text>
      </Pressable>
    </View>
  );
};
```

---

## Checklist

- [ ] Run game generator script
- [ ] Register game in `gameRegistrations.ts`
- [ ] Add i18n translations
- [ ] Implement game logic in GameScreen
- [ ] Add score tracking with `useGameState`
- [ ] Test on Android/iOS/Web
- [ ] Add icon/emoji
- [ ] Test best score persistence
- [ ] Add analytics tracking (if needed)
- [ ] Create unit tests for context
- [ ] Add E2E tests with Maestro (if needed)
