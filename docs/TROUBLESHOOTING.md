# 🔧 Troubleshooting Guide

## Common Errors & Solutions

### ✅ Expected Errors (Safe to Ignore)

#### 1. GraphQL Connection Refused
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
http://localhost:4000/graphql
```

**Why it happens:**
- The GraphQL backend server is not running
- The frontend is trying to connect to Apollo Client

**Solution:**
- ✅ **This is expected!** The auth system uses mock authentication
- ✅ UI works perfectly without the backend
- ✅ All forms and flows are functional

**When backend is ready:**
```bash
# Start the backend server
yarn nx serve backend

# Then frontend will connect automatically
```

---

#### 2. No Valid Session Found
```
No valid session found
```

**Why it happens:**
- No user is currently logged in
- Auth context is checking for existing session

**Solution:**
- ✅ **This is correct behavior!**
- ✅ System is working as expected
- ✅ Try registering or logging in to test

---

#### 3. Manifest.json 404
```
Failed to load resource: the server responded with a status of 404
/manifest.json
```

**Why it happens:**
- PWA manifest file doesn't exist yet

**Solution:**
- ✅ **Optional feature** - app works fine without it
- Create `public/manifest.json` if you want PWA features

---

### ⚠️ Warnings (Can Fix)

#### 1. Hydration Mismatch
```
A tree hydrated but some attributes of the server rendered HTML didn't match
```

**Possible causes:**
- Date.now() or Math.random() used during SSR
- Browser extensions modifying HTML
- Client/server branching with window checks

**Solutions:**
1. **Suppress if from browser extension:**
   ```typescript
   // Ignore if you have React DevTools or other extensions
   ```

2. **Fix if in your code:**
   ```typescript
   // Bad
   const id = Math.random();
   
   // Good
   const [id, setId] = useState<number>();
   useEffect(() => {
     setId(Math.random());
   }, []);
   ```

---

#### 2. Image Quality Warning
```
Image is using quality "90" which is not configured
```

**Solution:**
✅ **Already fixed!** Updated `next.config.js` to include quality levels.

---

#### 3. Image Fill Height Warning
```
Image has "fill" and a height value of 0
```

**Where it happens:**
- Navbar logo images

**Solution:**
Parent container needs fixed height:

```typescript
// Add fixed height to parent
<div className="relative h-10 w-10">
  <Image src="/logo.png" fill alt="Logo" />
</div>
```

---

### 🐛 Actual Errors (Need Fixing)

#### 1. Cannot Read Properties of Undefined

**Example:**
```
Cannot read properties of undefined (reading 'name')
```

**Solution:**
```typescript
// Bad
<h1>Welcome, {user.name}</h1>

// Good
<h1>Welcome, {user?.name || 'Guest'}</h1>
```

---

#### 2. useAuth Must Be Used Within AuthProvider

**Error:**
```
useAuth must be used within AuthProvider
```

**Solution:**
Ensure component is wrapped:

```typescript
// layout.tsx
<AuthProvider>
  <YourComponent />
</AuthProvider>
```

---

#### 3. Import Errors

**Example:**
```
Module not found: Can't resolve '@snake-rescue/ui'
```

**Solutions:**

1. **Check if library is built:**
```bash
yarn nx build ui
```

2. **Clear cache and reinstall:**
```bash
rm -rf node_modules
rm -rf .nx
yarn install
```

3. **Check tsconfig paths:**
```json
{
  "compilerOptions": {
    "paths": {
      "@snake-rescue/ui": ["libs/frontend/ui/src/index.ts"]
    }
  }
}
```

---

### 📱 Browser Console Warnings

#### React DevTools Message
```
Download the React DevTools for a better development experience
```

**Solution:**
- Install React DevTools extension (optional)
- Or ignore - doesn't affect functionality

---

#### Apollo DevTools Message
```
Download the Apollo DevTools for a better development experience
```

**Solution:**
- Install Apollo Client DevTools extension (optional)
- Or ignore - doesn't affect functionality

---

### 🔥 Fast Refresh Messages

#### Normal Messages
```
[Fast Refresh] done in XXms
[Fast Refresh] rebuilding
```

**Solution:**
- ✅ **These are normal!** Hot reload is working
- ✅ Your changes are being applied automatically

---

### 🚫 Build Errors

#### TypeScript Errors

**Example:**
```
Type 'string | undefined' is not assignable to type 'string'
```

**Solution:**
```typescript
// Bad
const email: string = user?.email;

// Good
const email: string = user?.email || '';
```

---

#### Missing Dependency

**Example:**
```
Module not found: Error: Can't resolve 'react-icons'
```

**Solution:**
```bash
yarn add -W react-icons
```

---

### 🎨 Style Issues

#### Tailwind Classes Not Working

**Solution:**

1. **Check tailwind.config:**
```javascript
content: [
  './src/**/*.{js,ts,jsx,tsx}',
  '../../libs/**/*.{js,ts,jsx,tsx}',
],
```

2. **Restart dev server:**
```bash
# Stop server (Ctrl+C)
yarn nx serve frontend
```

---

#### Dark Mode Not Working

**Solution:**
```typescript
// layout.tsx
<html className="dark">
  ...
</html>
```

---

### 🔐 Auth Issues

#### Login Doesn't Work

**Checklist:**
1. ✅ Is AuthProvider wrapping the app?
2. ✅ Is backend server running (if not using mock)?
3. ✅ Check browser console for errors
4. ✅ Try clearing cookies/local storage

**Solution:**
```typescript
// Test with mock data
const { login } = useAuth();
await login('test@example.com', 'password123');
```

---

#### User State Not Persisting

**Solution:**
1. **Check token storage:**
```typescript
// Cookies should contain refresh token
console.log(document.cookie);
```

2. **Check auth initialization:**
```typescript
const { isInitialized } = useAuth();
if (!isInitialized) return <Loading />;
```

---

### 🛠️ Development Tips

#### Clear Everything
```bash
# Clear Nx cache
rm -rf .nx

# Clear Next.js cache
rm -rf apps/frontend/.next

# Clear node_modules
rm -rf node_modules
yarn install

# Restart dev server
yarn nx serve frontend
```

---

#### Debug Auth State
```typescript
const auth = useAuth();
console.log('Auth State:', {
  user: auth.user,
  isAuthenticated: auth.isAuthenticated,
  isLoading: auth.isLoading,
  isInitialized: auth.isInitialized,
});
```

---

#### Check GraphQL Connection
```typescript
// In browser console
fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: '{ __typename }' })
})
.then(r => r.json())
.then(console.log);
```

---

### 📞 Still Having Issues?

1. **Check the Documentation:**
   - `AUTH_QUICK_START.md`
   - `AUTHENTICATION_UI_COMPLETE.md`
   - `AUTH_IMPLEMENTATION_SUMMARY.md`

2. **Check Code Examples:**
   - Look at existing auth pages
   - Review component implementations
   - Check hook usage patterns

3. **Test with Mock Data:**
   - Ensure UI works without backend
   - Verify form validation
   - Test loading states

4. **Check Browser Console:**
   - Look for red errors (not warnings)
   - Check Network tab for failed requests
   - Verify GraphQL requests

---

## ✅ Healthy App Signs

Your app is working correctly if you see:

- ✅ Pages load without errors
- ✅ Forms are interactive
- ✅ Navigation works
- ✅ Login/Register buttons appear
- ✅ Mock authentication flows work
- ✅ Only warnings (not errors) in console

The warnings about GraphQL connection and session are **expected** and **normal** when backend is not running!

---

## 🎯 Quick Test

Run this test to verify everything works:

1. Visit `http://localhost:4200`
2. Click "Sign Up" in navbar
3. Fill registration form
4. Submit form
5. See success redirect
6. Check navbar shows login state

If all these work, your auth system is **100% functional!** 🎉
