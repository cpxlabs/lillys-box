# Color Tap Game Screens

> Color matching game. Home screen uses native UI; game screen uses HTML artifact.
> Sources: `src/screens/ColorTapHomeScreen.tsx`, `src/screens/ColorTapGameScreen.tsx`

![ColorTapHome](./screenshots/13-color-tap-home.png)

---

## ColorTapHomeScreen

### Layout Structure

```
┌──────────────────────────────┐
│         SafeAreaView         │
│    bg: #f5f0ff (brand-light) │
│                              │
│  ← Back                      │
│                              │
│  ┌──────────────────────┐    │
│  │  "Color Tap"          │    │  32px, weight 800, #9b59b6
│  │  subtitle             │    │  16px, #666
│  │  instructions         │    │  14px, #888
│  │                       │    │
│  │  ┌────────────────┐  │    │
│  │  │ Best Score     │  │    │  White card (conditional)
│  │  │    120         │  │    │  28px, weight 800, #9b59b6
│  │  └────────────────┘  │    │
│  │                       │    │
│  │  ┌────────────────┐  │    │
│  │  │     Play       │  │    │  bg: #9b59b6
│  │  └────────────────┘  │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

### Specs

#### Container
- **Background**: `#f5f0ff`

#### Back Button
- **Padding**: `16px`
- **Alignment**: flex-start
- **Text**: `16px`, weight `600`, color `#9b59b6`

#### Content Area
- **Layout**: centered both axes
- **Padding horizontal**: `32px`

#### Title
- **Font**: `32px`, weight `800`, color `#9b59b6`
- **Margin bottom**: `8px`
- **Alignment**: center

#### Subtitle
- **Font**: `16px`, color `#666`
- **Margin bottom**: `16px`

#### Instructions
- **Font**: `14px`, color `#888`
- **Line height**: `20px`
- **Margin bottom**: `32px`

#### Score Card
- **Background**: `#ffffff`
- **Border radius**: `16px`
- **Padding**: `20px`
- **Min width**: `140px`
- **Margin bottom**: `32px`
- **Shadow**: offset `{0, 2}`, opacity `0.08`, radius `8`, elevation `3`
- **Label**: `14px`, color `#888`, marginBottom `4px`
- **Value**: `28px`, weight `800`, color `#9b59b6`

#### Play Button
- **Background**: `#9b59b6`
- **Border radius**: `20px`
- **Padding**: vertical `16px`, horizontal `48px`
- **Text**: `20px`, weight `bold`, color `#ffffff`

---

## ColorTapGameScreen

The game screen uses an **HTML artifact** loaded via `ArtifactGameAdapter` component.
The game UI is rendered in a WebView (dark gradient background) and communicates with
React Native via `window.RNBridge`.

### Game Mechanic — Stroop Effect

Each round displays a **color name** (e.g. "Red") rendered in a **different, randomly
chosen ink color** (e.g. blue text). Four solid-colored circles appear below. The player
must tap the circle whose color matches the **word**, ignoring the misleading ink color.
This creates a Stroop-style cognitive challenge.

```
┌──────────────────────────────────┐
│  Score: 30              ❤️❤️❤️   │
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░ (timer) │
│                                  │
│       Tap the color:             │  gray, 14px
│                                  │
│           Green                  │  32px bold, shown in a DIFFERENT
│         (in blue)                │  color (Stroop distractor)
│                                  │
│   ┌──────┐      ┌──────┐         │
│   │  🔴  │      │  🟢  │         │  Solid color circles
│   └──────┘      └──────┘         │  aspect-square, rounded-full
│   ┌──────┐      ┌──────┐         │  border: white/20, 4px
│   │  🟡  │      │  🔵  │         │
│   └──────┘      └──────┘         │
└──────────────────────────────────┘
```

### Game State

| State | Description |
|-------|-------------|
| Start screen | "Start Game" button; instructions shown |
| In game | Timer bar, score, lives, color name + 4 circles |
| Game over | `RNBridge.gameOver(score)` fired; native overlay shown |

### Colors

| Name | Hex |
|------|-----|
| Red | `#ef4444` |
| Blue | `#3b82f6` |
| Green | `#22c55e` |
| Yellow | `#eab308` |
| Purple | `#a855f7` |
| Orange | `#f97316` |

Each round shows 4 of the 6 colors as options (target always included).
The target name is displayed in one of the remaining 5 colors as distractor.

### Scoring & Difficulty

- **+10 points** per correct tap
- **−1 life** per wrong tap or time expiry (3 lives total)
- Timer starts at 100, decrements every 100 ms
- Decrement = `min(10, 2 + floor(score / 50))` — speeds up every 50 points

### Native Overlay (game over)

Rendered by `ColorTapGameScreen` on top of the WebView when `gameOver` message received:

- **Card**: white, border-radius `24`, padding `32`, min-width `260`
- **Title**: `24px`, weight bold, color `#333`
- **Score**: `40px`, weight `800`, color `#9b59b6`
- **Play Again button**: bg `#9b59b6`, border-radius `16`, text white `16px` bold

The adapter provides:
- Score communication between WebView and React Native
- Back navigation handling
- Loading states
