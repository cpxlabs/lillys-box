# 🧠 Lilly's Box — Game Brainstorm Document

> **Generated for:** Lilly's Box v2 · React Native / Expo SDK 55
> **Categories:** Pet · Casual · Puzzle · Adventure · Emulator · Board
> **Target audience:** Children ages 3–10
> **Design pillars:** Empathy · Routine · Discovery · Playful Learning · Delight

---

## Table of Contents

- [🐾 Pet Category](#-pet-category)
- [🎈 Casual Category](#-casual-category)
- [🧩 Puzzle Category](#-puzzle-category)
- [🗺️ Adventure Category](#️-adventure-category)
- [🕹️ Emulator Category](#️-emulator-category)
- [♟️ Board Category](#️-board-category)
- [📊 Summary Matrix](#-summary-matrix)
- [🔧 Implementation Notes](#-implementation-notes)

---

## 🐾 Pet Category

> **Current games (1):** pet-care
> **Theme:** Direct pet interaction, nurturing, daily care routines
> **Goal:** Expand the emotional core of Lilly's Box with more ways to bond with your pet

---

### 1. Pet Diary 📓

| Field | Details |
|-------|---------|
| **ID** | `pet-diary` |
| **Emoji** | 📓 |
| **Description** | Keep a daily scrapbook of your pet's life! Stamp stickers for meals, baths, naps, and play sessions. Watch the pages fill up over the week with colorful memories. |
| **Why it fits** | Reinforces the care routine loop that is the emotional heart of pet-care. Gives long-term meaning to daily actions by making them visible as a journal. |
| **Target age** | 4–8 |
| **Main mechanic** | Tap to place stickers and emoji stamps on a journal page; auto-populates from real pet-care actions |
| **Reusable assets** | Pet sprites, existing stat icons (hunger/hygiene/energy/happiness), sticker-style decorations |
| **Complexity** | Medium — needs calendar state + AsyncStorage persistence per day |

---

### 2. Pet Grooming Salon ✂️

| Field | Details |
|-------|---------|
| **ID** | `pet-grooming` |
| **Emoji** | ✂️ |
| **Description** | Give your pet a full makeover! Brush tangled fur, trim nails, clean ears, and add bows or bandanas. Your pet wiggles and purrs with every gentle touch. |
| **Why it fits** | Extends the bath/wardrobe experience into a richer sensory grooming session. Teaches gentle handling and care steps. |
| **Target age** | 3–7 |
| **Main mechanic** | Drag grooming tools (brush, scissors, cotton swab) over highlighted pet body zones; satisfying particle effects on completion |
| **Reusable assets** | Pet sprites (cat/dog), clothing items from `clothingItems.ts`, bath scene color palette (#e3f2fd) |
| **Complexity** | Medium — gesture zones + tool switching + before/after animation |

---

### 3. Pet Doctor 🩺

| Field | Details |
|-------|---------|
| **ID** | `pet-doctor` |
| **Emoji** | 🩺 |
| **Description** | Your pet has the sniffles! Check their temperature, listen to their heartbeat with a stethoscope, and give them medicine with a spoon. Nurse them back to a happy, tail-wagging recovery! |
| **Why it fits** | Directly extends the existing vet visit action into a full mini-game. Normalizes doctor visits and reduces medical anxiety for kids. |
| **Target age** | 3–7 |
| **Main mechanic** | Tap medical tools in sequence (thermometer → stethoscope → medicine → bandage); each tool triggers a mini-interaction with visual/audio feedback |
| **Reusable assets** | Pet sprites, vet scene colors (#E8F5E9), health stat system from `gameBalance.ts` |
| **Complexity** | Low — sequential tool interactions, simple state machine |

---

### 4. Pet Lullaby 🌙

| Field | Details |
|-------|---------|
| **ID** | `pet-lullaby` |
| **Emoji** | 🌙 |
| **Description** | Tuck your pet into bed! Dim the lights, choose a soft blanket, and hum a lullaby by tapping musical notes that float across the screen. Watch your pet's eyes slowly close as the stars come out. |
| **Why it fits** | Extends the sleep action into a calming bedtime ritual. Perfect wind-down game that helps kids transition to their own bedtime. |
| **Target age** | 3–6 |
| **Main mechanic** | Tap floating music notes in rhythm to play a lullaby; drag blanket onto pet; pet's sleep animation progresses with each correct note |
| **Reusable assets** | Pet sprites, sleep scene palette (#1a1a2e), `expo-av` audio system, Reanimated spring configs |
| **Complexity** | Medium — rhythm timing + ambient audio layering |

---

### 5. Pet Playground 🛝

| Field | Details |
|-------|---------|
| **ID** | `pet-playground` |
| **Emoji** | 🛝 |
| **Description** | Build a dream playground for your pet! Place slides, seesaws, tunnels, and ball pits, then watch your pet explore each toy with adorable animations. Collect joy stars as your pet plays! |
| **Why it fits** | Extends the play activity into a creative sandbox. Encourages spatial thinking and gives pets a persistent "home" that kids customize. |
| **Target age** | 4–8 |
| **Main mechanic** | Drag-and-drop playground equipment onto a grid; pet auto-navigates and interacts with placed items; earn coins/stars based on happiness |
| **Reusable assets** | Pet sprites, play scene palette (#e1f5fe), coin system from `gameBalance.ts`, gesture handler |
| **Complexity** | High — grid placement system + pet pathfinding + multiple item interactions |

---

## 🎈 Casual Category

> **Current games (19):** muito, color-tap, dress-up-relay, feed-the-pet, whack-a-mole, catch-the-ball, bubble-pop, pet-dance-party, treasure-dig, balloon-float, paint-splash, snack-stack, lightning-tap, pet-chef, music-maker, garden-grow, photo-studio, hide-and-seek, star-catcher
> **Theme:** Quick-play, reflex, creative expression, low-commitment fun
> **Goal:** Add fresh quick-play experiences that feel different from the existing roster

---

### 1. Pillow Fight Party 🛏️

| Field | Details |
|-------|---------|
| **ID** | `pillow-fight` |
| **Emoji** | 🛏️ |
| **Description** | Tap fluffy pillows as they fly across the screen to bonk friendly pets! Feathers burst out in every direction. Chain hits for combo multipliers and rack up the silliest score! |
| **Why it fits** | A whack-a-mole variant with a cozy twist — pillows instead of mallets, feathers instead of impacts. Non-violent, giggly, and fast-paced. |
| **Target age** | 4–8 |
| **Main mechanic** | Tap-to-bonk flying pillow targets; chain combos; avoid bonking sleeping pets (penalty) |
| **Reusable assets** | Whack-a-mole tap mechanics, particle system from bubble-pop/paint-splash, combo system from lightning-tap |
| **Complexity** | Low — reskin of whack-a-mole with new sprites and feather particles |

---

### 2. Soap Bubble Shapes 🫧

| Field | Details |
|-------|---------|
| **ID** | `soap-bubble-shapes` |
| **Emoji** | 🫧 |
| **Description** | Blow magical soap bubbles by swiping up, then pop them when they match the target shape! Hearts, stars, moons, and pet silhouettes float dreamily across a sunset sky. |
| **Why it fits** | Combines the bubble-pop mechanic with shape recognition. The swipe-to-create + tap-to-pop loop is deeply satisfying and unique from existing games. |
| **Target age** | 3–6 |
| **Main mechanic** | Swipe up to launch bubbles; bubbles morph into random shapes; tap only the matching shape before they float away |
| **Reusable assets** | Bubble-pop physics, shape assets from shape-sorter, Reanimated spring animations |
| **Complexity** | Low — bubble-pop variant with shape matching overlay |

---

### 3. Pet Parade 🎪

| Field | Details |
|-------|---------|
| **ID** | `pet-parade` |
| **Emoji** | 🎪 |
| **Description** | Lead a parade of adorable pets down a colorful street! Tap to make them wave, spin, or jump in sync. The crowd cheers louder the better your timing! |
| **Why it fits** | A rhythm-lite game that feels celebratory. Combines tap timing from color-tap with the joyful energy of pet-dance-party in a fresh linear format. |
| **Target age** | 4–7 |
| **Main mechanic** | Pets march left-to-right; tap action icons (wave/spin/jump) at the right moment when pets pass landmark zones; score based on timing |
| **Reusable assets** | Pet sprites (all colors/types), pet-dance-party animation system, crowd cheering via `expo-av` |
| **Complexity** | Medium — scrolling scene + timed action zones + animation sequencing |

---

### 4. Splashy Bath Time 🛁

| Field | Details |
|-------|---------|
| **ID** | `splashy-bath` |
| **Emoji** | 🛁 |
| **Description** | Fill the tub, add colorful bath bombs, and scrub rubber duckies clean! Tilt your device to make waves, and tap bubbles before they overflow. The messier, the more fun! |
| **Why it fits** | Extends the bath care theme into a playful casual game. Water physics and tilt controls add a unique tactile dimension not present in existing casual games. |
| **Target age** | 3–6 |
| **Main mechanic** | Tap bath bombs to color the water; tilt device to make waves (accelerometer); tap overflowing bubbles to keep the tub from flooding |
| **Reusable assets** | Bath scene palette (#e3f2fd), bubble-pop mechanics, pet sprites |
| **Complexity** | Medium — accelerometer input + simple water simulation + bubble management |

---

### 5. Treat Toss 🦴

| Field | Details |
|-------|---------|
| **ID** | `treat-toss` |
| **Emoji** | 🦴 |
| **Description** | Flick treats into your pet's mouth! Aim for the bullseye and watch them do a happy dance. Different treats fly differently — bones arc high, kibble is fast, fish wiggles mid-air! |
| **Why it fits** | A simple flick-physics game in the casual family. Different treat behaviors add variety and replayability. The happy pet reaction is pure reward. |
| **Target age** | 4–8 |
| **Main mechanic** | Swipe/flick to launch treats at a moving pet target; treats have different trajectories; score based on accuracy |
| **Reusable assets** | Food items from `foodItems.ts`, pet sprites, feed scene palette (#fff8e1), Reanimated trajectory animations |
| **Complexity** | Low — flick gesture + parabolic trajectory + target collision |

---

## 🧩 Puzzle Category

> **Current games (10):** memory-match, simon-says, color-mixer, sliding-puzzle, path-finder, shape-sorter, mirror-match, word-bubbles, jigsaw-pets, connect-dots
> **Theme:** Logic, memory, pattern recognition, spatial reasoning
> **Goal:** Introduce new cognitive challenges that complement the existing puzzle roster

---

### 1. Pet Tangram 🔷

| Field | Details |
|-------|---------|
| **ID** | `pet-tangram` |
| **Emoji** | 🔷 |
| **Description** | Drag and rotate colorful shapes to build pet silhouettes! Start with simple 3-piece cats and work up to complex 7-piece dogs, bunnies, and birds. Each completed pet comes alive with a happy wiggle! |
| **Why it fits** | Classic tangram puzzle adapted with pet themes. Complements shape-sorter (categorization) with shape-composition. The "pet comes alive" reward is uniquely Lilly's Box. |
| **Target age** | 4–8 |
| **Main mechanic** | Drag geometric pieces onto a silhouette outline; rotate with two-finger twist; snap-to-fit with haptic feedback |
| **Reusable assets** | Shape assets from shape-sorter, pet silhouettes derived from pet sprites, Skia for precise shape rendering |
| **Complexity** | Medium — rotation gestures + snap-to-fit collision detection + progressive difficulty |

---

### 2. Spot the Difference 🔍

| Field | Details |
|-------|---------|
| **ID** | `spot-difference` |
| **Emoji** | 🔍 |
| **Description** | Two pet scenes side by side — can you find what's different? Maybe a missing bow, an extra fish, or a different colored ball. Tap the differences before time runs out! |
| **Why it fits** | A beloved kids' puzzle format not yet in the roster. Uses pet scene artwork for a warm, familiar setting. Trains visual attention and focus. |
| **Target age** | 4–9 |
| **Main mechanic** | Compare two nearly identical images; tap on differences; timer adds gentle pressure; hint system for younger players |
| **Reusable assets** | Pet sprites + clothing items + food items for composing scenes, existing timer from `useGameState` |
| **Complexity** | Medium — scene generation with controlled differences + tap-zone detection |

---

### 3. Counting Kennel 🔢

| Field | Details |
|-------|---------|
| **ID** | `counting-kennel` |
| **Emoji** | 🔢 |
| **Description** | How many kittens are hiding in the kennel? Pets peek out and hide — count them carefully! Tap the right number to let them all out for a group cuddle. Levels go from 1-5 up to tricky teens! |
| **Why it fits** | Early math meets pet charm. Fills a gap — no counting/number game exists yet. Peek-a-boo animation makes counting feel playful rather than academic. |
| **Target age** | 3–6 |
| **Main mechanic** | Watch pets appear and disappear from a kennel; tap the correct count from number buttons; progressive difficulty (more pets, faster peeks) |
| **Reusable assets** | Pet sprites (all types/colors), number UI from connect-dots, hide-and-seek animation patterns |
| **Complexity** | Low — animation sequencing + simple button selection + level progression |

---

### 4. Pattern Paws 🐾

| Field | Details |
|-------|---------|
| **ID** | `pattern-paws` |
| **Emoji** | 🐾 |
| **Description** | Follow the trail of colorful paw prints! Red, blue, red, blue... what comes next? Drag the right color paw to complete the pattern. Patterns get longer and wilder as you level up! |
| **Why it fits** | Pattern recognition is a core early-learning skill not deeply covered by existing puzzles. Paw prints are a natural pet-world visual that makes abstract patterns tangible. |
| **Target age** | 3–7 |
| **Main mechanic** | Observe a sequence of colored/shaped paw prints; drag-and-drop the next paw in the pattern; patterns grow in length and complexity (color → shape → size → multi-attribute) |
| **Reusable assets** | Color palette from color-tap/color-mixer, drag-and-drop from shape-sorter, Reanimated for trail animation |
| **Complexity** | Low — sequence generation + drag-and-drop + progressive difficulty config |

---

### 5. Maze Pups 🌀

| Field | Details |
|-------|---------|
| **ID** | `maze-pups` |
| **Emoji** | 🌀 |
| **Description** | Guide a lost puppy through a garden maze to find its family! Swipe to move through hedges, collect treats along the way, and avoid puddles. Each maze is randomly generated for infinite replay! |
| **Why it fits** | Complements path-finder with a more exploratory, swipe-controlled maze experience. The "reunite with family" goal is emotionally resonant for young children. |
| **Target age** | 4–8 |
| **Main mechanic** | Swipe in four directions to move pet through a grid-based maze; collect bonus items; find the exit; procedural maze generation ensures replay value |
| **Reusable assets** | Pet sprites, path-finder grid system, garden-grow plant assets for maze walls, treat items from `foodItems.ts` |
| **Complexity** | Medium — procedural maze generation + swipe movement + collectible system |

---

## 🗺️ Adventure Category

> **Current games (4):** pet-runner, pet-explorer, pet-taxi, weather-wizard
> **Theme:** Exploration, movement, world-discovery, journey-based gameplay
> **Goal:** Expand the adventure roster with new travel/exploration concepts

---

### 1. Pet Postman 📬

| Field | Details |
|-------|---------|
| **ID** | `pet-postman` |
| **Emoji** | 📬 |
| **Description** | Deliver letters to animal friends around the neighborhood! Read the address (a picture of the house), navigate your pet through streets, and drop off packages. Every delivery earns a thank-you card! |
| **Why it fits** | A delivery/routing adventure that combines gentle navigation with the joy of helping others. Complements pet-taxi's transport theme with a walking/cycling twist. |
| **Target age** | 4–8 |
| **Main mechanic** | Tap waypoints on a simple map to navigate; match delivery to the correct house by visual cues (color, animal icon); time bonus for efficient routes |
| **Reusable assets** | Pet sprites, pet-taxi navigation patterns, map tile system, coin reward from `gameBalance.ts` |
| **Complexity** | Medium — waypoint navigation + delivery matching + simple map layout |

---

### 2. Pet Camper 🏕️

| Field | Details |
|-------|---------|
| **ID** | `pet-camper` |
| **Emoji** | 🏕️ |
| **Description** | Take your pet on a camping trip! Pitch a tent, build a campfire, roast marshmallows, and stargaze. Discover forest animals hiding in the bushes and collect nature stickers for your campbook! |
| **Why it fits** | A multi-scene adventure that introduces nature exploration. Each campsite activity is a mini-interaction — it's a journey of cozy moments, not a single mechanic. |
| **Target age** | 4–8 |
| **Main mechanic** | Progress through campsite scenes (arrive → set up → cook → explore → stargaze); each scene has 2–3 tap/drag interactions; collect discovery stickers |
| **Reusable assets** | Pet sprites, night sky from sleep palette (#1a1a2e), food items for marshmallows, garden-grow plant assets |
| **Complexity** | Medium — multi-scene flow + collectible tracking + ambient audio |

---

### 3. Underwater Explorer 🤿

| Field | Details |
|-------|---------|
| **ID** | `underwater-explorer` |
| **Emoji** | 🤿 |
| **Description** | Dive into a coral reef with your pet in a tiny submarine! Tap to swim deeper, discover colorful fish, and collect shiny pearls. Watch out for friendly jellyfish that bounce you back up! |
| **Why it fits** | An entirely new biome for Lilly's Box — underwater! The vertical scrolling exploration is distinct from pet-runner's horizontal format. Discovery-focused, not skill-gated. |
| **Target age** | 4–8 |
| **Main mechanic** | Tap to descend, release to float up (flappy-bird-style buoyancy); collect pearls and photograph sea creatures; gentle obstacles (jellyfish, currents) push you but never "game over" |
| **Reusable assets** | Bubble-pop bubble physics, balloon-float float mechanics (inverted), catch-the-ball collection system |
| **Complexity** | Medium — vertical scrolling + buoyancy physics + collectible catalog |

---

### 4. Sky Balloon Ride 🎈

| Field | Details |
|-------|---------|
| **ID** | `sky-balloon-ride` |
| **Emoji** | 🎈 |
| **Description** | Float across the sky in a hot air balloon with your pet! Tap to rise, release to descend. Fly over mountains, through rainbows, and past friendly birds. Collect cloud shapes that match the silhouette cards! |
| **Why it fits** | A serene, slow-paced adventure perfect for younger kids. Combines the altitude mechanic of balloon-float with a journey narrative. The matching element adds a gentle cognitive layer. |
| **Target age** | 3–7 |
| **Main mechanic** | Tap-and-hold to ascend, release to descend; auto-scrolling landscape; collect cloud shapes that match target cards shown at the top; avoid rain clouds |
| **Reusable assets** | Balloon-float mechanics, star-catcher collection system, weather-wizard weather assets, shape-sorter shape matching |
| **Complexity** | Low — balloon-float variant with horizontal scrolling + shape collection |

---

### 5. Pet Train Conductor 🚂

| Field | Details |
|-------|---------|
| **ID** | `pet-train` |
| **Emoji** | 🚂 |
| **Description** | All aboard the Pet Express! Drive a toy train through the countryside, stop at stations to pick up animal passengers, and deliver them to the right destinations. Toot the horn at crossings! |
| **Why it fits** | Trains are universally beloved by young children. The pick-up/drop-off loop echoes pet-taxi but with a charming rail twist. The horn-tooting interaction is pure delight. |
| **Target age** | 3–7 |
| **Main mechanic** | Tap to accelerate/brake the train; stop at stations (timing-based); match passengers to destinations by color/icon; tap horn button at crossings for bonus |
| **Reusable assets** | Pet sprites as passengers, pet-taxi pickup/dropoff logic, coin system, `expo-av` for train sounds |
| **Complexity** | Medium — speed control + station timing + passenger matching |

---

## 🕹️ Emulator Category

> **Current games (1):** gba-emulator (Game Boy Advance)
> **Theme:** Retro game emulator shells — user imports their own ROMs
> **Goal:** Expand the retro gaming library with additional console emulator shells
> **Legal note:** All emulators are shell-only; users supply their own legally obtained ROM files. No ROMs or BIOS files are bundled.

---

### 1. SNES Emulator 🎮

| Field | Details |
|-------|---------|
| **ID** | `snes-emulator` |
| **Emoji** | 🎮 |
| **Description** | Play classic 16-bit Super Nintendo games! Import your SNES ROM collection into a kid-friendly library with touch controls for D-pad, A/B/X/Y, and shoulder buttons. Full save-state support! |
| **Why it fits** | The SNES has the richest library of family-friendly games of any retro console. Natural next step after GBA — many GBA games are SNES ports, so the audience overlap is perfect. |
| **Target age** | 6–10 |
| **Main mechanic** | Emulator shell with ROM import, touch D-pad + 6-button layout, save states (3 manual + 1 auto), library management |
| **Emulator core** | Snes9x (open source, permissive license) or bsnes-hd (accuracy-focused, GPLv3) via WebAssembly |
| **Touch layout** | D-pad (left) · A/B/X/Y diamond (right) · L/R shoulders (top corners) · Start/Select (bottom center) |
| **Reusable assets** | GBA emulator shell architecture (context, navigator, home/game screens), ROM import flow, save state system, library UI |
| **Complexity** | Medium — mirrors GBA emulator architecture; SNES WASM cores are mature and well-documented |

---

### 2. NES Emulator 👾

| Field | Details |
|-------|---------|
| **ID** | `nes-emulator` |
| **Emoji** | 👾 |
| **Description** | Step back to the 8-bit era! Import NES ROMs and play with a simple two-button touch controller. The perfect starter console — fewer buttons means easier controls for little hands! |
| **Why it fits** | NES has the simplest control scheme (D-pad + A/B + Start/Select) making it the most kid-accessible retro console. Huge family-friendly library. Smallest emulator footprint. |
| **Target age** | 5–10 |
| **Main mechanic** | Emulator shell with ROM import, simplified touch D-pad + 2-button layout, save states, library management |
| **Emulator core** | JSNES (JavaScript, MIT license) or Nestopia UE (GPLv2) via WebAssembly |
| **Touch layout** | D-pad (left) · A/B buttons (right) · Start/Select (bottom center) — identical to GBA but simpler |
| **Reusable assets** | Full GBA emulator architecture reuse — simpler controls actually reduce implementation scope |
| **Complexity** | Low — simplest retro console to emulate; mature JS-native cores available; fewer buttons than GBA |

---

### 3. Game Boy / Game Boy Color Emulator 🟩

| Field | Details |
|-------|---------|
| **ID** | `gbc-emulator` |
| **Emoji** | 🟩 |
| **Description** | The original handheld experience! Play Game Boy and Game Boy Color games with an authentic green-tinted display mode or full color. Same cozy D-pad + A/B controls as the GBA with a retro twist! |
| **Why it fits** | GB/GBC is the natural sibling to the existing GBA emulator. Many GBA emulators already support GB/GBC ROMs — this could share the mGBA core. Simple controls perfect for kids. |
| **Target age** | 5–10 |
| **Main mechanic** | Emulator shell with ROM import, touch D-pad + A/B layout, optional green CRT filter for nostalgia, save states, library management |
| **Emulator core** | mGBA (already selected for GBA — supports GB/GBC natively!) or SameBoy (MIT license) via WebAssembly |
| **Touch layout** | Identical to GBA (D-pad + A/B + Start/Select) — potentially shared component |
| **Reusable assets** | Shares 90%+ with GBA emulator — same core (mGBA), same controls, same save system. Only needs ROM type detection and optional display filter |
| **Complexity** | Low — if using mGBA, GB/GBC support is essentially a config flag on the existing GBA emulator |

---

### 4. Sega Genesis / Mega Drive Emulator 🔵

| Field | Details |
|-------|---------|
| **ID** | `genesis-emulator` |
| **Emoji** | 🔵 |
| **Description** | Blast into Sega's 16-bit world! Import Genesis/Mega Drive ROMs and play with a 3-button or 6-button touch layout. Fast-paced action with vibrant colors and iconic soundtracks! |
| **Why it fits** | Diversifies the emulator category beyond Nintendo. The Genesis has a distinct visual and audio personality that feels fresh. Strong family-friendly library (platformers, puzzlers). |
| **Target age** | 6–10 |
| **Main mechanic** | Emulator shell with ROM import, configurable 3-button or 6-button touch layout, save states, library management |
| **Emulator core** | Genesis Plus GX (open source, widely used, excellent accuracy) via WebAssembly |
| **Touch layout** | D-pad (left) · A/B/C buttons (right, 3-button default) · optional X/Y/Z (6-button mode) · Start (center) |
| **Reusable assets** | GBA emulator shell architecture, ROM import flow, save state system; button layout component needs expansion for 3/6-button toggle |
| **Complexity** | Medium — new emulator core integration; button layout is more complex than GBA but architecture is proven |

---

### 5. Atari 2600 Emulator 🕹️

| Field | Details |
|-------|---------|
| **ID** | `atari-emulator` |
| **Emoji** | 🕹️ |
| **Description** | Go all the way back to where it began! Play Atari 2600 classics with the simplest controls ever — just a joystick and one button. Chunky pixel art and bleepy sounds make every game a retro adventure! |
| **Why it fits** | The absolute simplest emulator possible — one joystick + one fire button. Perfect for the youngest retro-curious kids. Tiny ROM sizes mean instant loading. Educational "history of games" angle. |
| **Target age** | 4–10 |
| **Main mechanic** | Emulator shell with ROM import, virtual joystick + single fire button, library management, optional CRT scanline filter |
| **Emulator core** | Javatari (JavaScript, AGPLv3) or Stella.js (GPLv2) — both browser-native, no WASM needed |
| **Touch layout** | Virtual joystick (left) · Single fire button (right) · Game Select/Reset (top) — the simplest possible layout |
| **Reusable assets** | GBA emulator shell architecture; dramatically simpler controls; ROM import flow reusable as-is |
| **Complexity** | Low — smallest, simplest retro console; JS-native emulators exist; minimal control surface |

---

## ♟️ Board Category

> **Current games (1):** kids-chess (with 5 pet-themed AI difficulty levels)
> **Theme:** Classic board games adapted for children with pet personalities
> **Goal:** Build a cozy board game parlor with familiar games made magical by pet characters

---

### 1. Kids Checkers 🔴

| Field | Details |
|-------|---------|
| **ID** | `kids-checkers` |
| **Emoji** | 🔴 |
| **Description** | Jump your way to victory! Classic checkers with pet-themed pieces — kittens vs. puppies. Get kinged and your piece gets a tiny crown! Five friendly AI opponents from Biscuit the Puppy to Luna the Owl. |
| **Why it fits** | The natural companion to kids-chess — simpler rules, same board, same difficulty system. Checkers is the #1 "my first strategy game" for young children worldwide. |
| **Target age** | 4–8 |
| **Main mechanic** | Tap piece → tap destination; forced jumps highlighted; king pieces get crown emoji; same 5-tier pet AI difficulty as chess |
| **AI difficulty** | Mirrors chess: Puppy (random moves) → Owl (minimax depth 6); checkers AI is much simpler to implement than chess AI |
| **Reusable assets** | Kids-chess HTML5 game architecture, board rendering, difficulty config with pet personalities, `window.RNBridge` communication, score system |
| **Complexity** | Low — simpler rules than chess; can reuse 80%+ of kids-chess codebase (board, AI framework, UI, bridge) |

---

### 2. Tic-Tac-Toe Pets ⭕

| Field | Details |
|-------|---------|
| **ID** | `tic-tac-toe` |
| **Emoji** | ⭕ |
| **Description** | The world's simplest strategy game, now with paw prints and fish bones! Play against pet AI friends or pass-and-play with a sibling. Win three in a row and your pet does a celebration dance! |
| **Why it fits** | The absolute simplest board game — perfect entry point for the youngest players. Can introduce the concept of taking turns and thinking ahead in the most accessible way possible. |
| **Target age** | 3–6 |
| **Main mechanic** | Tap empty cell to place your mark (paw print vs. fish bone); AI opponent or local 2-player; 3-in-a-row detection; pet celebration animation on win |
| **Game modes** | vs. AI (3 difficulties) · vs. Friend (pass-and-play) · possibly vs. online (via existing socket.io) |
| **Reusable assets** | Kids-chess HTML5 architecture, pet sprites for celebrations, `socket.io-client` for multiplayer, simple grid rendering |
| **Complexity** | Low — trivial game logic; smallest possible board game; great first board game to prototype |

---

### 3. Kids Ludo 🎲

| Field | Details |
|-------|---------|
| **ID** | `kids-ludo` |
| **Emoji** | 🎲 |
| **Description** | Roll the dice and race your pet team home! Four colorful pet teams dash around the board — but watch out for bumps! A gentle, luck-based race that teaches counting, turn-taking, and good sportsmanship. |
| **Why it fits** | Ludo (Parcheesi) is one of the most universally known family board games. It's primarily luck-based, so young kids can win against anyone. The four-player format supports family play. |
| **Target age** | 4–8 |
| **Main mechanic** | Tap to roll dice; tap piece to move; automatic path calculation; bump opponents back to start; first to get all 4 pieces home wins |
| **Game modes** | 1–4 players with AI filling empty seats; AI personalities match pet difficulty tiers |
| **Reusable assets** | Kids-chess difficulty tiers, pet sprites (4 colors = 4 teams), dice rolling animation via Reanimated, `socket.io-client` for multiplayer |
| **Complexity** | Medium — board path logic + 4-player turn management + dice animation + AI decision-making |

---

### 4. Memory Board 🃏

| Field | Details |
|-------|---------|
| **ID** | `memory-board` |
| **Emoji** | 🃏 |
| **Description** | A tabletop twist on the classic memory game! Flip pet cards on a wooden board — match pairs of cats, dogs, bunnies, and birds. Play solo for speed records or take turns with a friend to see who finds more pairs! |
| **Why it fits** | While memory-match exists in the puzzle category, this board-game version adds turn-taking, scoring, and a physical "table" aesthetic. The 2-player competitive mode makes it a true board game. |
| **Target age** | 3–7 |
| **Main mechanic** | Tap to flip cards; match pairs; turn-based scoring in 2-player mode; increasingly large grids (2×2 → 6×6) |
| **Game modes** | Solo (beat the clock) · vs. Friend (pass-and-play turns) · vs. AI |
| **Reusable assets** | Memory-match card flip animation + matching logic, kids-chess turn system, pet sprites for card faces |
| **Complexity** | Low — memory-match variant with added turn-based scoring layer |

---

### 5. Snakes & Ladders Pets 🐍

| Field | Details |
|-------|---------|
| **ID** | `snakes-ladders` |
| **Emoji** | 🪜 |
| **Description** | Climb the ladders and slide down the friendly snakes! Roll the dice to race your pet from square 1 to 100. Every ladder has a happy surprise and every snake gives a silly giggle. Pure luck, pure joy! |
| **Why it fits** | Zero strategy required — 100% luck-based, so even a 3-year-old can win. Teaches number recognition (1–100), counting, and the emotional resilience of "oops, slide back down!" with warmth. |
| **Target age** | 3–7 |
| **Main mechanic** | Tap to roll dice; pet auto-moves along numbered board; ladders = climb up with cheering; snakes = slide down with giggles; first to 100 wins |
| **Game modes** | 2–4 players (human or AI); pass-and-play or online via socket.io |
| **Reusable assets** | Kids-chess board rendering, kids-ludo dice system (if built), pet sprites, Reanimated for climb/slide animations |
| **Complexity** | Low — no strategy logic needed; board is static; only dice + movement + snake/ladder lookup table |

---

## 📊 Summary Matrix

| Game | Category | ID | Emoji | Age | Complexity | Reuse Potential |
|------|----------|----|-------|-----|------------|-----------------|
| Pet Diary | Pet | `pet-diary` | 📓 | 4–8 | Medium | Stat icons, pet sprites |
| Pet Grooming Salon | Pet | `pet-grooming` | ✂️ | 3–7 | Medium | Bath scene, clothing items |
| Pet Doctor | Pet | `pet-doctor` | 🩺 | 3–7 | Low | Vet scene, health stats |
| Pet Lullaby | Pet | `pet-lullaby` | 🌙 | 3–6 | Medium | Sleep scene, audio system |
| Pet Playground | Pet | `pet-playground` | 🛝 | 4–8 | High | Play scene, coin system |
| Pillow Fight Party | Casual | `pillow-fight` | 🛏️ | 4–8 | Low | Whack-a-mole mechanics |
| Soap Bubble Shapes | Casual | `soap-bubble-shapes` | 🫧 | 3–6 | Low | Bubble-pop + shape-sorter |
| Pet Parade | Casual | `pet-parade` | 🎪 | 4–7 | Medium | Dance party animations |
| Splashy Bath Time | Casual | `splashy-bath` | 🛁 | 3–6 | Medium | Bath scene, bubble-pop |
| Treat Toss | Casual | `treat-toss` | 🦴 | 4–8 | Low | Food items, pet sprites |
| Pet Tangram | Puzzle | `pet-tangram` | 🔷 | 4–8 | Medium | Shape-sorter, Skia |
| Spot the Difference | Puzzle | `spot-difference` | 🔍 | 4–9 | Medium | Pet/clothing/food assets |
| Counting Kennel | Puzzle | `counting-kennel` | 🔢 | 3–6 | Low | Pet sprites, hide-and-seek |
| Pattern Paws | Puzzle | `pattern-paws` | 🐾 | 3–7 | Low | Color-tap, shape-sorter |
| Maze Pups | Puzzle | `maze-pups` | 🌀 | 4–8 | Medium | Path-finder, garden-grow |
| Pet Postman | Adventure | `pet-postman` | 📬 | 4–8 | Medium | Pet-taxi navigation |
| Pet Camper | Adventure | `pet-camper` | 🏕️ | 4–8 | Medium | Multi-scene, garden assets |
| Underwater Explorer | Adventure | `underwater-explorer` | 🤿 | 4–8 | Medium | Bubble/balloon physics |
| Sky Balloon Ride | Adventure | `sky-balloon-ride` | 🎈 | 3–7 | Low | Balloon-float, weather |
| Pet Train Conductor | Adventure | `pet-train` | 🚂 | 3–7 | Medium | Pet-taxi logic, audio |
| SNES Emulator | Emulator | `snes-emulator` | 🎮 | 6–10 | Medium | GBA emulator architecture |
| NES Emulator | Emulator | `nes-emulator` | 👾 | 5–10 | Low | GBA emulator architecture |
| GB/GBC Emulator | Emulator | `gbc-emulator` | 🟩 | 5–10 | Low | mGBA core (shared!) |
| Genesis Emulator | Emulator | `genesis-emulator` | 🔵 | 6–10 | Medium | GBA emulator architecture |
| Atari 2600 Emulator | Emulator | `atari-emulator` | 🕹️ | 4–10 | Low | GBA emulator architecture |
| Kids Checkers | Board | `kids-checkers` | 🔴 | 4–8 | Low | Kids-chess (80% reuse) |
| Tic-Tac-Toe Pets | Board | `tic-tac-toe` | ⭕ | 3–6 | Low | Kids-chess architecture |
| Kids Ludo | Board | `kids-ludo` | 🎲 | 4–8 | Medium | Pet sprites, multiplayer |
| Memory Board | Board | `memory-board` | 🃏 | 3–7 | Low | Memory-match + turns |
| Snakes & Ladders Pets | Board | `snakes-ladders` | 🪜 | 3–7 | Low | Board rendering, dice |

---

## 🔧 Implementation Notes

### Priority Recommendations

**Quick wins (Low complexity, high reuse):**
1. `tic-tac-toe` — Simplest possible board game; great for validating the board category UX
2. `kids-checkers` — 80% code reuse from kids-chess
3. `nes-emulator` — Simplest retro console; JS-native cores available
4. `gbc-emulator` — Could be a config flag on the existing GBA emulator (mGBA supports GB/GBC)
5. `pet-doctor` — Low complexity pet game that extends the vet visit
6. `counting-kennel` — Simple puzzle, fills a math/counting gap
7. `snakes-ladders` — Zero strategy AI needed; pure luck-based fun

**High impact (Medium complexity, strong brand value):**
1. `pet-diary` — Deepens the emotional bond; gives meaning to daily care actions
2. `pet-tangram` — Unique puzzle mechanic with strong "pet comes alive" reward
3. `pet-camper` — Rich adventure with multiple cozy scenes
4. `kids-ludo` — First 4-player board game; great for family play
5. `snes-emulator` — Richest retro game library; most-requested console

### Shared Architecture Patterns

All new games should follow the established pattern:

```typescript
// 1. Context: {GameName}Context.tsx
// 2. Navigator: {GameName}Navigator.tsx  
// 3. Home Screen: {GameName}HomeScreen.tsx
// 4. Game Screen: {GameName}GameScreen.tsx
// 5. Registration in gameRegistrations.ts

// Use the game generator for scaffolding:
node scripts/generate-game.js \
  --name="Kids Checkers" \
  --id="kids-checkers" \
  --emoji="🔴" \
  --category="board"
```

### Emulator Architecture Reuse

All emulator shells should share:
- `EmulatorCanvas.tsx` — WebView-based rendering surface
- `EmulatorControls.tsx` — Configurable touch control overlay (pass button config as props)
- `RomLibrary.tsx` — ROM import + library management (shared across all emulators)
- `SaveStateTray.tsx` — Save/load state UI (3 manual + 1 auto slot)

**Proposed shared component:**
```typescript
// components/emulator/EmulatorShell.tsx
interface EmulatorShellProps {
  coreUrl: string;           // WASM core URL
  controlLayout: ControlConfig; // Button arrangement
  displayConfig: DisplayConfig; // Aspect ratio, filters
  romExtensions: string[];   // ['.gba'], ['.nes'], ['.smc', '.sfc']
  storagePrefix: string;     // '@gba_', '@nes_', '@snes_'
}
```

### Board Game Architecture Reuse

All board games should share:
- HTML5 + Babel embedded game pattern (proven by kids-chess)
- `window.RNBridge` communication bridge
- Pet-themed AI difficulty tiers (Puppy → Owl)
- Score reporting via `sendScore()` / `gameOver()`
- Pass-and-play 2-player support via shared device

---

## 🎯 Category Growth Targets

| Category | Current | Proposed | Total | Notes |
|----------|---------|----------|-------|-------|
| Pet | 1 | +5 | 6 | Deepen the emotional core |
| Casual | 19 | +5 | 24 | Fresh quick-play variety |
| Puzzle | 10 | +5 | 15 | New cognitive challenges |
| Adventure | 4 | +5 | 9 | More exploration variety |
| Emulator | 1 | +5 | 6 | Full retro console lineup |
| Board | 1 | +5 | 6 | Cozy board game parlor |
| **Total** | **36** | **+30** | **66** | |

---

*This document is a living brainstorm. Ideas should be validated with prototypes before full implementation. Use the game generator (`scripts/generate-game.js`) to scaffold any game in under 5 minutes.*
