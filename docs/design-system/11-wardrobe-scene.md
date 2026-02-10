# WardrobeScene

> Clothing/costume system with slot-based selection and item grid.
> Source: `src/screens/WardrobeScene.tsx`

---

## Layout Structure

```
┌─────────────────────────────────┐
│           SafeAreaView          │
│      bg: #fce4ec (light pink)   │
│                                 │
│  ┌───────────────────────────┐  │
│  │  ScreenHeader             │  │
│  │  ← Voltar   👕 Wardrobe  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  StatusCard (compact)     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │      PetRenderer          │  │  Smaller pet with clothes
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Slot Selector (white)    │  │
│  │  🎩   👀   👕   🧦      │  │  Horizontal tabs
│  │  Head Eyes Torso Paws    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Items Grid (ScrollView)  │  │
│  │  ┌────┐ ┌────┐ ┌────┐   │  │  3-column grid (mobile)
│  │  │ ❌ │ │ 👔 │ │ 👔 │   │  │
│  │  │None│ │Item1│ │Item2│   │  │
│  │  └────┘ └────┘ └────┘   │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## Specifications

### Container
- **Background**: `#fce4ec` (light pink - fashion/wardrobe theme)

### Pet Container
- **Alignment**: center
- **Padding vertical**: `12px` (responsive)
- **Pet size**: PET_SIZE_SMALL (smaller to make room for items)

### Slot Selector
- **Layout**: row, `space-around`
- **Background**: `#ffffff`
- **Margin horizontal**: `12px` (responsive)
- **Border radius**: `12px` (responsive)
- **Padding vertical**: `10px` (responsive)

#### Slot Button (each)
- **Alignment**: center
- **Padding**: responsive (mobile `6px` → desktop `12px`)
- **Border radius**: `10px` (responsive)

#### Selected Slot
- **Background**: `#f8bbd9` (pink highlight)

#### Slot Content
- **Emoji size**: responsive (`20-32px`)
- **Label**: responsive (`9-14px`), weight `600`, color `#333`, marginTop `2px`

### Slot Tabs

| Key | Emoji | Label Key |
|-----|-------|-----------|
| head | `🎩` | `wardrobe.slots.head` |
| eyes | `👀` | `wardrobe.slots.eyes` |
| torso | `👕` | `wardrobe.slots.torso` |
| paws | `🧦` | `wardrobe.slots.paws` |

### Items Grid
- **Layout**: row, wrapping, `flex-start`
- **Padding horizontal**: `12px` (responsive)
- **Margin top**: `12px` (responsive)
- **ScrollView**: vertical scrolling

#### Item Button
- **Background**: `#ffffff`
- **Border**: `2px` solid `transparent`
- **Border radius**: `10px` (responsive)
- **Padding**: responsive (`10-16px`)
- **Width**: responsive (mobile/mobileLarge `30%`, tablet `23%`, desktop `18%`)
- **Margin right**: `3%`
- **Margin bottom**: `10px` (responsive)
- **Alignment**: center

#### Selected Item
- **Border color**: `#e91e63` (pink)
- **Background**: `#fce4ec` (light pink)

#### Item Content
- **Preview area**: responsive `40x40px`, centered
- **Emoji**: `👔`, responsive size (`28-40px`)
- **Name**: responsive (`9-12px`), weight `600`, color `#333`

### "None" Option (first item)
- **Emoji**: `❌`, same sizing as items
- **Label**: i18n `wardrobe.none`
- **Selected when**: `pet.clothes[slot] === null`

---

## Responsive Sizing (WARDROBE_SIZES)

| Property | Mobile | Mobile Large | Tablet | Desktop |
|----------|--------|-------------|--------|---------|
| slotEmoji | `20px` | `24px` | `28px` | `32px` |
| slotLabel | `9px` | `10px` | `12px` | `14px` |
| slotPadding | `6px` | `8px` | `10px` | `12px` |
| itemWidth | `30%` | `30%` | `23%` | `18%` |
| itemPadding | `10px` | `12px` | `14px` | `16px` |
| itemEmoji | `28px` | `32px` | `36px` | `40px` |
| itemName | `9px` | `10px` | `11px` | `12px` |

---

## States

| State | Visual |
|-------|--------|
| Default | Head slot selected, items for slot shown |
| Slot selected | Pink background on selected tab |
| Item selected | Pink border + light pink bg on item |
| None selected | "❌ None" item highlighted |

---

## Interactions

- **Slot tab press**: switches clothing category, updates grid
- **Item press**: immediately equips item on pet (real-time preview)
- **None press**: removes clothing from slot
- **Accessibility**: `role: "radio"` on slots, `role: "button"` on items
