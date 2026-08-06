# Apollo Client Frontend Architecture

## 📋 Overview

This document describes the complete Apollo Client architecture for the Snake Rescue Platform. The frontend follows enterprise-grade patterns used by companies like Vercel, Shopify, and Linear.

## 🏗️ Architecture

```
libs/frontend/
├── core/                    # Core Apollo Client setup
│   ├── apollo/
│   │   ├── links/          # Apollo Link chain
│   │   │   ├── auth-link.ts        # JWT authentication
│   │   │   ├── error-link.ts       # Error handling
│   │   │   ├── retry-link.ts       # Retry logic
│   │   │   ├── upload-link.ts      # File uploads
│   │   │   ├── subscription-link.ts # WebSocket
│   │   │   ├── http-link.ts        # HTTP queries
│   │   │   └── split-link.ts       # Route subscriptions
│   │   ├── cache.ts        # InMemoryCache configuration
│   │   ├── client.ts       # Apollo Client instance
│   │   └── provider.tsx    # React Provider
│   ├── providers/          # App providers
│   │   ├── theme-provider.tsx
│   │   ├── toast-provider.tsx
│   │   └── root-provider.tsx
│   ├── hooks/              # Core hooks
│   │   └── use-toast.ts
│   └── config/             # Configuration
│       └── env.ts
├── features/               # Feature modules
│   ├── auth/
│   ├── snake/
│   ├── rescue/
│   ├── volunteer/
│   ├── dashboard/
│   ├── notification/
│   ├── payment/
│   └── ai/
└── ui/                     # UI components (shadcn/ui)
```

## 🔗 Apollo Link Chain

The Apollo Client is configured with a sophisticated link chain:

### 1. **Auth Link**
- Automatically attaches JWT tokens to requests
- Handles token refresh on 401 errors
- Stores tokens in localStorage
- Queues requests during token refresh

### 2. **Error Link**
- Centralized error handling
- Categorizes errors by type
- Custom error handlers
- Logging in development

### 3. **Retry Link**
- Automatically retries failed requests
- Exponential backoff strategy
- Skips retry for auth/validation errors
- Configurable max attempts

### 4. **Upload Link**
- Enables file uploads via GraphQL
- Multipart request support
- Progress tracking

### 5. **Subscription Link (WebSocket)**
- Real-time subscriptions
- Automatic reconnection
- Connection state management
- JWT authentication for WebSocket

### 6. **Split Link**
- Routes subscriptions to WebSocket
- Routes queries/mutations to HTTP

### 7. **HTTP Link**
- Standard HTTP queries and mutations
- CORS support
- Credential management

## 💾 Apollo Cache

### Features
- **Entity Normalization**: Each entity identified by `id`
- **Relay-Style Pagination**: For lists (rescues, volunteers, etc.)
- **Offset Pagination**: For activity logs
- **Custom Merge Functions**: Smart data merging
- **Type Policies**: Per-type cache behaviors
- **Cache Persistence**: LocalStorage persistence (10MB limit)

### Type Policies

```typescript
const typePolicies = {
  Query: {
    fields: {
      rescues: relayStylePagination(),
      volunteers: relayStylePagination(),
      snakes: relayStylePagination(),
      notifications: relayStylePagination(),
      // ...
    }
  },
  User: {
    keyFields: ['id'],
    fields: {
      profile: { merge: true }
    }
  },
  RescueRequest: {
    keyFields: ['id'],
    fields: {
      timeline: { /* custom merge */ }
    }
  },
  // ...
};
```

## 🎯 Feature Architecture Pattern

Every feature follows this structure:

```
features/snake/
├── components/           # Presentational components
│   ├── SnakeCard.tsx
│   ├── SnakeList.tsx
│   └── SnakeForm.tsx
├── hooks/               # Business logic hooks
│   ├── useSnakes.ts
│   ├── useSnake.ts
│   ├── useCreateSnake.ts
│   ├── useUpdateSnake.ts
│   └── useDeleteSnake.ts
├── graphql/             # GraphQL operations
│   ├── queries.graphql
│   ├── mutations.graphql
│   ├── subscriptions.graphql
│   └── fragments.graphql
├── types/               # TypeScript types
│   └── index.ts
├── utils/               # Utilities
│   └── helpers.ts
└── index.ts             # Public API
```

## 🪝 Hook Wrapper Pattern

**Never use generated hooks directly in components!**

### Bad ❌
```typescript
function SnakeList() {
  const { data, loading, error } = useSnakesQuery();
  // ...
}
```

### Good ✅
```typescript
// Hook wrapper
export function useSnakes(options?: SnakesOptions) {
  const { toast } = useToast();
  const { data, loading, error, refetch } = useSnakesQuery({
    variables: options?.variables,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load snakes');
    }
  }, [error, toast]);

  return {
    snakes: data?.snakes?.nodes || [],
    loading,
    error,
    refetch,
    hasMore: data?.snakes?.pageInfo?.hasNextPage,
  };
}

// Component
function SnakeList() {
  const { snakes, loading, hasMore } = useSnakes();
  // ...
}
```

### Hook Responsibilities
- ✅ Error handling & toasts
- ✅ Loading states
- ✅ Cache updates
- ✅ Optimistic updates
- ✅ Pagination logic
- ✅ Data transformations
- ✅ Business logic

## 📡 Real-Time Subscriptions

```typescript
// Subscription hook
export function useRescueUpdates(rescueId: string) {
  const { data, loading } = useRescueUpdatedSubscription({
    variables: { rescueId },
  });

  return {
    rescue: data?.rescueUpdated,
    loading,
  };
}

// Component
function RescueDetails({ id }: Props) {
  const { rescue } = useRescue(id);
  const { rescue: liveRescue } = useRescueUpdates(id);
  
  const currentRescue = liveRescue || rescue;
  // ...
}
```

## 🔄 Optimistic Updates

```typescript
export function useUpdateRescueStatus() {
  const { toast } = useToast();
  const [updateStatus, { loading }] = useUpdateRescueStatusMutation({
    optimisticResponse: (vars) => ({
      __typename: 'Mutation',
      updateRescueStatus: {
        __typename: 'RescueRequest',
        id: vars.id,
        status: vars.status,
        updatedAt: new Date().toISOString(),
      },
    }),
    update: (cache, { data }) => {
      if (data?.updateRescueStatus) {
        cache.modify({
          id: cache.identify(data.updateRescueStatus),
          fields: {
            status: () => data.updateRescueStatus.status,
          },
        });
      }
    },
    onCompleted: () => {
      toast.success('Status updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  return { updateStatus, loading };
}
```

## 🎨 UI Component Pattern

**Components must be presentational only!**

### Bad ❌
```typescript
function SnakeCard({ id }: Props) {
  const { data } = useSnakeQuery({ variables: { id } });
  // Business logic in component
}
```

### Good ✅
```typescript
// Component (presentational)
interface SnakeCardProps {
  snake: Snake;
  onEdit: () => void;
  onDelete: () => void;
}

function SnakeCard({ snake, onEdit, onDelete }: SnakeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{snake.commonName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{snake.scientificName}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onEdit}>Edit</Button>
        <Button variant="destructive" onClick={onDelete}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

// Container (business logic)
function SnakeCardContainer({ id }: { id: string }) {
  const { snake } = useSnake(id);
  const { updateSnake } = useUpdateSnake();
  const { deleteSnake } = useDeleteSnake();

  if (!snake) return null;

  return (
    <SnakeCard
      snake={snake}
      onEdit={() => updateSnake(snake)}
      onDelete={() => deleteSnake(id)}
    />
  );
}
```

## 🔐 Authentication Flow

1. User logs in → receives `accessToken` and `refreshToken`
2. Tokens stored in memory + localStorage
3. Auth link attaches token to every request
4. On 401 error → Auth error link triggers
5. Refresh token flow executes
6. Failed requests retry with new token
7. On refresh failure → redirect to login

```typescript
// Login
const { login } = useLogin();
await login({ email, password });

// Logout
const { logout } = useLogout();
await logout();

// Current user
const { user, loading } = useCurrentUser();
```

## 📦 State Management

### Server State (Apollo Cache)
- GraphQL data
- User data
- Rescue requests
- Volunteer data
- Notifications

### Client State (Zustand)
- UI state (modals, drawers)
- Form state (multi-step forms)
- Filters & preferences
- Temporary data

```typescript
// Server state - use Apollo
const { rescues } = useRescues();

// Client state - use Zustand
const isModalOpen = useModalStore((s) => s.isOpen);
```

## 🚀 Performance Optimizations

1. **Cache-First Policy**: Read from cache before network
2. **Pagination**: Relay-style cursor pagination
3. **Lazy Loading**: Load data on demand
4. **Debouncing**: Search inputs debounced
5. **Code Splitting**: Feature-based code splitting
6. **Memoization**: React.memo for expensive renders
7. **Virtual Lists**: For large lists (react-window)
8. **Image Optimization**: Next.js Image component

## 🧪 Testing Strategy

```typescript
// Mock Apollo Provider
import { MockedProvider } from '@apollo/client/testing';

const mocks = [
  {
    request: {
      query: SNAKES_QUERY,
    },
    result: {
      data: {
        snakes: { nodes: [...] },
      },
    },
  },
];

test('renders snakes', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <SnakeList />
    </MockedProvider>
  );
  // ...
});
```

## 📝 GraphQL Code Generator

### Configuration
```yaml
schema: './src/lib/graphql/**/*.graphql'
documents: 
  - '../apps/frontend/src/**/*.graphql'
  - '../libs/frontend/features/src/**/*.graphql'
generates:
  ./src/generated/graphql-operations.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
```

### Usage
```bash
# Generate types
yarn graphql:codegen

# Watch mode
yarn graphql:codegen:watch
```

## 🎯 Best Practices

### DO ✅
- Use wrapper hooks around generated hooks
- Keep components presentational
- Handle errors with toasts
- Use optimistic updates
- Implement loading states
- Use fragments for reusability
- Type everything with TypeScript
- Follow naming conventions
- Write tests for hooks
- Document complex logic

### DON'T ❌
- Use generated hooks directly in components
- Put business logic in components
- Ignore loading states
- Ignore errors
- Use fetch() or axios()
- Duplicate Apollo cache in other state
- Skip TypeScript types
- Mix concerns
- Forget error boundaries
- Leave console.logs

## 🌐 Environment Variables

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=ws://localhost:4000/graphql
NEXT_PUBLIC_APP_NAME=Snake Rescue
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## 📚 References

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🎓 Training Resources

For team members new to this architecture:
1. Read this document fully
2. Review example features in `libs/frontend/features`
3. Study the hook wrapper pattern
4. Practice with small features
5. Get PR reviews from senior developers

---

**Built with ❤️ for Snake Rescue Platform**
