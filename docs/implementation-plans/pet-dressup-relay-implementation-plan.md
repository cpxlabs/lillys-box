# Pet Dress-Up Relay - Implementation Plan

## Overview
A timed challenge where a target outfit is shown briefly, then the player must dress the pet to match it from a selection of clothing items. Speed and accuracy determine the score.

**Category:** casual
**Complexity:** Low
**Reuses existing assets:** Yes — wardrobe system, clothing sprites, pet renderer

---

## Game Mechanics (from GAME_IDEAS_BRAINSTORM.md)

### Core Features
- Show a "target look" for 3-5 seconds (pet wearing specific head, eyes, torso, paws items)
- Target disappears and a grid of clothing items appears
- Player drags items onto the pet (or taps to equip) to recreate the look
- 4 slots to fill: head, eyes, torso, paws — must match exactly
- Timer counts down (15-20 seconds per round)
- Rounds get harder: more distractor items, shorter preview time, similar-looking items

### Scoring
- Points for each correct slot (25 per slot, 100 max per round)
- Time bonus for finishing early
- Streak bonus for consecutive perfect rounds
- Coin reward at end

---

## Implementation Tasks

### Phase 1: Setup & Configuration
- [ ] Create `DressUpRelayNavigator.tsx` with stack navigator (Home → Game)
- [ ] Create `DressUpRelayContext.tsx` with:
  - Best score state
  - Current score state
  - Game settings (difficulty, timer duration)
  - Round progression tracking
- [ ] Create `DressUpRelayProvider.tsx` to wrap the context
- [ ] Add i18n keys to translation files:
  - `selectGame.dressUpRelay.name`
  - `selectGame.dressUpRelay.description`
  - `dressUpRelay.title`
  - `dressUpRelay.subtitle`
  - `dressUpRelay.instructions`
  - `dressUpRelay.playButton`
  - `dressUpRelay.round`
  - `dressUpRelay.timeLeft`
  - `dressUpRelay.memorize`
  - `dressUpRelay.dressYourPet`
  - `dressUpRelay.perfect`
  - `dressUpRelay.correct`
  - `dressUpRelay.gameOver`
  - `dressUpRelay.totalScore`
  - `dressUpRelay.accuracy`
  - `dressUpRelay.playAgain`

### Phase 2: DressUpRelayHomeScreen
- [ ] Create `src/screens/DressUpRelayHomeScreen.tsx`
- [ ] Layout following mini-game home pattern:
  - Purple background (#f5f0ff)
  - Back button top-left
  - Large emoji icon (👗 or 👔) at 72px
  - Title "Pet Dress-Up Relay" at 36px, weight 800, color #ec4899 (pink theme)
  - Subtitle explaining the game
  - Best score card (white, rounded, shadowed)
  - Large pill-shaped Play button (#ec4899 background)
  - Instructions text at bottom
- [ ] Load best score from context
- [ ] Navigation to game screen on play button press

### Phase 3: DressUpRelayGameScreen - UI Layout
- [ ] Create `src/screens/DressUpRelayGameScreen.tsx`
- [ ] Layout structure:
  - SafeAreaView with pink/purple gradient background (#fce4ec)
  - Header with back button, round counter, score, timer
  - **Preview Phase UI:**
    - Large "Memorize this outfit!" text
    - PetRenderer with target outfit (centered, large)
    - Countdown overlay (3...2...1...)
  - **Play Phase UI:**
    - "Dress your pet!" instruction text
    - Split view:
      - Left/Top: Small PetRenderer (current outfit preview)
      - Right/Bottom: Clothing items grid
    - 4 slot indicators showing which slots need to be filled
    - Submit/Check button (when all slots filled)
  - **Result Phase UI:**
    - Show which slots were correct/incorrect
    - Score earned for this round
    - Continue button

### Phase 4: Game State Machine
- [ ] Implement game phases:
  - **Preview:** Show target outfit for 3-5 seconds (based on difficulty)
  - **Countdown:** 3-2-1 countdown animation
  - **Play:** Player dresses the pet (timer active)
  - **Result:** Show score and correctness feedback
  - **Game Over:** Final score and statistics
- [ ] State transitions:
  - Preview → Countdown → Play → Result → (Preview next round or Game Over)
- [ ] Round progression logic:
  - Start at round 1 with easy settings
  - Each round: slightly harder (more items, less time, similar items)
  - Game ends after 5 rounds or when timer runs out

### Phase 5: Target Outfit Generation
- [ ] Read clothing data from existing wardrobe system
- [ ] Implement outfit randomizer:
  - Select random items for each slot (head, eyes, torso, paws)
  - Ensure items are actually owned/available in the game
  - For difficulty scaling: pick visually similar items as distractors
- [ ] Store target outfit in state (item IDs for each slot)

### Phase 6: Clothing Grid & Interaction
- [ ] Display clothing items in a scrollable grid:
  - Show 8-12 items (target items + distractors)
  - Items rendered with sprites (reuse wardrobe item rendering)
  - Visual indicator for item type (head icon, eyes icon, etc.)
- [ ] Implement item selection:
  - **Option A (Tap):** Tap item → auto-equip to correct slot
  - **Option B (Drag):** Drag item onto pet → equip to slot
  - Use gesture handler for drag interactions (already installed)
- [ ] Visual feedback:
  - Selected item highlights
  - Slot fills with item icon/sprite
  - PetRenderer updates to show current outfit

### Phase 7: Outfit Comparison & Scoring
- [ ] Compare player outfit to target outfit:
  - Check each slot (head, eyes, torso, paws)
  - Track which slots are correct
- [ ] Calculate round score:
  - 25 points per correct slot
  - Time bonus: (seconds remaining) * 2
  - Perfect bonus: +50 if all 4 slots correct
- [ ] Display result screen:
  - Show checkmarks/X marks for each slot
  - Animate score counting up
  - Show time bonus breakdown
- [ ] Track streak:
  - Increment streak counter for perfect rounds
  - Bonus: +25 points per streak level (2 streak = +25, 3 = +50, etc.)

### Phase 8: Timer System
- [ ] Implement countdown timer:
  - Starts at 20 seconds (round 1), reduces to 15s (round 3+)
  - Visual timer bar or countdown text
  - Color changes as time runs low (green → yellow → red)
  - Plays warning sound at 5 seconds remaining
- [ ] Timer expiration:
  - If time runs out, immediately check outfit and score
  - No penalty for incomplete outfit (0 points for empty slots)
  - Continue to next round or game over

### Phase 9: Pet Renderer Integration
- [ ] Reuse existing PetRenderer component from wardrobe system
- [ ] Two instances:
  - **Preview phase:** Large, centered, showing target outfit
  - **Play phase:** Smaller, showing current player outfit
- [ ] Update player PetRenderer in real-time as items are equipped
- [ ] Ensure pet sprite and animations work correctly

### Phase 10: Animations & Polish
- [ ] Countdown animation:
  - Large numbers (3...2...1...GO!) with scale/fade effect
  - Haptic pulse on each count
- [ ] Item selection animation:
  - Scale + shadow on item press
  - Smooth equip animation (item flies to slot)
- [ ] Result screen animations:
  - Checkmarks/X marks appear with bounce effect
  - Score counter animates up
  - Confetti/sparkles on perfect round
- [ ] Game over animation:
  - Modal fade in
  - Trophy/star animation for high score
- [ ] Timer warning:
  - Pulse animation when under 5 seconds
  - Red flash at 3 seconds

### Phase 11: Game Over & Results
- [ ] Create game over modal (similar to other mini-games):
  - Semi-transparent backdrop
  - White card with rounded corners
  - Title: "Game Over!" (28px, weight 800, color #ec4899)
  - Total score display (large, bold)
  - Statistics:
    - Rounds completed: X/5
    - Accuracy: X% (correct slots / total slots)
    - Best streak: X rounds
  - Star rating (optional): based on total score
    - 1 star: < 300 points
    - 2 stars: 300-499 points
    - 3 stars: 500+ points
  - Play Again button (pill-shaped, #ec4899 background)
  - Back button (text only, #ec4899 color)
- [ ] Update best score if new high score achieved

### Phase 12: Registration & Navigation
- [ ] Register game in App.tsx:
  ```typescript
  gameRegistry.register({
    id: 'dress-up-relay',
    nameKey: 'selectGame.dressUpRelay.name',
    descriptionKey: 'selectGame.dressUpRelay.description',
    emoji: '👗',
    category: 'casual',
    navigator: DressUpRelayNavigator,
    providers: [DressUpRelayProvider],
    isEnabled: true,
  });
  ```
- [ ] Add imports in App.tsx
- [ ] Verify navigation from GameSelectionScreen

### Phase 13: Testing & Documentation
- [ ] Test game flow: home → preview → play → result → next round → game over
- [ ] Test outfit generation and comparison logic
- [ ] Test timer accuracy and expiration
- [ ] Test PetRenderer updates with clothing changes
- [ ] Test scoring and best score persistence
- [ ] Create design documentation in `docs/design-system/18-dress-up-relay-game.md`
- [ ] Add screenshots to design documentation
- [ ] Update design system README.md with new entry

---

## Design Specifications

### Colors
- **Primary (Pink):** #ec4899
- **Background:** #fce4ec (light pink)
- **Timer bar (safe):** #27ae60 (green)
- **Timer bar (warning):** #f39c12 (orange)
- **Timer bar (danger):** #e74c3c (red)
- **Correct slot:** #27ae60 (green)
- **Incorrect slot:** #e74c3c (red)
- **Text:** #333 (dark gray)
- **Secondary text:** #666

### Typography
- **Home title:** 36px, weight 800
- **Home subtitle:** 18px, weight 400
- **Game header:** 18px, weight 700
- **Phase instructions:** 22px, weight 700
- **Countdown numbers:** 72px, weight 900
- **Modal title:** 28px, weight 800
- **Score:** 28px, weight 800

### Layout
- **Clothing grid:** 4 columns on mobile, 6 on tablet
- **Item size:** 80px x 80px (responsive with useResponsive)
- **Item gap:** 12px
- **PetRenderer (preview):** 60% screen width
- **PetRenderer (play):** 40% screen width or 200px
- **Timer bar height:** 8px

### Animations
- **Countdown:** 800ms scale + fade per number
- **Item equip:** 300ms bezier ease-out
- **Result checkmark:** 200ms spring bounce
- **Score count-up:** 1000ms ease-out
- **Modal entrance:** 250ms ease-out

---

## Dependencies & Reuse
- **PetRenderer:** Existing component from wardrobe system
- **Clothing data:** Existing wardrobe sprites and metadata
- **React Navigation:** Native Stack (already installed)
- **React Native Reanimated:** For animations (already installed)
- **React Native Gesture Handler:** For drag interactions (already installed)
- **expo-haptics:** For tactile feedback (already installed)
- **i18next:** For translations (already installed)
- **useResponsive hook:** For responsive sizing

---

## Success Criteria
- [ ] Game is playable with smooth phase transitions
- [ ] Outfit generation is random and fair
- [ ] PetRenderer updates correctly with clothing changes
- [ ] Scoring logic is accurate and transparent
- [ ] Timer works correctly with visual feedback
- [ ] Best score persists across sessions
- [ ] UI matches design system guidelines
- [ ] Game is registered and accessible from GameSelectionScreen
- [ ] All text is internationalized (EN + PT)
- [ ] Design documentation is complete with screenshots
