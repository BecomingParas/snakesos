# 🎯 Quick Reference Card

## 🚀 Start Development

```bash
# Start everything
yarn dev

# Start frontend only
yarn dev:frontend

# Start backend only (after implementing)
yarn dev:backend
```

## 🗄️ Database Commands

```bash
# Generate Prisma Client
yarn db:generate

# Run migrations
yarn db:migrate

# Open database GUI
yarn db:studio

# Seed database
yarn db:seed
```

## 🎨 GraphQL Commands

```bash
# Generate TypeScript types
yarn graphql:codegen

# Watch mode
yarn graphql:codegen:watch
```

## 📦 Key Imports

### Authentication Services

```typescript
import {
  AuthService,
  EmailService,
  SessionService,
  OAuthService,
} from '@snake-rescue/auth';
```

### Authorization Guards

```typescript
import {
  requireAuth,
  requireRole,
  requirePermission,
  requireOwnerOrRole,
  UserRole,
  Permission,
} from '@snake-rescue/auth';
```

### GraphQL Context

```typescript
import { createAuthContext } from '@snake-rescue/auth';
```

### Database

```typescript
import { prisma } from '@snake-rescue/database';
```

### GraphQL Schema

```typescript
import { graphqlSchema } from '@snake-rescue/contracts';
```

## 🔐 Auth Service Usage

```typescript
const authService = new AuthService();

// Register
await authService.register({
  email: 'user@example.com',
  password: 'Password123',
  name: 'John Doe',
});

// Login
await authService.login('user@example.com', 'Password123');

// Forgot Password
await authService.forgotPassword('user@example.com');

// Reset Password
await authService.resetPassword(token, 'NewPassword123');
```

## 🛡️ Using Guards

```typescript
// In GraphQL Resolver
Query: {
  me: (_, __, context) => {
    const user = requireAuth(context);
    return user;
  },
  
  adminDashboard: (_, __, context) => {
    requireRole(context, [UserRole.ADMIN]);
    // Admin logic
  },
  
  manageUsers: async (_, __, context) => {
    await requirePermission(context, Permission.MANAGE_USERS);
    // Management logic
  },
}
```

## 🌐 Environment Variables

```env
DATABASE_URL="postgresql://devuser:devpassword@localhost:5432/snake_rescue"
FRONTEND_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-id"
GOOGLE_CLIENT_SECRET="your-secret"
COOKIE_DOMAIN="localhost"
CSRF_SECRET="your-secret"
NODE_ENV="development"
```

## 📚 Documentation Files

1. `PROJECT_STATUS.md` - Overall progress (75% complete)
2. `WHATS_NEXT.md` - Development roadmap
3. `SESSION_SUMMARY.md` - Today's accomplishments
4. `BETTER_AUTH_ARCHITECTURE.md` - Auth architecture
5. `BETTER_AUTH_QUICK_START.md` - Implementation guide
6. `AUTH_IMPLEMENTATION_COMPLETE.md` - Auth summary
7. `libs/auth/README.md` - Auth library docs
8. `libs/auth/AUTH_SERVICES_GUIDE.md` - Services API reference
9. `GRAPHQL_CONTRACT_COMPLETE.md` - GraphQL docs
10. `COMMANDS.md` - All commands

## 🎯 Current Status

| Component | Status |
|-----------|--------|
| Frontend UI | ✅ 100% |
| Database | ✅ 100% |
| GraphQL Contracts | ✅ 100% |
| Authentication | ✅ 100% |
| Backend API | ⏳ 0% |
| **Overall** | **75%** |

## 🚧 Next Steps

1. Create backend app
2. Implement Apollo Server
3. Create auth resolvers
4. Test authentication flow
5. Create frontend login page

## 💡 Quick Tips

- All auth services return `{ success, error, ...data }`
- Guards throw `GraphQLError` on failure
- Email templates are in `libs/auth/src/lib/authentication/templates/`
- Services are in `libs/auth/src/lib/authentication/services/`
- Database models have soft delete (`deletedAt`)
- Sessions expire after 7 days
- Rate limiting: Auth 5 req/15min, API 100 req/min

## 📞 Where to Find Things

| What | Where |
|------|-------|
| Auth Services | `libs/auth/src/lib/authentication/services/` |
| Email Templates | `libs/auth/src/lib/authentication/templates/` |
| Guards | `libs/auth/src/lib/authorization/guards/` |
| Roles & Permissions | `libs/auth/src/lib/authorization/roles/` |
| GraphQL Schema | `libs/contracts/src/lib/graphql/` |
| Database Schema | `libs/database/prisma/schema.prisma` |
| Frontend Components | `libs/frontend/ui/src/lib/` |
| Feature Components | `libs/frontend/features/src/lib/` |

## 🔗 Useful Links

- Better Auth: https://www.better-auth.com/docs
- Apollo Server: https://www.apollographql.com/docs/apollo-server/
- Prisma: https://www.prisma.io/docs
- Next.js 15: https://nextjs.org/docs
- GraphQL Codegen: https://the-guild.dev/graphql/codegen

---

**Date**: 2026-08-05  
**Version**: 1.0.0  
**Status**: 75% Complete
