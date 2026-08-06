# Authentication Fix Summary

## Problem Identified

When trying to login with seeded users (`admin@snakerescue.com`, `user@snakerescue.com`, `volunteer@snakerescue.com`), the error was:

```
WARN [Better Auth]: Credential account not found
Error: Invalid email or password
```

## Root Causes

### 1. Missing Credential Accounts
Better Auth email/password authentication requires **TWO database tables**:
- ✅ `users` table - for user data (we had this)
- ❌ `accounts` table - for authentication provider info (we were missing this!)

When a user signs up via Better Auth's `signUpEmail`, it creates:
1. A record in `users` table
2. A record in `accounts` table with `provider='credential'`

Our manual seed only created users, not accounts.

### 2. Password Hashing Mismatch
- Our seed script used **bcrypt** hashing: `$2a$10$...`
- Better Auth uses **scrypt** hashing by default
- Result: Even if accounts existed, password verification would fail

## Solutions Applied

### ✅ Fix 1: Created Credential Accounts
```sql
INSERT INTO accounts (id, "userId", provider, "providerAccountId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'credential', id, NOW(), NOW()
FROM users
WHERE email IN ('admin@snakerescue.com', 'user@snakerescue.com', 'volunteer@snakerescue.com');
```

This created 3 credential account records linking to our 3 seeded users.

### ✅ Fix 2: Configured Better Auth to Use bcrypt
Updated `libs/auth/src/lib/authentication/config/better-auth.config.ts`:

```typescript
emailAndPassword: {
  enabled: true,
  requireEmailVerification: false, // Testing only
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

### ✅ Fix 3: Updated Seed Script
Modified `libs/database/prisma/seed.ts` to create both users and credential accounts:

```typescript
const user = await prisma.user.create({ data: userData });

// Create credential account for Better Auth
await prisma.account.create({
  data: {
    userId: user.id,
    provider: 'credential',
    providerAccountId: user.id,
  },
});
```

## Verification

### Check Users Table
```bash
docker exec postgres-snake-rescue psql -U devuser -d snake_rescue -c "SELECT id, email, name, role FROM users;"
```

### Check Accounts Table
```bash
docker exec postgres-snake-rescue psql -U devuser -d snake_rescue -c "SELECT a.id, a.provider, u.email FROM accounts a JOIN users u ON a.\"userId\" = u.id;"
```

Expected output: 3 accounts with `provider='credential'`

## Testing Login

### 🔴 IMPORTANT: Restart Backend Server
The bcrypt configuration change requires a backend restart:

```bash
# Terminal with backend running - press Ctrl+C
# Then restart:
npm run dev:backend
```

### Test Credentials
Once backend is restarted, try logging in at `http://localhost:4200/login`:

```
Email: admin@snakerescue.com
Password: password123
```

Or:
```
Email: user@snakerescue.com
Password: password123
```

Or:
```
Email: volunteer@snakerescue.com
Password: password123
```

## Expected Behavior After Fix

1. ✅ Login request reaches backend
2. ✅ User found in `users` table
3. ✅ Credential account found in `accounts` table
4. ✅ Password verified with bcrypt
5. ✅ Session/token created
6. ✅ `accessToken` and `refreshToken` returned to frontend
7. ✅ User redirected to dashboard

## If Login Still Fails

### Check Backend Logs
Look for these log messages in the backend terminal:
- ✅ `"GraphQL request started"` with `operationName: "Login"`
- ❌ `"WARN [Better Auth]: Credential account not found"` - accounts still missing
- ❌ `"Invalid email or password"` - password verification failed

### Debug Checklist
1. [ ] Backend server restarted after configuration change?
2. [ ] 3 records in `accounts` table with `provider='credential'`?
3. [ ] Better Auth config using bcrypt for password hashing?
4. [ ] Password in database starts with `$2a$` or `$2b$` (bcrypt format)?

### Manual Password Verification Test
```bash
# Connect to database
docker exec -it postgres-snake-rescue psql -U devuser -d snake_rescue

# Check password hash format
SELECT email, LEFT(password, 10) as hash_prefix FROM users LIMIT 1;

# Should show: $2a$ or $2b$ (bcrypt format)
```

## Files Modified

1. ✅ `libs/auth/src/lib/authentication/config/better-auth.config.ts` - bcrypt configuration
2. ✅ `libs/database/prisma/seed.ts` - creates accounts with users
3. ✅ Database: `accounts` table - 3 credential records inserted

## Why This Architecture?

Better Auth separates **identity** (users table) from **authentication methods** (accounts table):

- One user can have multiple auth methods (email/password, Google OAuth, GitHub, etc.)
- Each method is a separate record in `accounts` table
- Email/password auth uses `provider='credential'`
- OAuth providers use `provider='google'`, `provider='github'`, etc.

This design allows users to link multiple authentication methods to one account.

## Production Considerations

### Switch to scrypt for New Users
Once testing is complete, remove the bcrypt override and let Better Auth use scrypt (more secure):

```typescript
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true, // Enable in production!
  // Remove password.hash and password.verify overrides
},
```

### Migration Strategy
If you have existing bcrypt passwords in production:
1. Keep bcrypt configuration for now
2. Gradually migrate to scrypt by prompting users to reset passwords
3. Or implement hybrid verification (try scrypt first, fallback to bcrypt)

## References

- [Better Auth Email/Password Docs](https://better-auth.com/docs/authentication/email-password)
- [Better Auth Clerk Migration Guide](https://better-auth.com/docs/guides/clerk-migration-guide) (bcrypt to scrypt migration)
- [Better Auth Database Schema](https://better-auth.com/docs/concepts/database)
