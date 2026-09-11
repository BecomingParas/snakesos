# Deploy AI Chatbot Safely 🚀

## ✅ Pre-Deployment Fixes - ALREADY DONE

I've already fixed the main deployment issues:

1. ✅ **SSR Safety**: Added `typeof window === 'undefined'` check
2. ✅ **Client Components**: All components marked with `'use client'`
3. ✅ **No hardcoded localhost**: Uses environment variables
4. ✅ **Proper GraphQL schema**: Matches backend exactly
5. ✅ **No localStorage on server**: Safe for SSR

---

## 🎯 What You Need to Do

### 1. Set Environment Variables ⚠️ CRITICAL

**In your deployment platform (Vercel/Railway/Render)**:

```bash
# Backend (REQUIRED)
GEMINI_API_KEY=your-actual-key-here
GEMINI_MODEL=gemini-2.0-flash-exp
DATABASE_URL=postgresql://user:pass@host:5432/db
NODE_ENV=production

# Frontend (REQUIRED)
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend-url.com/graphql
AUTH_SECRET=random-32-char-string-here
```

**⚠️ Without these, deployment will fail!**

---

## 🧪 Test Before Deploying

### Quick Test (2 minutes):

```bash
# 1. Build production version
yarn build:frontend

# 2. Check for errors
# ✅ Should complete without "window is not defined"
# ✅ Should complete without hydration errors
# ✅ Should bundle all components

# 3. Test production locally (optional)
NODE_ENV=production yarn start:frontend
# Open http://localhost:4200
# Test chatbot works
```

---

## 🚀 Deploy Steps

### Option 1: Vercel (Recommended for Frontend)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Set environment variables
vercel env add NEXT_PUBLIC_GRAPHQL_URL production
# Paste: https://your-backend-url.com/graphql
```

### Option 2: Railway (Good for Full Stack)

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Deploy backend
railway up

# 4. Add variables in dashboard
# Settings → Variables
```

### Option 3: Docker

```bash
# 1. Build image
docker build -t snakesos-frontend -f apps/frontend/Dockerfile .

# 2. Run with env vars
docker run -p 4200:4200 \
  -e NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com/graphql \
  snakesos-frontend
```

---

## ⚠️ Most Common Errors (and fixes)

### Error: "window is not defined"
**Status**: ✅ Already fixed in code
**If still happens**: Check you pulled latest changes

### Error: "GEMINI_API_KEY is not defined"
**Fix**: Add to deployment platform environment variables

### Error: "Network request failed"
**Fix**: Set `NEXT_PUBLIC_GRAPHQL_URL` environment variable

### Error: "Cannot connect to database"
**Fix**: Check `DATABASE_URL` format and database accessibility

---

## 📋 Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads without errors
- [ ] Floating button appears (bottom-right corner)
- [ ] Clicking button opens chat
- [ ] Can send message to AI
- [ ] AI responds (check response time)
- [ ] No console errors (F12 → Console)
- [ ] Works on mobile
- [ ] Backend health check passes: `/api/health`

---

## 🆘 If Something Breaks

### Quick Fixes:

1. **Check logs**:
   ```bash
   vercel logs      # Vercel
   railway logs     # Railway
   docker logs      # Docker
   ```

2. **Verify environment variables**:
   ```bash
   vercel env ls    # Vercel
   railway variables # Railway
   ```

3. **Rollback**:
   ```bash
   vercel rollback  # Vercel
   # Or redeploy previous version
   ```

4. **Disable chatbot temporarily**:
   ```tsx
   // In layout files, comment out:
   // <AIChatbot />
   // <PublicAIChatbot />
   ```

---

## 📚 Full Documentation

For detailed information, see:

- **`DEPLOYMENT_CHECKLIST.md`** - Complete deployment guide
- **`COMMON_DEPLOYMENT_ERRORS.md`** - Error solutions
- **`TEST_CHATBOT_NOW.md`** - Testing guide
- **`GRAPHQL_SCHEMA_FIX.md`** - API documentation

---

## ✅ You're Ready!

The chatbot is **deployment-ready** with all common issues fixed.

Just:
1. Set environment variables
2. Deploy
3. Test

**Good luck!** 🚀
