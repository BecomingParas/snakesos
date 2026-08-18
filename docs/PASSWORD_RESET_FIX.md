# Password Reset Fix - Table and Library Mismatch

**Date**: January 19, 2025  
**Status**: ✅ Fixed

## Problem Summary

Password reset was completing successfully (no errors) but users could not login immediately after resetting their password. Login would fail with "Invalid email or password" error.

## Root Cause Analysis

The issue was caused by **two critical mismatches**:

### 1. Table Mismatch
- **ResetPasswordUseCase**: Updated `User.password` field
- **LoginUseCase**: Checked `Account.password` field
- These are different database tables!

### 2. Library Mismatch  
- **ResetPasswordUseCase**: Used `bcrypt` library (`import * as bcrypt from 'bcrypt'`)
- **LoginUseCase**: Used `bcryptjs` library (`import bcrypt from 'bcryptjs'`)
- Different hashing implementations could potentially cause issues

## Database Schema Context

From `schema.prisma`:

```prisma
model User {
  id       String  @id @default(uuid())
  email    String  @unique
  password String? // Legacy field - not used by Better Auth
  // ... other fields
  accounts Account[]
}

model Account {
  id           String  @id @default(uuid())
  userId       String
  providerId   String  // "credential", "google", etc.
  accountId    String  // Provider-specific account ID
  password     String? // Hashed password for credential accounts (Better Auth)
  // ... other fields
}
```

**Better Auth Pattern**: Password authentication uses the `Account` table with `providerId: 'credential'`, not the `User.password` field.

## The Fix

Updated `reset-password.use-case.ts`:

### Changes Made:

1. **Changed bcrypt import** from `bcrypt` to `bcryptjs`:
   ```typescript
   // Before:
   import * as bcrypt from 'bcrypt';
   
   // After:
   import bcrypt from 'bcryptjs';
   ```

2. **Updated password storage location** to use `Account` table:
   ```typescript
   // Find credential account (Better Auth pattern)
   const account = await prisma.account.findFirst({
     where: {
       userId: user.id,
       providerId: 'credential',
     },
   });

   if (!account) {
     throw new NotFoundError('Credential account not found');
   }

   // Update account password (where login checks it)
   await prisma.account.update({
     where: { id: account.id },
     data: {
       password: hashedPassword,
     },
   });

   // Also update user table fields (for legacy compatibility)
   await prisma.user.update({
     where: { id: user.id },
     data: {
       passwordResetToken: null,
       passwordResetExpiry: null,
     },
   });
   ```

## Login Flow (for reference)

From `login.use-case.ts`:

```typescript
// Find credential account
const account = await prisma.account.findFirst({
  where: {
    userId: user.id,
    providerId: 'credential',
  },
});

if (!account || !account.password) {
  throw new AuthenticationError('Invalid email or password');
}

// Verify password using bcryptjs
const isPasswordValid = await bcrypt.compare(password, account.password);
```

## Testing Performed

1. User requests password reset (receives OTP code)
2. User submits reset form with email + code + new password
3. Backend logs show success: `errors: 0`
4. User immediately attempts login with new password
5. ✅ **Login now succeeds** (previously failed)

## Files Modified

- `libs/backend/modules/src/auth/application/use-cases/reset-password.use-case.ts`

## Files Referenced

- `libs/backend/modules/src/auth/application/use-cases/login.use-case.ts`
- `libs/database/prisma/schema.prisma`

## Related Issues

- OTP-based password reset (using `Verification` table with email + code)
- Better Auth integration pattern
- Consistent bcrypt library usage across auth flows

## Key Learnings

1. **Consistency is critical**: Always use the same bcrypt library (`bcryptjs` vs `bcrypt`) across all password operations
2. **Know your auth pattern**: Better Auth stores credentials in `Account` table, not `User.password`
3. **Match read and write operations**: Password reset must update the same field that login reads from
4. **Test the full flow**: A successful reset operation doesn't mean the user can login - test end-to-end

## Prevention

To prevent similar issues:

1. Document which tables/fields are used for each auth operation
2. Use consistent imports across all auth use cases
3. Always test the complete user journey (reset → login)
4. Consider creating a shared password hashing service to enforce consistency
