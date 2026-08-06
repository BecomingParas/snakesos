# 🚀 Auth Quick Start Guide

## ⚡ Get Started in 3 Steps

### Step 1: Generate GraphQL Types (REQUIRED)
```bash
cd libs/contracts
yarn graphql:codegen
```

### Step 2: (Optional) Use New Navbar with Auth
```typescript
// apps/frontend/src/app/layout.tsx

// Change this:
import Navbar from "../components/Navbar";

// To this:
import NavbarWithAuth from "../components/NavbarWithAuth";

// And replace:
<Navbar />

// With:
<NavbarWithAuth />
```

### Step 3: Start & Test
```bash
yarn dev
```

Visit:
- **Register**: http://localhost:3000/register
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard

---

## 📝 Quick Code Snippets

### Get Auth State
```typescript
import { useAuth } from '@snake-rescue/features';

const { isAuthenticated, user, login, logout, isLoading } = useAuth();
```

### Protect a Page
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@snake-rescue/features';

export default function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isAuthenticated) return null;
  
  return <div>Your Content</div>;
}
```

### Show/Hide Based on Auth
```typescript
{isAuthenticated ? (
  <div>
    <p>Welcome, {user?.name}!</p>
    <button onClick={logout}>Logout</button>
  </div>
) : (
  <Link href="/login">Login</Link>
)}
```

---

## 🔗 Available Routes

### Public Routes
- `/` - Homepage
- `/snakes` - Snake directory
- `/gallery` - Photo gallery
- `/contact` - Contact page
- `/donate` - Donation page
- `/firstaid` - First aid guide
- `/ai-identifier` - AI snake identifier

### Auth Routes
- `/login` - Login page
- `/register` - Registration
- `/forgot-password` - Password reset request
- `/reset-password?token=xxx` - Reset password

### Protected Routes
- `/dashboard` - User dashboard (requires login)

---

## 🎨 UI Components Available

From `@snake-rescue/ui`:
- `Button` - Multiple variants
- `Input` - Text inputs
- `Label` - Form labels
- `Card` - Card components

Custom Auth Components:
- `AuthLayout` - Auth page wrapper
- `AuthCard` - Auth card wrapper
- `PasswordInput` - Password with show/hide

---

## 🐛 Common Issues

### 1. "Cannot find module '@snake-rescue/contracts'"
**Solution**: Run `yarn graphql:codegen`

### 2. "useAuth must be used within AuthProvider"
**Solution**: Check `layout.tsx` wraps with `<AuthProvider>`

### 3. Token not working
**Solution**: 
- Backend must return `accessToken` in login response
- Backend must set `refreshToken` as HttpOnly cookie

### 4. Dashboard redirects immediately
**Solution**: Add `isInitialized` check before redirect

---

## 📚 Documentation Files

- `AUTH-IMPLEMENTATION-PLAN.md` - Full architecture plan
- `AUTH-IMPLEMENTATION-COMPLETE.md` - What was built
- `AUTH-FINAL-SUMMARY.md` - Complete reference
- `AUTH-QUICK-START.md` - This file

---

## ✅ Verification Checklist

- [ ] Run `yarn graphql:codegen`
- [ ] No TypeScript errors
- [ ] Can register new account
- [ ] Can login
- [ ] Token visible in Network tab (Authorization header)
- [ ] Dashboard loads after login
- [ ] Logout works
- [ ] Refresh page stays logged in (if token valid)
- [ ] Mobile responsive works

---

## 🎉 That's It!

Your authentication is **ready to use**. Just run codegen and start testing!

**Support**: Check the other .md files for detailed docs.
