# SnakeSOS → Vercel: Quick Start

## 🚀 5-Minute Deployment

### 1️⃣ Verify Build Works

```bash
npm run verify:vercel
```

If this passes, you're good to go!

### 2️⃣ Vercel Settings

| Setting | Value |
|---------|-------|
| Framework | `Next.js` |
| Root Directory | `.` (leave as root) |
| Build Command | `npx nx build frontend --prod` |
| Install Command | `npm install` |
| Output Directory | `apps/frontend/.next` |

### 3️⃣ Environment Variables (Add in Vercel Dashboard)

**Required:**
```env
NEXT_PUBLIC_API_URL=https://api.snakesos.com
NEXT_PUBLIC_GRAPHQL_URL=https://api.snakesos.com/graphql
NEXT_PUBLIC_AUTH_URL=https://api.snakesos.com/api/auth
NEXT_PUBLIC_FRONTEND_URL=https://snakesos.vercel.app
NEXT_PUBLIC_APP_URL=https://snakesos.vercel.app
```

**Optional:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 4️⃣ Backend CORS Update

Update your backend to allow Vercel domain:

```typescript
// apps/backend/src/server.ts
const allowedOrigins = [
  'http://localhost:4200',
  'https://snakesos.vercel.app',  // ← Add this
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
```

### 5️⃣ Deploy!

```bash
git add .
git commit -m "feat: configure Vercel deployment"
git push origin main
```

Then go to [vercel.com](https://vercel.com) and import your repo.

---

## 📊 What Gets Deployed

✅ **Deployed to Vercel:**
- `apps/frontend/` - Next.js app
- `libs/contracts/` - GraphQL types
- `libs/shared/` - Shared utils
- `libs/frontend/` - Frontend libs

❌ **NOT Deployed (Stays on Backend):**
- `apps/backend/` - GraphQL API
- `libs/database/` - Prisma + DB
- `libs/backend/` - Backend services

---

## 🔧 Troubleshooting

### Build fails?
```bash
npx nx build frontend --prod
```
Fix any errors locally first.

### Frontend can't reach backend?
- Check environment variables in Vercel
- Verify CORS settings on backend
- Test API: `curl https://api.snakesos.com/graphql`

### Need detailed guide?
See `VERCEL_DEPLOYMENT_GUIDE.md` for complete instructions.

---

## ✅ Deployment Checklist

- [ ] `npm run verify:vercel` passes
- [ ] Backend deployed separately
- [ ] Environment variables added to Vercel
- [ ] CORS updated on backend
- [ ] Committed and pushed to GitHub
- [ ] Repository connected to Vercel

---

**You're ready! 🎉**
