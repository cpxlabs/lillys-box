# Muito Multiplayer — Implementation Plan

## Current State

| Dimension | Status |
|---|---|
| Backend | None. 100 % client-side, AsyncStorage only |
| Auth | Google Sign-In already integrated (`AuthContext`) |
| Game logic | Single-player counting loop, infinite rounds, +10 per correct answer |
| Networking libs | None in `package.json` |
| Game registry | Pluggable — Muito is already isolated behind `MuitoProvider` + `MuitoNavigator` |

---

## Multiplayer Mode: Competitive Race (1 v 1)

Both players see the **same question at the same time**. First to tap the correct
answer scores the point. Play a fixed number of rounds (e.g. 10); whoever has
more points at the end wins. This maps directly onto Muito's existing
question-generation logic — the only change is that the question must be
generated server-side (or seeded) so both clients get an identical round.

---

## Do We Need WebSockets?

**Yes.** The interaction is real-time and bidirectional:

* The server must **push** the next question to both clients simultaneously.
* Each client must **push** its answer back the instant the player taps.
* The server must **push** the result (who answered first, scores) back to both.

REST polling could work but would add hundreds of milliseconds of latency on
every answer — unacceptable for a race where "first tap wins". WebSockets give
sub-50 ms round-trips on a local network and stay well under 200 ms over the
public internet.

---

## Node.js vs Python — Recommendation: Node.js

| Factor | Node.js | Python |
|---|---|---|
| Language match | TypeScript end-to-end; shared types possible | Different language boundary |
| WebSocket ecosystem | `Socket.IO` is battle-tested, has built-in reconnect & rooms | `FastAPI` WebSockets are newer; `Django Channels` adds complexity |
| Concurrency model | Single-threaded event loop — ideal for many lightweight, I/O-bound connections | Needs `asyncio` or threads; higher memory per connection |
| Time-to-first-prototype | Very low; one file can serve WS + static assets | Comparable, but more boilerplate for rooms |
| Hosting | Runs on any VPS, Render, Railway, Fly.io with zero config | Same options, but Python runtimes are heavier |
| Shared code | Game-balance constants (`minCount`, `maxCount`, emoji pool) can live in a shared TS package consumed by both client and server | Would need to duplicate or use a separate shared package |

**Verdict:** Node.js + Socket.IO. The shared-TypeScript benefit alone eliminates an
entire class of "client and server disagree on the rules" bugs.

---

## Architecture Overview

```
┌─────────────┐        WebSocket (Socket.IO)        ┌─────────────┐
│  Player A   │ ◄─────────────────────────────────► │             │
│  (RN app)   │                                     │  Node.js    │
└─────────────┘                                     │  Game Server│
                                                     │             │
┌─────────────┐        WebSocket (Socket.IO)        │  - Rooms    │
│  Player B   │ ◄─────────────────────────────────► │  - Game loop│
│  (RN app)   │                                     │  - Auth     │
└─────────────┘                                     └──────┬──────┘
                                                            │ JWT verify
                                                            ▼
                                                     ┌──────────────┐
                                                     │  Google Auth │
                                                     │  (existing)  │
                                                     └──────────────┘
```

### Data flow for one round

```
Server                          Player A                  Player B
  │                                 │                        │
  │──── emit "round" ─────────────► │                        │
  │──── emit "round" ──────────────────────────────────────► │
  │                                 │                        │
  │     (both see same question)    │                        │
  │                                 │                        │
  │ ◄──── emit "answer" ───────────│                        │
  │ ◄──── emit "answer" ──────────────────────────────────── │
  │                                 │                        │
  │  (compare timestamps, pick     │                        │
  │   winner or tie)               │                        │
  │                                 │                        │
  │──── emit "round_result" ──────►│                        │
  │──── emit "round_result" ─────────────────────────────── ►│
```

---

## Phased Breakdown

### Phase 1 — Server Foundation

| # | Task | Details |
|---|---|---|
| 1.1 | Scaffold Node.js project | `server/` directory at repo root. Express + Socket.IO + TypeScript. Single `package.json` with a `"server"` workspace or a standalone project. |
| 1.2 | Shared types package | `shared/` directory. Export game constants (emoji pool, difficulty tiers, round counts) and Socket.IO event types consumed by both client and server. |
| 1.3 | JWT auth middleware | On WebSocket `connect`, client sends the Google ID token. Server verifies it with Google's public keys, mints a short-lived JWT, attaches `userId` to the socket. No new auth flow for the user. |
| 1.4 | Health check endpoint | `GET /health` → `200 OK`. Needed for cloud hosting liveness probes. |

### Phase 2 — Room & Lobby System

| # | Task | Details |
|---|---|---|
| 2.1 | Room model (in-memory) | A `Map<roomId, RoomState>`. Each room holds: two socket refs, game state, scores, current round. No database needed for an MVP — rooms live only as long as the game. |
| 2.2 | Create / Join events | `create_room` → server generates a 6-char code, emits `room_created`. `join_room { code }` → server adds Player B, emits `player_joined` to both. |
| 2.3 | Lobby UI (client) | New screen: `MuitoLobbyScreen`. Two tabs: **Host** (shows generated code) / **Join** (text input for code). Shows connected players. "Start" button enabled only when both seats are filled and the host taps it. |
| 2.4 | Disconnect handling | If a socket drops before the game starts, remove from room. If during a game, emit `opponent_disconnected` to the other player and end the round. |

### Phase 3 — Multiplayer Game Loop

| # | Task | Details |
|---|---|---|
| 3.1 | Server-side question generation | Move the existing question-generation logic (emoji count, wrong-answer pool, shuffle) into the shared package. Server imports it, generates one question per round, sends to both clients. Clients never generate questions themselves in multiplayer mode. |
| 3.2 | Answer race logic | On receiving two `answer` events (or a timeout), server compares: (a) correctness, (b) arrival timestamp. Awards point to first correct answer. If both correct at "same time" (< 100 ms delta), both score. If neither correct, no points. |
| 3.3 | Round timer | Each round has a 10-second wall-clock timeout. If neither player answers, no points and move on. Server is the source of truth for the timer; clients show a countdown synced from the server's `round_start` timestamp. |
| 3.4 | Game-end & results | After N rounds (configurable, default 10), server emits `game_over { scores, winner }`. New screen: `MuitoResultsScreen` — shows final scores, winner, rematch button. |
| 3.5 | Multiplayer MuitoContext | Extend or shadow `MuitoContext` with a `MultiPlayerMuitoContext` that reads state from Socket.IO events instead of local `useState`. Keep single-player path completely untouched. |

### Phase 4 — Client Integration

| # | Task | Details |
|---|---|---|
| 4.1 | Socket.IO client hook | `useSocket` custom hook: connects on mount, disconnects on unmount, exposes `emit` and an event-subscription API. Wraps `socket.io-client`. |
| 4.2 | Wire lobby screens | `MuitoHomeScreen` gets a new "Multiplayer" button alongside the existing "Play" button. Tapping it navigates to `MuitoLobbyScreen`. |
| 4.3 | Wire game screen | `MuitoGameScreen` already accepts a question and renders answers. In multiplayer mode the question comes from the server via context instead of local generation. The answer tap calls `socket.emit("answer", ...)` instead of local scoring. |
| 4.4 | Navigation updates | Add `MuitoLobby`, `MuitoMultiGame`, `MuitoResults` to the navigator param list and register screens in `MuitoNavigator`. |

### Phase 5 — Polish & Reliability

| # | Task | Details |
|---|---|---|
| 5.1 | Reconnection strategy | Socket.IO has built-in reconnect. On reconnect, server re-sends current game state so the client can resume without a visible glitch. |
| 5.2 | Optimistic UI | Show the player's own answer immediately (local highlight), then correct or retract it when the server confirms. Keeps the app feeling snappy. |
| 5.3 | Persist multiplayer best score | Reuse existing `bestScore` AsyncStorage key. Update it on `game_over` if the player's total exceeds their local best. |
| 5.4 | Tests | Unit-test the shared question-generation logic. Integration-test Socket.IO events with a test client (`socket.io-client` in Jest). Add component tests for lobby and results screens following the existing test patterns. |
| 5.5 | i18n | Add translation keys for lobby UI, results screen, and any new error messages to both `en.json` and `pt-BR.json`. |

---

## New Files & Directories

```
pet-care-game/
├── shared/                        # NEW — shared types & game logic
│   ├── package.json
│   ├── src/
│   │   ├── events.ts             # Socket.IO event name constants + payloads
│   │   ├── gameLogic.ts          # Question generation (moved from MuitoGameScreen)
│   │   └── constants.ts          # Emoji pool, difficulty tiers, round count
│   └── tsconfig.json
│
├── server/                        # NEW — Node.js game server
│   ├── package.json              # express, socket.io, jsonwebtoken, shared
│   ├── src/
│   │   ├── index.ts              # Entry: Express app + Socket.IO server
│   │   ├── auth.ts               # Google ID-token verification + JWT minting
│   │   ├── roomManager.ts        # In-memory room CRUD
│   │   ├── gameLoop.ts           # Per-room game state machine
│   │   └── handlers/
│   │       ├── lobby.ts          # create_room / join_room / leave_room
│   │       └── game.ts           # start_game / answer / round timeout
│   └── tsconfig.json
│
└── src/                           # EXISTING — client changes are minimal
    ├── hooks/
    │   └── useSocket.ts          # NEW — Socket.IO client hook
    ├── context/
    │   └── MultiPlayerMuitoContext.tsx   # NEW — multiplayer game state
    ├── screens/
    │   ├── MuitoLobbyScreen.tsx         # NEW
    │   ├── MuitoMultiGameScreen.tsx     # NEW (thin wrapper over shared game UI)
    │   └── MuitoResultsScreen.tsx       # NEW
    └── ...                              # everything else untouched
```

---

## New Client Dependencies

```
socket.io-client   ^4.x    # WebSocket transport (auto-fallback to polling)
```

That is the only new production dependency on the client. Everything else is
server-side.

## New Server Dependencies

```
express            ^4.x    # HTTP server & static file serving
socket.io          ^4.x    # WebSocket server (matches client major version)
jsonwebtoken       ^9.x    # JWT sign / verify
google-auth-library ^9.x   # Verify Google ID tokens
```

---

## What Stays Single-Player

The existing "Play" button on `MuitoHomeScreen` continues to run the
single-player path without any changes. `MuitoContext`, `MuitoGameScreen`, and
`MuitoNavigator` are not modified — multiplayer is purely additive.

---

## Hosting (when you're ready)

A single Node.js process (Express + Socket.IO) is all you need. Free tiers on
**Railway**, **Render**, or **Fly.io** can serve a small number of concurrent
rooms with no infrastructure overhead. If the game grows, the in-memory room
store is the first thing to swap out for Redis — but that is well outside MVP
scope.
