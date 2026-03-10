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
- **`@thenick775/mgba-wasm`** (npm package, v2.4.1) — Pre-built mGBA WASM binary, actively maintained
- **GBAjs3** ([github.com/thenick775/gbajs3](https://github.com/thenick775/gbajs3)) — React wrapper around the WASM core, reference implementation
- **HTML5 Canvas** — rendering target for video output
- **Web Audio API** — audio output

> **Key discovery:** A pre-built npm package (`@thenick775/mgba-wasm`) already exists, eliminating the need to compile mGBA from source with Emscripten. This dramatically reduces Phase 1 complexity.

### Integration Layer
- **react-native-webview** (v13.6.4, already installed)
- **WebView ↔ React Native bridge** via `postMessage` / `onMessage`
- **expo-file-system** or **expo-asset** for ROM file management
- **AsyncStorage** for save states and emulator settings

### Platform-Specific Considerations
| Platform | WebAssembly | SharedArrayBuffer | Notes |
|----------|-------------|-------------------|-------|
| **Web (Expo export)** | Full support | Requires COOP/COEP headers | Best experience; can use `@thenick775/mgba-wasm` directly as React component |
| **Android (WebView)** | Full support | Supported (Chromium-based) | Good performance via WebView |
| **iOS (WKWebView)** | Supported | Historically inconsistent | May need single-threaded WASM build or pure-JS fallback |

> **Important:** The mGBA WASM build uses pthreads (SharedArrayBuffer). The hosting environment must send these headers:
> - `Cross-Origin-Opener-Policy: same-origin`
> - `Cross-Origin-Embedder-Policy: require-corp`

### New Dependencies
| Package | Purpose | Required? |
|---------|---------|-----------|
| `@thenick775/mgba-wasm` | Pre-built mGBA WASM core | Yes |
| `expo-file-system` | ROM file picking & storage | Yes |
| `expo-document-picker` | User ROM file selection | Yes |

---

## 3. Implementation Phases

### Phase 1: Emulator Core Setup (Foundation)
**Goal:** Get mGBA WASM running in a standalone HTML page using the pre-built npm package.

#### Tasks:
1. **Install `@thenick775/mgba-wasm` from npm**
   - `pnpm add @thenick775/mgba-wasm` (in the app workspace)
   - This provides the pre-compiled `mgba.wasm` binary + JS glue code
   - No Emscripten toolchain needed

2. **Create the emulator HTML shell**
   - `emulator/shell/index.html` — Canvas + Audio context + input handling + bridge JS
   - Initialize the mGBA Module, pass it an `HTMLCanvasElement`
   - Call `Module.FSInit()` to set up the virtual filesystem
   - ROM loading via `Module.FS` (Emscripten virtual filesystem)
   - Keyboard/touch input mapping
   - `postMessage` bridge for communication with React Native

3. **Bundle the shell as a self-contained page**
   - Inline the WASM loader JS into the HTML shell
   - Copy `mgba.wasm` binary to `app/assets/emulator/`
   - The HTML page must be self-contained for loading in WebView

4. **Deliverable:** A standalone HTML page in `app/assets/emulator/` that can load and run a GBA ROM in a browser.

#### Reference: GBAjs3 initialization pattern
```typescript
// From @thenick775/mgba-wasm
import mGBA from '@thenick775/mgba-wasm';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const Module = await mGBA({ canvas });
await Module.FSInit();
// Load ROM into virtual FS, then start emulation
Module.FS.writeFile('/rom.gba', romData);
Module.loadGame('/rom.gba');
```

#### Custom build option (if npm package is insufficient):
If the pre-built package doesn't meet requirements, a custom WASM build can be created from the `thenick775/mgba` fork (`feature/wasm` branch):
```bash
# Uses Docker with emscripten/emsdk:4.0.4
cd src/platform/wasm
npm run build:image && npm run build
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
├── app/
│   ├── assets/
│   │   └── emulator/                  # Self-contained emulator HTML bundle
│   │       ├── index.html             # Shell page (canvas + bridge + WASM loader)
│   │       └── mgba.wasm             # Copied from node_modules/@thenick775/mgba-wasm
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
| iOS WebView (SharedArrayBuffer) | High | WKWebView has inconsistent SharedArrayBuffer support; use pure-JS fallback (react-gbajs) on iOS; runtime detection |
| COOP/COEP headers (web export) | Low | Configure Vercel/hosting to send required headers for SharedArrayBuffer |
| Build pipeline complexity | Low | Pre-built npm package eliminates Emscripten build step |

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
- **Phase 1:** Low-Medium (npm package available, just need HTML shell)
- **Phase 2:** Medium (WebView bridge, message protocol)
- **Phase 3:** Medium (touch controls, responsive layout)
- **Phase 4:** Low (follows existing game registration pattern)
- **Phase 5:** Medium-High (performance tuning, iOS compatibility, edge cases)

---

## 8. Alternative Emulator Cores (Fallback Options)

If `@thenick775/mgba-wasm` doesn't work on a specific platform (e.g., iOS SharedArrayBuffer issues), several fallbacks exist:

### Tier 1: React-Ready Alternatives
| Project | Type | npm Package | Status |
|---------|------|-------------|--------|
| **react-gbajs** | React component (pure JS core) | `react-gbajs` | Maintained, simpler API |
| **GBAjs2** | Pure JS, Canvas + Web Audio | N/A (standalone) | Working, less accurate |

### Tier 2: Usable but Less Maintained
| Project | Type | Repo |
|---------|------|------|
| **IodineGBA** | Pure JS | `taisel/IodineGBA` |
| **IodineGBA Enhanced** | Pure JS (improved fork) | `KittyPBoxx/IodineGBAEnhanced` |

### Tier 3: Experimental
| Project | Type | Notes |
|---------|------|-------|
| **wasm-gba** (Rust→WASM) | Rust compiled to WASM | Incomplete, demonstrates alternative compilation path |

### Trade-offs:
| Aspect | mGBA WASM (npm) | react-gbajs (Pure JS) | IodineGBA |
|--------|-----------------|----------------------|-----------|
| Accuracy | Excellent | Good | Good |
| Performance | Very fast | Moderate | Moderate |
| Setup complexity | Low (npm install) | Very low (npm install) | Medium (manual bundle) |
| Game compatibility | ~99% | ~90% | ~90% |
| Audio quality | Excellent | Acceptable | Acceptable |
| SharedArrayBuffer needed | Yes | No | No |
| Maintenance | Active | Maintained | Mostly abandoned |
| iOS WebView support | May need fallback | Works everywhere | Works everywhere |

### Recommended Strategy:
1. **Primary:** `@thenick775/mgba-wasm` for web export and Android WebView
2. **iOS fallback:** `react-gbajs` (pure JS) if SharedArrayBuffer is unavailable in WKWebView
3. **Runtime detection:** Check `typeof SharedArrayBuffer !== 'undefined'` and choose core accordingly

---

## 9. Open Questions

1. **Should Game Boy / Game Boy Color support be included?** mGBA supports them natively — minimal extra effort if using mGBA.
2. **Should the emulator category be added to `GameDefinition`?** Currently supports `'pet' | 'puzzle' | 'adventure' | 'casual'` — adding `'emulator'` would be cleaner.
3. **Should ROM files be stored in app storage or just referenced by path?** Storing copies ensures they survive if the original is deleted but uses more space.
4. **Multiplayer/link cable support?** mGBA supports local link cable — could this work between two devices over WebSocket? Ambitious but possible as a future feature.
5. **Should we pre-bundle any homebrew ROMs** as demo content so users can try the emulator immediately without needing their own files?

---

## 10. App Store Considerations

Apple relaxed its emulator policy in 2024, now allowing emulator apps on the App Store (Delta, RetroArch, Provenance, etc.). Google Play has long permitted emulator apps. Key rules for both stores:
- **No bundled ROMs** — users must supply their own
- **No BIOS downloads** — use built-in HLE BIOS
- **Clear disclaimers** about ROM legality

---

## 11. References

- [mGBA Source Code](https://github.com/mgba-emu/mgba) — MPL-2.0
- [GBAjs3](https://github.com/thenick775/gbajs3) — React wrapper around mGBA WASM
- [@thenick775/mgba-wasm](https://www.npmjs.com/package/@thenick775/mgba-wasm) — Pre-built npm package (v2.4.1)
- [thenick775/mgba feature/wasm branch](https://github.com/thenick775/mgba) — mGBA fork with Emscripten build
- [react-gbajs](https://github.com/macabeus/react-gbajs) — React component for pure-JS GBA emulation
- [IodineGBA](https://github.com/taisel/IodineGBA) — Pure JavaScript GBA emulator
- [Cult-of-GBA/BIOS](https://github.com/Cult-of-GBA/BIOS) — Open-source GBA BIOS replacement
- [GBA Technical Reference (GBATEK)](https://problemkaputt.de/gbatek.htm)
- [react-native-webview docs](https://github.com/nickoala/nickoala.github.io)
- [Sony v. Connectix](https://en.wikipedia.org/wiki/Sony_Computer_Entertainment,_Inc._v._Connectix_Corp.) — Legal precedent for emulation
- [Emscripten Documentation](https://emscripten.org/docs/)
