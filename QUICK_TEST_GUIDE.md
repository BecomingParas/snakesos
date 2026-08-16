# 🚀 Quick Test Guide - SnakeSOS MVP

## One-Time Setup (5 minutes)

```bash
# 1. Seed database with test data
cd libs/database
pnpm seed
```

**Test Accounts Created:**
- **Citizen**: citizen@test.com / password123
- **Rescuer**: rescuer@test.com / password123  
- **Admin**: admin@test.com / password123

---

## Start Servers (2 terminals)

```bash
# Terminal 1 - Backend (Port 4000)
cd apps/backend
pnpm dev

# Terminal 2 - Frontend (Port 3000)
cd apps/frontend  
pnpm dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend GraphQL: http://localhost:4000/graphql

---

## 🎬 Complete Test Flow (10 minutes)

### Step 1: Citizen Submits Request

1. Open http://localhost:3000
2. Login as **citizen@test.com** / password123
3. Go to **Dashboard** → **Request Rescue**
4. Fill form:
   - Type: Snake Inside Property
   - Location: Use GPS or enter manually
   - Description: "Large brown snake in living room"
5. Click **Submit Request**
6. ✅ You should see success toast
7. Note the reference number (e.g., BR-2024-105)

### Step 2: Admin Assigns Rescuer

1. **Logout** and login as **admin@test.com** / password123
2. Go to **Dashboard** → **Command Center**
3. See your new request in the left queue
4. Click on it to select
5. Click **Assign Rescuer** button
6. Select a rescuer from the modal
7. ✅ You should see success toast
8. Notice status changed to "Assigned"

### Step 3: Rescuer Accepts & Completes

1. **Logout** and login as **rescuer@test.com** / password123
2. Go to **Dashboard**
3. See the assignment in "Pending Assignments"
4. Click **Accept** button
5. ✅ Success toast → Redirected to Active Rescue page
6. Click **Mark En Route** button
7. Click **Mark Arrived** button  
8. Click **Complete Rescue** button
9. Fill completion form:
   - Outcome: Snake Rescued & Relocated
   - Report: "Successfully captured and relocated to forest area"
10. Click **Submit & Complete**
11. ✅ Success toast → Redirected to dashboard

### Step 4: Citizen Sees Completion

1. **Logout** and login as **citizen@test.com** / password123
2. Go to **Dashboard** → **My Requests**
3. Find your request
4. Click on it to view details
5. ✅ See "COMPLETED" status
6. ✅ See complete timeline with all updates
7. ✅ See rescuer's report

---

## 🔍 What to Check

### ✅ Real-time Updates
- Leave a page open while making changes in another account
- Should auto-update every 10 seconds

### ✅ Toast Notifications
- Every action should show a toast:
  - Success (green)
  - Error (red)
  - Info (blue)

### ✅ Loading States
- Buttons show "Loading..." with spinner during API calls
- No double-submissions possible

### ✅ Error Handling
- Try invalid inputs
- Should show friendly error messages

---

## 🐛 Common Issues

### Database Not Seeded?
```bash
cd libs/database
pnpm seed
```

### Backend Not Running?
```bash
cd apps/backend
pnpm dev
```

### Frontend Can't Connect?
Check `.env` file:
```
NEXT_PUBLIC_GRAPHQL_URI=http://localhost:4000/graphql
```

### Still Having Issues?
Check:
1. Both servers are running
2. Ports 3000 and 4000 are free
3. Database is accessible
4. `.env` files are correct

---

## 📊 Test Data Overview

### Users (All password: password123)
- citizen@test.com (Citizen role)
- rescuer@test.com (Rescuer role)
- admin@test.com (Admin role)

### Pre-seeded Rescues
- 5 rescue requests in various states
- PENDING, ASSIGNED, IN_PROGRESS, COMPLETED statuses
- Different priorities (HIGH, MEDIUM, LOW)

### Volunteers
- 2 rescuers available for assignment
- Different experience levels
- Various ratings

---

## 🎯 Quick Feature Checklist

Test each feature:

- [ ] Citizen can submit rescue request
- [ ] Admin sees request in Command Center
- [ ] Admin can assign rescuer
- [ ] Rescuer sees assignment in dashboard
- [ ] Rescuer can accept assignment
- [ ] Rescuer can update status (En Route, Arrived)
- [ ] Rescuer can complete with report
- [ ] Citizen sees real-time updates
- [ ] All toasts appear correctly
- [ ] No console errors
- [ ] Loading states work
- [ ] Error messages are clear

---

## 🚀 Integration Status

**Completed**: 7/24 pages (29%)
**MVP Status**: ✅ 100% Operational

**Integrated Pages:**
1. ✅ Citizen Request Form
2. ✅ Citizen Requests List
3. ✅ Citizen Request Tracking
4. ✅ Rescuer Dashboard
5. ✅ Rescuer Assignments
6. ✅ Rescuer Active Rescue
7. ✅ Admin Command Center

**Full Workflow**: Citizen → Admin → Rescuer ✅ **WORKING**

---

## 📝 Next Steps

After testing MVP, integrate remaining pages:

1. **Dashboard stats pages** (3 pages - 1.5h)
2. **List/history pages** (1 page - 30m)
3. **Optional pages** (13 pages - 3h)

Total: ~5-6 hours for 100% completion

---

## 🎉 Happy Testing!

The MVP is fully functional. All core features are integrated with:
- Real-time GraphQL queries
- Toast notifications
- Error handling  
- Loading states
- Optimistic updates

**Your rescue management system is live!** 🐍🚑
