# Whack-a-Mole Game - Implementation Plan

## Overview

**Game Type:** Whack-a-Mole / Garden Pest Edition
**Complexity:** Low
**Target Category:** `casual`
**Emoji:** 🔨

A classic whack-a-mole game where pests pop up from holes in a garden grid. Players tap them quickly before they disappear. Bonus rounds feature friendly animals that must NOT be tapped.

---

## Game Mechanics

### Core Gameplay

1. **Grid Layout**
   - 3x3 grid of "holes" on a garden background
   - Each hole can be empty or have a pest/animal popping up
   - Green grass background with brown holes

2. **Pest Types**
   - 🐛 Bug: Common pest (+10 points)
   - 🐭 Mouse: Fast pest (+15 points)
   - 🦗 Cricket: Medium pest (+12 points)
   - 🪱 Worm: Slow pest (+8 points)

3. **Friendly Animals (DO NOT TAP)**
   - 🐱 Cat: -20 points if tapped
   - 🐶 Dog: -20 points if tapped
   - Appear randomly in bonus rounds (every 3rd round)

4. **Timing Mechanics**
   - Pests pop up for limited time (starts at 1.5s, shrinks to 0.5s)
   - Pop-up speed increases with difficulty
   - Spawn rate increases over time
   - Round-based: 30 seconds per round

5. **Power-Ups**
   - ❄️ Freeze Time: All pests stay visible for 3 seconds
   - ⭐ Double Points: 2x score for 5 seconds
   - Power-ups spawn randomly with 10% chance

---

## Scoring Formula

```
Base Points:
- Bug: +10
- Mouse: +15
- Cricket: +12
- Worm: +8
- Friendly Animal: -20

Speed Bonus:
- Tap within 0.3s: +5 bonus points
- Tap within 0.5s: +3 bonus points

Round Bonus:
- Complete round: +50
- Perfect round (no misses): +100

Coin Reward = floor(Final Score / 15)
```

---

## Technical Architecture

### File Structure

```
src/
├── context/
│   └── WhackAMoleContext.tsx         # State management, best score
├── screens/
│   ├── WhackAMoleNavigator.tsx       # Stack navigator
│   ├── WhackAMoleHomeScreen.tsx      # Home/menu screen
│   └── WhackAMoleGameScreen.tsx      # Main game screen
├── data/
│   └── whackAMoleItems.ts            # Pest/animal config
└── locales/
    ├── en.json                        # English translations
    └── pt-BR.json                     # Portuguese translations
```

### 1. WhackAMoleContext

**Purpose:** Manage best score persistence per user

**Interface:**
```typescript
interface WhackAMoleContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}
```

**Storage Key:** `@whack_a_mole:bestScore:{userId}`

---

### 2. WhackAMoleNavigator

**Purpose:** Stack navigation between Home and Game screens

**Routes:**
- `WhackAMoleHome` → WhackAMoleHomeScreen
- `WhackAMoleGame` → WhackAMoleGameScreen

---

### 3. WhackAMoleHomeScreen

**Layout:**
```
┌──────────────────────────────┐
│       SafeAreaView           │
│   bg: #e8f5e8 (light green)  │
│                              │
│  ← Back                      │
│                              │
│  ┌──────────────────────┐    │
│  │     🔨 (72px)       │    │
│  │  "Whack-a-Mole"     │    │  40px, weight 800, #4caf50
│  │    subtitle         │    │  18px, #666
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │ Best: 850    │   │    │  Score card
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │    Play      │   │    │  bg: #4caf50, pill
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  instructions...     │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

**Theme Colors:**
- Background: `#e8f5e8` (light green, garden theme)
- Accent: `#4caf50` (green, nature theme)
- White cards with shadows for score display

**Elements:**
- Title emoji: 🔨 (72px)
- Title text: "Whack-a-Mole" from i18n
- Subtitle: Game description from i18n
- Best Score Card: Only shown if bestScore > 0
- Play Button: Large, green pill button
- Instructions: Brief explanation of controls

---

### 4. WhackAMoleGameScreen

**Layout:**
```
┌──────────────────────────────┐
│       SafeAreaView           │
│   bg: #e8f5e8 (light green)  │
│                              │
│  ← Back  Round: 2  Score: 45│  Header
│                              │
│  Time: 18s   Combo: 5x       │  Status bar
│                              │
│  ┌────────────────────────┐  │
│  │  🕳️    🐛    🕳️     │  │  3x3 Grid
│  │                        │  │
│  │  🕳️    🕳️    🐭     │  │
│  │                        │  │
│  │  🐱    🕳️    🕳️     │  │
│  └────────────────────────┘  │
│                              │
│  Active Power-up: ⭐ 2x     │  Power-up indicator
└──────────────────────────────┘
```

**Game Area:**
- 3x3 grid centered on screen
- Each hole: 80px × 80px with spacing
- Background: Garden grass texture (green)
- Holes: Brown circles with shadow

**Header:**
- Back button (left): `16px`, weight `600`, color `#4caf50`
- Round counter (center): `18px`, weight `700`, color `#333`
- Score (right): `18px`, weight `700`, color `#4caf50`

**Status Bar:**
- Timer: Countdown from 30s
- Combo: Shows consecutive successful taps
- Font: `16px`, weight `600`

**Holes:**
- Empty state: Brown hole with shadow
- Pest state: Pest emoji pops up from hole
- Tap feedback: Shrink animation + haptic
- Miss penalty: Slight shake if friendly tapped

**Power-up Display:**
- Position: Bottom center
- Shows active power-up with timer
- Pulse animation when active

---

### 5. Game Over Overlay

**Layout:**
```
┌──────────────────────────────┐
│    Backdrop (rgba black)     │
│                              │
│  ┌──────────────────────┐    │
│  │  "Round Complete!"   │    │  28px, weight 800, #4caf50
│  │                       │    │
│  │  Final Score: 450    │    │  22px, weight 800, #4caf50
│  │  Pests Bopped: 35    │    │  16px, #666
│  │  Accuracy: 85%       │    │  16px, #666
│  │  Coins Earned: 30    │    │  16px, #666
│  │  NEW BEST!           │    │  18px, weight 800, #f1c40f (if applicable)
│  │                       │    │
│  │  ┌────────────────┐  │    │
│  │  │  Play Again    │  │    │  bg: #4caf50
│  │  └────────────────┘  │    │
│  │                       │    │
│  │      Back             │    │  Link style
│  └──────────────────────┘    │
└──────────────────────────────┘
```

---

## Game Loop & State Management

### Game State

```typescript
interface Hole {
  id: number;
  row: number;
  col: number;
  content: HoleContent | null;
  visibleUntil: number; // timestamp
}

interface HoleContent {
  type: 'pest' | 'friendly';
  emoji: string;
  points: number;
  spawnTime: number;
}

interface GameState {
  holes: Hole[];
  score: number;
  round: number;
  timeRemaining: number;
  combo: number;
  pestsBopped: number;
  totalPests: number;
  activePowerUp: PowerUp | null;
  gameStatus: 'ready' | 'playing' | 'roundComplete' | 'over';
}

interface PowerUp {
  type: 'freeze' | 'double';
  expiresAt: number;
}
```

### Game Loop Logic

```typescript
useEffect(() => {
  if (!isPlaying) return;

  const interval = setInterval(() => {
    // Update timer
    // Check hole visibility timeouts
    // Spawn new pests
    // Update power-up timers
    // Check round completion
  }, 100); // 10 FPS for hole management

  return () => clearInterval(interval);
}, [isPlaying]);
```

### Spawn Logic

```typescript
const spawnPest = () => {
  // Select random empty hole
  const emptyHoles = holes.filter(h => !h.content);
  if (emptyHoles.length === 0) return;

  const hole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];

  // Determine pest type
  const isBonusRound = round % 3 === 0;
  const isFriendly = isBonusRound && Math.random() < 0.2;

  const content = isFriendly
    ? getFriendlyAnimal()
    : getRandomPest();

  // Calculate visibility duration (decreases with difficulty)
  const baseDuration = 1500;
  const minDuration = 500;
  const duration = Math.max(
    minDuration,
    baseDuration - (round * 100)
  );

  hole.content = content;
  hole.visibleUntil = Date.now() + duration;
};
```

### Tap Handler

```typescript
const handleHoleTap = (hole: Hole) => {
  if (!hole.content) return;

  const tapTime = Date.now();
  const reactionTime = tapTime - hole.content.spawnTime;

  if (hole.content.type === 'friendly') {
    // Penalty for tapping friendly
    score -= 20;
    combo = 0;
    // Shake animation
  } else {
    // Success - bop the pest
    let points = hole.content.points;

    // Speed bonus
    if (reactionTime < 300) points += 5;
    else if (reactionTime < 500) points += 3;

    // Power-up multiplier
    if (activePowerUp?.type === 'double') {
      points *= 2;
    }

    score += points;
    combo += 1;
    pestsBopped += 1;

    // Haptic feedback
    // Success animation
  }

  // Clear the hole
  hole.content = null;
  hole.visibleUntil = 0;
};
```

---

## i18n Translation Keys

### English (`en.json`)

```json
{
  "selectGame": {
    "whackAMole": {
      "name": "Whack-a-Mole",
      "description": "Bop the garden pests!"
    }
  },
  "whackAMole": {
    "home": {
      "title": "Whack-a-Mole",
      "subtitle": "Bop the pests, avoid the pets!",
      "instructions": "Tap the pests quickly! Don't tap the friendly animals or you lose points!",
      "bestScore": "Best Score",
      "play": "Play"
    },
    "game": {
      "score": "Score",
      "round": "Round",
      "time": "Time",
      "combo": "Combo",
      "powerUps": {
        "freeze": "Freeze",
        "double": "2x Points"
      },
      "roundComplete": "Round Complete!",
      "gameOver": "Game Over!",
      "finalScore": "Final Score",
      "pestsBopped": "Pests Bopped",
      "accuracy": "Accuracy",
      "coinsEarned": "Coins Earned",
      "newBest": "NEW BEST!",
      "playAgain": "Play Again",
      "nextRound": "Next Round",
      "back": "Back"
    }
  }
}
```

### Portuguese (`pt-BR.json`)

```json
{
  "selectGame": {
    "whackAMole": {
      "name": "Acerte a Toupeira",
      "description": "Acerte as pragas do jardim!"
    }
  },
  "whackAMole": {
    "home": {
      "title": "Acerte a Toupeira",
      "subtitle": "Acerte as pragas, evite os pets!",
      "instructions": "Toque nas pragas rapidamente! Não toque nos animais amigáveis ou você perde pontos!",
      "bestScore": "Melhor Pontuação",
      "play": "Jogar"
    },
    "game": {
      "score": "Pontos",
      "round": "Rodada",
      "time": "Tempo",
      "combo": "Combo",
      "powerUps": {
        "freeze": "Congelar",
        "double": "2x Pontos"
      },
      "roundComplete": "Rodada Completa!",
      "gameOver": "Fim de Jogo!",
      "finalScore": "Pontuação Final",
      "pestsBopped": "Pragas Acertadas",
      "accuracy": "Precisão",
      "coinsEarned": "Moedas Ganhas",
      "newBest": "NOVO RECORDE!",
      "playAgain": "Jogar Novamente",
      "nextRound": "Próxima Rodada",
      "back": "Voltar"
    }
  }
}
```

---

## Registration in App.tsx

```typescript
import { WhackAMoleProvider } from './src/context/WhackAMoleContext';
import { WhackAMoleNavigator } from './src/screens/WhackAMoleNavigator';

gameRegistry.register({
  id: 'whack-a-mole',
  nameKey: 'selectGame.whackAMole.name',
  descriptionKey: 'selectGame.whackAMole.description',
  emoji: '🔨',
  category: 'casual',
  navigator: WhackAMoleNavigator,
  providers: [WhackAMoleProvider],
  isEnabled: true,
});
```

---

## Implementation Steps

### Phase 1: Foundation
1. ✅ Create plan document
2. Create `WhackAMoleContext.tsx`
3. Create `WhackAMoleNavigator.tsx`
4. Create `whackAMoleItems.ts` (pest/animal data)
5. Add i18n keys to `en.json` and `pt-BR.json`

### Phase 2: Home Screen
6. Create `WhackAMoleHomeScreen.tsx`
   - Layout with title, subtitle, instructions
   - Best score card (conditional)
   - Play button navigation
   - Green garden theme styling

### Phase 3: Game Screen - Basic
7. Create `WhackAMoleGameScreen.tsx` structure
   - Header (back, round, score)
   - Status bar (time, combo)
   - 3x3 grid of holes

### Phase 4: Game Logic
8. Implement hole/pest spawning system
9. Implement tap detection and scoring
10. Implement combo system
11. Implement round progression
12. Add friendly animal mechanic (bonus rounds)

### Phase 5: Power-Ups & Polish
13. Implement power-ups (freeze, double points)
14. Add round complete overlay
15. Connect best score to context
16. Add haptic feedback
17. Add animations (pop-up, tap feedback)

### Phase 6: Integration
18. Register game in `App.tsx`
19. Update navigation types
20. Test full flow
21. Commit and push

---

## Testing Checklist

- [ ] Game starts correctly from home screen
- [ ] Holes spawn pests at correct intervals
- [ ] Tapping pests awards correct points
- [ ] Speed bonus applies correctly
- [ ] Combo system works
- [ ] Friendly animals appear in bonus rounds
- [ ] Tapping friendly animals deducts points
- [ ] Timer counts down correctly
- [ ] Round completes after 30 seconds
- [ ] Power-ups spawn and activate correctly
- [ ] Best score saves and loads
- [ ] Haptic feedback works
- [ ] i18n switches between languages
- [ ] Game works on different screen sizes

---

## Future Enhancements

- Different garden backgrounds per round
- More pest types (snails, ants, beetles)
- Special combo animations
- Sound effects for bops
- Achievements system
- Daily challenges
- Seasonal themes (Halloween, Spring)
- Multiplayer mode (who can bop more)
