# Feed the Pet Game - Implementation Plan

## Overview

**Game Type:** Catch Game (Casual)
**Complexity:** Low-Medium
**Target Category:** `casual`
**Emoji:** 🍽️

A falling-object catch game where players move a bowl left and right to catch falling food items for points while avoiding bad items that cost lives.

---

## Game Mechanics

### Core Gameplay

1. **Falling Items**
   - Food items fall from random horizontal positions at the top
   - Starting speed: moderate (3-4 pixels per frame)
   - Speed increases every 30 seconds (difficulty scaling)
   - Spawn rate increases over time

2. **Player Control**
   - Drag a bowl horizontally along the bottom of the screen
   - Bowl tracks horizontal pan gesture
   - Bowl stays within screen bounds
   - Visual: 🥣 emoji (bowl) sized ~50px

3. **Good Items (Food)**
   - 🍖 Kibble: +10 points
   - 🐟 Fish: +15 points
   - 🦴 Treat: +20 points
   - 🥛 Milk: +5 points
   - Uses existing `FOOD_ITEMS` from `src/data/foodItems.ts`

4. **Bad Items**
   - 🪨 Rock: -10 points, -1 life
   - 🗑️ Garbage: -15 points, -1 life
   - 💩 Poop: -5 points, -1 life

5. **Lives System**
   - Start with 3 lives (❤️)
   - Lose 1 life per bad item caught
   - Game over when lives = 0
   - Missing items (letting them fall) does NOT lose lives

6. **Combo System**
   - Consecutive good catches build a combo multiplier
   - 2 in a row: 1.5x
   - 3 in a row: 2x
   - 5+ in a row: 3x
   - Catching a bad item or missing resets combo

---

## Scoring Formula

```
Base Points = Item Value × Combo Multiplier
Final Score = Total Points Accumulated
Coin Reward = floor(Final Score / 10)
```

---

## Technical Architecture

### File Structure

```
src/
├── context/
│   └── FeedThePetContext.tsx         # State management, best score
├── screens/
│   ├── FeedThePetNavigator.tsx       # Stack navigator
│   ├── FeedThePetHomeScreen.tsx      # Home/menu screen
│   └── FeedThePetGameScreen.tsx      # Main game screen
├── data/
│   └── feedThePetItems.ts            # Bad items config
└── i18n/
    ├── en.json                        # English translations
    └── pt.json                        # Portuguese translations
```

### 1. FeedThePetContext

**Purpose:** Manage best score persistence per user

**Interface:**
```typescript
interface FeedThePetContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}
```

**Storage Key:** `@feed_the_pet:bestScore:{userId}`

**Pattern:** Follow `PetRunnerContext.tsx` pattern with AsyncStorage

---

### 2. FeedThePetNavigator

**Purpose:** Stack navigation between Home and Game screens

**Routes:**
- `FeedThePetHome` → FeedThePetHomeScreen
- `FeedThePetGame` → FeedThePetGameScreen

**Pattern:** Follow `MemoryMatchNavigator.tsx` pattern

---

### 3. FeedThePetHomeScreen

**Layout:**
```
┌──────────────────────────────┐
│       SafeAreaView           │
│   bg: #fff8e1 (light amber)  │
│                              │
│  ← Back                      │
│                              │
│  ┌──────────────────────┐    │
│  │     🍽️ (72px)       │    │
│  │  "Feed the Pet"     │    │  40px, weight 800, #ff9800
│  │    subtitle         │    │  18px, #666
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │ Best: 350    │   │    │  Score card
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │    Play      │   │    │  bg: #ff9800, pill
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  instructions...     │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

**Theme Colors:**
- Background: `#fff8e1` (light amber, matches Feed scene)
- Accent: `#ff9800` (orange, matches Feed scene)
- White cards with shadows for score display

**Elements:**
- Title emoji: 🍽️ (72px)
- Title text: "Feed the Pet" from i18n
- Subtitle: Game description from i18n
- Best Score Card: Only shown if bestScore > 0
- Play Button: Large, orange pill button
- Instructions: Brief explanation of controls

**Pattern:** Follow `PetRunnerHomeScreen.tsx` layout

---

### 4. FeedThePetGameScreen

**Layout:**
```
┌──────────────────────────────┐
│       SafeAreaView           │
│   bg: #fff8e1 (light amber)  │
│                              │
│  ← Back   ❤️❤️❤️   Score: 45│  Header
│                              │
│           Combo: 3x!         │  Combo display
│                              │
│  🐟                          │  Falling items
│      🍖      🪨              │  (animated Y position)
│          🦴                  │
│                              │
│                              │
│            🥣                │  Bowl (draggable)
│  ────────────────────────    │  Ground line
└──────────────────────────────┘
```

**Game Area:**
- Full screen minus header
- Background: `#fff8e1` (matches home)
- Ground line at bottom (visual boundary)

**Header:**
- Back button (left): `16px`, weight `600`, color `#ff9800`
- Lives display (center): ❤️ emoji repeated (red filled for active, 🖤 for lost)
- Score (right): `18px`, weight `700`, color `#ff9800`

**Combo Display:**
- Position: Below header, centered
- Text: "Combo: {count}x!" in `20px`, weight `700`, color `#27ae60` (green)
- Only visible when combo > 1
- Pulse animation on combo increase

**Falling Items:**
- Emoji size: `36px`
- Start at random X positions across top 80% of screen width
- Fall speed: starts at `3` pixels/frame, increases over time
- Spawn interval: starts at `1500ms`, decreases to min `800ms`

**Bowl:**
- Emoji: 🥣 sized `50px`
- Position: Bottom of screen minus `100px`
- Horizontal movement via PanGestureHandler
- Collision detection: 40px radius around bowl center

**Ground Line:**
- Position: `80px` from bottom
- Height: `4px`
- Color: `#ff9800` with 50% opacity

---

### 5. Game Over Overlay

**Layout:**
```
┌──────────────────────────────┐
│    Backdrop (rgba black)     │
│                              │
│  ┌──────────────────────┐    │
│  │  "Game Over!"        │    │  28px, weight 800, #e74c3c
│  │                       │    │
│  │  Final Score: 150    │    │  22px, weight 800, #ff9800
│  │  Coins Earned: 15    │    │  16px, #666
│  │  NEW BEST!           │    │  18px, weight 800, #f1c40f (if applicable)
│  │                       │    │
│  │  ┌────────────────┐  │    │
│  │  │  Play Again    │  │    │  bg: #ff9800
│  │  └────────────────┘  │    │
│  │                       │    │
│  │      Back             │    │  Link style
│  └──────────────────────┘    │
└──────────────────────────────┘
```

**Pattern:** Follow `PetRunnerGameScreen.tsx` game over overlay

---

## Physics & Game Loop

### useEffect Game Loop

```typescript
useEffect(() => {
  if (!isPlaying) return;

  const interval = setInterval(() => {
    // Update falling items Y positions
    // Check collisions with bowl
    // Remove off-screen items
    // Spawn new items based on timer
    // Update difficulty over time
  }, 16); // ~60 FPS

  return () => clearInterval(interval);
}, [isPlaying]);
```

### Collision Detection

```typescript
const checkCollision = (itemX: number, itemY: number, bowlX: number) => {
  const distance = Math.sqrt(
    Math.pow(itemX - bowlX, 2) +
    Math.pow(itemY - bowlY, 2)
  );
  return distance < 40; // collision radius
};
```

### Difficulty Scaling

```typescript
// Every 30 seconds (1800 frames at 60fps)
if (frames % 1800 === 0 && fallSpeed < 8) {
  fallSpeed += 0.5;
  spawnInterval = Math.max(spawnInterval - 100, 800);
}
```

---

## State Management

### Game State

```typescript
interface GameState {
  score: number;
  lives: number;
  combo: number;
  isPlaying: boolean;
  isPaused: boolean;
  fallSpeed: number;
  spawnInterval: number;
  frames: number;
}
```

### Falling Item

```typescript
interface FallingItem {
  id: string; // unique ID for React key
  type: 'good' | 'bad';
  emoji: string;
  points: number;
  x: number; // horizontal position
  y: number; // vertical position
}
```

---

## i18n Translation Keys

### English (`en.json`)

```json
{
  "selectGame": {
    "feedThePet": {
      "name": "Feed the Pet",
      "description": "Catch falling food!"
    }
  },
  "feedThePet": {
    "home": {
      "title": "Feed the Pet",
      "subtitle": "Catch the falling treats!",
      "instructions": "Drag the bowl to catch food. Avoid bad items! 3 lives.",
      "bestScore": "Best Score",
      "play": "Play"
    },
    "game": {
      "score": "Score",
      "lives": "Lives",
      "combo": "Combo",
      "gameOver": "Game Over!",
      "finalScore": "Final Score",
      "coinsEarned": "Coins Earned",
      "newBest": "NEW BEST!",
      "playAgain": "Play Again",
      "back": "Back"
    }
  }
}
```

### Portuguese (`pt.json`)

```json
{
  "selectGame": {
    "feedThePet": {
      "name": "Alimentar o Pet",
      "description": "Pegue a comida que cai!"
    }
  },
  "feedThePet": {
    "home": {
      "title": "Alimentar o Pet",
      "subtitle": "Pegue os petiscos que caem!",
      "instructions": "Arraste a tigela para pegar comida. Evite itens ruins! 3 vidas.",
      "bestScore": "Melhor Pontuação",
      "play": "Jogar"
    },
    "game": {
      "score": "Pontos",
      "lives": "Vidas",
      "combo": "Combo",
      "gameOver": "Fim de Jogo!",
      "finalScore": "Pontuação Final",
      "coinsEarned": "Moedas Ganhas",
      "newBest": "NOVO RECORDE!",
      "playAgain": "Jogar Novamente",
      "back": "Voltar"
    }
  }
}
```

---

## Registration in App.tsx

```typescript
import { FeedThePetProvider } from './src/context/FeedThePetContext';
import { FeedThePetNavigator } from './src/screens/FeedThePetNavigator';

gameRegistry.register({
  id: 'feed-the-pet',
  nameKey: 'selectGame.feedThePet.name',
  descriptionKey: 'selectGame.feedThePet.description',
  emoji: '🍽️',
  category: 'casual',
  navigator: FeedThePetNavigator,
  providers: [FeedThePetProvider],
  isEnabled: true,
});
```

---

## Implementation Steps

### Phase 1: Foundation
1. ✅ Create plan document
2. Create `FeedThePetContext.tsx`
3. Create `FeedThePetNavigator.tsx`
4. Create `feedThePetItems.ts` (bad items data)
5. Add i18n keys to `en.json` and `pt.json`

### Phase 2: Home Screen
6. Create `FeedThePetHomeScreen.tsx`
   - Layout with title, subtitle, instructions
   - Best score card (conditional)
   - Play button navigation
   - Orange/amber theme styling

### Phase 3: Game Screen - Basic
7. Create `FeedThePetGameScreen.tsx` structure
   - Header (back, lives, score)
   - Game area container
   - Bowl component with PanGestureHandler

### Phase 4: Game Logic
8. Implement falling items system
   - Spawn logic with timer
   - Y-position animation loop
   - Random X positioning
9. Implement collision detection
10. Implement scoring and combo system
11. Implement lives and game over

### Phase 5: Polish
12. Add combo display with animation
13. Add game over overlay
14. Connect best score to context
15. Add visual feedback (haptics optional)
16. Test difficulty scaling

### Phase 6: Integration
17. Register game in `App.tsx`
18. Update navigation types if needed
19. Test full flow
20. Create design documentation

---

## Testing Checklist

- [ ] Game starts correctly from home screen
- [ ] Bowl drags smoothly across screen
- [ ] Bowl stays within bounds
- [ ] Good items award correct points
- [ ] Bad items deduct life and points
- [ ] Combo system works correctly
- [ ] Combo resets on bad catch or miss
- [ ] Lives display updates correctly
- [ ] Game over triggers at 0 lives
- [ ] Best score saves and loads
- [ ] Best score only updates if new score is higher
- [ ] Difficulty increases over time
- [ ] Back button works from home and game
- [ ] i18n switches between English and Portuguese
- [ ] Play Again restarts game correctly
- [ ] Coins are awarded (integration with economy)
- [ ] Game works on different screen sizes

---

## Future Enhancements

- Power-ups (magnet, shield, slow motion)
- Rare golden food items (bonus points)
- Achievements (100 combo, 1000 points, etc.)
- Sound effects for catches
- Background music
- Particle effects on catch
- Leaderboard integration
- Different bowl skins to unlock
