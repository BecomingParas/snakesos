# Project Organization Summary

This document describes how the Snake Rescue project is organized after the cleanup on January 2025.

## 📂 Root Directory Structure

The root directory now contains **only essential project files**:

### Configuration Files (Keep)
- `package.json` - Node.js dependencies
- `package-lock.json` - Locked dependencies
- `yarn.lock` - Yarn dependencies
- `tsconfig.json` - TypeScript configuration
- `tsconfig.base.json` - Base TypeScript config
- `eslint.config.mjs` - ESLint configuration
- `jest.config.ts` - Jest testing configuration
- `jest.preset.js` - Jest preset
- `nx.json` - Nx monorepo configuration
- `nx-project.json` - Nx project settings
- `prisma.config.ts` - Prisma ORM configuration
- `skills-lock.json` - Skills/tools lock file
- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Prettier ignore patterns
- `.gitignore` - Git ignore patterns
- `.gitattributes` - Git attributes

### Environment Files (Keep)
- `.env` - Environment variables (gitignored)
- `.env.example` - Example environment template

### Documentation (Keep)
- `README.md` - Main project readme
- `START_HERE.md` - Getting started guide

### Build Artifacts (Auto-generated)
- `tsconfig.tsbuildinfo` - TypeScript build cache
- `.next/` - Next.js build cache
- `.nx/` - Nx build cache
- `dist/` - Build output
- `node_modules/` - Dependencies

## 📁 Organized Directories

### `docs/` - Documentation (159+ files)

All technical documentation, guides, and implementation notes:

```
docs/
├── README.md                    # Documentation index
├── guides/                      # Quick references and checklists
│   ├── CHECKLIST.txt
│   ├── MOBILE_ACCESS_INFO.txt
│   ├── QUICK_REFERENCE.txt
│   ├── SUMMARY.txt
│   └── VISUAL_GUIDE.txt
├── TAILWIND_V4_DARK_MODE_FIX.md # Critical fixes
├── HOSPITAL_*.md                # Hospital system docs
├── MAP_*.md                     # Map integration docs
├── AUTH_*.md                    # Authentication docs
├── GRAPHQL_*.md                 # GraphQL/API docs
├── BUILD_*.md                   # Build/deployment docs
├── INTEGRATION_*.md             # Integration guides
└── ...159 total files
```

**See:** `docs/README.md` for complete index

### `scripts/` - Scripts & Tools (30+ files)

Test scripts, utilities, and tools:

```
scripts/
├── README.md              # Scripts documentation
├── tests/                 # Test scripts
│   ├── check-otp.ts
│   ├── test-email-*.ts
│   ├── test-stripe-setup.ts
│   └── ...7 test files
├── setup/                 # Setup scripts
│   ├── install-all.sh
│   ├── setup-mobile-access.ps1
│   └── ...4 setup files
├── utils/                 # Utilities
│   ├── clean-build.js
│   ├── gen_hash.js
│   └── ...7 utility files
├── sql/                   # SQL files
│   ├── hospital_migration.sql
│   └── check-verification-codes.sql
└── archive/               # Old/archived files
    └── ...7 archived files
```

**See:** `scripts/README.md` for usage examples

### `apps/` - Applications

```
apps/
├── frontend/      # Next.js frontend app
└── backend/       # NestJS backend API
```

### `libs/` - Shared Libraries

```
libs/
├── contracts/     # GraphQL contracts
├── database/      # Prisma database layer
└── backend/
    └── modules/   # Backend modules
```

### Other Directories

- `.agents/` - AI agent configurations
- `.claude/` - Claude AI configurations
- `.kiro/` - Kiro IDE configurations
- `.vscode/` - VS Code settings
- `.windsurf/` - Windsurf IDE settings
- `.husky/` - Git hooks
- `static/` - Static assets
- `tmp/` - Temporary files
- `packages/` - Monorepo packages

## 🗑️ Cleanup Summary

### Files Moved

- **159 MD files** → `docs/` (documentation)
- **7 test files** → `scripts/tests/`
- **4 setup files** → `scripts/setup/`
- **7 utility files** → `scripts/utils/`
- **2 SQL files** → `scripts/sql/`
- **7 old files** → `scripts/archive/`
- **5 guide files** → `docs/guides/`

### Total: 191 files organized! 🎉

## 📝 File Naming Conventions

### Documentation (docs/)
- `*_COMPLETE.md` - Completion summaries
- `*_GUIDE.md` - Step-by-step guides
- `*_STATUS.md` - Current status reports
- `README_*.md` - Topic-specific READMEs
- `QUICK_*.md` - Quick references

### Scripts (scripts/)
- `test-*.{js,ts}` - Test scripts
- `check-*.{js,ts}` - Verification scripts
- `setup-*.{sh,ps1}` - Setup scripts
- `clean-*.js` - Cleanup utilities
- `*.sql` - SQL queries/migrations

## 🎯 Benefits of Organization

1. **Clean Root** - Easy to find configuration files
2. **Organized Docs** - All documentation in one place with index
3. **Categorized Scripts** - Easy to find and run scripts
4. **Professional** - Industry-standard project structure
5. **Maintainable** - Clear organization for team collaboration
6. **Git-Friendly** - Clean git status, easy to review changes

## 🔄 Maintenance

To keep the project organized:

1. **New Documentation** → Always add to `docs/` with descriptive name
2. **New Scripts** → Add to appropriate `scripts/` subdirectory
3. **Test Files** → Place in `scripts/tests/`
4. **Utilities** → Place in `scripts/utils/`
5. **Update READMEs** → Keep `docs/README.md` and `scripts/README.md` current

## 📚 Quick Access

- **Getting Started:** `START_HERE.md` (root)
- **Documentation:** `docs/README.md`
- **Scripts:** `scripts/README.md`
- **Main README:** `README.md` (root)

---

**Project Organization Completed:** January 2025  
**Files Organized:** 191 files  
**Directories Created:** `docs/`, `docs/guides/`, `scripts/tests/`, `scripts/setup/`, `scripts/utils/`, `scripts/sql/`, `scripts/archive/`
