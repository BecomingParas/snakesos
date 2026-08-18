# Frontend Pages - Required vs Optional

## ✅ REQUIRED for Connected Workflow (Priority 1)

These pages are **essential** for the core operational workflow:

### CITIZEN (3 Required Pages)

1. **✅ `/dashboard/citizen` (Dashboard)** - REQUIRED
   - Shows active rescue status
   - Emergency shortcuts
   - Recent requests
   - **Status**: Basic version exists, needs enhancement

2. **🔴 `/dashboard/citizen/request` (Create Rescue Request)** - REQUIRED
   - Multi-step form: Type → Location → Images → Review → Submit
   - AI identification integration
   - **Status**: MISSING - CREATE THIS FIRST
   - **This is the entry point for the entire workflow**

3. **🔴 `/dashboard/citizen/requests/[id]` (Track Request)** - REQUIRED
   - Visual status timeline
   - Rescuer information (when assigned)
   - Real-time status updates
   - Cancel option
   - **Status**: MISSING - CREATE THIS SECOND

### RESCUER (3 Required Pages)

4. **🔴 `/dashboard/rescuer` (Dashboard)** - REQUIRED
   - Availability toggle
   - Current active rescue
   - Pending assignments list
   - Quick accept/reject
   - **Status**: MISSING - CREATE THIS

5. **🔴 `/dashboard/rescuer/assignments` (View Assignments)** - REQUIRED
   - List of assigned rescues
   - Accept/Reject buttons
   - Request details
   - **Status**: MISSING - CREATE THIS

6. **🔴 `/dashboard/rescuer/active` (Active Rescue Management)** - REQUIRED
   - Current rescue details
   - Status update buttons (En Route, Arrived, In Progress)
   - Complete rescue form
   - Upload photos
   - **Status**: MISSING - CREATE THIS

### ADMIN (2 Required Pages)

7. **✅ `/dashboard/admin` (Dashboard)** - REQUIRED
   - Operational metrics
   - Recent requests
   - Available rescuers
   - **Status**: Basic version exists, needs enhancement

8. **🔴 `/dashboard/admin/command` (Command Center)** - REQUIRED
   - **THIS IS THE MOST IMPORTANT ADMIN PAGE**
   - Three-panel layout: Requests | Map | Details
   - Assign rescuer modal
   - Real-time rescue monitoring
   - **Status**: MISSING - CREATE THIS

---

## ⚠️ NICE TO HAVE (Priority 2)

These enhance the experience but aren't critical for the core workflow:

### CITIZEN

9. `/dashboard/citizen/requests` (Request List)
   - List view of all requests
   - Filter by status
   - Can be skipped initially (use dashboard instead)

10. `/dashboard/citizen/notifications` (Notifications)
    - Notification center
    - Can use in-app toasts initially

11. `/dashboard/citizen/emergency` (Emergency Info)
    - Snakebite guidance
    - Hospital finder
    - Can link to public pages initially

12. `/dashboard/citizen/profile` (Profile Settings)
    - Edit profile
    - Not critical for workflow

### RESCUER

13. `/dashboard/rescuer/history` (Rescue History)
    - Past rescues
    - Performance stats
    - Nice analytics but not essential for workflow

14. `/dashboard/rescuer/map` (Map View)
    - Map of rescues
    - Nice to have but not critical

15. `/dashboard/rescuer/notifications` (Notifications)
    - Can use toasts initially

16. `/dashboard/rescuer/profile` (Profile)
    - Edit settings
    - Not critical

### ADMIN

17. `/dashboard/admin/rescues` (All Rescues List)
    - Table view of rescues
    - Command center is more important

18. `/dashboard/admin/map` (Map View)
    - Included in command center
    - Separate page optional

19. `/dashboard/admin/rescuers` (Rescuer Management)
    - Manage volunteer profiles
    - Not critical for rescue workflow

20. `/dashboard/admin/users` (User Management)
    - Manage users
    - Not critical for rescue workflow

21. `/dashboard/admin/analytics` (Analytics Dashboard)
    - Charts and reports
    - Nice to have

22. `/dashboard/admin/notifications` (Notifications)
    - Can use toasts

23. `/dashboard/admin/settings` (Settings)
    - System configuration
    - Not critical

---

## ❌ NOT NEEDED (Remove from Sidebar)

These pages don't fit the operational rescue workflow:

- `/dashboard/citizen/donate` - Move to public area
- `/dashboard/citizen/snake-info` - Move to public area
- `/dashboard/admin/coverage` - Optional analytics
- `/dashboard/admin/alerts` - Use notifications instead
- `/dashboard/rescuer/schedule` - Not needed for workflow

---

## 📊 Priority Summary

### MUST BUILD NOW (8 Pages)
1. ✅ Citizen Dashboard (enhance existing)
2. 🔴 Citizen Request Form **(START HERE)**
3. 🔴 Citizen Request Tracking
4. 🔴 Rescuer Dashboard
5. 🔴 Rescuer Assignments
6. 🔴 Rescuer Active Rescue
7. ✅ Admin Dashboard (enhance existing)
8. 🔴 Admin Command Center **(CRITICAL)**

### BUILD LATER (15 Pages)
- Request lists, history, profiles, settings, etc.

### DON'T BUILD (5+ Pages)
- Pages that don't fit operational workflow

---

## 🎯 Implementation Order

### Phase 1: Citizen Flow (Days 1-2)
1. Create rescue request form
2. Create request tracking page
3. Enhance citizen dashboard

### Phase 2: Rescuer Flow (Days 3-4)
4. Create rescuer dashboard
5. Create assignments page
6. Create active rescue management

### Phase 3: Admin Flow (Days 5-6)
7. Enhance admin dashboard
8. Create command center (3-panel interface)

### Phase 4: Polish (Days 7-8)
9. Add real-time updates
10. Add notification toasts
11. Test end-to-end workflow

---

## 🗂️ Folder Structure

```
apps/frontend/src/app/(dashboard)/dashboard/
├── citizen/
│   ├── page.tsx                    ✅ EXISTS (enhance)
│   ├── request/
│   │   └── page.tsx                🔴 CREATE (Priority 1)
│   ├── requests/
│   │   ├── page.tsx                ⚠️ OPTIONAL
│   │   └── [id]/
│   │       └── page.tsx            🔴 CREATE (Priority 1)
│   ├── notifications/
│   │   └── page.tsx                ⚠️ OPTIONAL
│   ├── emergency/
│   │   └── page.tsx                ⚠️ OPTIONAL
│   ├── map/
│   │   └── page.tsx                ✅ EXISTS
│   └── profile/
│       └── page.tsx                ⚠️ OPTIONAL
│
├── rescuer/
│   ├── page.tsx                    🔴 CREATE (Priority 1)
│   ├── assignments/
│   │   ├── page.tsx                🔴 CREATE (Priority 1)
│   │   └── [id]/
│   │       └── page.tsx            🔴 (can merge with active)
│   ├── active/
│   │   └── page.tsx                🔴 CREATE (Priority 1)
│   ├── history/
│   │   └── page.tsx                ⚠️ OPTIONAL
│   ├── map/
│   │   └── page.tsx                ✅ EXISTS
│   ├── notifications/
│   │   └── page.tsx                ⚠️ OPTIONAL
│   └── profile/
│       └── page.tsx                ⚠️ OPTIONAL
│
└── admin/
    ├── page.tsx                    ✅ EXISTS (enhance)
    ├── command/
    │   └── page.tsx                🔴 CREATE (Priority 1 - CRITICAL!)
    ├── rescues/
    │   ├── page.tsx                ✅ EXISTS
    │   └── [id]/
    │       └── page.tsx            ⚠️ OPTIONAL
    ├── rescuers/
    │   └── page.tsx                ⚠️ OPTIONAL
    ├── users/
    │   └── page.tsx                ⚠️ OPTIONAL
    ├── analytics/
    │   └── page.tsx                ⚠️ OPTIONAL
    ├── map/
    │   └── page.tsx                ✅ EXISTS
    ├── notifications/
    │   └── page.tsx                ⚠️ OPTIONAL
    └── settings/
        └── page.tsx                ⚠️ OPTIONAL
```

---

## ✅ Simplified Sidebar (Updated)

### CITIZEN
- Dashboard
- Request Rescue ← CREATE THIS
- My Requests ← VIEW LIST
- Track Rescue (Map)
- Notifications
- Profile

### RESCUER
- Dashboard ← CREATE THIS
- Assignments ← CREATE THIS
- Active Rescue ← CREATE THIS
- Map
- History
- Notifications
- Profile

### ADMIN
- Dashboard
- **Command Center** ← CREATE THIS (MOST IMPORTANT!)
- All Rescues
- Live Map
- Rescuers
- Users
- Analytics
- Notifications
- Settings

---

## 🎯 Core Workflow Pages Only

If you want to build **ONLY** what's needed for the connected workflow:

### Minimum Viable Product (8 pages):
1. Citizen: Dashboard, Request Form, Request Tracking
2. Rescuer: Dashboard, Assignments, Active Rescue
3. Admin: Dashboard, Command Center

**Everything else is optional enhancement.**

---

## 📝 Next Steps

1. **Update sidebar** ✅ DONE
2. **Create Citizen Request Form** ← START HERE
3. **Create Citizen Request Tracking**
4. **Create Rescuer Dashboard**
5. **Create Rescuer Assignments**
6. **Create Rescuer Active Rescue**
7. **Create Admin Command Center**
8. **Test complete workflow**

**Focus on the 8 required pages. Skip everything else for now.**
