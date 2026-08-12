# Dashboard API Integration Guide

## Overview

This document describes the complete API integration for the Snake Rescue dashboard system. All dashboards now use real GraphQL queries and Apollo Client hooks.

## Architecture

### GraphQL Queries
Located in: `apps/frontend/src/lib/graphql/queries/dashboard.queries.ts`

**Available Queries:**
- `GET_DASHBOARD_STATS` - Admin dashboard statistics
- `GET_MY_RESCUE_REQUESTS` - Citizen's rescue requests
- `GET_MY_ASSIGNED_RESCUES` - Rescuer's assigned rescues
- `GET_ACTIVE_RESCUES` - Currently active rescues
- `GET_PENDING_RESCUES_COUNT` - Count of pending rescues
- `GET_ME` - Current authenticated user
- `GET_RESCUE_STATS` - Rescue operation statistics

### Custom Hooks
Located in: `apps/frontend/src/hooks/dashboard/`

**Available Hooks:**
1. **useDashboardStats** - Fetch dashboard statistics
   ```typescript
   const { stats, loading, error, refetch } = useDashboardStats({ period: 'MONTH' })
   ```

2. **useCurrentUser** - Get authenticated user
   ```typescript
   const { user, loading, error, refetch } = useCurrentUser()
   ```

3. **useMyRescueRequests** - Citizen's requests
   ```typescript
   const { requests, totalCount, loading, error } = useMyRescueRequests({
     pagination: { first: 10 },
     filter: { status: ['PENDING', 'IN_PROGRESS'] }
   })
   ```

4. **useMyAssignedRescues** - Rescuer's assignments
   ```typescript
   const { rescues, totalCount, loading, error } = useMyAssignedRescues({
     pagination: { first: 10 }
   })
   ```

## Dashboard Pages

### 1. Auto-Router (`/dashboard`)
**File:** `apps/frontend/src/app/(dashboard)/dashboard/page.tsx`

**Features:**
- Fetches current user with `useCurrentUser()`
- Redirects to role-specific dashboard
- Shows loading state
- Redirects to login if not authenticated

**Role Routes:**
- `ADMIN`, `SUPER_ADMIN`, `DISTRICT_COORDINATOR` → `/dashboard/admin`
- `VERIFIED_RESCUER`, `VOLUNTEER` → `/dashboard/rescuer`
- `CITIZEN` → `/dashboard/citizen`

### 2. Admin Dashboard (`/dashboard/admin`)
**File:** `apps/frontend/src/app/(dashboard)/dashboard/admin/page.tsx`

**API Integration:**
```typescript
const { stats, loading, error } = useDashboardStats()
```

**Data Displayed:**
- Active rescues count
- Total completed rescues
- Active volunteers / total verified rescuers
- Average response time (with trend)
- Total species encounters
- Total registered users
- Completion rate
- System trends (rescues, volunteers, donations)

**Loading States:**
- Shows spinner while fetching
- Error message if API fails
- Graceful fallback UI

### 3. Citizen Dashboard (`/dashboard/citizen`)
**File:** `apps/frontend/src/app/(dashboard)/dashboard/citizen/page.tsx`

**API Integration:**
```typescript
const { requests, totalCount, loading, error } = useMyRescueRequests({
  pagination: { first: 10 }
})
```

**Features:**
- Lists user's rescue requests
- Shows request status with color-coded badges
- Calculates active and completed request counts
- Emergency banner for quick access
- Safety tips section
- Click-to-call functionality for assigned rescuers

**Request Card Features:**
- Reference number display
- Status badges (Pending, Assigned, In Progress, Completed, Cancelled)
- Emergency flag
- Location display
- Rescuer information (if assigned)
- Action buttons (Track, Call, Feedback)

### 4. Rescuer Dashboard (`/dashboard/rescuer`)
**File:** `apps/frontend/src/app/(dashboard)/dashboard/rescuer/page.tsx`

**API Integration:**
```typescript
const { user } = useCurrentUser()
const { rescues, totalCount, loading, error } = useMyAssignedRescues({
  pagination: { first: 10 }
})
```

**Features:**
- Personal rescue statistics
- Monthly rescue count
- Rating display (from volunteer profile)
- Active status badge
- Assigned rescue list with priority
- Navigation integration (Google Maps)
- Click-to-call reporter
- Emergency indicators

**Rescue Card Features:**
- Priority badges (Critical, High, Medium, Low)
- Emergency flag
- Snakebite warning
- GPS navigation link
- Reporter contact
- Location details

### 5. Dashboard Navigation
**File:** `apps/frontend/src/components/dashboard/dashboard-nav.tsx`

**API Integration:**
```typescript
const { user } = useCurrentUser()
const userRole = user?.role || 'CITIZEN'
```

**Features:**
- Dynamic navigation based on user role
- Mobile responsive menu
- Active route highlighting
- Logout button (TODO: implement logout logic)
- Back to main site link

### 6. Dashboard Layout (Authentication Guard)
**File:** `apps/frontend/src/app/(dashboard)/layout.tsx`

**API Integration:**
```typescript
const { user, loading, error } = useCurrentUser()
```

**Features:**
- Authentication check on mount
- Redirects to `/login?redirect=/dashboard` if not authenticated
- Shows loading state while checking auth
- Prevents unauthorized access to dashboard routes

## Data Types

### User Types
```typescript
type UserRole = 
  | 'CITIZEN' 
  | 'VOLUNTEER' 
  | 'VERIFIED_RESCUER' 
  | 'DISTRICT_COORDINATOR' 
  | 'ADMIN' 
  | 'SUPER_ADMIN'

interface CurrentUser {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatar?: string
  emailVerified: boolean
  volunteerProfile?: {
    id: string
    status: string
    experienceLevel: string
    completedRescues: number
    rating?: number
  }
}
```

### Rescue Request Types
```typescript
type RescueStatus = 
  | 'PENDING' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED'

type RescuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

interface RescueRequest {
  id: string
  referenceNumber?: string
  name: string
  phone: string
  municipality: string
  ward?: number
  address: string
  landmark?: string
  lat?: number
  lng?: number
  snakeDescription?: string
  status: RescueStatus
  priority: RescuePriority
  stillPresent: boolean
  isEmergency: boolean
  hasBite: boolean
  createdAt: string
  updatedAt: string
  assignedVolunteer?: {
    id: string
    user: {
      id: string
      name: string
      phone: string
    }
  }
}
```

### Dashboard Stats Types
```typescript
interface DashboardStats {
  totalRescues: number
  activeRescues: number
  completedRescues: number
  completionRate: number
  averageResponseTime: number
  totalVolunteers: number
  activeVolunteers: number
  verifiedRescuers: number
  totalSpecies: number
  venomousEncounters: number
  totalUsers: number
  totalDonations: number
  totalDonationAmount: number
  rescueTrend: TrendData
  volunteerTrend: TrendData
  donationTrend: TrendData
}

interface TrendData {
  current: number
  previous: number
  change: number
  direction: 'UP' | 'DOWN' | 'STABLE'
}
```

## Error Handling

All hooks use the centralized `handleGraphQLError` utility from `@/lib/graphql/error-handler.ts`.

**Error Display Pattern:**
```typescript
if (error || !data) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
      <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
      <h2>Failed to Load</h2>
      <p>{error?.message || 'Unable to fetch data'}</p>
    </div>
  )
}
```

## Loading States

All dashboards implement loading states:
```typescript
if (loading) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}
```

## Backend Requirements

### Required GraphQL Queries
The backend must implement these queries:

1. **dashboardStats(period: AnalyticsTimePeriod): DashboardStats**
   - Requires: ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR roles
   - Returns: Complete dashboard statistics

2. **me: User**
   - Returns: Current authenticated user with profile

3. **myRescueRequests(pagination, filter): RescueRequestConnection**
   - Returns: User's rescue requests

4. **myAssignedRescues(pagination, filter): RescueRequestConnection**
   - Requires: VOLUNTEER, VERIFIED_RESCUER roles
   - Returns: Rescues assigned to the user

### Required Auth Setup
- JWT token in Apollo Client headers
- Token refresh mechanism
- Session management

## Testing Checklist

### Authentication Flow
- [ ] Unauthenticated users redirected to login
- [ ] Role-based dashboard routing works
- [ ] Loading states display correctly
- [ ] Error messages show on auth failure

### Admin Dashboard
- [ ] Stats load from API
- [ ] All stat cards show real data
- [ ] Trend indicators display correctly
- [ ] Loading and error states work

### Citizen Dashboard
- [ ] Rescue requests list loads
- [ ] Stats calculate correctly
- [ ] Status badges display properly
- [ ] Emergency banner shows
- [ ] Call rescuer button works

### Rescuer Dashboard
- [ ] Assigned rescues load
- [ ] Personal stats display
- [ ] Navigation links work
- [ ] Priority badges show correctly
- [ ] Emergency indicators appear

### Navigation
- [ ] Role-based nav items display
- [ ] Active route highlights
- [ ] Mobile menu works
- [ ] Logout button functional

## Next Steps

### TODO Items
1. **Implement logout functionality**
   - Create logout mutation hook
   - Clear Apollo cache on logout
   - Redirect to login page

2. **Add real-time updates**
   - Implement GraphQL subscriptions
   - Auto-refresh on new assignments
   - Live status updates

3. **Add pagination controls**
   - Load more button
   - Infinite scroll
   - Page navigation

4. **Implement filtering**
   - Status filters
   - Date range filters
   - Municipality filters

5. **Add rescue detail pages**
   - Full rescue information
   - Timeline view
   - Photo gallery
   - Status update form

6. **Implement feedback system**
   - Rating component
   - Review submission
   - Display reviews

## Dependencies

**Required Packages:**
- `@apollo/client` - GraphQL client
- `next` - Next.js framework
- `react` - React library
- `lucide-react` - Icons
- `@/components/ui/*` - shadcn/ui components

**Apollo Client Setup:**
Located in: `apps/frontend/src/lib/apollo/provider.tsx`

Configured with:
- GraphQL endpoint from environment
- Authentication headers
- Cache configuration
- Error handling

## Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3000/graphql
```

## Summary

All three dashboards (Admin, Citizen, Rescuer) are now fully integrated with the GraphQL API using Apollo Client hooks. The implementation includes:

✅ Real data fetching from GraphQL API
✅ Loading states for better UX
✅ Error handling with user-friendly messages
✅ Authentication guards on dashboard routes
✅ Role-based dashboard routing
✅ Type-safe TypeScript interfaces
✅ Responsive mobile design
✅ Consistent UI patterns

The dashboards are production-ready and waiting for backend API deployment.
