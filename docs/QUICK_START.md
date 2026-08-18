# 🚀 Quick Start - Snake Rescue Project

## Start Both Servers

```bash
# Terminal 1: Start Backend
cd apps/backend
yarn serve

# Terminal 2: Start Frontend  
cd apps/frontend
yarn install  # First time only
yarn dev
```

## URLs

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:4200 |
| 🔌 Backend API | http://localhost:4000 |
| 📊 GraphQL | http://localhost:4000/graphql |
| 🔐 Auth | http://localhost:4000/api/auth |
| ❤️ Health | http://localhost:4000/health |

## Test Integration

```bash
# 1. Test backend health
curl http://localhost:4000/health

# 2. Open frontend
open http://localhost:4200

# 3. Try login
open http://localhost:4200/login
```

## Environment Files

### Backend: `.env`
```env
DATABASE_URL="postgresql://devuser:devpassword@localhost:5432/snake_rescue"
PORT=4000
CORS_ORIGINS=http://localhost:4200
BETTER_AUTH_URL=http://localhost:4000/api/auth
```

### Frontend: `.env.local`
```env
VITE_API_URL=http://localhost:4000
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_AUTH_URL=http://localhost:4000/api/auth
```

## Common Issues

**CORS Error?**
- Check backend CORS_ORIGINS includes `http://localhost:4200`
- Restart backend

**GraphQL Connection Error?**
- Ensure backend is running: `curl http://localhost:4000/health`
- Check VITE_GRAPHQL_URL in frontend .env.local

**Auth Not Working?**
- Check cookies enabled in browser
- Verify BETTER_AUTH_URL matches in both apps
- Check DevTools → Application → Cookies

**TypeScript Errors?**
```bash
# Build contracts
nx build contracts
# Restart TS server in your IDE
```

## Project Structure

```
snake-rescue/
├── apps/
│   ├── backend/          # Express + Apollo Server (Port 4000)
│   └── frontend/         # TanStack Start (Port 4200)
├── libs/
│   ├── contracts/        # GraphQL schema & types
│   ├── database/         # Prisma client
│   ├── auth/            # Better Auth setup
│   └── shared/          # Shared utilities
└── .env                 # Backend environment variables
```

## Key Concepts

**Frontend → Backend:**
- Apollo Client for GraphQL
- Better Auth for authentication
- Zustand for state management
- Cookies for sessions

**Backend:**
- Express server
- Apollo Server (GraphQL)
- Better Auth (REST auth endpoints)
- Prisma (Database ORM)

## Next Steps

1. Read `FRONTEND_BACKEND_INTEGRATION.md` for detailed guide
2. Read `apps/frontend/SETUP.md` for frontend specifics
3. Check `libs/contracts/README.md` for GraphQL schema
4. Start building features! 🎉

---

**Need help?** Check the full integration guide: `FRONTEND_BACKEND_INTEGRATION.md`
