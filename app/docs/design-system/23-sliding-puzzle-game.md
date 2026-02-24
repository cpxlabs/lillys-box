# Sliding Puzzle Game Screens

> Classic sliding tile puzzle with emoji tiles and two difficulty levels.
> Sources: `src/screens/SlidingPuzzleHomeScreen.tsx`, `src/screens/SlidingPuzzleGameScreen.tsx`

---

## SlidingPuzzleHomeScreen

### Layout Structure

```
┌──────────────────────────────┐
│         SafeAreaView         │
│    bg: #f3e5f5 (lavender)    │
│                              │
│  ← Back                      │
│                              │
│  ┌──────────────────────┐    │
│  │     🧩 (72px)        │    │
│  │  "Sliding Puzzle"    │    │  36px, weight 800, #7b1fa2
│  │  subtitle             │    │  17px, #666
│  │                      │    │
│  │  Choose Difficulty    │    │
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │    Easy      │   │    │  bg: #7b1fa2
│  │  │   3x3 grid   │   │    │
│  │  │  Best: 42    │   │    │
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │    Hard      │   │    │  bg: #4a148c
│  │  │   4x4 grid   │   │    │
│  │  │  Best: 98    │   │    │
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  instructions...     │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

### Specs

#### Container
- **Background**: `#f3e5f5` (lavender)

#### Title
- **Font**: `36px`, weight `800`, color `#7b1fa2`

#### Difficulty Buttons
- **Easy**: bg `#7b1fa2`, radius `16px`, padding `16px 24px`
- **Hard**: bg `#4a148c`, radius `16px`, padding `16px 24px`
- **Text**: `20px`, weight `800`, white
- **Description**: `14px`, white 85% opacity
- **Best moves**: `13px`, `#f3e5f5`, weight `600`

---

## SlidingPuzzleGameScreen

### Layout Structure

```
┌──────────────────────────────┐
│  ← Back    Easy    Moves: 23 │  Header
│                              │
│  ┌──────────────────────┐    │
│  │                      │    │
│  │  ┌───┬───┬───┐      │    │
│  │  │🐱 │🐶 │🐹 │      │    │  3x3 or 4x4 grid
│  │  │ 1 │ 2 │ 3 │      │    │  (emoji + number)
│  │  ├───┼───┼───┤      │    │
│  │  │🐰 │🦊 │🐼 │      │    │
│  │  │ 4 │ 5 │ 6 │      │    │
│  │  ├───┼───┼───┤      │    │
│  │  │🐨 │🐯 │   │      │    │  Empty tile
│  │  │ 7 │ 8 │   │      │    │
│  │  └───┴───┴───┘      │    │
│  │                      │    │
│  └──────────────────────┘    │
│                              │
│       [New Game]             │  Purple button
│    Best: 42 moves            │  Hint text
└──────────────────────────────┘
```

### Specs

#### Header
- **Layout**: row, `space-between`
- **Difficulty label**: `18px`, weight `700`, color `#4a148c`
- **Moves**: `18px`, weight `700`, color `#7b1fa2`

#### Puzzle Grid
- **Container**: centered, flex 1
- **Grid**: relative position, bg `#ce93d8`, radius `12px`
- **Size**: calculated from screen width minus padding

#### Tiles
- **Position**: absolute (calculated from row/col)
- **Background**: `#7b1fa2` (purple)
- **Border radius**: `8px`
- **Shadow**: offset `{0, 2}`, opacity `0.2`, radius `4`, elevation `3`
- **Emoji**: 42% of cell size
- **Number**: 20% of cell size, white 70% opacity

#### Empty Tile
- **Background**: transparent
- **No shadow**

#### Easy Grid Emojis
- 🐱 🐶 🐹 🐰 🦊 🐼 🐨 🐯

#### Hard Grid Emojis
- 🐱 🐶 🐹 🐰 🦊 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐙 🦋 🐢

#### New Game Button
- **Background**: `#7b1fa2`
- **Padding**: vertical `12px`, horizontal `36px`
- **Border radius**: `24px`

---

## Game Mechanics

### Puzzle Logic
- **Easy**: 3x3 grid (8 tiles + 1 empty), 80 shuffle moves
- **Hard**: 4x4 grid (15 tiles + 1 empty), 150 shuffle moves
- **Movement**: tap a tile adjacent to empty space to swap
- **Win**: tiles in order 1→N with empty in bottom-right

### Shuffling
- Uses random walk from solved state (guarantees solvability)
- Avoids going back to previous position for effective shuffling

### Adjacency Check
- Only tiles directly above/below/left/right of empty space can move
- Diagonal moves not allowed

### Scoring
- **Metric**: number of moves (lower is better)
- **Best tracking**: per difficulty level
- **Coins earned**: max(5, 20 - floor(moves / 5))

---

## Win Modal

```
┌──────────────────────────────┐
│   Semi-transparent backdrop  │
│                              │
│     ┌──────────────────┐     │
│     │      🎉          │     │  52px emoji
│     │   You Won!       │     │  28px, #7b1fa2
│     │   23 moves       │     │  20px, #4a148c
│     │  Coins: 15 🪙     │     │  16px, #666
│     │  🏆 New Best!     │     │  (if applicable)
│     │                  │     │
│     │  [Play Again]    │     │  Purple button
│     │     Back         │     │  Text button
│     └──────────────────┘     │
└──────────────────────────────┘
```

---

## i18n Keys

### Home Screen
- `slidingPuzzle.home.title`
- `slidingPuzzle.home.subtitle`
- `slidingPuzzle.home.instructions`
- `slidingPuzzle.home.chooseDifficulty`
- `slidingPuzzle.home.easy`
- `slidingPuzzle.home.easyDesc`
- `slidingPuzzle.home.hard`
- `slidingPuzzle.home.hardDesc`
- `slidingPuzzle.home.best`
- `slidingPuzzle.home.moves`

### Game Screen
- `slidingPuzzle.game.easy`
- `slidingPuzzle.game.hard`
- `slidingPuzzle.game.moves`
- `slidingPuzzle.game.tile`
- `slidingPuzzle.game.newGame`
- `slidingPuzzle.game.back`
- `slidingPuzzle.game.youWon`
- `slidingPuzzle.game.coinsEarned`
- `slidingPuzzle.game.newBest`
- `slidingPuzzle.game.playAgain`

---

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Purple | `#7b1fa2` |
| Primary Dark | Deep Purple | `#4a148c` |
| Background | Lavender | `#f3e5f5` |
| Grid | Light Purple | `#ce93d8` |
| Tile | Purple | `#7b1fa2` |
| Win Title | Purple | `#7b1fa2` |
| New Best | Gold | `#f1c40f` |
| Text Light | Gray | `#666` |

---

## Dependencies
- **AsyncStorage**: Best moves persistence (per difficulty)
- **i18next**: Internationalization
