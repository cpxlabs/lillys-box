# Memory Match Game - Design Document

## Overview

Memory Match is a classic card-flipping memory game for children. Cards are laid out face-down in a grid, and the player flips two at a time trying to find matching pairs. The game ends when all pairs are found.

**Game ID:** `memory-match`
**Category:** `puzzle`
**Emoji:** 🧠

---

## Core Mechanics

### Gameplay
1. Cards are arranged face-down in a grid
2. Player taps a card to flip it, revealing an emoji image
3. Player taps a second card:
   - **Match:** Both cards stay face-up with a success animation
   - **No match:** Both cards flip back face-down after a short delay (1s)
4. Game ends when all pairs are found

### Difficulty Levels
| Level  | Grid  | Pairs | Cards |
|--------|-------|-------|-------|
| Easy   | 3x2   | 3     | 6     |
| Medium | 4x3   | 6     | 12    |
| Hard   | 4x4   | 8     | 16    |

### Card Faces
Cards use emojis from the pet/food/toy theme:
- Pets: `🐱 🐶 🐰 🐹 🐦 🐢 🦋 🐠`
- Food: `🍎 🍊 🍋 🍇 🍓 🍦 🥕 🍪`

A random subset is chosen per game based on the number of pairs needed.

---

## Scoring System

### Move Tracking
- Each pair of card flips counts as one **move**
- Fewer moves = better score

### Star Rating
Stars are awarded based on moves relative to the number of pairs:

| Stars | Condition |
|-------|-----------|
| 3     | moves <= pairs + 1 |
| 2     | moves <= pairs * 2 |
| 1     | all other completions |

### Score Calculation
```
score = max(0, (maxMoves - moves) * 10 + timeBonusPoints)
```
Where:
- `maxMoves = pairs * 3` (theoretical worst reasonable case)
- `timeBonusPoints = max(0, (timeLimit - elapsedSeconds))` where timeLimit varies by difficulty

### Best Score
- Best score per difficulty level is persisted via AsyncStorage
- Storage key: `@memory_match:bestScore:{difficulty}:{userId}`

---

## State Management

### MemoryMatchContext
Provides:
- `bestScores: { easy: number; medium: number; hard: number }` - Best scores per difficulty
- `updateBestScore(difficulty, score)` - Update best score if new score is higher
- `lastDifficulty: string` - Last played difficulty (persisted)

### Game-Local State (in GameScreen)
- `cards: Card[]` - Array of card objects with id, emoji, isFlipped, isMatched
- `selectedCards: number[]` - Currently flipped card indices (max 2)
- `moves: number` - Move counter
- `matchedPairs: number` - Number of matched pairs
- `gameStatus: 'playing' | 'won'` - Current game state
- `elapsedTime: number` - Seconds elapsed

---

## Screen Flow

```
MemoryMatchHome → MemoryMatchGame → (game over modal) → Play Again / Back to Home
```

### MemoryMatchHomeScreen
- Game title and emoji (🧠)
- Difficulty selector (Easy / Medium / Hard)
- Best score display per difficulty
- "Play" button
- Back button to game selection

### MemoryMatchGameScreen
- Header: back button, move counter, timer
- Card grid (responsive layout)
- Match feedback animations
- Game-over overlay with:
  - Star rating display
  - Move count
  - Time taken
  - Score
  - "Play Again" button
  - "Back" button

---

## Visual Design

### Color Palette
Follows existing app theme:
- Background: `#f5f0ff`
- Primary: `#9b59b6` (purple)
- Card back: `#9b59b6` with `?` mark
- Card front: `#fff` with emoji
- Match highlight: `#27ae60` (green)
- Mismatch flash: `#e74c3c` (red, brief)

### Card Design
- Rounded corners (borderRadius: 12)
- Shadow for depth
- Face-down: purple with "?" text
- Face-up: white background with large emoji
- Matched: green border, slight opacity reduction

### Animations
- Card flip: scale transform (scaleX 1 → 0 → 1) to simulate flip
- Match found: brief scale pulse on matched pair
- Game complete: star rating reveal animation

---

## i18n Keys

```
memoryMatch.title
memoryMatch.subtitle
memoryMatch.instructions
memoryMatch.play
memoryMatch.bestScore
memoryMatch.moves
memoryMatch.time
memoryMatch.difficulty.easy
memoryMatch.difficulty.medium
memoryMatch.difficulty.hard
memoryMatch.gameOver.title
memoryMatch.gameOver.moves
memoryMatch.gameOver.time
memoryMatch.gameOver.score
memoryMatch.gameOver.newBest
memoryMatch.gameOver.playAgain
memoryMatch.stars (1-3)
```

---

## Technical Notes

### Dependencies
No new dependencies required. Uses:
- React Native core components (View, Text, TouchableOpacity, Animated)
- AsyncStorage (already installed)
- react-i18next (already installed)
- React Navigation (already installed)

### Registration
Follows the existing game registry pattern:
```typescript
gameRegistry.register({
  id: 'memory-match',
  nameKey: 'selectGame.memoryMatch.name',
  descriptionKey: 'selectGame.memoryMatch.description',
  emoji: '🧠',
  category: 'puzzle',
  navigator: MemoryMatchNavigator,
  providers: [MemoryMatchProvider],
  isEnabled: true,
});
```

### File Structure
```
src/
├── context/MemoryMatchContext.tsx
├── screens/
│   ├── MemoryMatchNavigator.tsx
│   ├── MemoryMatchHomeScreen.tsx
│   └── MemoryMatchGameScreen.tsx
```

---

**Document Version:** 1.0
**Created:** 2026-02-06
