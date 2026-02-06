# Game Ideas Brainstorm

This document contains brainstormed ideas for new mini-games to add to the Pet Care Game platform. All ideas are designed to be simple, fun, and suitable for children, while leveraging the existing infrastructure (Game Registry, sprites, gestures, Skia, i18n, coin economy, and responsive design).

---

## Quick Comparison

| Game | Complexity | Reuses Assets | Educational Value | Fun Factor |
|---|---|---|---|---|
| Memory Match | Low | Yes (sprites) | Memory skills | High |
| Pet Runner | Medium | Yes (pet sprites) | Reflexes | High |
| Feed the Pet | Low-Med | Yes (food sprites) | Reflexes | High |
| Whack-a-Mole | Low | Partial | Reflexes | High |
| Bubble Pop | Low-Med | Yes (Skia bubbles) | Pattern recognition | High |
| Simon Says | Low | Minimal | Memory/patterns | High |
| Pet Dress-Up Relay | Low | Yes (wardrobe) | Speed/memory | Medium |
| Color Mixer Lab | Low | Minimal | Color theory | Medium |
| Pet Puzzle | Low | Yes (pet images) | Spatial reasoning | Medium |
| Animal Quiz | Low | Partial | Animal knowledge | Medium |

---

## Game Ideas

### 1. Memory Match

**Category:** `puzzle`
**Complexity:** Low
**Reuses existing assets:** Yes — cat/dog sprites, food items, toy items

A classic card-flipping memory game. Cards are laid out face-down in a grid, and the player flips two at a time trying to find matching pairs. The game ends when all pairs are found.

**Core mechanics:**
- Tap a card to flip it, revealing an image (pet, food item, toy, etc.)
- Tap a second card — if it matches, both stay face-up; if not, both flip back after a short delay
- Track number of moves and time to calculate a score
- Progressive difficulty: start with a 2x2 grid (2 pairs), scale up to 4x4 (8 pairs)

**Scoring:**
- Base points for completing the board
- Bonus for fewer moves and faster completion
- Star rating (1-3 stars) based on performance
- Coin reward tied to star rating

**Why it fits:**
- Directly reuses existing sprite assets (pets, food, toys, clothing) as card faces
- Simple tap interaction — no complex gestures needed
- Proven engaging for young children
- Easy to add themed card sets over time (seasonal, new pet types)

---

### 2. Pet Runner (Endless Runner)

**Category:** `casual`
**Complexity:** Medium
**Reuses existing assets:** Yes — pet sprites, coin icons, background art

The player's pet runs automatically from left to right on an endless scrolling background. Tap to jump, swipe down to duck. Collect coins and dodge obstacles to survive as long as possible.

**Core mechanics:**
- Auto-scrolling side view; speed increases gradually over time
- Tap anywhere to jump (short tap = small jump, long press = higher jump)
- Swipe down to duck under tall obstacles
- Collect floating coins for the shared coin economy
- Obstacles themed around the pet world: puddles, fences, fire hydrants, yarn tangles

**Scoring:**
- Distance traveled (meters) as the primary score
- Coins collected are added to the player's wallet
- Personal best tracking with persistent leaderboard
- Milestones unlock at distance thresholds (100m, 500m, 1000m)

**Why it fits:**
- Uses existing pet sprites with a running/jumping animation state
- Coins integrate directly into the platform economy (buy wardrobe items, food, etc.)
- Highly replayable — kids naturally want to beat their high score
- Background art and obstacle sprites can be built from existing assets

---

### 3. Feed the Pet (Catch Game)

**Category:** `casual`
**Complexity:** Low-Medium
**Reuses existing assets:** Yes — food item sprites, pet sprites

Food items fall from the top of the screen. The player drags a bowl (or the pet itself) left and right along the bottom to catch them. Good food scores points; bad items (rocks, garbage) must be avoided.

**Core mechanics:**
- Food falls from random horizontal positions at varying speeds
- Player drags a bowl/pet horizontally along the bottom of the screen to catch items
- Good items: kibble (+10), fish (+15), treat (+20), milk (+5) — reuses existing food sprites
- Bad items: rocks (-10), garbage (-15), mud (-5) — penalize score and may end a life
- 3 lives system — catching 3 bad items ends the game
- Speed and spawn rate increase every 30 seconds

**Scoring:**
- Points per food item caught (varies by food type)
- Combo multiplier for consecutive good catches
- Coin reward at end based on total score
- Best score saved per user

**Why it fits:**
- Reuses all existing food sprites directly
- Simple drag gesture — uses React Native Gesture Handler already in the project
- Ties thematically to the "Feed" activity in Pet Care
- Short play sessions ideal for children's attention spans

---

### 4. Whack-a-Mole (Garden Pest Edition)

**Category:** `casual`
**Complexity:** Low
**Reuses existing assets:** Partial — can use pet sprites for "friendly" rounds

Pests (bugs, moles, weeds) pop up from holes in a garden grid. Tap them quickly to score points before they disappear. In bonus rounds, friendly animals appear — tapping them loses points, so kids must pay attention.

**Core mechanics:**
- 3x3 grid of "holes" on a garden background
- Pests pop up for a limited time (starts at 1.5s, shrinks to 0.5s at higher levels)
- Tap a pest to "bop" it — satisfying animation + sound effect
- Friendly animals (cats, dogs from existing sprites) appear in bonus rounds — do NOT tap them
- Round-based: each round lasts 30 seconds, difficulty increases per round
- Power-ups: freeze time (all pests stay visible for 3 seconds), double points

**Scoring:**
- +10 per pest bopped
- -15 for tapping a friendly animal
- Speed bonus for fast taps (< 0.3s reaction time)
- Coin reward based on final score

**Why it fits:**
- Extremely simple tap-only interaction
- Kids love the "bop" feedback — pairs well with haptic feedback (expo-haptics already installed)
- Friendly animal mechanic adds a decision-making layer
- Short rounds keep engagement high

---

### 5. Bubble Pop

**Category:** `casual`
**Complexity:** Low-Medium
**Reuses existing assets:** Yes — Skia bubble rendering from BathScene

Colored bubbles float upward from the bottom of the screen. Tap bubbles of the same color in sequence to build chains. Longer chains score more points. The screen slowly fills if bubbles aren't popped in time.

**Core mechanics:**
- Bubbles spawn at the bottom and float upward at varying speeds
- Tap a bubble to pop it — if the next bubble tapped is the same color, chain continues
- Chain multiplier: 1x (single), 2x (2 in a row), 3x (3+), etc.
- Tapping a different color breaks the chain and resets the multiplier
- Special bubbles: rainbow (matches any color), bomb (pops all adjacent bubbles), star (bonus coins)
- Game over when too many bubbles reach the top of the screen

**Scoring:**
- Base 5 points per pop, multiplied by chain length
- Bonus for clearing all bubbles of a color
- Coin reward proportional to final score

**Why it fits:**
- Directly reuses the Skia-based bubble rendering system from the bath minigame
- Colorful and satisfying — great visual appeal for kids
- Teaches color recognition and pattern sequencing
- Gesture system already handles rapid tap sequences

---

### 6. Simon Says (Pattern Memory)

**Category:** `puzzle`
**Complexity:** Low
**Reuses existing assets:** Minimal — uses existing button/card component patterns

A sequence of colored buttons lights up one at a time. The player must repeat the exact sequence by tapping the buttons in the same order. Each successful round adds one more step to the sequence.

**Core mechanics:**
- 4 large colored buttons arranged in a 2x2 grid (red, blue, green, yellow)
- The game plays a sequence: buttons light up one by one with a distinct sound per color
- Player taps buttons to repeat the sequence
- Correct: sequence grows by one step, round advances
- Wrong: game over, final score = number of rounds completed
- Visual + audio feedback for each button press (light up + tone)
- Optional "speed up" mode after round 10 where the demo sequence plays faster

**Scoring:**
- 1 point per round survived
- Bonus points for streaks of 5, 10, 15 rounds
- Coin reward based on rounds completed
- Personal best tracking

**Why it fits:**
- Extremely simple to implement — just 4 buttons + sequence logic
- Classic, proven game mechanic that kids enjoy
- Trains memory and concentration
- Minimal new assets needed — uses existing UI component patterns (buttons, cards, modals)
- Audio cues add engagement (can use expo-av for simple tones)

---

### 7. Pet Dress-Up Relay

**Category:** `casual`
**Complexity:** Low
**Reuses existing assets:** Yes — wardrobe system, clothing sprites, pet renderer

A timed challenge where a target outfit is shown briefly, then the player must dress the pet to match it from a selection of clothing items. Speed and accuracy determine the score.

**Core mechanics:**
- Show a "target look" for 3-5 seconds (pet wearing specific head, eyes, torso, paws items)
- Target disappears and a grid of clothing items appears
- Player drags items onto the pet (or taps to equip) to recreate the look
- 4 slots to fill: head, eyes, torso, paws — must match exactly
- Timer counts down (15-20 seconds per round)
- Rounds get harder: more distractor items, shorter preview time, similar-looking items

**Scoring:**
- Points for each correct slot (25 per slot, 100 max per round)
- Time bonus for finishing early
- Streak bonus for consecutive perfect rounds
- Coin reward at end

**Why it fits:**
- Directly reuses the entire wardrobe/clothing system and PetRenderer component
- Leverages existing clothing sprites with no new art needed
- Reinforces the dress-up gameplay kids already enjoy in Pet Care
- Quick rounds are perfect for mobile play sessions

---

### 8. Color Mixer Lab

**Category:** `puzzle`
**Complexity:** Low
**Reuses existing assets:** Minimal — new color-themed visuals

A target color is displayed, and the player is given 2-3 base paint colors. The player drags paint blobs into a mixing bowl to create the target color. Teaches basic color theory in a playful way.

**Core mechanics:**
- Target color shown at the top of the screen (e.g., orange, purple, green, pink)
- 2-3 draggable paint blobs at the bottom (primary colors: red, blue, yellow + white for tints)
- Drag a color into the central mixing bowl — the bowl color updates in real time
- "Check" button compares the mix to the target
- Accuracy determines stars (exact match = 3 stars, close = 2, far = 1)
- Progressive levels: simple mixes (red + yellow = orange) to complex (tertiary colors, tints)

**Scoring:**
- Stars per level (1-3)
- Unlock new color palettes as levels progress
- Coin reward per level based on star rating
- Level progression map showing completed/locked levels

**Why it fits:**
- Educational value aligns with the platform's kid-friendly mission
- Drag gesture uses existing React Native Gesture Handler
- Simple color blending math (RGB interpolation) is straightforward to implement
- Visually engaging with colorful paint-themed UI

---

### 9. Pet Puzzle (Sliding Tile)

**Category:** `puzzle`
**Complexity:** Low
**Reuses existing assets:** Yes — pet images, sprite art

A picture of a pet is divided into a grid and scrambled. One tile is removed, and the player slides tiles into the empty space to reassemble the original image. Classic 15-puzzle mechanics.

**Core mechanics:**
- Select a pet image (from existing sprites or composed scenes)
- Image is split into a grid: 3x3 (easy), 4x4 (medium), 5x5 (hard)
- One tile removed — tap an adjacent tile to slide it into the empty space
- Goal: reassemble the original image
- Move counter and timer track performance
- "Hint" button briefly shows the completed image (limited uses)
- Preview of the target image always visible in a small thumbnail

**Scoring:**
- Base points for completion
- Bonus for fewer moves (par system like golf)
- Time bonus for fast completion
- Star rating (1-3) based on combined performance
- Coin reward tied to star rating

**Why it fits:**
- Reuses existing pet artwork as puzzle images
- Tap-to-slide is intuitive for children
- Teaches spatial reasoning and problem-solving
- New puzzle images can be added easily as more pet art is created

---

### 10. Animal Quiz

**Category:** `puzzle`
**Complexity:** Low
**Reuses existing assets:** Partial — can use pet sprites, reuses Muito-style multiple choice UI

An animal is shown as a silhouette, a close-up detail, or a sound clip. The player picks the correct animal from 4 multiple-choice options. Educational and multilingual.

**Core mechanics:**
- Each question presents a clue: silhouette, zoomed-in body part, sound, or fun fact
- 4 answer buttons (A, B, C, D) with animal names and small icons
- Correct answer: green flash + celebration animation + points
- Wrong answer: red flash + show correct answer + brief educational fact
- 10 questions per round with increasing difficulty
- Categories: farm animals, wild animals, ocean creatures, pets, insects

**Scoring:**
- 10 points per correct answer
- Speed bonus for answering within 3 seconds
- Streak bonus for consecutive correct answers
- Best score tracking per user
- Coin reward based on total score

**Why it fits:**
- Multiple-choice UI is identical to Muito — can reuse component patterns directly
- Educational content aligns with the children's platform
- Leverages i18n for animal names in English and Portuguese
- Easy to expand with new animal packs and question categories
- Silhouette/detail modes add variety without complex game mechanics
