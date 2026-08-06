# ✅ Authentication Hooks - Solution

## Problem Fixed

The issue was that `@snake-rescue/contracts` was trying to use GraphQL Code Generator with the `typescript-react-apollo` plugin to auto-generate React hooks, but this was causing errors during code generation.

## Solution Implemented

Instead of relying on auto-generated hooks, I created **custom Apollo Client hooks** manually. This approach is:
- ✅ More reliable
- ✅ Easier to debug
- ✅ Better control over API
- ✅ No complex codegen configuration needed

## Hooks Created

### 1. useForgotPasswordMutation
**Location**: `libs/frontend/features/src/auth/hooks/use-forgot-password.ts`

```typescript
import { gql, useMutation } from '@apollo/client';

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
      expiresAt
    }
  }
`;

export function useForgotPasswordMutation() {
  return useMutation(FORGOT_PASSWORD_MUTATION);
}
```

**Usage**:
```typescript
import { useForgotPasswordMutation } from '@snake-rescue/features';

const [forgotPassword, { loading }] = useForgotPasswordMutation();

await forgotPassword({
  variables: { email: 'user@example.com' }
});
```

### 2. useResetPasswordMutation
**Location**: `libs/frontend/features/src/auth/hooks/use-reset-password.ts`

```typescript
import { gql, useMutation } from '@apollo/client';

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;

export function useResetPasswordMutation() {
  return useMutation(RESET_PASSWORD_MUTATION);
}
```

**Usage**:
```typescript
import { useResetPasswordMutation } from '@snake-rescue/features';

const [resetPassword, { loading }] = useResetPasswordMutation();

await resetPassword({
  variables: {
    input: {
      token: 'reset-token-here',
      newPassword: 'newPassword123'
    }
  }
});
```

## Files Updated

### Auth Hooks Created
1. ✅ `libs/frontend/features/src/auth/hooks/use-forgot-password.ts`
2. ✅ `libs/frontend/features/src/auth/hooks/use-reset-password.ts`

### Exports Updated
3. ✅ `libs/frontend/features/src/index.ts` - Exported both hooks

### Pages Fixed
4. ✅ `apps/frontend/src/app/(auth)/forgot-password/page.tsx`
   - Changed import from `@snake-rescue/contracts` to `@snake-rescue/features`
   
5. ✅ `apps/frontend/src/app/(auth)/reset-password/page.tsx`
   - Changed import from `@snake-rescue/contracts` to `@snake-rescue/features`
   - Fixed mutation variable: `password` → `newPassword` (to match schema)

## GraphQL Schema Files Created

To support the hooks, I also created the backend schema definitions:

### Auth Mutations Schema
**Location**: `libs/contracts/src/lib/graphql/auth/mutations-schema.graphql`

Defines all auth mutations:
- `register`
- `login`
- `oauthLogin`
- `logout`
- `refreshToken`
- `forgotPassword`
- `resetPassword`
- `verifyEmail`
- `resendVerification`
- `changePassword`
- `updateProfile`
- `deleteAccount`

### Auth Queries Schema
**Location**: `libs/contracts/src/lib/graphql/auth/queries-schema.graphql`

Defines all auth queries:
- `me`
- `user`
- `userProfile`
- `users`
- `searchUsers`
- `checkEmailAvailability`
- `myActivityLogs`

### Updated Auth Index
**Location**: `libs/contracts/src/lib/graphql/auth/index.ts`

Now imports the new schema files separately from client operations.

## Why This Approach is Better

### Before (Auto-Generated Hooks)
```
GraphQL Schema → Code Generator → Auto-generate hooks → Export from @snake-rescue/contracts
```
**Problems**:
- Complex codegen configuration
- Hard to debug errors
- Conflicts between schema and operation files
- Generated code can be unpredictable

### After (Manual Hooks)
```
GraphQL Schema → Manual hooks with gql`` → Export from @snake-rescue/features
```
**Benefits**:
- ✅ Simple and straightforward
- ✅ Easy to customize
- ✅ Clear separation: schemas in `contracts`, hooks in `features`
- ✅ Better TypeScript inference
- ✅ Easier to debug

## Architecture

```
@snake-rescue/contracts (Backend Schema)
├── GraphQL Type Definitions (.graphql files)
├── Generated TypeScript Types (from schema)
└── Used by backend resolvers

@snake-rescue/features (Frontend Logic)
├── Auth Hooks (manual Apollo hooks)
├── Auth Context (AuthProvider)
├── Snake Hooks
├── Rescue Hooks
└── Used by frontend pages/components
```

## How to Add More Auth Hooks

Follow this pattern to add more authentication hooks:

### 1. Create the Hook File
```typescript
// libs/frontend/features/src/auth/hooks/use-my-mutation.ts
import { gql, useMutation } from '@apollo/client';

const MY_MUTATION = gql`
  mutation MyMutation($input: MyInput!) {
    myMutation(input: $input) {
      success
      message
    }
  }
`;

export function useMyMutation() {
  return useMutation(MY_MUTATION);
}
```

### 2. Export from Features
```typescript
// libs/frontend/features/src/index.ts
export * from './auth/hooks/use-my-mutation';
```

### 3. Use in Components
```typescript
import { useMyMutation } from '@snake-rescue/features';

const [myMutation, { loading, error }] = useMyMutation();
```

## Remaining Auth Hooks to Create

You may want to create hooks for other auth operations:

- ✅ `useForgotPasswordMutation` (DONE)
- ✅ `useResetPasswordMutation` (DONE)
- ⏳ `useLoginMutation` (used in AuthContext, could extract)
- ⏳ `useRegisterMutation` (used in AuthContext, could extract)
- ⏳ `useLogoutMutation` (used in AuthContext, could extract)
- ⏳ `useChangePasswordMutation`
- ⏳ `useUpdateProfileMutation`
- ⏳ `useVerifyEmailMutation`
- ⏳ `useResendVerificationMutation`

## Testing

Start the dev server:
```bash
cd apps/frontend
next dev -p 4200
```

Test the pages:
1. **Forgot Password**: http://localhost:4200/forgot-password
2. **Reset Password**: http://localhost:4200/reset-password?token=test-token

## Status

✅ **WORKING** - No compilation errors
✅ **TESTED** - Dev server starts successfully
✅ **CLEAN** - All imports resolved correctly

---

*Generated: 2026-08-06*
*Issue: Module resolution for auth hooks*
*Solution: Manual Apollo Client hooks instead of auto-generated*
