# Settings Modal Testing Guide

## Overview
The Settings Modal (`SettingsModal.tsx`) provides 3 configuration tabs accessible via the gear icon ⚙️ on the Game Selection screen.

---

## Features

### 1. Language Tab
- **Options**: English (🇺🇸), Português BR (🇧🇷)
- **Persistence**: ✅ Persisted via i18n
- **Expected Behavior**: 
  - Selecting a language immediately updates all UI text
  - Language preference survives app restart

### 2. Sound Tab
- **Controls**:
  - Sound Effects toggle (switch)
  - Background Music toggle (switch)
  - Volume slider (0%, 25%, 50%, 75%, 100%)
- **Persistence**: ✅ Saved to AsyncStorage (`sound_enabled`, `music_enabled`, `volume_level`)
- **Expected Behavior**:
  - Toggles immediately affect sound playback
  - Settings survive app restart
  - When music is disabled, existing background music stops

### 3. Interface Tab
- **Options**: 26 UI variants (Default Grid, Compact List, Categories, etc.)
- **Persistence**: ✅ Now persisted (saved to AsyncStorage as `ui_index`)
- **Expected Behavior**:
  - Selecting an option immediately changes game selection UI layout
  - Modal closes on selection
  - Setting survives app restart

---

## Test Cases

### TC-001: Language Change
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open app → Tap ⚙️ icon | Settings modal opens |
| 2 | Tap "Language" tab | Language options displayed |
| 3 | Select "Português (BR)" | Checkmark appears, UI text changes to Portuguese |
| 4 | Close modal → Reopen | Portuguese should still be selected |

### TC-002: Sound Toggle - Effects
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Settings → Tap "Sound" tab | Sound options displayed |
| 2 | Toggle "Sound Effects" OFF | Switch shows OFF state |
| 3 | Perform action that plays sound (e.g., tap button) | No sound plays |
| 4 | Close app → Reopen | Sound should remain OFF |

### TC-003: Sound Toggle - Music
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Settings → Sound tab | Sound options displayed |
| 2 | Toggle "Background Music" OFF | Switch shows OFF state, music stops if playing |
| 3 | Close app → Reopen | Music should remain OFF |

### TC-004: Volume Control
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Settings → Sound tab | Volume buttons displayed (🔇 🔉 🔊) |
| 2 | Tap "25%" button | 25% is highlighted |
| 3 | Play sound | Sound plays at reduced volume |
| 4 | Close app → Reopen | Volume should remain at 25% |

### TC-005: Interface Selection
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Settings → Tap "Interface" tab | 26 layout options displayed |
| 2 | Select "2 Categories" | Modal closes, games grouped by category |
| 3 | Close app → Reopen | UI persists to selected variant |

### TC-006: Modal Close Behavior
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Settings modal | Modal is visible |
| 2 | Tap backdrop (dark area) | Modal closes |
| 3 | Tap X button | Modal closes |

---

## Manual Testing Checklist

- [ ] Language: Switch to Portuguese, restart app, verify persists
- [ ] Language: Switch to English, verify UI updates immediately
- [ ] Sound: Disable effects, verify button clicks are silent
- [ ] Sound: Disable music, verify background music stops
- [ ] Sound: Set volume to 0%, verify sounds are muted
- [ ] Sound: Set volume to 100%, verify full volume
- [ ] Interface: Select different layouts, verify UI changes
- [ ] Interface: Restart app, verify setting persists
- [ ] Modal: Verify closes on backdrop tap
- [ ] Modal: Verify closes on X button tap

---

## Automation Notes

The audio service has unit tests that verify AsyncStorage integration:
- `src/services/__tests__/AudioService.test.ts` (if exists)

Language context is tested in:
- `src/context/__tests__/LanguageContext.test.tsx` (if exists)
