# SnakeSOS Dashboard Setup

## 🎉 Dashboard Implementation Complete!

Three role-based dashboards have been created for the SnakeSOS platform:

### **Dashboard Routes:**

1. **Main Dashboard** (`/dashboard`)
   - Auto-redirects based on user role
   - Checks localStorage for demo (replace with real auth)

2. **Admin Dashboard** (`/dashboard/admin`)
   - Full system overview
   - User management
   - Volunteer management
   - Analytics and reports
   - System settings

3. **Rescuer Dashboard** (`/dashboard/rescuer`)
   - Assigned rescue missions
   - Personal rescue history
   - Performance stats and ratings
   - Quick navigation to rescue locations
   - Status management (available/unavailable)

4. **Citizen Dashboard** (`/dashboard/citizen`)
   - Submit rescue requests
   - Track personal requests
   - View rescue status
   - Emergency quick actions
   - Safety tips and guidance

---

## **File Structure:**

```
apps/frontend/src/
├── app/
│   └── (dashboard)/                    # Dashboard route group
│       ├── layout.tsx                  # Dashboard layout with nav
│       └── dashboard/
│           ├── page.tsx                # Auto-router based on role
│           ├── admin/
│           │   └── page.tsx            # Admin dashboard
│           ├── rescuer/
│           │   └── page.tsx            # Rescuer dashboard
│           └── citizen/
│               └── page.tsx            # Citizen dashboard
└── components/
    └── dashboard/
        ├── dashboard-nav.tsx           # Role-based navigation
        └── index.ts                    # Exports
```

---

## **User Roles (from GraphQL schema):**

1. `CITIZEN` - Regular users who submit rescue requests
2. `VOLUNTEER` - Approved volunteers (not yet verified)
3. `VERIFIED_RESCUER` - Certified snake rescuers
4. `DISTRICT_COORDINATOR` - District-level managers
5. `ADMIN` - System administrators
6. `SUPER_ADMIN` - Super administrators

---

## **Features by Dashboard:**

### **Admin Dashboard:**
- ✅ System-wide statistics
  - Active rescues count
  - Total rescues (all-time)
  - Active volunteers
  - Average response time
  - Coverage areas
  - Critical alerts
- ✅ Recent activity feed
- ✅ Quick actions:
  - View all rescues
  - Manage volunteers
  - User management
  - Analytics

### **Rescuer Dashboard:**
- ✅ Personal statistics
  - Total rescues completed
  - Monthly rescues
  - Rating (out of 5 stars)
  - Assigned rescues count
- ✅ Assigned rescue list with:
  - Species information
  - Location and distance
  - Urgency level
  - Quick navigation
  - Contact reporter
- ✅ Status toggle (available/unavailable)
- ✅ Quick actions:
  - View all rescues
  - Rescue history
  - Profile settings

### **Citizen Dashboard:**
- ✅ Personal request statistics
  - Total requests
  - Active requests
  - Completed requests
- ✅ Emergency request banner with:
  - Quick rescue request button
  - Hotline call button
- ✅ My rescue requests list showing:
  - Request ID and status
  - Snake species
  - Location
  - Assigned rescuer
  - ETA or completion status
  - Actions (track, call, feedback)
- ✅ Quick actions:
  - Identify a snake (AI)
  - Request rescue
  - Become a volunteer
- ✅ Safety tips section

---

## **Navigation:**

The `DashboardNav` component provides:
- ✅ Role-based menu items
- ✅ Active route highlighting
- ✅ Mobile-responsive with hamburger menu
- ✅ Quick access to:
  - Dashboard home
  - Role-specific pages
  - Profile/settings
  - Logout
  - Back to public site

---

## **Testing the Dashboards:**

### **Quick Test (Demo Mode):**

```bash
# Start the dev server
yarn dev:frontend

# Visit:
http://localhost:4200/dashboard
```

### **Set User Role (Browser Console):**

```javascript
// For Admin dashboard:
localStorage.setItem('userRole', 'ADMIN')
window.location.href = '/dashboard'

// For Rescuer dashboard:
localStorage.setItem('userRole', 'VERIFIED_RESCUER')
window.location.href = '/dashboard'

// For Citizen dashboard:
localStorage.setItem('userRole', 'CITIZEN')
window.location.href = '/dashboard'
```

---

## **Next Steps - Integration:**

### **1. Connect to Real Auth:**

Update `app/(dashboard)/dashboard/page.tsx`:
```typescript
// Replace this:
const userRole = localStorage.getItem('userRole') || 'CITIZEN'

// With real auth:
const { user } = useAuth()
const userRole = user?.role || 'CITIZEN'
```

### **2. Add Auth Protection:**

Update `app/(dashboard)/layout.tsx`:
```typescript
'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { redirect } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingSpinner />
  if (!user) redirect('/login')
  
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <main className="flex-1 bg-background">{children}</main>
    </div>
  )
}
```

### **3. Create GraphQL Queries:**

Create queries for dashboard data in `libs/contracts/src/lib/graphql/`:

```graphql
# dashboard/queries.graphql
query GetUserDashboard {
  me {
    id
    name
    role
    rescueRequests(pagination: { limit: 10 }) {
      edges {
        id
        species
        location
        status
        reportedAt
      }
    }
  }
}

query GetAdminDashboard {
  dashboardStats {
    activeRescues
    totalRescues
    activeVolunteers
    avgResponseTime
  }
  recentActivities(limit: 10) {
    id
    action
    timestamp
  }
}
```

### **4. Create Dashboard Hooks:**

```typescript
// hooks/dashboard/useDashboard.ts
export function useDashboard() {
  const { data, loading } = useQuery(GET_USER_DASHBOARD)
  return { dashboard: data?.me, loading }
}
```

### **5. Update Dashboard Pages:**

Replace static data with real API calls:
```typescript
const { dashboard, loading } = useDashboard()
```

---

## **Summary:**

✅ **3 Role-Based Dashboards Created**
✅ **Responsive Navigation Component**
✅ **Auto-Router Based on User Role**
✅ **Modern UI with Stats Cards**
✅ **Quick Actions for Each Role**
✅ **Mobile-Friendly Design**

**Ready for API Integration!** 🚀

All dashboards are using demo data. Connect them to your GraphQL backend to make them fully functional.
