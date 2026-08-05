# 🚀 Better Auth Quick Start Guide

## ✅ Current Status

**Better Auth is fully implemented and ready to use!**

- ✅ Library structure created in `libs/auth/`
- ✅ Database tables migrated
- ✅ All guards and middleware implemented
- ✅ Dependencies installed

---

## 🎯 Next Steps: Backend Integration

### Step 1: Create Apollo Server with Auth Context

Create `apps/backend/src/server.ts`:

```typescript
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { auth, createAuthContext, apiRateLimiter } from '@snake-rescue/auth';
import { prisma } from '@snake-rescue/database';
import { graphqlSchema } from '@snake-rescue/contracts';
import { resolvers } from './graphql/resolvers';

const app = express();

// Better Auth routes
app.use('/api/auth/*', auth.handler);

// Middleware
app.use(express.json());
app.use(apiRateLimiter);

// Apollo Server
const server = new ApolloServer({
  typeDefs: graphqlSchema,
  resolvers,
});

await server.start();

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req, res }) => ({
      ...await createAuthContext(req),
      prisma,
      req,
      res,
    }),
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  console.log(`🔐 Auth endpoints at http://localhost:${PORT}/api/auth/*`);
});
```

### Step 2: Implement GraphQL Resolvers with Guards

Create `apps/backend/src/graphql/resolvers/auth.resolvers.ts`:

```typescript
import { auth, requireAuth, requireRole, UserRole } from '@snake-rescue/auth';
import type { Resolvers } from '@snake-rescue/contracts/generated/resolvers-types';

export const authResolvers: Resolvers = {
  Query: {
    me: (_, __, context) => {
      const user = requireAuth(context);
      return context.prisma.user.findUnique({
        where: { id: user.id },
      });
    },
    
    users: async (_, __, context) => {
      requireRole(context, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
      return context.prisma.user.findMany();
    },
  },
  
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

### Step 3: Protect Rescue Resolvers

Create `apps/backend/src/graphql/resolvers/rescue.resolvers.ts`:

```typescript
import { requireAuth, requireRole, requirePermission, UserRole, Permission } from '@snake-rescue/auth';
import type { Resolvers } from '@snake-rescue/contracts/generated/resolvers-types';

export const rescueResolvers: Resolvers = {
  Query: {
    rescueRequests: async (_, { input }, context) => {
      requireAuth(context);
      
      return context.prisma.rescueRequest.findMany({
        where: input?.status ? { status: input.status } : {},
        orderBy: { createdAt: 'desc' },
      });
    },
    
    rescueRequestById: async (_, { id }, context) => {
      requireAuth(context);
      
      return context.prisma.rescueRequest.findUnique({
        where: { id },
      });
    },
  },
  
  Mutation: {
    createRescueRequest: async (_, { input }, context) => {
      const user = requireAuth(context);
      
      return context.prisma.rescueRequest.create({
        data: {
          ...input,
          userId: user.id,
        },
      });
    },
    
    assignRescue: async (_, { rescueId, volunteerId }, context) => {
      await requirePermission(context, Permission.ASSIGN_RESCUES);
      
      return context.prisma.rescueRequest.update({
        where: { id: rescueId },
        data: {
          assignedVolunteerId: volunteerId,
          status: 'ASSIGNED',
        },
      });
    },
    
    deleteRescueRequest: async (_, { id }, context) => {
      requireRole(context, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
      
      return context.prisma.rescueRequest.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    },
  },
};
```

---

## 🌐 Frontend Integration

### Step 1: Configure Apollo Client

Create `apps/frontend/src/lib/apollo-client.ts`:

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  credentials: 'include', // ✅ Important: Send cookies with every request
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

### Step 2: Create Auth Provider

Create `apps/frontend/src/providers/auth-provider.tsx`:

```typescript
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useMeQuery, useLoginMutation, useLogoutMutation } from '@snake-rescue/contracts/generated/graphql-operations';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, loading, refetch } = useMeQuery();
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  
  const login = async (email: string, password: string) => {
    await loginMutation({
      variables: { input: { email, password } },
    });
    refetch();
  };
  
  const logout = async () => {
    await logoutMutation();
    refetch();
  };
  
  return (
    <AuthContext.Provider
      value={{
        user: data?.me,
        isAuthenticated: !!data?.me,
        loading,
        login,
        logout,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Step 3: Use Auth in Components

```typescript
'use client';

import { useAuth } from '@/providers/auth-provider';

export function LoginForm() {
  const { login, loading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await login(
      formData.get('email') as string,
      formData.get('password') as string
    );
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Step 4: Protect Routes

```typescript
'use client';

import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;
  
  return <>{children}</>;
}
```

---

## 🔐 Environment Variables

Add to `.env`:

```env
# Backend
DATABASE_URL="postgresql://devuser:devpassword@localhost:5432/snake_rescue"
PORT=4000

# Better Auth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
COOKIE_DOMAIN=localhost
CSRF_SECRET=your-csrf-secret-here-change-in-production

# Frontend
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

---

## 🧪 Testing

### Test Authentication Flow

```bash
# 1. Start backend
yarn dev:backend

# 2. Test endpoints
curl -X POST http://localhost:4000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# 3. Test GraphQL with authentication
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Cookie: snake_rescue_session=..." \
  -d '{"query":"{ me { id email name } }"}'
```

---

## 📊 Implementation Checklist

### Backend
- [ ] Create `apps/backend/src/server.ts`
- [ ] Implement auth resolvers
- [ ] Implement rescue resolvers with guards
- [ ] Set up environment variables
- [ ] Test Better Auth endpoints
- [ ] Test GraphQL with authentication

### Frontend
- [ ] Configure Apollo Client with `credentials: 'include'`
- [ ] Create AuthProvider
- [ ] Create login/register forms
- [ ] Implement protected routes
- [ ] Test authentication flow

### Database
- [x] Run migrations (DONE)
- [ ] Seed initial roles and permissions
- [ ] Test role assignments

---

## 🎯 Common Patterns

### Pattern 1: Public + Auth Optional
```typescript
Query: {
  blogPosts: async (_, __, context) => {
    // No auth required, but show extra data if authenticated
    const where = context.isAuthenticated 
      ? {} 
      : { status: 'PUBLISHED' };
      
    return context.prisma.blogPost.findMany({ where });
  },
}
```

### Pattern 2: Owner or Admin
```typescript
Mutation: {
  updateProfile: async (_, { userId, input }, context) => {
    requireOwnerOrRole(context, userId, [UserRole.ADMIN]);
    
    return context.prisma.user.update({
      where: { id: userId },
      data: input,
    });
  },
}
```

### Pattern 3: Multiple Roles
```typescript
Query: {
  volunteerApplications: async (_, __, context) => {
    requireRole(context, [
      UserRole.ADMIN,
      UserRole.DISTRICT_COORDINATOR,
      UserRole.SUPER_ADMIN
    ]);
    
    return context.prisma.volunteer.findMany();
  },
}
```

---

## 🚀 Ready to Go!

Your Better Auth implementation is complete. Just:

1. Create the backend server file
2. Implement GraphQL resolvers with guards
3. Set up frontend Apollo Client
4. Test the authentication flow

**All the hard work (architecture, database, library structure) is done!** 🎉

---

**Last Updated**: 2026-08-05  
**Status**: ✅ Implementation Complete, Ready for Backend Integration
