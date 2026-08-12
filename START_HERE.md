# 🐍 START HERE - Snake Rescue Setup

## Welcome! 👋

This document will get you up and running in **under 10 minutes**.

---

## ⚡ Ultra Quick Start (For the Impatient)

```bash
# 1. Install dependencies
yarn install

# 2. Setup database
yarn prisma db push && yarn prisma db seed

# 3. Build libraries
yarn nx run-many --target=build --projects=contracts,database,shared,auth

# 4. Start everything
yarn dev
```

**Open:** http://localhost:4200

**Done!** 🎉

---

## 📚 Documentation Roadmap

Read these in order:

### 1. **First Time Setup**
📄 **[INSTALLATION.md](INSTALLATION.md)**
- Complete installation instructions
- Database setup
- Environment configuration
- **Read this if it's your first time**

### 2. **Verify Everything Works**
📄 **[VERIFY_SETUP.md](VERIFY_SETUP.md)**
- Step-by-step verification checklist
- Test each component
- Troubleshoot issues
- **Use this to make sure everything is working**

### 3. **Understand the Integration**
📄 **[FRONTEND_BACKEND_INTEGRATION.md](FRONTEND_BACKEND_INTEGRATION.md)**
- How frontend connects to backend
- GraphQL setup
- Authentication flow
- Code examples
- **Read this to understand the architecture**

### 4. **Quick Reference**
📄 **[QUICK_START.md](QUICK_START.md)**
- Common commands
- URLs and endpoints
- Quick troubleshooting
- **Bookmark this for daily use**

### 5. **Frontend Specifics**
📄 **[apps/frontend/SETUP.md](apps/frontend/SETUP.md)**
- Frontend-specific setup
- TanStack Start details
- Component structure
- **Read this when working on frontend**

---

## 🎯 What You Have

### Backend (Port 4000)
- ✅ Express + Apollo Server
- ✅ GraphQL API
- ✅ Better Auth (REST endpoints)
- ✅ PostgreSQL database
- ✅ Prisma ORM

### Frontend (Port 4200)
- ✅ TanStack Start (React + Vite)
- ✅ Apollo Client (GraphQL)
- ✅ Zustand (State management)
- ✅ Radix UI + Tailwind
- ✅ Authentication integrated

### Fully Integrated
- ✅ GraphQL queries working
- ✅ Authentication flowing
- ✅ Session management
- ✅ Type-safe APIs
- ✅ CORS configured

---

## 🚀 Starting Development

### Terminal 1: Backend
```bash
cd apps/backend
yarn serve
```
**Runs on:** http://localhost:4000

### Terminal 2: Frontend
```bash
cd apps/frontend
yarn dev
```
**Runs on:** http://localhost:4200

### Or Start Both Together
```bash
yarn dev
```

---

## 🔗 Important URLs

| Service | URL | Notes |
|---------|-----|-------|
| 🌐 Frontend | http://localhost:4200 | Main application |
| 🔌 Backend API | http://localhost:4000 | Root endpoint |
| 📊 GraphQL | http://localhost:4000/graphql | Apollo Sandbox |
| 🔐 Auth | http://localhost:4000/api/auth | Better Auth endpoints |
| ❤️ Health | http://localhost:4000/health | Health check |
| 🗄️ Prisma Studio | Run `yarn prisma studio` | Database GUI |

---

## 🎓 Test Accounts

After running `yarn prisma db seed`:

| Email | Password | Role |
|-------|----------|------|
| admin@snakerescue.com | password123 | ADMIN |
| rescuer@snakerescue.com | password123 | RESCUER |
| user@snakerescue.com | password123 | CITIZEN |

---

## 🛠️ Common Commands

### Development
```bash
yarn dev                 # Start both frontend & backend
yarn dev:frontend       # Start frontend only
yarn dev:backend        # Start backend only
```

### Database
```bash
yarn prisma db push     # Sync schema to database
yarn prisma db seed     # Add test data
yarn prisma studio      # Open database GUI
yarn prisma generate    # Generate Prisma client
```

### Build
```bash
yarn build:all          # Build everything
yarn build:frontend     # Build frontend
yarn build:backend      # Build backend
```

### Code Quality
```bash
yarn lint               # Lint code
yarn format            # Format code
yarn typecheck         # Check types
yarn test              # Run tests
```

---

## 🔍 Quick Health Check

```bash
# 1. Backend health
curl http://localhost:4000/health

# 2. GraphQL
curl http://localhost:4000/graphql

# 3. Frontend (open in browser)
open http://localhost:4200
```

---

## 🐛 Something Not Working?

### Issue: "Cannot connect to database"
```bash
# Check PostgreSQL is running
psql -U postgres -l

# Test connection
yarn prisma db push
```

### Issue: "Port already in use"
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 4200  
lsof -ti:4200 | xargs kill -9

# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Issue: "Module not found"
```bash
# Build all libraries
yarn nx run-many --target=build --all

# Clear and reinstall
rm -rf node_modules
yarn install
```

### Issue: "CORS error"
**Check backend `.env`:**
```env
CORS_ORIGINS=http://localhost:4200
```
Then restart backend.

### Issue: "TypeScript errors"
```bash
# Build contracts
yarn nx build contracts

# Restart TypeScript server in your IDE
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📁 Project Structure

```
snake-rescue/
├── apps/
│   ├── backend/         # Express + Apollo Server
│   └── frontend/        # TanStack Start (React)
├── libs/
│   ├── contracts/       # GraphQL schema & types
│   ├── database/        # Prisma ORM
│   ├── auth/           # Better Auth
│   └── shared/         # Utilities
├── .env                # Backend config
└── package.json        # Root scripts
```

---

## 🎯 Next Steps

Once everything is running:

1. ✅ **Explore the app** - Open http://localhost:4200
2. ✅ **Try logging in** - Use test accounts
3. ✅ **Open GraphQL playground** - http://localhost:4000/graphql
4. ✅ **Read the integration guide** - [FRONTEND_BACKEND_INTEGRATION.md](FRONTEND_BACKEND_INTEGRATION.md)
5. ✅ **Start building features!** 🚀

---

## 📖 Full Documentation

- 📘 **[INSTALLATION.md](INSTALLATION.md)** - Complete setup
- 📗 **[VERIFY_SETUP.md](VERIFY_SETUP.md)** - Verification checklist
- 📙 **[FRONTEND_BACKEND_INTEGRATION.md](FRONTEND_BACKEND_INTEGRATION.md)** - Architecture guide
- 📕 **[QUICK_START.md](QUICK_START.md)** - Quick reference
- 📔 **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - What was configured
- 📓 **[README.md](README.md)** - Project overview

---

## 💡 Pro Tips

1. **Use Nx Commands** - `yarn nx graph` to see project dependencies
2. **Use Prisma Studio** - Visual database editor
3. **Use Apollo DevTools** - Browser extension for GraphQL debugging
4. **Use Browser DevTools** - Network tab for API inspection
5. **Read the Logs** - Backend logs are in `apps/backend/logs/`

---

## 🎉 You're Ready!

Your Snake Rescue application is **fully set up** and **ready for development**.

**Start coding and have fun!** 🐍💚

---

## 📞 Need More Help?

1. Check the documentation files
2. Review error messages carefully
3. Check browser console (F12)
4. Check backend logs
5. Verify environment variables
6. Read troubleshooting sections

---

**Welcome to the team! Let's save some snakes! 🐍🇳🇵**
