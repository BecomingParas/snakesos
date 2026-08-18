# ⚡ Quick Setup - Get Running in 5 Minutes

**Fast track setup for developers who want to start immediately**

---

## 🚀 One-Command Setup

Run these commands in order:

```bash
# 1. Install dependencies (30 seconds)
yarn install

# 2. Setup database (10 seconds)
yarn prisma generate && yarn prisma db push

# 3. Seed test data (5 seconds)
yarn prisma db seed

# 4. Start backend (Terminal 1)
yarn dev:backend

# 5. Start frontend (Terminal 2 - new terminal)
yarn dev:frontend
```

**That's it!** 🎉

---

## ✅ Verify It's Working

### 1. Check Backend
Open: `http://localhost:4000/graphql`

Try this query:
```graphql
{
  __schema {
    types {
      name
    }
  }
}
```

If you see a JSON response, backend is working! ✅

### 2. Check Frontend
Open: `http://localhost:3000`

You should see the SnakeSOS homepage.

### 3. Login
Click "Login" and use:
- **Email**: `admin@snakerescue.com`
- **Password**: `password123`

If you're redirected to dashboard, it's working! ✅

---

## 🧪 Test With Real Data

### View Seeded Data

```bash
# Open Prisma Studio
yarn prisma studio
```

Opens at: `http://localhost:5555`

**Check these tables**:
- `users` - Should have ~6-7 users
- `rescue_requests` - Should have test rescue requests
- `volunteers` - Should have rescuers
- `snake_species` - Should have snake data

### Test Credentials

All users have password: `password123`

```
Admin:
  Email: admin@snakerescue.com
  Role: ADMIN

Citizens:
  Email: sunita.maharjan@example.com
  Email: ramesh.shrestha@example.com
  Role: CITIZEN

Rescuers:
  (Created via seed - check Prisma Studio)
  Role: RESCUER
```

---

## 📱 See It In Action

### 1. View Existing Rescue Requests

1. Login as admin: `admin@snakerescue.com`
2. Go to: `/dashboard/admin/command`
3. You should see seeded rescue requests! 🎯

### 2. Test Integration (Already Working)

1. Login as citizen
2. Go to: `/dashboard/citizen/request`
3. Create a new rescue request
4. You'll be redirected to tracking page with real data! ✅

This page is **already integrated** and working!

---

## 🔧 Common Issues

### "Cannot connect to database"
```bash
# Make sure PostgreSQL is running
# Check your DATABASE_URL in .env

# Windows: Check Services for PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### "Port already in use"
```bash
# Backend port 4000 in use:
# Kill the process or change port in backend config

# Frontend port 3000 in use:
# It will auto-suggest 3001, just press Y
```

### "Prisma Client not found"
```bash
# Re-generate Prisma client
yarn prisma generate
```

### "No data showing"
```bash
# Re-run seed
yarn prisma db seed
```

---

## 🎯 Next Steps

Now that everything is running:

1. **Read Integration Guide**
   Open: `SETUP_AND_INTEGRATION_GUIDE.md`

2. **Start Integrating Pages**
   Begin with: Citizen Requests List (easiest, 30 min)

3. **Test As You Go**
   After each integration, test the page

---

## 📊 What You Have Now

After setup:

✅ Backend running on port 4000  
✅ Frontend running on port 3000  
✅ Database with test data  
✅ 2 pages already integrated (Request Form + Tracking)  
✅ 22 pages ready for integration  
✅ Test users to login with  
✅ Seeded rescue requests to work with  

---

## 🚀 Ready to Integrate!

**Time spent**: 5 minutes  
**Status**: READY TO CODE  
**Next action**: Open `SETUP_AND_INTEGRATION_GUIDE.md` and start with "Citizen Requests List"

Good luck! 🎉
