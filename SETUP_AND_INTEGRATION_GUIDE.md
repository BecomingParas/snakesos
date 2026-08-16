# 🚀 Complete Setup & Integration Guide

**From Zero to Working Platform**

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites Check](#prerequisites-check)
2. [Database Setup](#database-setup)
3. [Seed Test Data](#seed-test-data)
4. [Start Backend & Frontend](#start-backend--frontend)
5. [Verify Setup](#verify-setup)
6. [GraphQL Integration](#graphql-integration)
7. [Testing](#testing)

---

## ✅ PREREQUISITES CHECK

### Required Software

Check if you have these installed:

```bash
# Node.js (v18 or higher)
node --version

# Yarn
yarn --version

# PostgreSQL (running)
# Check if PostgreSQL is running on your system
```

### Environment Variables

Check your `.env` file exists and has these variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/snakesos"

# JWT
JWT_SECRET="your-secret-key"

# Email (optional for now)
BREVO_API_KEY="your-brevo-key"
FROM_EMAIL="noreply@snakesos.org"
```

---

## 🗄️ DATABASE SETUP

### Step 1: Install Dependencies

```bash
# Install all project dependencies
yarn install
```

### Step 2: Generate Prisma Client

```bash
# Generate Prisma client from schema
yarn prisma generate
```

### Step 3: Push Schema to Database

**Option A: Fresh Database (Recommended for first time)**

```bash
# This will create all tables from scratch
yarn prisma db push
```

**Option B: Using Migrations (If you want migration history)**

```bash
# Create and apply migrations
yarn prisma migrate dev --name init
```

### Step 4: Verify Database

```bash
# Open Prisma Studio to see your empty database
yarn prisma studio
```

This will open `http://localhost:5555` where you can see all your database tables.

**Expected Tables**:
- users
- volunteers
- rescue_requests
- rescue_timelines
- notifications
- volunteer_stats
- volunteer_availability
- snake_species
- payments

---

## 🌱 SEED TEST DATA

Now let's add test data so you can see everything working in the UI!

### Step 1: Check Seed File

The seed file is at: `libs/database/prisma/seed.ts`

It creates:
- 3 test users (admin, rescuer, citizen)
- 10+ snake species
- 5-10 rescue requests
- Volunteer stats
- Notifications
- Timeline events

### Step 2: Run Seed Command

```bash
# Seed the database with test data
yarn prisma db seed
```

**Expected Output**:
```
🌱 Seeding database...
✅ Created 3 users
✅ Created 12 snake species
✅ Created 8 rescue requests
✅ Created volunteer stats
✅ Seeding completed!
```

### Step 3: Verify Seeded Data

Open Prisma Studio again:

```bash
yarn prisma studio
```

You should now see:
- **users** table: 3 users
  - admin@snakesos.org (password: Admin@123)
  - rescuer@snakesos.org (password: Rescuer@123)
  - citizen@snakesos.org (password: Citizen@123)
- **rescue_requests** table: 5-10 requests
- **volunteers** table: 1-2 rescuers
- **snake_species** table: 12+ species

---

## 🚀 START BACKEND & FRONTEND

### Terminal 1: Start Backend

```bash
# Start GraphQL backend server
yarn dev:backend
```

**Expected Output**:
```
🚀 Server ready at http://localhost:4000/graphql
📊 GraphQL Playground available
```

**Test Backend**:
Open browser to `http://localhost:4000/graphql`

Try this query:
```graphql
query {
  me {
    id
    name
    email
    role
  }
}
```

### Terminal 2: Start Frontend

```bash
# Start Next.js frontend
yarn dev:frontend
```

**Expected Output**:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- ready in X seconds
```

---

## ✅ VERIFY SETUP

### Step 1: Test Login

1. Open browser: `http://localhost:3000`
2. Click "Login"
3. Use test credentials:
   - **Email**: `citizen@snakesos.org`
   - **Password**: `Citizen@123`

**Expected**: You should be redirected to `/dashboard/citizen`

### Step 2: Check Pages Load

Navigate through these pages (should all load without errors):
- `/dashboard/citizen` - Citizen Dashboard
- `/dashboard/citizen/requests` - My Requests (should show empty or mock data)
- `/dashboard/citizen/request` - Request Rescue Form

### Step 3: Test Backend Connection

Open browser console (F12) and check for errors:
- ❌ If you see "Failed to fetch": Backend not running
- ❌ If you see "Unauthorized": Login not working
- ✅ If no errors: Backend connected!

### Step 4: Test GraphQL Connection

Try creating a rescue request:
1. Go to `/dashboard/citizen/request`
2. Fill out the form
3. Click Submit
4. **Expected**: Success toast + redirect to tracking page

If this works, your GraphQL is connected! ✅

---

## 🔗 GRAPHQL INTEGRATION

Now that you have data, let's integrate the pages!

### Integration Order (Easiest to Hardest)

#### 🟢 EASY (Start Here!)

**1. Citizen Requests List (30 minutes)**

File: `apps/frontend/src/app/(dashboard)/dashboard/citizen/requests/page.tsx`

```typescript
// Add at top
import { useMyRescueRequestsQuery } from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'

// Inside component
const [activeTab, setActiveTab] = useState('all')

// Map tabs to statuses
const statusMap = {
  all: undefined,
  active: ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'],
  completed: ['COMPLETED'],
  cancelled: ['CANCELLED']
}

// Fetch real data
const { data, loading, error } = useMyRescueRequestsQuery({
  variables: {
    pagination: { first: 20 },
    filter: statusMap[activeTab] ? { statuses: statusMap[activeTab] } : {}
  },
  pollInterval: 10000, // Real-time updates every 10 seconds
  fetchPolicy: 'cache-and-network',
})

// Extract requests
const requests = data?.myRescueRequests?.edges?.map(e => e.node) || []

// Loading state
if (loading && !data) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

// Error state
if (error) {
  toast.error(`Failed to load requests: ${error.message}`)
}

// Now use 'requests' instead of mockRequests
```

**Test**: You should now see real rescue requests from the database!

---

**2. Rescuer Assignments (20 minutes)**

File: `apps/frontend/src/app/(dashboard)/dashboard/rescuer/assignments/page.tsx`

```typescript
// Add imports
import { useMyAssignedRescuesQuery, useAcceptRescueMutation } from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// Inside component
const router = useRouter()

// Fetch assignments
const { data, loading, refetch } = useMyAssignedRescuesQuery({
  variables: {
    filter: { statuses: ['ASSIGNED'] }
  },
  pollInterval: 10000,
})

// Accept mutation
const [acceptRescue, { loading: accepting }] = useAcceptRescueMutation({
  onCompleted: () => {
    toast.success('Rescue accepted! Redirecting to active rescue...')
    refetch()
    setTimeout(() => router.push('/dashboard/rescuer/active'), 1000)
  },
  onError: (error) => {
    toast.error(`Failed to accept: ${error.message}`)
  }
})

// Extract assignments
const assignments = data?.myAssignedRescues?.edges?.map(e => e.node) || []

// Handle accept
const handleAccept = async (rescueId: string) => {
  await acceptRescue({
    variables: {
      input: { rescueId }
    }
  })
}

// Loading state
if (loading && !data) return <LoadingSpinner />

// Use 'assignments' instead of mockAssignments
```

---

#### 🟡 MEDIUM (Next Steps)

**3. Rescuer Dashboard (45 minutes)**

File: `apps/frontend/src/app/(dashboard)/dashboard/rescuer/page.tsx`

```typescript
// Add imports
import { useMyAssignedRescuesQuery, useAcceptRescueMutation } from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'

// Inside component
const { data, loading, refetch } = useMyAssignedRescuesQuery({
  variables: {
    pagination: { first: 20 },
    filter: { statuses: ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] }
  },
  pollInterval: 10000,
})

const [acceptRescue] = useAcceptRescueMutation({
  onCompleted: () => {
    toast.success('Rescue accepted!')
    refetch()
  },
  onError: (error) => {
    toast.error(`Failed: ${error.message}`)
  }
})

// Extract data
const allAssignments = data?.myAssignedRescues?.edges?.map(e => e.node) || []
const pendingAssignments = allAssignments.filter(r => r.status === 'ASSIGNED')
const activeRescue = allAssignments.find(r => ['ACCEPTED', 'IN_PROGRESS'].includes(r.status))

// Stats
const stats = {
  pending: pendingAssignments.length,
  active: activeRescue ? 1 : 0,
  completed: 0, // Get from separate query if needed
  rating: 4.8 // Get from volunteer stats
}

// Handle accept
const handleAccept = async (rescueId: string) => {
  await acceptRescue({ variables: { input: { rescueId } } })
}

// Loading
if (loading && !data) return <LoadingSpinner />
```

---

**4. Admin Command Center (1.5 hours)**

File: `apps/frontend/src/app/(dashboard)/dashboard/admin/command/page.tsx`

```typescript
// Add imports
import { useActiveRescuesQuery, useAssignRescueMutation } from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'

// Inside component
const [statusFilter, setStatusFilter] = useState(['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'])
const [showAssignModal, setShowAssignModal] = useState(false)
const [selectedRescue, setSelectedRescue] = useState(null)

// Fetch active rescues
const { data, loading, refetch } = useActiveRescuesQuery({
  variables: {
    pagination: { first: 50 }
  },
  pollInterval: 5000, // Update every 5 seconds
  fetchPolicy: 'cache-and-network',
})

// Assign mutation
const [assignRescue, { loading: assigning }] = useAssignRescueMutation({
  onCompleted: () => {
    toast.success('Rescuer assigned successfully!')
    setShowAssignModal(false)
    setSelectedRescue(null)
    refetch()
  },
  onError: (error) => {
    toast.error(`Assignment failed: ${error.message}`)
  }
})

// Extract and filter rescues
const allRescues = data?.activeRescues?.edges?.map(e => e.node) || []
const filteredRescues = allRescues.filter(r => statusFilter.includes(r.status))

// Handle assign
const handleAssign = async (volunteerId: string) => {
  if (!selectedRescue) return
  
  await assignRescue({
    variables: {
      input: {
        rescueId: selectedRescue.id,
        volunteerId
      }
    }
  })
}

// Loading
if (loading && !data) return <LoadingSpinner />
```

---

#### 🔴 ADVANCED (After Basic Integration Works)

**5. Rescuer Active Rescue (1 hour)**

This page needs multiple mutations:
- Update status (EN_ROUTE, ARRIVED, etc.)
- Complete rescue with report and photos

**6. Admin Rescues List (30 minutes)**

Similar to Command Center but with more filtering options.

**7. Citizen/Rescuer/Admin Dashboards (15-20 min each)**

Just add stats queries to show real numbers.

---

## 🧪 TESTING

### Test Each Integration

After integrating each page:

1. **Reload Page** - Verify no errors
2. **Check Console** - Look for GraphQL errors (F12)
3. **Test Functionality** - Click buttons, verify actions work
4. **Check Toast** - Verify success/error messages show
5. **Verify Database** - Check Prisma Studio for changes

### End-to-End Test

Once all pages integrated, test full workflow:

1. **Citizen Creates Request**
   - Login as citizen
   - Go to Request Rescue
   - Fill form and submit
   - Verify redirect to tracking

2. **Admin Assigns Rescuer**
   - Logout, login as admin
   - Go to Command Center
   - Find new request
   - Assign rescuer
   - Verify status changes

3. **Rescuer Accepts**
   - Logout, login as rescuer
   - Go to Dashboard
   - See pending assignment
   - Accept it
   - Verify redirect to active rescue

4. **Rescuer Updates Status**
   - In active rescue page
   - Click "En Route"
   - Click "Arrived"
   - Verify citizen sees updates

5. **Rescuer Completes**
   - Fill completion form
   - Add report
   - Submit
   - Verify completion

6. **Verify Database**
   - Open Prisma Studio
   - Check `rescue_timelines` - should have events
   - Check `notifications` - should have notifications
   - Check `volunteer_stats` - should be updated

---

## 🐛 TROUBLESHOOTING

### Backend Issues

**Problem**: "Cannot connect to database"
```bash
# Solution: Check PostgreSQL is running
# Windows: Check Services
# Mac: brew services list
# Linux: sudo systemctl status postgresql
```

**Problem**: "Backend not starting"
```bash
# Solution: Check if port 4000 is available
# Kill any process using port 4000
# Windows: netstat -ano | findstr :4000
# Mac/Linux: lsof -i :4000
```

### Frontend Issues

**Problem**: "GraphQL endpoint not found"
```bash
# Solution: Check .env file
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```

**Problem**: "Unauthorized" errors
```bash
# Solution: Clear localStorage and login again
# Browser Console: localStorage.clear()
# Then refresh and login
```

### Database Issues

**Problem**: "No data showing in UI"
```bash
# Solution: Re-run seed
yarn prisma db seed
```

**Problem**: "Prisma Client not generated"
```bash
# Solution: Generate client
yarn prisma generate
```

### GraphQL Issues

**Problem**: "Cannot read property 'edges' of undefined"
```typescript
// Solution: Add proper null checks
const requests = data?.myRescueRequests?.edges?.map(e => e.node) || []
```

**Problem**: "Query failing silently"
```typescript
// Solution: Add error handling
if (error) {
  console.error('GraphQL Error:', error)
  toast.error(error.message)
}
```

---

## 📝 QUICK REFERENCE

### Test User Credentials

```
Admin:
Email: admin@snakesos.org
Password: Admin@123

Rescuer:
Email: rescuer@snakesos.org  
Password: Rescuer@123

Citizen:
Email: citizen@snakesos.org
Password: Citizen@123
```

### Important Commands

```bash
# Database
yarn prisma db push          # Create tables
yarn prisma db seed          # Add test data
yarn prisma studio           # View database
yarn prisma generate         # Generate client

# Development
yarn dev:backend             # Start backend (port 4000)
yarn dev:frontend            # Start frontend (port 3000)
yarn dev                     # Start both (if configured)

# Build
yarn build                   # Build all
yarn build:backend           # Build backend only
yarn build:frontend          # Build frontend only
```

### Important URLs

```
Frontend:          http://localhost:3000
Backend GraphQL:   http://localhost:4000/graphql
Prisma Studio:     http://localhost:5555
```

---

## 🎯 INTEGRATION CHECKLIST

Use this to track your progress:

### Setup Phase
- [ ] Dependencies installed (`yarn install`)
- [ ] Database created
- [ ] Prisma client generated
- [ ] Schema pushed to database
- [ ] Test data seeded
- [ ] Backend running (port 4000)
- [ ] Frontend running (port 3000)
- [ ] Can login with test users

### Integration Phase (Easy)
- [ ] Citizen Requests List integrated
- [ ] Rescuer Assignments integrated
- [ ] Test: Can see real data in both pages

### Integration Phase (Medium)
- [ ] Rescuer Dashboard integrated
- [ ] Admin Command Center integrated
- [ ] Citizen Dashboard integrated
- [ ] Admin Dashboard integrated
- [ ] Test: Can accept assignments
- [ ] Test: Can assign rescuers

### Integration Phase (Advanced)
- [ ] Rescuer Active Rescue integrated
- [ ] Admin Rescues List integrated
- [ ] Test: Can update rescue status
- [ ] Test: Can complete rescue

### Testing Phase
- [ ] End-to-end workflow tested
- [ ] All CRUD operations working
- [ ] Real-time updates working
- [ ] Toast notifications working
- [ ] Database updates verified
- [ ] No console errors

---

## 🎉 SUCCESS CRITERIA

Your platform is ready when:

✅ All pages load without errors  
✅ Can create rescue request  
✅ Can assign rescuer  
✅ Can accept assignment  
✅ Can update status  
✅ Can complete rescue  
✅ Real-time updates working  
✅ Database properly updated  
✅ All timeline events created  
✅ Notifications generated  

---

## 🚀 NEXT STEPS

Once integration is complete:

1. **Add More Test Data**
   - Create more rescue requests
   - Add more rescuers
   - Test edge cases

2. **Improve UI**
   - Add loading skeletons
   - Improve error messages
   - Add empty states

3. **Add Features**
   - Map integration
   - Real-time subscriptions
   - Push notifications
   - SMS integration

4. **Performance**
   - Add caching
   - Optimize queries
   - Add pagination

5. **Deploy**
   - Set up production database
   - Deploy backend
   - Deploy frontend
   - Configure environment variables

---

**You're ready to build! Start with the setup phase and work through the integration checklist. Good luck! 🚀**
