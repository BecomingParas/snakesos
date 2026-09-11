# Common Deployment Errors & Solutions 🚨

## Error 1: "window is not defined"

### Full Error:
```
ReferenceError: window is not defined
    at AIChatWindow (AIChatWindow.tsx:21)
```

### Cause:
Next.js tries to render component on server, but `window` only exists in browser.

### Solution: ✅ ALREADY FIXED
```tsx
// apps/frontend/src/components/ai/chatbot/AIChatWindow.tsx
useEffect(() => {
  if (typeof window === 'undefined') return; // Added this check
  setIsMobile(window.innerWidth < 768);
}, []);
```

### Verify Fix:
```bash
yarn build:frontend
# Should complete without errors
```

---

## Error 2: "GEMINI_API_KEY is not defined"

### Full Error:
```
Error: GEMINI_API_KEY environment variable is required
    at AIAgentService.initialize
```

### Cause:
Environment variable not set in production deployment.

### Solution:

**Vercel**:
```bash
# Via CLI
vercel env add GEMINI_API_KEY production
# Paste your key when prompted

# Or in dashboard:
# Settings → Environment Variables → Add
```

**Railway**:
```
Dashboard → Your Service → Variables
Add: GEMINI_API_KEY = your-key-here
```

**Render**:
```
Dashboard → Environment → Add Environment Variable
Key: GEMINI_API_KEY
Value: your-key-here
```

**Docker**:
```dockerfile
# In docker-compose.yml
environment:
  - GEMINI_API_KEY=${GEMINI_API_KEY}
```

---

## Error 3: "Network request failed"

### Full Error:
```
ApolloError: Network request failed
    at new ApolloError
```

### Cause:
Frontend can't reach backend (trying localhost in production).

### Solution:

**Check Apollo Client config**:
```tsx
// apps/frontend/src/lib/apollo/apollo-client.ts
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  //   ^^^^^ Must be set in production!
});
```

**Set environment variable**:
```bash
# Production .env
NEXT_PUBLIC_GRAPHQL_URL=https://api.your-domain.com/graphql
```

**Important**: Must start with `NEXT_PUBLIC_` to be accessible in browser!

---

## Error 4: "Hydration failed"

### Full Error:
```
Error: Hydration failed because the initial UI does not match what was rendered on the server
```

### Cause:
Server and client rendered different HTML (common with conditional rendering based on screen size).

### Solution 1: Use CSS Media Queries
```tsx
// Instead of JavaScript:
const isMobile = window.innerWidth < 768; // ❌

// Use CSS:
className="hidden md:block" // ✅
```

### Solution 2: Suppress Hydration Warning
```tsx
// Only if absolutely necessary
<div suppressHydrationWarning>
  {isMobile ? <Mobile /> : <Desktop />}
</div>
```

### Solution 3: Dynamic Import with SSR disabled
```tsx
import dynamic from 'next/dynamic';

const AIChatbot = dynamic(
  () => import('./AIChatbot'),
  { ssr: false } // Disable server-side rendering
);
```

---

## Error 5: "Cannot connect to database"

### Full Error:
```
PrismaClientInitializationError: Can't reach database server
```

### Cause:
Wrong `DATABASE_URL` or database not accessible from deployment platform.

### Solution:

**Check connection string format**:
```bash
# PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# With SSL (required by most cloud providers)
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public&sslmode=require"
```

**Common Issues**:

1. **IP Whitelist**: Add deployment platform IPs to database firewall
   ```
   Vercel: Add 0.0.0.0/0 (or specific Vercel IPs)
   Railway: Automatically handled
   Render: Check their IP ranges
   ```

2. **SSL Required**: Add `?sslmode=require` to connection string

3. **Connection Pooling**: Use PgBouncer for serverless
   ```bash
   DATABASE_URL="postgresql://user:password@host:6543/dbname?pgbouncer=true"
   ```

---

## Error 6: "Module not found"

### Full Error:
```
Module not found: Can't resolve '@/components/ai/chatbot'
```

### Cause:
Path alias not configured or wrong import path.

### Solution:

**Check tsconfig.json**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Fix imports**:
```tsx
// ❌ Wrong
import { AIChatbot } from 'components/ai/chatbot';

// ✅ Correct
import { AIChatbot } from '@/components/ai/chatbot';
```

---

## Error 7: "GraphQL validation failed"

### Full Error:
```
GraphQLError: Unknown type "AiChatInput"
```

### Cause:
GraphQL schema not properly loaded or type definitions missing.

### Solution:

**Check schema is exported**:
```typescript
// apps/backend/src/graphql/schema.ts
export const typeDefs = gql`
  input AiChatInput {
    message: String!
    conversationId: String
    context: AiChatContext
  }
`;
```

**Regenerate schema**:
```bash
cd apps/backend
yarn codegen
```

---

## Error 8: "Authentication required"

### Full Error:
```
{
  "errors": [{
    "message": "Authentication required",
    "extensions": { "code": "UNAUTHENTICATED" }
  }]
}
```

### Cause:
Token not being sent or invalid token.

### Solution:

**Check Apollo Client auth link**:
```tsx
// apps/frontend/src/lib/apollo/apollo-client.ts
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});
```

**Check backend auth middleware**:
```typescript
// Resolver should NOT require auth for public AI chat
aiChat: async (_, args, context) => {
  // Allow public access (no context.requireAuth())
  const toolContext = {
    userId: context.user?.id, // Optional
    userRole: context.user?.role || 'PUBLIC',
  };
}
```

---

## Error 9: "Rate limit exceeded"

### Full Error:
```
Error: Too many requests, please try again later
```

### Cause:
Too many API calls to Gemini or your own rate limiter.

### Solution:

**Increase rate limits**:
```typescript
// libs/auth/src/lib/middleware/rate-limit.middleware.ts
export const rateLimitConfig = {
  public: { points: 100, duration: 60 }, // 100 requests per minute
  authenticated: { points: 500, duration: 60 },
};
```

**Implement caching**:
```typescript
// Cache common queries
const cacheKey = `ai:${messageHash}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
```

**Gemini API limits**:
- Free tier: 60 requests/minute
- Paid tier: Much higher
- Solution: Upgrade or implement queuing

---

## Error 10: "Build optimization failed"

### Full Error:
```
Failed to compile.
./node_modules/some-package/index.js
Module parse failed: Unexpected token
```

### Cause:
Package uses features not supported by build system.

### Solution:

**Add to next.config.js**:
```javascript
module.exports = {
  transpilePackages: ['@apollo/client', 'framer-motion'],
  experimental: {
    esmExternals: 'loose',
  },
};
```

---

## Error 11: "Memory limit exceeded"

### Full Error:
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

### Cause:
Build process runs out of memory (common in CI/CD).

### Solution:

**Increase Node memory**:
```json
// package.json
{
  "scripts": {
    "build:frontend": "NODE_OPTIONS='--max-old-space-size=4096' nx build frontend"
  }
}
```

**Or in deployment platform**:
```bash
# Vercel: Automatically handled
# Railway: Settings → Deployment → Resource Limits
# Docker: --memory=4g flag
```

---

## Error 12: "CORS policy error"

### Full Error:
```
Access to fetch at 'https://api.example.com' from origin 'https://frontend.com' has been blocked by CORS policy
```

### Cause:
Backend not allowing requests from frontend domain.

### Solution:

**Configure CORS in backend**:
```typescript
// apps/backend/src/main.ts
app.enableCors({
  origin: [
    'http://localhost:4200',
    'https://your-production-domain.com',
  ],
  credentials: true,
});
```

---

## 🛠️ General Debugging Steps

### 1. Check Logs
```bash
# Vercel
vercel logs

# Railway
railway logs

# Docker
docker logs container-name
```

### 2. Test Locally First
```bash
# Build production version
yarn build:frontend
yarn build:backend

# Run production version
NODE_ENV=production yarn start:frontend
NODE_ENV=production yarn start:backend

# Test in browser
```

### 3. Check Environment Variables
```bash
# Vercel
vercel env ls

# Railway
railway variables

# Or check deployment platform dashboard
```

### 4. Verify Dependencies
```bash
# Check all dependencies installed
yarn install --frozen-lockfile

# Check for peer dependency warnings
yarn install --check-files
```

### 5. Clear Build Cache
```bash
# Frontend
rm -rf apps/frontend/.next
rm -rf apps/frontend/node_modules/.cache

# Backend
rm -rf apps/backend/dist
rm -rf node_modules/.cache

# Rebuild
yarn build
```

---

## 📞 Quick Fix Commands

### Complete Reset:
```bash
# Nuclear option - start fresh
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf apps/*/.next
rm -rf apps/*/dist
yarn install
yarn build
```

### Test Production Build:
```bash
NODE_ENV=production yarn build
NODE_ENV=production yarn start
```

### Check Port Conflicts:
```bash
# Windows
netstat -ano | findstr :4200
netstat -ano | findstr :4000

# Linux/Mac
lsof -i :4200
lsof -i :4000
```

---

## ✅ Prevention Checklist

Before deploying:

- [ ] Test production build locally
- [ ] Set all environment variables
- [ ] Check database connection
- [ ] Verify API endpoints not hardcoded
- [ ] Test with production data
- [ ] Check bundle size
- [ ] Run lighthouse audit
- [ ] Test error scenarios
- [ ] Set up monitoring
- [ ] Prepare rollback plan

---

## 🎯 Still Having Issues?

1. **Check specific error message** in logs
2. **Search error on Google** with "Next.js" or "NestJS"
3. **Check GitHub issues** for packages you use
4. **Test each component separately** to isolate issue
5. **Provide full error stack trace** when asking for help

The chatbot is designed to be deployment-ready with all common issues addressed! 🚀
