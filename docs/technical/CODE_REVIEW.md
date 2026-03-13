# Complete Code Review — Lilly's Box

**Date:** 2026-03-10 (updated 2026-03-13)  
**Repository:** `cpxlabs/lillys-box`

---

## 1) Scope and Method

This review covers:
- Frontend application (`/app`)
- Backend service (`/backend`)
- Quality/tooling readiness (lint, tests, build)
- Security-sensitive runtime configuration and dependency posture

Baseline commands (last verified 2026-03-13):

| # | Command | Result |
|---|---------|--------|
| 1 | `cd app && corepack pnpm lint` | **0 errors, 0 warnings** ✅ |
| 2 | `cd app && corepack pnpm test --runInBand` | **123 suites, 671 tests (670 passed, 1 skipped)** ✅ |
| 3 | `cd backend && npm run build` | **0 TypeScript errors** ✅ |
| 4 | `cd backend && npm test` | **9 tests, 2 files** ✅ |

---

## 2) Executive Summary

All quality gates are **green**:

- Frontend lint: **0 errors, 0 warnings** ✅
- Frontend tests: **123/123 suites, 670 passed, 1 skipped** ✅
- Backend build: **passes** ✅ — CORS hardened, rate-limiting registered
- Backend tests: **9 tests in 2 files** ✅ — auth + server smoke tests
- No unused backend dependencies ✅

All high-, medium-, and low-priority action items have been resolved.

---

## 3) Strengths

1. **Type-safety** — `app/tsconfig.json` uses strict mode (`"strict": true`).
2. **Clear repository layout** — `app/`, `backend/`, and `docs/` are well-separated and easy to navigate.
3. **Substantial test coverage** — 122 test files under `app/src`, 2 backend test files.
4. **Clean backend build** — 0 TypeScript errors in `backend/`.
5. **Config hygiene** — root `.gitignore` excludes `.env`, `.env.local`, and local variants.

---

## 4) Resolved Findings

All findings from the original review have been addressed. Condensed below for reference.

### High Priority

| ID | Issue | Resolution | Date |
|----|-------|-----------|------|
| H1 | Frontend lint failing (138 warnings) | All warnings fixed via auto-fix, unused-var prefixing, and targeted suppressions | 2026-03-10 |
| H2 | Frontend tests unstable | Fully green; `react-test-renderer` pinned to `19.2.0` to match React version | 2026-03-13 |
| H3 | Backend build failing | Deduplicated `isProduction`, guarded `origin`, registered rate-limit plugin | 2026-03-10 |

### Medium Priority

| ID | Issue | Resolution | Date |
|----|-------|-----------|------|
| M1 | Backend CORS too permissive | Hardened to require explicit allowlist in production | 2026-03-10 |
| M2 | Rate-limit not registered | `@fastify/rate-limit` registered globally (100 req/min) | 2026-03-10 |
| M3 | Backend `npm test` missing | Added `"test": "vitest run"` and server smoke tests | 2026-03-10 |

### Low Priority

| ID | Issue | Resolution | Date |
|----|-------|-----------|------|
| L1 | Inconsistent lockfiles | Removed stale `package-lock.json`; single `pnpm-lock.yaml` in `/app` | 2026-03-10 |
| L2 | Vitest double-running `dist/` tests | Added `vitest.config.ts` with `include: ['src/**/*.test.ts']` | 2026-03-10 |
| L3 | Unused backend dependencies | Removed `better-sqlite3`, `fastify-plugin`, `@fastify/auth`, `@types/better-sqlite3` | 2026-03-10 |
| L4 | Backend missing `.gitignore` | Added `backend/.gitignore` (excludes `node_modules/`, `dist/`, `.env*`) | 2026-03-10 |
| L5 | Duplicate `afterEach` cleanup in tests | Removed duplicate env-var restoration block | 2026-03-10 |
| L6 | No PORT validation or startup error handling | `server.ts` validates PORT and chains `.catch()` on `listen()` | 2026-03-10 |

---

## 5) Resolved Documentation Fixes

### 2026-03-11

| ID | Issue | Resolution |
|----|-------|-----------|
| D1 | Old project name (`@pet_care_game:*`) in docs | Updated to `@lillys_box:*` in README, AUTHENTICATION, API_REFERENCE, `.env.example` |
| D2 | Game count inconsistency (30+/34 in docs vs 36 actual) | All docs updated to 36 |
| D3 | Backend listed as "Express" in SPEC.md | Corrected to **Fastify** |
| D4 | Duplicate "Snack Stack" in SPEC.md game list | Replaced with missing games (Hide and Seek, Star Catcher, Muito, Color Tap, Kids Chess, GBA Emulator) |
| D5 | CONTRIBUTING.md incomplete | Added Code Style, Branch Naming, Commit Messages, PR Process, Adding a New Game, Resources |
| D6 | docs/README.md directory listing incomplete | Added RALPH_LOOPS.md, LOAD_ROMS.md, EMULATOR.md |
| D7 | Outdated test count in SPEC.md | Updated to current counts |

### 2026-03-12

| ID | Issue | Resolution |
|----|-------|-----------|
| D8 | Redundant game docs | Deleted GAMES_QUICK_REFERENCE.md and GAME_CREATION.md; GAMES_SYSTEM_UPGRADE.md is single source of truth |
| D9 | FOLDER_STRUCTURE.md docs listing incomplete | Added missing entries |
| D10 | GAMES_SYSTEM_UPGRADE.md game count outdated | Updated to 36 games with correct category breakdown |
| D11 | GAMES_SYSTEM_UPGRADE.md broken relative links | Fixed all paths to resolve from `docs/` directory |

---

## 6) Change Log

### PRs Merged (2026-03-12 — 2026-03-13)

| PR | Title | Impact |
|----|-------|--------|
| #257 | Enable web ROM import in Retro Console | Web platform ROM loading |
| #258 | Consolidate redundant game docs | Doc cleanup (D8–D11) |
| #259 | Add emulator and board game categories | New game categories: `emulator`, `board` |
| #260 | Add GBA emulator gameplay (EmulatorJS) | Full GBA emulator integration |
| #261 | Add 20 new mini-games with home screens | +20 games with navigation |
| #262 | Stabilize frontend code-review follow-ups | Pet Doctor and GBA emulator fixes |
| #263 | Strengthen shared back-navigation coverage | Additional test coverage for game screens |
| #264 | Use iframe for web platform in GBA emulator | Web emulator rendering fix |
| #265 | Constrain Pet Taxi overlay on mobile web | UI fix for mobile web |
| #266 | Fix Simon Says color buttons on mobile web | UI fix for mobile web |
| #267 | Use srcdoc for emulator iframe ROM loading | Fix ROM loading via iframe |
| #268 | Fix navigation not working | Enhanced `useGameBack` hook; updated 37 game screens |
| #269 | Add Android APK build profile | `eas.json` + build docs |
| #270 | Harden back navigation for nested screens | Edge case fixes for nested navigation |
| #271 | Route local Android APK builds to `Android/` | APK output path configuration |
| #272 | Update CODE_REVIEW.md baseline recheck | Doc update |
| #273 | Mark H2 resolved, sync test counts | Doc update |

### Baseline Progression

| Metric | 2026-03-10 | 2026-03-12 | 2026-03-13 |
|--------|-----------|-----------|-----------|
| App lint | 0 errors, 0 warnings | 0 errors, 0 warnings | 0 errors, 0 warnings |
| App test suites | 112 | 118 | 123 |
| App tests (total) | 619 | 645 | 671 |
| App test files | — | 117 | 122 |
| Backend tests | 7 (1 file) | 7 (1 file) | 9 (2 files) |
| Registered games | 36 | 36 | 36 |

### New Documentation (since initial review)

- **`docs/guides/NAVIGATION.md`** — Game navigation system, `useGameBack` hook, back-button behavior across platforms.
- **`docs/guides/BUILD.md`** — Updated with Android APK build instructions.

---

## 7) Final Assessment

The repository is in a healthy and stable state. All quality gates are green: frontend lint produces zero warnings, the full test suite (671 tests across 123 suites) passes, the backend TypeScript build is error-free, and backend smoke tests cover CORS, auth, and health-check behavior. Dependency hygiene is clean and the codebase is ready for continued feature development.

The `server/` sub-package (Socket.IO / Muito multiplayer game server) contains known areas for future improvement (wildcard CORS, hardcoded JWT fallback, no room-code deduplication), deferred until that subsystem is actively deployed.

---

## 8) Follow-up Plan (non-backend scope)

There are no remaining frontend or documentation fixes to schedule from this review. The app baseline was rechecked on 2026-03-13 and remains green:

- `cd app && corepack pnpm lint` ✅
- `cd app && corepack pnpm test --runInBand` ✅
- `cd app && corepack pnpm build:web` ✅

Accordingly, the non-backend plan is:

1. **Do not open additional frontend follow-up work from this review** — all app-facing findings are already resolved.
2. **Keep this review as closed unless a future regression reopens one of the resolved items** (for example, lint warnings, broken navigation, or failing app tests).
3. **Treat the deferred `server/` improvements as backend-only scope** and handle them separately when that subsystem is actively deployed.
