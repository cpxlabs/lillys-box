# Games System Quick Reference 🎮

One-page cheat sheet for game development in Lilly's Box.

## 🚀 Create New Game (5 Minutes)

```bash
node scripts/generate-game.js \
  --name="My Game" \
  --id="my-game" \
  --emoji="🎮" \
  --category="casual"
```

Then:
1. Add imports & registration to `gameRegistrations.ts`
2. Add i18n keys to `locales/en.json` and `pt-br.json`
3. Implement game logic in generated `GameScreen.tsx`
4. Done! ✅

---

## 📊 Game State Management

### Basic State
```typescript
const { state, startGame, setScore, updateBestScore, isNewBest } = 
  useGameState('@game_my-game_best_score');

// state.currentScore, state.bestScore, state.isRunning, state.elapsedTime
```

### With Levels
```typescript
const { level, nextLevel, goToLevel, isLastLevel } = 
  useGameProgress(10); // 10 levels max
```

### With Timer
```typescript
const { timeLeft, start, pause, reset } = 
  useGameTimer(60, () => endGame());

useEffect(() => { start(); }, []);
```

### Analytics
```typescript
const analytics = useGameAnalytics('my-game');
analytics.trackEvent('level_complete', { level: 1, time: 125 });
```

---

## 🏗️ File Structure

```
MyGameNavigator.tsx
├── MyGameHomeScreen.tsx (intro + best score)
└── MyGameGameScreen.tsx (gameplay)

[Optional advanced screens]
├── MyGameLevelScreen.tsx
├── MyGameSettingsScreen.tsx
└── MyGameResultsScreen.tsx
```

---

## 💾 Context Pattern

### Minimal
```typescript
export const MyGameProvider = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_xyz');
  return <MyGameContext.Provider value={{ bestScore, updateBestScore }}>
    {children}
  </MyGameContext.Provider>;
};

export const useMyGame = () => {
  const ctx = useContext(MyGameContext);
  if (!ctx) throw new Error('Must use within MyGameProvider');
  return ctx;
};
```

### With Settings
```typescript
const value = {
  bestScore,
  updateBestScore,
  difficulty: difficulty,
  setDifficulty: setDifficulty,
  soundEnabled: soundEnabled,
  toggleSound: () => setSoundEnabled(!soundEnabled),
};
```

---

## 🎮 Typical Game Screen

```typescript
export const MyGameGameScreen = ({ navigation }) => {
  const { updateBestScore } = useMyGame();
  const { state, startGame, setScore, endGame } = useGameState('@game_my-game');

  useEffect(() => {
    startGame(); // Start session
  }, []);

  const handleTap = () => {
    setScore(state.currentScore + 1);
  };

  const handleGameOver = () => {
    endGame();
    if (state.currentScore > state.bestScore) {
      updateBestScore(state.currentScore);
    }
  };

  return (
    <View>
      <GameHeader score={state.currentScore} />
      <GameBoard onTap={handleTap} />
      {!state.isRunning && <GameOverModal score={state.currentScore} />}
    </View>
  );
};
```

---

## 🔌 Register Game

In `src/gameRegistrations.ts`:

```typescript
// Add imports
import { MyGameProvider } from './context/MyGameContext';
import { MyGameNavigator } from './screens/MyGameNavigator';

// In registerAllGames()
gameRegistry.register({
  id: 'my-game',
  nameKey: 'selectGame.mygame.name',
  descriptionKey: 'selectGame.mygame.description',
  emoji: '🎮',
  category: 'casual',
  navigator: MyGameNavigator,
  providers: [MyGameProvider],
  isEnabled: true,
});
```

---

## 🌐 i18n Setup

In `src/locales/en.json`:
```json
{
  "selectGame": {
    "mygame": {
      "name": "My Game",
      "description": "Description of what player does"
    }
  }
}
```

In `src/locales/pt-br.json`:
```json
{
  "selectGame": {
    "mygame": {
      "name": "Meu Jogo",
      "description": "Descrição do que o jogador faz"
    }
  }
}
```

---

## ✅ Checklist

- [ ] Run game generator
- [ ] Register in `gameRegistrations.ts`
- [ ] Add i18n translations
- [ ] Implement GameScreen logic
- [ ] Test best score persistence (restart app)
- [ ] Test on Android/iOS/Web
- [ ] Add analytics tracking (optional)
- [ ] Add unit tests (recommended)

---

## 📚 Full Docs

- **Quick Start**: [GAME_CREATION.md](../../docs/guides/GAME_CREATION.md)
- **System Reference**: [GAMES_SYSTEM_UPGRADE.md](../../docs/GAMES_SYSTEM_UPGRADE.md)
- **Available Hooks**: `src/hooks/useGameState.ts`
- **Shared Types**: `src/types/gameState.ts`

---

## 🐛 Common Issues

| Issue | Solution |\n|-------|----------|\n| Best score not saving | Check AsyncStorage key format: `@game_xxx` |\n| Timer not starting | Call `start()` in useEffect |\n| Context value undefined | Ensure provider wraps screens |\n| Memory leak warning | Cleanup timers: `return () => clearInterval()` |\n| Component re-renders too much | Use `React.memo()` or refs for game loops |\n\n---\n\n## 📊 Games by Category\n\n**32 games total**\n- Casual: 11\n- Puzzle: 8  \n- Adventure: 4\n- Pet Care: 1\n- Multiplayer: 1\n\n---\n\n**Happy game developing! 🎮✨**\n