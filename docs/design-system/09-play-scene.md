# PlayScene

> Play activity screen with carousel-style activity selection.
> Source: `src/screens/PlayScene.tsx`

---

## Layout Structure

```
┌─────────────────────────────────┐
│           SafeAreaView          │
│      bg: #e1f5fe (sky blue)     │
│                                 │
│  ┌───────────────────────────┐  │
│  │  ScreenHeader             │  │
│  │  ← Voltar    🎮 Play     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  StatusCard (compact)     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │      PetRenderer          │  │
│  │      (animated)           │  │
│  │                           │  │
│  │    "Playing ball!"        │  │  message (conditional)
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Activities Container     │  │  bg: #fff, rounded top
│  │  "Choose an activity"     │  │
│  │                           │  │
│  │  ←  ┌──────────┐  →      │  │  navigation
│  │     │  ⚽       │         │  │  activity button
│  │     │  Ball    │         │  │
│  │     └──────────┘         │  │
│  │       1 / 4              │  │  page indicator
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## Specifications

### Container
- **Background**: `#e1f5fe` (light sky blue)

### Activities Container
- **Background**: `#ffffff`
- **Border radius**: top `20px` (responsive)
- **Padding**: `16px` (responsive)

#### Section Title
- **Font**: responsive titleSize (`18-32px`)
- **Weight**: `600`
- **Color**: `#333`
- **Alignment**: center
- **Margin bottom**: `12px`

### Arrow Buttons
- **Background**: `#b3e5fc` (light blue)
- **Shape**: circle
- **Size**: responsive (`40-60px`)
- **Arrow text**: `←` / `→`, color `#0288d1` (blue)

### Current Activity Button
- **Background**: `#81d4fa` (medium blue)
- **Border**: `3px` solid `#0288d1` (darker blue)
- **Border radius**: `16px` (responsive)
- **Padding**: responsive (`14-28px`)
- **Min width**: responsive (`110-180px`)

#### Activity Contents
- **Emoji**: responsive size (`36-56px`), marginBottom `6px`
- **Name**: responsive font (`13-20px`), weight `bold`, color `#333`

### Page Indicator
- **Font**: `13px` (responsive), weight `600`, color `#666`
- **Alignment**: center

---

## Color Comparison: Play vs Feed

| Element | Feed Scene | Play Scene |
|---------|-----------|------------|
| Background | `#fff8e1` (amber) | `#e1f5fe` (sky blue) |
| Arrow bg | `#fff3e0` | `#b3e5fc` |
| Arrow text | `#ff9800` | `#0288d1` |
| Item bg | `#ffe0b2` | `#81d4fa` |
| Item border | `#ff9800` | `#0288d1` |

---

## Activity Data

Activities loaded from `src/data/playActivities.ts` (PLAY_ACTIVITIES array).
Each has: `emoji`, `nameKey` (i18n key).

---

## States

| State | Visual |
|-------|--------|
| Default | Activity carousel visible, pet idle |
| Animating | Arrows disabled, pet animates, message shown |
| Post-action | DoubleRewardModal may appear |

---

## Interactions

- **Arrow press**: cycles through activity carousel
- **Activity press**: triggers play action with animation sequence
- **Disabled during animation**: all controls disabled
