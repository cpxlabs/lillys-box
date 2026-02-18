# Color Mixer Lab Game Screens

> Educational color mixing game where players drag paint colors into a bowl to match a target color.
> Sources: `src/screens/ColorMixerHomeScreen.tsx`, `src/screens/ColorMixerLevelScreen.tsx`, `src/screens/ColorMixerGameScreen.tsx`

---

## ColorMixerHomeScreen

### Layout Structure

```
┌──────────────────────────────┐
│     LinearGradient bg        │
│    #fef3c7 → #dbeafe         │
│                              │
│  ← Back                      │
│                              │
│  ┌──────────────────────┐    │
│  │     🎨 (72px)        │    │
│  │  ┌────────────────┐  │    │
│  │  │ Color Mixer Lab│  │    │  Gradient text bg
│  │  └────────────────┘  │    │  36px, weight 800, white
│  │  Mix the perfect     │    │  18px, #666
│  │  color!              │    │
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │ Levels: 5/20 │   │    │  Progress card
│  │  │ Stars: 12/60 │   │    │
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │    Play      │   │    │  Gradient button
│  │  └──────────────┘   │    │
│  │                      │    │
│  │  instructions...     │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

### Specs

#### Container
- **Background**: `LinearGradient` from `#fef3c7` (warm yellow) to `#dbeafe` (light blue)
- **Safe area**: full screen

#### Back Button
- **Padding**: horizontal `20px`, top `16px`
- **Text**: `16px`, weight `600`, color `#ff6b6b`

#### Emoji Icon
- **Size**: `72px`
- **Emoji**: 🎨

#### Title
- **Background**: `LinearGradient` `#ff6b6b → #4ecdc4` (horizontal)
- **Font**: `36px`, weight `800`, color `#fff`
- **Border radius**: `8px`

#### Progress Card
- **Background**: `#ffffff`
- **Border radius**: `16px`
- **Padding**: vertical `20px`, horizontal `32px`
- **Shadow**: offset `{0, 2}`, opacity `0.1`, radius `8`, elevation `4`
- **Max width**: `300px`
- **Rows**: Levels Completed (x/20) and Total Stars (x/60)
- **Value color**: `#ff6b6b`, `20px`, weight `800`

#### Play Button
- **Background**: `LinearGradient` `#ff6b6b → #4ecdc4`
- **Padding**: vertical `18px`, horizontal `52px`
- **Border radius**: `32px` (pill)
- **Shadow**: color `#ff6b6b`, offset `{0, 4}`, opacity `0.3`, radius `8`

---

## ColorMixerLevelScreen

### Layout Structure

```
┌──────────────────────────────┐
│     LinearGradient bg        │
│                              │
│  ← Back  Color Mixer Lab     │  Header
│                              │
│  ┌───┬───┬───┬───┐          │
│  │ 1 │ 2 │ 3 │ 4 │          │  4-column level grid
│  │⭐⭐⭐│⭐⭐☆│🔒 │🔒 │          │
│  ├───┼───┼───┼───┤          │
│  │ 5 │ 6 │...│...│          │
│  └───┴───┴───┴───┘          │
└──────────────────────────────┘
```

### Specs

#### Level Grid
- **Columns**: 4
- **Button size**: calculated from screen width
- **Button**: white bg, radius `12px`, shadow
- **Locked**: gray bg `#f0f0f0`, opacity `0.6`, lock emoji 🔒
- **Color preview**: target color swatch at top of button
- **Stars**: ⭐ (earned) / ☆ (empty), 3 per level

---

## ColorMixerGameScreen

### Layout Structure

```
┌──────────────────────────────┐
│     LinearGradient bg        │
│                              │
│  ← Back    Level 3           │  Header
│                              │
│      "Target Color"          │
│  ┌──────────────────────┐    │
│  │  ████████████████    │    │  Target swatch (120x120)
│  │  "Mix red + blue"    │    │  Hint text
│  └──────────────────────┘    │
│                              │
│      "Mixing Bowl"           │
│  ┌──────────────────────┐    │
│  │       ⬤             │    │  Bowl (180px circle)
│  │   current mix        │    │  Shows mixed color
│  │  "Drag colors here"  │    │
│  └──────────────────────┘    │
│       [Reset]                │
│                              │
│  ⬤Red  ⬤Blue  ⬤Yellow      │  Draggable paint blobs
│                              │
│  ┌──────────────────────┐    │
│  │       Check          │    │  Gradient button
│  └──────────────────────┘    │
└──────────────────────────────┘
```

### Specs

#### Target Swatch
- **Size**: `120x120px`
- **Border radius**: `16px`
- **Border**: `2px rgba(0,0,0,0.1)`
- **Shadow**: offset `{0, 2}`, opacity `0.2`, radius `4`

#### Mixing Bowl
- **Size**: `180px` diameter (circle)
- **Border**: `4px #94a3b8`
- **Shadow**: offset `{0, 4}`, opacity `0.3`, radius `8`
- **Empty text**: "Drag colors here" in `14px`, italic, `#999`

#### Draggable Paint Blobs
- **Size**: `80px` diameter (circle)
- **Border**: `2px rgba(255,255,255,0.5)`
- **Shadow**: offset `{0, 4}`, opacity `0.3`, radius `6`
- **Interaction**: `PanGestureHandler` for drag
- **Drop zone**: bowl area (Y position based)
- **Scale**: `1.1` when dragging

#### Check Button
- **Background**: `LinearGradient` `#ff6b6b → #4ecdc4` (enabled) or `#ccc` (disabled)
- **Padding**: vertical `14px`, horizontal `48px`
- **Border radius**: `32px`
- **Disabled**: when no colors mixed

---

## Result Modal

### Layout
```
┌──────────────────────────────┐
│   Semi-transparent backdrop  │
│                              │
│     ┌──────────────────┐     │
│     │  Level Complete! │     │  28px, #333
│     │                  │     │
│     │ Target    Your   │     │  Side-by-side swatches
│     │  ████     ████   │     │  80x80 each
│     │                  │     │
│     │  ⭐ ⭐ ☆         │     │  Star rating
│     │                  │     │
│     │  Accuracy: 85%   │     │  20px, #ff6b6b
│     │                  │     │
│     │  [Next Level]    │     │  Primary button
│     │  [Back to Levels]│     │  Secondary button
│     └──────────────────┘     │
└──────────────────────────────┘
```

---

## Game Mechanics

### Color Mixing
- **Algorithm**: RGB averaging of all dropped colors
- **Base colors**: Red, Blue, Yellow, White, Green, Black
- **Distance**: Euclidean distance in RGB space (0-442 range)

### Star Rating
- **3 stars**: color distance < 30
- **2 stars**: color distance < 60
- **1 star**: color distance < 90
- **0 stars**: color distance ≥ 90

### Level Progression
- **Total levels**: 20
- **Unlock**: next level unlocks when current is completed (any star count)
- **Level 1**: always unlocked

---

## i18n Keys

### Home Screen
- `colorMixer.title`
- `colorMixer.subtitle`
- `colorMixer.instructions`
- `colorMixer.play`
- `colorMixer.levelsCompleted`
- `colorMixer.totalStars`

### Game Screen
- `colorMixer.level`
- `colorMixer.target`
- `colorMixer.mixingBowl`
- `colorMixer.dragHere`
- `colorMixer.check`
- `colorMixer.reset`

### Result Modal
- `colorMixer.levelComplete`
- `colorMixer.yourMix`
- `colorMixer.accuracy`
- `colorMixer.perfect`
- `colorMixer.close`
- `colorMixer.tryAgain`
- `colorMixer.nextLevel`
- `colorMixer.backToLevels`

---

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Primary Red | Coral | `#ff6b6b` |
| Primary Teal | Teal | `#4ecdc4` |
| Background Start | Warm Yellow | `#fef3c7` |
| Background End | Light Blue | `#dbeafe` |
| Bowl Border | Slate | `#94a3b8` |
| Card | White | `#ffffff` |
| Text Dark | Dark Gray | `#333` |
| Text Light | Gray | `#666` |
| Disabled | Light Gray | `#ccc` |

---

## Dependencies
- **expo-linear-gradient**: Gradient backgrounds and buttons
- **react-native-gesture-handler**: `PanGestureHandler` for paint dragging
- **React Native Animated**: Drag position and scale animations
- **AsyncStorage**: Level progress persistence
- **i18next**: Internationalization
