# Pet Runner - Design Document

## Overview

Pet Runner is an endless runner mini-game where the player's pet runs automatically from left to right on a scrolling background. The player taps to jump over obstacles and collects coins along the way. Speed increases gradually, making the game progressively harder.

---

## Game Identity

- **ID**: `pet-runner`
- **Category**: `casual`
- **Emoji**: `🏃`
- **Complexity**: Medium
- **Reuses existing assets**: Pet-themed emojis, coin economy concept

---

## Core Mechanics

### Movement
- The pet is positioned on the left side of the screen at a fixed X coordinate
- Auto-scrolling: obstacles and coins move from right to left
- Tap anywhere on the screen to jump
- Gravity pulls the pet back down after jumping
- The pet cannot double-jump (must land before jumping again)

### Obstacles
- Obstacles spawn at random intervals from the right edge
- Types (emoji-based):
  - Fence (`🪵`) — standard height obstacle
  - Rock (`🪨`) — standard height obstacle
  - Fire hydrant (`🧱`) — standard height obstacle
- All obstacles sit on the ground line
- Collision with any obstacle ends the game

### Coins
- Coins (`🪙`) spawn at random intervals, floating above the ground
- Coins appear at varying heights (some require jumping to collect)
- Each coin collected adds +1 to the coin counter
- Coins pass through the pet (no collision damage)

### Speed Progression
- Base speed starts moderate
- Speed increases by ~8% every 5 seconds
- Maximum speed is capped at 2.5x the initial speed

---

## Scoring System

### Primary Score: Distance
- Distance increments continuously while the pet is alive
- Displayed as meters (1 meter ≈ 1 second of play at base speed)
- Distance is the main score metric

### Secondary Score: Coins
- Each coin collected adds +1 to the visible coin counter
- Final score = distance + (coins × 10)
- Best score is persisted per user via AsyncStorage

---

## Difficulty Progression

| Time Elapsed | Speed Multiplier | Obstacle Frequency |
|---|---|---|
| 0–5s | 1.0× | Low (every ~2s) |
| 5–15s | 1.1×–1.3× | Medium (every ~1.5s) |
| 15–30s | 1.3×–1.7× | High (every ~1.2s) |
| 30s+ | 1.7×–2.5× | Very High (every ~1s) |

---

## UI Layout

```
┌─────────────────────────────────────┐
│  ← Back     🪙 12     📏 142m      │  ← Header
│                                     │
│                                     │
│                                     │
│                                     │
│         🪙                          │
│                    🪙               │
│   🐱        🪵          🪨    🪙   │  ← Game area
│ ════════════════════════════════════ │  ← Ground line
│                                     │
└─────────────────────────────────────┘
```

### Game Over Overlay
```
┌─────────────────────────────────────┐
│                                     │
│      ┌───────────────────┐          │
│      │    Game Over!      │          │
│      │                   │          │
│      │   📏 142 meters   │          │
│      │   🪙 12 coins     │          │
│      │   Score: 262      │          │
│      │   ⭐ New Best!     │          │
│      │                   │          │
│      │   [ Play Again ]  │          │
│      │     ← Back        │          │
│      └───────────────────┘          │
│                                     │
└─────────────────────────────────────┘
```

---

## State Management

### PetRunnerContext
```typescript
interface PetRunnerContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}
```

**Storage Key**: `@pet_runner:bestScore:{userId}`

---

## Navigation

```
PetRunnerHome → PetRunnerGame
```

- **PetRunnerHomeScreen**: Title, emoji, best score, play button, instructions
- **PetRunnerGameScreen**: Full game with tap-to-jump, obstacles, coins, game over overlay

---

## Game Loop Architecture

Uses `requestAnimationFrame` for smooth 60fps updates:

1. **Update phase**: Move obstacles/coins left, apply gravity to pet, check collisions, update distance
2. **Render phase**: React state updates trigger re-render with new positions
3. **Spawn phase**: Periodically create new obstacles and coins off-screen right

### Physics Constants
- Gravity: 0.8 per frame
- Jump velocity: -14 (upward)
- Ground Y: calculated from screen height
- Pet X: 15% of screen width

---

## Internationalization

### English (en)
- Title: "Pet Runner"
- Subtitle: "Run, jump, collect!"
- Instructions: "Tap to jump over obstacles and collect coins."
- Score labels, game over text

### Portuguese (pt-BR)
- Title: "Pet Corredor"
- Subtitle: "Corra, pule, colete!"
- Instructions: "Toque para pular obstáculos e coletar moedas."

---

## Technical Notes

- Rendering uses emoji characters for simplicity and consistency with other games
- Game loop via `requestAnimationFrame` for smooth animation
- Collision detection uses simple bounding box overlap
- All positions stored as plain numbers, rendered via absolute positioning
- Compatible with web, iOS, and Android (no native-only APIs)

---

**Document Version**: 1.0
**Created**: 2026-02-06
**Status**: Implementation ready
