# SnakeSOS Vercel Architecture

## 📐 Your Exact Monorepo Structure

```
snake-rescue/                          ← Git root / Nx workspace root
├── vercel.json                        ← ✅ Vercel configuration
├── .vercelignore                      ← ✅ Deployment optimization
├── package.json                       ← Workspace dependencies
├── nx.json                            ← Nx configuration
├── tsconfig.base.json                 ← Shared TypeScript config
│
├── apps/
│   ├── frontend/                      ← 🎯 DEPLOYED TO VERCEL
│   │   ├── src/
│   │   │   ├── app/                   ← Next.js App Router
│   │   │   ├── components/            ← React components
│   │   │   ├── hooks/                 ← Custom hooks
│   │   │   ├── lib/
│   │   │   │   ├── apollo/            ← Apollo Client setup
│   │   │   │   └── config.ts          ← Frontend config (uses NEXT_PUBLIC_*)
│   │   │   └── styles/
│   │   ├── public/                    ← Static assets
│   │   │   ├── videos/                ← Hero video
│   │   │   └── images/
│   │   ├── next.config.mjs            ← Next.js config
│   │   ├── project.json               ← Nx project config
│   │   └── .next/                     ← Build output (generated)
│   │
│   └── backend/                       ← ❌ NOT DEPLOYED TO VERCEL
│       ├── src/
│       │   ├── server.ts              ← Express + GraphQL server
│       │   ├── schema/                ← GraphQL schemas
│       │   └── resolvers/             ← GraphQL resolvers
│       └── ...
│
├── libs/
│   ├── contracts/                     ← ✅ NEEDED BY FRONTEND
│   │   └── src/
│   │       └── lib/graphql/           ← GraphQL types & queries
│   │           ├── index.ts
│   │           ├── queries.ts
│   │           └── types.ts
│   │
│   ├── shared/                        ← ✅ NEEDED BY FRONTEND
│   │   └── src/
│   │       ├── types/                 ← Shared TypeScript types
│   │       ├── utils/                 ← Utility functions
│   │       └── constants/
│   │
│   ├── frontend/                      ← ✅ NEEDED BY FRONTEND
│   │   ├── core/                      ← Frontend core logic
│   │   ├── features/                  ← Feature modules
│   │   └── ui/                        ← UI components library
│   │
│   ├── auth/                          ← ⚠️  Config only (frontend uses it)
│   │   └── src/
│   │       └── config.ts              ← Better Auth configuration
│   │
│   ├── database/                      ← ❌ BACKEND ONLY
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   │
│   └── backend/                       ← ❌ BACKEND ONLY
│       ├── core/                      ← Backend core services
│       ├── modules/                   ← Business logic
│       ├── loaders/                   ← DataLoader patterns
│       └── services/                  ← External service integrations
│
└── scripts/
    └── verify-vercel-deployment.mjs   ← ✅ Pre-deployment check

```

## 🔄 Dependency Graph

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Deployment                    │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │            apps/frontend (Next.js)                 │ │
│  │                                                    │ │
│  │  Imports:                                          │ │
│  │  • @snake-rescue/contracts (GraphQL types)        │ │
│  │  • @snake-rescue/shared (utilities)               │ │
│  │  • @snake-rescue/frontend/core                    │ │
│  │  • @snake-rescue/frontend/features                │ │
│  │  • @snake-rescue/frontend/ui                      │ │
│  │  • @snake-rescue/auth (config only)               │ │
│  │                                                    │ │
│  │  Runtime Dependencies:                             │ │
│  │  • React 19                                        │ │
│  │  • Next.js 16                                      │ │
│  │  • Apollo Client                                   │ │
│  │  • Leaflet (maps)                                  │ │
│  │  • Radix UI                                        │ │
│  │  • Tailwind CSS 4                                  │ │
│  └────────────────┬───────────────────────────────────┘ │
│                   │                                      │
│                   │ HTTP/GraphQL                         │
│                   ▼                                      │
└───────────────────────────────────────────────────────┘
                    │
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Separate Deployment)              │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │           apps/backend (Express + GraphQL)         │ │
│  │                                                    │ │
│  │  Uses:                                             │ │
│  │  • @snake-rescue/database (Prisma)                │ │
│  │  • @snake-rescue/backend/* (services)             │ │
│  │  • @snake-rescue/contracts (schema)               │ │
│  │  • @snake-rescue/shared (utilities)               │ │
│  │  • @snake-rescue/auth (Better Auth)               │ │
│  │                                                    │ │
│  │  Connects to:                                      │ │
│  │  • PostgreSQL (database)                          │ │
│  │  • Redis (caching)                                 │ │
│  │  • OpenRouter AI                                   │ │
│  │  • Stripe                                          │ │
│  │  • SMTP (Brevo)                                    │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🏗️ Build Process on Vercel

### What Vercel Does:

1. **Clone Repository**
   ```bash
   git clone <your-repo>
   cd snake-rescue
   ```

2. **Install Dependencies** (from workspace root)
   ```bash
   npm install
   ```
   This installs ALL packages defined in `package.json`, including:
   - Frontend dependencies (React, Next.js)
   - Shared dependencies (GraphQL, TypeScript)
   - Build tools (Nx, SWC)

3. **Build Frontend** (Nx handles the dependency chain)
   ```bash
   npx nx build frontend --prod
   ```
   
   Nx automatically:
   - Builds `libs/contracts` first
   - Builds `libs/shared` second
   - Builds `libs/frontend/*` third
   - Finally builds `apps/frontend`

4. **Generate Output**
   ```
   apps/frontend/.next/
   ├── static/
   ├── server/
   └── ...
   ```

5. **Deploy to Edge Network**
   - Optimizes static assets
   - Configures serverless functions
   - Distributes to CDN

### Build Command Breakdown:

```bash
npx nx build frontend --prod
```

This is equivalent to:
```bash
# 1. Build dependencies first
npx nx build contracts
npx nx build shared
npx nx build frontend-core
npx nx build frontend-features
npx nx build frontend-ui

# 2. Then build frontend
cd apps/frontend
npx next build
```

But Nx does this intelligently with caching!

## 🌐 Runtime Architecture

### Frontend (Vercel Edge)

```typescript
// apps/frontend/src/lib/config.ts
export const config = {
  // These come from Vercel Environment Variables
  apiUrl: process.env.NEXT_PUBLIC_API_URL,           // ← Set in Vercel
  graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL,   // ← Set in Vercel
  authUrl: process.env.NEXT_PUBLIC_AUTH_URL,         // ← Set in Vercel
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL, // ← Set in Vercel
};
```

### Apollo Client Configuration

```typescript
// apps/frontend/src/lib/apollo/client.ts
const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

const apolloClient = new ApolloClient({
  uri: API_URL,  // Points to your separate backend
  cache: new InMemoryCache(),
  credentials: 'include',  // For cookies
});
```

## 📦 Package.json Scripts

Your monorepo has these scripts defined:

```json
{
  "scripts": {
    "dev:frontend": "nx serve frontend",           // Local development
    "build:frontend": "nx build frontend",         // Production build
    "verify:vercel": "node scripts/verify-vercel-deployment.mjs"
  }
}
```

Vercel uses: `npx nx build frontend --prod`

## 🔐 Environment Variables Flow

### Development (Local):
```
.env → process.env.NEXT_PUBLIC_* → Frontend code
```

### Production (Vercel):
```
Vercel Dashboard Env Vars → Build time → process.env.NEXT_PUBLIC_* → Frontend code
```

### What Frontend Needs:

| Variable | Example | Where it's used |
|----------|---------|-----------------|
| `NEXT_PUBLIC_GRAPHQL_URL` | `https://api.snakesos.com/graphql` | Apollo Client |
| `NEXT_PUBLIC_AUTH_URL` | `https://api.snakesos.com/api/auth` | Better Auth |
| `NEXT_PUBLIC_APP_URL` | `https://snakesos.vercel.app` | Callbacks, redirects |

### What Backend Needs (NOT in Vercel):

- `DATABASE_URL`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `OPENROUTER_API_KEY`
- `SMTP_PASSWORD`

## 🚦 Request Flow in Production

```
User Browser
    │
    │ HTTPS
    ▼
Vercel Edge Network (Frontend)
    │
    │ Static: Served from CDN
    │ Dynamic: Next.js serverless function
    │
    │ User clicks "Report Snake"
    │
    │ GraphQL mutation via Apollo Client
    │
    │ POST https://api.snakesos.com/graphql
    ▼
Your Backend Server (AWS/Railway/etc)
    │
    │ GraphQL resolver
    ▼
PostgreSQL Database
```

## 📊 File Size Analysis

### What Goes to Vercel:

```
Frontend App:              ~15 MB
node_modules (build):      ~200 MB (temporary, not deployed)
.next (output):            ~8 MB
Static assets:             ~5 MB
Total upload:              ~230 MB
Deployed size:             ~13 MB (compressed)
```

### Excluded via .vercelignore:

```
Backend:                   ❌ (not uploaded)
Database migrations:       ❌ (not uploaded)
Documentation:             ❌ (not uploaded)
Test files:                ❌ (not uploaded)
```

## ⚡ Performance Optimizations

### Already Configured:

1. **Nx Build Caching**: Speeds up subsequent builds
2. **Next.js Static Generation**: Pre-renders pages at build time
3. **Vercel Edge Network**: CDN distribution worldwide
4. **Image Optimization**: Automatic via Next.js
5. **Code Splitting**: Automatic via Next.js

### Your next.config.mjs:

```javascript
const nextConfig = {
  transpilePackages: ['@snake-rescue/contracts', '@snake-rescue/shared'],
  images: {
    unoptimized: true,  // Consider enabling for better performance
  },
};
```

## 🎯 Why This Architecture Works

✅ **Frontend on Vercel:**
- Instant global CDN
- Automatic HTTPS
- Zero-config deployments
- Built-in analytics
- Edge functions

✅ **Backend Separate:**
- Full control over infrastructure
- Database connections
- Long-running processes
- Background jobs
- WebSocket support

✅ **Clean Separation:**
- Independent scaling
- Deploy frontend without touching backend
- Deploy backend without rebuilding frontend
- Different teams can work independently

## 🔍 Troubleshooting Common Issues

### "Cannot find module '@snake-rescue/contracts'"

**Cause:** Vercel root directory set wrong  
**Fix:** Set Root Directory to `.` (workspace root)

### "Build failed: TypeScript errors"

**Cause:** Dependencies not built in order  
**Fix:** Use `npx nx build frontend` (not `next build`)

### "Frontend can't connect to backend"

**Cause:** Missing environment variables  
**Fix:** Add `NEXT_PUBLIC_GRAPHQL_URL` in Vercel dashboard

### "CORS error in production"

**Cause:** Backend doesn't allow Vercel domain  
**Fix:** Add Vercel URL to backend CORS allowedOrigins

## ✅ Deployment Success Criteria

Your deployment is successful when:

1. ✅ Build completes on Vercel (check build logs)
2. ✅ Homepage loads at your Vercel URL
3. ✅ Maps render correctly (Leaflet + tiles)
4. ✅ GraphQL queries work (check network tab)
5. ✅ Authentication flow works (login/signup)
6. ✅ No CORS errors in console
7. ✅ No 404s for static assets

---

**This is your complete Vercel deployment architecture for SnakeSOS! 🚀**
