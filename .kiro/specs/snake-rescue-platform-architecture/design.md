# Snake Rescue Platform - Technical Architecture Design

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-08-05

---

## 1. Executive Summary

This document defines the complete technical architecture for the **Snake Rescue Platform**, an enterprise-grade full-stack application for managing snake rescue operations, volunteer coordination, AI-powered snake identification, and community engagement.

### 1.1 Technology Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- Apollo Client 3+
- GraphQL Code Generator
- TypeScript (Strict Mode)
- TailwindCSS

**Backend:**
- Node.js + Express 5
- Apollo Server 5
- GraphQL
- Prisma ORM
- PostgreSQL
- Redis (Caching + Sessions)
- TypeScript (Strict Mode)

**Infrastructure:**
- Nx Monorepo
- AWS S3 (File Storage)
- WebSocket (Real-time)
- JWT Authentication

**Integrations:**
- Stripe/Khalti/eSewa (Payments)
- AI/ML Services (Snake Identification)
- SMS/Email Notifications
- Maps/Geolocation

### 1.2 Architecture Principles

1. **Feature-First Architecture** - Organize by business capability
2. **Domain-Driven Design** - Clear bounded contexts
3. **Clean Architecture** - Dependency inversion, separation of concerns
4. **Type Safety** - End-to-end TypeScript with strict mode
5. **Modular GraphQL** - Feature-based schema composition
6. **Dependency Boundaries** - Enforced via Nx

---

## 2. Monorepo Structure

```
snake-rescue/
├── apps/
│   ├── frontend/              # Next.js 16 App Router
│   │   ├── app/               # App Router pages
│   │   ├── public/            # Static assets
│   │   └── next.config.js
│   │
│   └── backend/               # Express + Apollo Server
│       ├── src/
│       │   ├── main.ts        # Entry point
│       │   ├── app.ts         # Express app
│       │   ├── server.ts      # Apollo Server setup
│       │   ├── config/        # Configuration
│       │   └── middleware/    # Express middleware
│       └── tsconfig.json
│
├── libs/
│   ├── contracts/             # GraphQL Schema + Generated Types
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   └── graphql/   # .graphql schema files
│   │   │   │       ├── shared/
│   │   │   │       ├── auth/
│   │   │   │       ├── rescue/
│   │   │   │       ├── snake/
│   │   │   │       ├── volunteer/
│   │   │   │       ├── notification/
│   │   │   │       ├── payment/
│   │   │   │       ├── ai/
│   │   │   │       ├── cms/
│   │   │   │       └── analytics/
│   │   │   ├── generated/     # GraphQL Codegen output
│   │   │   │   ├── resolvers-types.ts
│   │   │   │   ├── graphql-operations.ts
│   │   │   │   ├── fragment-matcher.ts
│   │   │   │   └── schema.graphql
│   │   │   ├── context/       # GraphQL Context
│   │   │   └── index.ts
│   │   └── codegen.yml        # GraphQL Code Generator config
│
│   ├── database/              # Prisma + Database Client
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── src/
│   │       ├── client.ts      # Prisma Client export
│   │       └── types.ts       # Database types
│
│   ├── auth/                  # Authentication Module
│   │   └── src/
│   │       ├── authentication/    # Better Auth setup
│   │       ├── authorization/     # RBAC/ABAC
│   │       ├── guards/            # Auth guards
│   │       └── utils/
│
│   ├── shared/                # Shared Utilities
│   │   └── src/
│   │       ├── logger/
│   │       ├── errors/
│   │       ├── validators/
│   │       ├── constants/
│   │       └── utils/
│
│   ├── frontend/              # Frontend Libraries
│   │   │
│   │   ├── core/              # Apollo Client + Core Infrastructure
│   │   │   └── src/
│   │   │       ├── apollo/
│   │   │       │   ├── client.ts           # Apollo Client instance
│   │   │       │   ├── cache.ts            # Cache configuration
│   │   │       │   ├── provider.tsx        # ApolloProvider wrapper
│   │   │       │   └── links/
│   │   │       │       ├── auth-link.ts     # JWT injection
│   │   │       │       ├── error-link.ts    # Error handling
│   │   │       │       ├── retry-link.ts    # Retry logic
│   │   │       │       ├── upload-link.ts   # File uploads
│   │   │       │       ├── ws-link.ts       # WebSocket subscriptions
│   │   │       │       └── index.ts         # Link chain composition
│   │   │       ├── providers/
│   │   │       │   ├── app-provider.tsx     # Root provider
│   │   │       │   └── auth-provider.tsx    # Auth context
│   │   │       ├── config/
│   │   │       │   └── env.ts               # Environment config
│   │   │       ├── hooks/
│   │   │       │   ├── useAuth.ts
│   │   │       │   └── useToast.ts
│   │   │       └── utils/
│   │   │           ├── storage.ts
│   │   │           └── format.ts
│   │   │
│   │   ├── ui/                # UI Component Library
│   │   │   └── src/
│   │   │       ├── button/
│   │   │       ├── card/
│   │   │       ├── modal/
│   │   │       ├── form/
│   │   │       ├── table/
│   │   │       ├── toast/
│   │   │       ├── loading/
│   │   │       └── index.ts
│   │   │
│   │   └── features/          # Feature Modules
│   │       └── src/
│   │           ├── auth/      # Authentication Feature
│   │           │   ├── graphql/
│   │           │   │   ├── queries.graphql
│   │           │   │   ├── mutations.graphql
│   │           │   │   └── fragments.graphql
│   │           │   ├── hooks/
│   │           │   │   ├── useAuth.ts          # Feature hook (wraps generated)
│   │           │   │   ├── useLogin.ts
│   │           │   │   ├── useRegister.ts
│   │           │   │   └── useLogout.ts
│   │           │   ├── components/
│   │           │   │   ├── LoginForm.tsx
│   │           │   │   ├── RegisterForm.tsx
│   │           │   │   └── AuthGuard.tsx
│   │           │   ├── types/
│   │           │   │   └── index.ts
│   │           │   ├── utils/
│   │           │   │   └── validation.ts
│   │           │   └── index.ts
│   │           │
│   │           ├── rescue/    # Rescue Requests Feature
│   │           │   ├── graphql/
│   │           │   ├── hooks/
│   │           │   │   ├── useRescueRequests.ts
│   │           │   │   ├── useRescueRequest.ts  # Wraps useRescueRequestQuery
│   │           │   │   ├── useCreateRescue.ts
│   │           │   │   └── useAssignVolunteer.ts
│   │           │   ├── components/
│   │           │   │   ├── RescueList.tsx
│   │           │   │   ├── RescueCard.tsx
│   │           │   │   ├── RescueForm.tsx
│   │           │   │   └── RescueMap.tsx
│   │           │   ├── types/
│   │           │   ├── utils/
│   │           │   └── index.ts
│   │           │
│   │           ├── snake/     # Snake Species & ID Feature
│   │           │   ├── graphql/
│   │           │   ├── hooks/
│   │           │   │   ├── useSnakeSpecies.ts
│   │           │   │   ├── useSnakeIdentify.ts
│   │           │   │   └── useSnakeInfo.ts
│   │           │   ├── components/
│   │           │   │   ├── SnakeIdentifier.tsx
│   │           │   │   ├── SnakeCard.tsx
│   │           │   │   └── SnakeGallery.tsx
│   │           │   └── index.ts
│   │           │
│   │           ├── volunteer/ # Volunteer Management
│   │           ├── notification/ # Notifications
│   │           ├── payment/   # Payment Integration
│   │           ├── dashboard/ # Admin Dashboard
│   │           ├── cms/       # Content Management
│   │           └── analytics/ # Analytics & Reports
│
│   └── backend/               # Backend Libraries
│       │
│       ├── core/              # Core Backend Infrastructure
│       │   └── src/
│       │       ├── apollo/
│       │       │   ├── server.ts          # Apollo Server factory
│       │       │   ├── context.ts         # Context factory
│       │       │   └── plugins/
│       │       ├── graphql/
│       │       │   ├── schema-loader.ts   # Load GraphQL files
│       │       │   └── resolver-merge.ts  # Merge resolvers
│       │       └── middleware/
│       │           ├── auth.ts
│       │           └── error.ts
│       │
│       ├── modules/           # Feature Modules (Backend)
│       │   └── src/
│       │       ├── auth/
│       │       │   ├── infrastructure/
│       │       │   │   └── graphql/
│       │       │   │       └── resolvers/
│       │       │   ├── application/
│       │       │   │   └── use-cases/
│       │       │   ├── domain/
│       │       │   │   ├── entities/
│       │       │   │   └── services/
│       │       │   └── index.ts
│       │       │
│       │       ├── rescue/    # Rescue Module
│       │       │   ├── infrastructure/
│       │       │   │   ├── graphql/
│       │       │   │   │   └── resolvers/
│       │       │   │   │       ├── rescue-query.resolver.ts
│       │       │   │   │       └── rescue-mutation.resolver.ts
│       │       │   │   └── repositories/
│       │       │   │       └── rescue.repository.ts
│       │       │   ├── application/
│       │       │   │   └── use-cases/
│       │       │   │       ├── create-rescue-request.use-case.ts
│       │       │   │       ├── assign-volunteer.use-case.ts
│       │       │   │       └── update-rescue-status.use-case.ts
│       │       │   ├── domain/
│       │       │   │   ├── entities/
│       │       │   │   │   └── rescue-request.entity.ts
│       │       │   │   └── services/
│       │       │   │       └── rescue.service.ts
│       │       │   └── index.ts
│       │       │
│       │       ├── snake/
│       │       ├── volunteer/
│       │       ├── notification/
│       │       ├── payment/
│       │       ├── ai/
│       │       └── analytics/
│       │
│       ├── loaders/           # DataLoader (N+1 Prevention)
│       │   └── src/
│       │       ├── user.loader.ts
│       │       ├── rescue.loader.ts
│       │       └── index.ts
│       │
│       ├── services/          # External Services
│       │   └── src/
│       │       ├── storage/   # AWS S3
│       │       ├── email/     # Email service
│       │       ├── sms/       # SMS service
│       │       ├── payment/   # Stripe/Khalti/eSewa
│       │       ├── ai/        # AI/ML integration
│       │       └── cache/     # Redis
│       │
│       └── repositories/      # Base Repository Pattern
│           └── src/
│               └── base.repository.ts
│
├── .kiro/                     # Kiro configuration
├── .nx/                       # Nx cache
├── node_modules/
├── package.json
├── nx.json
├── tsconfig.base.json
└── README.md
```

---

## 3. Frontend Architecture

### 3.1 Apollo Client Configuration

```typescript
// libs/frontend/core/src/apollo/client.ts

import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { createAuthLink } from './links/auth-link';
import { createErrorLink } from './links/error-link';
import { createRetryLink } from './links/retry-link';
import { createUploadLink } from './links/upload-link';
import { createWsLink } from './links/ws-link';
import { createSplitLink } from './links/split-link';
import { createCache } from './cache';

export function createApolloClient() {
  const cache = createCache();
  
  const authLink = createAuthLink();
  const errorLink = createErrorLink();
  const retryLink = createRetryLink();
  const httpLink = createUploadLink();
  const wsLink = createWsLink();
  const splitLink = createSplitLink(httpLink, wsLink);
  
  return new ApolloClient({
    link: from([
      errorLink,
      authLink,
      retryLink,
      splitLink,
    ]),
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}
```

### 3.2 Link Chain Architecture

**Order of Links:**
1. **Error Link** - Global error handling (401, 403, network errors)
2. **Auth Link** - JWT token injection
3. **Retry Link** - Retry failed requests with exponential backoff
4. **Split Link** - Route to HTTP or WebSocket based on operation type
   - **Upload Link** - HTTP with file upload support
   - **WebSocket Link** - Real-time subscriptions

### 3.3 Cache Configuration

```typescript
// libs/frontend/core/src/apollo/cache.ts

import { InMemoryCache } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

export function createCache() {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          rescueRequests: relayStylePagination(),
          volunteers: relayStylePagination(),
          snakeSpecies: relayStylePagination(),
          notifications: relayStylePagination(['unreadOnly']),
        },
      },
      RescueRequest: {
        keyFields: ['id'],
        fields: {
          volunteer: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
      User: {
        keyFields: ['id'],
      },
      Volunteer: {
        keyFields: ['id'],
      },
    },
    possibleTypes: {
      // Generated by fragment-matcher
    },
  });
}
```

### 3.4 Feature Hook Pattern

**Critical Rule:** UI components NEVER call generated hooks directly.

**Data Flow:**
```
Page Component
    ↓ (imports)
Feature Hook (useRescueRequest)
    ↓ (calls internally)
Generated Apollo Hook (useRescueRequestQuery)
    ↓ (makes request)
Apollo Client
    ↓ (GraphQL HTTP/WS)
Backend API
```

**Example Feature Hook:**

```typescript
// libs/frontend/features/src/rescue/hooks/useRescueRequest.ts

import { useRescueRequestQuery } from '@snake-rescue/contracts';
import { useCallback } from 'react';

export function useRescueRequest(id: string) {
  const { data, loading, error, refetch } = useRescueRequestQuery({
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });
  
  const rescueRequest = data?.rescueRequest;
  
  // Transform/normalize data
  const transformedData = rescueRequest ? {
    ...rescueRequest,
    location: {
      lat: rescueRequest.latitude,
      lng: rescueRequest.longitude,
    },
    isUrgent: rescueRequest.urgencyLevel === 'HIGH',
  } : null;
  
  // Business logic
  const canAssignVolunteer = rescueRequest?.status === 'PENDING';
  const isCompleted = rescueRequest?.status === 'COMPLETED';
  
  // Actions
  const reload = useCallback(() => {
    refetch();
  }, [refetch]);
  
  return {
    rescueRequest: transformedData,
    loading,
    error,
    canAssignVolunteer,
    isCompleted,
    actions: {
      reload,
    },
  };
}
```

**Component Usage:**

```typescript
// apps/frontend/app/rescue/[id]/page.tsx

import { useRescueRequest } from '@snake-rescue/frontend/features';

export default function RescuePage({ params }: { params: { id: string } }) {
  const {
    rescueRequest,
    loading,
    error,
    canAssignVolunteer,
    actions,
  } = useRescueRequest(params.id);
  
  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;
  if (!rescueRequest) return <NotFound />;
  
  return (
    <RescueCard
      rescue={rescueRequest}
      canAssign={canAssignVolunteer}
      onRefresh={actions.reload}
    />
  );
}
```

### 3.5 GraphQL Code Generator Configuration

```yaml
# libs/contracts/codegen.yml

schema: './src/lib/graphql/**/*.graphql'

config:
  allowPartialOutputs: true
  enumsAsTypes: true
  futureProofEnums: true
  futureProofUnions: true
  nonOptionalTypename: false
  skipTypename: false
  namingConvention:
    typeNames: pascal-case
    enumValues: keep

generates:
  # Backend - Resolver Types
  ./src/generated/resolvers-types.ts:
    plugins:
      - typescript
      - typescript-resolvers
    config:
      contextType: '../context/index.js#GraphQLContext'
      mappers:
        User: '@snake-rescue/database#User as UserModel'
        RescueRequest: '@snake-rescue/database#RescueRequest as RescueRequestModel'
        # ... other mappers
  
  # Frontend - Apollo Hooks
  ./src/generated/graphql-operations.ts:
    documents:
      - '../../libs/frontend/features/src/**/graphql/**/*.graphql'
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
      withComponent: false
      withHOC: false
      skipTypename: false
      scalars:
        DateTime: string
        JSON: any
        Upload: File
  
  # Fragment Matcher
  ./src/generated/fragment-matcher.ts:
    plugins:
      - fragment-matcher
  
  # Schema Introspection
  ./src/generated/schema.json:
    plugins:
      - introspection
```

### 3.6 Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. Login Request
       ▼
┌─────────────┐
│  LoginForm  │
└──────┬──────┘
       │ 2. useLogin()
       ▼
┌──────────────────┐
│ useLoginMutation │ (Generated)
└──────┬───────────┘
       │ 3. Apollo Client
       ▼
┌───────────────┐
│  Auth Link    │ (No token yet)
└───────┬───────┘
       │ 4. GraphQL Request
       ▼
┌────────────────┐
│ Backend API    │
│  /graphql      │
└───────┬────────┘
       │ 5. JWT Token + User
       ▼
┌──────────────────┐
│ Auth Context     │ Store token
└──────┬───────────┘
       │ 6. Subsequent Requests
       ▼
┌───────────────┐
│  Auth Link    │ Inject token
└───────┬───────┘
       │ Authorization: Bearer <token>
       ▼
┌────────────────┐
│ Backend API    │ Verify token
└────────────────┘
```

### 3.7 Error Handling Strategy

**Error Link:**
```typescript
// libs/frontend/core/src/apollo/links/error-link.ts

import { onError } from '@apollo/client/link/error';
import { logout, refreshToken } from '@snake-rescue/auth';

export function createErrorLink() {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.extensions?.code === 'UNAUTHENTICATED') {
          // Attempt token refresh
          return fromPromise(
            refreshToken().catch(() => {
              logout();
              return;
            })
          ).flatMap(() => forward(operation));
        }
        
        if (err.extensions?.code === 'FORBIDDEN') {
          toast.error('You do not have permission');
        }
      }
    }
    
    if (networkError) {
      toast.error('Network error. Please try again.');
    }
  });
}
```

---

## 4. Backend Architecture

### 4.1 Clean Architecture Layers

```
┌─────────────────────────────────────────────────┐
│            Infrastructure Layer                  │
│  (GraphQL Resolvers, HTTP, Database, External)  │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│            Application Layer                     │
│           (Use Cases, DTOs)                      │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│             Domain Layer                         │
│    (Entities, Services, Business Logic)          │
└──────────────────────────────────────────────────┘
```

**Dependency Rule:** Inner layers NEVER depend on outer layers.

### 4.2 Module Structure (Example: Rescue)

```
libs/backend/modules/src/rescue/
├── infrastructure/
│   ├── graphql/
│   │   └── resolvers/
│   │       ├── rescue-query.resolver.ts
│   │       └── rescue-mutation.resolver.ts
│   └── repositories/
│       └── rescue.repository.ts
│
├── application/
│   └── use-cases/
│       ├── create-rescue-request.use-case.ts
│       ├── assign-volunteer.use-case.ts
│       └── update-rescue-status.use-case.ts
│
├── domain/
│   ├── entities/
│   │   └── rescue-request.entity.ts
│   └── services/
│       └── rescue.service.ts
│
└── index.ts
```

### 4.3 GraphQL Request Lifecycle

```
Client Request
    ↓
Express Middleware
    ↓ (JWT verification)
Auth Middleware
    ↓ (populate context.user)
Apollo Server
    ↓ (parse, validate)
GraphQL Resolver
    ↓ (call use case)
Use Case
    ↓ (business logic)
Service
    ↓ (domain operations)
Repository
    ↓ (data access)
Prisma Client
    ↓
PostgreSQL
```

### 4.4 Resolver Pattern

```typescript
// libs/backend/modules/src/rescue/infrastructure/graphql/resolvers/rescue-query.resolver.ts

import { QueryResolvers } from '@snake-rescue/contracts';
import { CreateRescueRequestUseCase } from '../../application/use-cases/create-rescue-request.use-case';

const createRescueRequestUseCase = new CreateRescueRequestUseCase();

export const rescueQueryResolvers: QueryResolvers = {
  Query: {
    rescueRequest: async (_parent, { id }, context) => {
      // Authorization check
      if (!context.user) {
        throw new GraphQLError('Unauthenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      
      // Delegate to use case
      return createRescueRequestUseCase.execute(id, context.user);
    },
    
    rescueRequests: async (_parent, { filter, pagination }, context) => {
      // Implementation
    },
  },
};
```

### 4.5 Use Case Pattern

```typescript
// libs/backend/modules/src/rescue/application/use-cases/create-rescue-request.use-case.ts

import { RescueRepository } from '../../infrastructure/repositories/rescue.repository';
import { RescueService } from '../../domain/services/rescue.service';
import { NotificationService } from '@snake-rescue/backend/services';

export class CreateRescueRequestUseCase {
  private rescueRepo = new RescueRepository();
  private rescueService = new RescueService();
  private notificationService = new NotificationService();
  
  async execute(input: CreateRescueInput, userId: string) {
    // 1. Validate input
    this.validateInput(input);
    
    // 2. Create rescue entity (domain logic)
    const rescue = this.rescueService.create({
      ...input,
      requesterId: userId,
    });
    
    // 3. Persist to database
    const savedRescue = await this.rescueRepo.create(rescue);
    
    // 4. Send notifications to nearby volunteers
    await this.notificationService.notifyNearbyVolunteers({
      location: { lat: input.latitude, lng: input.longitude },
      rescueId: savedRescue.id,
    });
    
    // 5. Return result
    return savedRescue;
  }
  
  private validateInput(input: CreateRescueInput) {
    // Validation logic
  }
}
```

### 4.6 Repository Pattern

```typescript
// libs/backend/modules/src/rescue/infrastructure/repositories/rescue.repository.ts

import { prisma } from '@snake-rescue/database';
import { RescueRequest } from '../../domain/entities/rescue-request.entity';

export class RescueRepository {
  async create(rescue: RescueRequest) {
    return prisma.rescueRequest.create({
      data: {
        description: rescue.description,
        latitude: rescue.latitude,
        longitude: rescue.longitude,
        urgencyLevel: rescue.urgencyLevel,
        requesterId: rescue.requesterId,
      },
      include: {
        requester: true,
        volunteer: true,
        timeline: true,
      },
    });
  }
  
  async findById(id: string) {
    return prisma.rescueRequest.findUnique({
      where: { id },
      include: {
        requester: true,
        volunteer: true,
        timeline: true,
      },
    });
  }
  
  async findMany(filter: RescueFilter) {
    return prisma.rescueRequest.findMany({
      where: {
        status: filter.status,
        urgencyLevel: filter.urgencyLevel,
      },
      orderBy: { createdAt: 'desc' },
      take: filter.limit,
      skip: filter.offset,
    });
  }
}
```

### 4.7 DataLoader (N+1 Problem Prevention)

```typescript
// libs/backend/loaders/src/user.loader.ts

import DataLoader from 'dataloader';
import { prisma } from '@snake-rescue/database';

export const createUserLoader = () => {
  return new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: [...userIds] } },
    });
    
    const userMap = new Map(users.map(u => [u.id, u]));
    return userIds.map(id => userMap.get(id) || null);
  });
};
```

**Context Integration:**

```typescript
// libs/backend/core/src/apollo/context.ts

export interface GraphQLContext {
  req: Request;
  res: Response;
  user?: User;
  loaders: {
    user: DataLoader<string, User>;
    rescue: DataLoader<string, RescueRequest>;
  };
}

export function createContext({ req, res }): GraphQLContext {
  return {
    req,
    res,
    user: (req as any).user,
    loaders: {
      user: createUserLoader(),
      rescue: createRescueLoader(),
    },
  };
}
```

**Resolver Usage:**

```typescript
export const rescueResolvers: RescueResolvers = {
  RescueRequest: {
    requester: (parent, _args, context) => {
      // Use DataLoader instead of direct Prisma call
      return context.loaders.user.load(parent.requesterId);
    },
    volunteer: (parent, _args, context) => {
      if (!parent.volunteerId) return null;
      return context.loaders.user.load(parent.volunteerId);
    },
  },
};
```

---

## 5. GraphQL Schema Architecture

### 5.1 Modular Schema Design

Each domain module contains its own GraphQL types, queries, mutations, and subscriptions:

```
libs/contracts/src/lib/graphql/
├── shared/
│   ├── scalars.graphql          # Custom scalars
│   ├── directives.graphql       # Custom directives
│   └── pagination.graphql       # Pagination types
│
├── auth/
│   ├── auth.graphql             # Auth types
│   ├── queries.graphql          # me, session
│   └── mutations.graphql        # login, register, logout
│
├── rescue/
│   ├── rescue.graphql           # RescueRequest, RescueTimeline
│   ├── queries.graphql          # rescueRequest, rescueRequests
│   ├── mutations.graphql        # createRescueRequest, assignRescue
│   └── subscriptions.graphql    # rescueUpdated
│
├── snake/
│   ├── snake.graphql
│   ├── queries.graphql
│   └── mutations.graphql
│
├── volunteer/
│   ├── volunteer.graphql
│   ├── queries.graphql
│   ├── mutations.graphql
│   └── subscriptions.graphql
│
├── notification/
├── payment/
├── ai/
├── cms/
└── analytics/
```

### 5.2 Example Schema Module (Rescue)

```graphql
# libs/contracts/src/lib/graphql/rescue/rescue.graphql

type RescueRequest {
  id: ID!
  description: String!
  latitude: Latitude!
  longitude: Longitude!
  location: String
  urgencyLevel: UrgencyLevel!
  status: RescueStatus!
  requester: User!
  volunteer: Volunteer
  snakeSpecies: SnakeSpecies
  images: [String!]!
  timeline: [RescueTimeline!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum UrgencyLevel {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum RescueStatus {
  PENDING
  ASSIGNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

type RescueTimeline {
  id: ID!
  rescueId: ID!
  status: RescueStatus!
  note: String
  location: String
  createdAt: DateTime!
  createdBy: User!
}
```

```graphql
# libs/contracts/src/lib/graphql/rescue/queries.graphql

extend type Query {
  rescueRequest(id: ID!): RescueRequest
  rescueRequests(
    filter: RescueFilter
    pagination: PaginationInput
  ): RescuePagination!
}

input RescueFilter {
  status: RescueStatus
  urgencyLevel: UrgencyLevel
  volunteerId: ID
  requesterId: ID
  dateRange: DateRangeInput
}

type RescuePagination {
  edges: [RescueEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type RescueEdge {
  node: RescueRequest!
  cursor: String!
}
```

```graphql
# libs/contracts/src/lib/graphql/rescue/mutations.graphql

extend type Mutation {
  createRescueRequest(input: CreateRescueInput!): RescueRequest!
  assignRescue(rescueId: ID!, volunteerId: ID!): RescueRequest!
  updateRescueStatus(rescueId: ID!, status: RescueStatus!, note: String): RescueRequest!
}

input CreateRescueInput {
  description: String!
  latitude: Latitude!
  longitude: Longitude!
  location: String
  urgencyLevel: UrgencyLevel!
  images: [Upload!]
  snakeSpeciesId: ID
}
```

```graphql
# libs/contracts/src/lib/graphql/rescue/subscriptions.graphql

extend type Subscription {
  rescueUpdated(rescueId: ID!): RescueRequest!
  newRescueRequests(location: LocationInput): RescueRequest!
}

input LocationInput {
  latitude: Latitude!
  longitude: Longitude!
  radius: Float! # in kilometers
}
```

### 5.3 Shared Types

```graphql
# libs/contracts/src/lib/graphql/shared/scalars.graphql

scalar DateTime
scalar JSON
scalar Email
scalar Phone
scalar Latitude   # -90 to 90
scalar Longitude  # -180 to 180
scalar PositiveInt
scalar Upload
```

```graphql
# libs/contracts/src/lib/graphql/shared/pagination.graphql

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

input PaginationInput {
  first: Int
  after: String
  last: Int
  before: String
}

input DateRangeInput {
  startDate: DateTime!
  endDate: DateTime!
}
```

---

## 6. Real-Time & File Upload

### 6.1 GraphQL Subscriptions

**WebSocket Link:**

```typescript
// libs/frontend/core/src/apollo/links/ws-link.ts

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

export function createWsLink() {
  return new GraphQLWsLink(
    createClient({
      url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/graphql',
      connectionParams: () => ({
        authToken: localStorage.getItem('token'),
      }),
    })
  );
}
```

**Feature Hook with Subscription:**

```typescript
// libs/frontend/features/src/rescue/hooks/useRescueUpdates.ts

import { useRescueUpdatedSubscription } from '@snake-rescue/contracts';

export function useRescueUpdates(rescueId: string) {
  const { data, loading } = useRescueUpdatedSubscription({
    variables: { rescueId },
  });
  
  return {
    latestUpdate: data?.rescueUpdated,
    loading,
  };
}
```

**Backend Subscription Resolver:**

```typescript
// libs/backend/modules/src/rescue/infrastructure/graphql/resolvers/rescue-subscription.resolver.ts

import { SubscriptionResolvers } from '@snake-rescue/contracts';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const rescueSubscriptionResolvers: SubscriptionResolvers = {
  Subscription: {
    rescueUpdated: {
      subscribe: (_parent, { rescueId }) => {
        return pubsub.asyncIterator(`RESCUE_UPDATED_${rescueId}`);
      },
    },
  },
};

// Publish from mutation resolver
export async function publishRescueUpdate(rescueId: string, data: RescueRequest) {
  await pubsub.publish(`RESCUE_UPDATED_${rescueId}`, {
    rescueUpdated: data,
  });
}
```

### 6.2 File Upload

**Upload Link:**

```typescript
// libs/frontend/core/src/apollo/links/upload-link.ts

import { createUploadLink as createApolloUploadLink } from 'apollo-upload-client';

export function createUploadLink() {
  return createApolloUploadLink({
    uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
    credentials: 'include',
  });
}
```

**Mutation with Upload:**

```graphql
# libs/frontend/features/src/rescue/graphql/mutations.graphql

mutation CreateRescueWithImages(
  $input: CreateRescueInput!
) {
  createRescueRequest(input: $input) {
    id
    description
    images
    status
  }
}
```

**Feature Hook:**

```typescript
// libs/frontend/features/src/rescue/hooks/useCreateRescue.ts

import { useCreateRescueWithImagesMutation } from '@snake-rescue/contracts';

export function useCreateRescue() {
  const [mutate, { loading, error }] = useCreateRescueWithImagesMutation();
  
  const createRescue = async (input: CreateRescueInput, images: File[]) => {
    return mutate({
      variables: {
        input: {
          ...input,
          images,
        },
      },
    });
  };
  
  return {
    createRescue,
    loading,
    error,
  };
}
```

**Backend Upload Processing:**

```typescript
// libs/backend/services/src/storage/s3.service.ts

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class S3Service {
  private s3: S3Client;
  
  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  
  async uploadFile(file: Upload): Promise<string> {
    const { createReadStream, filename, mimetype } = await file;
    const stream = createReadStream();
    const key = `rescue-images/${Date.now()}-${filename}`;
    
    await this.s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: stream,
      ContentType: mimetype,
    }));
    
    return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
  }
}
```

---

## 7. Pagination Strategy

### 7.1 Relay Cursor Pagination

**Implementation:**

```typescript
// libs/frontend/core/src/apollo/cache.ts

import { relayStylePagination } from '@apollo/client/utilities';

export function createCache() {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          rescueRequests: relayStylePagination(),
        },
      },
    },
  });
}
```

**Feature Hook with Pagination:**

```typescript
// libs/frontend/features/src/rescue/hooks/useRescueRequests.ts

import { useRescueRequestsQuery } from '@snake-rescue/contracts';

export function useRescueRequests(filter?: RescueFilter) {
  const { data, loading, fetchMore } = useRescueRequestsQuery({
    variables: {
      filter,
      pagination: { first: 20 },
    },
  });
  
  const loadMore = () => {
    if (!data?.rescueRequests.pageInfo.hasNextPage) return;
    
    fetchMore({
      variables: {
        pagination: {
          first: 20,
          after: data.rescueRequests.pageInfo.endCursor,
        },
      },
    });
  };
  
  return {
    rescueRequests: data?.rescueRequests.edges.map(e => e.node) || [],
    hasMore: data?.rescueRequests.pageInfo.hasNextPage || false,
    loadMore,
    loading,
  };
}
```

**Component with Infinite Scroll:**

```typescript
// apps/frontend/app/rescues/page.tsx

import { useRescueRequests } from '@snake-rescue/frontend/features';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function RescuesPage() {
  const { rescueRequests, hasMore, loadMore, loading } = useRescueRequests();
  
  return (
    <InfiniteScroll
      dataLength={rescueRequests.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<Loading />}
    >
      {rescueRequests.map(rescue => (
        <RescueCard key={rescue.id} rescue={rescue} />
      ))}
    </InfiniteScroll>
  );
}
```

---

## 8. Security Architecture

### 8.1 Authentication

**JWT Strategy:**

```typescript
// libs/auth/src/authentication/jwt.ts

import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateTokens(payload: JWTPayload) {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: payload.userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
}
```

### 8.2 Authorization (RBAC)

**Roles:**
- `PUBLIC` - Unauthenticated users
- `USER` - Authenticated regular users
- `VOLUNTEER` - Verified volunteers
- `ADMIN` - System administrators
- `SUPER_ADMIN` - Full system access

**Authorization Directive:**

```graphql
# libs/contracts/src/lib/graphql/shared/directives.graphql

directive @auth(requires: Role = USER) on OBJECT | FIELD_DEFINITION

enum Role {
  PUBLIC
  USER
  VOLUNTEER
  ADMIN
  SUPER_ADMIN
}
```

**Directive Implementation:**

```typescript
// libs/backend/core/src/graphql/directives/auth.directive.ts

import { GraphQLError } from 'graphql';

export function authDirective(requires: string) {
  return (next: any, source: any, args: any, context: any) => {
    if (!context.user) {
      throw new GraphQLError('Unauthenticated', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }
    
    const userRole = context.user.role;
    const hasPermission = checkRole(userRole, requires);
    
    if (!hasPermission) {
      throw new GraphQLError('Forbidden', {
        extensions: { code: 'FORBIDDEN' },
      });
    }
    
    return next(source, args, context);
  };
}
```

### 8.3 Input Validation

**Zod Schemas:**

```typescript
// libs/backend/modules/src/rescue/domain/validators/rescue.validator.ts

import { z } from 'zod';

export const CreateRescueSchema = z.object({
  description: z.string().min(10).max(500),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  location: z.string().optional(),
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  images: z.array(z.any()).max(5).optional(),
  snakeSpeciesId: z.string().uuid().optional(),
});

export type CreateRescueInput = z.infer<typeof CreateRescueSchema>;
```

**Validation in Resolver:**

```typescript
export const rescueMutationResolvers: MutationResolvers = {
  Mutation: {
    createRescueRequest: async (_parent, { input }, context) => {
      // Validate input
      const validated = CreateRescueSchema.parse(input);
      
      // Delegate to use case
      return createRescueRequestUseCase.execute(validated, context.user.id);
    },
  },
};
```

### 8.4 Rate Limiting

```typescript
// libs/backend/middleware/src/rate-limit.ts

import rateLimit from 'express-rate-limit';

export const createRateLimiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
  });
};
```

---

## 9. Payment Integration

### 9.1 Payment Architecture

**Support For:**
- Stripe (International)
- Khalti (Nepal)
- eSewa (Nepal)

**Payment Module Structure:**

```
libs/backend/modules/src/payment/
├── infrastructure/
│   ├── graphql/
│   └── gateways/
│       ├── stripe.gateway.ts
│       ├── khalti.gateway.ts
│       └── esewa.gateway.ts
├── application/
│   └── use-cases/
│       ├── create-donation.use-case.ts
│       └── verify-payment.use-case.ts
└── domain/
    └── services/
        └── payment.service.ts
```

**GraphQL Schema:**

```graphql
# libs/contracts/src/lib/graphql/payment/payment.graphql

type Donation {
  id: ID!
  amount: Float!
  currency: String!
  gateway: PaymentGateway!
  status: PaymentStatus!
  donor: User
  metadata: JSON
  createdAt: DateTime!
}

enum PaymentGateway {
  STRIPE
  KHALTI
  ESEWA
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

extend type Mutation {
  createDonation(input: CreateDonationInput!): DonationPayload!
  verifyPayment(gateway: PaymentGateway!, transactionId: String!): Donation!
}

input CreateDonationInput {
  amount: Float!
  currency: String!
  gateway: PaymentGateway!
  returnUrl: String!
}

type DonationPayload {
  donation: Donation!
  paymentUrl: String!
}
```

---

## 10. AI Integration

### 10.1 Snake Identification Service

**Architecture:**

```
User Uploads Image
    ↓
Frontend (useSnakeIdentify hook)
    ↓
GraphQL Mutation (identifySnake)
    ↓
AI Service
    ↓
External AI API (AWS Rekognition / Custom Model)
    ↓
Return Identification Result
    ↓
Store in Database
    ↓
Notify User
```

**GraphQL Schema:**

```graphql
# libs/contracts/src/lib/graphql/ai/ai.graphql

type AIIdentification {
  id: ID!
  image: String!
  predictions: [SnakePrediction!]!
  confidence: Float!
  species: SnakeSpecies
  status: IdentificationStatus!
  createdAt: DateTime!
}

type SnakePrediction {
  speciesId: ID!
  speciesName: String!
  confidence: Float!
  venomous: Boolean!
}

enum IdentificationStatus {
  PROCESSING
  COMPLETED
  FAILED
}

extend type Mutation {
  identifySnake(image: Upload!): AIIdentification!
}

extend type Subscription {
  identificationUpdated(id: ID!): AIIdentification!
}
```

**Feature Hook:**

```typescript
// libs/frontend/features/src/snake/hooks/useSnakeIdentify.ts

import { useIdentifySnakeMutation, useIdentificationUpdatedSubscription } from '@snake-rescue/contracts';

export function useSnakeIdentify() {
  const [mutate, { loading }] = useIdentifySnakeMutation();
  const [identificationId, setIdentificationId] = useState<string | null>(null);
  
  const { data: subscriptionData } = useIdentificationUpdatedSubscription({
    variables: { id: identificationId! },
    skip: !identificationId,
  });
  
  const identify = async (image: File) => {
    const result = await mutate({ variables: { image } });
    setIdentificationId(result.data?.identifySnake.id || null);
    return result;
  };
  
  return {
    identify,
    loading,
    result: subscriptionData?.identificationUpdated,
  };
}
```

---

## 11. Nx Library Dependency Rules

### 11.1 Dependency Graph

```
┌─────────────────────────────────────────────────┐
│                 apps/                            │
│  frontend          backend                       │
└───┬─────────────────────┬────────────────────────┘
    │                     │
    ▼                     ▼
┌──────────────┐   ┌──────────────────┐
│   frontend   │   │     backend      │
│    libs      │   │      libs        │
└───┬──────────┘   └────┬─────────────┘
    │                   │
    ├─► core            ├─► core
    ├─► features        ├─► modules
    └─► ui              ├─► services
                        ├─► loaders
                        └─► repositories
                                │
        ┌───────────────────────┼───────────────┐
        │                       │               │
        ▼                       ▼               ▼
   ┌──────────┐          ┌──────────┐    ┌──────────┐
   │ contracts│◄─────────┤ database │    │   auth   │
   └──────────┘          └──────────┘    └──────────┘
        ▲                       ▲               ▲
        │                       │               │
        └───────────┬───────────┴───────────────┘
                    │
              ┌─────▼──────┐
              │   shared   │
              └────────────┘
```

### 11.2 Dependency Rules (nx.json)

```json
{
  "namedInputs": {
    "default": ["{projectRoot}/**/*"],
    "production": ["!{projectRoot}/**/*.spec.ts"]
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    }
  },
  "plugins": [
    {
      "plugin": "@nx/eslint/plugin",
      "options": {
        "targetName": "lint"
      }
    }
  ]
}
```

**Enforced Constraints (.eslintrc.json):**

```json
{
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBuildableLibDependency": true,
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "scope:frontend",
                "onlyDependOnLibsWithTags": ["scope:frontend", "scope:shared"]
              },
              {
                "sourceTag": "scope:backend",
                "onlyDependOnLibsWithTags": ["scope:backend", "scope:shared"]
              },
              {
                "sourceTag": "type:feature",
                "onlyDependOnLibsWithTags": ["type:ui", "type:core", "type:util"]
              },
              {
                "sourceTag": "type:ui",
                "onlyDependOnLibsWithTags": ["type:util"]
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### 11.3 Library Tags

**In project.json:**

```json
{
  "name": "@snake-rescue/frontend/features",
  "tags": ["scope:frontend", "type:feature"]
}

{
  "name": "@snake-rescue/frontend/ui",
  "tags": ["scope:frontend", "type:ui"]
}

{
  "name": "@snake-rescue/backend/modules",
  "tags": ["scope:backend", "type:feature"]
}

{
  "name": "@snake-rescue/contracts",
  "tags": ["scope:shared", "type:data"]
}
```

---

## 12. Deployment Architecture

### 12.1 Infrastructure

```
┌──────────────────────────────────────────┐
│           Load Balancer (AWS ALB)         │
└────────┬─────────────────────┬────────────┘
         │                     │
         ▼                     ▼
┌────────────────┐    ┌────────────────────┐
│   Frontend     │    │     Backend        │
│   (Vercel)     │    │  (AWS ECS/Fargate) │
│   Next.js 16   │    │   Docker Container │
└────────────────┘    └──────┬─────────────┘
                             │
                    ┌────────┼─────────┐
                    │        │         │
                    ▼        ▼         ▼
            ┌────────┐ ┌────────┐ ┌────────┐
            │ RDS    │ │ Redis  │ │  S3    │
            │ Postgres│ │ Cache  │ │ Storage│
            └────────┘ └────────┘ └────────┘
```

### 12.2 Environment Configuration

**Development:**
```env
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/snake_rescue_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev_secret
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
NEXT_PUBLIC_WS_URL=ws://localhost:4000/graphql
```

**Production:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://prod-db:5432/snake_rescue
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=<strong-secret>
NEXT_PUBLIC_API_URL=https://api.snakerescue.com/graphql
NEXT_PUBLIC_WS_URL=wss://api.snakerescue.com/graphql
AWS_REGION=us-east-1
AWS_S3_BUCKET=snake-rescue-uploads
```

### 12.3 Docker Configuration

**Backend Dockerfile:**

```dockerfile
# apps/backend/Dockerfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY nx.json tsconfig.base.json ./
RUN npm ci
COPY . .
RUN npx nx build backend --prod

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/backend ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "main.js"]
```

**docker-compose.yml (Development):**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: snake_rescue_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

volumes:
  postgres_data:
```

---

## 13. Testing Strategy

### 13.1 Testing Pyramid

```
        ┌─────────────┐
        │   E2E Tests │  (Playwright)
        └──────┬──────┘
            ┌──┴───────────────┐
            │ Integration Tests │  (Apollo + DB)
            └───────┬───────────┘
                ┌───┴────────────────┐
                │   Unit Tests       │  (Jest)
                └────────────────────┘
```

### 13.2 Unit Tests (Use Cases, Services)

```typescript
// libs/backend/modules/src/rescue/application/use-cases/__tests__/create-rescue-request.spec.ts

import { CreateRescueRequestUseCase } from '../create-rescue-request.use-case';

describe('CreateRescueRequestUseCase', () => {
  let useCase: CreateRescueRequestUseCase;
  
  beforeEach(() => {
    useCase = new CreateRescueRequestUseCase();
  });
  
  it('should create a rescue request successfully', async () => {
    const input = {
      description: 'Snake in my backyard',
      latitude: 27.7172,
      longitude: 85.3240,
      urgencyLevel: 'HIGH',
    };
    
    const result = await useCase.execute(input, 'user-123');
    
    expect(result).toHaveProperty('id');
    expect(result.status).toBe('PENDING');
  });
  
  it('should throw validation error for invalid input', async () => {
    const input = {
      description: 'Short',
      latitude: 200, // Invalid
      longitude: 85.3240,
      urgencyLevel: 'HIGH',
    };
    
    await expect(
      useCase.execute(input, 'user-123')
    ).rejects.toThrow();
  });
});
```

### 13.3 Integration Tests (GraphQL Resolvers)

```typescript
// libs/backend/modules/src/rescue/__tests__/rescue-resolvers.integration.spec.ts

import { ApolloServer } from '@apollo/server';
import { createApolloServer } from '@snake-rescue/backend/core';

describe('Rescue Resolvers Integration', () => {
  let server: ApolloServer;
  
  beforeAll(async () => {
    server = createApolloServer();
  });
  
  it('should create a rescue request', async () => {
    const CREATE_RESCUE = `
      mutation CreateRescue($input: CreateRescueInput!) {
        createRescueRequest(input: $input) {
          id
          description
          status
        }
      }
    `;
    
    const result = await server.executeOperation({
      query: CREATE_RESCUE,
      variables: {
        input: {
          description: 'Snake in house',
          latitude: 27.7172,
          longitude: 85.3240,
          urgencyLevel: 'HIGH',
        },
      },
    });
    
    expect(result.body.kind).toBe('single');
    expect(result.body.singleResult.data?.createRescueRequest).toHaveProperty('id');
  });
});
```

---

## 14. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
1. ✅ Setup Nx monorepo structure
2. ✅ Configure TypeScript strict mode
3. ✅ Setup Prisma + PostgreSQL
4. ✅ Create GraphQL contracts library
5. ✅ Setup GraphQL Code Generator
6. ✅ Configure Apollo Server (backend)
7. ✅ Configure Apollo Client (frontend)

### Phase 2: Authentication & Authorization (Week 3)
8. Implement JWT authentication
9. Create auth GraphQL schema
10. Build login/register resolvers
11. Setup Better Auth integration
12. Create auth feature hooks
13. Build login/register UI components
14. Implement protected routes

### Phase 3: Core Rescue Module (Weeks 4-5)
15. Design rescue GraphQL schema
16. Implement rescue repository
17. Create rescue use cases
18. Build rescue resolvers
19. Generate rescue Apollo hooks
20. Create rescue feature hooks
21. Build rescue UI components
22. Implement rescue forms
23. Add real-time rescue updates (subscriptions)

### Phase 4: Volunteer Module (Week 6)
24. Design volunteer GraphQL schema
25. Implement volunteer management
26. Build volunteer assignment logic
27. Create volunteer feature hooks
28. Build volunteer UI components

### Phase 5: Snake Identification AI (Week 7)
29. Design AI GraphQL schema
30. Integrate AI/ML service
31. Implement snake identification
32. Build AI feature hooks
33. Create snake identification UI
34. Add image upload support

### Phase 6: Payments & Donations (Week 8)
35. Design payment GraphQL schema
36. Integrate Stripe
37. Integrate Khalti
38. Integrate eSewa
39. Build payment feature hooks
40. Create donation UI components

### Phase 7: Notifications & Real-time (Week 9)
41. Design notification GraphQL schema
42. Implement push notifications
43. Setup WebSocket subscriptions
44. Build notification feature hooks
45. Create notification UI

### Phase 8: Admin Dashboard (Week 10)
46. Design admin GraphQL schema
47. Implement admin resolvers
48. Build admin feature hooks
49. Create admin UI components
50. Add analytics dashboard

### Phase 9: Testing & QA (Weeks 11-12)
51. Write unit tests (80%+ coverage)
52. Write integration tests
53. Implement E2E tests (Playwright)
54. Performance testing
55. Security audit

### Phase 10: Deployment (Week 13)
56. Setup CI/CD pipeline
57. Configure production environment
58. Deploy backend (AWS)
59. Deploy frontend (Vercel)
60. Configure monitoring & logging

---

## 15. Success Criteria

✅ **Type Safety:** 100% TypeScript with strict mode, no `any` types  
✅ **Code Generation:** All GraphQL types, hooks, and operations auto-generated  
✅ **Feature Hooks:** No direct calls to generated hooks from UI components  
✅ **Clean Architecture:** Clear separation of concerns (Infrastructure → Application → Domain)  
✅ **Modular GraphQL:** Domain-based schema organization  
✅ **Real-time:** WebSocket subscriptions for live updates  
✅ **File Upload:** Support for image/video uploads via GraphQL  
✅ **Authentication:** JWT-based auth with refresh tokens  
✅ **Authorization:** RBAC with role-based access control  
✅ **Pagination:** Relay cursor pagination for all lists  
✅ **Caching:** Intelligent Apollo cache with optimistic updates  
✅ **Error Handling:** Global error boundaries and Apollo error link  
✅ **Testing:** 80%+ test coverage  
✅ **Performance:** < 2s page load, < 200ms API response  
✅ **Security:** Input validation, rate limiting, SQL injection prevention  
✅ **Nx Boundaries:** Enforced library dependency rules  
✅ **Documentation:** Complete API docs and architecture diagrams

---

## 16. Appendix

### 16.1 Key Technologies

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Monorepo | Nx | Latest | Workspace management |
| Frontend Framework | Next.js | 16 | React framework |
| Frontend Library | React | 19 | UI library |
| GraphQL Client | Apollo Client | 3+ | State management |
| GraphQL Server | Apollo Server | 5 | API server |
| Backend Framework | Express | 5 | HTTP server |
| ORM | Prisma | Latest | Database access |
| Database | PostgreSQL | 16 | Primary database |
| Cache | Redis | 7 | Caching layer |
| Type Generation | GraphQL Codegen | Latest | Code generation |
| Language | TypeScript | 5+ | Type safety |
| Testing | Jest + Playwright | Latest | Testing |
| File Upload | Apollo Upload | Latest | File handling |

### 16.2 References

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Nx Monorepo](https://nx.dev/)
- [Next.js 16 App Router](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**END OF DESIGN DOCUMENT**
