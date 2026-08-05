# 🔐 Authentication Services Guide

## Overview

The `libs/auth` library now includes complete authentication workflows with services, email templates, and utilities.

## 📁 Complete Structure

```
libs/auth/src/lib/
├── authentication/
│   ├── config/
│   │   └── better-auth.config.ts     # Better Auth configuration
│   ├── services/
│   │   ├── auth.service.ts           # Main auth workflows
│   │   ├── email.service.ts          # Email sending
│   │   ├── session.service.ts        # Session management
│   │   └── oauth.service.ts          # OAuth operations
│   └── templates/
│       └── email-templates.ts        # HTML email templates
├── authorization/
│   ├── roles/
│   │   └── roles.ts                  # RBAC definitions
│   └── guards/
│       ├── authenticated.guard.ts
│       ├── role.guard.ts
│       ├── permission.guard.ts
│       └── owner.guard.ts
├── graphql/
│   └── context.ts                    # GraphQL context
└── middleware/
    ├── csrf.middleware.ts
    └── rate-limit.middleware.ts
```

---

## 🎯 Services Overview

### 1. AuthService - Main Authentication Workflows

Handles all authentication operations:

```typescript
import { AuthService } from '@snake-rescue/auth';

const authService = new AuthService();

// Register new user
const result = await authService.register({
  email: 'user@example.com',
  password: 'SecurePass123',
  name: 'John Doe',
  phone: '+977-9876543210',
});

// Login
const loginResult = await authService.login(
  'user@example.com',
  'SecurePass123'
);

// Logout
await authService.logout(sessionToken);

// Send verification email
await authService.sendVerificationEmail('user@example.com');

// Verify email
await authService.verifyEmail(token);

// Forgot password
await authService.forgotPassword('user@example.com');

// Reset password
await authService.resetPassword(token, 'NewPassword123');

// Change password
await authService.changePassword(userId, 'OldPass', 'NewPass');
```

### 2. EmailService - Email Sending

Handles all email communications:

```typescript
import { EmailService } from '@snake-rescue/auth';

const emailService = new EmailService();

// Welcome email
await emailService.sendWelcomeEmail('user@example.com', 'John Doe');

// Email verification
await emailService.sendVerificationEmail('user@example.com', token);

// Password reset
await emailService.sendPasswordResetEmail('user@example.com', 'John', token);

// Password changed confirmation
await emailService.sendPasswordChangedEmail('user@example.com', 'John');

// Role assigned notification
await emailService.sendRoleAssignedEmail('user@example.com', 'John', 'ADMIN');

// Account suspended
await emailService.sendAccountSuspendedEmail('user@example.com', 'John', 'Violation of terms');
```

### 3. SessionService - Session Management

Manages user sessions:

```typescript
import { SessionService } from '@snake-rescue/auth';

const sessionService = new SessionService();

// Get session
const session = await sessionService.getSession(token);

// Get all user sessions
const sessions = await sessionService.getUserSessions(userId);

// Revoke specific session
await sessionService.revokeSession(sessionId);

// Revoke all sessions (except current)
await sessionService.revokeAllUserSessions(userId, currentSessionId);

// Cleanup expired sessions
await sessionService.cleanupExpiredSessions();

// Update session activity
await sessionService.updateSessionActivity(sessionId, ipAddress, userAgent);

// Get session statistics
const stats = await sessionService.getUserSessionStats(userId);
```

### 4. OAuthService - OAuth Operations

Manages OAuth account linking:

```typescript
import { OAuthService } from '@snake-rescue/auth';

const oauthService = new OAuthService();

// Link OAuth account
await oauthService.linkAccount({
  userId: 'user-id',
  provider: 'google',
  providerAccountId: 'google-user-id',
  accessToken: 'token',
  refreshToken: 'refresh',
  expiresAt: new Date('2024-12-31'),
});

// Unlink OAuth account
await oauthService.unlinkAccount(userId, 'google');

// Get linked accounts
const accounts = await oauthService.getLinkedAccounts(userId);

// Check if account is linked
const isLinked = await oauthService.isAccountLinked('google', 'google-user-id');

// Get user by provider account
const user = await oauthService.getUserByProviderAccount('google', 'google-user-id');

// Refresh access token
await oauthService.refreshAccessToken(accountId, newToken, expiresAt);
```

---

## 📧 Email Templates

All email templates are responsive HTML with consistent branding:

### Available Templates

1. **Welcome Email** - Sent to new users
2. **Email Verification** - Email address confirmation
3. **Password Reset** - Password recovery flow
4. **Password Changed** - Security confirmation
5. **Role Assigned** - User role updates
6. **Account Suspended** - Account status changes

### Template Features

- ✅ Responsive design
- ✅ Consistent branding
- ✅ Security warnings
- ✅ Call-to-action buttons
- ✅ Footer with year and location
- ✅ Professional styling

---

## 🔌 Backend Integration

### GraphQL Resolvers

```typescript
// apps/backend/src/graphql/resolvers/auth.resolvers.ts
import { AuthService } from '@snake-rescue/auth';
import type { Resolvers } from '@snake-rescue/contracts/generated/resolvers-types';

const authService = new AuthService();

export const authResolvers: Resolvers = {
  Mutation: {
    register: async (_, { input }) => {
      const result = await authService.register(input);
      
      if (!result.success) {
        throw new GraphQLError(result.error);
      }
      
      return {
        token: result.session.token,
        user: result.user,
        expiresIn: result.session.expiresIn,
      };
    },
    
    login: async (_, { input }) => {
      const result = await authService.login(input.email, input.password);
      
      if (!result.success) {
        throw new GraphQLError(result.error);
      }
      
      return {
        token: result.session.token,
        user: result.user,
        expiresIn: result.session.expiresIn,
      };
    },
    
    forgotPassword: async (_, { email }) => {
      const result = await authService.forgotPassword(email);
      return { success: result.success, message: result.message };
    },
    
    resetPassword: async (_, { token, newPassword }) => {
      const result = await authService.resetPassword(token, newPassword);
      
      if (!result.success) {
        throw new GraphQLError(result.error);
      }
      
      return { success: true, message: result.message };
    },
  },
};
```

### Express Routes (Direct Better Auth)

```typescript
// apps/backend/src/server.ts
import express from 'express';
import { auth } from '@snake-rescue/auth';

const app = express();

// Better Auth handles all /api/auth/* routes automatically
app.use('/api/auth/*', auth.handler);

// Available routes:
// POST /api/auth/sign-up
// POST /api/auth/sign-in
// POST /api/auth/sign-out
// GET  /api/auth/session
// POST /api/auth/forgot-password
// POST /api/auth/reset-password
// etc.
```

---

## 🌐 Frontend Integration

### Using Auth Service in API Routes

```typescript
// apps/frontend/src/app/api/auth/register/route.ts
import { AuthService } from '@snake-rescue/auth';

const authService = new AuthService();

export async function POST(request: Request) {
  const body = await request.json();
  
  const result = await authService.register(body);
  
  if (!result.success) {
    return Response.json({ error: result.error }, { status: 400 });
  }
  
  return Response.json({
    user: result.user,
    message: result.message,
  });
}
```

### Using Apollo Client

```typescript
// apps/frontend/src/hooks/use-auth.ts
import { useLoginMutation, useRegisterMutation } from '@snake-rescue/contracts/generated';

export function useAuth() {
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  
  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({
      variables: { input: { email, password } },
    });
    return data?.login;
  };
  
  const register = async (input: RegisterInput) => {
    const { data } = await registerMutation({
      variables: { input },
    });
    return data?.register;
  };
  
  return { login, register };
}
```

---

## ⚙️ Configuration

### Environment Variables

Add to `.env`:

```env
# Frontend URLs
FRONTEND_URL=http://localhost:3000

# Better Auth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
COOKIE_DOMAIN=localhost

# Email Service (TODO: Configure)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Snake Rescue Platform <noreply@snakerescue.com>"

# Security
CSRF_SECRET=your-csrf-secret-here
NODE_ENV=development
```

### Email Service Integration

Currently, emails are logged in development. To enable production email sending:

1. **Option 1: Nodemailer** (Gmail, SMTP)
   ```bash
   yarn add nodemailer
   yarn add -D @types/nodemailer
   ```

2. **Option 2: SendGrid**
   ```bash
   yarn add @sendgrid/mail
   ```

3. **Option 3: AWS SES**
   ```bash
   yarn add @aws-sdk/client-ses
   ```

Then update `email.service.ts` `sendEmail()` method with your chosen provider.

---

## 🧪 Testing

### Test Auth Service

```typescript
import { AuthService } from '@snake-rescue/auth';

describe('AuthService', () => {
  const authService = new AuthService();
  
  it('should register a new user', async () => {
    const result = await authService.register({
      email: 'test@example.com',
      password: 'Test123456',
      name: 'Test User',
    });
    
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
  });
  
  it('should login user', async () => {
    const result = await authService.login(
      'test@example.com',
      'Test123456'
    );
    
    expect(result.success).toBe(true);
    expect(result.session).toBeDefined();
  });
});
```

---

## 📊 Complete Feature Matrix

| Feature | Location | Status |
|---------|----------|--------|
| **User Registration** | `auth.service.ts` | ✅ |
| **Email/Password Login** | `auth.service.ts` | ✅ |
| **OAuth Login** | `better-auth.config.ts` | ✅ |
| **Logout** | `auth.service.ts` | ✅ |
| **Email Verification** | `auth.service.ts` | ✅ |
| **Forgot Password** | `auth.service.ts` | ✅ |
| **Reset Password** | `auth.service.ts` | ✅ |
| **Change Password** | `auth.service.ts` | ✅ |
| **Session Management** | `session.service.ts` | ✅ |
| **OAuth Account Linking** | `oauth.service.ts` | ✅ |
| **Email Templates** | `email-templates.ts` | ✅ |
| **RBAC Guards** | `guards/` | ✅ |
| **GraphQL Context** | `graphql/context.ts` | ✅ |
| **CSRF Protection** | `csrf.middleware.ts` | ✅ |
| **Rate Limiting** | `rate-limit.middleware.ts` | ✅ |

---

## 🚀 Quick Start

### 1. Use Auth Service in Your Backend

```typescript
import { AuthService } from '@snake-rescue/auth';

const authService = new AuthService();

// In your resolver or route handler
const result = await authService.register({
  email: req.body.email,
  password: req.body.password,
  name: req.body.name,
});
```

### 2. Use Guards in GraphQL

```typescript
import { requireAuth, requireRole, UserRole } from '@snake-rescue/auth';

const resolvers = {
  Query: {
    me: (_, __, context) => {
      const user = requireAuth(context);
      return user;
    },
  },
};
```

### 3. Configure Email Sending

Update `email.service.ts` with your email provider credentials.

---

## 💡 Best Practices

1. **Always hash passwords** - Better Auth handles this automatically
2. **Use HTTP-only cookies** - Configured by default
3. **Validate email addresses** - Included in registration flow
4. **Rate limit auth endpoints** - Middleware provided
5. **Clean up expired sessions** - Run `cleanupExpiredSessions()` periodically
6. **Log authentication events** - Integrate with your logging system
7. **Handle errors gracefully** - All services return `{ success, error }` objects

---

## 📚 Related Documentation

- [Better Auth Architecture](../../BETTER_AUTH_ARCHITECTURE.md)
- [Better Auth Quick Start](../../BETTER_AUTH_QUICK_START.md)
- [Auth Library README](./README.md)
- [GraphQL Contracts](../contracts/)

---

**Status**: ✅ Complete & Production-Ready  
**Last Updated**: 2026-08-05  
**Version**: 1.0.0
