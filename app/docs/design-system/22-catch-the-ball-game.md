# Catch the Ball Game Screens

> Lane-based catching game where players tap lanes to move a basket and catch falling objects.
> Sources: `src/screens/CatchTheBallHomeScreen.tsx`, `src/screens/CatchTheBallGameScreen.tsx`

---

## CatchTheBallHomeScreen

### Layout Structure

```
┌──────────────────────────────┐
│         SafeAreaView         │
│    bg: #e1f5fe (sky blue)    │
│                              │
│  ← Back                      │
│                              │
│  ┌──────────────────────┐    │
│  │     🎾 (72px)        │    │
│  │  "Catch the Ball"    │    │  40px, weight 800, #0288d1
│  │  subtitle             │    │  18px, #666
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │ Best: 85     │   │    │  Score card
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │    Play      │   │    │  bg: #0288d1, pill
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  instructions...     │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

### Specs

#### Container
- **Background**: `#e1f5fe` (sky blue)

#### Title
- **Font**: `40px`, weight `800`, color `#0288d1`

#### Play Button
- **Background**: `#0288d1` (blue)
- **Padding**: vertical `18px`, horizontal `52px`
- **Border radius**: `32px` (pill)

---

## CatchTheBallGameScreen

### Layout Structure

```
┌──────────────────────────────┐
│  ← Back    ⏱ 25s   Score: 12│  Header
│                              │
│  ┌──────────────────────┐    │
│  │  │   │   │   │       │    │
│  │  │🎾 │   │   │       │    │  4-lane game area
│  │  │   │⭐ │   │       │    │  with lane dividers
│  │  │   │   │💣 │       │    │
│  │  │   │   │   │🦴     │    │
│  │  │   │🧺 │   │       │    │  Catcher basket
│  └──────────────────────┘    │
│                              │
│  ┌───┬───┬───┬───┐          │
│  │ 1 │ 2 │ 3 │ 4 │          │  Lane tap buttons
│  └───┴───┴───┴───┘          │
│                              │
│  🎾+1  🦴+2  ⭐+3  💣-2     │  Legend
└──────────────────────────────┘
```

### Specs

#### Header
- **Layout**: row, `space-between`
- **Timer**: `18px`, weight `700`, color `#333`
- **Score**: `18px`, weight `700`, color `#0288d1`

#### Game Area
- **Height**: 58% of screen height
- **Background**: `#b3e5fc` (light blue)
- **Border radius**: `16px`
- **Margin**: horizontal `16px`

#### Lane Dividers
- **Width**: `1px`
- **Color**: `rgba(0,0,0,0.1)`
- **Position**: absolute, full height

#### Falling Balls
- **Size**: `48px` emoji
- **Position**: absolute, calculated per lane
- **Speed**: starts at 3.5px/frame, increases by 0.015 per frame

#### Catcher
- **Emoji**: 🧺 (`64px`)
- **Position**: near bottom of game area

#### Lane Buttons
- **Count**: 4 buttons in row
- **Inactive**: white bg, border `2px #b3e5fc`
- **Active**: bg `#0288d1`, border `#0288d1`, white text
- **Border radius**: `12px`

#### Legend
- **Center-aligned**: `14px`, color `#555`
- **Shows**: point values for each ball type

---

## Game Mechanics

### Ball Types
| Emoji | Label | Points | Weight |
|-------|-------|--------|--------|
| 🎾 | Ball | +1 | 50% |
| ⭐ | Star | +3 | 20% |
| 🦴 | Bone | +2 | 20% |
| 💣 | Bomb | -2 | 10% |

### Gameplay
- **Duration**: 30 seconds
- **Lanes**: 4 vertical lanes
- **Control**: tap lane buttons to move catcher
- **Catch**: ball is caught when within threshold distance of catcher
- **Speed**: increases continuously during game
- **Spawn**: every 45 frames (~0.75s at 60fps)

### Collision Detection
- Ball center vs catcher center
- Threshold: 90% of catcher size

### Scoring
- **Points**: per ball type (see table)
- **Coins earned**: score / 5
- **Missed**: good items that fall off-screen are counted

---

## Game Over Modal

- **Title**: "Game Over!" (`28px`, weight `800`, `#0288d1`)
- **Final Score**: `22px`, weight `800`, `#0288d1`
- **Stats**: Caught count, Missed count, Coins earned
- **New Best**: `#f1c40f` gold text
- **Play Again**: blue button
- **Back**: text button

---

## i18n Keys

### Home Screen
- `catchTheBall.home.title`
- `catchTheBall.home.subtitle`
- `catchTheBall.home.instructions`
- `catchTheBall.home.play`
- `catchTheBall.home.bestScore`

### Game Screen
- `catchTheBall.game.score`
- `catchTheBall.game.back`
- `catchTheBall.game.ready`
- `catchTheBall.game.tapToStart`
- `catchTheBall.game.lane`
- `catchTheBall.game.gameOver`
- `catchTheBall.game.finalScore`
- `catchTheBall.game.caught`
- `catchTheBall.game.missed`
- `catchTheBall.game.coinsEarned`
- `catchTheBall.game.newBest`
- `catchTheBall.game.playAgain`

---

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Blue | `#0288d1` |
| Background | Sky Blue | `#e1f5fe` |
| Game Area | Light Blue | `#b3e5fc` |
| Lane Button Border | Light Blue | `#b3e5fc` |
| Game Over Title | Blue | `#0288d1` |
| New Best | Gold | `#f1c40f` |
| Text Dark | Dark Gray | `#333` |
| Legend | Medium Gray | `#555` |

---

## Dependencies
- **requestAnimationFrame**: 60fps game loop
- **setInterval**: Countdown timer
- **AsyncStorage**: Best score persistence
- **i18next**: Internationalization
