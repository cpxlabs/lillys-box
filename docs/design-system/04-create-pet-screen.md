# CreatePetScreen

> Pet creation form with type, name, gender, and coat color selection.
> Source: `src/screens/CreatePetScreen.tsx`

---

## Layout Structure

```
┌──────────────────────────────┐
│         SafeAreaView         │
│    bg: #f5f0ff (brand-light) │
│                              │
│  ← Back                      │  #9b59b6
│                              │
│  ┌──────────────────────┐    │
│  │  "Create Your Pet"   │    │  28px, bold, centered
│  │                      │    │
│  │  Choose Pet:         │    │  16px, weight 600
│  │  ┌──────┐ ┌──────┐  │    │
│  │  │ 🐱   │ │ 🐶   │  │    │  Selection buttons
│  │  │ Cat  │ │ Dog  │  │    │
│  │  └──────┘ └──────┘  │    │
│  │                      │    │
│  │  Name:               │    │
│  │  ┌──────────────┐   │    │
│  │  │ Text Input   │   │    │  18px, border #e0e0e0
│  │  └──────────────┘   │    │
│  │              12/20   │    │
│  │                      │    │
│  │  Gender:             │    │
│  │  ┌──────┐ ┌──────┐  │    │
│  │  │ ♂️   │ │ ♀️   │  │    │
│  │  └──────┘ └──────┘  │    │
│  │                      │    │
│  │  Coat Color:         │    │
│  │  ┌────┐┌────┐┌────┐ │    │
│  │  │ ⚪ ││ ⚫ ││ 🟤 │ │    │  Wrapping row
│  │  └────┘└────┘└────┘ │    │
│  │                      │    │
│  │  ┌──────────────┐   │    │
│  │  │  Create Pet   │   │    │  bg: #9b59b6
│  │  └──────────────┘   │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

---

## Specifications

### Container
- **Background**: `#f5f0ff`
- **Content padding**: `24px`
- **KeyboardAvoidingView**: `behavior: "padding"` (iOS) / `"height"` (Android)

### Back Button
- **Padding**: `16px` all, `8px` top
- **Layout**: row, centered
- **Text**: `16px`, weight `600`, color `#9b59b6`, marginLeft `4px`
- **Icon**: BackButtonIcon component

### Title
- **Font**: `28px`, weight `bold`, color `#333`
- **Alignment**: center
- **Margin bottom**: `32px`

### Section Labels
- **Font**: `16px`, weight `600`, color `#555`
- **Margin**: bottom `8px`, top `16px`

### Pet Type Selection (SelectionButton)
- **Layout**: row, centered
- **Button style**:
  - Background: `#ffffff`
  - Border radius: `16px`
  - Padding: `20px`
  - Min width: `120px`
  - Border: `3px` solid `transparent`
  - Margin horizontal: `8px`
- **Selected state**:
  - Border color: `#9b59b6`
  - Background: `#f3e5f5`
- **Emoji**: `48px`, marginBottom `8px`
- **Label**: `16px`, weight `600`, color `#333`

#### Selection Animation (Reanimated)
- Scale: `1.0 → 1.1 → 1.0`
- Spring config: damping `10`, stiffness `100`
- Haptic feedback: `selection()` on press

### Name Input
- **Background**: `#ffffff`
- **Border radius**: `12px`
- **Padding**: `16px`
- **Font size**: `18px`
- **Border**: `2px` solid `#e0e0e0`
- **Max length**: 20 characters
- **Placeholder color**: `#999`

#### Character Counter
- **Alignment**: right
- **Font**: `12px`, marginTop `4px`, marginRight `4px`
- **Color logic**:
  - At limit (20): `#EF5350` (stat-low)
  - Near limit (>=15): `#FFA726` (stat-medium)
  - Normal: `#666`

### Gender Selection
- **Layout**: row, flex `1` each
- **Button style**:
  - Background: `#ffffff`
  - Border radius: `12px`
  - Padding: `12px`
  - Border: `2px` solid `transparent`
  - Margin horizontal: `4px`
- **Selected state**: same as pet type (purple border + light bg)
- **Emoji**: `24px`
- **Label**: `12px`, weight `600`, color `#333`, marginTop `4px`

### Coat Color Selection
- **Layout**: row, wrapping, centered
- **Button style**: same as gender buttons with marginVertical `6px`
- **Options**:
  - Always: White (`⚪`), Black (`⚫`)
  - Dog only: Brown (`🟤`), White & Brown (`🤍🟤`)

### Create Button
- **Background**: `#9b59b6`
- **Disabled background**: `#cccccc`
- **Border radius**: `16px`
- **Padding**: `18px`
- **Margin top**: `32px`
- **Text**: `20px`, weight `bold`, color `#ffffff`

---

## States

| State | Visual |
|-------|--------|
| Default | Cat selected, Female selected, Base color |
| Type selected | Purple border + light purple bg, scale animation |
| Name empty | Create button grayed out (#ccc) |
| Name at limit | Char counter turns red |
| Dog selected | Brown and White&Brown color options appear |
| Creating | Button triggers creation and navigates |

---

## Accessibility

- Selection buttons: `role: "radio"`, `state: { selected }`
- Create button: `role: "button"`, `state: { disabled }`, `hint` when disabled
- Name input: standard TextInput accessibility
