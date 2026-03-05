# Code Review Report

Date: 2026-03-05
Repository: `cpxlabs/pet-care-game`
Reviewer: Copilot Coding Agent

## Scope

This review covered:
- Frontend app structure (`app/`)
- Backend server (`backend/`)
- Tooling and quality gates (lint/build/test)
- Security-sensitive configuration patterns

## Validation Commands Run

1. Backend build:
   - `cd backend && npm install && npm run build`
   - Result: ✅ Passed
2. Frontend lint:
   - `cd app && pnpm install --no-frozen-lockfile && pnpm lint`
   - Result: ❌ Failed (538 findings: 451 errors, 87 warnings)
3. Frontend tests:
   - `cd app && pnpm test --watch=false --runInBand`
   - Result: ❌ Failed (23 failed suites, 85 passed suites)

## What Looks Good

1. **TypeScript strict mode is enabled** (`app/tsconfig.json:4`), which is a strong baseline for type safety.
2. **Input validation exists for pet names** with Unicode-aware constraints (`app/src/utils/validation.ts:1-49`).
3. **Error handling is centralized** with buffered reports and optional Sentry integration (`app/src/services/ErrorService.ts:18-160`).
4. **Environment files are ignored** by git (`.gitignore:15-19`), reducing accidental secret commits.
5. **Firebase client config is sourced from environment variables** (`app/src/config/firebase.config.ts:5-12`) and not hardcoded.

## High-Priority Findings

### 1) Backend CORS is open to all origins
- Evidence: `backend/src/server.ts:14` uses `origin: true`.
- Risk: In production this may allow unintended cross-origin access.
- Recommendation: Restrict to an allowlist (production domains) via environment-based config.

### 2) Security dependencies are present but not applied
- Evidence: `@fastify/auth` and `@fastify/rate-limit` are in dependencies (`backend/package.json:16-19`), but only CORS is registered in `backend/src/server.ts:13-16`.
- Risk: If new endpoints are added, they may ship without auth/rate limiting by default.
- Recommendation: Register and enforce auth/rate-limit middleware in the server bootstrap.

### 3) Quality gate currently failing on lint
- Evidence: `pnpm lint` reports 538 total findings, including:
  - `@typescript-eslint/no-explicit-any`
  - `@typescript-eslint/no-require-imports`
  - `no-undef`
- Risk: Lower maintainability, hidden runtime defects, and noisy CI.
- Recommendation: Prioritize a lint debt reduction sprint and enforce clean lint in PR checks.

### 4) Quality gate currently failing on tests
- Evidence: `pnpm test --watch=false --runInBand` reports 23 failed suites.
- Concrete example: `app/src/services/__tests__/AudioService.test.ts` shows key mismatch (`bark/happy/meow/sad` vs `pet_bark/pet_happy/pet_meow/pet_sad`).
- Risk: Regression detection is weakened when baseline tests are red.
- Recommendation: Restore passing baseline tests, starting with deterministic/unit-level failures.

## Medium-Priority Findings

### 5) Legacy/parallel backend scripts reduce clarity
- Evidence: `backend/package.json:11-13` includes `muito:*` scripts in addition to current `src/server.ts` flow.
- Risk: Onboarding confusion and accidental execution of stale paths.
- Recommendation: Document these scripts clearly or remove if obsolete.

### 6) Browser globals used in shared RN service code
- Evidence: `app/src/services/ErrorService.ts:52-57, 63, 85` references `window`, `global`, `Event`, `PromiseRejectionEvent`.
- Risk: Environment-specific behavior and lint instability if typings/env assumptions drift.
- Recommendation: Keep platform checks strict and align ESLint env/type configs with intended runtime targets.

## Suggested Action Plan

1. **Stabilize CI first**
   - Make frontend tests pass.
   - Reduce lint errors to zero (or agreed threshold) and enforce in CI.
2. **Harden backend entrypoint**
   - Restrict CORS by environment.
   - Register auth and rate-limiting plugins before adding new endpoints.
3. **Improve maintainability**
   - Clarify or remove legacy backend scripts.
   - Keep platform-specific error handling patterns documented.

## Overall Assessment

The project has a solid structural foundation (strict TS, validation, centralized error handling), but current quality-gate failures (lint/tests) and backend default security posture (open CORS, unused security plugins) should be addressed before treating the codebase as release-ready.
