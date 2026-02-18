# Whack-a-Mole Game Screens

> Tap-based reaction game where players bop pests emerging from holes while avoiding friendly animals.
> Sources: `src/screens/WhackAMoleHomeScreen.tsx`, `src/screens/WhackAMoleGameScreen.tsx`

---

## WhackAMoleHomeScreen

### Layout Structure

```
┌──────────────────────────────┐
│         SafeAreaView         │
│    bg: #e8f5e8 (green)       │
│                              │
│  ← Back                      │
│                              │
│  ┌──────────────────────┐    │
│  │     🔨 (72px)        │    │
│  │  "Whack-a-Mole"      │    │  40px, weight 800, #4caf50
│  │  subtitle             │    │  18px, #666
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │ Best: 200    │   │    │  Score card
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

### Specs

#### Container
- **Background**: `#e8f5e8` (light green, garden theme)

#### Title
- **Font**: `40px`, weight `800`, color `#4caf50`

#### Play Button
- **Background**: `#4caf50` (green)
- **Padding**: vertical `18px`, horizontal `52px`
- **Border radius**: `32px` (pill)

---

## WhackAMoleGameScreen

### Layout Structure

```
┌──────────────────────────────┐
│  ← Back  Round: 1  Score: 45│  Header
│                              │
│      ⏱ 25s   Combo: 3x      │  Status bar
│                              │
│  ┌──────────────────────┐    │
│  │  ┌───┐ ┌───┐ ┌───┐  │    │
│  │  │🐛 │ │   │ │🐀 │  │    │  3x3 Grid of holes
│  │  └───┘ └───┘ └───┘  │    │
│  │  ┌───┐ ┌───┐ ┌───┐  │    │
│  │  │   │ │⭐ │ │   │  │    │
│  │  └───┘ └───┘ └───┘  │    │
│  │  ┌───┐ ┌───┐ ┌───┐  │    │
│  │  │🐰 │ │   │ │🐛 │  │    │
│  │  └───┘ └───┘ └───┘  │    │
│  │                      │    │
│  │  ❄️ Freeze Active!   │    │  Power-up indicator
│  └──────────────────────┘    │
└──────────────────────────────┘
```

### Specs

#### Header
- **Layout**: row, `space-between`
- **Round**: `18px`, weight `700`, color `#333`
- **Score**: `18px`, weight `700`, color `#4caf50`

#### Status Bar
- **Timer**: `16px`, weight `600`, color `#333`
- **Combo**: `16px`, weight `700`, color `#27ae60` (visible when > 1)

#### Hole Grid (3x3)
- **Grid**: flexWrap rows, max width `320px`
- **Hole size**: calculated from screen width
- **Hole inner**: brown circle (`#8d6e63`), border `3px #6d4c41`
- **Content emoji**: `40px` centered in hole

#### Power-Up Indicator
- **Position**: absolute bottom `20px`
- **Background**: `rgba(255,255,255,0.95)`
- **Border radius**: `20px`
- **Text**: `16px`, weight `700`, color `#4caf50`

---

## Game Mechanics

### Spawning
- **Grid**: 3x3 holes (9 total)
- **Spawn interval**: starts at 800ms, decreases by 50ms per round (min 400ms)
- **Visibility**: starts at 1500ms, decreases by 100ms per round (min 500ms)

### Item Types
1. **Pests** (default spawn): Various pest emojis, positive points
2. **Friendly animals** (20% chance in bonus rounds): Penalty for tapping
3. **Power-ups** (10% chance): Freeze or Double points

### Rounds
- **Duration**: 30 seconds per round
- **Bonus rounds**: every 3rd round (round 3, 6, 9...)
- **Speed scaling**: visibility and spawn intervals decrease each round

### Power-Ups
- **Freeze** ❄️: Extends all visible items by 3s, lasts 3s
- **Double** ⭐: Doubles points earned, lasts 5s

### Scoring
- **Base**: pest points (varies by pest type)
- **Speed bonus**: +5 (< 300ms reaction), +3 (< 500ms)
- **Double power-up**: 2x multiplier
- **Friendly penalty**: negative points, resets combo
- **Coins earned**: score / 15

---

## Game Over Modal

- **Title**: "Game Over!" (`28px`, weight `800`, `#e74c3c`)
- **Final Score**: `22px`, weight `800`, `#4caf50`
- **Stats**: Pests bopped, Accuracy %, Coins earned
- **New Best**: `#f1c40f` gold text
- **Play Again**: green button
- **Back**: text button

---

## i18n Keys

### Home Screen
- `whackAMole.home.title`
- `whackAMole.home.subtitle`
- `whackAMole.home.instructions`
- `whackAMole.home.play`
- `whackAMole.home.bestScore`

### Game Screen
- `whackAMole.game.round`
- `whackAMole.game.score`
- `whackAMole.game.time`
- `whackAMole.game.combo`
- `whackAMole.game.back`
- `whackAMole.game.gameOver`
- `whackAMole.game.finalScore`
- `whackAMole.game.pestsBopped`
- `whackAMole.game.accuracy`
- `whackAMole.game.coinsEarned`
- `whackAMole.game.newBest`
- `whackAMole.game.playAgain`
- `whackAMole.game.powerUps.freeze`
- `whackAMole.game.powerUps.double`

---

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Green | `#4caf50` |
| Background | Light Green | `#e8f5e8` |
| Hole | Brown | `#8d6e63` |
| Hole Border | Dark Brown | `#6d4c41` |
| Combo | Green | `#27ae60` |
| Game Over Title | Red | `#e74c3c` |
| New Best | Gold | `#f1c40f` |
| Text Dark | Dark Gray | `#333` |

---

## Dependencies
- **Pressable**: Hole tap detection
- **setInterval**: Timer and spawn loops
- **AsyncStorage**: Best score persistence
- **i18next**: Internationalization
