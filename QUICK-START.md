# 🚀 Quick Start Guide

## Running the Application

### 1. Start Backend Server

```bash
yarn dev:backend
```

This starts:
- **Backend API**: `http://localhost:4000`
- **GraphQL Playground**: `http://localhost:4000/graphql`
- **Better Auth REST API**: `http://localhost:4000/api/auth/*`
- **Health Check**: `http://localhost:4000/health`

### 2. Start Frontend (in a separate terminal)

```bash
yarn dev:frontend
```

This starts:
- **Frontend App**: `http://localhost:4200` or `http://localhost:3000`

### 3. Run Both Together

```bash
yarn dev
```

This runs both frontend and backend concurrently.

---

## Common Issues & Solutions

### ❌ "Failed to fetch" / "ERR_CONNECTION_REFUSED"

**Problem**: Backend server is not running

**Solution**: 
```bash
yarn dev:backend
```

### ❌ "No access token in response"

**Problem**: Backend is not reachable or not returning proper auth response

**Solution**: 
1. Make sure backend is running
2. Check `.env` file has all required variables
3. Check backend console for errors

### ❌ Database Connection Error

**Problem**: PostgreSQL is not running or DATABASE_URL is wrong

**Solution**:
```bash
# Check your DATABASE_URL in .env
# Make sure PostgreSQL is running
# Generate Prisma client
yarn db:generate

# Push schema to database
yarn db:push
```

### ❌ "User with this email already exists"

**Problem**: You're trying to register with an email that's already in the database

**Solution**:
- Use a different email, OR
- Delete the user from database using Prisma Studio:
```bash
yarn db:studio
```

---

## Development Workflow

1. **First Time Setup**:
```bash
# Install dependencies
yarn install

# Generate Prisma client
yarn db:generate

# Push schema to database
yarn db:push

# Seed database (optional)
yarn db:seed
```

2. **Daily Development**:
```bash
# Terminal 1: Start backend
yarn dev:backend

# Terminal 2: Start frontend
yarn dev:frontend

# OR run both together
yarn dev
```

3. **Building for Production**:
```bash
# Build everything
yarn build:all

# Or build individually
yarn build:backend
yarn build:frontend
```

---

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend | 4200 or 3000 | http://localhost:4200 |
| Backend API | 4000 | http://localhost:4000 |
| GraphQL Playground | 4000 | http://localhost:4000/graphql |
| Better Auth REST | 4000 | http://localhost:4000/api/auth/* |
| Prisma Studio | 5555 | http://localhost:5555 |

---

## Environment Variables

Required variables in `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/snake_rescue"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:4000/api/auth"

# JWT
JWT_SECRET="your-jwt-secret-key"

# CSRF Protection
CSRF_SECRET="your-csrf-secret-key"

# CORS
CORS_ORIGINS="http://localhost:3000,http://localhost:4200"

# Server
PORT=4000
HOST="localhost"
NODE_ENV="development"

# Cookie
COOKIE_DOMAIN="localhost"

# SMTP (for email verification)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@snake-rescue.com"
```

---

## Testing the Auth System

### 1. Register a New User

Navigate to: `http://localhost:4200/register`

Fill in:
- Name: Test User
- Email: test@example.com
- Phone: +1234567890 (optional)
- Password: password123
- Confirm Password: password123

### 2. Login

Navigate to: `http://localhost:4200/login`

Use the credentials you just registered with.

### 3. Check Session

After login, you should see:
- ✅ Access token stored in memory
- ✅ Refresh token in HTTP-only cookie
- ✅ User profile in navbar
- ✅ Logout button visible

---

## Useful Commands

```bash
# Database Management
yarn db:generate      # Generate Prisma client
yarn db:migrate      # Run migrations
yarn db:push         # Push schema without migrations
yarn db:studio       # Open Prisma Studio GUI
yarn db:seed         # Seed database with test data

# GraphQL Code Generation
yarn graphql:codegen        # Generate TypeScript types from GraphQL schema
yarn graphql:codegen:watch  # Watch mode

# Building
yarn build:backend   # Build backend only
yarn build:frontend  # Build frontend only
yarn build:all       # Build everything

# Linting & Formatting
yarn lint           # Run ESLint
yarn format         # Format code with Prettier
```

---

## Need Help?

Check these files for more information:
- **Authentication Details**: `AUTH-IMPLEMENTATION-SUMMARY.md`
- **Verification Steps**: `VERIFY-AUTH-FIXES.md`
- **Build Success Info**: `BUILD-SUCCESS.md`
- **Quick Reference**: `AUTH-QUICK-REFERENCE.md`
