# 🔐 @snake-rescue/auth

Enterprise authentication and authorization library for the Snake Rescue Platform.

## Overview

This library provides:
- **Authentication** - Better Auth integration with session management, OAuth, email verification
- **Authorization** - RBAC system with roles, permissions, and guards
- **GraphQL Integration** - Context creation and authentication guards for GraphQL resolvers
- **Middleware** - CSRF protection and rate limiting

## Architecture

```
libs/auth/src/lib/
├── authentication/          # Better Auth integration
│   └── config/
│       └── better-auth.config.ts
├── authorization/           # RBAC & Permissions
│   ├── roles/
│   │   └── roles.ts        # Role & permission definitions
│   └── guards/
│       ├── authenticated.guard.ts
│       ├── role.guard.ts
│       ├── permission.guard.ts
│       └── owner.guard.ts
├── graphql/                 # GraphQL Integration
│   └── context.ts          # Auth context creation
└── middleware/              # Express Middleware
    ├── csrf.middleware.ts
    └── rate-limit.middleware.ts
```

## Installation

The library is already configured in the Nx monorepo. Dependencies are managed at the root level.

## Usage

### 1. Authentication (Better Auth)

```typescript
import { auth } from '@snake-rescue/auth';

// In your Express app
app.use('/api/auth/*', auth.handler);

// Get session
const session = await auth.api.getSession({ headers: req.headers });
```

### 2. GraphQL Context

```typescript
import { createAuthContext } from '@snake-rescue/auth';
import { ApolloServer } from '@apollo/server';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({
    ...await createAuthContext(req),
    prisma,
  }),
});
```

### 3. Authorization Guards

```typescript
import { requireAuth, requireRole, requirePermission, UserRole, Permission } from '@snake-rescue/auth';

// In your GraphQL resolvers
const resolvers = {
  Query: {
    me: (_, __, context) => {
      const user = requireAuth(context);
      return user;
    },
    
    adminDashboard: (_, __, context) => {
      requireRole(context, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
      // Admin logic
    },
    
    manageUsers: async (_, __, context) => {
      await requirePermission(context, Permission.MANAGE_USERS);
      // Management logic
    },
  },
};
```

### 4. Ownership Guards

```typescript
import { requireOwnerOrRole, UserRole } from '@snake-rescue/auth';

const resolvers = {
  Mutation: {
    updateProfile: (_, { userId, input }, context) => {
      // Only user themselves or admins can update
      requireOwnerOrRole(context, userId, [UserRole.ADMIN]);
      // Update logic
    },
  },
};
```

### 5. Middleware

```typescript
import { authRateLimiter, apiRateLimiter, doubleCsrfProtection } from '@snake-rescue/auth';

// Rate limiting
app.use('/api/auth/login', authRateLimiter);
app.use('/api', apiRateLimiter);

// CSRF protection
app.use(doubleCsrfProtection);
```

## Roles & Permissions

### Roles (from highest to lowest privilege)

1. **SUPER_ADMIN** - Full system access
2. **ADMIN** - Platform management
3. **DISTRICT_COORDINATOR** - Regional coordination
4. **VERIFIED_RESCUER** - Verified rescue operations
5. **CONTENT_EDITOR** - Content management
6. **RESEARCHER** - Data access
7. **VOLUNTEER** - Basic rescue access
8. **CITIZEN** - Public user

### Permissions

- **Users**: `MANAGE_USERS`, `VIEW_USERS`
- **Rescues**: `MANAGE_RESCUES`, `ASSIGN_RESCUES`, `VIEW_RESCUES`, `CREATE_RESCUE`
- **Volunteers**: `MANAGE_VOLUNTEERS`, `APPROVE_VOLUNTEERS`, `VIEW_VOLUNTEERS`
- **Content**: `MANAGE_CONTENT`, `PUBLISH_CONTENT`, `UPLOAD_MEDIA`
- **Analytics**: `VIEW_ANALYTICS`, `EXPORT_DATA`
- **Payments**: `MANAGE_PAYMENTS`, `VIEW_DONATIONS`
- **System**: `MANAGE_SETTINGS`, `VIEW_LOGS`

## Environment Variables

Required environment variables:

```env
# Better Auth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
COOKIE_DOMAIN=.your-domain.com

# Security
CSRF_SECRET=your-csrf-secret-here

# Node Environment
NODE_ENV=development|production
```

## Database Tables

The auth system uses these Prisma tables:

- `Session` - User sessions (Better Auth)
- `Account` - OAuth accounts (Better Auth)
- `Verification` - Email/phone verification (Better Auth)
- `Role` - Role definitions (RBAC)
- `Permission` - Permission definitions (RBAC)
- `RolePermission` - Role-permission mapping (RBAC)
- `UserRoleAssignment` - User-role assignments (RBAC)

## Security Features

✅ HTTP-only cookies (no localStorage)  
✅ CSRF protection  
✅ Rate limiting  
✅ Session management  
✅ OAuth integration  
✅ Email verification  
✅ Password reset  
✅ Role-based access control  
✅ Permission-based authorization  

## Type Safety

All functions are fully typed with TypeScript. The `GraphQLContext` interface ensures type-safe access to authentication state in resolvers.

## Error Handling

Guards throw `GraphQLError` with appropriate error codes:
- `UNAUTHENTICATED` - User not logged in
- `FORBIDDEN` - Insufficient permissions

## Next Steps

1. Set up environment variables
2. Configure OAuth providers in Better Auth config
3. Implement GraphQL resolvers using the guards
4. Set up middleware in Express app
5. Test authentication flow

## Related Documentation

- [Better Auth Architecture](../../BETTER_AUTH_ARCHITECTURE.md)
- [Prisma Schema](../database/prisma/schema.prisma)
- [GraphQL Contracts](../contracts/)

---

**Version**: 1.0.0  
**Status**: ✅ Ready for Implementation  
**Last Updated**: 2026-08-05
