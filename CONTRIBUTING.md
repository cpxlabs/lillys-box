# Contributing to Pet Care Game

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

See [app/docs/WEB_BUILD_QUICK_START.md](./app/docs/WEB_BUILD_QUICK_START.md) for web build instructions.
