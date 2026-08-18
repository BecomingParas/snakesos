# 🐍 Frontend-Backend Integration Complete Guide

## ✅ Setup Completed

Your frontend is now fully integrated with the backend! Here's what was configured:

---

## 📁 Files Created

### Core Configuration
- ✅ `apps/frontend/.env.local` - Environment variables (VITE_ prefix for TanStack Start)
- ✅ `apps/frontend/app.config.ts` - TanStack Start configuration
- ✅ `apps/frontend/tsconfig.json` - TypeScript configuration (cleaned up)
- ✅ `apps/frontend/package.json` - Updated dependencies for TanStack Start
- ✅ `apps/frontend/.gitignore` - Git ignore rules

### Apollo Client (GraphQL)
- ✅ `src/lib/apollo/client.ts` - Apollo Client configuration with auth headers
- ✅ `src/lib/apollo/provider.tsx` - Apollo Provider wrapper
- ✅ `src/lib/apollo/index.ts` - Exports

### Authentication
- ✅ `src/lib/auth/auth-client.ts` - Better Auth API integration
- ✅ `src/lib/auth/auth-store.ts` - Zustand auth state management
- ✅ `src/lib/auth/index.ts` - Auth exports

### Utilities
- ✅ `src/lib/config.ts` - Centralized configuration
- ✅ `src/lib/utils.ts` - Helper functions (cn, formatDate, etc.)
- ✅ `src/lib/error-page.tsx` - Error page renderer

### Providers & Routes
- ✅ `src/components/providers/root-provider.tsx` - Main provider wrapper
- ✅ `src/routes/__root.tsx` - Root layout with providers
- ✅ `src/routes/index.tsx` - Home page with backend connection info
- ✅ `src/routes/login.tsx` - Login page example
- ✅ `src/start.ts` - Updated to remove Supabase references

### Documentation
- ✅ `apps/frontend/SETUP.md` - Complete setup guide

---

## 🔌 Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Port 4200)                     │
│                     TanStack Start + React                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Apollo Client│  │  Auth Client │  │  Zustand     │     │
│  │  (GraphQL)   │  │ (Better Auth)│  │  (State)     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘     │
│         │                  │                                │
└─────────┼──────────────────┼────────────────────────────────┘
          │                  │
          │ HTTP             │ HTTP
          │ (GraphQL)        │ (REST)
          │                  │
┌─────────▼──────────────────▼────────────────────────────────┐
│                    BACKEND (Port 4000)                      │
│                    Express + Apollo Server                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   /graphql       │         │   /api/auth      │         │
│  │  Apollo Server   │         │  Better Auth     │         │
│  │                  │         │  REST Endpoints  │         │
│  └────────┬─────────┘         └────────┬─────────┘         │
│           │                            │                    │
│           └────────────┬───────────────┘                    │
│                        │                                    │
│                        ▼                                    │
│                  ┌─────────────┐                            │
│                  │  PostgreSQL │                            │
│                  │   Database  │                            │
│                  └─────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Commands

### 1. Start Backend (Terminal 1)
```bash
cd apps/backend
yarn serve
# or
nx serve backend
```

**Backend URLs:**
- API: `http://localhost:4000`
- GraphQL: `http://localhost:4000/graphql`
- GraphQL Playground: `http://localhost:4000/graphql` (in browser)
- Auth: `http://localhost:4000/api/auth`
- Health: `http://localhost:4000/health`

### 2. Start Frontend (Terminal 2)
```bash
cd apps/frontend
yarn install  # First time only
yarn dev
```

**Frontend URL:**
- App: `http://localhost:4200`

---

## 🔍 Testing the Integration

### Test 1: Backend Health Check
```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Test 2: GraphQL Playground
1. Open browser: `http://localhost:4000/graphql`
2. You should see Apollo Sandbox
3. Try a test query:
```graphql
query {
  __typename
}
```

### Test 3: Frontend Connection
1. Open browser: `http://localhost:4200`
2. Check console for errors
3. Bottom of page should show backend URLs
4. No connection errors should appear

### Test 4: Authentication Flow
1. Go to: `http://localhost:4200/login`
2. Open DevTools → Network tab
3. Try logging in (creates test user if needed)
4. Should see request to `http://localhost:4000/api/auth/sign-in/email`
5. Check DevTools → Application → Cookies
6. Should see session cookie from backend

---

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://devuser:devpassword@localhost:5432/snake_rescue?schema=public"
NODE_ENV=development
PORT=4000
HOST=localhost
BETTER_AUTH_URL=http://localhost:4000/api/auth
CORS_ORIGINS=http://localhost:3000,http://localhost:4200,http://localhost:4201
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:4000
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_AUTH_URL=http://localhost:4000/api/auth
VITE_FRONTEND_URL=http://localhost:4200
```

**⚠️ Important:**
- Backend uses regular env vars (PORT, HOST, etc.)
- Frontend uses `VITE_` prefix for environment variables
- Make sure CORS_ORIGINS in backend includes `http://localhost:4200`

---

## 🔐 Authentication Flow

```
1. User enters credentials in frontend
   └─> POST http://localhost:4000/api/auth/sign-in/email
       
2. Backend (Better Auth) validates credentials
   └─> Checks database
   └─> Creates session
   └─> Sets HTTP-only cookie
       
3. Frontend receives session cookie
   └─> Stores user in Zustand
   └─> Redirects to dashboard
       
4. Subsequent requests include cookie
   └─> Apollo Client sends cookie with GraphQL requests
   └─> Backend verifies session via authMiddleware
   └─> Injects user into GraphQL context
```

### Protected GraphQL Queries
```typescript
// Backend automatically injects user from session
const resolvers = {
  Query: {
    myProfile: async (_parent, _args, context) => {
      // context.user is available if authenticated
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return context.user;
    },
  },
};
```

---

## 🛠️ Common Integration Patterns

### Pattern 1: GraphQL Query with Auth
```typescript
import { useQuery, gql } from '@apollo/client';

const GET_MY_RESCUES = gql`
  query GetMyRescues {
    myRescues {
      id
      status
      location
    }
  }
`;

function MyRescues() {
  const { data, loading, error } = useQuery(GET_MY_RESCUES);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data.myRescues.map(rescue => (
        <div key={rescue.id}>{rescue.location}</div>
      ))}
    </div>
  );
}
```

### Pattern 2: GraphQL Mutation
```typescript
import { useMutation, gql } from '@apollo/client';

const CREATE_RESCUE = gql`
  mutation CreateRescue($input: CreateRescueInput!) {
    createRescue(input: $input) {
      id
      status
    }
  }
`;

function CreateRescueForm() {
  const [createRescue, { loading }] = useMutation(CREATE_RESCUE);
  
  const handleSubmit = async (formData) => {
    try {
      const result = await createRescue({
        variables: { input: formData },
      });
      console.log('Rescue created:', result.data.createRescue);
    } catch (error) {
      console.error('Failed to create rescue:', error);
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Pattern 3: Protected Route
```typescript
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/lib/auth';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  const user = useAuthStore(state => state.user);
  return <div>Welcome, {user?.name}!</div>;
}
```

### Pattern 4: Role-Based Access
```typescript
import { useIsAdmin } from '@/lib/auth';

function AdminPanel() {
  const isAdmin = useIsAdmin();
  
  if (!isAdmin) {
    return <div>Access Denied</div>;
  }
  
  return <div>Admin Panel Content</div>;
}
```

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Symptoms:** Browser console shows CORS error
**Solution:**
1. Check backend `.env` has: `CORS_ORIGINS=http://localhost:4200`
2. Restart backend
3. Clear browser cache

### Issue: Authentication Not Working
**Symptoms:** Login succeeds but user not authenticated
**Solution:**
1. Check browser cookies are enabled
2. Ensure both apps use same domain (localhost)
3. Check `credentials: 'include'` in Apollo Client config
4. Verify Better Auth URL matches in both apps

### Issue: GraphQL Connection Refused
**Symptoms:** "Network error" in Apollo Client
**Solution:**
1. Ensure backend is running: `curl http://localhost:4000/health`
2. Check `VITE_GRAPHQL_URL` in frontend `.env.local`
3. Verify port 4000 is not blocked by firewall

### Issue: TypeScript Errors
**Symptoms:** Cannot find module '@snake-rescue/contracts'
**Solution:**
```bash
# Build contracts library
nx build contracts

# Restart TypeScript server in IDE
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📊 Integration Status

| Component | Status | Endpoint | Notes |
|-----------|--------|----------|-------|
| Backend API | ✅ Ready | `http://localhost:4000` | Express + Apollo |
| GraphQL | ✅ Ready | `http://localhost:4000/graphql` | Apollo Server |
| Auth API | ✅ Ready | `http://localhost:4000/api/auth` | Better Auth |
| Frontend | ✅ Ready | `http://localhost:4200` | TanStack Start |
| Apollo Client | ✅ Configured | - | With auth headers |
| Auth Client | ✅ Configured | - | Better Auth REST |
| State Management | ✅ Configured | - | Zustand + Apollo Cache |
| CORS | ✅ Configured | - | Allows localhost:4200 |

---

## 📚 Next Steps

### 1. Add More Routes
Create pages in `apps/frontend/src/routes/`:
- `/dashboard` - User dashboard
- `/rescue/new` - Create rescue request
- `/snakes` - Snake species info
- `/admin` - Admin panel

### 2. Add GraphQL Operations
Use GraphQL Codegen to generate types:
```bash
cd libs/contracts
yarn codegen
```

### 3. Add UI Components
Use the existing UI patterns:
- Forms with React Hook Form
- Data tables
- Charts with Recharts
- Maps with Leaflet

### 4. Add Real-Time Features
Implement GraphQL subscriptions for:
- Live rescue updates
- Rescue status changes
- Admin notifications

### 5. Add Tests
- Unit tests with Vitest
- Integration tests for API calls
- E2E tests with Playwright

---

## 🎯 Production Deployment

### Environment Setup
1. Update frontend `.env.production`:
```env
VITE_API_URL=https://api.yoursite.com
VITE_GRAPHQL_URL=https://api.yoursite.com/graphql
VITE_AUTH_URL=https://api.yoursite.com/api/auth
```

2. Update backend `.env`:
```env
NODE_ENV=production
CORS_ORIGINS=https://yoursite.com
BETTER_AUTH_URL=https://api.yoursite.com/api/auth
```

### Build Commands
```bash
# Build frontend
cd apps/frontend
yarn build

# Build backend
cd apps/backend
nx build backend
```

---

## ✅ Final Checklist

Before development:
- [ ] Backend running on port 4000
- [ ] Database connected
- [ ] Frontend dependencies installed
- [ ] Environment variables configured
- [ ] Both servers start without errors

For first API call:
- [ ] Backend health check passes
- [ ] GraphQL playground accessible
- [ ] Frontend loads home page
- [ ] No CORS errors in console

For authentication:
- [ ] Login page accessible
- [ ] Auth requests reach backend
- [ ] Session cookies are set
- [ ] User state persists in Zustand

---

**🎉 Your frontend is now fully integrated with the backend!**

Start building features using:
- GraphQL queries/mutations via Apollo Client
- Authentication via Better Auth
- Type-safe contracts from `@snake-rescue/contracts`
- Global state with Zustand

**Happy Coding! 🐍🚀**
