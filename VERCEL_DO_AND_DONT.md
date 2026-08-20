# Vercel Deployment: Do's and Don'ts

## ✅ DO - Correct Vercel Settings

### Root Directory
```
✅ DO: Set to "." (workspace root)
```
**Why:** Your frontend imports from `libs/contracts` and `libs/shared`. Vercel needs access to the entire workspace.

### Build Command
```
✅ DO: npx nx build frontend --prod
```
**Why:** Nx handles building dependencies in the correct order.

### Install Command
```
✅ DO: npm install
```
**Why:** Installs all workspace dependencies from the root package.json.

### Output Directory
```
✅ DO: apps/frontend/.next
```
**Why:** This is where Next.js outputs the production build.

---

## ❌ DON'T - Common Mistakes

### Root Directory
```
❌ DON'T: Set to "apps/frontend"
```
**Why:** This breaks imports from `libs/`. Frontend won't be able to find `@snake-rescue/contracts` or `@snake-rescue/shared`.

### Build Command
```
❌ DON'T: next build
❌ DON'T: cd apps/frontend && next build
❌ DON'T: npm run build
```
**Why:** These don't handle monorepo dependencies. Build will fail with "Cannot find module '@snake-rescue/contracts'".

### Install Command
```
❌ DON'T: cd apps/frontend && npm install
❌ DON'T: yarn install
❌ DON'T: pnpm install
```
**Why:** Your project uses npm workspaces. Installing from subdirectory breaks the workspace.

---

## ✅ DO - Environment Variables

### Safe Frontend Variables (Add to Vercel)
```bash
✅ DO add:
NEXT_PUBLIC_API_URL=https://api.snakesos.com
NEXT_PUBLIC_GRAPHQL_URL=https://api.snakesos.com/graphql
NEXT_PUBLIC_AUTH_URL=https://api.snakesos.com/api/auth
NEXT_PUBLIC_FRONTEND_URL=https://snakesos.vercel.app
NEXT_PUBLIC_APP_URL=https://snakesos.vercel.app
```

### Optional Frontend Variables
```bash
✅ DO add (if needed):
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## ❌ DON'T - Backend Secrets

### NEVER Add These to Vercel
```bash
❌ DON'T add:
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=sk_live_...
OPENROUTER_API_KEY=sk-or-...
SMTP_PASSWORD=your_password
REDIS_URL=redis://...
```

**Why:** These are backend secrets. Adding them to Vercel:
1. Exposes them to the browser (security breach)
2. Won't work anyway (frontend can't connect to your database)
3. Could compromise your entire system

**Where they belong:** Your backend server's environment (AWS/Railway/Render)

---

## ✅ DO - Backend Configuration

### Update CORS After Deploying
```typescript
✅ DO update apps/backend/src/server.ts:

const allowedOrigins = [
  'http://localhost:4200',              // Local dev
  'https://snakesos.vercel.app',        // ← Add your Vercel URL
  'https://www.snakesos.com',           // Custom domain (if you have one)
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
```

---

## ❌ DON'T - Backend Configuration Mistakes

### Don't Allow All Origins
```typescript
❌ DON'T:

app.use(cors({
  origin: '*',  // ← Never do this!
  credentials: true,
}));
```

**Why:** This is a major security vulnerability. It allows ANY website to make requests to your API.

### Don't Forget to Deploy Backend
```
❌ DON'T: Deploy only frontend and expect it to work
```

**Why:** Your frontend needs a backend to function. The backend must be deployed separately and accessible via HTTPS.

---

## ✅ DO - Pre-Deployment

### Verify Build Works
```bash
✅ DO run before deploying:
npm run verify:vercel
```

**Why:** Catches configuration issues before Vercel deployment fails.

### Test Locally First
```bash
✅ DO test production build:
npx nx build frontend --prod
npx nx serve frontend
```

**Why:** Ensures there are no TypeScript errors or build issues.

### Check Dependencies
```bash
✅ DO verify workspace structure:
npx nx graph
```

**Why:** Shows you which libs your frontend depends on.

---

## ❌ DON'T - Pre-Deployment Mistakes

### Don't Skip Verification
```bash
❌ DON'T: Push to Vercel without testing
```

**Why:** You'll waste time debugging failed deployments that could have been caught locally.

### Don't Commit Secrets
```bash
❌ DON'T: Commit .env with real secrets
❌ DON'T: Push DATABASE_URL to GitHub
```

**Why:** Security breach. Anyone with repo access can see your secrets.

---

## ✅ DO - File Organization

### Use .vercelignore
```
✅ DO ignore unnecessary files:
apps/backend/
libs/backend/
libs/database/
docs/
*.md
```

**Why:** Speeds up deployment by not uploading backend code and documentation.

### Keep Assets Optimized
```
✅ DO optimize public/ assets:
- Compress videos (<10MB)
- Optimize images
- Use WebP format
```

**Why:** Faster deployments and better performance.

---

## ❌ DON'T - File Organization Mistakes

### Don't Upload Everything
```
❌ DON'T: Upload backend code to Vercel
❌ DON'T: Upload database migrations to Vercel
❌ DON'T: Include node_modules in git
```

**Why:** Wastes bandwidth, slows deployment, and isn't needed.

### Don't Put Large Files in Public/
```
❌ DON'T: Put 500MB videos in apps/frontend/public/
❌ DON'T: Put uncompressed 4K images in public/
```

**Why:** Vercel has size limits and large files slow down your app.

---

## ✅ DO - Deployment Strategy

### Use Git Workflow
```bash
✅ DO:
git add .
git commit -m "feat: add feature"
git push origin main
```

**Why:** Vercel automatically deploys on push. Clean git history helps debugging.

### Use Preview Deployments
```
✅ DO: Test on Vercel preview URL first
```

**Why:** Every PR gets a preview deployment. Test before merging to production.

### Monitor Deployments
```
✅ DO: Check Vercel build logs
✅ DO: Test after deployment
✅ DO: Monitor errors
```

**Why:** Catches issues early before users encounter them.

---

## ❌ DON'T - Deployment Strategy Mistakes

### Don't Deploy Directly to Production
```
❌ DON'T: Push untested code to main
❌ DON'T: Skip staging environment
```

**Why:** Could break production for real users.

### Don't Ignore Build Errors
```
❌ DON'T: Ignore Vercel build warnings
❌ DON'T: Skip error messages
```

**Why:** Warnings today become errors tomorrow.

---

## ✅ DO - After Deployment

### Verify Everything Works
```
✅ DO check:
- Homepage loads
- Maps render correctly
- GraphQL queries work
- Authentication works
- No CORS errors
- No console errors
```

### Update Documentation
```
✅ DO update:
- Production URLs in README
- API endpoints in docs
- Environment variable guide
```

---

## ❌ DON'T - After Deployment Mistakes

### Don't Assume It Works
```
❌ DON'T: Deploy and walk away
❌ DON'T: Skip testing critical flows
```

**Why:** Users will find bugs if you don't.

### Don't Forget About Backend
```
❌ DON'T: Forget to update backend CORS
❌ DON'T: Leave backend on localhost
```

**Why:** Frontend won't be able to connect to backend.

---

## 🎯 Quick Reference Card

### Vercel Settings Summary

| Setting | ✅ DO | ❌ DON'T |
|---------|-------|----------|
| **Root Directory** | `.` | `apps/frontend` |
| **Build Command** | `npx nx build frontend --prod` | `next build` |
| **Install Command** | `npm install` | `cd apps/frontend && npm install` |
| **Output Directory** | `apps/frontend/.next` | `dist/` |
| **Node Version** | `20.x` | `18.x` or lower |

### Environment Variables Summary

| Type | ✅ DO | ❌ DON'T |
|------|-------|----------|
| **Frontend** | `NEXT_PUBLIC_*` | Regular variables |
| **Backend** | Keep on backend server | Add to Vercel |
| **Secrets** | Never in git | Commit to repo |
| **API URLs** | Production URLs | `localhost` |

---

## 🚨 Most Common Mistakes (Avoid These!)

### 1. Wrong Root Directory
```
❌ "apps/frontend"  ← WRONG
✅ "."              ← CORRECT
```

### 2. Wrong Build Command
```
❌ next build       ← WRONG
✅ npx nx build frontend --prod  ← CORRECT
```

### 3. Backend Secrets in Vercel
```
❌ DATABASE_URL in Vercel  ← WRONG
✅ Only NEXT_PUBLIC_* vars ← CORRECT
```

### 4. Forgetting Backend CORS
```
❌ No Vercel URL in allowedOrigins  ← WRONG
✅ Add Vercel URL to CORS           ← CORRECT
```

### 5. Not Testing Before Deploy
```
❌ Push directly to production  ← WRONG
✅ Run npm run verify:vercel    ← CORRECT
```

---

## ✅ Final Checklist

Before deploying, confirm:

- [ ] Root Directory set to `.`
- [ ] Build command is `npx nx build frontend --prod`
- [ ] Environment variables added (NEXT_PUBLIC_* only)
- [ ] Backend deployed separately
- [ ] Backend CORS updated with Vercel URL
- [ ] Ran `npm run verify:vercel` successfully
- [ ] No backend secrets in Vercel
- [ ] .vercelignore configured
- [ ] Git pushed to GitHub

If all checked, you're ready to deploy! 🚀

---

**Remember:** When in doubt, check the documentation files:
- `VERCEL_QUICK_START.md` - Quick guide
- `VERCEL_DEPLOYMENT_GUIDE.md` - Complete guide
- `VERCEL_ARCHITECTURE.md` - Technical details
