# Authentication Library

This directory contains all authentication-related functionality for the frontend application.

## Files

- **auth-client.ts** - Core authentication functions using GraphQL
- **auth-store.ts** - Zustand store for global auth state management
- **index.ts** - Public exports

## Quick Start

### Register a New User

```typescript
import { register } from '@/lib/auth';

const authPayload = await register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123',
});

console.log('User created:', authPayload.user);
console.log('Access token:', authPayload.accessToken);
```

### Login

```typescript
import { login } from '@/lib/auth';

const session = await login({
  email: 'john@example.com',
  password: 'SecurePass123',
});

console.log('Logged in as:', session.user.name);
```

### Logout

```typescript
import { logout } from '@/lib/auth';

await logout();
// Token cleared from localStorage
// Apollo cache cleared
```

### Use Auth State in Components

```typescript
import { useAuthStore } from '@/lib/auth';

function MyComponent() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Check User Role

```typescript
import { useHasRole, useIsAdmin } from '@/lib/auth';

function ProtectedComponent() {
  const isAdmin = useIsAdmin();
  const isRescuer = useHasRole('RESCUER');
  const hasMultipleRoles = useHasRole(['ADMIN', 'RESCUER']);
  
  if (!isAdmin) {
    return <div>Access denied</div>;
  }
  
  return <div>Admin content</div>;
}
```

## API Reference

### `register(data: RegisterData): Promise<AuthPayload>`

Register a new user account.

**Parameters:**
```typescript
{
  name: string;        // User's full name
  email: string;       // Valid email address
  password: string;    // Min 8 chars, must have uppercase, lowercase, and number
  phone?: string;      // Optional phone number
  language?: string;   // Optional language code (default: 'en')
  timezone?: string;   // Optional timezone (default: browser timezone)
}
```

**Returns:**
```typescript
{
  accessToken: string;   // JWT access token
  refreshToken: string;  // JWT refresh token
  expiresIn: number;     // Token expiration in seconds
  user: User;           // User object
}
```

### `login(credentials: LoginCredentials): Promise<AuthSession>`

Authenticate a user.

**Parameters:**
```typescript
{
  email: string;
  password: string;
}
```

**Returns:**
```typescript
{
  user: User;
  accessToken: string;
}
```

### `logout(): Promise<void>`

End user session and clear tokens.

### `requestPasswordReset(email: string): Promise<{ message: string; expiresAt: string }>`

Request a password reset email.

### `resetPassword(token: string, newPassword: string): Promise<boolean>`

Reset password using reset token.

### `verifyEmail(token: string): Promise<{ success: boolean; message: string; user?: User }>`

Verify email address using verification token.

## Types

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: string;              // 'CITIZEN', 'RESCUER', 'VOLUNTEER', 'ADMIN', etc.
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### AuthPayload

```typescript
interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}
```

### AuthSession

```typescript
interface AuthSession {
  user: User;
  accessToken: string;
}
```

## Auth Store Actions

### `setUser(user: User | null)`

Set the current user.

### `setLoading(isLoading: boolean)`

Set loading state.

### `setError(error: string | null)`

Set error message.

### `clearError()`

Clear error message.

### `clearUser()`

Clear user and set isAuthenticated to false.

### `checkAuth(): Promise<void>`

Check authentication status (currently not implemented - returns null).

### `logout(): Promise<void>`

Logout and clear user state.

## Token Management

- Access tokens are stored in `localStorage` as `auth-token`
- Tokens are automatically included in GraphQL requests via Apollo Link
- Tokens are cleared on logout
- Refresh tokens are handled server-side via HTTP-only cookies

## Error Handling

All auth functions throw errors that should be caught:

```typescript
try {
  await login({ email, password });
} catch (error) {
  if (error instanceof Error) {
    console.error('Login failed:', error.message);
  }
}
```

## Security Considerations

1. **Password Requirements:**
   - Minimum 8 characters
   - Must contain uppercase letter
   - Must contain lowercase letter
   - Must contain number

2. **Token Storage:**
   - Access tokens in localStorage (XSS vulnerable but acceptable for SPAs)
   - Refresh tokens in HTTP-only cookies (more secure)

3. **HTTPS Only:**
   - Always use HTTPS in production
   - Never transmit credentials over HTTP

## Integration with GraphQL

All auth functions use GraphQL mutations from `@/lib/graphql/mutations`:

- `REGISTER_MUTATION`
- `LOGIN_MUTATION`
- `LOGOUT_MUTATION`
- `FORGOT_PASSWORD_MUTATION`
- `RESET_PASSWORD_MUTATION`
- `VERIFY_EMAIL_MUTATION`

See `apps/frontend/src/lib/graphql/mutations/auth.mutations.ts` for details.

## Related Documentation

- [GraphQL Auth Integration](../../../GRAPHQL_AUTH_INTEGRATION.md)
- [Signup Integration Summary](../../../SIGNUP_GRAPHQL_INTEGRATION.md)
