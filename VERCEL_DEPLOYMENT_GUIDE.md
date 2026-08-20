# SnakeSOS Vercel Deployment Guide

## 🎯 Overview

This guide shows you how to deploy **ONLY the frontend** of your SnakeSOS Nx monorepo to Vercel, while keeping the backend deployed separately.

## 📁 Your Current Architecture

```
snake-rescue/
├── apps/
│   ├── frontend/          ← Deploy THIS to Vercel
│   └── backend/           ← Deploy SEPARATELY (AWS/Railway/Render)
├── libs/
│   ├── contracts/         ← GraphQL types (frontend needs this)
│   ├── shared/            ← Shared utilities (frontend needs this)
│   ├── frontend/          ← Frontend-specific libs
│   ├── auth/              ← Auth config
│   ├── backend/           ← Backend-only (not deployed to Vercel)
│   └── database/          ← Backend-only (not deployed to Vercel)
├── vercel.json            ← ✅ Already configured
├── nx.json
└── package.json
```

## 🚀 Step 1: Test Local Production Build

Before deploying, make sure the frontend builds successfully:

```bash
# Build the frontend
npx nx build frontend --prod

# Check the output
ls -la apps/frontend/.next
```

If this fails, **DO NOT DEPLOY**. Fix any build errors first.

## 🔗 Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your **snake-rescue** GitHub repository
4. Vercel will detect it's a monorepo

## ⚙️ Step 3: Vercel Project Settings

### Framework Preset
```
Next.js
```

### Root Directory
```
.
```
**Important:** Leave as root (`.`) because your frontend imports from `libs/contracts` and `libs/shared`

### Build Command
```
npx nx build frontend --prod
```

### Install Command
```
npm install
```

### Output Directory
```
apps/frontend/.next
```
(Vercel usually auto-detects this)

### Node.js Version
```
20.x
```

## 🌍 Step 4: Environment Variables (CRITICAL)

Go to **Vercel → Project Settings → Environment Variables**

### Required for Production:

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.snakesos.com` | Your backend API URL |
| `NEXT_PUBLIC_GRAPHQL_URL` | `https://api.snakesos.com/graphql` | GraphQL endpoint |
| `NEXT_PUBLIC_AUTH_URL` | `https://api.snakesos.com/api/auth` | Better Auth endpoint |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://snakesos.vercel.app` | Your Vercel domain |
| `NEXT_PUBLIC_APP_URL` | `https://snakesos.vercel.app` | Same as above |
| `NODE_ENV` | `production` | Auto-set by Vercel |

### Optional (if using):

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `your-key-here` | For Google Maps |

### ⚠️ NEVER PUT THESE IN FRONTEND:
- `DATABASE_URL`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `OPENROUTER_API_KEY`
- `SMTP_PASSWORD`

These belong to your backend only!

## 🔐 Step 5: Backend CORS Configuration

Your backend needs to allow requests from Vercel. Update your backend CORS settings:

```typescript
// apps/backend/src/server.ts
const allowedOrigins = [
  'http://localhost:4200',           // Local development
  'https://snakesos.vercel.app',     // Vercel deployment
  'https://www.snakesos.com',        // Custom domain (if you have one)
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 🍪 Step 6: Better Auth Configuration

If using cookies for authentication, update your Better Auth config:

```typescript
// libs/auth/src/config.ts
export const betterAuthConfig = {
  baseURL: process.env.AUTH_URL || 'https://api.snakesos.com',
  trustedOrigins: [
    'https://snakesos.vercel.app',
    'https://www.snakesos.com'
  ],
  cookies: {
    secure: true,              // HTTPS only
    sameSite: 'none',          // Cross-origin cookies
    httpOnly: true,
  }
};
```

## 📹 Step 7: Video/Media Assets

Your hero video is in `apps/frontend/public/videos/`.

### ⚠️ File Size Warning:
- Keep videos under **10MB** for Vercel
- Use WebM + MP4 fallback for better compression
- Consider moving large media to a CDN later

Current structure is fine for now:
```
apps/frontend/public/
├── videos/
│   └── snake-rescue.mp4
└── images/
    └── ...
```

## 🔄 Step 8: Automatic Deployments

Once configured, every `git push` to `main` will trigger a deployment:

```bash
git add .
git commit -m "feat: configure Vercel deployment"
git push origin main
```

Vercel will:
1. Install dependencies
2. Run `npx nx build frontend --prod`
3. Deploy the `.next` output
4. Generate a preview URL

## 🎯 Step 9: Deployment Flow

```
┌─────────────────┐
│   GitHub Repo   │
└────────┬────────┘
         │ git push
         ▼
┌─────────────────┐
│     Vercel      │
│                 │
│  1. npm install │
│  2. nx build    │
│  3. Deploy      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  SnakeSOS Frontend (Live!)  │
│  https://snakesos.vercel.app│
└─────────────┬───────────────┘
              │
              │ GraphQL HTTPS
              ▼
┌─────────────────────────────┐
│   Backend API (Separate)    │
│  https://api.snakesos.com   │
│                             │
│  - GraphQL Server           │
│  - PostgreSQL               │
│  - Redis                    │
│  - Better Auth              │
│  - AI Services              │
└─────────────────────────────┘
```

## 🚨 Common Issues & Solutions

### Build Fails on Vercel

```bash
# Test locally first:
npx nx build frontend --prod

# Check dependency graph:
npx nx graph
```

### Frontend Can't Reach Backend

- Check environment variables
- Verify CORS settings on backend
- Test API endpoint manually: `curl https://api.snakesos.com/graphql`

### TypeScript Errors

```bash
# Make sure all libs are built:
npx nx run-many --target=build --projects=contracts,shared
```

### Slow Build Times

Vercel will cache `node_modules` and `.nx/cache` automatically. First build takes ~2-3 minutes, subsequent builds ~30-60 seconds.

## 📊 Monitoring Your Deployment

After deploying:

1. **Check Build Logs**: Vercel → Deployments → View Logs
2. **Test All Pages**: Navigate through your app
3. **Check Console**: Look for API connection errors
4. **Verify Maps**: Make sure Leaflet maps load correctly
5. **Test Auth**: Try login/signup flow

## 🎨 Custom Domain (Optional)

To use `snakesos.com` instead of `snakesos.vercel.app`:

1. Go to **Vercel → Project Settings → Domains**
2. Add your custom domain
3. Update DNS records (Vercel provides instructions)
4. Update environment variables:
   - `NEXT_PUBLIC_FRONTEND_URL=https://snakesos.com`
   - `NEXT_PUBLIC_APP_URL=https://snakesos.com`

## 🔧 Advanced: Nx Build Optimization

Your `vercel.json` is already configured with:

```json
{
  "ignoreCommand": "git diff --quiet HEAD^ HEAD -- apps/frontend libs/contracts libs/shared libs/frontend"
}
```

This means Vercel will only rebuild when frontend-related files change (skipping backend changes).

## 📝 Deployment Checklist

Before going live:

- [ ] Local production build works: `npx nx build frontend --prod`
- [ ] All environment variables set in Vercel
- [ ] Backend CORS allows Vercel domain
- [ ] Better Auth configured for production
- [ ] Video files are optimized (<10MB)
- [ ] Test on Vercel preview URL first
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (auto by Vercel)

## 🎉 You're Ready to Deploy!

Your SnakeSOS frontend is now production-ready. The backend remains separate, giving you:

✅ Independent scaling  
✅ Frontend on Vercel's edge network  
✅ Backend on dedicated infrastructure  
✅ Clean separation of concerns  

## 📚 Next Steps

After successful deployment:

1. **Monitor Performance**: Use Vercel Analytics
2. **Set Up Alerts**: Configure error notifications
3. **Add CDN**: Move large assets to Cloudflare/AWS S3
4. **Optimize Images**: Use Next.js Image Optimization
5. **Add Monitoring**: Sentry for error tracking

---

**Need Help?**

- Vercel Docs: https://vercel.com/docs
- Nx Monorepo: https://nx.dev/recipes/other/deploy-nextjs-to-vercel
- Your current config: Check `vercel.json` in repo root
