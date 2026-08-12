# GraphQL Authentication Integration

This document explains how the frontend integrates with the backend GraphQL API for authentication.

## Overview

The signup and authentication flow now uses GraphQL mutations instead of REST API endpoints. This provides type-safe communication with the backend and leverages Apollo Client for state management.

## Architecture

### Files Structure

```
apps/frontend/src/
├── lib/
│   ├── apollo/
│   │   ├── client.ts          # Apollo Client configuration
│   │   └── index.ts           # Apollo exports
│   ├── auth/
│   │   ├── auth-client.ts     # Auth functions using GraphQL
│   │   ├── auth-store.ts      # Zustand auth state management
│   │   └── index.ts           # Auth exports
│   └── graphql/
│       └── mutations/
│           ├── auth.mutations.ts  # GraphQL auth mutations
│           └── index.ts          # Mutation exports
├── routes/
│   └── _auth/
│       ├── signup.tsx         # Signup page
│       ├── login.tsx          # Login page
│       ├── forgot-password.tsx
│       ├── reset-password.tsx
│       └── verify-email.tsx
└── schemas/
    └── auth/
        ├── signup.schema.ts   # Zod validation for signup
        └── login.schema.ts    # Zod validation for login
```

## GraphQL Mutations

### Register Mutation

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    accessToken
    refreshToken
    expiresIn
    user {
      id
      email
      name
      role
      phone
      emailVerified
      createdAt
      updatedAt
    }
  }
}
```

**Input:**
```typescript
{
  email: string;
  password: string;
  name: string;
  phone?: string;
  language?: string;
  timezone?: string;
}
```

**Response:**
```typescript
{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}
```

### Login Mutation

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    expiresIn
    user {
      id
      email
      name
      role
      phone
      emailVerified
      createdAt
      updatedAt
    }
  }
}
```

**Input:**
```typescript
{
  email: string;
  password: string;
}
```

## Usage Examples

### Signup Flow

```typescript
import { register } from '@/lib/auth';
import { useAuthStore } from '@/lib/auth';

async function handleSignup(data: SignupFormData) {
  try {
    // Register user - returns AuthPayload with tokens and user
    const authPayload = await register({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    // Access token is automatically stored in localStorage
    // User object is available in authPayload.user
    
    // Set user in global auth store
    useAuthStore.getState().setUser(authPayload.user);
    
    // Navigate to dashboard
    router.navigate(`/dashboard/${authPayload.user.role.toLowerCase()}`);
  } catch (error) {
    console.error('Signup failed:', error);
  }
}
```

### Login Flow

```typescript
import { login } from '@/lib/auth';
import { useAuthStore } from '@/lib/auth';

async function handleLogin(credentials: LoginFormData) {
  try {
    // Login user
    const session = await login({
      email: credentials.email,
      password: credentials.password,
    });

    // Set user in global auth store
    useAuthStore.getState().setUser(session.user);
    
    // Navigate to dashboard
    router.navigate(`/dashboard/${session.user.role.toLowerCase()}`);
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

### Logout Flow

```typescript
import { logout } from '@/lib/auth';
import { useAuthStore } from '@/lib/auth';

async function handleLogout() {
  try {
    // Logout user (clears tokens and Apollo cache)
    await logout();
    
    // Clear user from store
    useAuthStore.getState().clearUser();
    
    // Navigate to login
    router.navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
```

## Authentication State Management

### Zustand Store

The app uses Zustand for global auth state:

```typescript
import { useAuthStore } from '@/lib/auth';

function MyComponent() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Role-Based Access

```typescript
import { useHasRole, useIsAdmin } from '@/lib/auth';

function AdminPanel() {
  const isAdmin = useIsAdmin();
  const hasRescuerRole = useHasRole('RESCUER');
  
  if (!isAdmin) {
    return <p>Access denied</p>;
  }
  
  return <div>Admin content</div>;
}
```

## Apollo Client Configuration

### Headers and Authentication

Apollo Client is configured to automatically include auth tokens:

```typescript
// Auth token is read from localStorage
const token = localStorage.getItem('auth-token');

// Automatically added to all GraphQL requests
headers: {
  authorization: `Bearer ${token}`
}
```

### Error Handling

Apollo Client handles GraphQL errors globally:

- `UNAUTHENTICATED` errors redirect to login
- Network errors are logged to console
- All errors are propagated to calling code

## Environment Variables

Required environment variables:

```env
# GraphQL API endpoint
VITE_GRAPHQL_URL=http://localhost:4000/graphql

# Optional: Auth API endpoint (for OAuth, if needed)
VITE_AUTH_URL=http://localhost:4000/api/auth
```

## Token Management

### Access Token Storage

- Access tokens are stored in `localStorage` as `auth-token`
- Tokens are automatically included in GraphQL requests via Apollo Link
- Tokens are cleared on logout

### Refresh Tokens

- Refresh tokens are handled server-side via HTTP-only cookies
- The `refreshToken` mutation can be called to get a new access token
- Not yet implemented in the frontend (TODO)

## Form Validation

### Signup Schema (Zod)

```typescript
const signupSchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(255),
    password: z
      .string()
      .min(8)
      .max(72)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
```

## Security Features

1. **Password Requirements:**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number

2. **Token Security:**
   - Access tokens stored in localStorage
   - Refresh tokens in HTTP-only cookies (server-side)
   - Tokens cleared on logout

3. **CORS:**
   - Apollo Client configured with `credentials: 'include'`
   - Sends cookies with requests

4. **Error Messages:**
   - Generic error messages to prevent user enumeration
   - Detailed errors logged to console (dev only)

## Testing

### Test User Registration

```typescript
// In your test file
import { register } from '@/lib/auth';

test('should register new user', async () => {
  const result = await register({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test1234',
  });
  
  expect(result.user).toBeDefined();
  expect(result.accessToken).toBeDefined();
  expect(result.user.email).toBe('test@example.com');
});
```

## Future Improvements

### TODO List

1. **Implement Refresh Token Logic:**
   - Auto-refresh tokens before expiration
   - Handle token refresh on 401 errors

2. **Add OAuth Support:**
   - Implement Google OAuth GraphQL mutation
   - Add OAuth button to login/signup forms

3. **Session Management:**
   - Add `currentUser` GraphQL query
   - Implement session persistence across page reloads

4. **Email Verification:**
   - Complete email verification flow
   - Add resend verification email

5. **Password Reset:**
   - Complete forgot password flow
   - Add reset password with token

6. **Multi-Factor Authentication:**
   - Add 2FA support
   - Implement TOTP or SMS verification

## Troubleshooting

### Common Issues

**Issue: "Login failed - no data returned"**
- Check that backend GraphQL server is running
- Verify `VITE_GRAPHQL_URL` is correct
- Check browser console for network errors

**Issue: "UNAUTHENTICATED" error**
- Token may have expired
- Try logging in again
- Check that token is present in localStorage

**Issue: CORS errors**
- Verify backend allows your frontend origin
- Check that `credentials: 'include'` is set in Apollo config

**Issue: GraphQL errors**
- Check backend logs for detailed error messages
- Verify mutation input matches schema
- Check that all required fields are provided

## Support

For questions or issues:
1. Check backend GraphQL schema: `libs/contracts/src/lib/graphql/auth/`
2. Review Apollo Client logs in browser console
3. Check backend server logs for errors
4. Review this documentation

## Related Documentation

- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [GraphQL Spec](https://graphql.org/learn/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
