# 🚀 Snake Rescue Platform - Command Reference

## 📦 GraphQL Commands

### Generate TypeScript Types from GraphQL Schema
```bash
# Generate once
yarn graphql:codegen

# Or use the alias
yarn graphql:generate

# Watch mode (auto-regenerate on schema changes)
yarn graphql:codegen:watch
```

**What it does:**
- Generates `libs/contracts/src/generated/resolvers-types.ts` (backend)
- Generates `libs/contracts/src/generated/graphql-operations.ts` (frontend hooks)
- Generates fragment matcher, introspection, and SDL

---

## 🗄️ Database Commands

### Prisma Commands
```bash
# Generate Prisma Client
yarn db:generate

# Run migrations (development)
yarn db:migrate

# Push schema to database (no migration)
yarn db:push

# Open Prisma Studio (database GUI)
yarn db:studio

# Seed database with test data
yarn db:seed
```

### Auth & RBAC Seeding (TODO)
```bash
# Seed initial roles and permissions
yarn db:seed:auth

# This will create:
# - 8 default roles (CITIZEN → SUPER_ADMIN)
# - 15 permissions (MANAGE_USERS, ASSIGN_RESCUES, etc.)
# - Role-permission mappings
```

---

## 🏗️ Development Commands

### Frontend
```bash
# Start Next.js frontend (localhost:3000)
yarn dev:frontend
```

### Backend
```bash
# Start Express + Apollo Server backend
yarn dev:backend
```

### Both Together
```bash
# Start both frontend and backend concurrently
yarn dev
```

---

## 🔨 Build Commands

### Build Individual Parts
```bash
# Build frontend only
yarn build:frontend

# Build backend only
yarn build:backend

# Build shared libraries only
yarn build:shared
```

### Build Everything
```bash
# Build all libraries, frontend, and backend
yarn build:all

# Or use Nx to build all
yarn build
```

---

## 🎯 Complete Workflow

### Initial Setup
```bash
# 1. Install dependencies
yarn install

# 2. Generate Prisma Client
yarn db:generate

# 3. Run database migrations
yarn db:migrate

# 4. Generate GraphQL types
yarn graphql:codegen
```

### Daily Development
```bash
# 1. Start dev servers
yarn dev

# 2. In another terminal, watch GraphQL changes
yarn graphql:codegen:watch

# 3. Open database GUI (optional)
yarn db:studio
```

### After Schema Changes
```bash
# After updating GraphQL schema
yarn graphql:codegen

# After updating Prisma schema
yarn db:migrate
yarn db:generate
```

### Before Deployment
```bash
# 1. Run database migrations
yarn db:migrate

# 2. Generate Prisma Client
yarn db:generate

# 3. Generate GraphQL types
yarn graphql:codegen

# 4. Build everything
yarn build:all
```

---

## 📊 GraphQL Codegen Details

### What Gets Generated

```
libs/contracts/src/generated/
├── resolvers-types.ts          # Backend resolver types
├── graphql-operations.ts       # Frontend operations & hooks
├── fragment-matcher.ts         # Apollo Client cache config
├── schema.json                 # Introspection for tooling
└── schema.graphql              # Human-readable SDL
```

### Usage in Backend
```typescript
import { Resolvers } from '@snake-rescue/contracts/generated/resolvers-types';

const resolvers: Resolvers = {
  Query: {
    me: async (_, __, context) => {
      // Fully typed!
      return context.user;
    },
  },
};
```

### Usage in Frontend
```typescript
import { useLoginMutation } from '@snake-rescue/contracts/generated/graphql-operations';

const [login, { data, loading }] = useLoginMutation();
// Fully typed!
```

---

## 🔍 Useful Nx Commands

### List All Projects
```bash
nx show projects
```

### Run Specific Project
```bash
nx serve backend
nx serve frontend
```

### Build Specific Project
```bash
nx build contracts
nx build database
nx build ui
```

### Test
```bash
nx test backend
nx test frontend
```

### Lint
```bash
nx lint backend
nx lint frontend
```

---

## 🎨 Code Quality

### Format Code
```bash
nx format:write
```

### Check Formatting
```bash
nx format:check
```

---

## 📦 Package Management

### Add Dependency to Workspace
```bash
# Root level
yarn add package-name -W

# Specific workspace
yarn workspace @snake-rescue/backend add package-name
yarn workspace @snake-rescue/frontend add package-name
yarn workspace @snake-rescue/contracts add package-name
```

### Add Dev Dependency
```bash
yarn add -D package-name -W
```

---

## 🚀 Quick Start Checklist

- [ ] `yarn install` - Install dependencies
- [ ] `yarn db:migrate` - Set up database
- [ ] `yarn db:generate` - Generate Prisma Client
- [ ] `yarn graphql:codegen` - Generate GraphQL types
- [ ] `yarn dev` - Start development servers
- [ ] Open http://localhost:3000

---

## 💡 Pro Tips

### Watch Everything
```bash
# Terminal 1: Dev servers
yarn dev

# Terminal 2: GraphQL codegen watch
yarn graphql:codegen:watch

# Terminal 3: Database studio
yarn db:studio
```

### Quick Rebuild
```bash
# If things get weird, rebuild everything
yarn graphql:codegen && yarn db:generate && yarn build:all
```

### Reset Database
```bash
# Warning: This will delete all data!
yarn db:push --force-reset
yarn db:seed
```

---

## 🎯 Most Used Commands

| Command | What It Does |
|---------|--------------|
| `yarn dev` | Start everything |
| `yarn graphql:codegen` | Generate GraphQL types |
| `yarn db:migrate` | Run database migrations |
| `yarn db:studio` | Open database GUI |
| `yarn build:all` | Build for production |

---

**Last Updated**: 2026-08-05  
**Platform**: Snake Rescue Platform  
**Stack**: Next.js 15 + React 19 + Express 5 + Apollo + Prisma + PostgreSQL
