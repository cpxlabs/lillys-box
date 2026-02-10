# HomeScreen

> Main pet care hub. Displays pet with status and action buttons.
> Source: `src/screens/HomeScreen.tsx`

![HomeScreen](./screenshots/05-home-screen.png)

---

## Layout Structure

```
┌────────────────────────────────┐
│          SafeAreaView          │
│     bg: #e8f5e9 (soft green)  │
│                                │
│  ┌──────────────────────────┐  │
│  │     StatusCard           │  │  Transparent bg
│  │  [Name/Age] [empty] [Bars]│  │  30%-40%-30% split
│  └──────────────────────────┘  │
│                                │
│  ⚠️ Warning text (conditional) │  #F44336
│                                │
│  [RewardedAdButton]            │  Watch & earn coins
│                                │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │      PetRenderer         │  │  Centered, responsive size
│  │      (animated pet)      │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │    Actions Container     │  │  bg: #fff, rounded top
│  │  ┌──┐ ┌──┐ ┌──┐ ┌──┐   │  │
│  │  │🍖│ │🛁│ │💤│ │🏥│   │  │  IconButton grid
│  │  └──┘ └──┘ └──┘ └──┘   │  │
│  │  ┌──┐ ┌──┐ ┌──┐        │  │
│  │  │👕│ │🎮│ │🏠│        │  │
│  │  └──┘ └──┘ └──┘        │  │
│  └──────────────────────────┘  │
│                                │
│  [BannerAd]                    │  Bottom banner
└────────────────────────────────┘
```

---

## Specifications

### Container
- **Background**: `#e8f5e9` (soft green)
- **Layout**: `flex: 1` SafeAreaView

### StatusCard (component)
- **Layout**: 30% left (name/age/money), 40% center (empty), 30% right (stat bars)
- **Margin**: horizontal `10px`, vertical `6px`
- **Padding**: `10px`
- See `17-shared-components.md` for full StatusCard spec

### Warning Text (conditional)
- **Font**: `13px` (responsive via `fs()`), weight `600`
- **Color**: `#F44336`
- **Alignment**: center
- **Margin top**: `6px`, padding horizontal `16px`
- **Shown when**: `hasWarningStats(pet)` returns true

### Rewarded Ad Button
- **Padding**: horizontal `12px`, vertical `6px`
- **Content**: RewardedAdButton component with reward text

### Pet Container
- **Layout**: `flex: 1`, centered both axes
- **Pet size**: responsive per device type
  - Mobile: `260px`
  - Mobile Large: `300px`
  - Tablet: `350px`
  - Desktop: `400px`

### Actions Container
- **Background**: `#ffffff`
- **Border radius**: top-left/right `20px` (responsive)
- **Padding**: `12px` (responsive)
- **Gap**: `10px` (responsive)
- **Padding bottom**: `8px`
- **Layout**: row, wrapping, centered
- **Shadow**: offset `{0, -2}`, opacity `0.1`, radius `8`, elevation `5`

### Action Buttons (7 buttons using IconButton)

| Emoji | Label Key | Navigation | Notes |
|-------|-----------|------------|-------|
| `🍖` | `home.actions.feed` | Feed | |
| `🛁` | `home.actions.bath` | Bath | |
| `💤` | `home.actions.sleep` | Sleep | Disabled when energy is high |
| `🏥`/`🚨` | `home.actions.vet`/`veterinarian` | Vet | Emoji changes when urgent |
| `👕` | `home.actions.clothes` | Wardrobe | |
| `🎮` | `home.actions.play` | Play | |
| `🏠` | `home.actions.menu` | Menu confirm | Shows ConfirmModal |

### Banner Ad
- **Position**: bottom of screen
- **Component**: BannerAd

### Confirm Modal (Menu)
- **Title**: `home.menuModal.title`
- **Message**: `home.menuModal.message`
- **Confirm/Cancel**: navigates back / dismisses

---

## States

| State | Visual |
|-------|--------|
| Default | All actions enabled (except sleep if energy high) |
| Warning stats | Orange warning text shown below StatusCard |
| Vet urgent | Vet button shows `🚨` instead of `🏥` |
| Sleep disabled | Sleep button at 50% opacity, shows toast on press |
| Menu confirm | ConfirmModal overlay |
