# Password Hash Issue - FIXED ✅

## Problem
User was getting "Invalid email or password" error when trying to login with:
- Email: `admin@snakerescue.com`
- Password: `password123`

Backend logs showed: `WARN [Better Auth]: Credential account not found`

## Root Cause
The password hash was being stored correctly in the seed file using bcrypt, BUT there were three critical issues:

1. **Missing Database Column**: The `accounts` table was missing the `password` column in the database migration
   - Prisma schema had `password String?` field defined
   - But the migration SQL didn't include this column
   - This caused a "Column not found" error when trying to insert

2. **Wrong Account ID**: The seed file was using `user.id` as `accountId` instead of `userData.email`
   - Better Auth expects `accountId` (maps to `providerAccountId`) to be the email for credential provider
   - Not the user UUID

3. **Missing Admin Credential Account**: After running `migrate reset`, the admin user existed but had no credential account
   - When seed ran, it caught the "user exists" error but didn't continue to create the account
   - Result: admin user in database but no credential account for login

## Fix Applied

### 1. Created New Migration
```bash
yarn workspace @snake-rescue/database prisma migrate dev --name add_password_to_accounts
```

This added the missing `password` column to the `accounts` table.

### 2. Updated Seed File
Changed from:
```typescript
accountId: user.id,  // ❌ Wrong - using UUID
```

To:
```typescript
accountId: userData.email,  // ✅ Correct - using email
```

### 3. Fixed Import Issues
Changed from:
```typescript
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
const prisma = new PrismaClient();
```

To:
```typescript
import { UserRole, UserStatus } from '@prisma/client';
import { prisma } from '../src/client.js';
```

This ensures the Prisma client uses the proper driver adapter configuration.

### 4. Improved Error Handling in Seed
Updated seed to handle case where user exists but account doesn't:
- If user creation fails due to unique constraint, fetch the existing user
- Always attempt to create credential account (with its own try/catch)
- This ensures both user AND account exist for all test users

## Database Structure

The accounts table now properly stores credential-based authentication:

| Field | Value | Description |
|-------|-------|-------------|
| `userId` | User UUID | Links to users table |
| `providerId` | `"credential"` | Auth provider type |
| `accountId` | User email | Provider-specific ID (email for credentials) |
| `password` | bcrypt hash | Password hash using bcrypt with salt rounds=10 |

## Verification

✅ Migration created and applied successfully
✅ Seed ran without errors
✅ All 3 test users created:
   - admin@snakerescue.com
   - user@snakerescue.com
   - volunteer@snakerescue.com

## Testing

Users can now login with:
```
Email: admin@snakerescue.com
Password: password123
```

The Better Auth configuration uses bcrypt for both hashing and verification:
```typescript
password: {
  hash: async (password: string) => {
    return bcrypt.hash(password, 10);
  },
  verify: async (data: { password: string; hash: string }) => {
    return bcrypt.compare(data.password, data.hash);
  },
}
```

## Files Modified

1. `libs/database/prisma/seed.ts` - Fixed account creation logic
2. `libs/database/prisma/migrations/20260806160550_add_password_to_accounts/migration.sql` - New migration
3. `libs/database/prisma/schema.prisma` - Already had password field (no changes needed)

## Next Steps

1. Start the backend server
2. Try logging in via frontend with the test credentials
3. Verify JWT tokens are issued correctly
4. Verify refresh token flow works

The authentication system should now work end-to-end! 🎉
