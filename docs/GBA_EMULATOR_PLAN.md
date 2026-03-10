# GBA Emulator Implementation Plan for Lilly's Box

## Executive Summary

This document outlines the plan to integrate a GBA (Game Boy Advance) emulator into Lilly's Box, leveraging the mGBA open-source emulator compiled to WebAssembly. The emulator will run inside a WebView component, fitting naturally into the existing game registry architecture as a new "game" entry.

---

## 1. Architecture Overview

### High-Level Approach

```
┌─────────────────────────────────────────────────────────┐
│                    Lilly's Box App                        │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │             Game Registry System                      │ │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │ │
│  │  │ Pet Care  │ │ Puzzles  │ │  GBA Emulator     │   │ │
│  │  │          │ │          │ │  (new entry)       │   │ │
│  │  └──────────┘ └──────────┘ └───────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
│                          │                                │
│                          ▼                                │
│  ┌─────────────────────────────────────────────────────┐ │
│  │            GBA Emulator Screen                        │ │
│  │  ┌───────────────────────────────────────────────┐   │ │
│  │  │              WebView Container                 │   │ │
│  │  │  ┌─────────────────────────────────────────┐  │   │ │
│  │  │  │     mGBA WASM + HTML5 Canvas            │  │   │ │
│  │  │  │     ┌─────────────┐                     │  │   │ │
│  │  │  │     │  ARM7TDMI   │ ← CPU emulation     │  │   │ │
│  │  │  │     │  PPU/GPU    │ ← Graphics          │  │   │ │
│  │  │  │     │  APU/Sound  │ ← Audio             │  │   │ │
│  │  │  │     │  DMA/Timer  │ ← Hardware I/O      │  │   │ │
│  │  │  │     └─────────────┘                     │  │   │ │
│  │  │  └─────────────────────────────────────────┘  │   │ │
│  │  └───────────────────────────────────────────────┘   │ │
│  │                                                       │ │
│  │  ┌───────────────────────────────────────────────┐   │ │
│  │  │         On-Screen Controls (RN overlay)        │   │ │
│  │  │   [D-Pad]  [A] [B]  [Start] [Select] [L] [R] │   │ │
│  │  └───────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Why WebView + WASM?

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **WebView + mGBA WASM** | Proven, cross-platform, no native code changes, works on web export | Slight perf overhead from WebView | **Recommended** |
| Native C module (React Native TurboModule) | Best performance | Requires native build pipeline changes per platform, no web support | Too complex for now |
| Pure JS emulator (e.g., IodineGBA) | Easy to embed | Slower, less accurate, abandoned projects | Accuracy concerns |
| Headless native + RN canvas bridge | Good performance | Very complex bridging | Over-engineered |

**Decision: WebView + mGBA compiled to WASM via Emscripten**

This approach:
- Works on Android, iOS, and Web (all Lilly's Box targets)
- Leverages mGBA's battle-tested accuracy and speed
- Uses `react-native-webview` (already a dependency)
- Keeps the emulator sandboxed and isolated
- Requires no changes to the native build pipeline

---

## 2. Technology Stack

### Core Emulator
- **mGBA** (MPL-2.0 license) — compiled to WebAssembly via Emscripten
- **Emscripten SDK** — C/C++ to WASM compiler toolchain
- **HTML5 Canvas** — rendering target for video output
- **Web Audio API** — audio output

### Integration Layer
- **react-native-webview** (v13.6.4, already installed)
- **WebView ↔ React Native bridge** via `postMessage` / `onMessage`
- **expo-file-system** or **expo-asset** for ROM file management
- **AsyncStorage** for save states and emulator settings

### New Dependencies
| Package | Purpose | Required? |
|---------|---------|-----------|
| `expo-file-system` | ROM file picking & storage | Yes |
| `expo-document-picker` | User ROM file selection | Yes |
| None (build-time only) | Emscripten SDK for WASM compilation | Build-time |

---

## 3. Implementation Phases

### Phase 1: WASM Build Pipeline (Foundation)
**Goal:** Get mGBA compiled to WASM and running in a standalone HTML page.

#### Tasks:
1. **Set up Emscripten build environment**
   - Create `emulator/` directory at project root
   - Add Dockerfile for reproducible WASM builds
   - Script to clone mGBA source and compile with Emscripten

2. **Configure mGBA for WASM compilation**
   - CMake configuration with Emscripten toolchain
   - Disable unnecessary features (Qt, SDL frontend, debugger, scripting)
   - Enable: core emulation, software rendering, audio via Web Audio
   - Target flags: `-s WASM=1 -s USE_SDL=2 -s ALLOW_MEMORY_GROWTH=1`

3. **Create minimal HTML5 shell**
   - `emulator/shell.html` — Canvas + Audio context + input handling
   - ROM loading via JavaScript (`Module.FS` / Emscripten virtual filesystem)
   - Frame rendering to `<canvas>` element
   - Keyboard/touch input mapping

4. **Deliverable:** `emulator/dist/` with `mgba.wasm`, `mgba.js`, and `shell.html` that can load and run a GBA ROM in a browser.

#### Key mGBA Emscripten build flags:
```cmake
# emulator/CMakeLists.emscripten.txt
set(BUILD_QT OFF)
set(BUILD_SDL OFF)
set(BUILD_LIBRETRO OFF)
set(BUILD_OPENGL OFF)
set(USE_SQLITE3 OFF)
set(USE_LIBZIP OFF)
set(USE_FFMPEG OFF)
set(USE_DISCORD_RPC OFF)
set(USE_EDITLINE OFF)
set(USE_GDB_STUB OFF)
set(M_CORE_GBA ON)
set(M_CORE_GB ON)
```

---

### Phase 2: React Native Integration (WebView Bridge)
**Goal:** Embed the WASM emulator inside the app via WebView.

#### Tasks:
1. **Create the emulator HTML bundle**
   - Package `mgba.wasm`, `mgba.js`, and the HTML shell into app assets
   - Place in `app/assets/emulator/` directory
   - For web platform: serve as static assets
   - For native: bundle with the app and load from local file URI

2. **Build the WebView bridge layer**
   - `app/src/screens/GBAEmulator/EmulatorBridge.ts`
   - Define message protocol between RN and WebView:

   ```typescript
   // Messages from RN → WebView
   type EmulatorCommand =
     | { type: 'LOAD_ROM'; data: string }      // base64 ROM data
     | { type: 'PAUSE' }
     | { type: 'RESUME' }
     | { type: 'RESET' }
     | { type: 'SAVE_STATE'; slot: number }
     | { type: 'LOAD_STATE'; slot: number }
     | { type: 'KEY_DOWN'; key: GBAButton }
     | { type: 'KEY_UP'; key: GBAButton }
     | { type: 'SET_SPEED'; multiplier: number }
     | { type: 'MUTE'; muted: boolean };

   // Messages from WebView → RN
   type EmulatorEvent =
     | { type: 'READY' }
     | { type: 'ROM_LOADED'; title: string }
     | { type: 'SAVE_STATE_DATA'; slot: number; data: string }
     | { type: 'ERROR'; message: string }
     | { type: 'FPS'; value: number };
   ```

3. **Implement ROM loading flow**
   - User picks ROM file via `expo-document-picker`
   - File is read as base64 and sent to WebView via `postMessage`
   - WebView writes ROM to Emscripten virtual FS and starts emulation

4. **Implement save state management**
   - Save states captured in WebView, sent to RN as base64
   - Stored in AsyncStorage keyed by ROM hash + slot number
   - Load states sent back to WebView on request

---

### Phase 3: On-Screen Controls & UI
**Goal:** Build touch-friendly controls and emulator UI.

#### Tasks:
1. **Virtual gamepad overlay (React Native layer)**
   - `app/src/screens/GBAEmulator/components/VirtualGamepad.tsx`
   - D-pad (up/down/left/right with diagonals)
   - A, B buttons (right side)
   - L, R shoulder buttons (top)
   - Start, Select buttons (center bottom)
   - Use `react-native-gesture-handler` for responsive touch
   - Haptic feedback via `expo-haptics`
   - Transparent overlay on top of WebView

2. **Emulator HUD**
   - `app/src/screens/GBAEmulator/components/EmulatorHUD.tsx`
   - FPS counter (optional, toggle in settings)
   - Fast-forward button (2x, 4x speed)
   - Save/Load state quick buttons
   - Menu button (pause + show options)

3. **Emulator settings screen**
   - `app/src/screens/GBAEmulator/GBASettingsScreen.tsx`
   - Control opacity/size adjustment
   - Button layout customization
   - Audio on/off
   - Frame skip settings
   - Screen scaling mode (fit/stretch/integer scaling)

4. **ROM library/picker screen**
   - `app/src/screens/GBAEmulator/GBARomPickerScreen.tsx`
   - List of previously loaded ROMs (stored metadata)
   - "Load ROM" button to pick new file
   - ROM cover art (if available) or placeholder
   - Last played timestamp

---

### Phase 4: Game Registry Integration
**Goal:** Register the GBA emulator as a game in Lilly's Box.

#### Tasks:
1. **Create GBA emulator context and navigator**

   ```typescript
   // app/src/context/GBAEmulatorContext.tsx
   interface GBAEmulatorState {
     recentRoms: RomMetadata[];
     settings: EmulatorSettings;
     saveStates: Record<string, SaveStateInfo[]>;
   }
   ```

   ```typescript
   // app/src/screens/GBAEmulatorNavigator.tsx
   // Stack: RomPicker → EmulatorScreen → Settings
   ```

2. **Register in gameRegistrations.ts**

   ```typescript
   gameRegistry.register({
     id: 'gba-emulator',
     nameKey: 'selectGame.gbaEmulator.name',
     descriptionKey: 'selectGame.gbaEmulator.description',
     emoji: '🎮',
     category: 'casual',
     navigator: GBAEmulatorNavigator,
     providers: [GBAEmulatorProvider],
     isEnabled: true,
   });
   ```

3. **Add i18n keys** for English and Portuguese

4. **Category consideration:** May want to add a new `'emulator'` category to `GameDefinition` type

---

### Phase 5: Polish & Optimization
**Goal:** Production-ready quality.

#### Tasks:
1. **Performance optimization**
   - WebView hardware acceleration settings
   - WASM SIMD instructions where supported
   - Audio buffer tuning to prevent crackling
   - Frame pacing for smooth 60fps

2. **Save data persistence**
   - In-game saves (battery-backed SRAM) auto-saved on pause/exit
   - Save states with screenshots for visual identification
   - Export/import save data

3. **Screen orientation**
   - Force landscape mode when emulator is active
   - Handle orientation transitions gracefully

4. **Error handling**
   - Invalid ROM detection
   - WASM loading failure fallback
   - Memory pressure handling (GBA ROMs can be up to 32MB)

5. **Testing**
   - Unit tests for bridge protocol
   - Integration tests for ROM loading flow
   - Manual testing across device categories

---

## 4. File Structure

```
lillys-box/
├── emulator/                          # WASM build pipeline (git-tracked)
│   ├── Dockerfile                     # Emscripten build environment
│   ├── build.sh                       # Build script
│   ├── patches/                       # Any mGBA patches needed
│   ├── shell/                         # HTML shell template
│   │   ├── index.html                 # Main shell page
│   │   ├── emulator.js                # JS bridge (WebView ↔ WASM)
│   │   └── styles.css                 # Canvas styling
│   └── dist/                          # Built artifacts (gitignored)
│       ├── mgba.wasm
│       ├── mgba.js
│       └── index.html
│
├── app/
│   ├── assets/
│   │   └── emulator/                  # Bundled WASM emulator files
│   │       ├── mgba.wasm
│   │       ├── mgba.js
│   │       └── index.html
│   │
│   └── src/
│       ├── screens/
│       │   └── GBAEmulator/
│       │       ├── GBAEmulatorScreen.tsx      # Main emulator screen (WebView)
│       │       ├── GBARomPickerScreen.tsx      # ROM selection screen
│       │       ├── GBASettingsScreen.tsx       # Emulator settings
│       │       ├── GBAEmulatorNavigator.tsx    # Stack navigator
│       │       ├── GBAEmulatorHomeScreen.tsx   # Landing/intro screen
│       │       └── components/
│       │           ├── VirtualGamepad.tsx      # On-screen controls
│       │           ├── EmulatorHUD.tsx         # FPS, speed, save/load
│       │           ├── EmulatorWebView.tsx     # WebView wrapper
│       │           └── RomListItem.tsx         # ROM library item
│       │
│       ├── context/
│       │   └── GBAEmulatorContext.tsx          # Emulator state management
│       │
│       ├── types/
│       │   └── gbaEmulator.ts                 # TypeScript types
│       │
│       └── utils/
│           └── emulatorBridge.ts              # WebView message protocol
```

---

## 5. Legal Considerations

### Emulator Legality
- **Emulators are legal.** Court precedents (Sony v. Connectix, Sega v. Accolade) establish that emulation itself is legal.
- **mGBA license:** Mozilla Public License 2.0 — allows use in proprietary apps as long as mGBA source modifications are shared back. Unmodified use + linking is fine.

### BIOS
- mGBA includes a **built-in open-source BIOS implementation** (HLE BIOS) — no need to distribute or require Nintendo's copyrighted BIOS.
- Users should NOT be prompted to provide a BIOS file. The built-in one is sufficient for ~99% of games.

### ROMs
- **The app must NOT bundle, distribute, or link to ROMs.** This is critical.
- Users must provide their own ROM files (legally dumped from cartridges they own).
- The ROM picker should include a clear disclaimer:
  > "Load your own legally obtained ROM files. This app does not provide game ROMs."

### Homebrew
- Consider bundling or linking to **legal homebrew GBA games** as demos (many are freely distributed under open-source licenses).
- Good examples: Celeste Classic GBA port, GBA homebrew demos from gbadev.net.

---

## 6. Key Technical Challenges & Mitigations

| Challenge | Risk | Mitigation |
|-----------|------|------------|
| WASM performance in WebView | Medium | mGBA is highly optimized; test on low-end devices early; enable WASM SIMD |
| Audio latency/crackling | High | Tune Web Audio buffer sizes; allow user to adjust; implement audio ring buffer |
| Touch input latency | Medium | Process touch events at highest priority; minimize bridge message overhead |
| Large ROM files (up to 32MB) | Medium | Stream ROM data in chunks; use SharedArrayBuffer if available |
| WebView memory limits | Medium | Monitor memory usage; implement graceful degradation |
| Save state size | Low | Compress save states (GBA states are ~300KB); limit slots |
| iOS WebView restrictions | Medium | iOS WKWebView supports WASM; test thoroughly on Safari/WebKit |
| Build pipeline complexity | Medium | Docker-based builds; pre-built WASM artifacts checked into repo |

---

## 7. Milestones & Dependencies

```
Phase 1 (WASM Build)      ──────────────────►  [Standalone emulator in browser]
       │
       ▼
Phase 2 (WebView Bridge)  ──────────────────►  [Emulator running in-app]
       │
       ├──► Phase 3 (Controls & UI)  ────────►  [Playable with touch controls]
       │
       └──► Phase 4 (Registry)       ────────►  [Integrated into game list]
              │
              ▼
       Phase 5 (Polish)    ──────────────────►  [Production ready]
```

### Estimated Complexity per Phase:
- **Phase 1:** High (Emscripten setup, mGBA build configuration)
- **Phase 2:** Medium (WebView bridge, message protocol)
- **Phase 3:** Medium (touch controls, responsive layout)
- **Phase 4:** Low (follows existing game registration pattern)
- **Phase 5:** Medium-High (performance tuning, edge cases)

---

## 8. Alternative: Pure JavaScript Emulator (Fallback Plan)

If the mGBA WASM approach proves too complex for the build pipeline, a fallback option exists:

### gba.js / IodineGBA
- Pure JavaScript GBA emulators
- Easier to bundle (just JS files, no WASM compilation needed)
- Less accurate and slower than mGBA
- Could be embedded directly in the WebView HTML

### Trade-offs:
| Aspect | mGBA WASM | Pure JS (IodineGBA) |
|--------|-----------|---------------------|
| Accuracy | Excellent | Good |
| Performance | Very fast | Moderate |
| Build complexity | High (Emscripten) | Low (just JS) |
| Game compatibility | ~99% | ~90% |
| Audio quality | Excellent | Acceptable |
| Maintenance | Active project | Mostly abandoned |

**Recommendation:** Start with mGBA WASM. Fall back to a JS emulator only if the WASM build pipeline becomes unmanageable.

---

## 9. Open Questions

1. **Should Game Boy / Game Boy Color support be included?** mGBA supports them natively — minimal extra effort if using mGBA.
2. **Should the emulator category be added to `GameDefinition`?** Currently supports `'pet' | 'puzzle' | 'adventure' | 'casual'` — adding `'emulator'` would be cleaner.
3. **Should ROM files be stored in app storage or just referenced by path?** Storing copies ensures they survive if the original is deleted but uses more space.
4. **Multiplayer/link cable support?** mGBA supports local link cable — could this work between two devices over WebSocket? Ambitious but possible as a future feature.
5. **Should we pre-bundle any homebrew ROMs** as demo content so users can try the emulator immediately without needing their own files?

---

## 10. References

- [mGBA Source Code](https://github.com/mgba-emu/mgba) — MPL-2.0
- [Emscripten Documentation](https://emscripten.org/docs/)
- [mGBA WASM builds discussion](https://github.com/nickoala/nickoala.github.io) — Community WASM port reference
- [WebAssembly in WebView](https://chromium.googlesource.com/chromium/src/+/master/docs/webassembly.md)
- [GBA Technical Reference (GBATEK)](https://problemkaputt.de/gbatek.htm)
- [react-native-webview docs](https://github.com/nickoala/nickoala.github.io)
