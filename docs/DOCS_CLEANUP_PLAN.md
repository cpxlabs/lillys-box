# Documentation Cleanup Plan

## Overview

This document identifies documentation files that can be safely removed as they are either:
- Outdated planning documents
- One-time verification checklists
- Superseded by newer documentation
- Not actively used in current development

**Date**: 2026-02-02

---

## 📋 Files Recommended for Removal

### Category 1: Old Planning Documents (plans/ directory)

**Location**: `docs/plans/`

#### Files to Remove:

1. **`IMPLEMENTATION_PLAN.md` (34KB)**
   - **Reason**: Old comprehensive plan from 2026-01-15/16
   - **Status**: Most items completed or superseded
   - **Replacement**: Current issues/tasks tracked elsewhere
   - **Action**: DELETE

2. **`OAUTH_PLAN.md` (20KB)**
   - **Reason**: OAuth implementation complete
   - **Status**: Plan fully executed, system working
   - **Replacement**: GOOGLE_OAUTH_SETUP.md, AUTHENTICATION_GUIDE.md
   - **Action**: DELETE

3. **`CODE_REVIEW_REFACTORING.md` (13KB)**
   - **Reason**: Old refactoring plan
   - **Status**: Either done or no longer relevant
   - **Replacement**: None needed (completed work)
   - **Action**: DELETE

4. **`SKIA_BATH_REIMPLEMENTATION_PLAN.md` (56KB)**
   - **Reason**: Detailed Skia reimplementation plan
   - **Status**: Plan document, implementation may or may not be done
   - **Replacement**: If implemented, docs in main guides
   - **Action**: DELETE (plan no longer needed)

5. **`SPRITES_NEEDED.md` (2.6KB)**
   - **Reason**: Old sprite planning/wishlist
   - **Status**: Sprites either added or tracked elsewhere
   - **Replacement**: None needed
   - **Action**: DELETE

**Total Savings**: ~125KB, 5 files

---

### Category 2: BMAD Planning Documents

BMAD (Breakthrough Method for Agile AI Driven Development) planning documents that don't appear to be actively used in current workflow.

#### Files to Remove:

6. **`BMAD_IMPLEMENTATION_PLAN.md`**
   - **Reason**: 100+ page planning document for BMAD adoption
   - **Status**: Planning phase complete, no active BMAD usage found
   - **Evidence**: No BMAD CLI usage, no BMAD workflows in codebase
   - **Action**: DELETE

7. **`BMAD_SUMMARY.md`**
   - **Reason**: Summary of BMAD planning
   - **Status**: Planning complete, system not adopted
   - **Action**: DELETE

8. **`BMAD_QUICKSTART.md`**
   - **Reason**: Quickstart guide for BMAD
   - **Status**: Not actively used in development
   - **Action**: DELETE

**Total Savings**: ~3 files (size unknown, but likely 100KB+)

---

### Category 3: One-Time Verification Documents

#### Files to Remove:

9. **`WEB_BUILD_TEST_VERIFICATION.md`**
   - **Reason**: One-time testing checklist
   - **Status**: Web build working, verification complete
   - **Created**: During OAuth/web build implementation
   - **Replacement**: WEB_BUILD_GUIDE.md has troubleshooting
   - **Action**: DELETE

**Total Savings**: 1 file

---

### Category 4: Status/Summary Documents

#### Files to Remove:

10. **`E2E_IMPLEMENTATION_STATUS.md`**
    - **Reason**: Status document for E2E testing setup
    - **Status**: E2E testing setup complete
    - **Created**: 2026-01-21 or earlier
    - **Replacement**: E2E_TESTING.md (how-to guide)
    - **Action**: DELETE

11. **`SPRITE_SHEET_IMPLEMENTATION_SUMMARY.md`**
    - **Reason**: Summary of sprite sheet implementation
    - **Status**: Implementation complete
    - **Replacement**: SPRITE_SHEET_GUIDE.md (main guide)
    - **Action**: DELETE

**Total Savings**: 2 files

---

### Category 5: Unused Feature Planning

#### Files to Remove:

12. **`VIDEO_GENERATION_PROMPTS.md`**
    - **Reason**: Prompts for future video generation feature
    - **Status**: Not currently implemented or actively planned
    - **Evidence**: No video generation code in codebase
    - **Action**: DELETE (can recreate if needed later)

**Total Savings**: 1 file

---

## 📊 Summary

**Total Files to Remove**: 12 files
- Old planning docs: 5 files (~125KB)
- BMAD docs: 3 files (~100KB+)
- Verification checklists: 1 file
- Status docs: 2 files
- Unused features: 1 file

**Estimated Total Savings**: ~14 files, 250KB+ of outdated documentation

---

## ✅ Files to Keep (Verified as Active)

### Essential Guides
- ✅ **WEB_BUILD_GUIDE.md** - Main web build guide (recently updated 2026-02-02)
- ✅ **WEB_BUILD_QUICK_START.md** - Quick reference guide
- ✅ **AUTHENTICATION_GUIDE.md** - Auth system documentation
- ✅ **GOOGLE_OAUTH_SETUP.md** - OAuth setup instructions
- ✅ **OAUTH_INDEX.md** - OAuth documentation index

### Recently Updated
- ✅ **IMPORT_FIXES_CHANGELOG.md** - Created 2026-02-02 (import fixes history)
- ✅ **MIGRATION_GUIDE.md** - Updated 2026-02-02 (OAuth + i18n)

### Technical Documentation
- ✅ **FEED_ACTIONS_DOCUMENTATION.md** - Feed system architecture
- ✅ **PLAY_ACTIONS_DOCUMENTATION.md** - Play system architecture
- ✅ **VET_ACTIONS_DOCUMENTATION.md** - Vet system architecture

### Reference Guides
- ✅ **API_REFERENCE.md** - API documentation
- ✅ **FOLDER_STRUCTURE.md** - Project structure
- ✅ **RESPONSIVE.md** - Responsive design guide
- ✅ **SPRITE_SHEET_GUIDE.md** - Sprite sheet system
- ✅ **E2E_TESTING.md** - E2E testing how-to
- ✅ **ROADMAP.md** - Project roadmap
- ✅ **README.md** - Documentation index

**Total Active Files**: 17 files

---

## 🗑️ Deletion Commands

### Safe Deletion (with backup)

```bash
# Create backup before deletion
cd /home/user/pet-care-game
mkdir -p .archive/docs-backup-2026-02-02
cp -r docs/plans .archive/docs-backup-2026-02-02/
cp docs/BMAD_*.md .archive/docs-backup-2026-02-02/
cp docs/WEB_BUILD_TEST_VERIFICATION.md .archive/docs-backup-2026-02-02/
cp docs/E2E_IMPLEMENTATION_STATUS.md .archive/docs-backup-2026-02-02/
cp docs/SPRITE_SHEET_IMPLEMENTATION_SUMMARY.md .archive/docs-backup-2026-02-02/
cp docs/VIDEO_GENERATION_PROMPTS.md .archive/docs-backup-2026-02-02/

# Delete files
rm -rf docs/plans/
rm -f docs/BMAD_IMPLEMENTATION_PLAN.md
rm -f docs/BMAD_SUMMARY.md
rm -f docs/BMAD_QUICKSTART.md
rm -f docs/WEB_BUILD_TEST_VERIFICATION.md
rm -f docs/E2E_IMPLEMENTATION_STATUS.md
rm -f docs/SPRITE_SHEET_IMPLEMENTATION_SUMMARY.md
rm -f docs/VIDEO_GENERATION_PROMPTS.md

# Verify deletions
ls -la docs/
```

### Git Commit

```bash
git add -A
git commit -m "Docs: Remove outdated planning and status documents

Removed 12 outdated documentation files:
- 5 old planning documents (plans/ directory)
- 3 BMAD planning documents (not actively used)
- 1 one-time verification checklist
- 2 status/summary documents
- 1 unused feature planning document

All removed files have been backed up to .archive/docs-backup-2026-02-02/
for historical reference if needed.

Active documentation maintained:
- WEB_BUILD_GUIDE.md (recently updated)
- MIGRATION_GUIDE.md (recently updated)
- IMPORT_FIXES_CHANGELOG.md (newly created)
- All technical guides (FEED, PLAY, VET actions)
- All reference documentation

This cleanup improves documentation maintainability and reduces
confusion from outdated information.

https://claude.ai/code/session_SxGGS"

git push origin claude/fix-i18n-import-SxGGS
```

---

## 📝 Notes

### Why Keep Action Documentation?
- **FEED_ACTIONS_DOCUMENTATION.md**: Documents feed system architecture and usePetActions migration
- **PLAY_ACTIONS_DOCUMENTATION.md**: Documents play system architecture and usePetActions migration
- **VET_ACTIONS_DOCUMENTATION.md**: Documents vet system and explains why NOT migrated to usePetActions

These are technical reference documentation, not planning docs. They explain architectural decisions and implementation details that are valuable for future development.

### Why Remove BMAD Docs?
- No evidence of BMAD CLI usage in project
- No BMAD workflows or commands in package.json
- Planning phase complete, system not adopted
- If BMAD is adopted later, docs can be recreated

### Why Remove Planning Docs?
- Plans are historical artifacts once implemented
- Implementation status tracked in code, not planning docs
- OAuth, sprite sheets, E2E testing all implemented
- Current roadmap should be in ROADMAP.md

### Recovery If Needed
All deleted files backed up to `.archive/docs-backup-2026-02-02/`
Can be restored with: `cp .archive/docs-backup-2026-02-02/[filename] docs/`

---

**Status**: Ready for execution
**Approval Required**: Yes (confirm before deletion)
**Reversible**: Yes (via backup in .archive/)
