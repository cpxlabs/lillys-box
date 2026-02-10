# SleepScene

> Dark-themed sleep screen with progress bar and floating Z animation.
> Source: `src/screens/SleepScene.tsx`

> **Note:** No screenshot available - this screen requires low pet energy to access, which can't be triggered in automated testing. Refer to the layout diagram and specs below.

---

## Layout Structure

```
┌─────────────────────────────────┐
│           SafeAreaView          │
│      bg: #1a1a2e (dark navy)    │
│                                 │
│  ┌───────────────────────────┐  │
│  │  ScreenHeader             │  │
│  │  ← Voltar   💤 Dormir    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  StatusCard (compact)     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    PetRenderer (fading)   │  │  Opacity fades to 0.3
│  │                    Zzz    │  │  Floating Z animation
│  │                           │  │
│  │  "{name} needs rest"      │  │  White text
│  └───────────────────────────┘  │
│                                 │
│  ┌──────────┐  ┌─────────┐     │
│  │ Benefits │  │         │     │  Sidebar (conditional)
│  │ +energy  │  │         │     │
│  │ +happy   │  │         │     │
│  │ -hunger  │  │         │     │
│  └──────────┘  │         │     │
│                                 │
│  ┌───────────────────────────┐  │
│  │  [Sleep Button]           │  │  or Progress bar
│  │  [Back]                   │  │  or Cancel button
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## Specifications

### Container
- **Background**: `#1a1a2e` (dark navy) - unique dark theme

### Pet Display
- **Size**: PET_SIZE_SMALL (responsive)
  - Mobile: `220px`, Mobile Large: `260px`, Tablet: `300px`, Desktop: `350px`
- **Fade effect**: Animated.Value from `1.0` to `0.3` over `2000ms` when sleeping

### Floating Z Animation (FloatingZ component)
- **Position**: absolute, top `-20px`, right `20px`
- **Layout**: row, 3 "Z" characters of decreasing size
- **Large Z**: `48px`, bold, color `#FFD54F`
- **Medium z**: `36px`, marginLeft `4px`, marginTop `10px`
- **Small z**: `24px`, marginLeft `4px`, marginTop `18px`
- **Text shadow**: `#000`, offset `{2, 2}`, radius `4`
- **Animation** (looping):
  - translateY: `0 → -30 → 0` (1500ms each)
  - opacity: `1 → 0.4 → 1` (1500ms each)
  - scale: `1 → 1.2 → 1` (1500ms each)

### Pet Name Text
- **Font**: responsive titleSize (`18-32px`)
- **Weight**: `600`
- **Color**: `#ffffff`
- **Alignment**: center
- **Margin top**: `12px` (responsive)

### Not Tired Text (when can't sleep)
- **Font**: `14px` (responsive)
- **Color**: `#FFA726` (orange)
- **Margin top**: `8px`

### Benefits Sidebar (when can sleep and not sleeping)
- **Position**: absolute, right `8px`, top `35%`
- **Background**: `rgba(255, 255, 255, 0.15)` (frosted glass)
- **Border radius**: `10px` (responsive)
- **Padding**: `10px` (responsive)
- **Max width**: `100px` (responsive)

#### Sidebar Title
- **Font**: responsive sidebarTitle (`12-16px`)
- **Weight**: `700`
- **Color**: `#FFD54F` (gold)
- **Margin bottom**: `6px`

#### Sidebar Text
- **Font**: responsive sidebarText (`10-14px`)
- **Color**: `#ffffff`
- **Margin vertical**: `2px`

### Sleep Button (before sleeping)
- **Background**: `#4CAF50` (green)
- **Disabled background**: `#666`, opacity `0.5`
- **Padding**: horizontal `32px`, vertical `14px`
- **Border radius**: `10px`
- **Min width**: `160px`
- **Text**: responsive buttonText (`14-22px`), weight `600`, color `#ffffff`

### Back Button (before sleeping)
- **Margin top**: `16px`, padding `10px`
- **Text**: `14px` (responsive), color `#ffffff`, opacity `0.7`

### Progress Container (while sleeping)
- **Width**: 100%
- **Alignment**: center

#### Progress Text
- **Font**: responsive progressText (`16-24px`)
- **Weight**: `600`
- **Color**: `#ffffff`
- **Margin bottom**: `12px`

#### Progress Bar
- **Height**: `20px` (responsive)
- **Background**: `#333` (dark gray track)
- **Border radius**: `10px` (responsive)
- **Overflow**: hidden

#### Progress Fill
- **Background**: `#FFD54F` (gold)
- **Height**: 100%
- **Border radius**: `10px`
- **Width**: `{progress}%`

#### Duration Text
- **Font**: `14px` (responsive)
- **Color**: `#ffffff`, opacity `0.8`
- **Margin top**: `8px`

#### Cancel Button (Wake Up Early)
- **Margin top**: `24px`, padding `10px`
- **Text**: responsive buttonText, weight `600`, color `#FFA726` (orange)

---

## States

| State | Visual |
|-------|--------|
| Can sleep | Sleep button green, Benefits sidebar visible |
| Can't sleep (energy high) | Button grayed out, "Not tired" text in orange |
| Sleeping | Pet fades to 0.3 opacity, floating Z, progress bar, cancel button |
| Sleep complete | Fades back in, auto-navigates home after 500ms |
