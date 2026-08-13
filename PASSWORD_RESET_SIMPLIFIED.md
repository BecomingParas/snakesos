# Password Reset Flow - With OTP Verification

## Overview
The password reset flow has been updated to match the OTP verification pattern used in email verification. Users enter their email on the forgot password page, receive a 6-digit OTP code via email, then enter the code along with their new password on the reset password page.

## Flow

### Complete User Journey
1. **Forgot Password Page** (`/forgot-password`)
   - User enters email
   - Clicks "Send Reset Link"
   - Backend generates 6-digit OTP code
   - OTP stored in database (type: 'password_reset')
   - Email sent with OTP code
   - **Automatic redirect** to `/reset-password?email=user@example.com`

2. **Reset Password Page** (`/reset-password?email=user@example.com`)
   - Email pre-populated from URL
   - User enters 6-digit verification code
   - User enters new password
   - User confirms new password
   - Backend validates email + code combination
   - Password reset successful
   - Redirect to `/login`

## Changes Made

### 1. Backend Changes

#### `libs/backend/modules/src/auth/application/use-cases/forgot-password.use-case.ts`
- Removed `AuthService` dependency
- Generates 6-digit OTP code
- Creates verification record with code (type: 'password_reset', 24-hour expiry)
- Sends email with OTP code prominently displayed
- Logs OTP to console for development

#### `libs/backend/modules/src/auth/application/use-cases/reset-password.use-case.ts`
- Changed input from `{ email, newPassword }` to `{ email, code, newPassword }`
- Validates email + code combination (both required)
- Finds verification record by email AND code
- Validates expiration (24 hours)
- Hashes password with bcrypt
- Deletes verification record after use (one-time use)

#### `libs/contracts/src/lib/graphql/auth/inputs.graphql`
- Updated `ResetPasswordInput`:
  ```graphql
  input ResetPasswordInput {
    email: Email!
    code: String!
    newPassword: String!
  }
  ```

#### `libs/backend/modules/src/auth/infrastructure/graphql/resolvers/auth.resolver.ts`
- Updated `forgotPassword` resolver to not require AuthService
- Updated `resetPassword` resolver to accept `{ email, code, newPassword }`

### 2. Frontend Changes

#### `apps/frontend/src/components/auth/forgot-password-form.tsx`
- Removed success page state
- Redirects directly to `/reset-password?email={email}` after request

#### `apps/frontend/src/components/auth/reset-password-form.tsx`
- Added verification code input field
- Code field: 6-digit, centered text, large font, tracking-widest
- Header shows: "We sent a 6-digit code to {email}"
- Form fields order: Code → New Password → Confirm Password
- "Didn't receive code? Request new one" link at bottom

#### `apps/frontend/src/hooks/auth/useResetPassword.ts`
- Updated `ResetPasswordInput` interface:
  ```typescript
  {
    email: string;
    code: string;
    newPassword: string;
  }
  ```

## UI Design

### Reset Password Page Layout
```
┌─────────────────────────────────────┐
│         🔑 Key Icon (Blue)           │
│                                      │
│      Create New Password             │
│ We sent a 6-digit code to           │
│    user@example.com                  │
├─────────────────────────────────────┤
│ Verification Code                    │
│ [     1  2  3  4  5  6     ]        │
│                                      │
│ New Password                         │
│ [🔒 ••••••••••]                     │
│                                      │
│ Confirm New Password                 │
│ [🔒 ••••••••••]                     │
│                                      │
│ [    Reset Password Button    ]     │
├─────────────────────────────────────┤
│ ℹ️  Password requirements:           │
│ • At least 8 characters long        │
│ • Contains uppercase letter (A-Z)    │
│ • Contains lowercase letter (a-z)    │
│ • Contains number (0-9)              │
├─────────────────────────────────────┤
│ Didn't receive code?                │
│ Request new one                      │
└─────────────────────────────────────┘
```

## Security Features

### What's Maintained
- ✅ Verification record created in database
- ✅ 6-digit OTP code (1 in 1,000,000 chance)
- ✅ 24-hour expiration on reset requests
- ✅ One-time use (record deleted after successful reset)
- ✅ Password hashing with bcrypt
- ✅ Email validation
- ✅ Password strength requirements
- ✅ Email + Code validation (both required)

### Security Level
- **More secure** than email-only approach
- **Same pattern** as email verification OTP
- **Prevents** unauthorized resets without code access
- **Rate limiting** possible (can add later)

## Email Template

The forgot password email includes:
- Professional branded template
- **Prominent 6-digit OTP code** displayed in large font
- Reset page link for convenience
- 24-hour expiration notice
- Security warning
- Support contact

## Database Schema

Uses existing `verifications` table:
```prisma
model Verification {
  id         String   @id @default(cuid())
  identifier String   // email
  token      String?  // unique token for DB
  code       String?  // 6-digit OTP **USED**
  type       String   // "password_reset"
  expiresAt  DateTime // 24 hours from creation
  createdAt  DateTime @default(now())
}
```

## Testing

### Test the Complete Flow
1. Navigate to `/forgot-password`
2. Enter email: `parasshresthanever@gmail.com`
3. Click "Send Reset Link"
4. Should redirect to `/reset-password?email=parasshresthanever@gmail.com`
5. Check console logs for OTP: `🔐 PASSWORD RESET OTP for ...`
6. Enter the 6-digit OTP code
7. Enter new password (min 8 chars, uppercase, lowercase, number)
8. Confirm password
9. Click "Reset Password"
10. Should show success message
11. Redirect to `/login`
12. Login with new password

### Check Backend Logs
```bash
# Look for:
🔐 PASSWORD RESET OTP for parasshresthanever@gmail.com: 123456
- Verification record created (type: password_reset)
- Password reset successful
- Verification record deleted
```

### Check Database
```sql
-- Before reset: Should see verification record with code
SELECT * FROM verifications 
WHERE identifier = 'parasshresthanever@gmail.com' 
AND type = 'password_reset';

-- After reset: Record should be deleted
```

## Files Modified

### Backend
- `libs/backend/modules/src/auth/application/use-cases/forgot-password.use-case.ts`
- `libs/backend/modules/src/auth/application/use-cases/reset-password.use-case.ts`
- `libs/backend/modules/src/auth/infrastructure/graphql/resolvers/auth.resolver.ts`
- `libs/contracts/src/lib/graphql/auth/inputs.graphql`

### Frontend
- `apps/frontend/src/components/auth/forgot-password-form.tsx`
- `apps/frontend/src/components/auth/reset-password-form.tsx`
- `apps/frontend/src/hooks/auth/useResetPassword.ts`

## Backend Build Status
✅ Modules built successfully
✅ Backend built successfully
✅ Backend running on port 4000
✅ GraphQL endpoint: http://localhost:4000/graphql

## Comparison with Email Verification

| Feature | Email Verification | Password Reset |
|---------|-------------------|----------------|
| Input Fields | Email + Code | Email + Code + New Password |
| Code Type | 6-digit OTP | 6-digit OTP |
| Expiration | 24 hours | 24 hours |
| One-time Use | ✅ | ✅ |
| Auto-redirect | From signup | From forgot password |
| Success Action | Redirect to /login | Redirect to /login |

Both flows follow the same pattern for consistency!

## Next Steps
1. Test the complete flow
2. Verify OTP code works
3. Verify password reset succeeds
4. Check that old password no longer works
5. Verify new password works for login
