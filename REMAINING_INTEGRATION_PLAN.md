# Remaining 17 Pages - Integration Plan

## Overview

This document provides a clear plan for integrating the remaining 17 dashboard pages with GraphQL. The MVP (7 pages) is complete and operational. These remaining pages will enhance the platform but are not critical for the core workflow.

---

## Summary

**Status**: 7/24 pages complete (29%)
**Remaining**: 17 pages
**Estimated Time**: 5-6 hours total

---

## Integration Priority

### ✅ Phase 1: Dashboards (Already Good!)

The Citizen and Admin dashboard pages are already well-structured with:
- `useMyRescueRequests()` hook
- `useDashboardStats()` hook  
- Real data integration in progress

**Action Required**: Verify these hooks are using GraphQL queries correctly.

---

### 🔥 Phase 2: High Priority List Pages (2 pages - 1 hour)

#### 1. Rescuer History (`/dashboard/rescuer/history`)
**Current**: Mock data
**Integration**: 
```typescript
import { useMyAssignedRescuesQuery } from '@/lib/graphql/hooks/rescue.hooks'

const { data, loading } = useMyAssignedRescuesQuery({
  variables: {
    filter: { statuses: ['COMPLETED', 'CANCELLED'] }
  },
  fetchPolicy: 'cache-and-network',
})

const historicalRescues = data?.myAssignedRescues?.edges?.map(e => e.node) || []
```

#### 2. Admin Rescues List (`/dashboard/admin/rescues`)
**Current**: Mock data
**Integration**:
```typescript
import { useActiveRescuesQuery } from '@/lib/graphql/hooks/rescue.hooks'

const { data, loading } = useActiveRescuesQuery({
  variables: {
    pagination: { first: 20 },
    // Add filtering as needed
  },
  fetchPolicy: 'cache-and-network',
})

const allRescues = data?.activeRescues?.edges?.map(e => e.node) || []
```

---

### 📄 Phase 3: Profile Pages (3 pages - 45 minutes)

These are mostly static forms. Integration is minimal.

#### 1. Citizen Profile (`/dashboard/citizen/profile`)
- Read user data from auth context
- Update form with mutation
- No complex GraphQL needed

#### 2. Citizen Emergency Contact (`/dashboard/citizen/emergency`)
- Static form
- Save to user profile
- Simple mutation

#### 3. Rescuer Profile (`/dashboard/rescuer/profile`)
- Read volunteer data
- Update bio, experience, etc.
- Simple mutation

**Pattern**:
```typescript
const { user } = useAuth() // or useCurrentUser()
const [updateProfile] = useUpdateProfileMutation()

const handleSubmit = async (data) => {
  await updateProfile({ variables: { input: data } })
  toast.success('Profile updated!')
}
```

---

### 🗺️ Phase 4: Map Pages (3 pages - 1 hour)

These pages already have map components built. Just need to feed them real data.

#### 1. Citizen Map (`/dashboard/citizen/map`)
**Integration**:
```typescript
const { data } = useMyRescueRequestsQuery({
  // Only get rescues with coordinates
})

const mapMarkers = data?.myRescueRequests?.edges
  ?.filter(e => e.node.lat && e.node.lng)
  ?.map(e => ({
    lat: e.node.lat,
    lng: e.node.lng,
    status: e.node.status,
    id: e.node.id,
  })) || []
```

#### 2. Rescuer Map (`/dashboard/rescuer/map`)
**Integration**:
```typescript
const { data } = useMyAssignedRescuesQuery({
  filter: { statuses: ['ASSIGNED', 'IN_PROGRESS'] }
})

// Map assigned rescues to markers
```

#### 3. Admin Map (`/dashboard/admin/map`)
**Integration**:
```typescript
const { data } = useActiveRescuesQuery()

// Map all active rescues to markers with different colors by status
```

**Existing Component**: `<RescueMap>` in `apps/frontend/src/components/map/RescueMap.tsx`

---

### 🔔 Phase 5: Notification Pages (3 pages - 45 minutes)

Simple list views. Create a notifications query if backend supports it, or use mock data for now.

#### 1-3. Citizen/Rescuer/Admin Notifications
**Pattern**:
```typescript
// If notifications API exists:
const { data } = useNotificationsQuery()

// Otherwise use timeline/activity from rescue queries:
const { data } = useMyRescueRequestsQuery()
const notifications = data?.myRescueRequests?.edges
  ?.flatMap(e => e.node.timeline || [])
  ?.map(t => ({
    id: t.id,
    message: t.description,
    time: t.createdAt,
    read: false,
  }))
```

**Note**: Can be left as mock data initially since notifications are not critical for MVP.

---

### 👥 Phase 6: Management Pages (2 pages - 1.5 hours)

CRUD operations for managing resources.

#### 1. Admin Rescuers Management (`/dashboard/admin/rescuers`)
**Integration**:
```typescript
// Query for list of rescuers
const GET_RESCUERS = gql`
  query GetRescuers {
    volunteers(pagination: { first: 50 }) {
      edges {
        node {
          id
          user {
            name
            email
            phone
          }
          experience
          totalRescues
          rating
          isAvailableNow
        }
      }
    }
  }
`

const { data, loading } = useQuery(GET_RESCUERS)

// Mutations for activate/deactivate, update
```

#### 2. Admin Users Management (`/dashboard/admin/users`)
**Integration**:
```typescript
// Query for all users
const GET_USERS = gql`
  query GetUsers($role: UserRole) {
    users(filter: { role: $role }, pagination: { first: 50 }) {
      edges {
        node {
          id
          name
          email
          role
          isActive
          createdAt
        }
      }
    }
  }
`

// Mutations for user management
```

---

### ⚙️ Phase 7: Settings & Analytics (2 pages - 1 hour)

Mostly static or using existing data.

#### 1. Admin Settings (`/dashboard/admin/settings`)
**Status**: Mostly static configuration forms
**Integration**: Minimal - save settings to backend or local storage

#### 2. Admin Analytics (`/dashboard/admin/analytics`)
**Integration**:
```typescript
const { data } = useAnalyticsQuery({
  variables: {
    dateRange: { start, end }
  }
})

// Chart data from analytics query
```

---

## Quick Integration Checklist

For each page:

### Before Integration
- [ ] Read the page file
- [ ] Identify what data it needs
- [ ] Check if GraphQL query/mutation exists
- [ ] If not, create it in `rescue.hooks.ts`

### During Integration
- [ ] Import GraphQL hooks
- [ ] Replace mock data with real query
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add toast notifications
- [ ] Test with real data

### After Integration
- [ ] Remove unused mock data
- [ ] Check for TypeScript errors
- [ ] Verify toasts appear
- [ ] Test error scenarios
- [ ] Check loading states

---

## Code Patterns

### Standard Query Pattern
```typescript
import { useQueryHook } from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const { data, loading, error, refetch } = useQueryHook({
  variables: { /* ... */ },
  pollInterval: 10000, // if real-time needed
  fetchPolicy: 'cache-and-network',
})

if (loading) return <LoadingSpinner />
if (error) {
  toast.error(`Error: ${error.message}`)
  return <ErrorState />
}

const items = data?.queryName?.edges?.map(e => e.node) || []
```

### Standard Mutation Pattern
```typescript
const [mutate, { loading }] = useMutationHook({
  onCompleted: () => {
    toast.success('Success!')
    refetch() // refresh data
  },
  onError: (error) => {
    toast.error(`Failed: ${error.message}`)
  }
})

const handleAction = async () => {
  await mutate({ variables: { input: data } })
}
```

---

## Time Estimates

| Phase | Pages | Est. Time | Priority |
|-------|-------|-----------|----------|
| Dashboards | 2 | 30 min | Low (already good) |
| List Pages | 2 | 1 hour | High |
| Profiles | 3 | 45 min | Low |
| Maps | 3 | 1 hour | Medium |
| Notifications | 3 | 45 min | Low |
| Management | 2 | 1.5 hours | Medium |
| Settings/Analytics | 2 | 1 hour | Low |
| **Total** | **17** | **~6 hours** | - |

---

## Recommendation

### Do Now (High Priority - 1 hour):
1. **Rescuer History** - Complete the rescuer workflow
2. **Admin Rescues List** - Important for admin oversight

### Do Next (Medium Priority - 2 hours):
3. **Map Pages** (3) - Visual appeal and usefulness
4. **Management Pages** (2) - Admin functionality

### Do Later (Low Priority - 3 hours):
5. **Profile Pages** (3) - Nice to have
6. **Notifications** (3) - Can use mock data
7. **Settings/Analytics** (2) - Enhancement features

---

## Next Steps

1. **Test MVP** - Ensure 7 integrated pages work perfectly
2. **Prioritize** - Choose which additional pages you need first
3. **Integrate** - Follow patterns from already-integrated pages
4. **Test** - Verify each page as you go
5. **Deploy** - Can deploy with 7 pages or wait for more

---

## Notes

- All patterns and hooks are already established from the 7 integrated pages
- No new GraphQL queries needed for most pages - reuse existing ones
- Focus on pages that add most value to your users first
- The MVP is fully functional - these are enhancements

---

**Bottom Line**: You have a working MVP. These 17 pages will enhance the platform but follow the same patterns you've already established. Integrate them as needed based on user feedback and priorities.
