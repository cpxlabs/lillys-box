# Shared Components

> Reusable UI components used across multiple screens.
> Source: `src/components/`

---

## StatusCard

> Pet info display with name, age, money, and stat bars.
> Source: `src/components/StatusCard.tsx`

### Layout

```
┌──────────────────────────────────────────┐
│  [30% Left]   [40% Center]  [30% Right]  │
│  🐱 Mimi                     🍖 ██░░     │
│  2 years                     🛁 ████     │
│  💰 150                      ⚡ ███░     │
│                               😊 ████     │
│                               ❤️ ██░░     │
└──────────────────────────────────────────┘
```

### Specs
- **Background**: transparent
- **Margin**: horizontal `8-10px`, vertical `4-6px` (responsive, compact vs normal)
- **Padding**: `8-10px` (responsive)
- **Border radius**: `10px` (responsive)

#### Left Column (30%)
- **Pet name**: weight `bold`, color `#333`, `14-15px` (responsive)
- **Pet age**: color `#666`, `11-12px` (responsive)
- **Money badge**:
  - Background: `#FFD700`
  - Padding: vertical `2px`, horizontal `6px`
  - Border radius: `5px`
  - Layout: row with 💰 emoji
  - Text: weight `bold`, color `#333`, `12px` (responsive)

#### Middle Column (40%)
- Empty spacer

#### Right Column (30%)
- **EnhancedStatusBar** in two-column layout mode

### Props
| Prop | Type | Description |
|------|------|-------------|
| `pet` | Pet | Pet data object |
| `petName` | string | Formatted name with emoji |
| `petAge` | string | Formatted age string |
| `compact` | boolean | Reduces spacing for action screens |

---

## EnhancedStatusBar

> Multi-stat display with color-coded progress bars.
> Source: `src/components/EnhancedStatusBar.tsx`

### Two-Column Layout
```
┌────────────┬────────────┐
│ 🍖 ██████░ │ 😊 ████░░ │
│ 🛁 ████░░░ │ ❤️ ██████ │
│ ⚡ ███░░░░ │            │
└────────────┴────────────┘
```

### Single Column Layout
```
🍖 ██████░░ Hunger
🛁 ████░░░░ Hygiene
⚡ ███░░░░░ Energy
😊 ████░░░░ Happiness
❤️ ██████░░ Health
```

### Stats

| Stat | Emoji | Color Logic |
|------|-------|-------------|
| Hunger | `🍖` | green/orange/red by level |
| Hygiene | `🛁` | green/orange/red by level |
| Energy | `⚡` | green/orange/red by level |
| Happiness | `😊`/`😐`/`😢` | Dynamic emoji + color |
| Health | `❤️` | green/orange/red by level |

### Color Thresholds
```
value > 70  → #4CAF50 (green)
value > 40  → #FFA726 (orange)
value > 20  → #EF5350 (red)
value <= 20 → #C62828 (dark red)
```

---

## IconButton

> Emoji-based action button with haptic feedback.
> Source: `src/components/IconButton.tsx`

### Visual
```
┌──────────┐
│    🍖    │  Emoji (centered)
│   Feed   │  Label (centered)
└──────────┘
```

### Specs
- **Background**: `#ffffff`
- **Alignment**: center both axes
- **Shadow**: offset `{0, 2}`, opacity `0.1`, radius `4`, elevation `3`
- **Border radius**: `12px` (responsive)

#### Responsive Sizing (ICON_BUTTON_SIZE)

| Property | Mobile | Mobile Large | Tablet | Desktop |
|----------|--------|-------------|--------|---------|
| width | `72px` | `80px` | `90px` | `100px` |
| padding | `10px` | `12px` | `14px` | `16px` |
| emoji | `26px` | `28px` | `32px` | `36px` |
| label | `10px` | `11px` | `12px` | `14px` |

#### Label
- **Weight**: `600`
- **Color**: `#333`
- **Alignment**: center

### States

| State | Visual |
|-------|--------|
| Default | White bg, full opacity |
| Pressed | `activeOpacity: 0.7`, haptic feedback |
| Disabled | `opacity: 0.5` |
| Disabled with reason | Still pressable, shows toast with explanation |

---

## ScreenHeader

> Reusable header bar with back button and title.
> Source: `src/components/ScreenHeader.tsx`

### Layout
```
┌──────────────────────────────────────┐
│  ← Voltar          Title          [] │
│  [1/3 left]    [1/3 center]  [1/3]  │
└──────────────────────────────────────┘
```

### Specs
- **Background**: `#ffffff`
- **Border bottom**: `1px` solid `#e0e0e0`
- **Shadow**: offset `{0, 1}`, opacity `0.05`, radius `2`, elevation `2`
- **Padding**: horizontal `16px`, vertical `12px`
- **Layout**: row, `space-between`, centered

#### Back Button
- **Layout**: row, centered
- **Padding**: vertical `4px`, horizontal `8px`
- **Border radius**: `8px`
- **Text**: "Voltar", `15px`, weight `500`, color `#007AFF`
- **Icon**: BackButtonIcon component, marginRight `4px`

#### Title
- **Font**: `18px`, weight `bold`, color `#333`
- **Alignment**: center

---

## ConfirmModal

> Confirmation dialog with cancel/confirm actions.
> Source: `src/components/ConfirmModal.tsx`

### Layout
```
┌─────────────────────────────┐  Overlay
│ ┌─────────────────────────┐ │  rgba(0,0,0,0.5)
│ │        Title            │ │
│ │       Message           │ │
│ │                         │ │
│ │  [Cancel] [Confirm]     │ │  Side by side
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Specs

#### Overlay
- **Background**: `rgba(0, 0, 0, 0.5)`
- **Padding**: `20px`
- **Layout**: centered

#### Modal Card
- **Background**: `#ffffff`
- **Border radius**: `16px`
- **Padding**: `24px`
- **Max width**: `400px`
- **Shadow**: offset `{0, 4}`, opacity `0.3`, radius `8`, elevation `8`

#### Title
- **Font**: `20px`, weight `bold`, color `#333`
- **Alignment**: center
- **Margin bottom**: `12px`

#### Message
- **Font**: `16px`, color `#666`, lineHeight `22px`
- **Alignment**: center
- **Margin bottom**: `24px`

#### Button Container
- **Layout**: row

#### Cancel Button
- **Background**: `#f5f5f5`
- **Border**: `1px` solid `#ddd`
- **Border radius**: `12px`
- **Padding**: vertical `14px`, horizontal `20px`
- **Text**: `16px`, weight `600`, color `#666`

#### Confirm Button
- **Background**: `#9b59b6` (default) or `#F44336` (destructive)
- **Border radius**: `12px`
- **Padding**: vertical `14px`, horizontal `20px`
- **Margin left**: `6px`
- **Text**: `16px`, weight `600`, color `#ffffff`

---

## EmojiIcon

> Consistent emoji rendering across platforms.
> Source: `src/components/EmojiIcon.tsx`

### Props
| Prop | Type | Description |
|------|------|-------------|
| `emoji` | string | Emoji character to render |
| `size` | number | Font size for the emoji |
| `style` | ViewStyle | Additional styling |
| `label` | string | Accessibility label |

---

## LanguageSelector

> Language switching UI (English / Portuguese).
> Source: `src/components/LanguageSelector.tsx`

Used in:
- GameSelectionScreen (footer)
- MenuScreen (language card)

---

## BannerAd

> Bottom banner advertisement.
> Source: `src/components/BannerAd.tsx`

Used in:
- HomeScreen (bottom)

---

## RewardedAdButton

> Button that offers video ad reward (bonus coins).
> Source: `src/components/RewardedAdButton.tsx`

Used in:
- HomeScreen (below StatusCard)

---

## Game Over Overlay Pattern

A consistent overlay pattern used across mini-games:

```
┌─────────────────────────────┐
│    rgba(0, 0, 0, 0.5)      │  Full-screen backdrop
│  ┌───────────────────────┐  │
│  │  White card (24px r)  │  │  Max 340px width
│  │                       │  │
│  │  Title (28px, 800)    │  │  Game-specific color
│  │  Stars / Score        │  │
│  │  Stats                │  │
│  │                       │  │
│  │  [Play Again] (pill)  │  │  Game accent color
│  │  Back (text link)     │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

Used in: MemoryMatchGameScreen, PetRunnerGameScreen
