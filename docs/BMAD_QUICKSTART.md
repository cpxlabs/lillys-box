# BMAD Quick Start Guide

**For**: Pet Care Game Development Team
**Last Updated**: 2026-01-21

---

## 🚀 Get Started in 5 Minutes

### What is BMAD?
BMAD (Breakthrough Method for Agile AI Driven Development) is an AI-driven framework that helps plan, implement, and test features more systematically.

**Key Benefit**: Plan before you code, test before you ship, document as you go.

---

## 📦 Installation

```bash
# Install BMAD CLI globally
npm install -g @bmad/cli

# Verify installation
bmad --version

# Initialize in project
cd /home/user/pet-care-game
bmad init --type brownfield
```

---

## 🎯 When to Use BMAD?

### Quick Flow (60% of work)
**Use for**: Small changes, <1 day
- Adding new clothing/food items
- Minor UI fixes
- Configuration updates

**Command**:
```bash
bmad dev-story --quick-flow --title "Add cat hat accessory"
```

### BMad Method (35% of work)
**Use for**: Medium-large features, 3-7 days
- New game activities
- Architecture changes
- Major refactors

**Command**:
```bash
bmad prd --feature "pet-breeding"
bmad create-architecture --feature "pet-breeding"
bmad create-epics-and-stories --epic "pet-breeding"
bmad dev-story --story "PB-001"
```

### Enterprise (5% of work)
**Use for**: Critical/compliance, 4+ weeks
- Production releases
- COPPA compliance changes
- Major version releases

---

## 📝 Common Workflows

### 1. Small Feature (Quick Flow)

```bash
# Start story
bmad dev-story --quick-flow --title "Add fish treat food"

# Follow TDD cycle:
# 1. Write test
npm test -- foodItems.test.ts --watch

# 2. Implement
# Edit src/data/foodItems.ts

# 3. Test passes? Commit!
git add .
git commit -m "feat: add fish treat food item"

# Mark complete
bmad complete-story --story "fish-treat"
```

**Time**: 1-2 hours

---

### 2. Medium Feature (BMad Method)

```bash
# Step 1: Create PRD (Product Requirements)
bmad prd --feature "mini-games"
# Output: docs/bmad/prds/PRD_MINI_GAMES.md
# Review: Does this match what we want?

# Step 2: Design Architecture
bmad create-architecture --feature "mini-games"
# Output: docs/bmad/architecture/ADR_003_MINI_GAMES.md
# Review: Is this the right technical approach?

# Step 3: Plan Tests (BEFORE coding!)
bmad create-test-strategy --feature "mini-games"
# Output: docs/bmad/test-strategies/TEST_STRATEGY_MINI_GAMES.md
# Review: Will these tests prove it works?

# Step 4: Break into Stories
bmad create-epics-and-stories --epic "mini-games"
# Output: .bmad/tracking/EPIC_MINI_GAMES.md
# Review: Are these stories implementable in 1-2 days each?

# Step 5: Implement Each Story
bmad dev-story --story "MG-001-catch-ball-game"
# Follow TDD cycle guided by BMAD

# Step 6: Document and Wrap Up
bmad document-changes --epic "mini-games"
bmad retrospective --sprint "2026-01-week5"
```

**Time**: 3-7 days

---

## 🧪 Test-Driven Development (TDD) with BMAD

BMAD encourages **test-first development**:

```bash
# 1. BMAD generates test template
bmad dev-story --story "STORY-001"
# Creates: src/components/__tests__/NewComponent.test.tsx

# 2. Write failing test
describe('NewComponent', () => {
  it('should render with correct props', () => {
    const { getByText } = render(<NewComponent name="Fluffy" />);
    expect(getByText('Hello Fluffy')).toBeTruthy();
  });
});

# 3. Run test (fails)
npm test -- NewComponent.test.tsx --watch

# 4. Implement minimal code to pass
export const NewComponent = ({ name }: { name: string }) => {
  return <Text>Hello {name}</Text>;
};

# 5. Test passes! Refactor if needed

# 6. Commit
git add .
git commit -m "feat: add NewComponent with name prop"
```

**Why TDD?**
- Catches bugs before they exist
- Ensures code is testable
- Documents expected behavior
- Maintains 99%+ test coverage

---

## 📚 Generated Documentation

BMAD creates structured docs in `docs/bmad/`:

```
docs/bmad/
├── prds/                  # Product Requirements
│   └── PRD_FEATURE.md
├── architecture/          # Architecture Decisions
│   └── ADR_001_TOPIC.md
├── test-strategies/       # Test Plans
│   └── TEST_STRATEGY_FEATURE.md
└── retrospectives/        # Sprint Retros
    └── RETRO_2026_01_WEEK4.md
```

**These docs are valuable for**:
- Onboarding new developers
- Remembering why decisions were made
- Planning future changes

---

## ✅ Quality Gates

BMAD automatically checks:

| Gate | Command | Threshold |
|------|---------|-----------|
| Test Coverage | `bmad coverage-check` | >80% |
| TypeScript | `tsc --noEmit` | 0 errors |
| ESLint | `npm run lint` | 0 errors (warnings OK) |
| Prettier | `npm run format:check` | All files formatted |

**Run all gates**:
```bash
bmad validate
```

---

## 🎓 Learn By Doing: First BMAD Feature

Let's add a **"Celebrate" button** to the HomeScreen (Quick Flow):

### Step 1: Start Story
```bash
bmad dev-story --quick-flow --title "Add celebrate button to HomeScreen"
```

### Step 2: BMAD Asks Questions
```
Q: What does this feature do?
A: Adds a button that plays a celebration animation when pressed

Q: Where will it be implemented?
A: src/screens/HomeScreen.tsx

Q: What tests are needed?
A: Button renders, pressing triggers animation, increases happiness +5
```

### Step 3: BMAD Creates Checklist
```
[x] Write test: Button renders with correct label
[x] Write test: onPress triggers animation
[x] Write test: Happiness increases by 5
[ ] Implement: Add IconButton to HomeScreen
[ ] Implement: Create celebration animation
[ ] Implement: Update pet happiness state
[ ] Commit with message: "feat: add celebrate button to HomeScreen"
```

### Step 4: Follow TDD Cycle
```bash
# Write tests first
npm test -- HomeScreen.test.tsx --watch

# Implement
# Edit src/screens/HomeScreen.tsx

# Tests pass? Commit!
git add .
git commit -m "feat: add celebrate button with animation and +5 happiness"
```

### Step 5: Mark Complete
```bash
bmad complete-story --story "celebrate-button"
```

**Total Time**: ~1 hour
**Result**: Feature implemented with tests, documented, tracked

---

## 🤔 FAQs

### Q: Does BMAD replace our current process?
**A**: No, it enhances it. You can still create docs manually. BMAD adds structure and automation.

### Q: Is BMAD required for all features?
**A**: No. Use it when it adds value. Small fixes can skip BMAD.

### Q: What if BMAD suggests something wrong?
**A**: You're in control. BMAD suggests, you decide. Edit generated docs as needed.

### Q: Can I use BMAD with existing features?
**A**: Yes! Use `bmad document-project --file "path/to/file.ts"` to document existing code.

### Q: How much time does BMAD add?
**A**: Planning adds ~10% upfront, but saves time by catching issues early.

---

## 📖 More Resources

- **Full Implementation Plan**: [docs/BMAD_IMPLEMENTATION_PLAN.md](./BMAD_IMPLEMENTATION_PLAN.md)
- **BMAD Official Docs**: https://docs.bmad-method.org/
- **Sample Workflows**: See "Sample Workflows" section in implementation plan

---

## 🆘 Getting Help

- **Command help**: `bmad --help` or `bmad <command> --help`
- **Project issues**: Create GitHub issue with `bmad` label
- **BMAD community**: [Discord/Slack if available]

---

**Ready to try BMAD?** Start with a Quick Flow feature and see how it feels!

```bash
bmad dev-story --quick-flow --title "Your first BMAD feature"
```
