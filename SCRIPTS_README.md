# 🎯 Available Scripts - Quick Reference

## 🚀 Development

| Command | Description |
|---------|-------------|
| `yarn dev:frontend` | Start frontend development server |
| `yarn dev:backend` | Start backend development server |
| `yarn dev` | Start both frontend & backend in parallel |

## 🏗️ Build

| Command | Description |
|---------|-------------|
| `yarn build:frontend` | Build frontend for production |
| `yarn build:backend` | Build backend for production |
| `yarn build:shared` | Build shared library (db, telegram) |
| `yarn build:all` | Build all projects in correct order |
| `yarn build` | Build everything using Nx |

## 🗄️ Database

| Command | Description |
|---------|-------------|
| `yarn db:generate` | Generate Prisma Client from schema |
| `yarn db:migrate` | Create and apply migrations |
| `yarn db:push` | Push schema changes to database (dev) |
| `yarn db:studio` | Open Prisma Studio GUI |
| `yarn db:seed` | Run database seed script |

---

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Install dependencies
yarn install

# 2. Setup database
yarn db:generate
yarn db:push

# 3. Build shared library
yarn build:shared

# 4. Start development
yarn dev:frontend
```

### Daily Development
```bash
# Start frontend only
yarn dev:frontend

# Or start everything
yarn dev
```

### Production Build
```bash
# Build everything
yarn build:all

# Verify
ls -la dist/
```

---

## 📚 More Information

- **Full Commands List:** See `COMMANDS.md`
- **Quick Start Guide:** See `QUICK_START.md`
- **Architecture:** See `ARCHITECTURE_REFACTOR.md`
- **Phase 1 Status:** See `PHASE_1_COMPLETE.md`

---

## 💡 Most Used Commands

```bash
yarn dev:frontend    # 🔥 Start frontend dev server
yarn build:all       # 📦 Build for production
yarn db:studio       # 🗄️ Browse database
nx graph             # 📊 View project dependencies
nx reset             # 🧹 Clear Nx cache
```

---

**Note:** All commands work with both `yarn` and `npm run`

Example:
- `yarn dev:frontend` = `npm run dev:frontend`
- `yarn build:all` = `npm run build:all`
