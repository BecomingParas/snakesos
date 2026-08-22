# SnakeSOS - Quick Start Guide 🚀

## 🎯 All Workflows Are Complete - Start Testing!

---

## 🔧 Prerequisites

- Node.js 18+ installed
- PostgreSQL running on port 5433
- Database: `snake_rescue`

---

## ⚡ Quick Start (3 Steps)

### 1. Install Dependencies
```bash
yarn install
```

### 2. Setup Database
```bash
# Generate Prisma client
yarn db:generate

# Sync database schema
cd libs/database
yarn prisma db push
cd ../..

# (Optional) Seed test data
yarn db:seed:full
```

### 3. Start Development Servers
```bash
# Terminal 1: Start frontend
yarn dev:frontend

# Terminal 2: Start backend
yarn dev:backend
```

**Access**: Open http://localhost:3000

---

## 🧪 Test the New Workflows

### Test 1: Race Condition (2 browsers needed)

```bash
# Browser 1: Login as Rescuer A
# Browser 2: Login as Rescuer B

# Both navigate to:
http://localhost:3000/dashboard/rescuer/queue

# Both click "Accept" on SAME rescue simultaneously
# Expected: One succeeds, other sees "already assigned" toast ✅
```

### Test 2: Queue System

```bash
# 1. Login as rescuer
http://localhost:3000/login

# 2. Go to dashboard
http://localhost:3000/dashboard/rescuer

# 3. Click "View Rescue Queue"
http://localhost:3000/dashboard/rescuer/queue

# 4. Verify:
# - Rescues appear in queue
# - Auto-refresh every 5 seconds
# - Municipality filter works
# - Can accept a rescue
# - Redirects to active rescue page ✅
```

### Test 3: Hospital Workflow

```bash
# 1. Accept a rescue from queue

# 2. Navigate to active rescue
http://localhost:3000/dashboard/rescuer/active

# 3. Click "Complete Rescue"

# 4. Fill form:
# - Select outcome (e.g., "Rescued & Relocated")
# - Write rescue report
# - Toggle "Did victim go to hospital?" → ON
# - Search & select hospital
# - Toggle "Antivenom administered?" → ON
# - Select antivenom type
# - Toggle "Patient admitted?" → ON
# - Add hospital notes

# 5. Click "Complete Rescue"
# Expected: Success toast + redirect ✅
```

---

## 🔍 Verify in Database

```bash
# Connect to PostgreSQL
psql -U devuser -d snake_rescue -h localhost -p 5433

# Check completed rescues with hospital data
SELECT 
  "referenceNumber",
  status,
  outcome,
  "victimWentToHospital",
  "hospitalId",
  "antivenomAdministered",
  "antivenomType",
  "hospitalAdmission"
FROM "RescueRequest"
WHERE status = 'COMPLETED'
ORDER BY "completedAt" DESC
LIMIT 5;
```

---

## 📱 Available URLs

### Public Pages
- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup
- **Report Emergency**: http://localhost:3000/report

### Rescuer Dashboard
- **Dashboard**: http://localhost:3000/dashboard/rescuer
- **Queue**: http://localhost:3000/dashboard/rescuer/queue
- **Active Rescue**: http://localhost:3000/dashboard/rescuer/active

### Admin Dashboard
- **Dashboard**: http://localhost:3000/dashboard/admin
- **Users**: http://localhost:3000/dashboard/admin/users
- **Hospitals**: http://localhost:3000/dashboard/admin/hospitals
- **Map**: http://localhost:3000/dashboard/admin/map

---

## 🐛 Common Issues & Fixes

### Issue: "Module not found" error
```bash
# Fix: Reinstall dependencies
rm -rf node_modules
yarn install
```

### Issue: Database connection error
```bash
# Fix: Check PostgreSQL is running
# Windows: Check Services
# Mac/Linux: pg_isready

# Fix: Check DATABASE_URL in .env
DATABASE_URL="postgresql://devuser:devpassword@localhost:5433/snake_rescue?schema=public"
```

### Issue: Prisma client out of sync
```bash
# Fix: Regenerate Prisma client
yarn db:generate
cd libs/database
yarn prisma db push
```

### Issue: Build errors
```bash
# Fix: Clear Next.js cache
rm -rf apps/frontend/.next
yarn dev:frontend
```

---

## 📊 Test User Accounts (if seeded)

### Rescuer Account
- **Email**: rescuer@snakesos.org
- **Password**: [Check seed file]
- **Role**: VERIFIED_RESCUER

### Admin Account
- **Email**: admin@snakesos.org
- **Password**: [Check seed file]
- **Role**: ADMIN

---

## 🎯 What to Test

### Critical Features (P0)
- [x] Race condition: 2 rescuers, 1 rescue
- [x] Queue auto-refresh
- [x] Accept from queue
- [x] Complete with hospital form
- [x] Hospital search & selection
- [x] Antivenom fields
- [x] Data saves to database

### Nice to Have (P1)
- [ ] GPS tracking (not yet implemented)
- [ ] Real-time notifications (not yet implemented)
- [ ] Mobile responsiveness (should work)

---

## 📝 Project Structure

```
snake-rescue/
├── apps/
│   ├── frontend/              # Next.js app
│   │   └── src/
│   │       ├── app/
│   │       │   └── (dashboard)/dashboard/rescuer/
│   │       │       ├── page.tsx        # Dashboard
│   │       │       ├── queue/
│   │       │       │   └── page.tsx    # ✅ NEW: Queue page
│   │       │       └── active/
│   │       │           └── page.tsx    # ✅ NEW: Active rescue page
│   │       └── lib/graphql/hooks/
│   │           └── rescue.hooks.ts     # ✅ UPDATED: Hospital fields
│   └── backend/               # Express + GraphQL API
│       └── src/
│           └── server.ts
├── libs/
│   ├── database/              # Prisma ORM
│   │   ├── prisma/
│   │   │   └── schema.prisma  # ✅ UPDATED: Hospital fields
│   │   └── src/repositories/
│   │       └── rescue.repository.ts  # ✅ UPDATED: Atomic assignment
│   └── backend/modules/
│       └── src/rescue/
│           ├── application/
│           │   ├── use-cases/
│           │   │   ├── accept-from-queue.use-case.ts  # ✅ NEW
│           │   │   └── complete-rescue.use-case.ts    # ✅ UPDATED
│           │   └── queries/
│           │       └── available-rescues.query.ts     # ✅ NEW
│           └── infrastructure/graphql/
│               └── resolvers/         # ✅ UPDATED
└── docs/
    ├── FINAL_STATUS.md               # ✅ Complete status report
    ├── WORKFLOW_IMPLEMENTATION_COMPLETE.md  # ✅ Technical details
    └── QUICKSTART.md                 # ✅ This file
```

---

## 🚀 Ready for Production?

### Before Deploying

1. **Environment Variables**
```bash
# .env.production
DATABASE_URL="your_production_db_url"
NEXTAUTH_SECRET="your_secret"
NEXT_PUBLIC_API_URL="your_api_url"
GOOGLE_MAPS_API_KEY="your_maps_key"
```

2. **Database Migration**
```bash
# Run on production database
yarn prisma migrate deploy
```

3. **Build Test**
```bash
yarn build:frontend
yarn build:backend
```

4. **Performance Test**
```bash
# Test with 10 concurrent rescuers
# Verify race condition handling
# Check response times
```

---

## 📞 Need Help?

- **Technical Docs**: See `WORKFLOW_IMPLEMENTATION_COMPLETE.md`
- **Status Report**: See `FINAL_STATUS.md`
- **Database Schema**: See `libs/database/prisma/schema.prisma`
- **GraphQL API**: http://localhost:4000/graphql

---

## ✅ Success Checklist

After starting the app, verify:

- [ ] Frontend runs on http://localhost:3000
- [ ] Backend runs on http://localhost:4000
- [ ] Can login as rescuer
- [ ] Queue page loads
- [ ] Can see available rescues
- [ ] Can accept a rescue
- [ ] Active rescue page loads
- [ ] Can complete rescue
- [ ] Hospital form appears
- [ ] Can search hospitals
- [ ] Data saves to database

**All checked?** You're ready to test! 🎉

---

## 🎯 Next Steps

1. **Test All Workflows** (30 min)
   - Race condition
   - Queue system
   - Hospital completion

2. **Review Data** (10 min)
   - Check database entries
   - Verify hospital linkage
   - Confirm antivenom data

3. **Deploy to Staging** (1 hour)
   - Push to staging branch
   - Run migrations
   - Test in staging environment

4. **Production Deploy** (when ready)
   - Merge to main
   - Deploy to production
   - Monitor logs

---

**Happy Testing! 🐍🚑**
