# Design Tokens

> Foundation tokens for the Pet Care Game design system.
> Source of truth: `src/config/constants.ts` and `src/config/responsive.ts`

---

## Color Palette

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-primary` | `#9b59b6` | Primary purple - CTAs, headers, selection highlights |
| `brand-primary-light` | `#f5f0ff` | Light purple - screen backgrounds (Login, GameSelection, mini-game homes) |
| `brand-primary-surface` | `#f3e5f5` | Selected state background (CreatePet selections) |
| `brand-primary-border` | `#e0d4f0` | Unselected border accent |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `stat-high` | `#4CAF50` | Green - healthy range (value > 70) |
| `stat-medium` | `#FFA726` | Orange - needs attention (value > 40) |
| `stat-low` | `#EF5350` | Red - urgent (value > 20) |
| `stat-critical` | `#C62828` | Dark red - emergency (value <= 20) |
| `urgency-urgent` | `#EF5350` | Red urgency indicator |
| `urgency-suggested` | `#FFA726` | Orange urgency indicator |
| `urgency-normal` | `#4CAF50` | Green urgency indicator |

### Feedback Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#27ae60` | Correct answers, multiplayer button, pet runner accent |
| `error` | `#e74c3c` | Wrong answers, game over titles |
| `error-surface` | `#ffebee` | Error container background |
| `error-text` | `#c62828` | Error text color |
| `warning` | `#F44336` | Warning text (pet stats) |
| `info-blue` | `#4285f4` | Google login, info actions |
| `reward-gold` | `#f1c40f` | Stars, new best score |

### Surface Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `surface-white` | `#ffffff` | Cards, action containers, buttons |
| `surface-gray-light` | `#f5f5f5` | Health badge background, cancel buttons |
| `surface-gray-border` | `#e0e0e0` | Input borders, header bottom border |
| `surface-disabled` | `#cccccc` | Disabled button background |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#333333` | Primary text, titles |
| `text-secondary` | `#555555` | Labels |
| `text-tertiary` | `#666666` | Descriptions, subtitles |
| `text-muted` | `#888888` | Instructions, score labels |
| `text-placeholder` | `#999999` | Placeholder text, dividers |
| `text-on-dark` | `#ffffff` | Text on colored backgrounds |

### Scene-Specific Background Colors

| Token | Hex | Screen |
|-------|-----|--------|
| `bg-home` | `#e8f5e9` | HomeScreen (soft green) |
| `bg-feed` | `#fff8e1` | FeedScene (warm yellow) |
| `bg-bath` | `#e3f2fd` | BathScene (light blue) |
| `bg-sleep` | `#1a1a2e` | SleepScene (dark navy) |
| `bg-play` | `#e1f5fe` | PlayScene (sky blue) |
| `bg-vet` | `#E8F5E9` | VetScene (soft green) |
| `bg-wardrobe` | `#fce4ec` | WardrobeScene (light pink) |
| `bg-menu` | `#fdf6ec` | MenuScreen (warm cream) |
| `bg-login` | `#f5f0ff` | LoginScreen (light purple) |
| `bg-runner` | `#87CEEB` | PetRunnerGame (sky blue) |
| `bg-runner-home` | `#e8f8e8` | PetRunnerHome (light green) |

### Menu Screen Quilt Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `quilt-pink` | `#f4a5a5` | Quilt patch / hero card (no pet) |
| `quilt-blue` | `#a5c8e4` | Quilt patch / hero card (with pet) |
| `quilt-green` | `#a5d6a7` | Quilt patch / avatar circle |
| `quilt-yellow` | `#fff59d` | Quilt patch / language card / guest badge |
| `quilt-purple` | `#ce93d8` | Quilt patch |
| `menu-rose` | `#c0606b` | Menu title, back button, sign out accent |
| `menu-blue-accent` | `#6a9bc3` | Menu subtitle, new pet text |

### Action Scene Accent Colors

| Token | Hex | Screen |
|-------|-----|--------|
| `feed-accent` | `#ff9800` | Feed arrows, food border, cost text |
| `feed-item-bg` | `#ffe0b2` | Food item button background |
| `feed-arrow-bg` | `#fff3e0` | Arrow button background |
| `play-accent` | `#0288d1` | Play arrows, activity border |
| `play-item-bg` | `#81d4fa` | Activity button background |
| `play-arrow-bg` | `#b3e5fc` | Arrow button background |
| `wardrobe-accent` | `#e91e63` | Wardrobe selected border |
| `wardrobe-selected-bg` | `#f8bbd9` | Wardrobe slot selected background |
| `sleep-gold` | `#FFD54F` | Floating Z, progress bar fill, benefits title |
| `vet-sidebar-bg` | `rgba(46, 125, 50, 0.9)` | Vet benefits sidebar |
| `vet-ad-button` | `#2196F3` | Watch ad button |
| `money-gold` | `#FFD700` | Money badge background |

---

## Typography

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `weight-normal` | `400` | Body text (default) |
| `weight-medium` | `500` | Subtitle, back button text |
| `weight-semibold` | `600` | Labels, button text, stat values |
| `weight-bold` | `700` | Titles, score values, play buttons |
| `weight-extrabold` | `800` | Hero titles, game titles, score numbers |

### Font Sizes (Base - Mobile)

| Token | Size | Usage |
|-------|------|-------|
| `fs-hero` | `40px` | Game home titles (Muito, Pet Runner) |
| `fs-title-lg` | `36px` | Login title, Memory Match title |
| `fs-title` | `32px` | GameSelection title, Menu title, ColorTap title |
| `fs-title-md` | `28px` | CreatePet title, game over overlay title |
| `fs-title-sm` | `24px` | Scene header titles |
| `fs-subtitle` | `22px` | Play button text, overlay score |
| `fs-body-lg` | `20px` | Create button text, hero text, confirm modal title |
| `fs-body` | `18px` | Subtitles, scene messages, score text |
| `fs-body-sm` | `16px` | Button text, back text, modal message, labels |
| `fs-caption` | `14px` | Instructions, secondary info, page indicators |
| `fs-small` | `12px` | Footer text, char count, descriptions, badge text |
| `fs-tiny` | `10px` | Smallest labels, sidebar text (mobile) |

### Responsive Font Scale

Fonts scale based on device width relative to iPhone 12 Pro (390px):
- Scale range: `0.85x` to `1.3x`
- Applied via `fs()` function from `useResponsive()` hook

---

## Spacing

### Base Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-2` | `2px` | Minimal gaps (marginTop between name/age) |
| `space-4` | `4px` | Tight spacing (compact card padding) |
| `space-6` | `6px` | Small gaps (between items, quilt squares) |
| `space-8` | `8px` | Standard small padding |
| `space-10` | `10px` | Card padding (compact), action gap |
| `space-12` | `12px` | Standard padding, margins |
| `space-16` | `16px` | Page padding, button gaps |
| `space-20` | `20px` | Section padding |
| `space-24` | `24px` | Content padding, card inner padding |
| `space-28` | `28px` | Large gap (before play button) |
| `space-32` | `32px` | Section separator, before CTA |
| `space-40` | `40px` | Page top padding |

### Responsive Spacing

Spacing scales via `spacing()` function:
- Formula: `size * Math.min(scale, 1.15)`
- Prevents excessive scaling on large devices

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `8px` | Small elements (error container, back button) |
| `radius-md` | `12px` | Standard (buttons, inputs, cards, scene containers) |
| `radius-lg` | `16px` | Large cards (profile, score, best score, options) |
| `radius-xl` | `20px` | Action containers, food/activity buttons, hero cards |
| `radius-2xl` | `24px` | Game cards (GameSelection), overlay cards |
| `radius-pill` | `32px` | Pill buttons (play buttons, difficulty chips) |

---

## Shadows

### Shadow Levels

| Token | Config | Usage |
|-------|--------|-------|
| `shadow-sm` | `offset: {0, 1}, opacity: 0.05, radius: 2, elevation: 2` | Headers |
| `shadow-md` | `offset: {0, 2}, opacity: 0.1, radius: 4, elevation: 3` | Buttons, small cards |
| `shadow-lg` | `offset: {0, 4}, opacity: 0.08, radius: 12, elevation: 4` | Game cards |
| `shadow-xl` | `offset: {0, 4}, opacity: 0.3, radius: 8, elevation: 5` | CTA play buttons |
| `shadow-overlay` | `offset: {0, 8}, opacity: 0.15, radius: 20, elevation: 10` | Overlays, modals |

---

## Breakpoints & Device Types

| Breakpoint | Width | Device Type |
|------------|-------|-------------|
| `mobileSmall` | `375px` | — |
| `mobile` | `<428px` | `mobile` |
| `mobileLarge` | `428-768px` | `mobileLarge` |
| `tablet` | `768-1024px` | `tablet` |
| `tabletLarge` | `1280px` | — |
| `desktop` | `>=1280px` | `desktop` |

---

## Animation Tokens

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| `duration-short` | `1000ms` | Button feedback |
| `duration-medium` | `1500ms` | Feeding, playing |
| `duration-long` | `2000ms` | Bathing, complex transitions |
| `duration-extra-long` | `3000ms` | Extended animations |

### Spring Configurations

| Token | Damping | Stiffness | Usage |
|-------|---------|-----------|-------|
| `spring-default` | `15` | `150` | General animations |
| `spring-bouncy` | `10` | `120` | Playful animations |
| `spring-stiff` | `20` | `200` | Quick, precise movements |
| `spring-happy` | `8` | `100` | Happy bounce (amplitude: -15) |

### Pet Animations

| State | Parameters |
|-------|-----------|
| `idle` | Scale to 1.02, duration 2000ms (breathing) |
| `eating` | Bob -5px, duration 400ms |
| `bathing` | Shake 3px, sequence 50-100-50ms |
| `happy` | Wiggle rotation 5deg, sequence 100-200-100ms |
| `sleeping` | Float -30px, opacity 0.4-1.0, scale 1.0-1.2, cycle 1500ms |

---

## Icon System

The app uses **emojis as icons** - no icon font or SVG library.

### Action Icons

| Icon | Emoji | Action |
|------|-------|--------|
| Feed | `🍖` | Navigate to Feed scene |
| Bath | `🛁` | Navigate to Bath scene |
| Sleep | `💤` | Navigate to Sleep scene |
| Vet | `🏥` / `🚨` | Navigate to Vet (urgent variant) |
| Clothes | `👕` | Navigate to Wardrobe |
| Play | `🎮` | Navigate to Play scene |
| Menu | `🏠` | Return to menu |

### Status Icons

| Icon | Emoji | Stat |
|------|-------|------|
| Hunger | `🍖` | Hunger level |
| Hygiene | `🛁` | Hygiene level |
| Energy | `⚡` | Energy level |
| Happiness | `😊` / `😐` / `😢` | Happiness level (dynamic) |
| Health | `❤️` | Health level |
| Money | `💰` | Currency display |

### Game Icons

| Icon | Emoji | Game |
|------|-------|------|
| Muito | `🔢` | Counting game |
| Memory Match | `🧠` | Card matching game |
| Pet Runner | `🏃` | Runner game |
| Color Tap | (text-based) | Color matching game |
| Pet Care | `🐾` | Main pet game |
