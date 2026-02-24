# LoginScreen

> Authentication entry point. Google Sign-In or Guest mode.
> Source: `src/screens/LoginScreen.tsx`

![LoginScreen](./screenshots/01-login-screen.png)

---

## Layout Structure

```
┌─────────────────────────────┐
│        SafeAreaView         │
│   bg: #f5f0ff (brand-light) │
│                             │
│   ┌─────────────────────┐   │
│   │    Logo Section     │   │
│   │    🐾 (80px)       │   │
│   │  "Pet Care Game"    │   │
│   │  "Care for your..." │   │
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │   Error Container   │   │  (conditional)
│   │   bg: #ffebee       │   │
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │  🔐 Sign in Google  │   │  bg: #4285f4
│   │       "or"          │   │
│   │  👤 Play as Guest   │   │  border: #9b59b6
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │      Footer         │   │
│   │  "Login to save..." │   │
│   └─────────────────────┘   │
└─────────────────────────────┘
```

---

## Specifications

### Container
- **Background**: `#f5f0ff`
- **Layout**: `flex: 1`, content centered with `justifyContent: space-between`
- **Padding**: horizontal `20px`, vertical `40px`

### Logo Section
- **Margin top**: `40px`
- **Alignment**: center
- **Logo emoji**: `🐾`, fontSize `80px`, marginBottom `20px`
- **Title**: "Pet Care Game"
  - Font: `36px`, weight `bold`, color `#333333`
  - marginBottom: `8px`
- **Subtitle**: "Care for your virtual pet"
  - Font: `16px`, color `#666666`

### Error Container (conditional)
- **Background**: `#ffebee`
- **Border radius**: `8px`
- **Padding**: `12px`
- **Margin**: vertical `16px`
- **Text**: `14px`, color `#c62828`, center-aligned

### Button Container
- **Width**: `100%`
- **Gap**: `16px`
- **Alignment**: center

### Google Sign-In Button
- **Background**: `#4285f4`
- **Border radius**: `12px`
- **Padding**: vertical `16px`, horizontal `20px`
- **Layout**: row, centered, gap `10px`
- **Shadow**: offset `{0, 2}`, opacity `0.1`, radius `3`, elevation `3`
- **Emoji**: `🔐`, `20px`
- **Text**: "Sign in with Google", `16px`, weight `600`, color `#ffffff`
- **Disabled state**: opacity `0.6`

### Divider
- **Text**: "or", `14px`, color `#999999`
- **Margin**: vertical `8px`

### Guest Button
- **Background**: `#f5f0ff`
- **Border**: `2px` solid `#9b59b6`
- **Border radius**: `12px`
- **Padding**: vertical `16px`, horizontal `20px`
- **Layout**: row, centered, gap `10px`
- **Emoji**: `👤`, `20px`
- **Text**: "Play as Guest", `16px`, weight `600`, color `#9b59b6`
- **Loading indicator**: color `#9b59b6`

### Footer
- **Padding**: vertical `20px`
- **Text**: `12px`, color `#999999`, center-aligned, lineHeight `18px`

---

## States

| State | Visual Change |
|-------|--------------|
| Default | Normal button colors |
| Loading | ActivityIndicator replaces button content, opacity `0.6` |
| Error | Error container shown above buttons |

---

## Interactions

- **Google button press**: Triggers sign-in flow with loading indicator
- **Guest button press**: Enables guest mode with loading indicator
- **Error dismissal**: Error clears on next sign-in attempt
