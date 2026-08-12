# ✅ Setup Verification Checklist

Use this checklist to verify your frontend-backend integration is working correctly.

---

## 🔧 Pre-Flight Checks

### 1. Dependencies Installed
```bash
# Check node version
node --version  # Should be 20+

# Check yarn version
yarn --version

# Install dependencies
cd snake-rescue
yarn install
```

- [ ] Node.js 20+ installed
- [ ] Yarn installed globally
- [ ] All dependencies installed without errors

---

### 2. Database Ready
```bash
# Test database connection
yarn prisma db push

# Should output: Database schema synchronized
```

- [ ] PostgreSQL running on port 5432
- [ ] Database `snake_rescue` created
- [ ] Prisma schema pushed successfully
- [ ] Test data seeded (optional)

---

### 3. Environment Variables Configured

**Backend `.env`:**
- [ ] `DATABASE_URL` points to your database
- [ ] `PORT=4000`
- [ ] `CORS_ORIGINS` includes `http://localhost:4200`
- [ ] `BETTER_AUTH_URL=http://localhost:4000/api/auth`

**Frontend `apps/frontend/.env.local`:**
- [ ] `VITE_API_URL=http://localhost:4000`
- [ ] `VITE_GRAPHQL_URL=http://localhost:4000/graphql`
- [ ] `VITE_AUTH_URL=http://localhost:4000/api/auth`

---

### 4. Libraries Built
```bash
# Build all libraries
yarn nx run-many --target=build --projects=contracts,database,shared,auth
```

- [ ] @snake-rescue/contracts built
- [ ] @snake-rescue/database built
- [ ] @snake-rescue/shared built
- [ ] @snake-rescue/auth built
- [ ] No TypeScript errors

---

## 🚀 Server Startup

### Step 1: Start Backend
```bash
# Terminal 1
cd apps/backend
yarn serve
```

**Expected Output:**
```
🚀 Server ready at http://localhost:4000
🔥 GraphQL endpoint: http://localhost:4000/graphql
📊 Health check: http://localhost:4000/health
🌍 Environment: development
```

- [ ] Backend starts without errors
- [ ] Port 4000 is listening
- [ ] Database connection established
- [ ] GraphQL server initialized

### Step 2: Test Backend
```bash
# In another terminal
curl http://localhost:4000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-...",
  "uptime": 1.234,
  "environment": "development"
}
```

- [ ] Health check returns 200 OK
- [ ] Response is valid JSON
- [ ] Status is "healthy"

### Step 3: Test GraphQL
Open browser: `http://localhost:4000/graphql`

- [ ] Apollo Sandbox/Playground loads
- [ ] Can see schema documentation
- [ ] Can execute test query:
```graphql
query {
  __typename
}
```

---

### Step 4: Start Frontend
```bash
# Terminal 2
cd apps/frontend
yarn dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:4200/
```

- [ ] Frontend starts without errors
- [ ] Port 4200 is listening
- [ ] No compilation errors
- [ ] Vite server running

### Step 5: Test Frontend
Open browser: `http://localhost:4200`

- [ ] Home page loads successfully
- [ ] No console errors in browser DevTools
- [ ] Backend URLs displayed correctly
- [ ] Page is responsive

---

## 🔌 Integration Tests

### Test 1: GraphQL Connection
On the home page (`http://localhost:4200`), check console:

- [ ] No "Failed to fetch" errors
- [ ] No CORS errors
- [ ] No network errors

### Test 2: CORS Configuration
Open browser DevTools → Network tab, then reload the page:

- [ ] Requests to `localhost:4000` succeed
- [ ] Response headers include `Access-Control-Allow-Origin`
- [ ] No CORS errors in console

### Test 3: GraphQL Query (Dev Test)
Open browser console on frontend and run:
```javascript
// This tests if Apollo Client is accessible
console.log(window.__APOLLO_CLIENT__ || 'Apollo Client is working')
```

- [ ] No errors thrown
- [ ] Apollo Client initialized

---

## 🔐 Authentication Tests

### Test 1: Login Page Loads
Navigate to: `http://localhost:4200/login`

- [ ] Login page loads
- [ ] Form fields visible
- [ ] No console errors
- [ ] Styled correctly

### Test 2: Auth Endpoint Reachable
```bash
curl http://localhost:4000/api/auth/session
```

- [ ] Returns response (even if unauthenticated)
- [ ] No 404 or 500 errors

### Test 3: Login Flow (if test user exists)
1. Go to: `http://localhost:4200/login`
2. Enter: `admin@snakerescue.com` / `password123`
3. Submit form

Check:
- [ ] Network request to `/api/auth/sign-in/email` sent
- [ ] Request includes credentials
- [ ] Response sets cookie
- [ ] Page redirects (or shows success)

### Test 4: Session Cookie
After login attempt, check DevTools → Application → Cookies → `http://localhost:4200`

- [ ] Session cookie exists
- [ ] Cookie has `HttpOnly` flag
- [ ] Cookie domain is `localhost`

---

## 🎨 Frontend Features

### Test 1: Navigation
- [ ] Home page accessible
- [ ] Login page accessible
- [ ] Routes work without errors
- [ ] Navigation is smooth

### Test 2: Styling
- [ ] Tailwind CSS working
- [ ] Components styled correctly
- [ ] Responsive design works
- [ ] No style conflicts

### Test 3: State Management
Open browser console:
```javascript
// Check if Zustand store exists
console.log('Zustand working')
```

- [ ] No errors thrown
- [ ] Store accessible

---

## 🧪 Advanced Tests (Optional)

### Test 1: GraphQL Mutation
In Apollo Sandbox (`http://localhost:4000/graphql`):
```graphql
mutation {
  __typename
}
```

- [ ] Mutation executes
- [ ] Returns response
- [ ] No errors

### Test 2: Protected GraphQL Query
In Apollo Sandbox, try a protected query (if exists):
```graphql
query {
  me {
    id
    email
  }
}
```

Without auth:
- [ ] Returns error or null
- [ ] Error message is clear

### Test 3: File Upload (if implemented)
- [ ] Can select files
- [ ] Upload progress shown
- [ ] Files saved correctly

### Test 4: Real-time Updates (if subscriptions implemented)
- [ ] Subscription connects
- [ ] Receives updates
- [ ] UI updates reactively

---

## 📊 Performance Checks

### Frontend Build
```bash
cd apps/frontend
yarn build
```

- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] Output files generated
- [ ] Bundle size reasonable (<1MB for main)

### Backend Build
```bash
yarn nx build backend
```

- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] Output files in `dist/`

---

## 🐛 Error Scenarios

Test that errors are handled gracefully:

### Test 1: Backend Offline
1. Stop backend server
2. Reload frontend
3. Check console

- [ ] Friendly error message shown
- [ ] No app crash
- [ ] Can recover when backend restarts

### Test 2: Invalid Login
1. Go to login page
2. Enter wrong credentials
3. Submit

- [ ] Error message displayed
- [ ] Form not cleared
- [ ] No app crash

### Test 3: Network Error
1. Disconnect internet
2. Try an action

- [ ] Error message shown
- [ ] App remains functional
- [ ] Can retry when reconnected

---

## ✅ Final Checklist

### Environment
- [ ] Node.js 20+ installed
- [ ] Yarn installed
- [ ] PostgreSQL running
- [ ] All dependencies installed

### Backend
- [ ] Starts without errors
- [ ] Health check passes
- [ ] GraphQL endpoint accessible
- [ ] Auth endpoints working
- [ ] Database connected

### Frontend
- [ ] Starts without errors
- [ ] Home page loads
- [ ] Login page works
- [ ] No console errors
- [ ] Styling correct

### Integration
- [ ] GraphQL queries work
- [ ] Authentication flows
- [ ] Session cookies set
- [ ] CORS configured
- [ ] State management working

### Build
- [ ] Frontend builds successfully
- [ ] Backend builds successfully
- [ ] No TypeScript errors
- [ ] All libraries built

---

## 🎯 Success Criteria

Your setup is **COMPLETE** when:

✅ Both servers start without errors
✅ Health check returns "healthy"
✅ Home page loads correctly
✅ GraphQL playground accessible
✅ Login page functional
✅ No CORS errors
✅ No console errors
✅ Cookies are set on login
✅ Frontend can make GraphQL requests
✅ Auth state persists

---

## 🐛 If Something Fails

### Backend won't start
```bash
# Check logs
cat apps/backend/logs/error.log

# Test database
yarn prisma db push

# Rebuild
yarn nx build backend
```

### Frontend won't start
```bash
# Clear cache
rm -rf apps/frontend/.vinxi
rm -rf apps/frontend/node_modules

# Reinstall
cd apps/frontend
yarn install

# Rebuild libraries
yarn nx build contracts
```

### CORS errors
```bash
# Check backend .env
grep CORS_ORIGINS .env

# Should include: http://localhost:4200
# Restart backend after changes
```

### TypeScript errors
```bash
# Build all libraries
yarn nx run-many --target=build --all

# Clear Nx cache
yarn nx reset

# Restart IDE TypeScript server
```

---

## 📞 Need Help?

If tests are failing:
1. ✅ Check this document again
2. ✅ Review error messages carefully
3. ✅ Check browser DevTools
4. ✅ Check backend logs
5. ✅ Review documentation files
6. ✅ Verify environment variables

---

## 🎉 All Tests Pass?

**Congratulations!** 🎊

Your Snake Rescue application is **fully set up** and **ready for development**!

Next steps:
1. Read `FRONTEND_BACKEND_INTEGRATION.md` for usage examples
2. Check `apps/frontend/SETUP.md` for frontend details
3. Start building features! 🚀

---

**Setup Complete! Start Coding! 🐍💚**
