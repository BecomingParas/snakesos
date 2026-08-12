# SnakeSOS: Vite → Next.js App Router Migration Guide

## ⚠️ CRITICAL: Read First

This migration will:
- Replace your entire routing system
- Require 50+ file changes
- Break the app temporarily during migration
- Take 2-3 hours minimum to complete

**Before starting:**
1. ✅ Commit all current changes: `git add . && git commit -m "Pre Next.js migration checkpoint"`
2. ✅ Create a backup branch: `git checkout -b backup-vite-version`
3. ✅ Return to main: `git checkout main`
4. ✅ Stop your dev server

---

## Phase 1: Install Next.js Dependencies

```bash
cd apps/frontend

# Remove Vite/TanStack Router
npm uninstall vite @vitejs/plugin-react vite-tsconfig-paths @tanstack/react-router @tanstack/react-router-devtools @tanstack/router-vite-plugin @tanstack/react-query

# Install Next.js
npm install next@latest

# Install React 18 (Next.js doesn't support React 19 yet)
npm install react@^18.3.1 react-dom@^18.3.1

# Update types
npm install --save-dev @types/react@^18.3.12 @types/react-dom@^18.3.1

# Install ESLint for Next.js
npm install --save-dev eslint-config-next
```

---

## Phase 2: Update Configuration Files

### 2.1 Update `package.json`

Already done - scripts updated to:
```json
{
  "scripts": {
    "dev": "next dev -p 4200",
    "build": "next build",
    "start": "next start -p 4200",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

### 2.2 Create `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@snake-rescue/contracts', '@snake-rescue/shared'],
  images: {
    domains: [],
  },
  env: {
    NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  },
};

export default nextConfig;
```

### 2.3 Update `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2.4 Update `.env.local`

Change from `VITE_` to `NEXT_PUBLIC_`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_AUTH_URL=http://localhost:4000/api/auth
NEXT_PUBLIC_FRONTEND_URL=http://localhost:4200
```

### 2.5 Update `tailwind.config.cjs` → `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    // ... keep existing theme config
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

---

## Phase 3: Create Next.js App Directory Structure

```bash
# Create app directory
mkdir -p src/app

# Create route groups
mkdir -p src/app/\(public\)
mkdir -p src/app/\(auth\)
mkdir -p src/app/dashboard

# Create auth routes
mkdir -p src/app/\(auth\)/login
mkdir -p src/app/\(auth\)/signup
mkdir -p src/app/\(auth\)/forgot-password
mkdir -p src/app/\(auth\)/reset-password
mkdir -p src/app/\(auth\)/verify-email
```

---

## Phase 4: Create Root Layout

### 4.1 `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles.css'
import { Providers } from '@/components/providers/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SnakeSOS - Wildlife Rescue Platform',
  description: 'Butwal Snake Rescue - Saving lives, one call at a time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### 4.2 `src/components/providers/providers.tsx`

```tsx
'use client'

import { ApolloProvider } from '@apollo/client'
import { Toaster } from '@/components/ui/sonner'
import { createApolloClient } from '@/lib/apollo/client'

const apolloClient = createApolloClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
      <Toaster />
    </ApolloProvider>
  )
}
```

---

## Phase 5: Create Auth Layout (No Header/Footer)

### 5.1 `src/app/(auth)/layout.tsx`

```tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

---

## Phase 6: Migrate Signup Page

### 6.1 `src/app/(auth)/signup/page.tsx`

```tsx
import { SignupForm } from '@/components/auth/signup-form'
import { TwoColumnAuthLayout } from '@/components/auth/two-column-layout'

export const metadata = {
  title: 'Sign Up - SnakeSOS',
  description: 'Create your SnakeSOS account',
}

export default function SignupPage() {
  return (
    <TwoColumnAuthLayout
      title="Create Account"
      subtitle="Join our wildlife rescue community today"
    >
      <SignupForm />
    </TwoColumnAuthLayout>
  )
}
```

### 6.2 `src/components/auth/signup-form.tsx`

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSignup } from '@/hooks/auth'
import { signupSchema, type SignupFormData } from '@/schemas/auth'
import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { getUserFriendlyErrorMessage } from '@/lib/graphql'

export function SignupForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup')
  const { signup, loading: isSubmitting } = useSignup()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema as any),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      toast.success('Account created successfully!', {
        description: 'Welcome to SnakeSOS',
      })
      
      router.push(`/dashboard/${result.user.role.toLowerCase()}`)
    } catch (error: unknown) {
      // Handle duplicate email
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'CONFLICT' &&
        'message' in error &&
        typeof error.message === 'string' &&
        error.message.toLowerCase().includes('email')
      ) {
        setError('email', {
          type: 'server',
          message: 'This email is already registered',
        })
        return
      }
      
      toast.error('Registration failed', {
        description: getUserFriendlyErrorMessage(error),
      })
    }
  }

  return (
    <>
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
        <button
          type="button"
          onClick={() => {
            setActiveTab('signin')
            router.push('/login')
          }}
          className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'signin'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('signup')}
          className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'signup'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name" className="text-slate-700 font-medium text-sm">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`h-9 bg-white border-slate-300 focus:bg-white text-sm ${
              errors.name ? 'border-red-500' : ''
            }`}
            {...register('name')}
          />
          {errors.name?.message && (
            <p id="name-error" role="alert" className="text-xs text-red-600 mt-0.5">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`h-9 bg-white border-slate-300 focus:bg-white text-sm ${
              errors.email ? 'border-red-500' : ''
            }`}
            {...register('email')}
          />
          {errors.email?.message && (
            <p id="email-error" role="alert" className="text-xs text-red-600 mt-0.5">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
            Password
          </Label>
          <PasswordInput
            id="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={`h-9 bg-white border-slate-300 focus:bg-white text-sm ${
              errors.password ? 'border-red-500' : ''
            }`}
            {...register('password')}
          />
          {errors.password?.message && (
            <p id="password-error" role="alert" className="text-xs text-red-600 mt-0.5">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-slate-700 font-medium text-sm">
            Confirm Password
          </Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            className={`h-9 bg-white border-slate-300 focus:bg-white text-sm ${
              errors.confirmPassword ? 'border-red-500' : ''
            }`}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword?.message && (
            <p id="confirmPassword-error" role="alert" className="text-xs text-red-600 mt-0.5">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full h-9 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm mt-4 text-sm" 
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-600">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </>
  )
}
```

---

## Phase 7: Update Apollo Client for Next.js

### 7.1 `src/lib/apollo/client.ts`

Update to handle SSR:

```typescript
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: API_URL,
  credentials: 'include',
  fetchOptions: {
    mode: 'cors',
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      console.error(`[GraphQL Error]: ${message}`, extensions);
    });
  }

  if (networkError) {
    console.error(`[Network Error]: ${networkError.message}`);
  }
});

export function createApolloClient() {
  return new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
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

---

## Phase 8: Create Remaining Auth Pages

Follow the same pattern for:
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
- `src/app/(auth)/verify-email/page.tsx`

---

## Phase 9: Clean Up Old Files

**DO NOT DELETE YET** - Keep as reference during migration:
- `src/routes/` (old TanStack Router routes)
- `src/main.tsx` (Vite entry point)
- `src/router.tsx` (TanStack Router config)
- `vite.config.ts`
- `index.html`

---

## Phase 10: Test & Verify

```bash
# Install dependencies
npm install

# Run typecheck
npm run typecheck

# Run Next.js dev server
npm run dev
```

Visit: http://localhost:4200/signup

**Test:**
- ✅ Signup page renders
- ✅ Form validation works
- ✅ Inline errors appear
- ✅ GraphQL mutation sends
- ✅ Success/error handling works

---

## Migration Status Checklist

- [ ] Phase 1: Dependencies installed
- [ ] Phase 2: Config files updated  
- [ ] Phase 3: App directory created
- [ ] Phase 4: Root layout created
- [ ] Phase 5: Auth layout created
- [ ] Phase 6: Signup page migrated
- [ ] Phase 7: Apollo updated
- [ ] Phase 8: Other auth pages migrated
- [ ] Phase 9: Old files cleaned
- [ ] Phase 10: Testing complete

---

## If You Get Stuck

1. Check `.next` build output for errors
2. Verify all `@/` imports resolve correctly
3. Ensure React 18 is installed (not React 19)
4. Check browser console for runtime errors
5. Verify GraphQL endpoint in `.env.local`

This migration requires executing commands manually and testing at each phase. Would you like me to start creating the actual Next.js files, or would you prefer to follow this guide step-by-step yourself?
