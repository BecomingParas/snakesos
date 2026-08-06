# 🎨 Frontend Libraries

## Overview

This directory contains all frontend libraries for the Snake Rescue Platform, organized as an enterprise-grade, modular architecture.

## 📁 Structure

```
libs/frontend/
├── core/          # Apollo Client, providers, layouts
├── features/      # Feature modules (snake, rescue, etc.)
└── ui/            # shadcn/ui component library
```

## 🚀 Quick Start

### 1. Generate GraphQL Types
```bash
yarn graphql:codegen
```

### 2. Import in Your App
```typescript
// In app/layout.tsx
import { RootProvider } from '@snake-rescue/frontend-core';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
```

### 3. Use Features in Pages
```typescript
// In app/dashboard/snakes/page.tsx
'use client';

import { DashboardLayout } from '@snake-rescue/frontend-core';
import { useSnakes, SnakeList } from '@snake-rescue/frontend-features';

export default function SnakesPage() {
  const { snakes, loading, hasNextPage, fetchMore } = useSnakes();

  return (
    <DashboardLayout>
      <h1>Snake Species</h1>
      <SnakeList
        snakes={snakes}
        loading={loading}
        hasMore={hasNextPage}
        onLoadMore={fetchMore}
      />
    </DashboardLayout>
  );
}
```

## 📚 Libraries

### `@snake-rescue/frontend-core`

Core infrastructure for the frontend:

**Exports:**
- Apollo Client with full link chain
- Providers (Apollo, Theme, Toast, Root)
- Layouts (Dashboard, Auth, Landing)
- Hooks (useToast)
- Config (environment variables)

**Usage:**
```typescript
import {
  RootProvider,
  DashboardLayout,
  AuthLayout,
  LandingLayout,
  useToast,
  getApolloClient,
} from '@snake-rescue/frontend-core';
```

### `@snake-rescue/frontend-features`

Feature modules with hooks and components:

**Available Features:**
- `snake` - Snake species management
- `rescue` - Rescue request handling
- More coming: auth, volunteer, dashboard, notification, payment

**Usage:**
```typescript
import {
  // Snake
  useSnakes,
  useSnake,
  useCreateSnake,
  useUpdateSnake,
  useDeleteSnake,
  SnakeCard,
  SnakeList,
  
  // Rescue
  useRescues,
  useRescue,
  useUpdateRescueStatus,
  RescueCard,
} from '@snake-rescue/frontend-features';
```

### `@snake-rescue/ui`

shadcn/ui component library:

**Available Components:**
- Layout: Card, Sheet, Dialog, Drawer, Tabs
- Forms: Button, Input, Select, Checkbox, Switch
- Data: Table, Badge, Avatar, Skeleton
- Feedback: Toast, Alert, Progress
- And 50+ more components

**Usage:**
```typescript
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Select,
  Badge,
  Avatar,
  Dialog,
  Tabs,
} from '@snake-rescue/ui';
```

## 🎯 Architecture Patterns

### Hook Wrapper Pattern

**Never use generated hooks directly!**

✅ **Correct:**
```typescript
// Create wrapper hook
export const useSnakes = () => {
  const { toast } = useToast();
  const { data, loading, error } = useSnakesQuery();

  useEffect(() => {
    if (error) toast.error('Failed to load');
  }, [error, toast]);

  return {
    snakes: data?.snakes?.edges?.map(e => e.node) || [],
    loading,
  };
};

// Use in component
function Component() {
  const { snakes, loading } = useSnakes();
  // ...
}
```

❌ **Wrong:**
```typescript
function Component() {
  const { data } = useSnakesQuery(); // Don't use directly!
  // ...
}
```

### Component Pattern

**Keep components presentational!**

✅ **Correct:**
```typescript
interface SnakeCardProps {
  snake: Snake;
  onEdit: () => void;
}

function SnakeCard({ snake, onEdit }: SnakeCardProps) {
  return (
    <Card>
      <CardTitle>{snake.name}</CardTitle>
      <Button onClick={onEdit}>Edit</Button>
    </Card>
  );
}
```

❌ **Wrong:**
```typescript
function SnakeCard({ id }) {
  const { data } = useSnakeQuery({ variables: { id } }); // No GraphQL in components!
  // ...
}
```

## 🏗️ Creating New Features

### 1. Create Feature Folder
```
libs/frontend/features/src/[feature]/
├── graphql/
│   ├── fragments.graphql
│   ├── queries.graphql
│   ├── mutations.graphql
│   └── subscriptions.graphql
├── hooks/
│   ├── use-[feature].ts
│   └── index.ts
├── components/
│   ├── [Feature]Card.tsx
│   └── index.ts
└── index.ts
```

### 2. Write GraphQL Operations
```graphql
# fragments.graphql
fragment VolunteerFields on Volunteer {
  id
  name
  email
}

# queries.graphql
query Volunteers($first: Int) {
  volunteers(first: $first) {
    edges {
      node {
        ...VolunteerFields
      }
    }
  }
}
```

### 3. Generate Types
```bash
yarn graphql:codegen
```

### 4. Create Wrapper Hook
```typescript
export const useVolunteers = () => {
  const { toast } = useToast();
  const { data, loading, error } = useVolunteersQuery();

  useEffect(() => {
    if (error) toast.error('Failed to load');
  }, [error, toast]);

  return {
    volunteers: data?.volunteers?.edges?.map(e => e.node) || [],
    loading,
  };
};
```

### 5. Create Component
```typescript
export interface VolunteerCardProps {
  volunteer: Volunteer;
}

export const VolunteerCard = ({ volunteer }: VolunteerCardProps) => {
  return <Card>{volunteer.name}</Card>;
};
```

### 6. Export from Feature
```typescript
// index.ts
export * from './hooks';
export * from './components';
```

## 📖 Documentation

- **[APOLLO_CLIENT_ARCHITECTURE.md](../../APOLLO_CLIENT_ARCHITECTURE.md)** - Complete architecture
- **[FRONTEND_IMPLEMENTATION_GUIDE.md](../../FRONTEND_IMPLEMENTATION_GUIDE.md)** - Step-by-step guide
- **[FRONTEND_COMPLETE_SUMMARY.md](../../FRONTEND_COMPLETE_SUMMARY.md)** - Implementation summary

## 🧪 Testing

```typescript
import { renderHook } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useSnakes } from './use-snakes';

test('loads snakes', async () => {
  const { result } = renderHook(() => useSnakes(), {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    ),
  });

  await waitFor(() => {
    expect(result.current.snakes).toHaveLength(3);
  });
});
```

## 🎨 Styling

All components use Tailwind CSS:

```typescript
<div className="flex items-center gap-4 p-6 bg-card rounded-lg">
  <Badge variant="destructive">Urgent</Badge>
</div>
```

Dark mode is automatically supported via `next-themes`.

## 🚀 Available Scripts

```bash
# Generate GraphQL types
yarn graphql:codegen

# Watch mode for codegen
yarn graphql:codegen:watch

# Build all libraries
nx build frontend-core
nx build frontend-features
nx build ui

# Lint
nx lint frontend-core
nx lint frontend-features
nx lint ui

# Test
nx test frontend-core
nx test frontend-features
nx test ui
```

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=ws://localhost:4000/graphql
NEXT_PUBLIC_APP_NAME=Snake Rescue
NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS=true
```

### GraphQL Code Generator

Configuration in `libs/contracts/codegen.yml`:
- Generates types from GraphQL schema
- Generates React hooks from operations
- Outputs to `libs/contracts/src/generated/`

## 📦 Dependencies

### Core Dependencies
- `@apollo/client` - GraphQL client
- `graphql` - GraphQL core
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### UI Dependencies
- `@radix-ui/*` - Headless components
- `tailwindcss` - Utility-first CSS
- `framer-motion` - Animations
- `lucide-react` - Icons
- `next-themes` - Dark mode
- `sonner` - Toasts

### State Management
- Apollo Cache for server state
- Zustand for client state

## 🆘 Troubleshooting

### Types Not Generated
```bash
rm -rf libs/contracts/src/generated
yarn graphql:codegen
```

### Apollo Not Working
1. Check environment variables
2. Ensure backend is running
3. Check CORS configuration
4. Verify tokens in Network tab

### Build Errors
```bash
rm -rf .next node_modules/.cache
yarn build
```

## 🎓 Learning Resources

- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎉 Ready to Build!

You have everything you need to build production-grade features. Follow the patterns in the snake and rescue features, and check the documentation for detailed guides.

**Happy coding! 🚀**
