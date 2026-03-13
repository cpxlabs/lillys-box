# GBA Emulator Integration Plan

Concrete plan for adding a Game Boy Advance-style emulator experience to Lilly's Box with the smallest safe architectural steps.

## Executive Recommendation

Use **mGBA as the long-term emulator core target**, but **do not start by embedding native C/C++ directly into the current Expo app**.

Instead, implement this in phases:

1. **Product + legal spike**
2. **Feature-flagged emulator shell inside Lilly's Box**
3. **Web/WASM prototype to validate UX and performance**
4. **Native bridge only if the prototype proves the feature is worth the platform cost**

This approach fits the current repository better because Lilly's Box is an Expo/React Native app with a mature game-registration system, while mGBA is a native emulator core whose main integration difficulty is platform bridging, not game UI.

---

## Why mGBA

mGBA is the best fit for a serious GBA effort because it already provides:

- Accurate GBA emulation
- Mature save-state and cartridge support
- Existing SDL, Qt, and Libretro frontends
- A portable C core with a long maintenance history
- MPL 2.0 licensing, which is workable for an open-source integration

For Lilly's Box, the main question is **not** "which emulator core should we trust?" but **how do we wrap that core in a child-friendly Expo experience without destabilizing the current app?**

---

## Constraints in Lilly's Box

### 1. Expo architecture

The app currently ships as an Expo/React Native project. That makes emulator integration possible, but it changes the trade-offs:

- **Best performance:** native bridge to the mGBA C core
- **Fastest proof of concept:** WebAssembly/WebView shell
- **Lowest risk to the current app:** keep the first version behind a feature flag and isolate it as a single registered experience

### 2. Current game system

Lilly's Box already expects new interactive experiences to fit this pattern:

- `app/src/context/*Context.tsx`
- `app/src/screens/*Navigator.tsx`
- `app/src/screens/*HomeScreen.tsx`
- `app/src/screens/*GameScreen.tsx`
- registration in `app/src/gameRegistrations.ts`

That means the emulator should be integrated as **one emulator shell experience**, not as many one-ROM-per-game entries.

### 3. Legal/product constraints

This project should not ship copyrighted commercial ROMs or proprietary BIOS files.

Recommended guardrails:

- Support **user-imported ROMs only**
- Do **not** bundle Nintendo BIOS files
- Prefer the emulator core's built-in BIOS fallback where legally and technically acceptable
- Treat save data as user-owned local content
- Keep any future public marketing language focused on "user-owned compatible ROM backups"

---

## Recommended Product Shape

Implement **one** entry in Lilly's Box:

- **ID:** `gba-emulator`
- **Display concept:** "Retro Console" or "GBA Emulator"
- **Behavior:** opens an emulator library/import screen, then launches the selected ROM in the emulator player

### Why one shell instead of one game per ROM

One shell is the better fit for the current app because:

- the registry is designed around curated first-party experiences
- ROM libraries are user data, not source-controlled game definitions
- translations, screenshots, and metadata would become unmanageable if every ROM were treated like a built-in game
- save files, key mapping, and import flows belong to the emulator shell, not to individual Lilly's Box registrations

### Category recommendation

The emulator now has its own dedicated `emulator` category in the game registry with matching UI colors and filter support across all game selection screen variants.

---

## Proposed Architecture

### App shell responsibilities

The Lilly's Box side should own:

- ROM import and library UI
- feature flag / parental gating
- touch controls and control remapping UI
- save-state management UX
- app lifecycle handling (pause/resume/background)
- recent games, favorites, and basic metadata
- analytics for shell actions only

### Emulator core responsibilities

The emulator core should own:

- CPU emulation
- memory map and cartridge execution
- video frame generation
- audio generation
- RTC / save RAM behavior
- savestates
- input polling surface

### Proposed file layout for implementation

When implementation begins, follow the existing game pattern:

```text
app/src/context/GbaEmulatorContext.tsx
app/src/screens/GbaEmulatorNavigator.tsx
app/src/screens/GbaEmulatorHomeScreen.tsx
app/src/screens/GbaEmulatorGameScreen.tsx
app/src/components/emulator/
  ├── EmulatorCanvas.tsx
  ├── EmulatorControls.tsx
  ├── RomLibrary.tsx
  └── SaveStateTray.tsx
app/src/services/emulator/
  ├── emulatorBridge.ts
  ├── romLibrary.ts
  └── saveStateStorage.ts
```

### Registration shape

Register it as a single experience in `app/src/gameRegistrations.ts`:

```ts
gameRegistry.register({
  id: 'gba-emulator',
  nameKey: 'selectGame.gbaEmulator.name',
  descriptionKey: 'selectGame.gbaEmulator.description',
  emoji: '🕹️',
  category: 'casual',
  navigator: GbaEmulatorNavigator,
  providers: [GbaEmulatorProvider],
  isEnabled: false,
});
```

Start with `isEnabled: false` plus a feature flag until performance, safety, and UX are validated.

---

## Technology Decision

### Phase 1 choice: prototype with a web-style emulator wrapper

Build the first spike using a **WASM/WebView-friendly shell** if possible.

### Why

- minimal disruption to the current Expo architecture
- fast validation of controls, ROM import UX, and save behavior
- lets the team decide whether emulator usage actually fits Lilly's Box before taking on native-module maintenance

### Success criteria

The prototype is only worth continuing if it can reliably achieve:

- acceptable frame pacing on target mobile devices
- stable audio without obvious stutter
- touch controls that feel responsive
- suspend/resume behavior that does not corrupt saves

If these are not met, move directly to the native bridge plan or stop the feature.

### Phase 2 choice: native bridge for production-quality performance

If the spike is promising, move to a native integration:

- **Android:** JNI/NDK wrapper around the mGBA core
- **iOS:** Objective-C++/Swift bridge around the same core
- **Expo impact:** use prebuild/custom native code instead of relying on Expo Go

### Important consequence

This is the point where the emulator feature stops being "just another game" and becomes a platform capability. It should only happen after the prototype proves there is clear product value.

---

## Phased Delivery Plan

### Phase 0 — Discovery and boundaries

Deliverables:

- confirm licensing obligations for MPL 2.0 usage
- define ROM/BIOS policy for the repository and future releases
- choose target platforms for v1 (`web`, `android`, `ios`)
- define "good enough" performance numbers on real devices

Exit criteria:

- written legal/product constraints approved
- single recommended technical path selected for the spike

### Phase 1 — Emulator shell in Lilly's Box

Deliverables:

- `GbaEmulatorContext`
- `GbaEmulatorNavigator`
- home screen for ROM import / recent games / settings
- hidden or feature-flagged registration entry
- localization keys for the shell

Exit criteria:

- emulator shell can be navigated inside the app
- no emulator core required yet
- safe empty-state UX exists when no ROM is imported

### Phase 2 — Proof-of-concept runtime

Deliverables:

- first playable ROM boot path
- on-screen controls
- pause/resume support
- battery/performance benchmarking

Exit criteria:

- one test ROM boots consistently
- input latency and audio are acceptable on target devices
- app remains stable when backgrounded and resumed

### Phase 3 — Persistence and family-safe UX

Deliverables:

- save RAM persistence
- save-state slots
- per-user ROM metadata and recent games
- parental messaging and legal disclaimers

Exit criteria:

- users can resume progress without manual file management
- shell clearly communicates that ROMs are user-provided

### Phase 4 — Polish and rollout

Deliverables:

- landscape-first player layout
- remappable controls
- better library UX
- telemetry for shell-level actions
- controlled rollout behind remote/local feature flag

Exit criteria:

- emulator experience is stable enough to expose to selected users

---

## Scope for v1

Keep version 1 intentionally small.

### Include

- GBA only
- one emulator shell
- local ROM import
- local save RAM
- limited save-state support
- touch controls
- landscape gameplay

### Explicitly exclude

- GB/GBC support
- link cable / multiplayer
- rewind
- cheats
- debugger/GDB
- video recording
- ROM marketplace/distribution
- cloud sync

These can come later, but they should not block the first usable release.

---

## Storage Plan

Store emulator data as shell-owned user content, not as built-in game assets.

Suggested storage areas:

- `@gba_library_index`
- `@gba_recent_roms`
- `@gba_settings`
- `@gba_save_<romHash>`
- `@gba_state_<slot>_<romHash>`

Use a ROM hash instead of the display title as the primary key so renamed files do not break save lookup.

---

## UI/UX Plan

### Home screen

The emulator home screen should look like a Lilly's Box experience, not a developer emulator frontend.

Recommended sections:

- recent games
- import ROM
- controls help
- save states
- settings
- parent/legal notice

### Gameplay screen

Recommended layout:

- landscape-first viewport
- render surface centered
- on-screen D-pad on the left
- A/B + Start/Select on the right
- top overlay for pause, save, load, exit

### Accessibility/family considerations

- large hit targets for touch controls
- easy "exit to menu" flow
- clear explanation that emulator files are user-provided
- no debugging or power-user features in the first family-facing release

---

## Testing Plan

The implementation phase should add tests at three layers:

### 1. Shell tests

Use the existing app test stack for:

- empty ROM library state
- import flow UI
- save-state button visibility
- pause/resume UI behavior

### 2. Bridge tests

Add targeted tests around:

- ROM metadata parsing
- save path generation
- state restoration contracts

### 3. Manual device verification

Required for every milestone:

- Android touch responsiveness
- iOS audio stability
- web fallback behavior
- app background/resume safety

---

## Risks and Mitigations

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Expo/native mismatch | Native emulator integration is heavier than current app features | Start with a spike, then escalate to native only if justified |
| Performance on low-end devices | Emulators are frame- and audio-sensitive | Benchmark early on real hardware |
| Legal confusion around ROMs | High risk of product misuse or unclear messaging | Ship user-import only flow and document policy clearly |
| Scope explosion | mGBA supports many advanced features | Keep v1 limited to boot, controls, saves, pause |
| UX mismatch | Emulator UI can feel too technical for Lilly's Box | Wrap it in a simplified child/family-friendly shell |

---

## First Implementation Checklist

- [ ] Create `docs/technical/EMULATOR.md` as the source of truth for the effort
- [ ] Add `selectGame.gbaEmulator.*` locale keys
- [ ] Scaffold `GbaEmulatorContext`, `GbaEmulatorNavigator`, `GbaEmulatorHomeScreen`, `GbaEmulatorGameScreen`
- [ ] Register a hidden `gba-emulator` experience in `app/src/gameRegistrations.ts`
- [ ] Build a ROM-library-only shell before any real emulation
- [ ] Add a proof-of-concept runtime behind a feature flag
- [ ] Benchmark frame pacing, audio, and battery on target devices
- [ ] Decide whether to stay web-based or move to a native bridge

---

## Bottom Line

The best plan for Lilly's Box is **not** to immediately drop mGBA into the app and hope it fits.

The best plan is to:

1. treat the emulator as a **single shell-based experience**
2. validate the UX with the **lowest-risk prototype**
3. move to a **native mGBA bridge only if the prototype earns it**

That sequence gives the project a real path to an emulator feature without forcing a high-risk platform rewrite before the product value is proven.
