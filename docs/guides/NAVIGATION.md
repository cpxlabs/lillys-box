# Navigation Guide

This guide covers Lilly's Box navigation structure, common failure modes, and the quickest ways to verify fixes locally.

## Navigation Stack Overview

The app uses two navigation layers:

- **Expo Router** for top-level app routes in `/app`
- **React Navigation native stacks** inside each game navigator under `/app/src/screens/*Navigator.tsx`

Key entry points:

- `/app/_layout.tsx` — root stack, auth redirect, providers
- `/app/index.tsx` — game selection route
- `/app/game/[gameId].tsx` — dynamic game route that mounts a registered game navigator
- `/app/src/hooks/useGameBack.ts` — shared back-navigation hook used across game screens

## Expected Back Behavior

`useGameBack` should behave like this:

1. Go back inside the current nested navigator when the stack has history
2. Walk up to a parent navigator when the current stack is at its initial screen
3. On direct web entry to a nested game route, replace to a safe fallback route instead of dispatching an unhandled `GO_BACK`

Fallback rules:

- `/game/<gameId>` → `/`
- `/game/<gameId>/<screen>` → `/game/<gameId>`

This prevents blank or stuck back actions after refreshing a game page or opening a deep link directly in the browser.

## Common Web Navigation Failures

### Back button visible but not clickable

Some game home screens center their content with negative top margins. On web, that can place the content layer over the back button unless the back button stays above the content stack.

If this regresses:

- inspect the relevant `*HomeScreen.tsx`
- verify `styles.backButton` stays layered above the content block
- manually test a direct page load such as `/game/bubble-pop`

### "The action 'GO_BACK' was not handled by any navigator"

This usually means the page was loaded directly and no React Navigation stack history exists for the current route.

Check:

- `/app/src/hooks/useGameBack.ts`
- direct route fallback behavior
- whether the current navigator state index is `0`

## Local Verification

From `/app`:

```bash
corepack pnpm lint
corepack pnpm test --runInBand
corepack pnpm build:web
corepack pnpm web
```

Suggested manual checks:

1. Open the app on web
2. Enter as guest
3. Open a game from the main selection screen
4. Use the in-game back button
5. Refresh a direct game URL like `/game/bubble-pop`
6. Confirm back returns to the correct safe route

## Related Files

- `app/app/_layout.tsx`
- `app/app/game/[gameId].tsx`
- `app/src/hooks/useGameBack.ts`
- `app/src/screens/GameSelectionScreen.tsx`
