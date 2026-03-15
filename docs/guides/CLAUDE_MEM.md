# Claude-Mem Setup Guide

[claude-mem](https://github.com/thedotmack/claude-mem) is a persistent memory plugin for [Claude Code](https://claude.com/claude-code) that automatically preserves context across coding sessions.

## What It Does

- **Automatic Event Capture** — Tracks tool usage, file edits, and decisions during Claude Code sessions
- **AI-Powered Summarization** — Compresses observations into meaningful summaries
- **Persistent Memory** — Stores context in a local SQLite + vector database
- **Context Injection** — Relevant history is automatically injected into new sessions
- **Privacy Control** — Use `<private>` tags to exclude sensitive content from storage

## Prerequisites

- [Claude Code](https://claude.com/claude-code) (latest version with plugin support)
- Node.js 18.0.0 or higher

## Installation

Open a Claude Code session in your terminal and run:

```
/plugin marketplace add thedotmack/claude-mem

/plugin install claude-mem
```

Then restart Claude Code. That's it — context from previous sessions will automatically appear in new sessions.

> **Note:** Do **not** use `npm install -g claude-mem` — that installs the SDK only, not the full plugin with hooks and worker service. Always use the `/plugin` commands above.

## How It Works

After installation, claude-mem runs automatically:

1. **SessionStart** — Loads relevant context from previous sessions
2. **PostToolUse** — Captures observations about tool usage during the session
3. **SessionEnd** — Generates a summary of the session

All data is stored locally in `~/.claude-mem/` on your machine. The `.claude-mem/` directory is in the project's `.gitignore` to prevent any local data from being committed.

## Web Viewer

claude-mem includes a local web viewer at [http://localhost:37777](http://localhost:37777) where you can browse the memory stream, search past observations, and manage settings.

## MCP Search Tools

claude-mem provides search tools for querying your project history:

1. **`search`** — Search memory index with full-text queries
2. **`timeline`** — Get chronological context around an observation
3. **`get_observations`** — Fetch full observation details by ID

## Project Configuration

This project is already configured for claude-mem:

- `.gitignore` includes `.claude-mem/` to prevent committing local memory data
- `CLAUDE.md` at the root provides project context that claude-mem enhances
- `.claude/` directory contains Claude Code settings and memory files
- `app/.claudeignore` excludes large/non-code files from Claude Code context

## Troubleshooting

If you experience issues, describe the problem to Claude in a Claude Code session — the troubleshoot skill will automatically diagnose and fix common issues.

For more help:

- [Claude-Mem Documentation](https://docs.claude-mem.ai/)
- [Troubleshooting Guide](https://docs.claude-mem.ai/troubleshooting)
- [GitHub Issues](https://github.com/thedotmack/claude-mem/issues)

## Useful Links

- [Getting Started](https://docs.claude-mem.ai/usage/getting-started)
- [Search Tools Guide](https://docs.claude-mem.ai/usage/search-tools)
- [Configuration Guide](https://docs.claude-mem.ai/configuration)
- [Architecture Overview](https://docs.claude-mem.ai/architecture/overview)
