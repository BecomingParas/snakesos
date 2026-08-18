# 🚨 BACKEND NOT RUNNING!

## Problem

Your frontend is trying to connect to:
```
http://localhost:4000/graphql
```

But getting:
```
❌ ERR_CONNECTION_REFUSED
```

**This means your backend server is NOT running!**

---

## ✅ Solution: Start Backend

### Step 1: Open a New Terminal

Open a **new** terminal window (separate from frontend)

### Step 2: Navigate to Project

```bash
cd c:\Users\paras\OneDrive\Desktop\snake-rescue
```

### Step 3: Start Backend

```bash
yarn dev:backend
```

### Step 4: Wait for Success Message

You should see:

```
[TIME] INFO: 🚀 Server running on http://localhost:4000
[TIME] INFO: 📊 Health check: http://localhost:4000/health
[TIME] INFO: 🎮 GraphQL Playground: http://localhost:4000/graphql
[TIME] INFO: 🌍 Environment: development
[TIME] INFO: Email service initialized successfully
```

**If you see this** ✅ Backend is running!

**If you see errors** ❌ Copy the error and send to me

---

## 🔍 Common Issues

### Issue 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution:**
```bash
# Kill process on port 4000
npx kill-port 4000

# Then start again
yarn dev:backend
```

### Issue 2: Database Connection Failed

**Error:**
```
Error: Can't reach database server at `localhost:5432`
```

**Solution:**
```bash
# Start PostgreSQL
# Check if running in Docker:
docker ps

# Or start your PostgreSQL service
```

### Issue 3: Build Errors

**Error:**
```
Error: Cannot find module '@snake-rescue/shared'
```

**Solution:**
```bash
# Rebuild everything
yarn build:shared
yarn build:backend
yarn dev:backend
```

---

## ✅ Verify Backend is Running

### Test 1: Health Check

Open browser:
```
http://localhost:4000/health
```

Should show:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### Test 2: GraphQL Playground

Open browser:
```
http://localhost:4000/graphql
```

Should show GraphQL Playground interface

### Test 3: Simple Query

In GraphQL Playground, try:
```graphql
query {
  __typename
}
```

Should return:
```json
{
  "data": {
    "__typename": "Query"
  }
}
```

---

## 📋 Full Startup Checklist

- [ ] PostgreSQL database running
- [ ] Opened new terminal
- [ ] Navigated to project directory
- [ ] Ran `yarn dev:backend`
- [ ] Saw "Server running on http://localhost:4000"
- [ ] Saw "Email service initialized successfully"
- [ ] Verified http://localhost:4000/health works
- [ ] Verified http://localhost:4000/graphql works

---

## 🚀 After Backend Starts

Once backend is running:

1. **Keep backend terminal open** - Don't close it!

2. **Test registration** from frontend:
   - Go to http://localhost:3000/signup (or whatever port)
   - Fill registration form
   - Submit

3. **Watch backend terminal** for:
   ```
   🔍 DEBUG: About to send verification email
   🔍 DEBUG: Email: your@email.com
   🔍 DEBUG: Verification Code: 123456
   ```

4. **Check your email inbox!**

---

## ⚡ Quick Start Commands

```bash
# Terminal 1 (Backend)
cd c:\Users\paras\OneDrive\Desktop\snake-rescue
yarn dev:backend

# Terminal 2 (Frontend) - if not already running
cd c:\Users\paras\OneDrive\Desktop\snake-rescue
yarn dev:frontend
```

---

## 🆘 Still Having Issues?

If backend won't start, send me:

1. **The complete error message** (copy entire terminal output)
2. **PostgreSQL status** (is it running?)
3. **Node version** (`node --version`)
4. **Yarn version** (`yarn --version`)

---

**START THE BACKEND NOW and then try registration again!**

The email will send once the backend is running properly.

