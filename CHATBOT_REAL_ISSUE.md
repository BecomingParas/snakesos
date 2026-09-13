# 🎯 REAL CHATBOT ISSUE - Backend Not Running

## TL;DR
Your chatbot doesn't work because it requires a **separate backend GraphQL server** that isn't running on Vercel. The identify route works fine because it's just a frontend API route.

## Your API Key is VALID ✅

Good news! Your `GEMINI_API_KEY` is actually **valid**:
```
AQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

This is the NEW **Authorization Key** format from Google (starts with `AQ.`). The old format (`AIza...`) is being deprecated in September 2026.

##  Model Name Issue (Minor)

Your `GEMINI_MODEL=gemini-3.6-flash` doesn't exist. Use `gemini-1.5-flash` instead (already fixed in code).

## Why Identify Works But Chatbot Doesn't

### Identify Route ✅ WORKING
```
Frontend (Vercel)
└── /api/identify-snake (Next.js API Route)
    └── Uses GEMINI_API_KEY directly
    └── ✅ Works on Vercel!
```

### Chatbot ❌ NOT WORKING
```
Frontend (Vercel)
└── Chatbot Component
    └── GraphQL Mutation (aiChat)
        └── Tries to connect to: http://localhost:4200/api/graphql
            └── ❌ Backend server NOT running!
```

## The Architecture

Your app has TWO servers:

| Server | Port | Purpose | Status |
|--------|------|---------|--------|
| **Frontend** | 3000/4200 | Next.js app, API routes | ✅ Running on Vercel |
| **Backend** | 4000 | GraphQL API, AI Agent | ❌ Not running |

The chatbot uses GraphQL which needs the backend server running.

## Check Your Setup

### 1. Check Apollo Client Configuration

File: `apps/frontend/src/lib/apollo/client.ts`

```typescript
const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4200/api/graphql';
```

This tries to connect to a backend GraphQL server.

### 2. Check if Backend is Running Locally

```bash
# Run both servers:
yarn dev

# This runs:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:4000
```

### 3. Check Vercel Configuration

On Vercel, you only deployed the **frontend**. The backend GraphQL server needs to be deployed separately (or you need to merge them into one server).

## Solutions

### Option 1: Deploy Backend Separately (Recommended)

Deploy your backend GraphQL server to:
- **Vercel Functions** (if it fits)
- **Railway.app**
- **Render.com**
- **Fly.io**
- **Google Cloud Run**

Then update `NEXT_PUBLIC_GRAPHQL_URL` in Vercel:
```env
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend.railway.app/api/graphql
```

### Option 2: Merge Backend into Frontend API Routes

Convert the GraphQL backend to Next.js API routes (more work):
- Move backend logic to `/app/api/graphql/route.ts`
- This way everything runs in one Vercel deployment

### Option 3: Use Identify Route Pattern for Chatbot (Quick Fix)

Create a new Next.js API route for chat that doesn't use GraphQL:
- `/app/api/chat/route.ts` (similar to identify-snake)
- Update chatbot to use this instead of GraphQL

## Test Locally

### 1. Start Both Servers
```bash
cd /c/Users/paras/OneDrive/Desktop/snake-rescue
yarn dev
```

You should see:
```
✓ Frontend ready on http://localhost:3000
✓ Backend GraphQL ready on http://localhost:4000/api/graphql
```

### 2. Test Backend GraphQL
```bash
curl http://localhost:4000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'
```

Should return: `{"data":{"__typename":"Query"}}`

### 3. Test Chatbot
- Open http://localhost:3000
- Click chatbot button
- Send a message
- Should work if backend is running!

## Vercel Deployment Checklist

To make chatbot work in production:

- [ ] Deploy backend GraphQL server (Railway/Render/etc.)
- [ ] Get backend URL (e.g., `https://snake-rescue-backend.railway.app`)
- [ ] Add `NEXT_PUBLIC_GRAPHQL_URL` to Vercel environment variables
- [ ] Add `GEMINI_API_KEY` to backend deployment
- [ ] Redeploy frontend
- [ ] Test chatbot on production site

## Environment Variables Needed

### Frontend (Vercel)
```env
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend-url.com/api/graphql
GEMINI_API_KEY=your_gemini_api_key_here
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Backend (Railway/Render/etc.)
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your_jwt_secret_here
CORS_ORIGINS=https://snakesos.vercel.app
```

## Quick Debug Commands

```bash
# Check if backend is running
curl http://localhost:4000/health

# Check GraphQL endpoint
curl http://localhost:4000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# Check what's running on ports
netstat -ano | findstr ":4000"
netstat -ano | findstr ":3000"
```

## Summary

✅ **Your Gemini API key is VALID** (AQ. format is the new auth key)  
✅ **Identify route works** (runs in frontend/Vercel)  
❌ **Chatbot needs backend GraphQL server** (not deployed)  
🔧 **Solution**: Deploy backend separately OR convert chatbot to use API routes

The model name issue (`gemini-3.6-flash` → `gemini-1.5-flash`) has been fixed in the code already.

---

**Next Step**: Decide how you want to deploy the backend, then we'll configure it!
