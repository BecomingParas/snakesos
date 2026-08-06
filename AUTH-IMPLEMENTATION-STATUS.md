# Authentication Implementation Status

## 🐛 CRITICAL FIX: Credential Accounts & Password Hashing

### Issue Discovered
Better Auth requires TWO things for email/password authentication:
1. **User record** in `users` table (we had this)
2. **Account record** in `accounts` table with `provider='credential'` (we were missing this!)
3. **Correct password hashing** - Better Auth uses `scrypt` by default, but our seeded passwords used `bcrypt`

### Solution Applied

#### 1. Created Credential Accounts
```sql
INSERT INTO accounts (id, "userId", provider, "providerAccountId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'credential', id, NOW(), NOW()
FROM users
WHERE email IN ('admin@snakerescue.com', 'user@snakerescue.com', 'volunteer@snakerescue.com');
```

#### 2. Configured Better Auth to Use bcrypt
Updated `libs/auth/src/lib/authentication/config/better-auth.config.ts`:
```typescript
emailAndPassword: {
  enabled: true,
  requireEmailVerification: false,
  password: {
    hash: async (password: string) => {
      const bcrypt = await import('bcrypt');
      return bcrypt.hash(password, 10);
    },
    verify: async (password: string, hash: string) => {
      const bcrypt = await import('bcrypt');
      return bcrypt.compare(password, hash);
    },
  },
},
```

#### 3. Updated Seed File
Modified `libs/database/prisma/seed.ts` to create both user and account records for future seeding.

### ✅ Login Should Now Work!

Test credentials:
- Email: `admin@snakerescue.com`
- Password: `password123`

**Note**: You need to restart the backend server for the bcrypt configuration to take effect:
```bash
# Stop the backend (Ctrl+C)
# Then restart
npm run dev:backend
```

## ✅ Completed Tasks

### 1. Database Setup
- ✅ PostgreSQL container running (`postgres-snake-rescue`)
- ✅ Prisma schema synced with `npm run db:push`
- ✅ Database seeded with 3 test users:
  - `admin@snakerescue.com` (ADMIN) - password: `password123`
  - `user@snakerescue.com` (CITIZEN) - password: `password123`
  - `volunteer@snakerescue.com` (VOLUNTEER) - password: `password123`

### 2. CORS Configuration
- ✅ Backend CORS updated to allow both ports:
  - `http://localhost:3000` (default Next.js)
  - `http://localhost:4200` (current frontend)
- ✅ Environment variable: `CORS_ORIGINS="http://localhost:3000,http://localhost:4200"`

### 3. GraphQL Schema Fixes
- ✅ Generated schema updated to include `accessToken` field
- ✅ Frontend fragments aligned with schema
- ✅ Excluded problematic `graphql-operations.ts` from TypeScript compilation

### 4. Backend Validation Fixes
- ✅ Removed `confirmPassword` requirement from `RegisterInputSchema`
- ✅ Updated login and register DTOs

### 5. Better Auth Configuration
- ✅ **Added Bearer Token Plugin** for JWT support
- ✅ Email verification temporarily disabled for testing (`requireEmailVerification: false`)
- ✅ Session configured for 7-day expiry
- ✅ Prisma adapter properly configured

### 6. Use Cases Updated
- ✅ `RegisterUseCase` now extracts tokens from Better Auth session response
- ✅ `LoginUseCase` now extracts tokens from Better Auth session response
- ✅ Both use cases return proper `AuthPayload` with:
  - `accessToken`
  - `refreshToken` (same as access token for now)
  - Full user object
  - `expiresIn`

### 7. Frontend TypeScript Errors Fixed
- ✅ Auth context type assertions for GraphQL hooks
- ✅ Hydration warning in `layout.tsx` resolved
- ✅ Turbopack configuration fixed with proper root directory

## 🔧 Recent Changes

### Better Auth Configuration (`libs/auth/src/lib/authentication/config/better-auth.config.ts`)
```typescript
import { bearer } from 'better-auth/plugins';

plugins: [
  bearer({
    requireSignature: false, // Set to true in production
  }),
],
```

**Why**: Better Auth uses session-based auth (cookies) by default. The Bearer plugin enables JWT token responses, which the GraphQL schema expects.

### Register Use Case (`libs/backend/modules/src/auth/application/use-cases/register.use-case.ts`)
```typescript
// Extract token from Better Auth response (Bearer plugin)
const session = (result as any).session;
const accessToken = session?.token || '';
const refreshToken = accessToken; // Same token for now
```

### Login Use Case (`libs/backend/modules/src/auth/application/use-cases/login.use-case.ts`)
```typescript
// Extract token from Better Auth response (Bearer plugin)
const session = (result as any).session;
const accessToken = session?.token || '';
const refreshToken = accessToken; // Same token for now
```

## 📝 How Better Auth Bearer Plugin Works

According to [Better Auth documentation](https://better-auth.com/docs/plugins/bearer):

1. **Sign Up/Sign In**: Better Auth returns a session token in the response
2. **Token Storage**: Frontend should store the token (e.g., localStorage)
3. **Token Usage**: Include token in `Authorization: Bearer <token>` header
4. **Server Validation**: Use `auth.api.getSession({ headers })` to validate

## 🧪 Testing Instructions

### Backend
```bash
# Start backend server
npm run dev:backend
# or
nx serve backend

# Backend should be running on http://localhost:4000
```

### Frontend
```bash
# Start frontend server
npm run dev:frontend
# or
cd apps/frontend && npm run dev

# Frontend should be running on http://localhost:4200
```

### Test Registration
1. Navigate to `http://localhost:4200/register`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com (use a unique email)
   - Phone: +9779748802442
   - Password: password123
3. Submit the form
4. Check browser console for logs
5. Check backend logs for API calls

### Test Login with Seeded Users
1. Navigate to `http://localhost:4200/login`
2. Use one of the seeded accounts:
   - Email: `admin@snakerescue.com`
   - Password: `password123`
3. Submit the form
4. Should redirect to dashboard

## 🐛 Known Issues & Next Steps

### To Verify
- [ ] Test if Bearer plugin properly returns tokens in session response
- [ ] Verify frontend receives and stores tokens
- [ ] Test protected routes with token authentication
- [ ] Test token refresh flow

### Potential Issues
1. **Better Auth API Response Format**: The use cases assume `result.session.token` exists. This needs runtime verification.
2. **Email Verification**: Currently disabled for testing. Enable in production.
3. **Token Signature**: Bearer plugin has `requireSignature: false`. Enable in production.
4. **Refresh Token**: Currently using the same token for both access and refresh. Consider implementing proper refresh token flow.

### If Tokens Still Don't Work
**Option A**: Update Better Auth response extraction based on actual response format
**Option B**: Switch to pure cookie-based auth and remove token expectations from GraphQL schema

## 📁 Modified Files

1. `libs/auth/src/lib/authentication/config/better-auth.config.ts` - Added Bearer plugin
2. `libs/backend/modules/src/auth/application/use-cases/register.use-case.ts` - Updated token extraction
3. `libs/backend/modules/src/auth/application/use-cases/login.use-case.ts` - Updated token extraction
4. `.env` - Updated CORS origins
5. `apps/frontend/next.config.js` - Fixed Turbopack root

## 🚀 Next Actions

1. **Start both servers**:
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

2. **Test registration** with a new unique email

3. **Check backend response** in browser DevTools Network tab:
   - Look for `register` GraphQL mutation response
   - Verify `accessToken` is present in response
   - Check if token is a valid JWT or session token

4. **Debug if needed**:
   - Add console.logs in `register.use-case.ts` to inspect `result` object
   - Check what Better Auth actually returns in the session

5. **Test login** with seeded users

## 📚 Resources

- [Better Auth Bearer Plugin](https://better-auth.com/docs/plugins/bearer)
- [Better Auth Email/Password Auth](https://better-auth.com/docs/authentication/email-password)
- [Better Auth Session Management](https://better-auth.com/docs/concepts/session)
