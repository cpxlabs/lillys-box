# Ralph Loops — Autonomous AI Coding with Claude Code & Opencode

## Table of Contents

1. [What is Ralph Loops?](#what-is-ralph-loops)
2. [The Methodology](#the-methodology)
3. [Ralph Loops with Claude Code](#ralph-loops-with-claude-code)
4. [Ralph Loops with Opencode](#ralph-loops-with-opencode)
5. [Ralph in Lilly's Box](#ralph-in-lillys-box)
6. [Comparison: Claude Code vs Opencode for Ralph](#comparison-claude-code-vs-opencode-for-ralph)
7. [Best Practices](#best-practices)
8. [References](#references)

---

## What is Ralph Loops?

**Ralph Loops** is an autonomous AI coding methodology created by [Geoff Huntley](https://ghuntley.com/loop/), named after Ralph Wiggum from *The Simpsons* — a character who keeps trying despite frequent failure. The core idea: instead of directing an AI coding agent step by step, you give it a goal and let it loop until it succeeds.

At its simplest:

```bash
while true; do
  cat PROMPT.md | claude
done
```

Each loop iteration reads the current state of the codebase (through git history and modified files), tries to make progress, fails or succeeds, and tries again. **Failures become data.** The agent learns from what broke in the previous iteration.

There are two distinct uses of "Ralph" in this project:

| Context | What it means |
|---|---|
| **Ralph Loops (AI methodology)** | Autonomous iterative AI coding loops (Geoff Huntley) |
| **Ralph (data pipeline)** | `scripts/ralph/` — Python pipeline tool for game analytics |

Both share the concept of **iterative automation** — run until done.

---

## The Methodology

### Core Loop

```
Read Plan → Pick Task → Implement → Test → Commit → Reset Context → Repeat
```

Ralph is monolithic: one agent, one repository, one process, completing one task per iteration.

### Key Concepts

**Completion Promise**
A specific word or phrase signaling genuine task completion. The loop only exits when Claude outputs this promise.

```
Output <promise>COMPLETE</promise> when all tasks are done.
```

**File-Based State**
Context persists across iterations via:
- Git history (agent reads its own previous commits)
- `progress.txt` — tracks completed steps
- `prd.md` / `PROMPT.md` — the source of truth for what needs to be done
- Modified files — the agent sees what it built last time

**Max Iterations**
Always set a cap. Without it, costs spiral out of control.

```bash
/ralph-loop "Migrate tests from Jest to Vitest" --max-iterations 50
```

### When to Use Ralph

| Good fit | Bad fit |
|---|---|
| Large refactors with clear success criteria | Ambiguous requirements |
| Framework migrations | Architectural decisions needing human judgment |
| API version bumps across many files | Security-sensitive code (auth, payments) |
| Mechanical, repetitive code changes | Exploratory research tasks |
| Test suite conversions | Tasks where "done" is hard to define |

---

## Ralph Loops with Claude Code

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) is Anthropic's official CLI for Claude, designed for autonomous software engineering tasks.

### Installation

```bash
npm install -g @anthropic-ai/claude-code
```

### Official Ralph Wiggum Plugin

Anthropic ships a first-party Ralph plugin. Install it inside Claude Code:

```bash
/plugin marketplace add anthropics/claude-plugins-official
/plugin install ralph-wiggum@claude-plugins-official
```

### Running the Loop

```bash
# Basic usage
/ralph-loop "Your task description here"

# With iteration limit and completion promise
/ralph-loop "Migrate all tests from Jest to Vitest" \
  --max-iterations 50 \
  --completion-promise "All tests migrated"

# With structured requirements
/ralph-loop "Implement pet analytics dashboard.
Requirements:
- Add charts for pet interaction frequency
- Show per-user stats
- Export to CSV

Success criteria:
- All requirements implemented
- Tests passing with >80% coverage
- No linter errors

Output <promise>COMPLETE</promise> when done."
```

### Cancel a Running Loop

```bash
/cancel-ralph
```

### How the Stop Hook Works

The plugin uses Claude Code's **Stop hook** to intercept the agent's exit attempts:

1. Claude works on the task
2. Claude tries to exit (thinks it's done)
3. Stop hook intercepts and inspects the output
4. If completion promise is absent → feeds the prompt back and restarts
5. If completion promise is present → allows exit

This creates a **self-referential feedback loop** entirely inside one session — no external bash scripts required.

### DIY Loop (without plugin)

For more control, run the loop externally using `PROMPT.md`:

```bash
# PROMPT.md defines your task with clear success criteria
while true; do
  cat PROMPT.md | claude --no-interactive
  if grep -q "COMPLETE" output.log; then
    break
  fi
done
```

Or use the community quickstart:

```bash
# From coleam00/ralph-loop-quickstart
./scripts/ralph/ralph.sh --tool claude --max-iterations 30
```

### Overnight / Batch Usage

```bash
#!/bin/bash
# Run multiple projects overnight
cd /path/to/lillys-box
claude -p "/ralph-loop:ralph-loop 'Implement analytics feature' --max-iterations 40"

cd /path/to/other-project
claude -p "/ralph-loop:ralph-loop 'Fix all TypeScript errors' --max-iterations 30"
```

### Cost Guidance

A 50-iteration loop on a medium codebase typically costs $50–$100+ in API usage. The `--max-iterations` flag is your primary cost control.

---

## Ralph Loops with Opencode

[Opencode](https://opencode.ai) is an open-source AI coding agent built for the terminal, created by the SST team. It supports 75+ AI providers including Anthropic Claude, making it a flexible alternative to Claude Code.

### Key Differences from Claude Code

| Feature | Claude Code | Opencode |
|---|---|---|
| Model support | Claude only | 75+ providers (Claude, GPT-4, Gemini, etc.) |
| Open source | No | Yes (MIT) |
| Interface | Terminal | TUI (Bubble Tea) + Desktop app |
| Stop hooks | Yes (for Ralph) | Via custom agents |
| Cost | API costs | API costs (any provider) |
| AGENTS.md | CLAUDE.md | AGENTS.md |

### Installation

```bash
# Via npm
npm install -g opencode-ai

# Via Homebrew
brew install opencode

# Via install script
curl -fsSL https://opencode.ai/install | bash
```

### Authenticating with Providers

```bash
# Login and configure AI provider
opencode auth login

# Or set environment variables
export ANTHROPIC_API_KEY=your_key_here
```

### Running Ralph Loops in Opencode

Opencode supports non-interactive mode for scripting, which is what Ralph leverages:

```bash
# Single task, non-interactive
opencode "Implement the pet analytics feature described in AGENTS.md"

# Loop with iteration control using a shell script
MAX_ITER=30
ITER=0
while [ $ITER -lt $MAX_ITER ]; do
  OUTPUT=$(opencode "$(cat PROMPT.md)")
  echo "$OUTPUT"
  if echo "$OUTPUT" | grep -q "COMPLETE"; then
    echo "Task completed at iteration $ITER"
    break
  fi
  ITER=$((ITER + 1))
  echo "Iteration $ITER/$MAX_ITER completed, continuing..."
done
```

### Setting Up AGENTS.md

Opencode uses `AGENTS.md` as its project configuration file (equivalent to Claude Code's `CLAUDE.md`):

```bash
# Initialize Opencode for your project
opencode init
```

This analyzes your project and creates an `AGENTS.md` file. Commit this to git so the agent understands your project structure across loop iterations.

### Configuring Custom Agents for Loops

Opencode's agent system allows creating a dedicated "ralph" agent:

```json
// .opencode/agents/ralph.json
{
  "name": "Ralph Loop Agent",
  "model": "claude-sonnet-4-6",
  "prompt": "You are an autonomous coding agent. Read PROMPT.md for your task. After each action, commit your changes with a descriptive message. When the task is fully complete, output the word COMPLETE on its own line.",
  "tools": {
    "bash": true,
    "read": true,
    "write": true,
    "edit": true
  },
  "max_iterations": 50,
  "temperature": 0.2
}
```

### Switching Between Build and Plan Modes

Opencode ships two built-in agents you can toggle with `Tab`:

- **Build** — full tool access, executes code changes
- **Plan** — read-only, analyzes and plans without executing

For Ralph loops, always use **Build** mode.

### Using Ralph with Opencode + Anthropic Claude

To use Anthropic's Claude models specifically within Opencode:

```bash
# Set provider
export ANTHROPIC_API_KEY=your_key

# Run non-interactive loop
opencode --model claude-sonnet-4-6 "$(cat PROMPT.md)"
```

---

## Ralph in Lilly's Box

This project uses Ralph in two ways:

### 1. Data Analytics Pipelines (`scripts/ralph/`)

The `scripts/ralph/` directory uses the **ralph Python tool** for processing game event data. This is separate from the AI coding loop methodology but shares the same name and concept of iterative, scheduled automation.

**Directory structure:**

```
scripts/ralph/
├── config.yml              # Pipeline definitions and schedules
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variable template
├── Makefile                # Development commands
├── setup.sh                # Environment bootstrap
├── pipelines/
│   └── game_analytics.py   # Custom event processing logic
└── tests/
    └── test_game_analytics.py
```

**What it processes:**

| Event Type | Description |
|---|---|
| `pet_feed` | Feeding interactions |
| `pet_play` | Play sessions |
| `pet_bath` | Bath minigame completions |
| `pet_vet` | Vet visit events |
| `pet_sleep` | Sleep actions |
| `pet_wardrobe` | Clothing/accessory changes |

**Running pipelines:**

```bash
cd scripts/ralph

# One-time run
ralph run config.yml --pipeline process_events

# Start scheduled loop (daily at midnight)
ralph loops start config.yml

# Check loop status
ralph loops status

# Stop the loop
ralph loops stop
```

**Key pipeline components (`pipelines/game_analytics.py`):**

```python
class GameEventProcessor:
    def parse_event(event)          # Validates fields, adds processed_at timestamp
    def filter_pet_interactions(events)  # Keeps only pet_* events
    def aggregate_by_user(events)   # Groups by user_id with stats

def transform_pet_stats(data)       # Converts raw pet data to analytics format
```

**Running tests:**

```bash
cd scripts/ralph
make test
# or
pytest tests/
```

### 2. AI Coding Loops for Game Development

The project history shows Ralph loop methodology was used during development:

```
e446f0c1  feat: add Ralph loop with limit-break to GameEventProcessor
90f6b7d5  revert: Add event queue processing with run_loop method (PR #151)
731fb791  merge: revert of ralph-loop-limit-break (PR #152)
```

This demonstrates the Ralph pattern being used to iteratively develop and refine the `GameEventProcessor` class — the agent attempted a feature, it was reverted, and another iteration approached it differently.

### PROMPT.md Template for Lilly's Box

To run a Ralph loop for game development tasks, create a `PROMPT.md`:

```markdown
# Lilly's Box Development Task

## Goal
[Describe the specific feature or fix]

## Context
- React Native + Expo project
- TypeScript strict mode
- 71 passing tests must remain passing
- Follow existing patterns in src/context/ and src/hooks/

## Success Criteria
- [ ] Feature implemented
- [ ] All 71 existing tests pass
- [ ] New tests written for new code
- [ ] No TypeScript errors
- [ ] Linter clean (ESLint + Prettier)

## Output
When all criteria are met, output: <promise>COMPLETE</promise>
```

---

## Comparison: Claude Code vs Opencode for Ralph

| Aspect | Claude Code | Opencode |
|---|---|---|
| **Ralph plugin** | Official `/ralph-loop` plugin | Manual loop scripts |
| **Stop hook support** | Built-in, zero config | Requires custom scripting |
| **Ease of setup** | One command | More configuration |
| **Model flexibility** | Claude only | Any provider |
| **Cost optimization** | Fixed to Anthropic pricing | Can switch to cheaper models |
| **Context file** | `CLAUDE.md` | `AGENTS.md` |
| **Iteration control** | `--max-iterations` flag | Shell script variable |
| **Completion detection** | `--completion-promise` | grep on output |
| **Open source** | No | Yes (MIT) |
| **Best for** | Claude-first teams | Multi-provider or open-source teams |

**Recommendation:** Use **Claude Code** if you want zero-friction Ralph loops with the official plugin. Use **Opencode** if you want model flexibility, open-source transparency, or need to run loops with providers other than Anthropic.

---

## Best Practices

### Writing Good Prompts

1. **Define "done" precisely.** Vague goals produce infinite loops.
2. **List success criteria as checkboxes.** Makes it easy for the agent to self-evaluate.
3. **Include test commands.** Tell the agent how to verify its own work (`npm test`, `pytest`, etc.).
4. **Reference existing patterns.** Point to files that demonstrate the code style expected.

### Loop Safety

```bash
# Always set iteration limits
/ralph-loop "task" --max-iterations 25

# Watch the first 2-3 iterations
# Cost monitoring: check API dashboard regularly
```

### Git Integration

- Commit after each successful iteration
- Use descriptive commit messages so the agent can read its own history
- Keep a clean working tree before starting a loop

### Context Management

- Each fresh loop session has limited context
- Use `PROMPT.md` / `AGENTS.md` as persistent "memory" across iterations
- `progress.txt` and git log serve as the agent's long-term memory

---

## References

- [everything is a ralph loop — Geoff Huntley](https://ghuntley.com/loop/)
- [Ralph Playbook — Clayton Farr](https://github.com/ClaytonFarr/ralph-playbook)
- [Ralph Wiggum Plugin — Anthropic/claude-code](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum)
- [Ralph Loop Quickstart — coleam00](https://github.com/coleam00/ralph-loop-quickstart)
- [snarktank/ralph — PRD-based loop runner](https://github.com/snarktank/ralph)
- [frankbria/ralph-claude-code — Autonomous loop with exit detection](https://github.com/frankbria/ralph-claude-code)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Opencode Documentation](https://opencode.ai/docs/)
- [Opencode GitHub](https://github.com/sst/opencode)
- [A Brief History of Ralph — HumanLayer](https://www.humanlayer.dev/blog/brief-history-of-ralph)
- [Ralph on DEV Community](https://dev.to/sivarampg/the-ralph-wiggum-approach-running-ai-coding-agents-for-hours-not-minutes-57c1)
- [openfun/ralph — Learning analytics toolbox](https://openfun.github.io/ralph/latest/)
