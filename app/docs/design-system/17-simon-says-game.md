# Simon Says Game Screens

> Pattern memory game with 4 colored buttons and sequence repetition.
> Sources: `src/screens/SimonSaysHomeScreen.tsx`, `src/screens/SimonSaysGameScreen.tsx`

---

## SimonSaysHomeScreen

### Layout Structure

```
┌──────────────────────────────┐
│         SafeAreaView         │
│    bg: #f5f0ff               │
│                              │
│  ← Back                      │
│                              │
│  ┌──────────────────────┐    │
│  │     🎮 (72px)       │    │
│  │   "Simon Says"      │    │  40px, weight 800, #e74c3c
│  │  Pattern Memory     │    │  18px, #666
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │ Best: 15     │   │    │  Score card
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │    Play      │   │    │  bg: #e74c3c, pill
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  instructions...     │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

### Specs

#### Container
- **Background**: `#f5f0ff` (light purple, consistent with other mini-games)
- **Safe area**: full screen

#### Back Button
- **Position**: top-left
- **Padding**: horizontal `20px`, top `16px`
- **Text**: `16px`, weight `600`, color `#e74c3c` (red theme)

#### Content Area
- **Flex**: 1
- **Alignment**: center
- **Padding**: horizontal `24px`
- **Margin top**: `-40px` (shifts content up)

#### Emoji Icon
- **Size**: `72px`
- **Emoji**: 🎮
- **Margin bottom**: `12px`

#### Title
- **Font**: `40px`, weight `800`
- **Color**: `#e74c3c` (red)
- **Margin bottom**: `8px`

#### Subtitle
- **Font**: `18px`, weight `400`
- **Color**: `#666`
- **Alignment**: center
- **Margin bottom**: `24px`
- **Text**: "Pattern Memory Game"

#### Best Score Card
- **Background**: `#ffffff`
- **Border radius**: `16px`
- **Padding**: vertical `12px`, horizontal `28px`
- **Margin bottom**: `28px`
- **Shadow**: offset `{0, 2}`, opacity `0.08`, radius `8`, elevation `3`
- **Alignment**: center
- **Display**: only if `bestScore > 0`

##### Score Label
- **Font**: `14px`, weight `600`
- **Color**: `#888`
- **Text transform**: uppercase
- **Letter spacing**: `1`
- **Text**: "BEST SCORE"

##### Score Value
- **Font**: `32px`, weight `800`
- **Color**: `#e74c3c` (red)

#### Play Button
- **Background**: `#e74c3c` (red)
- **Padding**: vertical `18px`, horizontal `52px`
- **Border radius**: `32px` (pill-shaped)
- **Shadow**: color `#e74c3c`, offset `{0, 4}`, opacity `0.3`, radius `8`, elevation `5`

##### Button Text
- **Font**: `22px`, weight `700`
- **Color**: `#ffffff`
- **Text**: "Play! 🎮"

#### Instructions
- **Font**: `14px`, weight `400`
- **Color**: `#888`
- **Alignment**: center
- **Margin top**: `28px`
- **Max width**: `280px`
- **Line height**: `20px`
- **Text**: "Watch the pattern light up, then repeat it by tapping the buttons in the same order!"

---

## SimonSaysGameScreen

### Layout Structure

```
┌──────────────────────────────┐
│         SafeAreaView         │
│    bg: #f5f0ff               │
│                              │
│  ← Back    Round: 5   15    │  Header
│                              │
│      "Watch the pattern"     │  Status message
│                              │
│  ┌──────────────────────┐    │
│  │  ┌────┐    ┌────┐   │    │
│  │  │ 🔴 │    │ 🔵 │   │    │  Color grid (2x2)
│  │  └────┘    └────┘   │    │
│  │  ┌────┐    ┌────┐   │    │
│  │  │ 🟢 │    │ 🟡 │   │    │
│  │  └────┘    └────┘   │    │
│  └──────────────────────┘    │
│                              │
│  [Game Over Modal]           │  (when game ends)
└──────────────────────────────┘
```

### Specs

#### Header
- **Layout**: row, `space-between`
- **Padding**: horizontal `20px`, vertical `16px`, bottom `12px`

##### Back Button
- **Font**: `16px`, weight `600`, color `#e74c3c`
- **Text**: "← Back"

##### Header Stats
- **Layout**: row, gap `16px`
- **Font**: `16px`, weight `700`, color `#e74c3c`
- **Text**: "Round: X" and "Score: X"

#### Status Message
- **Container**: padding vertical `24px`, center aligned
- **Font**: `22px`, weight `700`, color `#333`
- **Messages**:
  - Ready: "Get Ready!"
  - Showing: "Watch the pattern..."
  - Playing: "Your turn!"
  - Correct: "✓ Correct!"
  - Wrong: "✗ Wrong!"

#### Button Grid
- **Container**: flex `1`, center aligned
- **Layout**: row, wrap
- **Padding**: horizontal `40px`
- **Gap**: `16px`
- **Max width**: `400px`

#### Color Buttons (2x2 Grid)

##### Button Layout
- **Width**: `45%` of container
- **Aspect ratio**: `1:1` (square)
- **Border radius**: `16px`
- **Shadow**: offset `{0, 4}`, opacity `0.3`, radius `8`, elevation `5`

##### Colors
1. **Red (top-left)**:
   - Normal: `#e74c3c`
   - Active: `#ff6b6b` (lighter)
   - Frequency: 440 Hz (A note)

2. **Blue (top-right)**:
   - Normal: `#3498db`
   - Active: `#74b9ff` (lighter)
   - Frequency: 494 Hz (B note)

3. **Green (bottom-left)**:
   - Normal: `#27ae60`
   - Active: `#55efc4` (lighter)
   - Frequency: 523 Hz (C note)

4. **Yellow (bottom-right)**:
   - Normal: `#f1c40f`
   - Active: `#ffeaa7` (lighter)
   - Frequency: 587 Hz (D note)

##### Button States
- **Disabled**: when `phase !== 'playing'`
- **Active**: scale animation `1.05`, lighter color, plays sound
- **Interaction**: light haptic feedback on press

---

## Game Over Modal

### Layout
```
┌──────────────────────────────┐
│   Semi-transparent backdrop  │
│        rgba(0,0,0,0.5)       │
│                              │
│     ┌──────────────────┐     │
│     │   Game Over!     │     │  28px, #e74c3c
│     │                  │     │
│     │ Rounds Completed │     │  16px, #666
│     │       15         │     │  48px, #e74c3c
│     │                  │     │
│     │ 🎉 New Record!   │     │  (if applicable)
│     │                  │     │
│     │  ┌───────────┐   │     │
│     │  │Play Again │   │     │  #e74c3c pill
│     │  └───────────┘   │     │
│     │      Back        │     │
│     └──────────────────┘     │
└──────────────────────────────┘
```

### Specs

#### Modal Backdrop
- **Background**: `rgba(0, 0, 0, 0.5)`
- **Layout**: flex, center justified
- **Padding**: `24px`

#### Modal Card
- **Background**: `#ffffff`
- **Border radius**: `24px`
- **Padding**: `32px`
- **Max width**: `340px`
- **Shadow**: offset `{0, 8}`, opacity `0.15`, radius `20`, elevation `10`
- **Alignment**: center

#### Modal Title
- **Font**: `28px`, weight `800`
- **Color**: `#e74c3c`
- **Margin bottom**: `24px`
- **Text**: "Game Over!"

#### Score Section
- **Alignment**: center
- **Margin bottom**: `20px`

##### Score Label
- **Font**: `16px`, color `#666`
- **Margin bottom**: `8px`
- **Text**: "Rounds Completed"

##### Score Value
- **Font**: `48px`, weight `800`
- **Color**: `#e74c3c`

#### New Record Text (conditional)
- **Font**: `16px`, weight `600`
- **Color**: `#27ae60` (green)
- **Margin bottom**: `16px`
- **Text**: "🎉 New Record!"
- **Display**: only if `score > bestScore`

#### Play Again Button
- **Background**: `#e74c3c`
- **Padding**: vertical `14px`, horizontal `40px`
- **Border radius**: `28px` (pill)
- **Shadow**: color `#e74c3c`, offset `{0, 4}`, opacity `0.3`, radius `8`, elevation `5`
- **Margin top**: `8px`

##### Button Text
- **Font**: `18px`, weight `700`
- **Color**: `#ffffff`
- **Text**: "Play Again"

#### Back Button (Modal)
- **Padding**: vertical `10px`, horizontal `24px`
- **Margin top**: `12px`
- **Font**: `16px`, weight `600`, color `#e74c3c`
- **Text**: "Back"

---

## Game Mechanics

### Sequence Playback
- **Initial delay**: `1000ms` between rounds 1-9
- **Fast mode**: `600ms` after round 10
- **Button activation**: `300ms` duration
- **Visual**: color brightens, scale animation
- **Audio**: tone plays per color
- **Haptic**: light impact on each activation

### Player Input
- **Active phase**: "Your turn!" message displayed
- **Tap detection**: immediate visual feedback
- **Validation**: instant check against sequence
- **Correct**: continue to next round after `1500ms`
- **Wrong**: display "✗ Wrong!", trigger game over after `1000ms`

### Scoring
- **Base**: 1 point per round completed
- **Bonus**: +5 at round 5, +10 at round 10, +15 at round 15 (cumulative)
- **Star ratings** (optional future enhancement):
  - 1 star: 3-5 rounds
  - 2 stars: 6-10 rounds
  - 3 stars: 11+ rounds

### Animations
- **Button press**: spring animation, scale `1.0 → 1.05 → 1.0`
- **Modal entrance**: fade in `250ms` ease-out
- **Color transitions**: smooth `300ms` between normal/active states

---

## Accessibility

- **Buttons**: `accessibilityRole="button"`
- **Labels**: color names provided (e.g., "red button", "blue button")
- **Feedback**: visual, audio, and haptic (multi-sensory)

---

## i18n Keys

### Home Screen
- `simonSays.title`
- `simonSays.subtitle`
- `simonSays.instructions`
- `simonSays.play`
- `simonSays.bestScore`

### Game Screen
- `simonSays.round`
- `simonSays.score`
- `simonSays.getReady`
- `simonSays.watch`
- `simonSays.yourTurn`
- `simonSays.correct`
- `simonSays.wrong`

### Game Over
- `simonSays.gameOver.title`
- `simonSays.gameOver.roundsCompleted`
- `simonSays.gameOver.newRecord`
- `simonSays.gameOver.playAgain`
- `common.back`

---

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Primary (Red) | Red | `#e74c3c` |
| Button Red Active | Light Red | `#ff6b6b` |
| Button Blue | Blue | `#3498db` |
| Button Blue Active | Light Blue | `#74b9ff` |
| Button Green | Green | `#27ae60` |
| Button Green Active | Light Green | `#55efc4` |
| Button Yellow | Yellow | `#f1c40f` |
| Button Yellow Active | Light Yellow | `#ffeaa7` |
| Background | Light Purple | `#f5f0ff` |
| Text Dark | Dark Gray | `#333` |
| Text Light | Gray | `#666` |
| Success | Green | `#27ae60` |

---

## Dependencies
- **expo-av**: Sound playback for button tones
- **expo-haptics**: Tactile feedback
- **React Native Reanimated**: Button animations
- **AsyncStorage**: Best score persistence
- **i18next**: Internationalization
