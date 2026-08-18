# Email Verification GraphQL Schema Fix

**Date**: January 19, 2025  
**Status**: ✅ Fixed

## Problem

Email verification was working (code validated, user marked as verified, success email sent), but GraphQL was returning an error:

```
"Cannot return null for non-nullable field User.role."
```

## Root Cause

The `VerifyEmailUseCase` was returning a user object without the `role` field, but the GraphQL schema defines `User.role` as non-nullable (`UserRole!`).

### GraphQL Schema
```graphql
type User {
  id: ID!
  email: Email!
  name: String!
  role: UserRole!  # ← NON-NULLABLE, must be provided
  emailVerified: Boolean!
  # ... other fields
}

type EmailVerificationPayload {
  success: Boolean!
  message: String!
  user: User  # ← Returns User type which requires role
}
```

### Use Case Response (Before Fix)
```typescript
return {
  success: true,
  message: 'Email verified successfully',
  user: {
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    emailVerified: true,
    // ❌ Missing role field!
  },
};
```

## The Fix

Added `role` field to both return statements in `VerifyEmailUseCase`:

### 1. Updated TypeScript Interface
```typescript
export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;        // ✅ Added role
    emailVerified: boolean;
  };
}
```

### 2. Updated "Already Verified" Response
```typescript
if (user.emailVerified) {
  return {
    success: true,
    message: 'Email already verified',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,    // ✅ Added
      emailVerified: true,
    },
  };
}
```

### 3. Updated Success Response
```typescript
return {
  success: true,
  message: 'Email verified successfully',
  user: {
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    role: updatedUser.role,  // ✅ Added
    emailVerified: true,
  },
};
```

## Backend Logs Showing Success

The verification actually worked successfully before the fix:
```
✅ DEBUG: Verification found: { 
  code: '648318', 
  expiresAt: 2026-08-19T17:01:01.623Z, 
  expired: false 
}
[17:02:20 UTC] INFO: Email sent successfully
  subject: "Email Verified Successfully - SnakeSOS"
```

But GraphQL failed when trying to serialize the response because `role` was missing.

## Testing

After the fix, email verification should:
1. ✅ Validate the 6-digit code
2. ✅ Mark user as verified in database
3. ✅ Delete the verification code (one-time use)
4. ✅ Send success email
5. ✅ Return complete user object with role
6. ✅ Frontend receives success response and redirects to login

## Files Modified

- `libs/backend/modules/src/auth/application/use-cases/verify-email.use-case.ts`

## Related Fixes

This session fixed multiple authentication issues:

1. **Password Reset Table Mismatch** - Reset was updating `User.password` but login checked `Account.password`
2. **Password Reset Library Mismatch** - Reset used `bcrypt`, login used `bcryptjs`
3. **Email Verification UX** - Improved paste handling for 6-digit OTP codes
4. **Email Verification GraphQL** - Added missing `role` field to response

## Prevention

When creating GraphQL responses:
1. **Check the schema** - Ensure all non-nullable fields are provided
2. **Match the type** - Return all fields defined in the GraphQL type
3. **Test the full flow** - Not just the business logic, but the GraphQL serialization too
4. **Use TypeScript** - Strong typing would catch missing fields at compile time if properly configured

## Key Learnings

1. **Business logic can succeed but GraphQL can still fail** - The verification worked but response serialization failed
2. **Non-nullable fields are strict** - GraphQL will throw errors if you try to return null for non-nullable fields
3. **Check schema requirements** - Always verify what fields the GraphQL type expects
4. **Backend logs tell the story** - The "Email sent successfully" proved verification worked, but GraphQL error showed response issue
