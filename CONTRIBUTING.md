# Contributing to Lilly's Box

## Repository

**URL:** https://github.com/cpxlabs/lillys-box

## Required Tools

### Git CLI (gh)

This repository requires the use of `gh` (GitHub CLI) for all git operations instead of native `git` commands.

#### Why gh?

- The repository uses `gh` for authentication
- Ensures consistent authentication across all contributors
- Required for pushing to the remote repository

#### Installation

```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Windows
winget install GitHub.cli
```

#### Authentication

```bash
gh auth login
```

Select the following options:
- GitHub.com: `Login with a web browser`
- HTTPS: `Yes`
- Authentication: `Login with a web browser`

#### Common Commands

```bash
# Push changes
gh auth setup-git && git push

# Pull changes
git pull

# Create a branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "description"
git push
```

#### Troubleshooting

If you encounter authentication errors:

```bash
# Check authentication status
gh auth status

# Re-authenticate if needed
gh auth logout
gh auth login

# Setup git credential helper
gh auth setup-git
```

## Development

See [docs/guides/BUILD.md](./docs/guides/BUILD.md) for detailed build and development instructions.

### Quick Start

```bash
# Install dependencies (from /app)
cd app && pnpm install

# Start development server
npx expo start

# Run tests
npm test

# Lint
npm run lint
```

## Code Style

- **Language**: TypeScript (strict mode enabled)
- **Linter**: ESLint — run `npm run lint` from `/app` before submitting
- **Formatter**: Prettier — run `npm run format` from `/app`
- **Unused variables**: Prefix with `_` (e.g., `_unusedParam`) or remove
- **Imports**: Keep sorted; remove unused imports
- **Naming**: `camelCase` for variables/functions, `PascalCase` for components/types
- **Files**: Component files use `PascalCase.tsx`, utilities use `camelCase.ts`

## Branch Naming

Use the following prefixes:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New feature | `feature/kids-chess-game` |
| `fix/` | Bug fix | `fix/auth-token-refresh` |
| `docs/` | Documentation only | `docs/update-api-reference` |
| `chore/` | Maintenance/tooling | `chore/upgrade-expo-sdk` |
| `refactor/` | Code refactor (no behavior change) | `refactor/extract-game-hook` |

## Commit Messages

Write clear, concise commit messages:

```
<type>: <short description>

# Examples:
feat: add Kids Chess mini-game
fix: correct pet hunger decay rate
docs: update authentication setup guide
chore: remove unused dependencies
test: add WhackAMole game screen tests
refactor: extract useGameBestScore hook
```

**Types**: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `style`, `perf`

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear commits
3. Ensure lint passes: `npm run lint` (0 errors, 0 warnings)
4. Ensure tests pass: `npm test -- --runInBand`
5. Verify locale parity: `npm run check-locale` (if adding translated strings)
6. Push your branch and open a PR
7. Fill in the PR description with what changed and why
8. Request review from a maintainer

## Adding a New Game

See [docs/guides/GAME_CREATION.md](./docs/guides/GAME_CREATION.md) for the full guide. In summary, each new game requires:

1. Four source files: Context, Navigator, HomeScreen, GameScreen
2. Registration in `gameRegistrations.ts`
3. Navigation types in `navigation.ts`
4. Locale keys in both `en.json` and `pt-BR.json`
5. Run `npm run check-locale` to verify key parity

## Resources

- [Full Documentation](./docs/README.md)
- [Build Guide](./docs/guides/BUILD.md)
- [Game Creation Guide](./docs/guides/GAME_CREATION.md)
- [Testing Guide](./docs/testing/TESTING.md)
- [Code Review & Roadmap](./docs/technical/CODE_REVIEW.md)
