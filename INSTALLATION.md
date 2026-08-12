# 🐍 Snake Rescue - Complete Installation Guide

## Prerequisites

Before starting, ensure you have:

- ✅ **Node.js 20+** - [Download](https://nodejs.org/)
- ✅ **Yarn** - `npm install -g yarn`
- ✅ **PostgreSQL 15+** - Running on port 5432
- ✅ **Git** - For version control

---

## 📦 Installation Steps

### Step 1: Clone Repository (if needed)

```bash
git clone <repository-url>
cd snake-rescue
```

### Step 2: Install Dependencies

```bash
# Install all workspace dependencies
yarn install
```

This will install dependencies for:
- Root workspace
- All apps (frontend, backend)
- All libs (contracts, database, auth, shared, etc.)

### Step 3: Configure Database

#### Option A: Using Existing PostgreSQL

If you already have PostgreSQL running:

```bash
# Create database
psql -U postgres -c "CREATE DATABASE snake_rescue;"

# Or if using devuser
psql -U devuser -c "CREATE DATABASE snake_rescue;"
```

Update `.env` file:
```env
DATABASE_URL="postgresql://devuser:devpassword@localhost:5432/snake_rescue?schema=public"
```

#### Option B: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker run -d \
  --name postgres-snake-rescue \
  -e POSTGRES_USER=devuser \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=snake_rescue \
  -p 5432:5432 \
  postgres:15
```

### Step 4: Run Database Migrations

```bash
# Generate Prisma client
yarn prisma generate

# Push schema to database (development)
yarn prisma db push

# Or run migrations (production-ready)
yarn prisma migrate deploy
```

### Step 5: Seed Database (Optional)

```bash
yarn prisma db seed
```

This creates test users:
- `admin@snakerescue.com` / `password123` (ADMIN)
- `rescuer@snakerescue.com` / `password123` (RESCUER)
- `user@snakerescue.com` / `password123` (CITIZEN)

### Step 6: Build Libraries

```bash
# Build shared libraries
yarn nx build contracts
yarn nx build database
yarn nx build shared
yarn nx build auth
```

Or build all at once:
```bash
yarn nx run-many --target=build --projects=contracts,database,shared,auth
```

---

## 🚀 Start Development Servers

### Option 1: Start Both Servers (Recommended)

```bash
# Start both frontend and backend concurrently
yarn dev
```

### Option 2: Start Separately

**Terminal 1 - Backend:**
```bash
yarn dev:backend
# Backend will run on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
yarn dev:frontend
# Frontend will run on http://localhost:4200
```

---

## ✅ Verify Installation

### 1. Check Backend

```bash
# Test health endpoint
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

### 2. Check GraphQL

Open browser: `http://localhost:4000/graphql`

You should see Apollo Sandbox/Playground.

### 3. Check Frontend

Open browser: `http://localhost:4200`

You should see the Snake Rescue home page.

### 4. Test Authentication

1. Go to: `http://localhost:4200/login`
2. Login with: `admin@snakerescue.com` / `password123`
3. Should redirect to dashboard

---

## 📁 Project Structure

```
snake-rescue/
├── apps/
│   ├── backend/              # Express + Apollo Server
│   │   ├── src/
│   │   │   ├── main.ts      # Entry point
│   │   │   ├── app.ts       # Express setup
│   │   │   ├── server.ts    # Apollo setup
│   │   │   └── config/      # Configuration
│   │   └── package.json
│   └── frontend/             # TanStack Start (React)
│       ├── src/
│       │   ├── routes/      # Pages
│       │   ├── lib/         # Utilities
│       │   │   ├── apollo/  # GraphQL client
│       │   │   └── auth/    # Auth client
│       │   └── components/  # React components
│       ├── package.json
│       └── .env.local       # Frontend config
├── libs/
│   ├── contracts/           # GraphQL schema & types
│   ├── database/            # Prisma schema & client
│   ├── auth/               # Better Auth setup
│   ├── shared/             # Shared utilities
│   └── backend/            # Backend modules
├── .env                    # Backend environment variables
├── package.json            # Root package.json
└── nx.json                # Nx configuration
```

---

## 🛠️ Available Scripts

### Development
```bash
yarn dev                    # Start both frontend & backend
yarn dev:frontend          # Start frontend only (port 4200)
yarn dev:backend           # Start backend only (port 4000)
```

### Build
```bash
yarn build:frontend        # Build frontend
yarn build:backend         # Build backend
yarn build:all            # Build all projects
```

### Database
```bash
yarn prisma generate       # Generate Prisma client
yarn prisma db push        # Push schema changes
yarn prisma db seed        # Seed database
yarn prisma studio         # Open Prisma Studio
yarn prisma migrate dev    # Create & apply migration
```

### Code Quality
```bash
yarn lint                  # Lint all projects
yarn format               # Format code with Prettier
yarn typecheck            # Run TypeScript checks
```

### Testing
```bash
yarn test                 # Run all tests
yarn test:frontend        # Test frontend
yarn test:backend         # Test backend
```

---

## 🔧 Common Issues

### Issue: "Cannot find module '@snake-rescue/contracts'"

**Solution:**
```bash
yarn nx build contracts
# Restart your IDE/TypeScript server
```

### Issue: "Database connection failed"

**Solution:**
1. Check PostgreSQL is running: `psql -U devuser -l`
2. Verify DATABASE_URL in `.env`
3. Test connection: `yarn prisma db push`

### Issue: "Port already in use"

**Solution:**
```bash
# Find process using port 4000
lsof -ti:4000 | xargs kill -9

# Find process using port 4200
lsof -ti:4200 | xargs kill -9

# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Issue: "CORS error in browser"

**Solution:**
1. Check backend `.env`: `CORS_ORIGINS=http://localhost:4200`
2. Restart backend: `yarn dev:backend`
3. Clear browser cache

### Issue: "Authentication not working"

**Solution:**
1. Check cookies are enabled in browser
2. Verify BETTER_AUTH_URL in both `.env` files
3. Check browser DevTools → Application → Cookies
4. Ensure both apps run on `localhost` (not `127.0.0.1`)

---

## 🌐 Environment Variables

### Backend (`.env`)
```env
# Database
DATABASE_URL="postgresql://devuser:devpassword@localhost:5432/snake_rescue"

# Server
NODE_ENV=development
PORT=4000
HOST=localhost

# Auth
BETTER_AUTH_URL=http://localhost:4000/api/auth
BETTER_AUTH_SECRET=your-secret-here
JWT_SECRET=your-jwt-secret-here

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:4200

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend (`.env.local`)
```env
# API
VITE_API_URL=http://localhost:4000
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_AUTH_URL=http://localhost:4000/api/auth

# Frontend
VITE_FRONTEND_URL=http://localhost:4200

# Environment
NODE_ENV=development
```

---

## 📚 Next Steps

1. ✅ **Read the integration guide:** `FRONTEND_BACKEND_INTEGRATION.md`
2. ✅ **Read the quick start:** `QUICK_START.md`
3. ✅ **Explore GraphQL schema:** `libs/contracts/src/lib/graphql/`
4. ✅ **Check database models:** `libs/database/prisma/schema.prisma`
5. ✅ **Start building features!** 🎉

---

## 🆘 Need Help?

- Check documentation files in root directory
- Review `apps/frontend/SETUP.md` for frontend details
- Review `apps/backend/README.md` for backend details
- Check Nx documentation: https://nx.dev
- Check Prisma docs: https://www.prisma.io/docs

---

**Installation Complete! 🎉**

Your Snake Rescue application is now ready for development.
