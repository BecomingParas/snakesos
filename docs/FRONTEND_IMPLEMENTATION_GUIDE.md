# Frontend Implementation Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Generate GraphQL Types

```bash
yarn graphql:codegen
```

This will generate:
- `libs/contracts/src/generated/graphql-operations.ts` - Frontend types and hooks
- `libs/contracts/src/generated/resolvers-types.ts` - Backend resolver types
- `libs/contracts/src/generated/fragment-matcher.ts` - Apollo cache fragment matcher
- `libs/contracts/src/generated/schema.graphql` - Complete schema
- `libs/contracts/src/generated/schema.json` - Schema introspection

### 3. Update Apps Frontend to Use New Architecture

#### Update `apps/frontend/src/app/layout.tsx`

```typescript
import { RootProvider } from '@snake-rescue/frontend-core';
import '@snake-rescue/ui/styles.css'; // or your global CSS
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
```

#### Create Dashboard Page `apps/frontend/src/app/dashboard/page.tsx`

```typescript
'use client';

import { DashboardLayout } from '@snake-rescue/frontend-core';
import { useRescues } from '@snake-rescue/frontend-features';
import { RescueCard } from '@snake-rescue/frontend-features';

export default function DashboardPage() {
  const { rescues, loading, hasNextPage, fetchMore } = useRescues({
    filters: { status: 'PENDING' },
    limit: 10,
  });

  return (
    <DashboardLayout user={{ name: 'John Doe', email: 'john@example.com' }}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rescues.map((rescue) => (
            <RescueCard key={rescue.id} rescue={rescue} />
          ))}
        </div>

        {hasNextPage && (
          <button onClick={fetchMore}>Load More</button>
        )}
      </div>
    </DashboardLayout>
  );
}
```

#### Create Snakes Page `apps/frontend/src/app/dashboard/snakes/page.tsx`

```typescript
'use client';

import { DashboardLayout } from '@snake-rescue/frontend-core';
import { useSnakes, SnakeList } from '@snake-rescue/frontend-features';
import { useRouter } from 'next/navigation';

export default function SnakesPage() {
  const router = useRouter();
  const { snakes, loading, hasNextPage, fetchMore } = useSnakes({
    limit: 12,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Snake Species</h1>
          <button onClick={() => router.push('/dashboard/snakes/new')}>
            Add New Species
          </button>
        </div>

        <SnakeList
          snakes={snakes}
          loading={loading}
          hasMore={hasNextPage}
          onLoadMore={fetchMore}
          onView={(id) => router.push(`/dashboard/snakes/${id}`)}
        />
      </div>
    </DashboardLayout>
  );
}
```

#### Create Landing Page `apps/frontend/src/app/page.tsx`

```typescript
import { LandingLayout } from '@snake-rescue/frontend-core';
import { Button } from '@snake-rescue/ui';
import Link from 'next/link';

export default function HomePage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Saving Snakes, <span className="text-primary">Protecting People</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional snake rescue services available 24/7. Our trained volunteers
            ensure safe removal and relocation of snakes.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/register">Request Rescue</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/volunteer">Become a Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Add feature cards */}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
```

## 📁 Project Structure

```
apps/frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Landing page
│   │   ├── dashboard/         # Dashboard routes
│   │   │   ├── page.tsx
│   │   │   ├── rescues/
│   │   │   ├── snakes/
│   │   │   ├── volunteers/
│   │   │   └── settings/
│   │   ├── auth/              # Auth routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── (public)/          # Public routes
│   │       ├── about/
│   │       ├── contact/
│   │       └── snakes/
│   └── components/            # App-specific components
│
libs/frontend/
├── core/                      # Apollo Client & Core utilities
│   └── src/
│       ├── apollo/
│       ├── providers/
│       ├── hooks/
│       ├── layouts/
│       └── config/
├── features/                  # Feature modules
│   └── src/
│       ├── snake/
│       ├── rescue/
│       ├── auth/
│       ├── volunteer/
│       └── dashboard/
└── ui/                        # shadcn/ui components
    └── src/lib/
```

## 🎯 Creating New Features

### Step 1: Create GraphQL Operations

Create feature folder in `libs/frontend/features/src/[feature-name]/`

```
feature-name/
├── graphql/
│   ├── fragments.graphql
│   ├── queries.graphql
│   ├── mutations.graphql
│   └── subscriptions.graphql
├── hooks/
│   ├── use-[feature].ts
│   ├── use-[features].ts
│   └── index.ts
├── components/
│   ├── [Feature]Card.tsx
│   ├── [Feature]List.tsx
│   └── index.ts
└── index.ts
```

### Step 2: Write GraphQL Operations

**fragments.graphql**
```graphql
fragment VolunteerBasicFields on Volunteer {
  id
  name
  phone
  email
  status
}
```

**queries.graphql**
```graphql
query Volunteers($first: Int, $after: String) {
  volunteers(first: $first, after: $after) {
    edges {
      node {
        ...VolunteerBasicFields
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

**mutations.graphql**
```graphql
mutation CreateVolunteer($input: CreateVolunteerInput!) {
  createVolunteer(input: $input) {
    success
    message
    volunteer {
      ...VolunteerBasicFields
    }
  }
}
```

### Step 3: Generate Types

```bash
yarn graphql:codegen
```

This generates hooks like:
- `useVolunteersQuery`
- `useCreateVolunteerMutation`

### Step 4: Create Wrapper Hooks

**hooks/use-volunteers.ts**
```typescript
import { useEffect, useCallback } from 'react';
import { useVolunteersQuery } from '@snake-rescue/contracts';
import { useToast } from '@snake-rescue/frontend-core';

export const useVolunteers = (options?: { limit?: number }) => {
  const { toast } = useToast();
  const { limit = 20 } = options || {};

  const { data, loading, error, fetchMore, refetch } = useVolunteersQuery({
    variables: { first: limit },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load volunteers', {
        description: error.message,
      });
    }
  }, [error, toast]);

  return {
    volunteers: data?.volunteers?.edges?.map((e) => e.node) || [],
    loading,
    error,
    hasNextPage: data?.volunteers?.pageInfo?.hasNextPage || false,
    fetchMore: useCallback(async () => {
      if (!data?.volunteers?.pageInfo?.hasNextPage) return;
      await fetchMore({
        variables: { after: data.volunteers.pageInfo.endCursor },
      });
    }, [data, fetchMore]),
    refetch,
  };
};
```

### Step 5: Create Presentational Components

**components/VolunteerCard.tsx**
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@snake-rescue/ui';

export interface VolunteerCardProps {
  volunteer: {
    id: string;
    name: string;
    phone: string;
    email: string;
    status: string;
  };
  onView?: (id: string) => void;
}

export const VolunteerCard = ({ volunteer, onView }: VolunteerCardProps) => {
  return (
    <Card onClick={() => onView?.(volunteer.id)}>
      <CardHeader>
        <CardTitle>{volunteer.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{volunteer.email}</p>
        <p>{volunteer.phone}</p>
      </CardContent>
    </Card>
  );
};
```

### Step 6: Export from Feature Module

**index.ts**
```typescript
export * from './hooks';
export * from './components';
```

### Step 7: Use in Pages

```typescript
'use client';

import { useVolunteers, VolunteerCard } from '@snake-rescue/frontend-features';

export default function VolunteersPage() {
  const { volunteers, loading } = useVolunteers();

  return (
    <div className="grid grid-cols-3 gap-4">
      {volunteers.map((v) => (
        <VolunteerCard key={v.id} volunteer={v} />
      ))}
    </div>
  );
}
```

## 🔄 State Management Strategy

### Server State (Apollo Cache)
- All GraphQL data
- User data
- Rescue requests
- Snake species
- Notifications

**Access via hooks:**
```typescript
const { rescues } = useRescues();
const { snake } = useSnake({ id });
```

### Client State (Zustand)
- UI state (modals, drawers)
- Form state
- Filters & preferences
- Temporary data

**Create store:**
```typescript
// libs/frontend/core/src/stores/modal-store.ts
import { create } from 'zustand';

interface ModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
```

**Use in components:**
```typescript
const { isOpen, open, close } = useModalStore();
```

## 🎨 Styling Guidelines

### Tailwind CSS
All components use Tailwind CSS classes:

```typescript
<div className="flex items-center gap-4 p-6 bg-card rounded-lg shadow-sm">
  <Badge variant="destructive">Urgent</Badge>
</div>
```

### Dark Mode
Automatically supported via `next-themes`:

```typescript
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
setTheme('dark');
```

### Component Variants
Use `class-variance-authority` for variant styles:

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva('button-base', {
  variants: {
    variant: {
      default: 'bg-primary text-white',
      destructive: 'bg-red-500 text-white',
    },
  },
});
```

## 🧪 Testing

### Unit Tests for Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useSnakes } from './use-snakes';

const mocks = [
  {
    request: { query: SNAKES_QUERY },
    result: { data: { snakes: { edges: [...] } } },
  },
];

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

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { SnakeCard } from './SnakeCard';

test('renders snake card', () => {
  const snake = {
    id: '1',
    commonName: 'King Cobra',
    scientificName: 'Ophiophagus hannah',
    venomous: true,
  };

  render(<SnakeCard snake={snake} />);
  
  expect(screen.getByText('King Cobra')).toBeInTheDocument();
  expect(screen.getByText('Venomous')).toBeInTheDocument();
});
```

## 🚀 Deployment

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=wss://api.example.com/graphql
NEXT_PUBLIC_APP_NAME=Snake Rescue
NEXT_PUBLIC_APP_URL=https://snakerescue.com
NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS=true
```

### Build

```bash
# Build all
yarn build

# Build frontend only
yarn build:frontend
```

### Run

```bash
# Development
yarn dev

# Production
yarn start
```

## 📖 Additional Resources

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🆘 Troubleshooting

### GraphQL Types Not Generated

```bash
# Clean and regenerate
rm -rf libs/contracts/src/generated
yarn graphql:codegen
```

### Apollo Client Not Working

Check:
1. Environment variables are set
2. GraphQL server is running
3. CORS is configured on server
4. Tokens are being attached (check Network tab)

### Build Errors

```bash
# Clear caches
rm -rf .next
rm -rf node_modules/.cache
yarn build
```

---

**Happy Coding! 🎉**
