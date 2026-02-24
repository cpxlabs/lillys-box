# BMAD Method Implementation Plan - Pet Care Game

**Created**: 2026-01-21
**Status**: 🔵 Planning Complete - Ready for Implementation
**Priority**: 🟡 Medium (Enhancement to existing workflow)
**Project Type**: Brownfield Integration
**Estimated Implementation Time**: 2-3 days (initial setup), Ongoing (workflow adoption)

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [What is BMAD Method?](#what-is-bmad-method)
3. [Why BMAD for Pet Care Game?](#why-bmad-for-pet-care-game)
4. [Current vs BMAD Approach](#current-vs-bmad-approach)
5. [Track Selection](#track-selection)
6. [Installation & Setup](#installation--setup)
7. [Workflow Integration](#workflow-integration)
8. [Agent Configuration](#agent-configuration)
9. [Documentation Structure](#documentation-structure)
10. [Phased Adoption Plan](#phased-adoption-plan)
11. [Sample Workflows](#sample-workflows)
12. [Success Metrics](#success-metrics)
13. [Migration Path](#migration-path)

---

## Executive Summary

This document outlines the integration of **BMAD Method** (Breakthrough Method for Agile AI Driven Development) into the Pet Care Game project. BMAD is an AI-driven development framework that enhances project planning, implementation, and quality assurance through specialized agents and structured workflows.

**Key Benefits for Pet Care Game:**
- ✅ Enhanced planning and architecture for complex features (e.g., Skia Bath Reimplementation)
- ✅ Structured approach to test-driven development (building on existing 99% test pass rate)
- ✅ Better epic/story breakdown for large initiatives
- ✅ Improved collaboration through agent-based workflows
- ✅ Brownfield-specific workflows for existing codebase maintenance
- ✅ Quality gates and validation at each development phase

**Implementation Approach:** Brownfield integration - BMAD will enhance existing workflows without disrupting current development patterns.

---

## What is BMAD Method?

BMAD (Breakthrough Method for Agile AI Driven Development) is an AI-driven framework that provides:

### Core Components

1. **Specialized Agents**
   - **PM (Product Manager)**: Requirements gathering, PRD creation
   - **Architect**: System design, technology selection, architecture decisions
   - **DEV (Developer)**: Implementation, code quality, refactoring
   - **SM (Scrum Master)**: Sprint planning, ceremony management, team coordination
   - **TEA (Test Architect)**: Test strategy, quality gates, test implementation
   - **UX Designer**: User experience, wireframes, interaction design
   - **Analyst**: Data analysis, technical research, feasibility studies

2. **Four-Phase Methodology**
   - **Analysis Phase** (Optional): Requirements analysis, feasibility studies
   - **Planning Phase** (Required): Architecture, epics, stories, estimates
   - **Solutioning Phase** (Track-dependent): Detailed design, prototyping
   - **Implementation Phase** (Required): Development, testing, deployment

3. **Three Tracks**
   - **Quick Flow**: Simple features, small changes (1-2 days)
   - **BMad Method**: Complex features, architecture changes (1-4 weeks)
   - **Enterprise**: Mission-critical, compliance-heavy (4+ weeks)

4. **Guided Workflows**
   - `*prd`: Create Product Requirements Documents
   - `*create-architecture`: Design system architecture
   - `*create-epics-and-stories`: Break down work into manageable units
   - `*dev-story`: Implement individual user stories
   - `*document-project`: Document existing codebase (brownfield)
   - `*workflow-init`: Initialize BMAD tracking

---

## Why BMAD for Pet Care Game?

### Current Project State
- ✅ Well-structured codebase with clear separation of concerns
- ✅ 99% test pass rate (71/72 tests)
- ✅ Comprehensive documentation culture
- ✅ Active roadmap with prioritized features
- ✅ Existing implementation planning process

### Challenges BMAD Can Address

1. **Complex Feature Planning**
   - Current: Manual planning documents (e.g., SKIA_BATH_REIMPLEMENTATION_PLAN.md)
   - BMAD: Structured workflows with architect review and validation

2. **Test-First Development**
   - Current: Tests exist but may be written after implementation
   - BMAD: TEA agent ensures test strategy before development

3. **Epic/Story Breakdown**
   - Current: Large features tracked in ROADMAP.md as task lists
   - BMAD: Structured epic/story creation with estimates and dependencies

4. **Code Review & Quality Gates**
   - Current: Manual review process
   - BMAD: Built-in quality gates at each phase

5. **Knowledge Transfer**
   - Current: Documentation exists but may lag behind implementation
   - BMAD: Documentation is part of each workflow phase

### Brownfield-Specific Benefits

- `*document-project`: Scan and document existing codebase systematically
- `*refactor`: Structured approach to technical debt (e.g., remaining JS to TS conversion)
- `*tech-debt`: Track and prioritize technical debt alongside features
- Incremental adoption without disrupting current workflows

---

## Current vs BMAD Approach

### Current Workflow (Example: Adding a New Feature)

```
1. Idea/requirement identified in ROADMAP.md
2. Create implementation plan document (docs/FEATURE_PLAN.md)
3. Implement feature
4. Write tests (if time permits)
5. Update documentation
6. Mark complete in ROADMAP.md
```

### BMAD-Enhanced Workflow

```
Phase 1: Planning
├─ *prd (PM): Document requirements with acceptance criteria
├─ *create-architecture (Architect): Design system changes
├─ *create-test-strategy (TEA): Define test approach BEFORE coding
└─ *create-epics-and-stories (SM): Break into implementable units

Phase 2: Implementation (per story)
├─ *dev-story (DEV): Implement with TDD approach
├─ Code Review: Automated quality gates
└─ *test-implementation (TEA): Validate test coverage

Phase 3: Completion
├─ *document-changes (PM): Update user-facing docs
├─ *retrospective (SM): Capture learnings
└─ Mark complete in tracking system
```

**Key Difference**: BMAD ensures test strategy and architecture review BEFORE coding begins.

---

## Track Selection

### Decision Matrix for Pet Care Game

| Feature Type | Complexity | Timeline | Track | Example |
|-------------|-----------|---------|-------|---------|
| Bug fix | Low | <1 day | Quick Flow | Fix button alignment |
| Small enhancement | Low-Medium | 1-2 days | Quick Flow | Add new clothing item |
| New activity | Medium | 3-7 days | BMad Method | Add "grooming" activity |
| Architecture change | High | 1-4 weeks | BMad Method | Skia Bath Reimplementation |
| Production release | Critical | 4+ weeks | Enterprise | Google Play Store launch |

### Recommended Track Usage

**Quick Flow** (60% of features)
- Simple UI changes
- Configuration updates
- Minor bug fixes
- Content additions (sprites, translations)

**BMad Method** (35% of features)
- New game activities
- Major refactors
- Performance optimizations
- New systems (e.g., pet breeding)

**Enterprise** (5% of features)
- Production deployment
- Major version releases
- Compliance requirements (COPPA)
- Breaking changes

---

## Installation & Setup

### Step 1: Install BMAD CLI

```bash
# Install BMAD CLI globally
npm install -g @bmad/cli

# Or use npx (no installation)
npx @bmad/cli --version
```

### Step 2: Initialize BMAD in Project

```bash
# Navigate to project root
cd /home/user/pet-care-game

# Initialize BMAD (creates .bmad directory and config)
npx @bmad/cli init --type brownfield

# This will create:
# - .bmad/config.yml (BMAD configuration)
# - .bmad/agents/ (Agent configurations)
# - .bmad/workflows/ (Workflow templates)
# - .bmad/tracking/ (Feature tracking database)
```

### Step 3: Configure BMAD for Project

**Edit**: `.bmad/config.yml`

```yaml
project:
  name: "Pet Care Game"
  type: "brownfield"
  tech_stack:
    - "React Native"
    - "TypeScript"
    - "Expo"
    - "Jest"
    - "React Navigation"

  documentation:
    location: "docs/"
    format: "markdown"

  testing:
    framework: "jest"
    coverage_target: 80
    current_coverage: 99

  structure:
    source: "src/"
    tests: "src/**/__tests__"
    assets: "assets/"

agents:
  enabled:
    - PM
    - Architect
    - DEV
    - TEA
    - SM

  optional:
    - UX Designer (for complex UI features)
    - Analyst (for performance analysis)

workflows:
  default_track: "bmad_method"

  quick_flow_threshold:
    complexity: "low"
    estimated_hours: 8

  quality_gates:
    - name: "Test Coverage"
      threshold: 80
      blocking: true

    - name: "TypeScript Strict"
      enabled: true
      blocking: true

    - name: "ESLint"
      blocking: false
      warn_only: true

tracking:
  integration: "github_issues"
  labels:
    - "bmad-quick-flow"
    - "bmad-method"
    - "bmad-enterprise"
```

### Step 4: Integrate with Existing Tools

```bash
# Add BMAD scripts to package.json
npm pkg set scripts.bmad:init="npx @bmad/cli workflow-init"
npm pkg set scripts.bmad:story="npx @bmad/cli dev-story"
npm pkg set scripts.bmad:prd="npx @bmad/cli prd"
npm pkg set scripts.bmad:arch="npx @bmad/cli create-architecture"

# Optional: Add pre-commit hook
npx husky add .husky/pre-commit "npx @bmad/cli validate"
```

---

## Workflow Integration

### Workflow Map: BMAD + Existing Process

```
┌─────────────────────────────────────────────────────────────┐
│                    Feature Request/Idea                      │
│                  (ROADMAP.md, GitHub Issue)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Track Selection Decision                   │
│                                                              │
│  Quick Flow? (<1 day, low complexity)                       │
│  BMad Method? (3-7 days, medium-high complexity)            │
│  Enterprise? (Critical, compliance-heavy)                   │
└────────────────────┬───────────────┬────────────────────────┘
                     │               │
         Quick Flow  │               │  BMad Method / Enterprise
                     │               │
                     ▼               ▼
    ┌─────────────────────┐   ┌──────────────────────────┐
    │  *dev-story         │   │  BMAD Planning Phase     │
    │  (Skip planning)    │   │  ├─ *prd (PM)            │
    │                     │   │  ├─ *create-architecture │
    │  ├─ Implement       │   │  ├─ *create-test-strategy│
    │  ├─ Test            │   │  └─ *create-epics        │
    │  └─ Commit          │   └──────────┬───────────────┘
    └─────────────────────┘              │
                                         ▼
                              ┌──────────────────────────┐
                              │  BMAD Implementation     │
                              │  (Per Story)             │
                              │  ├─ *dev-story           │
                              │  ├─ TDD cycle            │
                              │  ├─ Code review          │
                              │  └─ Quality gates        │
                              └──────────┬───────────────┘
                                         │
                                         ▼
                              ┌──────────────────────────┐
                              │  BMAD Completion         │
                              │  ├─ *document-changes    │
                              │  ├─ Update ROADMAP.md    │
                              │  └─ *retrospective       │
                              └──────────────────────────┘
```

### Integration Points

| Existing Process | BMAD Workflow | Integration |
|-----------------|---------------|-------------|
| ROADMAP.md planning | `*prd`, `*create-epics` | BMAD creates structured PRD in docs/, link from ROADMAP |
| Implementation planning docs | `*create-architecture` | BMAD generates architecture doc with diagrams |
| Manual feature implementation | `*dev-story` | BMAD guides TDD approach per story |
| Test suite (99% passing) | `*create-test-strategy`, `*test-implementation` | BMAD ensures tests written BEFORE code |
| Documentation updates | `*document-changes` | BMAD prompts for user/dev doc updates |

---

## Agent Configuration

### Agent Personas for Pet Care Game

#### PM (Product Manager)
**Role**: Define requirements, acceptance criteria, user impact

**Responsibilities**:
- Create PRDs for new features
- Define success metrics
- Coordinate with stakeholders (parents, children - target users)
- Ensure COPPA compliance in requirements

**Example Usage**:
```bash
bmad prd --feature "pet-breeding-system"
# Outputs: docs/PRD_PET_BREEDING.md
```

---

#### Architect
**Role**: System design, technology decisions, performance

**Responsibilities**:
- Design system architecture for features
- Technology evaluation (e.g., Skia vs SVG for animations)
- Performance impact analysis
- Integration with existing patterns (Context API, hooks)

**Example Usage**:
```bash
bmad create-architecture --feature "pet-breeding-system"
# Outputs: docs/ARCHITECTURE_PET_BREEDING.md
```

**Key Considerations**:
- React Native/Expo constraints
- Mobile performance (target: 60fps)
- Memory management (low-end devices)
- Existing patterns (usePetActions hook, Context API)

---

#### DEV (Developer)
**Role**: Implementation, code quality, refactoring

**Responsibilities**:
- Implement user stories following TDD
- Ensure TypeScript strict mode compliance
- Follow existing code patterns
- Create reusable components/hooks

**Example Usage**:
```bash
bmad dev-story --story "PB-001-database-schema"
# Guides TDD implementation with checkpoints
```

**Code Quality Gates**:
- TypeScript strict mode (no `any`)
- ESLint passing
- Prettier formatting
- Test coverage >80% for new code
- No console.log in production code

---

#### TEA (Test Architect)
**Role**: Test strategy, quality assurance, coverage

**Responsibilities**:
- Define test strategy BEFORE implementation
- Ensure adequate test coverage
- Create test templates for common patterns
- Performance testing (60fps target)

**Example Usage**:
```bash
bmad create-test-strategy --feature "pet-breeding-system"
# Outputs: docs/TEST_STRATEGY_PET_BREEDING.md
```

**Test Categories**:
- Unit tests (utils, hooks, components)
- Integration tests (Context + components)
- E2E tests (future: Detox)
- Performance tests (animation smoothness)

---

#### SM (Scrum Master)
**Role**: Sprint planning, story breakdown, team coordination

**Responsibilities**:
- Break epics into implementable stories
- Estimate story points
- Track velocity
- Facilitate retrospectives

**Example Usage**:
```bash
bmad create-epics-and-stories --epic "pet-breeding-system"
# Outputs: .bmad/tracking/PET_BREEDING_EPIC.md
```

**Story Format**:
```markdown
## Story: PB-001 - Database Schema for Pet Breeding

**As a** developer
**I want to** create a database schema for pet genetics
**So that** we can track parent-child relationships

**Acceptance Criteria**:
- [ ] Schema supports male/female pairing
- [ ] Genetics traits are inherited
- [ ] Migration script for existing pets
- [ ] Unit tests for genetics calculations

**Estimate**: 5 story points (1 day)
**Dependencies**: None
**Risks**: Data migration for existing users
```

---

#### UX Designer (Optional)
**Role**: User experience, wireframes, accessibility

**Use When**:
- New screens or major UI changes
- Complex interactions (mini-games)
- Accessibility improvements

**Example Usage**:
```bash
bmad create-wireframes --feature "pet-breeding-ui"
# Outputs: docs/WIREFRAMES_PET_BREEDING.md
```

---

#### Analyst (Optional)
**Role**: Research, data analysis, feasibility

**Use When**:
- Performance investigations
- Technology evaluations
- Market research

**Example Usage**:
```bash
bmad analyze-performance --component "BathScene"
# Outputs: docs/ANALYSIS_BATH_PERFORMANCE.md
```

---

## Documentation Structure

### Current Structure (docs/)
```
docs/
├── CODE_REVIEW_REFACTORING.md
├── FEED_ACTIONS_DOCUMENTATION.md
├── IMPLEMENTATION_PLAN.md
├── PLAY_ACTIONS_DOCUMENTATION.md
├── RESPONSIVE.md
├── ROADMAP.md
├── SKIA_BATH_REIMPLEMENTATION_PLAN.md
├── SKIA_IMPLEMENTATION_PLAN.md
├── SPRITES_NEEDED.md
├── TEST_IMPLEMENTATION_PLAN.md
└── VET_ACTIONS_DOCUMENTATION.md
```

### BMAD-Enhanced Structure
```
docs/
├── [Existing files remain unchanged]
├── bmad/                          # BMAD-specific docs (new)
│   ├── prds/                      # Product Requirements Documents
│   │   ├── PRD_PET_BREEDING.md
│   │   └── PRD_SOCIAL_FEATURES.md
│   ├── architecture/              # Architecture Decision Records
│   │   ├── ADR_001_PET_BREEDING_SCHEMA.md
│   │   └── ADR_002_STATE_MANAGEMENT.md
│   ├── test-strategies/           # Test strategies per feature
│   │   ├── TEST_STRATEGY_PET_BREEDING.md
│   │   └── TEST_STRATEGY_SOCIAL.md
│   └── retrospectives/            # Sprint retrospectives
│       ├── RETRO_2026_01_WEEK3.md
│       └── RETRO_2026_01_WEEK4.md
└── .bmad/                         # BMAD tracking (new, git-ignored)
    ├── config.yml
    ├── tracking/
    │   ├── EPIC_PET_BREEDING.md
    │   └── EPIC_SOCIAL_FEATURES.md
    └── metrics/
        └── velocity.json
```

### Documentation Principles

1. **Existing docs remain unchanged** - BMAD adds to, doesn't replace
2. **Cross-reference** - PRDs link to implementation plans
3. **Version control** - All BMAD docs in git (except .bmad/tracking)
4. **Markdown format** - Consistent with existing docs
5. **Clear ownership** - Each doc shows which agent created it

---

## Phased Adoption Plan

### Phase 1: Pilot (Week 1-2) - Quick Flow Only
**Goal**: Validate BMAD with low-risk features

**Activities**:
1. Install and configure BMAD
2. Run `*workflow-init` to initialize tracking
3. Select 2-3 small features from ROADMAP.md
4. Use Quick Flow track for these features
5. Evaluate: Did BMAD add value or overhead?

**Example Pilot Features**:
- Add 2-3 new clothing items
- Add new food item with custom effects
- Fix minor UI alignment issue

**Success Criteria**:
- Features completed in expected time
- Test coverage maintained or improved
- Team comfortable with BMAD commands

---

### Phase 2: Hybrid (Week 3-4) - BMad Method for Medium Features
**Goal**: Use BMad Method for one medium-complexity feature

**Activities**:
1. Select feature from ROADMAP (e.g., "Mini-Games and Activities")
2. Run full BMad Method workflow:
   - `*prd` (PM creates requirements)
   - `*create-architecture` (Architect designs system)
   - `*create-test-strategy` (TEA defines tests)
   - `*create-epics-and-stories` (SM breaks down work)
   - `*dev-story` for each story (DEV implements with TDD)
3. Document learnings
4. Compare to historical feature development time

**Success Criteria**:
- Feature architecture reviewed before coding
- Tests written before implementation (TDD)
- Clear epic/story breakdown
- Retrospective captures value vs overhead

---

### Phase 3: Standard Practice (Week 5+) - Brownfield Optimization
**Goal**: Make BMAD default for medium+ features, optimize existing code

**Activities**:
1. Update CONTRIBUTING.md with BMAD guidelines
2. Run `*document-project` to analyze existing codebase
3. Identify technical debt with `*tech-debt` workflow
4. Use BMAD for all new features per track selection matrix
5. Monthly retrospectives to refine workflows

**Brownfield Workflows**:
- `*document-project`: Generate docs for undocumented code
- `*refactor`: Structured refactoring (e.g., JS to TS conversion)
- `*tech-debt`: Prioritize and track technical debt
- `*dependency-update`: Plan and execute dependency upgrades

**Success Criteria**:
- 100% of medium+ features use BMAD
- Technical debt backlog exists and prioritized
- Development velocity stable or improved
- Test coverage >80% on all new code

---

## Sample Workflows

### Example 1: Quick Flow - Add New Food Item

**Scenario**: Add "Fish Treat" food item with unique happiness bonus

**Steps**:
```bash
# 1. Initialize story
bmad dev-story --quick-flow --title "Add Fish Treat food item"

# 2. BMAD guides you through:
# - Create sprite: assets/sprites/food/fish_treat.png
# - Update data: src/data/foodItems.ts
# - Add translation keys: src/locales/en.json, pt-BR.json
# - Write tests: src/data/__tests__/foodItems.test.ts

# 3. Implement with TDD
npm test -- foodItems.test.ts --watch

# 4. Commit and mark complete
git add .
git commit -m "feat: add Fish Treat food item with +15 happiness bonus"
bmad complete-story --story "fish-treat"
```

**Time**: 1-2 hours
**Files Changed**: 5
**Tests Added**: 3
**BMAD Value**: Checklist ensures translations and tests not forgotten

---

### Example 2: BMad Method - Pet Breeding System

**Scenario**: Add pet breeding feature (Epic from ROADMAP.md)

#### Planning Phase

```bash
# 1. Create PRD
bmad prd --feature "pet-breeding-system"
# Agent: PM
# Output: docs/bmad/prds/PRD_PET_BREEDING.md
# Contents:
# - User stories
# - Acceptance criteria
# - COPPA compliance considerations
# - Success metrics (breeding rate, user engagement)

# 2. Architecture Design
bmad create-architecture --feature "pet-breeding-system"
# Agent: Architect
# Output: docs/bmad/architecture/ADR_001_PET_BREEDING.md
# Decisions:
# - Database schema (AsyncStorage vs SQLite)
# - Genetics algorithm
# - UI flow (navigation changes)
# - Performance impact

# 3. Test Strategy
bmad create-test-strategy --feature "pet-breeding-system"
# Agent: TEA
# Output: docs/bmad/test-strategies/TEST_STRATEGY_PET_BREEDING.md
# Coverage:
# - Unit tests for genetics calculations
# - Integration tests for breeding flow
# - E2E tests for UI interactions
# - Performance tests (breeding animation)

# 4. Epic and Story Breakdown
bmad create-epics-and-stories --epic "pet-breeding-system"
# Agent: SM
# Output: .bmad/tracking/EPIC_PET_BREEDING.md
# Stories:
# - PB-001: Database schema for genetics (5 pts)
# - PB-002: Genetics calculation engine (8 pts)
# - PB-003: Breeding UI screen (5 pts)
# - PB-004: Parent selection logic (3 pts)
# - PB-005: Baby pet generation (5 pts)
# - PB-006: Tutorial and help text (2 pts)
# Total: 28 points (~5-6 days)
```

#### Implementation Phase (Per Story)

```bash
# Story PB-001: Database schema
bmad dev-story --story "PB-001"

# BMAD guides TDD cycle:
# 1. Write failing test
# 2. Implement minimal code to pass
# 3. Refactor
# 4. Repeat

# Files created:
# - src/types/breeding.ts (TypeScript types)
# - src/utils/__tests__/genetics.test.ts (tests first!)
# - src/utils/genetics.ts (implementation)
# - src/context/BreedingContext.tsx (state management)

# Quality gates checked:
# ✓ TypeScript strict mode
# ✓ ESLint passing
# ✓ Test coverage >80%
# ✓ No console.log statements

git add .
git commit -m "feat(breeding): add database schema and genetics engine (PB-001)"
bmad complete-story --story "PB-001"
```

#### Completion Phase

```bash
# After all stories complete
bmad document-changes --epic "pet-breeding-system"
# Updates:
# - README.md (feature list)
# - docs/ROADMAP.md (mark complete)
# - FOLDER_STRUCTURE.md (new files)

bmad retrospective --sprint "2026-01-week4"
# Captures:
# - What went well
# - What could improve
# - Action items
# Output: docs/bmad/retrospectives/RETRO_2026_01_WEEK4.md
```

**Total Time**: 5-6 days
**Files Changed**: ~25
**Tests Added**: ~40
**BMAD Value**:
- Architecture reviewed before coding (prevented SQLite complexity)
- Tests written first (found edge cases early)
- Clear story breakdown (predictable velocity)

---

### Example 3: Brownfield - Document Existing Code

**Scenario**: Generate documentation for existing BathScene.tsx

```bash
# Run document-project workflow
bmad document-project --file "src/screens/BathScene.tsx"

# Agent: Analyst + DEV
# Output: docs/bmad/codebase/COMPONENT_BATHSCENE.md

# Generated documentation:
# - Component purpose and user flow
# - Props interface
# - State management (Context usage)
# - Dependencies and imports
# - Complex logic explanations
# - TODOs and technical debt
# - Test coverage analysis

# Also suggests:
# - Refactoring opportunities
# - Missing tests
# - Performance optimizations
```

**Time**: 15 minutes (automated)
**Value**:
- Onboarding documentation for new developers
- Identifies technical debt
- Baseline for refactoring

---

## Success Metrics

### Quantitative Metrics

| Metric | Baseline (Current) | Target (3 months) | Measurement |
|--------|-------------------|------------------|-------------|
| Test Coverage | 99% | 99%+ (maintain) | `npm run test:coverage` |
| Test-First Development | Unknown | 80% of stories | Stories with tests committed before implementation |
| Planning Overhead | Varies | <10% of dev time | Time spent in planning phase |
| Development Velocity | Baseline in Week 1 | ±15% of baseline | Story points completed per week |
| Documentation Lag | Unknown | <1 day | Time between feature complete and docs updated |
| Architecture Reviews | 0% | 100% (medium+ features) | Features with architecture doc |
| Technical Debt Items Tracked | Ad-hoc | 100% | Items in .bmad/tracking/tech-debt.md |

### Qualitative Metrics

**After Phase 1 (Pilot)**:
- [ ] Team feels BMAD adds value vs overhead
- [ ] BMAD commands are intuitive
- [ ] Documentation is useful and used

**After Phase 2 (Hybrid)**:
- [ ] Architecture reviews catch issues early
- [ ] Test-first development improves code quality
- [ ] Story breakdown improves predictability

**After Phase 3 (Standard Practice)**:
- [ ] BMAD is default workflow for medium+ features
- [ ] Onboarding new developers is faster (better docs)
- [ ] Technical debt is visible and manageable

---

## Migration Path

### From Current Process to BMAD

#### Scenario A: New Feature (Greenfield within Brownfield)

**Before BMAD**:
1. Add to ROADMAP.md
2. Create implementation plan doc
3. Implement
4. Test (maybe)
5. Update docs (maybe)

**With BMAD**:
1. Add to ROADMAP.md
2. `bmad prd` → docs/bmad/prds/PRD_FEATURE.md
3. `bmad create-architecture` → Architecture review
4. `bmad create-test-strategy` → Tests planned
5. `bmad create-epics-and-stories` → Work broken down
6. `bmad dev-story` (per story) → Guided TDD
7. `bmad document-changes` → Docs auto-updated

**Compatibility**: Existing implementation plan docs can still be created manually if preferred

---

#### Scenario B: Existing Feature Enhancement

**Example**: Improve BathScene performance with Skia

**Current Plan**: docs/SKIA_BATH_REIMPLEMENTATION_PLAN.md exists

**BMAD Integration**:
```bash
# Import existing plan into BMAD
bmad import-plan --file "docs/SKIA_BATH_REIMPLEMENTATION_PLAN.md"

# BMAD converts to:
# - PRD: docs/bmad/prds/PRD_SKIA_BATH.md
# - Architecture: docs/bmad/architecture/ADR_002_SKIA_UPGRADE.md
# - Test Strategy: docs/bmad/test-strategies/TEST_STRATEGY_SKIA.md
# - Epic with stories: .bmad/tracking/EPIC_SKIA_BATH.md

# Then proceed with dev-story workflow per story
```

**Benefit**: Existing plan is enhanced with structured breakdown and tracking

---

#### Scenario C: Technical Debt Management

**Current**: Ad-hoc technical debt tracking (mentioned in ROADMAP.md)

**With BMAD**:
```bash
# Scan codebase for technical debt
bmad tech-debt-scan

# Generates: .bmad/tracking/TECH_DEBT.md
# Items:
# - Convert remaining JS files to TS
# - Add JSDoc to complex functions
# - Refactor large components (>300 lines)
# - Update deprecated dependencies
# - Add E2E tests (Detox)

# Prioritize and add to sprints
bmad prioritize-tech-debt --criteria "impact,effort"

# Track alongside feature work
bmad sprint-plan --include-tech-debt
```

**Benefit**: Technical debt is visible, prioritized, and tracked

---

## Rollback Plan

If BMAD proves to be overhead without value:

1. **Keep generated docs** - PRDs, architecture docs are valuable regardless
2. **Stop using workflows** - Return to manual process
3. **Uninstall CLI** - `npm uninstall -g @bmad/cli`
4. **Archive .bmad directory** - Keep for reference, remove from active use
5. **No code changes needed** - BMAD is purely additive

**Sunk Cost**: ~2-3 days of setup and pilot
**Retained Value**: Architecture docs, PRDs, test strategies

---

## Next Steps

### Immediate Actions (Day 1)

1. **Review this plan** with team/stakeholders
2. **Install BMAD CLI**: `npm install -g @bmad/cli`
3. **Initialize project**: `npx @bmad/cli init --type brownfield`
4. **Configure agents**: Edit `.bmad/config.yml`
5. **Select pilot features**: 2-3 small items from ROADMAP.md

### Week 1-2 (Phase 1: Pilot)

1. **Run `*workflow-init`** to set up tracking
2. **Complete 2-3 Quick Flow features** using BMAD
3. **Document experience**: What worked? What didn't?
4. **Team review**: Continue to Phase 2 or adjust?

### Week 3-4 (Phase 2: Hybrid)

1. **Select medium feature** (e.g., Mini-Games)
2. **Run full BMad Method workflow**
3. **Compare to historical data** (time, quality, completeness)
4. **Decide on Phase 3 adoption**

### Week 5+ (Phase 3: Standard Practice)

1. **Update CONTRIBUTING.md** with BMAD guidelines
2. **Make BMAD default** for medium+ features
3. **Monthly retrospectives** to refine process
4. **Celebrate wins** - faster development, better quality, happier team

---

## Appendix A: Command Reference

### Quick Reference

```bash
# Initialization
bmad init --type brownfield           # Initialize BMAD in project
bmad workflow-init                    # Set up tracking system

# Planning Workflows (BMad Method)
bmad prd --feature "feature-name"     # Create PRD (PM agent)
bmad create-architecture --feature "feature-name"  # Architecture design
bmad create-test-strategy --feature "feature-name" # Test planning (TEA)
bmad create-epics-and-stories --epic "epic-name"   # Story breakdown (SM)

# Development Workflows
bmad dev-story --story "STORY-001"    # Guided TDD for story (DEV)
bmad dev-story --quick-flow --title "Quick task"   # Quick Flow bypass

# Brownfield Workflows
bmad document-project --file "path/to/file.ts"     # Document existing code
bmad tech-debt-scan                   # Scan for technical debt
bmad refactor --file "path/to/file.ts" --reason "Reduce complexity"

# Completion Workflows
bmad document-changes --epic "epic-name"           # Update documentation
bmad retrospective --sprint "2026-01-week4"        # Sprint retrospective
bmad complete-story --story "STORY-001"            # Mark story complete

# Validation
bmad validate                         # Run all quality gates
bmad coverage-check --threshold 80    # Verify test coverage
```

---

## Appendix B: Glossary

- **BMAD**: Breakthrough Method for Agile AI Driven Development
- **Agent**: Specialized AI persona (PM, Architect, DEV, TEA, SM, UX, Analyst)
- **Workflow**: Guided process for a specific task (e.g., `*prd`, `*dev-story`)
- **Track**: Development approach (Quick Flow, BMad Method, Enterprise)
- **Brownfield**: Existing codebase (vs greenfield = new project)
- **PRD**: Product Requirements Document
- **ADR**: Architecture Decision Record
- **TDD**: Test-Driven Development (write tests before implementation)
- **Quality Gate**: Automated check that must pass before proceeding
- **Story Points**: Relative measure of effort (Fibonacci scale: 1, 2, 3, 5, 8, 13)

---

## Appendix C: Resources

- **BMAD Official Documentation**: https://docs.bmad-method.org/
- **BMAD CLI GitHub**: https://github.com/bmad-method/cli
- **BMAD Community Discord**: [Link if available]
- **React Native Testing Best Practices**: https://reactnative.dev/docs/testing-overview
- **TDD in React Native**: https://jestjs.io/docs/tutorial-react-native

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-21 | Claude (BMAD Consultant) | Initial comprehensive plan |

---

**Questions or Feedback**: Create a GitHub issue or reach out to the team lead.

**Status**: 🔵 Ready for Review and Implementation
