# SnakeSOS - GraphQL Integration Guide

## 🎯 Quick Start: Connect Backend to Frontend

The backend and frontend are both complete. Here's how to integrate them:

---

## Step 1: Generate GraphQL Types (5 minutes)

```bash
# Make sure backend is running
yarn dev:backend

# Generate TypeScript types from GraphQL schema
yarn graphql:codegen
```

This creates hooks in `libs/contracts/src/generated/`:
- `useCreateRescueRequestMutation()`
- `useAssignRescueMutation()`  
- `useAcceptRescueMutation()`
- `useUpdateRescueProgressMutation()`
- `useCompleteRescueMutation()`
- `useCancelRescueMutation()`
- `useRescueRequestQuery()`
- `useMyRescueRequestsQuery()`
- `useMyAssignedRescuesQuery()`
- `useActiveRescuesQuery()`

---

## Step 2: Update Citizen Request Form (15 minutes)

**File**: `apps/frontend/src/app/(dashboard)/dashboard/citizen/request/page.tsx`

```typescript
// Add imports
import { useCreateRescueRequestMutation } from '@/generated/graphql'

// Inside component
const [createRescue, { loading, error }] = useCreateRescueRequestMutation()

// Replace handleSubmit
const handleSubmit = async () => {
  try {
    const { data } = await createRescue({
      variables: {
        input: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          municipality: formData.municipality,
          ward: parseInt(formData.ward) || undefined,
          address: formData.address,
          landmark: formData.landmark || undefined,
          lat: formData.lat,
          lng: formData.lng,
          snakeDescription: formData.snakeDescription,
          snakeSize: formData.snakeSize,
          snakeColor: formData.snakeColor,
          // Add other fields
        }
      }
    })
    
    if (data?.createRescueRequest) {
      router.push(`/dashboard/citizen/requests/${data.createRescueRequest.id}`)
    }
  } catch (err) {
    setError(err.message)
  }
}
```

---

## Step 3: Update Citizen Request Tracking (10 minutes)

**File**: `apps/frontend/src/app/(dashboard)/dashboard/citizen/requests/[id]/page.tsx`

```typescript
// Add imports
import { useRescueRequestQuery } from '@/generated/graphql'

// Inside component
const { data, loading, error } = useRescueRequestQuery({
  variables: { id },
  pollInterval: 5000, // Poll every 5 seconds for real-time updates
})

// Replace mockRescue with
const rescue = data?.rescueRequest

// Add loading state
if (loading) return <div>Loading...</div>
if (error) return <div>Error: {error.message}</div>
if (!rescue) return <div>Rescue not found</div>
```

---

## Step 4: Update Rescuer Dashboard (15 minutes)

**File**: `apps/frontend/src/app/(dashboard)/dashboard/rescuer/page.tsx`

```typescript
// Add imports
import { 
  useMyAssignedRescuesQuery,
  useAcceptRescueMutation 
} from '@/generated/graphql'

// Inside component
const { data: assignmentsData } = useMyAssignedRescuesQuery({
  variables: {
    pagination: { first: 10 },
    filter: { status: ['ASSIGNED'] }
  },
  pollInterval: 10000, // Poll every 10 seconds
})

const [acceptRescue] = useAcceptRescueMutation()

// Replace handleAcceptRescue
const handleAcceptRescue = async (rescueId: string) => {
  try {
    await acceptRescue({
      variables: {
        input: {
          rescueId,
          notes: 'On my way!'
        }
      },
      refetchQueries: ['MyAssignedRescues'] // Refetch assignments
    })
    router.push('/dashboard/rescuer/active')
  } catch (error) {
    console.error('Failed to accept rescue:', error)
  }
}

// Replace mockPendingAssignments with
const pendingAssignments = assignmentsData?.myAssignedRescues?.edges?.map(e => e.node) || []
```

---

## Step 5: Update Rescuer Active Rescue (15 minutes)

**File**: `apps/frontend/src/app/(dashboard)/dashboard/rescuer/active/page.tsx`

```typescript
// Add imports
import { 
  useMyAssignedRescuesQuery,
  useUpdateRescueProgressMutation,
  useCompleteRescueMutation
} from '@/generated/graphql'

// Inside component
const { data } = useMyAssignedRescuesQuery({
  variables: {
    filter: { status: ['ACCEPTED', 'IN_PROGRESS'] }
  },
  pollInterval: 5000,
})

const [updateProgress] = useUpdateRescueProgressMutation()
const [completeRescue] = useCompleteRescueMutation()

// Replace handleStatusUpdate
const handleStatusUpdate = async (newStatus: string, notes?: string) => {
  setUpdating(true)
  try {
    await updateProgress({
      variables: {
        input: {
          rescueId: rescue.id,
          status: newStatus,
          notes,
          location: getCurrentLocation() // if available
        }
      },
      refetchQueries: ['MyAssignedRescues']
    })
  } catch (error) {
    console.error('Failed to update status:', error)
  } finally {
    setUpdating(false)
  }
}

// Replace handleCompleteRescue
const handleCompleteRescue = async () => {
  if (!outcome || !rescueReport) {
    alert('Please select outcome and provide rescue report')
    return
  }

  setSubmitting(true)
  try {
    await completeRescue({
      variables: {
        input: {
          rescueId: rescue.id,
          outcome,
          rescueReport,
          rescueImages: rescueImages || [],
          speciesId: selectedSpeciesId,
          notes,
        }
      }
    })
    
    router.push('/dashboard/rescuer?completed=true')
  } catch (error) {
    console.error('Failed to complete rescue:', error)
  } finally {
    setSubmitting(false)
  }
}
```

---

## Step 6: Update Admin Command Center (20 minutes)

**File**: `apps/frontend/src/app/(dashboard)/dashboard/admin/command/page.tsx`

```typescript
// Add imports
import { 
  useActiveRescuesQuery,
  useAssignRescueMutation 
} from '@/generated/graphql'

// Inside component
const { data: rescuesData } = useActiveRescuesQuery({
  variables: {
    pagination: { first: 50 }
  },
  pollInterval: 5000, // Real-time updates
})

const [assignRescueMutation] = useAssignRescueMutation()

// Replace mockRescues with
const allRescues = rescuesData?.activeRescues?.edges?.map(e => e.node) || []
const filteredRescues = allRescues.filter(r => statusFilter.includes(r.status))

// Replace handleAssignRescuer
const handleAssignRescuer = async (rescuerId: string) => {
  if (!selectedRescue) return
  
  setAssigning(true)
  try {
    await assignRescueMutation({
      variables: {
        input: {
          rescueId: selectedRescue.id,
          volunteerId: rescuerId,
        }
      },
      refetchQueries: ['ActiveRescues'] // Refresh the list
    })
    
    setShowAssignModal(false)
    // Show success toast
  } catch (error) {
    console.error('Failed to assign rescuer:', error)
    // Show error toast
  } finally {
    setAssigning(false)
  }
}
```

---

## Step 7: Add Toast Notifications (15 minutes)

Install toast library:
```bash
yarn add sonner
# or
npm install sonner
```

**File**: `apps/frontend/src/app/layout.tsx`

```typescript
import { Toaster } from 'sonner'

// Inside layout
<body>
  {children}
  <Toaster position="top-right" />
</body>
```

Use in components:
```typescript
import { toast } from 'sonner'

// Success
toast.success('Rescue accepted successfully!')

// Error
toast.error('Failed to assign rescuer')

// Info
toast.info('Rescuer is on the way')
```

---

## Step 8: Add Real-time Subscriptions (Optional, 30 minutes)

**File**: `libs/contracts/src/lib/graphql/rescue/subscriptions.graphql`

```graphql
type Subscription {
  rescueStatusChanged(rescueId: ID!): RescueRequest!
  newRescueRequest: RescueRequest!
  rescueAssigned(userId: ID!): RescueRequest!
}
```

**Usage in components:**
```typescript
import { useRescueStatusChangedSubscription } from '@/generated/graphql'

const { data } = useRescueStatusChangedSubscription({
  variables: { rescueId: id }
})

useEffect(() => {
  if (data?.rescueStatusChanged) {
    toast.info(`Status updated: ${data.rescueStatusChanged.status}`)
    // Update UI
  }
}, [data])
```

---

## Step 9: Add Loading States (10 minutes)

Create a loading component:

**File**: `apps/frontend/src/components/ui/loading.tsx`

```typescript
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
```

Use in pages:
```typescript
if (loading) return <LoadingSpinner />
if (error) return <ErrorDisplay error={error} />
if (!data) return <EmptyState />
```

---

## Step 10: Test End-to-End Workflow (30 minutes)

### Test Sequence:

1. **Citizen Flow**
   ```
   - Login as citizen
   - Create rescue request
   - Submit form
   - Verify redirect to tracking page
   - Verify request shows in list
   ```

2. **Admin Flow**
   ```
   - Login as admin
   - Open command center
   - Verify new request appears in queue
   - Select request
   - Open assign modal
   - Assign rescuer
   - Verify assignment success
   ```

3. **Rescuer Flow**
   ```
   - Login as rescuer
   - Verify assignment in dashboard
   - Click accept
   - Verify status updates
   - Click "En Route"
   - Verify citizen sees update
   - Complete rescue
   - Submit completion form
   - Verify completion notification
   ```

4. **Verify Audit Trail**
   ```
   - Check database for rescue_timelines entries
   - Check notifications table
   - Check volunteer statistics updated
   ```

---

## Common Issues & Solutions

### Issue: GraphQL types not generating
```bash
# Check if backend is running
yarn dev:backend

# Check codegen config
cat libs/contracts/codegen.yml

# Try manual generation
cd libs/contracts && yarn codegen
```

### Issue: Apollo Client not finding endpoint
**File**: `apps/frontend/src/lib/apollo/index.ts`
```typescript
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
})
```

### Issue: Mutations not updating cache
```typescript
const [mutation] = useMutation({
  refetchQueries: ['QueryName'],
  // or
  update: (cache, { data }) => {
    // Manual cache update
  }
})
```

### Issue: Authentication not working
```typescript
// Add auth token to Apollo Client
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

---

## Performance Optimization

### 1. Implement Optimistic Updates
```typescript
const [acceptRescue] = useAcceptRescueMutation({
  optimisticResponse: {
    acceptRescue: {
      __typename: 'RescueRequest',
      id: rescueId,
      status: 'ACCEPTED',
      acceptedAt: new Date().toISOString(),
    }
  }
})
```

### 2. Add Error Boundaries
**File**: `apps/frontend/src/components/error-boundary.tsx`

```typescript
'use client'

export class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo)
  }

  render() {
    return this.props.children
  }
}
```

### 3. Implement Pagination
```typescript
const { data, fetchMore } = useActiveRescuesQuery({
  variables: {
    pagination: { first: 10, after: cursor }
  }
})

// Load more
const loadMore = () => {
  fetchMore({
    variables: {
      pagination: { first: 10, after: pageInfo.endCursor }
    }
  })
}
```

---

## 🎉 You're Done!

After completing these steps, you'll have:
- ✅ Complete connected workflow
- ✅ Real-time status updates
- ✅ Working mutations
- ✅ Proper error handling
- ✅ Loading states
- ✅ Toast notifications
- ✅ End-to-end tested system

**The SnakeSOS operational platform is fully functional!** 🚀
