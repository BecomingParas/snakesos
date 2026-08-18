# Complete GraphQL Integration - Quick Action Guide

## 🎯 What's Done

✅ Backend: 100% Complete (all mutations working)
✅ Frontend Pages: 100% Built (all 11 pages)
✅ GraphQL Hooks: 100% Created  
✅ **2 Pages Fully Integrated** (Citizen Request Form + Tracking)

---

## 🚀 What's Left: 5 More Pages (5-8 hours)

---

## Step 1: Install Toast Library (5 minutes)

```bash
yarn add sonner
```

Then add to layout:

**File**: `apps/frontend/src/app/layout.tsx`

```typescript
import { Toaster } from 'sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
```

---

## Step 2: Rescuer Dashboard (45 min)

**File**: `apps/frontend/src/app/(dashboard)/dashboard/rescuer/page.tsx`

### Add imports (top of file):
```typescript
import { useMyAssignedRescuesQuery, useAcceptRescueMutation } from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'
```

### Replace mock data section with:
```typescript
// Fetch real data
const { data: assignmentsData, loading, refetch } = useMyAssignedRescuesQuery({
  variables: {
    pagination: { first: 20 },
    filter: { statuses: ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] }
  },
  pollInterval: 10000,
  fetchPolicy: 'cache-and-network',
})

// Accept mutation
const [acceptRescue, { loading: accepting }] = useAcceptRescueMutation({
  onCompleted: () => {
    toast.success('Rescue accepted!')
    refetch()
  },
  onError: (error) => {
    toast.error(`Failed: ${error.message}`)
  }
})

// Extract data
const allAssignments = assignmentsData?.myAssignedRescues?.edges?.map(e => e.node) || []
const pendingAssignments = allAssignments.filter(r => r.status === 'ASSIGNED')
const activeRescue = allAssignments.find(r => ['ACCEPTED', 'IN_PROGRESS'].includes(r.status))

// Loading state
if (loading && !assignmentsData) {
  return <div className="flex justify-center items-center min-h-screen">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
}
```

### Update accept handler:
```typescript
const handleAcceptRescue = async (rescueId: string) => {
  await acceptRescue({
    variables: {
      input: { rescueId }
    }
  })
}
```

---

## Step 3: Rescuer Active Rescue (1 hour)

**File**: `apps/frontend/src/app/(dashboard)/dashboard/rescuer/active/page.tsx`

### Add imports:
```typescript
import { 
  useMyAssignedRescuesQuery,
  useUpdateRescueProgressMutation,
  useCompleteRescueMutation 
} from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'
```

### Replace mock data with:
```typescript
// Fetch active rescue
const { data, loading, refetch } = useMyAssignedRescuesQuery({
  variables: {
    filter: { statuses: ['ACCEPTED', 'IN_PROGRESS'] }
  },
  pollInterval: 5000,
})

const rescue = data?.myAssignedRescues?.edges?.[0]?.node

// Status update mutation
const [updateProgress, { loading: updating }] = useUpdateRescueProgressMutation({
  onCompleted: () => {
    toast.success('Status updated')
    refetch()
  },
  onError: (error) => {
    toast.error(`Update failed: ${error.message}`)
  }
})

// Complete mutation
const [completeRescue, { loading: submitting }] = useCompleteRescueMutation({
  onCompleted: () => {
    toast.success('Rescue completed!')
    router.push('/dashboard/rescuer?completed=true')
  },
  onError: (error) => {
    toast.error(`Completion failed: ${error.message}`)
  }
})

// Loading/Empty states
if (loading && !data) return <LoadingSpinner />
if (!rescue) {
  return <div className="text-center p-8">
    <p>No active rescue</p>
    <Button onClick={() => router.push('/dashboard/rescuer')}>Back to Dashboard</Button>
  </div>
}
```

### Update handlers:
```typescript
const handleStatusUpdate = async (newStatus: string, notes?: string) => {
  await updateProgress({
    variables: {
      input: {
        rescueId: rescue.id,
        status: newStatus,
        notes
      }
    }
  })
}

const handleCompleteRescue = async () => {
  if (!outcome || !rescueReport) {
    toast.error('Please fill all required fields')
    return
  }

  await completeRescue({
    variables: {
      input: {
        rescueId: rescue.id,
        outcome,
        rescueReport,
        rescueImages: rescueImages || []
      }
    }
  })
}
```

---

## Step 4: Admin Command Center (1.5 hours)

**File**: `apps/frontend/src/app/(dashboard)/dashboard/admin/command/page.tsx`

### Add imports:
```typescript
import { 
  useActiveRescuesQuery,
  useAssignRescueMutation 
} from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'
```

### Replace mock data:
```typescript
// Fetch active rescues
const { data: rescuesData, loading, refetch } = useActiveRescuesQuery({
  variables: {
    pagination: { first: 50 }
  },
  pollInterval: 5000,
  fetchPolicy: 'cache-and-network',
})

const allRescues = rescuesData?.activeRescues?.edges?.map(e => e.node) || []
const filteredRescues = allRescues.filter(r => statusFilter.includes(r.status))

// Assign mutation
const [assignRescueMutation, { loading: assigning }] = useAssignRescueMutation({
  onCompleted: () => {
    toast.success('Rescuer assigned!')
    setShowAssignModal(false)
    refetch()
  },
  onError: (error) => {
    toast.error(`Assignment failed: ${error.message}`)
  }
})

// Loading state
if (loading && !rescuesData) {
  return <div className="flex justify-center items-center h-screen">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
}
```

### Update assign handler:
```typescript
const handleAssignRescuer = async (volunteerId: string) => {
  if (!selectedRescue) return

  await assignRescueMutation({
    variables: {
      input: {
        rescueId: selectedRescue.id,
        volunteerId
      }
    }
  })
}
```

---

## Step 5: Citizen Requests List (30 min)

**File**: `apps/frontend/src/app/(dashboard)/dashboard/citizen/requests/page.tsx`

### Add imports:
```typescript
import { useMyRescueRequestsQuery } from '@/lib/graphql/hooks/rescue.hooks'
```

### Replace mock data:
```typescript
const [activeTab, setActiveTab] = useState('all')

// Map tabs to statuses
const tabStatusMap: Record<string, string[] | undefined> = {
  all: undefined,
  active: ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'],
  completed: ['COMPLETED'],
  cancelled: ['CANCELLED']
}

// Fetch requests
const { data, loading } = useMyRescueRequestsQuery({
  variables: {
    pagination: { first: 20 },
    filter: tabStatusMap[activeTab] ? { statuses: tabStatusMap[activeTab] } : {}
  },
  pollInterval: 10000,
})

const requests = data?.myRescueRequests?.edges?.map(e => e.node) || []

if (loading && !data) return <LoadingSpinner />
```

---

## Step 6: Rescuer Assignments (20 min)

**File**: `apps/frontend/src/app/(dashboard)/dashboard/rescuer/assignments/page.tsx`

### Add imports:
```typescript
import { useMyAssignedRescuesQuery, useAcceptRescueMutation } from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'
```

### Replace mock data:
```typescript
const { data, loading, refetch } = useMyAssignedRescuesQuery({
  variables: {
    filter: { status: 'ASSIGNED' }
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

const assignments = data?.myAssignedRescues?.edges?.map(e => e.node) || []

if (loading && !data) return <LoadingSpinner />
```

---

## Step 7: Test Everything (2 hours)

### Test Sequence:

1. **Start Backend**
   ```bash
   yarn dev:backend
   ```

2. **Start Frontend**
   ```bash
   yarn dev:frontend
   ```

3. **Test Citizen Flow**
   - Login as citizen
   - Create rescue request
   - Verify redirect to tracking
   - Watch status updates

4. **Test Admin Flow**
   - Login as admin
   - Open command center
   - Verify request appears
   - Assign rescuer
   - Verify assignment

5. **Test Rescuer Flow**
   - Login as rescuer
   - See assignment in dashboard
   - Accept rescue
   - Update status
   - Complete rescue

6. **Verify Database**
   - Check rescue_timelines
   - Check notifications
   - Check volunteer stats

---

## 🎉 When You're Done

You'll have:
- ✅ Complete connected workflow
- ✅ Real-time updates (polling)
- ✅ All mutations working
- ✅ Toast notifications
- ✅ Error handling
- ✅ Loading states
- ✅ End-to-end tested

**Total time: 5-8 hours from now to production-ready! 🚀**

---

## 🆘 Quick Fixes

### If Apollo Client errors:
Check `apps/frontend/src/lib/apollo/index.ts` has:
```typescript
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
})
```

### If "Cannot find module" errors:
```bash
yarn install
```

### If TypeScript errors:
The hooks file is fully typed. If you see type errors, the GraphQL response matches the TypeScript interfaces defined in `rescue.hooks.ts`.

---

**Status**: 2 pages done, 5 to go
**ETA**: 5-8 hours to completion
**Next**: Install sonner, then tackle pages one by one
