---

## 🎉 IMPLEMENTATION STATUS: ✅ COMPLETE!

**Date Implemented**: 2026-08-05

### ✅ What's Been Completed

1. **✅ Better Auth Installed** - v1.6.26
2. **✅ Database Schema Updated** - Session, Account, Verification, Role, Permission tables added
3. **✅ Migration Run** - `20260805082819_better_auth` applied successfully
4. **✅ Auth Library Structure Created**:
   - `libs/auth/src/lib/authentication/` - Better Auth config
   - `libs/auth/src/lib/authorization/` - RBAC system (roles, permissions, guards)
   - `libs/auth/src/lib/graphql/` - Context creation
   - `libs/auth/src/lib/middleware/` - CSRF & rate limiting
5. **✅ All Guards Implemented**:
   - `requireAuth()` - Authentication check
   - `requireRole()` - Role-based check
   - `requirePermission()` - Permission-based check (with database lookup)
   - `requireOwnerOrRole()` - Resource ownership check
6. **✅ Dependencies Installed**:
   - `better-auth@1.6.26`
   - `csrf-csrf@4.0.3`
   - `express-rate-limit@8.6.0`
7. **✅ Documentation Created** - Complete README in `libs/auth/README.md`

### 📦 Library Structure (Actual)

```
libs/auth/
├── src/
│   ├── lib/
│   │   ├── authentication/
│   │   │   ├── config/
│   │   │   │   ├── better-auth.config.ts  ✅
│   │   │   │   └── index.ts               ✅
│   │   │   └── index.ts                   ✅
│   │   ├── authorization/
│   │   │   ├── roles/
│   │   │   │   ├── roles.ts               ✅ (8 roles, 15 permissions, mapping)
│   │   │   │   └── index.ts               ✅
│   │   │   ├── guards/
│   │   │   │   ├── authenticated.guard.ts ✅
│   │   │   │   ├── role.guard.ts          ✅
│   │   │   │   ├── permission.guard.ts    ✅
│   │   │   │   ├── owner.guard.ts         ✅
│   │   │   │   └── index.ts               ✅
│   │   │   └── index.ts                   ✅
│   │   ├── graphql/
│   │   │   ├── context.ts                 ✅
│   │   │   └── index.ts                   ✅
│   │   └── middleware/
│   │       ├── csrf.middleware.ts         ✅
│   │       ├── rate-limit.middleware.ts   ✅
│   │       └── index.ts                   ✅
│   └── index.ts                           ✅
├── package.json                           ✅ (updated with dependencies)
└── README.md                              ✅ (comprehensive documentation)
```

### 🗄️ Database Tables (Deployed)

All tables successfully created in PostgreSQL:

- ✅ `sessions` - Better Auth sessions
- ✅ `accounts` - OAuth accounts
- ✅ `verifications` - Email/phone verification tokens
- ✅ `roles` - Role definitions
- ✅ `permissions` - Permission definitions
- ✅ `role_permissions` - Role-permission mappings
- ✅ `user_role_assignments` - User-role assignments

---

# 🔐 Better Auth Architecture - Snake Rescue Platform

## Why Better Auth Over Passport + JWT

### ✅ Better Auth Advantages
- **🍪 Secure by default** - HTTP-only cookies, no localStorage
- **🔄 Built-in session management** - Automatic refresh tokens
- **🌐 OAuth ready** - Google, GitHub, etc. out of the box
- **📧 Email verification** - Built-in verification flows
- **🔒 Modern security** - CSRF protection, secure cookies
- **📱 Framework agnostic** - Works with Next.js, Express, etc.
- **🎯 Type-safe** - Full TypeScript support
- **🚀 Less boilerplate** - Handles 80% of auth logic

### ❌ Why Not Passport + JWT
- Manual JWT storage (security risk with localStorage)
- Manual refresh token logic
- More boilerplate code
- Cookie management not built-in
- OAuth requires more setup
- No built-in email verification

---

## 🏗️ Enterprise Auth Architecture

### Separation of Concerns

```
libs/auth/                          # Authentication & Authorization
├── authentication/                 # Better Auth integration
│   ├── config/
│   │   ├── better-auth.config.ts  # Better Auth setup
│   │   ├── providers.ts           # OAuth providers
│   │   └── cookies.ts             # Cookie configuration
│   ├── services/
│   │   ├── auth.service.ts        # Auth operations
│   │   ├── session.service.ts     # Session management
│   │   └── verification.service.ts # Email verification
│   └── index.ts
│
├── authorization/                  # RBAC & Permissions
│   ├── roles/
│   │   ├── roles.ts               # Role definitions
│   │   ├── permissions.ts         # Permission definitions
│   │   └── policies.ts            # Access policies
│   ├── guards/
│   │   ├── authenticated.guard.ts # Auth check
│   │   ├── role.guard.ts          # Role check
│   │   ├── permission.guard.ts    # Permission check
│   │   └── owner.guard.ts         # Resource ownership
│   └── index.ts
│
├── graphql/                        # GraphQL Integration
│   ├── context.ts                 # Auth context
│   ├── directives/
│   │   ├── auth.directive.ts      # @auth directive
│   │   └── permission.directive.ts # @permission directive
│   ├── plugin.ts                  # Apollo plugin
│   └── index.ts
│
├── middleware/                     # Express Middleware
│   ├── auth.middleware.ts         # Session check
│   ├── csrf.middleware.ts         # CSRF protection
│   ├── rate-limit.middleware.ts   # Rate limiting
│   └── index.ts
│
└── index.ts                        # Public API
```

---

## 🗄️ Database Schema Updates

### Better Auth Tables (Add to Prisma Schema)

```prisma
// ===================================================================
// BETTER AUTH TABLES
// ===================================================================

model Session {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([token])
  @@map("sessions")
}

model Account {
  id                String   @id @default(uuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  provider          String   // "google", "github", etc.
  providerAccountId String
  accessToken       String?  @db.Text
  refreshToken      String?  @db.Text
  expiresAt         DateTime?
  tokenType         String?
  scope             String?
  idToken           String?  @db.Text
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([provider, providerAccountId])
  @@index([userId])
  @@map("accounts")
}

model Verification {
  id         String   @id @default(uuid())
  identifier String   // email or phone
  token      String   @unique
  type       String   // "email", "password-reset"
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  
  @@index([token])
  @@index([identifier])
  @@map("verifications")
}

// Update User model
model User {
  // ... existing fields ...
  
  // Better Auth relations
  sessions     Session[]
  accounts     Account[]
  
  // ... rest of existing relations ...
}

// ===================================================================
// RBAC TABLES (Authorization)
// ===================================================================

model Role {
  id          String   @id @default(uuid())
  name        String   @unique // "ADMIN", "VOLUNTEER", etc.
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  permissions RolePermission[]
  userRoles   UserRole[]
  
  @@map("roles")
}

model Permission {
  id          String   @id @default(uuid())
  name        String   @unique // "MANAGE_USERS", "ASSIGN_RESCUES", etc.
  description String?
  resource    String   // "users", "rescues", "volunteers"
  action      String   // "create", "read", "update", "delete"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  roles RolePermission[]
  
  @@unique([resource, action])
  @@map("permissions")
}

model RolePermission {
  roleId       String
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permissionId String
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  
  @@id([roleId, permissionId])
  @@map("role_permissions")
}

model UserRole {
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  roleId    String
  role      Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  grantedAt DateTime @default(now())
  grantedBy String?
  
  @@id([userId, roleId])
  @@map("user_roles")
}
```

---

## 🔧 Implementation Steps

### Phase 1: Install Better Auth
```bash
yarn add better-auth
yarn add -D @better-auth/cli
```

### Phase 2: Create Auth Library Structure
```bash
# Create lib structure
nx generate @nx/js:library auth --directory=libs/auth

# Create subdirectories
mkdir -p libs/auth/src/lib/authentication/config
mkdir -p libs/auth/src/lib/authentication/services
mkdir -p libs/auth/src/lib/authorization/roles
mkdir -p libs/auth/src/lib/authorization/guards
mkdir -p libs/auth/src/lib/graphql
mkdir -p libs/auth/src/lib/middleware
```

### Phase 3: Configure Better Auth
```typescript
// libs/auth/src/lib/authentication/config/better-auth.config.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@snake-rescue/database';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  
  advanced: {
    cookiePrefix: 'snake_rescue',
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.COOKIE_DOMAIN,
    },
  },
});
```

### Phase 4: GraphQL Integration
```typescript
// libs/auth/src/lib/graphql/context.ts
import { auth } from '../authentication/config/better-auth.config';

export async function createAuthContext(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  
  return {
    session,
    user: session?.user,
    isAuthenticated: !!session,
  };
}

// apps/backend/src/server.ts
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createAuthContext } from '@snake-rescue/auth';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => ({
    ...await createAuthContext(req),
    prisma,
  }),
}));
```

### Phase 5: Role & Permission System
```typescript
// libs/auth/src/lib/authorization/roles/roles.ts
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  DISTRICT_COORDINATOR = 'DISTRICT_COORDINATOR',
  VERIFIED_RESCUER = 'VERIFIED_RESCUER',
  VOLUNTEER = 'VOLUNTEER',
  RESEARCHER = 'RESEARCHER',
  CONTENT_EDITOR = 'CONTENT_EDITOR',
  CITIZEN = 'CITIZEN',
}

export enum Permission {
  // Users
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_USERS = 'VIEW_USERS',
  
  // Rescues
  MANAGE_RESCUES = 'MANAGE_RESCUES',
  ASSIGN_RESCUES = 'ASSIGN_RESCUES',
  VIEW_RESCUES = 'VIEW_RESCUES',
  CREATE_RESCUE = 'CREATE_RESCUE',
  
  // Volunteers
  MANAGE_VOLUNTEERS = 'MANAGE_VOLUNTEERS',
  APPROVE_VOLUNTEERS = 'APPROVE_VOLUNTEERS',
  VIEW_VOLUNTEERS = 'VIEW_VOLUNTEERS',
  
  // Content
  MANAGE_CONTENT = 'MANAGE_CONTENT',
  PUBLISH_CONTENT = 'PUBLISH_CONTENT',
  UPLOAD_MEDIA = 'UPLOAD_MEDIA',
  
  // Analytics
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  EXPORT_DATA = 'EXPORT_DATA',
  
  // Payments
  MANAGE_PAYMENTS = 'MANAGE_PAYMENTS',
  VIEW_DONATIONS = 'VIEW_DONATIONS',
  
  // System
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  VIEW_LOGS = 'VIEW_LOGS',
}

// Role-Permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  
  [UserRole.ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.MANAGE_RESCUES,
    Permission.ASSIGN_RESCUES,
    Permission.MANAGE_VOLUNTEERS,
    Permission.APPROVE_VOLUNTEERS,
    Permission.MANAGE_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_PAYMENTS,
  ],
  
  [UserRole.DISTRICT_COORDINATOR]: [
    Permission.VIEW_USERS,
    Permission.MANAGE_RESCUES,
    Permission.ASSIGN_RESCUES,
    Permission.VIEW_RESCUES,
    Permission.APPROVE_VOLUNTEERS,
    Permission.VIEW_VOLUNTEERS,
    Permission.VIEW_ANALYTICS,
  ],
  
  [UserRole.VERIFIED_RESCUER]: [
    Permission.VIEW_RESCUES,
    Permission.CREATE_RESCUE,
    Permission.VIEW_VOLUNTEERS,
  ],
  
  [UserRole.VOLUNTEER]: [
    Permission.VIEW_RESCUES,
    Permission.CREATE_RESCUE,
  ],
  
  [UserRole.CONTENT_EDITOR]: [
    Permission.MANAGE_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.UPLOAD_MEDIA,
  ],
  
  [UserRole.RESEARCHER]: [
    Permission.VIEW_RESCUES,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
  ],
  
  [UserRole.CITIZEN]: [
    Permission.CREATE_RESCUE,
  ],
};
```

### Phase 6: Auth Guards
```typescript
// libs/auth/src/lib/authorization/guards/authenticated.guard.ts
import { GraphQLError } from 'graphql';

export function requireAuth(context: GraphQLContext) {
  if (!context.isAuthenticated || !context.user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.user;
}

// libs/auth/src/lib/authorization/guards/role.guard.ts
export function requireRole(
  context: GraphQLContext,
  allowedRoles: UserRole[]
) {
  const user = requireAuth(context);
  
  if (!allowedRoles.includes(user.role as UserRole)) {
    throw new GraphQLError('Insufficient permissions', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
  
  return user;
}

// libs/auth/src/lib/authorization/guards/permission.guard.ts
export async function requirePermission(
  context: GraphQLContext,
  permission: Permission
) {
  const user = requireAuth(context);
  
  const hasPermission = await context.prisma.userRole.findFirst({
    where: {
      userId: user.id,
      role: {
        permissions: {
          some: {
            permission: {
              name: permission,
            },
          },
        },
      },
    },
  });
  
  if (!hasPermission) {
    throw new GraphQLError('Insufficient permissions', {
      extensions: { code: 'FORBIDDEN', permission },
    });
  }
  
  return user;
}
```

---

## 🎯 GraphQL Integration

### Update Auth Mutations
```typescript
// apps/backend/src/graphql/resolvers/auth.resolvers.ts
import { auth } from '@snake-rescue/auth';
import type { Resolvers } from '@snake-rescue/contracts';

export const authResolvers: Resolvers = {
  Mutation: {
    register: async (_, { input }, context) => {
      const { user, session } = await auth.api.signUpEmail({
        body: {
          email: input.email,
          password: input.password,
          name: input.name,
        },
      });
      
      // Set cookie
      context.res.setHeader('Set-Cookie', session.cookie);
      
      return {
        token: session.token,
        refreshToken: session.refreshToken,
        user,
        expiresIn: session.expiresIn,
      };
    },
    
    login: async (_, { input }, context) => {
      const { user, session } = await auth.api.signInEmail({
        body: {
          email: input.email,
          password: input.password,
        },
      });
      
      context.res.setHeader('Set-Cookie', session.cookie);
      
      return {
        token: session.token,
        refreshToken: session.refreshToken,
        user,
        expiresIn: session.expiresIn,
      };
    },
    
    logout: async (_, __, context) => {
      await auth.api.signOut({
        headers: context.req.headers,
      });
      
      return { success: true, message: 'Logged out successfully' };
    },
  },
};
```

---

## 🌐 Frontend Integration

### Apollo Client Setup
```typescript
// apps/frontend/src/lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: 'include', // ✅ Important: Send cookies
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
```

### Auth Hooks
```typescript
// apps/frontend/src/hooks/use-auth.ts
import { useLoginMutation, useLogoutMutation, useMeQuery } from '@snake-rescue/contracts/generated';

export function useAuth() {
  const { data, loading, refetch } = useMeQuery();
  const [login] = useLoginMutation();
  const [logout] = useLogoutMutation();
  
  return {
    user: data?.me,
    isAuthenticated: !!data?.me,
    loading,
    login,
    logout,
    refetch,
  };
}
```

---

## 🔒 Security Features

### CSRF Protection
```typescript
// libs/auth/src/lib/middleware/csrf.middleware.ts
import { doubleCsrf } from 'csrf-csrf';

export const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET!,
  cookieName: 'snake_rescue_csrf',
  cookieOptions: {
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
});
```

### Rate Limiting
```typescript
// libs/auth/src/lib/middleware/rate-limit.middleware.ts
import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
```

---

## 📊 Benefits Summary

| Feature | Passport + JWT | Better Auth |
|---------|----------------|-------------|
| **Setup Time** | 2-3 days | 1 day |
| **Security** | Manual | Built-in |
| **OAuth** | Complex | Simple |
| **Sessions** | Manual | Automatic |
| **Cookies** | Manual | Built-in |
| **TypeScript** | Partial | Full |
| **Maintenance** | High | Low |

---

## 🚀 Next Steps

1. **Install Better Auth**
   ```bash
   yarn add better-auth
   ```

2. **Update Prisma Schema**
   - Add Session, Account, Verification, Role, Permission tables

3. **Run Migration**
   ```bash
   yarn db:migrate
   ```

4. **Create Auth Library**
   - Set up libs/auth structure
   - Configure Better Auth

5. **Integrate with GraphQL**
   - Update resolvers
   - Add guards

6. **Update Frontend**
   - Configure Apollo Client with credentials
   - Create auth hooks

---

**Status**: 📋 Architecture Documented  
**Recommendation**: ✅ Use Better Auth  
**Next**: Install & implement Better Auth integration
