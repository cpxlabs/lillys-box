# Fastify Backend Migration Plan

## Current Architecture

Pet Care Game is a fully client-side React Native / Expo application. There is no backend server. All state lives on the device:

| Concern | Current Implementation |
|---|---|
| Authentication | Google Sign-In (mobile) / demo user (web), state persisted in AsyncStorage |
| Pet & game data | Stored in AsyncStorage, keyed per user (`@pet_care_game:pet:{userId}`) |
| Ad management | Client-side AdMob SDK (rewarded + interstitial) |
| Language preference | AsyncStorage key `@pet_care_language` |
| Best scores (Muito) | AsyncStorage key `@muito_game:bestScore:{userId}` |
| Data migration | Client-side schema versioning in `src/utils/migration.ts` |

Because every piece of persistent state lives on the device, users cannot sync across devices, data is lost on an app reinstall, and there is no server-side validation or analytics collection.

---

## Pros of Moving to Fastify

### 1. Performance
Fastify is consistently the fastest Node.js HTTP framework in independent benchmarks. Its serialisation layer (`fast-json-stringify`) and low-overhead routing make it well-suited to the lightweight, high-frequency payloads this app will produce (stat updates, score submissions, sync polls).

### 2. Schema-first validation built in
Fastify uses JSON Schema natively for request and response validation through `ajv`. Every route can declare its expected input and output shape at definition time, which catches malformed payloads before they reach application logic. This is especially important for the pet-stat and game-score endpoints, where invalid data could corrupt user state.

### 3. Plugin architecture
Fastify's encapsulation model (`fastify.register`) keeps plugins isolated by default. Auth, database access, CORS, and rate-limiting can each live in their own plugin and be composed cleanly. This maps well onto the existing Context-based separation in the frontend (`AuthContext`, `PetContext`, `AdContext`, etc.).

### 4. TypeScript support
The project already runs strict TypeScript (`"strict": true` in `tsconfig.json`). Fastify ships with first-class TypeScript typings. Route handlers, schemas, and plugin signatures can all be fully typed with no additional scaffolding.

### 5. Cross-device sync
Moving persistent state to a server database enables users to sign in on a second device and continue where they left off — currently impossible because all data is in AsyncStorage.

### 6. Server-side leaderboards and analytics
Score validation and leaderboard aggregation require a trusted data store. Fastify keeps the API thin and lets the database layer handle the heavy lifting.

### 7. Centralised data migration
Schema migrations currently run on every client at app-start (`src/utils/migration.ts`). A server-side migration runner (e.g., Knex migrations or Prisma migrations) runs once and applies to all users simultaneously.

---

## Cons of Moving to Fastify

### 1. Introduces operational overhead
The project currently ships as a single Expo bundle with zero servers to maintain. Adding Fastify means deploying, monitoring, and maintaining at least one backend service and a database.

### 2. Network dependency
The app currently works fully offline. Once data lives on a server, connectivity becomes a hard requirement for any write operation unless an offline-first sync strategy (e.g., conflict-free replicated data types or a local-first queue) is also built.

### 3. Migration scope for existing users
Any users who already have pet data in AsyncStorage will need a one-time client-side migration that uploads their local state to the new backend. This migration path must be designed, tested, and shipped alongside the new API — otherwise existing players lose their pets on update.

### 4. Authentication surface area increases
Right now auth state is a simple local flag. A Fastify backend needs token issuance (JWT or session cookies), refresh-token rotation, and Google OAuth callback handling on the server. Each of those is an additional attack surface to harden.

### 5. Cost and complexity for a small dataset
Each user's dataset is tiny (one pet object, one best-score integer, one language string). A full relational or document database may be more infrastructure than the data warrants. A lightweight option like SQLite via `better-sqlite3` or a managed service like PlanetScale can mitigate this, but it is still more moving parts than AsyncStorage.

### 6. Latency sensitivity on stat updates
Pet stats decay continuously and the client writes updates frequently (debounced to once per second in `src/context/PetContext.tsx`). Pushing every tick to a remote server would add latency and battery drain. The client will still need to own the real-time simulation loop and batch or throttle writes to the server.

### 7. Plugin ecosystem maturity vs. Express
Express has a larger plugin ecosystem by volume. Some niche integrations may require wrapping an Express-oriented library rather than using an off-the-shelf Fastify plugin.

---

## Migration Plan

### Phase 1 — Project scaffolding and tooling

| Step | Action | Files / Notes |
|---|---|---|
| 1.1 | Create a `backend/` directory at the repo root with its own `package.json`. | Keeps the Expo frontend untouched during development. |
| 1.2 | Add Fastify and its core plugins as dependencies. | `fastify`, `fastify-plugin`, `@fastify/cors`, `@fastify/auth`, `@fastify/rate-limit` |
| 1.3 | Choose and add a database driver. | `better-sqlite3` for local / CI development; swap to a managed Postgres driver (`pg` or `@prisma/client`) before production. |
| 1.4 | Set up TypeScript compilation for the backend (`tsconfig.json` inside `backend/`). | Mirror the strict settings already used in the frontend. |
| 1.5 | Add a `backend` script to the root `package.json` so both frontend and backend can be started from the workspace root. | e.g., `"backend:dev": "node --loader ts-node/esm backend/src/server.ts"` |

### Phase 2 — Database schema and migrations

| Step | Action | Files / Notes |
|---|---|---|
| 2.1 | Define the initial schema covering the data currently in AsyncStorage. | Tables: `users`, `pets`, `game_scores`, `preferences`. Map each AsyncStorage key to a column or row. |
| 2.2 | Write a migration runner (Knex or Prisma migrations). | Provides a reproducible, version-controlled path for every schema change going forward — replacing `src/utils/migration.ts` on the server side. |
| 2.3 | Seed the database with test data for local development. | Cover at least one user with a pet in every stat-range bucket so the decay logic can be verified end-to-end. |

### Phase 3 — Core API routes

| Step | Action | Fastify Route(s) | Maps to current |
|---|---|---|---|
| 3.1 | Auth routes | `POST /auth/google/callback`, `POST /auth/guest`, `POST /auth/logout` | `AuthContext` + `authStorage.ts` |
| 3.2 | Pet CRUD | `GET /pets/:userId`, `POST /pets`, `PUT /pets/:petId`, `DELETE /pets/:petId` | `PetContext` + `storage.ts` |
| 3.3 | Game scores | `GET /scores/:userId/:game`, `PUT /scores/:userId/:game` | `MuitoContext` |
| 3.4 | Preferences | `GET /preferences/:userId`, `PUT /preferences/:userId` | `LanguageContext` |

Each route group is implemented as a Fastify plugin and registered under a common prefix (e.g., `/api/v1`). JSON Schema is declared on every route for automatic validation.

### Phase 4 — Authentication and authorisation

| Step | Action | Notes |
|---|---|---|
| 4.1 | Implement Google OAuth server-side callback. | Exchange the code received from Google for an id-token; extract the user identity; persist it in the `users` table. |
| 4.2 | Issue short-lived JWTs on successful login. | Use `@fastify/jwt` or an equivalent. Include `userId` in the payload. |
| 4.3 | Add a refresh-token flow. | Rotate refresh tokens on each use; store them server-side so they can be revoked. |
| 4.4 | Protect pet and score routes with a JWT pre-handler. | Fastify's `onRequest` hook or `@fastify/auth` decorator makes this one line per route group. |
| 4.5 | Keep guest mode functional. | Issue a short-lived, non-renewable token for guest sessions; data created in guest mode is ephemeral. |

### Phase 5 — Frontend integration

| Step | Action | Notes |
|---|---|---|
| 5.1 | Add an HTTP client to the frontend. | `axios` or the native `fetch` API. Wrap it in a small service class so the base URL and default headers (Authorization) are configured once. |
| 5.2 | Replace AsyncStorage writes in `PetContext` with API calls. | Keep the existing debounce; batch stat changes into a single `PUT /pets/:petId` call per tick. |
| 5.3 | Replace `MuitoContext` score persistence with `PUT /scores`. | |
| 5.4 | Replace `LanguageContext` persistence with `PUT /preferences`. | |
| 5.5 | Replace `AuthContext` / `authStorage.ts` with server-issued JWTs. | Store the access token in memory; store the refresh token in AsyncStorage (it is opaque to the app and short-lived). |

### Phase 6 — One-time client data migration

| Step | Action | Notes |
|---|---|---|
| 6.1 | Add a `POST /migration/upload` endpoint that accepts the full AsyncStorage payload for a user. | Validates the payload against the same schema used for normal writes. |
| 6.2 | On app update, detect the presence of legacy AsyncStorage keys. | If found and the user is authenticated, upload once, then delete the local keys. |
| 6.3 | Show the user a one-time migration progress indicator. | Failure must be retryable; the local data must not be deleted until the upload succeeds. |

### Phase 7 — Offline resilience (optional follow-up)

| Step | Action | Notes |
|---|---|---|
| 7.1 | Implement a local write queue. | Stat-update and score-update calls that fail due to no network are queued in AsyncStorage and replayed when connectivity returns. |
| 7.2 | Add a last-write-wins conflict resolution policy for pet state. | The server stores a `updatedAt` timestamp; the client sends its own `updatedAt` with every write; the server rejects stale writes with `409 Conflict`. |

### Phase 8 — Testing and CI

| Step | Action | Notes |
|---|---|---|
| 8.1 | Write unit tests for each route plugin using `fastify.inject()`. | No network I/O; fast feedback loop. Pair with the existing Jest setup. |
| 8.2 | Add integration tests that spin up an in-memory SQLite database. | Verify the full request → validation → handler → DB → response path. |
| 8.3 | Add the backend test suite to the existing CI pipeline (`test:ci` script). | |

### Phase 9 — Deployment

| Step | Action | Notes |
|---|---|---|
| 9.1 | Containerise the backend with a minimal Dockerfile. | Use a multi-stage build; the final image only needs the compiled JS and `node_modules`. |
| 9.2 | Deploy to a managed platform (Fly.io, Railway, Render, or equivalent). | Start with a single instance; scale later if needed. |
| 9.3 | Swap the SQLite driver for a managed Postgres instance. | Update the connection string via an environment variable; no application-code changes. |
| 9.4 | Point the frontend's base URL at the deployed backend. | Use an environment variable (`EXPO_PUBLIC_API_URL`) already supported by Expo. |

---

## Suggested Dependency Additions (backend/)

| Package | Role |
|---|---|
| `fastify` | HTTP framework |
| `@fastify/cors` | CORS policy |
| `@fastify/auth` | Route-level auth decorators |
| `@fastify/jwt` | JWT signing and verification |
| `@fastify/rate-limit` | Brute-force protection on auth routes |
| `better-sqlite3` | SQLite driver for local development |
| `pg` | Postgres driver for production |
| `knex` | Query builder and migration runner |
| `uuid` | Server-side ID generation (already a frontend dep) |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Existing users lose pet data on update | Medium | High | Phase 6 upload flow; do not delete local keys until upload confirms |
| Latency on stat writes degrades feel | Medium | Medium | Keep client-side simulation loop; batch and throttle writes |
| Auth token interception | Low | High | HTTPS everywhere; short-lived access tokens; refresh-token rotation |
| Backend outage blocks gameplay | Low | High | Phase 7 offline queue; graceful degradation UI |
| SQLite not suitable for concurrent writes at scale | High (if multi-instance) | Medium | Use Postgres in production; SQLite only for local dev and CI |
