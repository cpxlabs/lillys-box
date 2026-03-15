# Lilly's Box — Claude Code Project Context

## Overview

Lilly's Box is a children's interactive platform built with React Native (Expo) and TypeScript. Players care for virtual pets and enjoy 36+ mini-games. The app supports Android, iOS, and Web.

## Monorepo Structure

This is a **pnpm workspace** monorepo:

- `app/` — Main React Native (Expo) application
- `backend/` — Node.js backend services
- `docs/` — Project documentation
- `scripts/` — Build and CI scripts

## Quick Commands

```bash
# Install all dependencies (from root)
pnpm install

# App commands (from /app)
cd app
corepack pnpm lint           # ESLint
corepack pnpm test --runInBand  # Jest tests (run serially)
corepack pnpm build:web      # Expo web build
npx expo start               # Dev server

# Backend commands (from /backend)
cd backend
npm install && npm run build && npm test
```

## Key Technologies

- **React Native 0.77** with **Expo SDK 55** and **Expo Router**
- **TypeScript** in strict mode
- **React 19** with Context API for state management
- **React Native Reanimated 4** for animations
- **Jest 30** + React Native Testing Library for tests
- **ESLint + Prettier** for code quality
- **i18next** for internationalization (English + Portuguese Brazil)

## Code Conventions

- Use `camelCase` for variables/functions, `PascalCase` for components/types
- Component files: `PascalCase.tsx`, utilities: `camelCase.ts`
- Prefix unused variables with `_` (e.g., `_unusedParam`)
- Keep imports sorted; remove unused imports
- Commit messages: `<type>: <short description>` (feat, fix, docs, chore, test, refactor)

## Game System

Games are registered in `app/src/gameRegistrations.ts` with 6 categories: pet, casual, puzzle, adventure, emulator, board. Each game needs: Context, Navigator, HomeScreen, GameScreen, plus registration and locale keys.

## Testing

- Run tests serially with `--runInBand` to avoid memory issues
- Tests use `@testing-library/react-native` and `react-test-renderer`
- `react-test-renderer` must be pinned to match the exact React version

## Claude-Mem Integration

This project supports [claude-mem](https://github.com/thedotmack/claude-mem) for persistent memory across Claude Code sessions. See [docs/guides/CLAUDE_MEM.md](./docs/guides/CLAUDE_MEM.md) for setup instructions.
