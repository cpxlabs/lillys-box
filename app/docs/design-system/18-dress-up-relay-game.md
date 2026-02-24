# Dress-Up Relay Game Screens

> Timed outfit matching game where players memorize a target outfit then dress their pet to match.
> Sources: `src/screens/DressUpRelayHomeScreen.tsx`, `src/screens/DressUpRelayGameScreen.tsx`

---

## DressUpRelayHomeScreen

### Layout Structure

```
┌──────────────────────────────┐
│         SafeAreaView         │
│    bg: #fce4ec (pink)        │
│                              │
│  ← Back                      │
│                              │
│  ┌──────────────────────┐    │
│  │     👗 (72px)        │    │
│  │  "Dress-Up Relay"    │    │  36px, weight 800, #ec4899
│  │  Match the outfit!   │    │  18px, #666
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │ Best: 250    │   │    │  Score card
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │    Play      │   │    │  bg: #ec4899, pill
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  instructions...     │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

### Specs

#### Container
- **Background**: `#fce4ec` (light pink)
- **Safe area**: full screen

#### Back Button
- **Position**: top-left
- **Padding**: horizontal `20px`, top `16px`
- **Text**: `16px`, weight `600`, color `#ec4899`

#### Content Area
- **Flex**: 1
- **Alignment**: center
- **Padding**: horizontal `24px`
- **Margin top**: `-40px`

#### Emoji Icon
- **Size**: `72px`
- **Emoji**: 👗
- **Margin bottom**: `12px`

#### Title
- **Font**: `36px`, weight `800`
- **Color**: `#ec4899` (pink)
- **Margin bottom**: `8px`

#### Subtitle
- **Font**: `18px`, weight `400`
- **Color**: `#666`
- **Alignment**: center
- **Margin bottom**: `24px`

#### Best Score Card
- **Background**: `#ffffff`
- **Border radius**: `16px`
- **Padding**: vertical `12px`, horizontal `28px`
- **Margin bottom**: `28px`
- **Shadow**: offset `{0, 2}`, opacity `0.08`, radius `8`, elevation `3`
- **Display**: only if `bestScore > 0`

#### Play Button
- **Background**: `#ec4899` (pink)
- **Padding**: vertical `18px`, horizontal `52px`
- **Border radius**: `32px` (pill)
- **Shadow**: color `#ec4899`, offset `{0, 4}`, opacity `0.3`, radius `8`, elevation `5`

#### Instructions
- **Font**: `14px`, color `#888`, center-aligned
- **Margin top**: `28px`, max width `280px`, line height `20px`

---

## DressUpRelayGameScreen

### Game Flow

```
Preview Phase → Countdown Phase → Play Phase → Result Phase → (repeat or Game Over)
```

### Layout Structure

```
┌──────────────────────────────┐
│  ← Back   Round: 1/5   250  │  Header
│                              │
│  ████████████████████████    │  Timer bar (play phase)
│                              │
│     "Dress your pet!"        │  Phase title
│     Time Left: 15s           │
│                              │
│  ┌──────────────────────┐    │
│  │    Pet Preview        │    │  PetRenderer (180px)
│  └──────────────────────┘    │
│                              │
│  🎩  👓  👕  👞              │  Slot indicators
│  ●   ○   ●   ○              │  (filled/empty dots)
│                              │
│  ┌───┬───┬───┬───┐          │
│  │🎩 │👓 │👕 │👞 │          │  Clothing items grid
│  │itm│itm│itm│itm│          │  (ScrollView)
│  ├───┼───┼───┼───┤          │
│  │...│...│...│...│          │
│  └───┴───┴───┴───┘          │
│                              │
│  ┌──────────────────────┐    │
│  │       Check          │    │  Submit button
│  └──────────────────────┘    │
└──────────────────────────────┘
```

### Specs

#### Header
- **Layout**: row, `space-between`
- **Padding**: horizontal `20px`, top `16px`, bottom `8px`
- **Text**: `16px`, weight `700`, color `#ec4899`

#### Timer Bar
- **Container**: height `8px`, bg `#f0f0f0`, radius `4px`, horizontal margin `20px`
- **Fill**: dynamic width based on time remaining
- **Color**: green (`#27ae60`) > 10s, orange (`#f39c12`) > 5s, red (`#e74c3c`) ≤ 5s

#### Slot Indicators
- **Layout**: row, center-aligned, gap `16px`
- **Emoji**: 🎩 (head), 👓 (eyes), 👕 (torso), 👞 (paws)
- **Dot**: `12px` circle, gray `#ddd` empty, green `#27ae60` filled

#### Clothing Items Grid
- **ScrollView**: flex 1
- **Items**: row, wrap, gap `8px`, padding horizontal `20px`
- **Item card**: white bg, radius `12px`, border `2px #f0f0f0`
- **Selected**: border `#ec4899`, bg `#ffe4f0`

#### Submit Button
- **Position**: absolute bottom `20px`
- **Background**: `#ec4899`
- **Padding**: vertical `16px`
- **Border radius**: `28px`
- **Visible**: only when all 4 slots are filled

---

## Game Phases

### Preview Phase (3 seconds)
- Shows target outfit on a pet
- PetRenderer at 300px
- Message: "Memorize this outfit!"

### Countdown Phase (3 seconds)
- Large animated numbers: 3, 2, 1
- Spring animation with scale and opacity
- Haptic feedback on each number

### Play Phase (20s - 1s per round)
- Timer bar + countdown text
- Player selects clothing items from grid
- Tap item to equip/unequip (toggle)
- Submit when all 4 slots filled

### Result Phase
- Side-by-side comparison (target vs player outfit)
- Per-slot correctness indicators (✓ / ✗)
- Score display with time bonus

### Game Over Phase
- Modal overlay with total score
- Rounds completed
- Play Again / Back buttons

---

## Scoring

- **Base**: 25 points per correct slot (max 100)
- **Time bonus**: 2 points per second remaining
- **Perfect bonus**: +50 if all 4 slots correct
- **Total rounds**: 5
- **Time per round**: decreases by 1s each round (20s, 19s, 18s, ...)

---

## i18n Keys

### Home Screen
- `dressUpRelay.title`
- `dressUpRelay.subtitle`
- `dressUpRelay.instructions`
- `dressUpRelay.play`
- `dressUpRelay.bestScore`

### Game Screen
- `dressUpRelay.round`
- `dressUpRelay.timeLeft`
- `dressUpRelay.memorize`
- `dressUpRelay.dressYourPet`
- `dressUpRelay.perfect`
- `dressUpRelay.correct`
- `dressUpRelay.target`
- `dressUpRelay.yourOutfit`
- `dressUpRelay.nextRound`

### Game Over
- `dressUpRelay.gameOver.title`
- `dressUpRelay.gameOver.totalScore`
- `dressUpRelay.gameOver.accuracy`
- `dressUpRelay.gameOver.roundsCompleted`
- `dressUpRelay.gameOver.playAgain`

---

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Primary (Pink) | Hot Pink | `#ec4899` |
| Background | Light Pink | `#fce4ec` |
| Selected Item | Light Pink | `#ffe4f0` |
| Timer Green | Green | `#27ae60` |
| Timer Orange | Orange | `#f39c12` |
| Timer Red | Red | `#e74c3c` |
| Correct | Green | `#27ae60` |
| Wrong | Red | `#e74c3c` |
| Text Dark | Dark Gray | `#333` |
| Text Light | Gray | `#666` |

---

## Dependencies
- **expo-haptics**: Tactile feedback
- **React Native Reanimated**: Countdown animations
- **PetRenderer**: Pet display with clothing
- **CLOTHING_ITEMS**: Clothing data from wardrobe system
- **AsyncStorage**: Best score persistence
- **i18next**: Internationalization
