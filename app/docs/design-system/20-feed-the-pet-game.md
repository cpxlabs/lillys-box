# Feed the Pet Game Screens

> Catching game where players move a bowl to catch falling food items and avoid bad items.
> Sources: `src/screens/FeedThePetHomeScreen.tsx`, `src/screens/FeedThePetGameScreen.tsx`

---

## FeedThePetHomeScreen

### Layout Structure

```
┌──────────────────────────────┐
│         SafeAreaView         │
│    bg: #fff8e1 (amber)       │
│                              │
│  ← Back                      │
│                              │
│  ┌──────────────────────┐    │
│  │     🍽️ (72px)        │    │
│  │  "Feed the Pet"      │    │  40px, weight 800, #ff9800
│  │  subtitle             │    │  18px, #666
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │ Best: 150    │   │    │  Score card
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

### Specs

#### Container
- **Background**: `#fff8e1` (light amber)

#### Title
- **Font**: `40px`, weight `800`, color `#ff9800`

#### Play Button
- **Background**: `#ff9800` (orange)
- **Padding**: vertical `18px`, horizontal `52px`
- **Border radius**: `32px` (pill)

---

## FeedThePetGameScreen

### Layout Structure

```
┌──────────────────────────────┐
│  ← Back   ❤️❤️❤️   Score: 45 │  Header
│                              │
│        Combo: 3x!            │  Combo display
│                              │
│  ┌──────────────────────┐    │
│  │    🍎         ⭐     │    │  Falling items
│  │         🍖           │    │
│  │  💣              🦴  │    │
│  │                      │    │
│  │        🥣            │    │  Bowl (pan gesture)
│  │  ────────────────    │    │  Ground line
│  └──────────────────────┘    │
└──────────────────────────────┘
```

### Specs

#### Header
- **Layout**: row, `space-between`
- **Lives**: 3 hearts (❤️ alive, 🖤 lost)
- **Score**: `18px`, weight `700`, color `#ff9800`

#### Combo Display
- **Visible**: when combo > 1
- **Font**: `20px`, weight `700`, color `#27ae60`

#### Game Area
- **Full screen** with relative positioning
- **Overflow**: hidden

#### Falling Items
- **Size**: `36px` emoji
- **Position**: absolute, random X within 80% screen width
- **Speed**: starts at 3px/frame, increases to max 8px/frame
- **Spawn interval**: 1500ms initial, decreases to 800ms

#### Bowl
- **Emoji**: 🥣 (`50px`)
- **Position**: fixed Y near bottom
- **Movement**: `Pan` gesture handler controls X position

#### Ground Line
- **Position**: absolute bottom `80px`
- **Height**: `4px`
- **Color**: `rgba(255, 152, 0, 0.5)`

---

## Game Mechanics

### Item Types
- **Good items**: Food emojis (🍎, 🍖, 🦴, etc.) — positive points
- **Bad items**: Negative point items — lose lives and points

### Lives System
- **Initial**: 3 lives
- **Lost**: catching bad items
- **Game over**: when lives reach 0

### Combo System
- **Consecutive catches** of good items build combo
- **Multipliers**: 2 catches = 1.5x, 3 catches = 2x, 5+ catches = 3x
- **Reset**: on catching bad item or missing good item

### Difficulty Scaling
- Every 30 seconds (1800 frames at 60fps):
  - Fall speed increases by 0.5
  - Spawn interval decreases by 100ms

### Collision Detection
- Euclidean distance between item center and bowl center
- Collision radius: 40px

---

## Game Over Modal

- **Title**: "Game Over!" (`28px`, weight `800`, `#e74c3c`)
- **Final Score**: `22px`, weight `800`, `#ff9800`
- **Coins Earned**: score / 10
- **New Best**: shown if score > previous best (`#f1c40f`)
- **Play Again**: orange button
- **Back**: text button

---

## i18n Keys

### Home Screen
- `feedThePet.home.title`
- `feedThePet.home.subtitle`
- `feedThePet.home.instructions`
- `feedThePet.home.play`
- `feedThePet.home.bestScore`

### Game Screen
- `feedThePet.game.score`
- `feedThePet.game.combo`
- `feedThePet.game.back`
- `feedThePet.game.gameOver`
- `feedThePet.game.finalScore`
- `feedThePet.game.coinsEarned`
- `feedThePet.game.newBest`
- `feedThePet.game.playAgain`

---

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Orange | `#ff9800` |
| Background | Light Amber | `#fff8e1` |
| Combo | Green | `#27ae60` |
| Game Over Title | Red | `#e74c3c` |
| New Best | Gold | `#f1c40f` |
| Text Dark | Dark Gray | `#333` |
| Text Light | Gray | `#666` |

---

## Dependencies
- **react-native-gesture-handler**: `GestureDetector` + `Gesture.Pan` for bowl movement
- **requestAnimationFrame**: 60fps game loop
- **AsyncStorage**: Best score persistence
- **i18next**: Internationalization
