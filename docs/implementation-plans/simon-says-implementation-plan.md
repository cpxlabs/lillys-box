# Simon Says (Pattern Memory) - Implementation Plan

## Overview
A classic pattern memory game with 4 colored buttons. The game plays a sequence that grows longer each round, and the player must repeat it correctly.

**Category:** puzzle
**Complexity:** Low
**Reuses existing assets:** Minimal — uses existing button/card component patterns

---

## Game Mechanics (from GAME_IDEAS_BRAINSTORM.md)

### Core Features
- 4 large colored buttons arranged in a 2x2 grid (red, blue, green, yellow)
- Game plays a sequence: buttons light up one by one with a distinct sound per color
- Player taps buttons to repeat the sequence
- Correct: sequence grows by one step, round advances
- Wrong: game over, final score = number of rounds completed
- Visual + audio feedback for each button press (light up + tone)
- Optional "speed up" mode after round 10 where the demo sequence plays faster

### Scoring
- 1 point per round survived
- Bonus points for streaks of 5, 10, 15 rounds
- Coin reward based on rounds completed
- Personal best tracking

---

## Implementation Tasks

### Phase 1: Setup & Configuration
- [ ] Create `SimonSaysNavigator.tsx` with stack navigator (Home → Game)
- [ ] Create `SimonSaysContext.tsx` with:
  - Best score state
  - Current score state
  - Audio state (enabled/disabled)
  - Game settings (speed mode, sound effects)
- [ ] Create `SimonSaysProvider.tsx` to wrap the context
- [ ] Add i18n keys to translation files:
  - `selectGame.simonSays.name`
  - `selectGame.simonSays.description`
  - `simonSays.title`
  - `simonSays.subtitle`
  - `simonSays.instructions`
  - `simonSays.playButton`
  - `simonSays.round`
  - `simonSays.gameOver`
  - `simonSays.yourScore`
  - `simonSays.playAgain`
  - `simonSays.back`

### Phase 2: SimonSaysHomeScreen
- [ ] Create `src/screens/SimonSaysHomeScreen.tsx`
- [ ] Layout following mini-game home pattern:
  - Purple background (#f5f0ff)
  - Back button top-left
  - Large emoji icon (🎮 or 🎯) at 72px
  - Title "Simon Says" at 40px, weight 800, color #e74c3c (red theme)
  - Subtitle explaining the game
  - Best score card (white, rounded, shadowed)
  - Large pill-shaped Play button (#e74c3c background)
  - Instructions text at bottom
- [ ] Load best score from context
- [ ] Navigation to game screen on play button press

### Phase 3: SimonSaysGameScreen - UI Layout
- [ ] Create `src/screens/SimonSaysGameScreen.tsx`
- [ ] Layout structure:
  - SafeAreaView with purple background
  - Header with back button, round counter, current score
  - 2x2 grid of colored buttons (centered, with padding)
  - Status message area (showing "Watch..." or "Your turn!" or "Correct!")
  - Game over modal overlay (similar to Memory Match)

#### Button Colors & Design
- [ ] Red button (#e74c3c) - top-left
- [ ] Blue button (#3498db) - top-right
- [ ] Green button (#27ae60) - bottom-left
- [ ] Yellow button (#f1c40f) - bottom-right
- [ ] Button specs:
  - Square buttons with equal width/height
  - Border radius: 16px
  - Shadow: offset {0, 4}, opacity 0.3, radius 8
  - "Active" state: lighter color + scale animation
  - Disabled state: opacity 0.6

### Phase 4: Game Logic
- [ ] Implement sequence generation:
  - Start with sequence length 1
  - Add random color to sequence each round
  - Store sequence as array of color IDs (0-3)
- [ ] Implement sequence playback:
  - Play each color in sequence with timing
  - Light up button (animate color change + scale)
  - Play sound for each color (use expo-av)
  - Delay between each step (1000ms initially, 600ms after round 10)
- [ ] Implement player input:
  - Enable buttons after sequence playback
  - Track player's button presses
  - Compare with expected sequence
  - Provide immediate visual feedback (light up on press)
- [ ] Implement round progression:
  - Correct sequence → add to score, grow sequence, play again
  - Incorrect → trigger game over
  - Speed up after round 10 (reduce playback delay)

### Phase 5: Audio System
- [ ] Create sound files or use expo-av to generate tones:
  - Red: 440 Hz (A note)
  - Blue: 494 Hz (B note)
  - Green: 523 Hz (C note)
  - Yellow: 587 Hz (D note)
  - Error sound: lower tone or buzzer
  - Success sound: cheerful chime
- [ ] Implement sound playback with expo-av:
  - Load sounds on screen mount
  - Play sound when button lights up
  - Play error sound on wrong input
  - Play success sound on correct sequence
  - Respect context audio settings (mute option)

### Phase 6: Scoring & Persistence
- [ ] Calculate score:
  - 1 point per round
  - Bonus: +5 at round 5, +10 at round 10, +15 at round 15, etc.
- [ ] Update best score in context if new high score
- [ ] Display score during game (header)
- [ ] Show final score in game over modal

### Phase 7: Game Over Modal
- [ ] Create modal overlay (similar to Memory Match):
  - Semi-transparent backdrop (rgba(0,0,0,0.5))
  - White card with rounded corners (24px)
  - Title: "Game Over!" (28px, weight 800, color #e74c3c)
  - Score display: "You completed X rounds" (18px, weight 600)
  - Final score: large, bold (24px, weight 800)
  - Star rating (optional): based on rounds completed
    - 1 star: 3-5 rounds
    - 2 stars: 6-10 rounds
    - 3 stars: 11+ rounds
  - Play Again button (pill-shaped, #e74c3c background)
  - Back button (text only, #e74c3c color)

### Phase 8: Animations & Polish
- [ ] Button press animation:
  - Scale up slightly (1.0 → 1.05) with spring animation
  - Brighten color when active
  - Use React Native Reanimated
- [ ] Sequence playback animation:
  - Smooth color transitions
  - Scale pulse on each button activation
- [ ] Game over animation:
  - Modal fade in with scale animation
  - Celebration effect if new high score
- [ ] Add haptic feedback:
  - Light tap on button press
  - Heavy tap on error
  - Success pattern on round completion

### Phase 9: Registration & Navigation
- [ ] Register game in App.tsx:
  ```typescript
  gameRegistry.register({
    id: 'simon-says',
    nameKey: 'selectGame.simonSays.name',
    descriptionKey: 'selectGame.simonSays.description',
    emoji: '🎮',
    category: 'puzzle',
    navigator: SimonSaysNavigator,
    providers: [SimonSaysProvider],
    isEnabled: true,
  });
  ```
- [ ] Add imports in App.tsx
- [ ] Verify navigation from GameSelectionScreen

### Phase 10: Testing & Documentation
- [ ] Test game flow: home → game → play → game over → play again
- [ ] Test sequence accuracy and timing
- [ ] Test audio playback (with sound on/off)
- [ ] Test best score persistence
- [ ] Create design documentation in `docs/design-system/17-simon-says-game.md`
- [ ] Add screenshots to design documentation
- [ ] Update design system README.md with new entry

---

## Design Specifications

### Colors
- **Primary (Red):** #e74c3c
- **Button Red:** #e74c3c
- **Button Blue:** #3498db
- **Button Green:** #27ae60
- **Button Yellow:** #f1c40f
- **Background:** #f5f0ff (purple tint, consistent with other mini-games)
- **Text:** #333 (dark gray)
- **Secondary text:** #666

### Typography
- **Home title:** 40px, weight 800
- **Home subtitle:** 18px, weight 400
- **Game header:** 18px, weight 700
- **Status message:** 20px, weight 600
- **Modal title:** 28px, weight 800
- **Score:** 24px, weight 800

### Spacing
- Button grid padding: 40px horizontal, 20px vertical
- Button gap: 16px
- Modal padding: 32px
- Header padding: 20px horizontal, 12px vertical

### Animations
- Button press: 200ms spring animation
- Sequence playback: 300ms per step
- Modal entrance: 250ms ease-out

---

## Dependencies & Reuse
- **React Navigation:** Native Stack (already installed)
- **React Native Reanimated:** For animations (already installed)
- **expo-av:** For sound playback (already installed)
- **expo-haptics:** For tactile feedback (already installed)
- **i18next:** For translations (already installed)
- **useResponsive hook:** For responsive sizing
- **Shared components:** IconButton, ScreenHeader patterns

---

## Success Criteria
- [ ] Game is playable and sequence logic is correct
- [ ] Audio feedback works on all platforms
- [ ] Animations are smooth and responsive
- [ ] Best score persists across sessions
- [ ] UI matches design system guidelines
- [ ] Game is registered and accessible from GameSelectionScreen
- [ ] All text is internationalized (EN + PT)
- [ ] Design documentation is complete with screenshots
