# Email Verification Troubleshooting Guide

**Date**: January 19, 2025  
**Issue**: "Invalid verification code not found" error

## Error Analysis

When you see the error:
```json
{
  "errors": [{
    "message": "Invalid verification code not found",
    "extensions": {
      "code": "NOT_FOUND",
      "statusCode": 404
    }
  }]
}
```

This means the verification code doesn't exist in the database.

## Common Causes

1. **Code Already Used**: Verification codes are single-use and are deleted after successful verification
2. **Code Expired**: Codes expire after 24 hours
3. **Wrong Email**: The email doesn't match the code
4. **Code Never Created**: Registration didn't complete properly

## How to Fix

### Option 1: Resend Verification Email (Recommended)

Use the `resendVerification` mutation to generate a new code:

```graphql
mutation ResendVerification {
  resendVerification(input: {
    email: "parasshresthanever@gmail.com"
  }) {
    success
    message
  }
}
```

This will:
- Delete any old verification codes for this email
- Generate a new 6-digit code
- Send a new verification email
- Code is valid for 24 hours

### Option 2: Check Database (For Debugging)

Run the SQL query in `scripts/sql/check-verifications.sql`:

```sql
-- Check verification records for your email
SELECT 
  id,
  identifier,
  code,
  type,
  expires_at,
  created_at,
  CASE 
    WHEN expires_at < NOW() THEN 'EXPIRED'
    ELSE 'VALID'
  END as status
FROM verifications
WHERE identifier = 'parasshresthanever@gmail.com'
ORDER BY created_at DESC;
```

This shows:
- All verification codes for your email
- Whether they're expired or valid
- When they were created

### Option 3: Check Backend Logs

When registration or resend happens, look for these logs:

```
🔍 DEBUG: About to send verification email
🔍 DEBUG: Email: parasshresthanever@gmail.com
🔍 DEBUG: Verification Code: 123456
```

This shows the actual code that was generated.

## Understanding the Error Message

The error message format is:
```
"Invalid verification code" + " not found"
```

The " not found" part is automatically added by the `NotFoundError` class:

```typescript
// In verify-email.use-case.ts
if (!verification) {
  throw new NotFoundError('Invalid verification code');
  // Becomes: "Invalid verification code not found"
}
```

## Verification Flow

1. **Registration**: User signs up
   - 6-digit code generated (e.g., `123456`)
   - Saved to `verifications` table with `type: 'email'`
   - Email sent with code
   - Expires in 24 hours

2. **Verification**: User enters code
   - Backend looks up code in `verifications` table
   - Checks if expired
   - Updates `users.emailVerified = true`
   - **Deletes verification record** (single-use)

3. **Resend**: User requests new code
   - Deletes old verification records
   - Generates new code
   - Sends new email

## Files Involved

- `libs/backend/modules/src/auth/application/use-cases/register.use-case.ts` - Creates verification codes during registration
- `libs/backend/modules/src/auth/application/use-cases/verify-email.use-case.ts` - Validates and uses codes
- `libs/backend/modules/src/auth/application/use-cases/resend-verification.use-case.ts` - Regenerates codes
- `libs/database/prisma/schema.prisma` - `Verification` model definition

## GraphQL Mutations

### Register (creates verification code)
```graphql
mutation Register {
  register(input: {
    email: "user@example.com"
    password: "Password123"
    name: "John Doe"
    phone: "+9779841234567"
  }) {
    accessToken
    user {
      id
      email
      emailVerified
    }
  }
}
```

### Verify Email (uses verification code)
```graphql
mutation VerifyEmail {
  verifyEmail(input: {
    email: "user@example.com"
    code: "123456"
  }) {
    success
    message
    user {
      id
      emailVerified
    }
  }
}
```

### Resend Verification (generates new code)
```graphql
mutation ResendVerification {
  resendVerification(input: {
    email: "user@example.com"
  }) {
    success
    message
  }
}
```

## Testing Checklist

- [ ] User can register and receive verification email
- [ ] Backend logs show verification code
- [ ] Verification code exists in database
- [ ] Code is valid (not expired)
- [ ] User can verify with code
- [ ] After verification, `emailVerified = true`
- [ ] Verification record is deleted after use
- [ ] User can resend if code expired
- [ ] Old codes are deleted when resending

## Prevention Tips

1. **Check email logs**: Make sure emails are actually being sent
2. **Use recent codes**: Codes expire in 24 hours
3. **One-time use**: Don't try to reuse a code
4. **Case sensitivity**: Email lookup uses lowercase
5. **Backend logs**: Always check logs for the actual generated code
