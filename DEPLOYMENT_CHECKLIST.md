# Deployment Checklist - AI Chatbot 🚀

## ✅ Pre-Deployment Fixes Applied

### 1. SSR Safety - FIXED ✅
**Issue**: `window` object access causes errors during server-side rendering.

**Fix Applied**: Added safe window check in `AIChatWindow.tsx`
```tsx
useEffect(() => {
  // Safe window access only on client
  if (typeof window === 'undefined') return;
  
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };
  // ...
}, []);
```

**Result**: No SSR errors in production builds.

---

## 🔧 Environment Variables Required

### Production .env File
Create `.env.production` or set these in your deployment platform:

```bash
# Required for AI Chatbot
GEMINI_API_KEY=your-actual-gemini-api-key-here
GEMINI_MODEL=gemini-2.0-flash-exp

# Backend URL (important!)
NEXT_PUBLIC_GRAPHQL_URL=https://your-domain.com/graphql

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Auth (if using Better Auth)
AUTH_SECRET=your-production-secret-here
AUTH_URL=https://your-domain.com

# Optional - Disable in production
SKIP_RATE_LIMIT=false
NODE_ENV=production
```

### ⚠️ Critical Variables

| Variable | Required | Where Used | Impact if Missing |
|----------|----------|------------|-------------------|
| `GEMINI_API_KEY` | ✅ Yes | Backend AI service | Chatbot won't respond |
| `NEXT_PUBLIC_GRAPHQL_URL` | ✅ Yes | Frontend Apollo Client | API calls fail |
| `DATABASE_URL` | ✅ Yes | Backend Prisma | Database errors |
| `AUTH_SECRET` | ✅ Yes | Authentication | Login fails |

---

## 🚨 Potential Deployment Errors

### Error 1: "window is not defined"
**Cause**: Server-side rendering trying to access browser-only APIs

**Solution**: ✅ Already fixed in `AIChatWindow.tsx`

**Verify Fix**:
```bash
yarn build:frontend
# Should complete without errors
```

### Error 2: "GEMINI_API_KEY is not defined"
**Cause**: Missing environment variable in production

**Solution**: Set in deployment platform (Vercel, Netlify, etc.)

**Vercel Example**:
```bash
vercel env add GEMINI_API_KEY
# Paste your API key when prompted
```

**Railway Example**:
```bash
# In Railway dashboard:
# Settings → Variables → Add Variable
# Name: GEMINI_API_KEY
# Value: your-key-here
```

### Error 3: "GraphQL endpoint not reachable"
**Cause**: Frontend trying to connect to `localhost:4000` in production

**Solution**: Set `NEXT_PUBLIC_GRAPHQL_URL` environment variable

**Check Apollo Client Configuration**:
```tsx
// apps/frontend/src/lib/apollo/apollo-client.ts
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
});
```

### Error 4: "Hydration mismatch"
**Cause**: Client and server rendered different HTML

**Solution**: All chatbot components already marked as `'use client'`

**If still occurs**:
```tsx
// Use dynamic import with ssr: false
import dynamic from 'next/dynamic';

const AIChatbot = dynamic(
  () => import('@/components/ai/chatbot').then(mod => mod.AIChatbot),
  { ssr: false }
);
```

### Error 5: "Database connection failed"
**Cause**: Wrong `DATABASE_URL` or database not accessible

**Solution**: 
1. Use connection pooling (PgBouncer, Supabase pooler)
2. Add `?pgbouncer=true` to connection string if using PgBouncer
3. Check firewall rules allow connections from deployment platform

### Error 6: "Rate limit errors"
**Cause**: Gemini API rate limits hit in production

**Solution**: Implement request queuing and caching
```typescript
// Backend: Add caching layer
const cachedResponse = await redis.get(`ai:${messageHash}`);
if (cachedResponse) {
  return cachedResponse;
}
```

---

## 🏗️ Build Process

### 1. Test Production Build Locally
```bash
# Build frontend
yarn build:frontend

# Should complete without errors
# Check for:
# ✅ No "window is not defined" errors
# ✅ No hydration warnings
# ✅ All components bundle correctly
```

### 2. Test Backend Build
```bash
# Build backend
yarn build:backend

# Should complete without errors
# Check for:
# ✅ No TypeScript errors
# ✅ All resolvers compile
# ✅ Prisma client generates
```

### 3. Run Production Preview
```bash
# Frontend
cd apps/frontend
yarn build
yarn start

# Backend
cd apps/backend
yarn build
yarn start:prod
```

---

## 🌐 Deployment Platforms

### Vercel (Frontend)

**Recommended Settings**:
```json
{
  "buildCommand": "cd ../.. && nx build frontend --prod",
  "outputDirectory": "apps/frontend/.next",
  "installCommand": "yarn install",
  "framework": "nextjs"
}
```

**Environment Variables**:
- `NEXT_PUBLIC_GRAPHQL_URL` → Your backend URL
- `AUTH_SECRET` → Random 32+ char string
- `AUTH_URL` → Your Vercel domain URL

**Build Command**:
```bash
npx nx build frontend --configuration=production
```

### Railway/Render (Backend)

**Start Command**:
```bash
cd apps/backend && yarn start:prod
```

**Environment Variables**:
- `DATABASE_URL` → PostgreSQL connection string
- `GEMINI_API_KEY` → Your Gemini API key
- `GEMINI_MODEL` → gemini-2.0-flash-exp
- `PORT` → 4000 (or platform default)
- `NODE_ENV` → production

**Health Check Endpoint**:
```
GET /api/health
# Should return 200 OK
```

### Docker Deployment

**Frontend Dockerfile**:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build:frontend

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4200
CMD ["yarn", "start:frontend"]
```

---

## 🔒 Security Checklist

### Before Deployment:

- [ ] Remove any hardcoded API keys
- [ ] Set `NODE_ENV=production`
- [ ] Enable rate limiting (set `SKIP_RATE_LIMIT=false`)
- [ ] Use HTTPS for all API endpoints
- [ ] Validate all user inputs on backend
- [ ] Implement CORS properly
- [ ] Use environment variables for secrets
- [ ] Add request timeouts
- [ ] Implement proper error handling (don't leak stack traces)
- [ ] Add monitoring (Sentry, LogRocket, etc.)

### API Keys Security:
```bash
# ❌ NEVER commit to git:
.env
.env.local
.env.production

# ✅ Add to .gitignore:
echo ".env*" >> .gitignore
echo "!.env.example" >> .gitignore
```

---

## 📊 Performance Optimizations

### Frontend Optimizations:

1. **Code Splitting** (Already done with 'use client')
```tsx
'use client'; // Components load only on client
```

2. **Image Optimization** (If you add images later)
```tsx
import Image from 'next/image';
// Use Next.js Image component
```

3. **API Response Caching**
```tsx
const { data } = await aiChatMutation({
  variables: { input },
  fetchPolicy: 'network-only', // Or 'cache-first' for repeated queries
});
```

### Backend Optimizations:

1. **Connection Pooling**
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connectionLimit = 10
}
```

2. **Query Optimization**
```typescript
// Include only needed fields
include: {
  messages: {
    take: 50, // Limit messages
    orderBy: { createdAt: 'desc' },
  },
}
```

3. **Response Compression**
```typescript
// Enable gzip compression
app.use(compression());
```

---

## 🧪 Pre-Deployment Tests

### 1. Build Test
```bash
yarn build:frontend
yarn build:backend
# Both should complete without errors
```

### 2. E2E Test
```bash
# Start production builds
yarn start:frontend:prod &
yarn start:backend:prod &

# Test chatbot
# 1. Open browser to production URL
# 2. Click floating button
# 3. Send message
# 4. Verify AI responds
# 5. Check no console errors
```

### 3. Load Test (Optional)
```bash
# Use Artillery or k6
k6 run load-test.js
# Test GraphQL endpoint under load
```

### 4. Accessibility Test
```bash
# Use Lighthouse
lighthouse https://your-domain.com --view
# Check accessibility score
```

---

## 📝 Deployment Steps

### Step-by-Step:

1. **Test locally** with production build
2. **Set environment variables** in deployment platform
3. **Deploy backend** first (database + API)
4. **Test backend** GraphQL endpoint
5. **Deploy frontend** pointing to backend URL
6. **Test end-to-end** chatbot functionality
7. **Monitor logs** for first 24 hours
8. **Set up alerts** for errors

---

## 🚨 Emergency Rollback Plan

If deployment fails:

### Quick Rollback:
```bash
# Vercel
vercel rollback

# Railway
# Use dashboard to rollback to previous deployment

# Docker
docker-compose down
docker-compose up -d --build <previous-version>
```

### Fallback Strategy:
1. Keep previous deployment running
2. Use feature flags to disable chatbot
3. Show graceful fallback UI
4. Fix issues in development
5. Redeploy when stable

---

## 📈 Monitoring Setup

### Recommended Tools:

1. **Error Tracking**: Sentry
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

2. **Analytics**: Vercel Analytics
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

3. **Uptime Monitoring**: UptimeRobot, Pingdom
- Monitor: `https://your-domain.com/api/health`
- Alert: If down for > 2 minutes

---

## ✅ Post-Deployment Checklist

After deployment:

- [ ] Test chatbot on production URL
- [ ] Verify AI responds correctly
- [ ] Check GraphQL requests succeed
- [ ] Test on mobile devices
- [ ] Verify environment variables loaded
- [ ] Check logs for errors
- [ ] Test authentication flow
- [ ] Verify database connections
- [ ] Check API rate limits
- [ ] Monitor performance metrics

---

## 🎯 Success Criteria

Deployment is successful when:

1. ✅ Frontend builds without errors
2. ✅ Backend builds without errors
3. ✅ Chatbot button appears on all pages
4. ✅ Chat window opens/closes smoothly
5. ✅ AI responds to messages
6. ✅ No console errors in browser
7. ✅ No server errors in logs
8. ✅ Response time < 5 seconds
9. ✅ Works on mobile and desktop
10. ✅ Graceful error handling

---

## 🆘 Support Resources

If you encounter issues:

1. **Check logs**: Backend and frontend logs
2. **Check environment variables**: Verify all are set
3. **Test locally**: Reproduce issue in development
4. **Check documentation**: Next.js, Prisma, Apollo Client
5. **Ask for help**: Provide error logs and steps to reproduce

---

## 📞 Contact

For deployment support:
- Check `TEST_CHATBOT_NOW.md` for testing steps
- Check `GRAPHQL_SCHEMA_FIX.md` for API issues
- Check backend logs for Gemini API errors

**The chatbot is deployment-ready!** 🚀
