# 🐍 Snake Rescue Frontend Setup Guide

## Overview
This frontend is built with **TanStack Start** (React + Vite) and connects to the GraphQL backend running on port 4000.

---

## 📋 Prerequisites

- Node.js 20+ installed
- Backend running on `http://localhost:4000`
- Database configured and migrated

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd apps/frontend
yarn install
```

### 2. Configure Environment

The `.env.local` file is already configured with defaults:

```env
VITE_API_URL=http://localhost:4000
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_AUTH_URL=http://localhost:4000/api/auth
VITE_FRONTEND_URL=http://localhost:4200
```

**Important:** Make sure these match your backend configuration!

### 3. Start Development Server

```bash
yarn dev
```

The frontend will start at **http://localhost:4200**

---

## 🏗️ Project Structure

```
apps/frontend/src/
├── routes/                 # TanStack Router pages
│   ├── __root.tsx         # Root layout with providers
│   ├── index.tsx          # Home page (/)
│   └── login.tsx          # Login page (/login)
├── lib/                   # Core utilities
│   ├── apollo/            # Apollo Client setup
│   │   ├── client.ts      # GraphQL client config
│   │   ├── provider.tsx   # Apollo provider
│   │   └── index.ts       # Exports
│   ├── auth/              # Authentication
│   │   ├── auth-client.ts # Auth API calls
│   │   ├── auth-store.ts  # Zustand auth state
│   │   └── index.ts       # Exports
│   ├── config.ts          # Environment config
│   ├── utils.ts           # Helper functions
│   └── error-page.tsx     # Error rendering
├── components/            # React components
│   └── providers/         # Context providers
│       └── root-provider.tsx
├── hooks/                 # Custom React hooks
├── integrations/          # External service integrations
├── start.ts              # TanStack Start entry
└── styles.css            # Global styles
```

---

## 🔌 Backend Integration

### GraphQL Connection

The frontend uses **Apollo Client** to connect to your GraphQL backend:

- **Endpoint:** `http://localhost:4000/graphql`
- **Authentication:** Cookies (Better Auth sessions)
- **Error Handling:** Automatic retry and error logging

#### Example GraphQL Query

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_RESCUES = gql`
  query GetRescues {
    rescues {
      id
      status
      location
      createdAt
    }
  }
`;

function RescuesPage() {
  const { data, loading, error } = useQuery(GET_RESCUES);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data.rescues.map(rescue => (
        <div key={rescue.id}>{rescue.location}</div>
      ))}
    </div>
  );
}
```

### Authentication

The frontend uses **Better Auth** client to communicate with the backend auth endpoints:

- **Login:** `POST http://localhost:4000/api/auth/sign-in/email`
- **Register:** `POST http://localhost:4000/api/auth/sign-up/email`
- **Logout:** `POST http://localhost:4000/api/auth/sign-out`
- **Session:** `GET http://localhost:4000/api/auth/session`

#### Example Login

```typescript
import { login, useAuthStore } from '@/lib/auth';

function LoginForm() {
  const setUser = useAuthStore(state => state.setUser);
  
  const handleLogin = async (email: string, password: string) => {
    try {
      const session = await login({ email, password });
      setUser(session.user);
      // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return <form>...</form>;
}
```

### State Management

- **Apollo Client:** GraphQL data caching
- **Zustand:** Global app state (auth, UI state)
- **React Query:** REST API calls (if needed)

---

## 🧪 Testing the Integration

### 1. Check Backend is Running

```bash
# In another terminal, check if backend is up
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

### 2. Test GraphQL Connection

Open the home page (`http://localhost:4200`) - it should show:
- ✅ Backend URL
- ✅ GraphQL endpoint URL
- ✅ No connection errors

### 3. Test Authentication

1. Go to `/login`
2. Try logging in with a test account
3. Check browser DevTools → Network → See auth requests to backend
4. Check browser DevTools → Application → Cookies → Should see session cookie

---

## 🛠️ Common Issues

### Issue 1: "Cannot connect to GraphQL server"

**Solution:**
1. Ensure backend is running: `npm run dev` in `apps/backend`
2. Check backend logs for errors
3. Verify CORS settings in backend allow `http://localhost:4200`

### Issue 2: "Authentication failed"

**Solution:**
1. Check backend Better Auth configuration
2. Ensure `BETTER_AUTH_URL` matches in both frontend and backend
3. Check browser cookies are not blocked

### Issue 3: "TypeScript errors for @snake-rescue/contracts"

**Solution:**
1. Build the contracts library: `nx build contracts`
2. Restart TypeScript server in your IDE
3. Check `tsconfig.json` paths are correct

### Issue 4: "Module not found"

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
yarn install

# Or from workspace root
yarn install
```

---

## 📦 Build for Production

### 1. Build the app

```bash
yarn build
```

### 2. Preview production build

```bash
yarn start
```

### 3. Environment Variables for Production

Create `.env.production`:

```env
VITE_API_URL=https://api.yoursite.com
VITE_GRAPHQL_URL=https://api.yoursite.com/graphql
VITE_AUTH_URL=https://api.yoursite.com/api/auth
VITE_FRONTEND_URL=https://yoursite.com
```

---

## 🔐 Security Notes

1. **Cookies:** Authentication uses HTTP-only cookies
2. **CSRF:** TanStack Start includes CSRF protection
3. **CORS:** Backend must whitelist frontend URL
4. **XSS:** All user input is sanitized by React
5. **Secrets:** Never commit `.env.local` to git

---

## 📚 Documentation Links

- [TanStack Start](https://tanstack.com/start/latest)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Better Auth](https://www.better-auth.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [GraphQL Contracts](../../libs/contracts/README.md)

---

## 🆘 Need Help?

1. Check backend logs: `apps/backend/logs/`
2. Check browser DevTools → Console
3. Check browser DevTools → Network tab
4. Review `@snake-rescue/contracts` for GraphQL schema
5. Verify environment variables match backend

---

## ✅ Integration Checklist

- [ ] Backend running on port 4000
- [ ] Database connected and migrated
- [ ] Frontend dependencies installed
- [ ] `.env.local` configured correctly
- [ ] Frontend starts without errors
- [ ] Home page loads successfully
- [ ] GraphQL connection working
- [ ] Login redirects to backend auth
- [ ] Session cookies are set
- [ ] Protected routes check authentication

---

**Happy Coding! 🐍🚀**
