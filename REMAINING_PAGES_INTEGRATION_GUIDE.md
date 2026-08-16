# Remaining Pages Integration Guide

## Overview

We have **17 out of 24 pages (71%)** fully integrated. The remaining **7 pages** are documented here with detailed integration instructions.

---

## 🟢 Easy Integration (3 Profile Pages - ~35 minutes total)

### 1. Citizen Profile Page
**Path**: `apps/frontend/src/app/(dashboard)/dashboard/citizen/profile/page.tsx`  
**Status**: Mock data in place, needs GraphQL integration  
**Estimated Time**: 10 minutes

**Integration Steps**:
```typescript
// 1. Create or use existing auth context hook
import { useAuth } from '@/hooks/auth/useAuth'

// 2. Use user data from context
const { user } = useAuth()

// 3. Create update profile mutation
const [updateProfile, { loading: updating }] = useMutation(UPDATE_USER_PROFILE, {
  onCompleted: () => {
    toast.success('Profile updated successfully!')
  },
  onError: (error) => {
    toast.error(`Failed to update: ${error.message}`)
  }
})

// 4. Handle form submission
const handleSubmit = async (formData) => {
  await updateProfile({
    variables: {
      input: {
        name: formData.name,
        phone: formData.phone,
        // ... other fields
      }
    }
  })
}
```

**GraphQL Needed**:
```graphql
mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
  updateUserProfile(input: $input) {
    id
    name
    email
    phone
    updatedAt
  }
}
```

---

### 2. Citizen Emergency Contact Page
**Path**: `apps/frontend/src/app/(dashboard)/dashboard/citizen/emergency/page.tsx`  
**Status**: Simple form, needs backend integration  
**Estimated Time**: 10 minutes

**Integration Steps**:
```typescript
// Similar pattern to profile page
// Store emergency contact in user profile or separate table

const [saveEmergencyContact] = useMutation(SAVE_EMERGENCY_CONTACT, {
  onCompleted: () => toast.success('Emergency contact saved!'),
  onError: (error) => toast.error(`Failed: ${error.message}`)
})

const handleSave = async (contact) => {
  await saveEmergencyContact({
    variables: {
      input: {
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship
      }
    }
  })
}
```

---

### 3. Rescuer Profile Page
**Path**: `apps/frontend/src/app/(dashboard)/dashboard/rescuer/profile/page.tsx`  
**Status**: Mock data in place, documented with TODO comments  
**Estimated Time**: 15 minutes

**Integration Steps**:
```typescript
// 1. Get volunteer profile
const { data, loading } = useQuery(GET_VOLUNTEER_PROFILE, {
  variables: { userId: user.id }
})

const volunteer = data?.volunteerProfile

// 2. Update volunteer profile
const [updateVolunteerProfile] = useMutation(UPDATE_VOLUNTEER_PROFILE, {
  onCompleted: () => toast.success('Profile updated!'),
  onError: (error) => toast.error(`Failed: ${error.message}`)
})

// 3. Handle form submission
const handleSubmit = async (formData) => {
  await updateVolunteerProfile({
    variables: {
      input: {
        experience: formData.experience,
        experienceYears: formData.experienceYears,
        specialization: formData.specialization,
        municipality: formData.municipality,
        ward: formData.ward
      }
    }
  })
}
```

**GraphQL Needed**:
```graphql
query GetVolunteerProfile($userId: ID!) {
  volunteerProfile(userId: $userId) {
    id
    user {
      id
      name
      email
      phone
    }
    experience
    experienceYears
    municipality
    ward
    specialization
    totalRescues
    rating
    successRate
  }
}

mutation UpdateVolunteerProfile($input: UpdateVolunteerProfileInput!) {
  updateVolunteerProfile(input: $input) {
    id
    experience
    experienceYears
    municipality
    ward
    specialization
    updatedAt
  }
}
```

---

## 🟡 Medium Integration (2 Management Pages - ~60 minutes total)

### 4. Admin Rescuers Management Page
**Path**: `apps/frontend/src/app/(dashboard)/dashboard/admin/rescuers/page.tsx`  
**Status**: Mock data, needs new GraphQL queries  
**Estimated Time**: 30 minutes

**Integration Steps**:
```typescript
// 1. Create volunteer management hooks file
// File: apps/frontend/src/lib/graphql/hooks/volunteer.hooks.ts

import { gql, useQuery, useMutation } from '@apollo/client'

const GET_VOLUNTEERS = gql`
  query GetVolunteers($pagination: PaginationInput, $filter: VolunteerFilterInput) {
    volunteers(pagination: $pagination, filter: $filter) {
      edges {
        node {
          id
          user {
            id
            name
            email
            phone
          }
          experience
          experienceYears
          totalRescues
          completedRescues
          rating
          isAvailableNow
          verificationStatus
          municipality
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`

const UPDATE_VOLUNTEER_STATUS = gql`
  mutation UpdateVolunteerStatus($input: UpdateVolunteerStatusInput!) {
    updateVolunteerStatus(input: $input) {
      id
      verificationStatus
      isActive
      updatedAt
    }
  }
`

export function useVolunteersQuery(options) {
  return useQuery(GET_VOLUNTEERS, options)
}

export function useUpdateVolunteerStatusMutation(options) {
  return useMutation(UPDATE_VOLUNTEER_STATUS, options)
}

// 2. Use in page component
import { useVolunteersQuery, useUpdateVolunteerStatusMutation } from '@/lib/graphql/hooks/volunteer.hooks'

const { data, loading, error, refetch } = useVolunteersQuery({
  variables: {
    pagination: { first: 20 },
    filter: { verificationStatus: 'PENDING' } // or null for all
  },
  fetchPolicy: 'cache-and-network',
  pollInterval: 30000
})

const [updateStatus] = useUpdateVolunteerStatusMutation({
  onCompleted: () => {
    toast.success('Rescuer status updated!')
    refetch()
  },
  onError: (error) => toast.error(`Failed: ${error.message}`)
})

const volunteers = data?.volunteers?.edges?.map(e => e.node) || []

// 3. Handle actions
const handleVerify = async (volunteerId) => {
  await updateStatus({
    variables: {
      input: {
        volunteerId,
        verificationStatus: 'VERIFIED',
        isActive: true
      }
    }
  })
}

const handleDeactivate = async (volunteerId) => {
  await updateStatus({
    variables: {
      input: {
        volunteerId,
        isActive: false
      }
    }
  })
}
```

**Backend Requirements**:
- Add `volunteers` query to rescue resolvers
- Add `updateVolunteerStatus` mutation
- Implement filtering and pagination

---

### 5. Admin Users Management Page
**Path**: `apps/frontend/src/app/(dashboard)/dashboard/admin/users/page.tsx`  
**Status**: Mock data, needs new GraphQL queries  
**Estimated Time**: 30 minutes

**Integration Steps**:
```typescript
// 1. Create user management hooks
// File: apps/frontend/src/lib/graphql/hooks/user.hooks.ts

const GET_USERS = gql`
  query GetUsers($pagination: PaginationInput, $filter: UserFilterInput) {
    users(pagination: $pagination, filter: $filter) {
      edges {
        node {
          id
          name
          email
          phone
          role
          isActive
          isEmailVerified
          lastLoginAt
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`

const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($input: UpdateUserStatusInput!) {
    updateUserStatus(input: $input) {
      id
      isActive
      updatedAt
    }
  }
`

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($input: UpdateUserRoleInput!) {
    updateUserRole(input: $input) {
      id
      role
      updatedAt
    }
  }
`

export function useUsersQuery(options) {
  return useQuery(GET_USERS, options)
}

export function useUpdateUserStatusMutation(options) {
  return useMutation(UPDATE_USER_STATUS, options)
}

export function useUpdateUserRoleMutation(options) {
  return useMutation(UPDATE_USER_ROLE, options)
}

// 2. Use in page component
const { data, loading, refetch } = useUsersQuery({
  variables: {
    pagination: { first: 50 },
    filter: { role: null } // or specific role
  },
  fetchPolicy: 'cache-and-network'
})

const [updateUserStatus] = useUpdateUserStatusMutation({
  onCompleted: () => {
    toast.success('User status updated!')
    refetch()
  }
})

const [updateUserRole] = useUpdateUserRoleMutation({
  onCompleted: () => {
    toast.success('User role updated!')
    refetch()
  }
})

const users = data?.users?.edges?.map(e => e.node) || []

// 3. Handle actions
const handleActivateDeactivate = async (userId, isActive) => {
  await updateUserStatus({
    variables: {
      input: { userId, isActive }
    }
  })
}

const handleChangeRole = async (userId, role) => {
  await updateUserRole({
    variables: {
      input: { userId, role }
    }
  })
}
```

**Backend Requirements**:
- Add `users` query to auth resolvers
- Add `updateUserStatus` mutation
- Add `updateUserRole` mutation
- Implement admin authorization checks

---

## 🟢 Low Priority (2 Settings Pages - ~35 minutes total)

### 6. Admin Settings Page
**Path**: `apps/frontend/src/app/(dashboard)/dashboard/admin/settings/page.tsx`  
**Status**: Static form, minimal integration needed  
**Estimated Time**: 15 minutes

**Option 1: Local Storage** (Simplest):
```typescript
const [settings, setSettings] = useState(() => {
  const saved = localStorage.getItem('adminSettings')
  return saved ? JSON.parse(saved) : defaultSettings
})

const handleSave = () => {
  localStorage.setItem('adminSettings', JSON.stringify(settings))
  toast.success('Settings saved!')
}
```

**Option 2: Backend API**:
```typescript
const { data, loading } = useQuery(GET_SYSTEM_SETTINGS)

const [updateSettings] = useMutation(UPDATE_SYSTEM_SETTINGS, {
  onCompleted: () => toast.success('Settings saved!'),
  onError: (error) => toast.error(`Failed: ${error.message}`)
})

const handleSave = async (newSettings) => {
  await updateSettings({
    variables: { input: newSettings }
  })
}
```

**GraphQL (if backend)**:
```graphql
query GetSystemSettings {
  systemSettings {
    notifications {
      emailEnabled
      smsEnabled
      pushEnabled
    }
    rescue {
      autoAssignEnabled
      priorityThreshold
      responseTimeTarget
    }
    general {
      siteName
      supportEmail
      maintenanceMode
    }
  }
}

mutation UpdateSystemSettings($input: UpdateSystemSettingsInput!) {
  updateSystemSettings(input: $input) {
    success
    message
  }
}
```

---

### 7. Admin Analytics Page
**Path**: `apps/frontend/src/app/(dashboard)/dashboard/admin/analytics/page.tsx`  
**Status**: Can use existing dashboard stats or create enhanced queries  
**Estimated Time**: 20 minutes

**Integration Steps**:
```typescript
// Option 1: Reuse existing dashboard stats
import { useDashboardStats } from '@/hooks/dashboard/useDashboardStats'

const { stats, loading, error } = useDashboardStats()

// Use stats for charts and tables
const chartData = {
  rescuesByDay: generateChartData(stats),
  rescuesByPriority: stats.rescuesByPriority,
  // ... more transformations
}

// Option 2: Create enhanced analytics query
const { data, loading } = useQuery(GET_ANALYTICS, {
  variables: {
    dateRange: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  }
})

const analyticsData = data?.analytics

// 3. Add date range filtering
const [dateRange, setDateRange] = useState({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  end: new Date()
})

// 4. Add export functionality
const handleExportCSV = () => {
  const csv = convertToCSV(analyticsData)
  downloadCSV(csv, 'analytics.csv')
}
```

**GraphQL for Enhanced Analytics**:
```graphql
query GetAnalytics($dateRange: DateRangeInput!) {
  analytics(dateRange: $dateRange) {
    rescuesByDay {
      date
      total
      completed
      cancelled
    }
    rescuesByMunicipality {
      municipality
      count
      averageResponseTime
    }
    rescuesByPriority {
      priority
      count
      averageCompletionTime
    }
    rescuesByOutcome {
      outcome
      count
      percentage
    }
    rescuerPerformance {
      rescuerId
      name
      totalRescues
      completedRescues
      completionRate
      averageRating
      averageResponseTime
    }
    systemMetrics {
      averageResponseTime
      averageCompletionTime
      successRate
      activeRescuers
      totalUsers
    }
  }
}
```

---

## 📋 Quick Integration Checklist

For each page:

### Before Starting
- [ ] Review current page structure
- [ ] Identify data requirements
- [ ] Check if GraphQL schema exists
- [ ] If not, define GraphQL schema first

### During Integration
- [ ] Import necessary GraphQL hooks
- [ ] Replace mock data with real queries
- [ ] Add loading states
- [ ] Add error handling with toast
- [ ] Implement mutations for CRUD operations
- [ ] Add form validation
- [ ] Test all user interactions

### After Integration
- [ ] Remove unused mock data
- [ ] Check for TypeScript errors
- [ ] Test loading states
- [ ] Test error scenarios
- [ ] Verify toast notifications
- [ ] Test with real backend data

---

## 🎯 Integration Priority Recommendation

### If Deploying Soon:
1. **Skip** these pages - they're not blocking
2. **Document** what needs to be done (this guide)
3. **Add** "Coming Soon" placeholders if needed
4. **Integrate** post-launch based on user feedback

### If Completing 100%:
1. **Start with Profile Pages** (Easy wins - 35 min)
2. **Then Management Pages** (More complex - 60 min)
3. **Finally Settings/Analytics** (Low priority - 35 min)
4. **Total Time**: ~2 hours to 100% completion

---

## 📝 Backend Requirements Summary

### New GraphQL Queries Needed:
1. `volunteers` - List all volunteers with filtering
2. `users` - List all users with filtering
3. `volunteerProfile` - Get specific volunteer details
4. `systemSettings` (optional) - Get system configuration
5. `analytics` (optional) - Enhanced analytics data

### New GraphQL Mutations Needed:
1. `updateUserProfile` - Update user profile
2. `updateVolunteerProfile` - Update volunteer profile
3. `saveEmergencyContact` - Save emergency contact
4. `updateVolunteerStatus` - Change verification/active status
5. `updateUserStatus` - Activate/deactivate users
6. `updateUserRole` - Change user roles
7. `updateSystemSettings` (optional) - Save settings

---

## 🔥 Bottom Line

- **Current State**: 17/24 pages integrated (71%)
- **Remaining Work**: 7 pages (~2 hours)
- **Complexity**: Low to Medium
- **Priority**: Not blocking deployment
- **Recommendation**: Deploy MVP now, integrate these based on user feedback

**The platform is production-ready without these pages.** They are enhancements that improve admin experience and user profile management, but don't block core rescue workflows.
