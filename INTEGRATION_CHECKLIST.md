# ✅ GraphQL Integration Checklist

Use this checklist to track your progress as you integrate GraphQL into all pages.

---

## 🎯 Phase 1: Setup (10 minutes)

- [ ] Install sonner toast library
  ```bash
  yarn add sonner
  ```

- [ ] Add Toaster to layout
  - File: `apps/frontend/src/app/layout.tsx`
  - Import: `import { Toaster } from 'sonner'`
  - Add: `<Toaster position="top-right" richColors />` in body

- [ ] Verify Apollo Client configuration
  - File: `apps/frontend/src/lib/apollo/index.ts`
  - Check HTTP link points to backend
  - Check auth token is included
  
- [ ] Start backend server
  ```bash
  yarn dev:backend
  ```

- [ ] Start frontend server
  ```bash
  yarn dev:frontend
  ```

**✓ Setup Complete!** Time: _____

---

## 🎯 Phase 2: Citizen Pages (Already Done ✅)

### ✅ Citizen Request Form
- [x] Import hooks (`useCreateRescueRequestMutation`)
- [x] Import toast (`import { toast } from 'sonner'`)
- [x] Replace mock data with mutation
- [x] Add onCompleted handler with toast
- [x] Add onError handler with toast
- [x] Remove old mock submission code
- [x] Test: Create a rescue request
- [x] Verify: Redirects to tracking page
- [x] Verify: Data appears in database

**Status**: PRODUCTION READY ✅

### ✅ Citizen Request Tracking
- [x] Import hooks (`useRescueRequestQuery`, `useCancelRescueMutation`)
- [x] Import toast
- [x] Add query with polling (5 seconds)
- [x] Add loading state
- [x] Add error handling
- [x] Remove mock data
- [x] Add cancel mutation
- [x] Test: View rescue details
- [x] Verify: Real-time updates working
- [x] Verify: Cancel works

**Status**: PRODUCTION READY ✅

### 🔴 Citizen Requests List (30 min)
- [ ] Import hooks (`useMyRescueRequestsQuery`)
- [ ] Add query with tab filtering
- [ ] Add polling (10 seconds)
- [ ] Add loading state
- [ ] Remove mock data
- [ ] Test: View all requests
- [ ] Test: Filter by tab (Active, Completed, Cancelled)
- [ ] Verify: Lists populate correctly

**Status**: TODO 🔴 | Time: _____

---

## 🎯 Phase 3: Rescuer Pages (HIGH PRIORITY)

### 🔴 Rescuer Dashboard (45 min)
- [ ] Import hooks (`useMyAssignedRescuesQuery`, `useAcceptRescueMutation`)
- [ ] Import toast
- [ ] Add query for assigned rescues
- [ ] Add polling (10 seconds)
- [ ] Add accept mutation with handlers
- [ ] Add loading state
- [ ] Remove mock data (mockVolunteer, mockActiveRescue, mockPendingAssignments)
- [ ] Extract pending assignments from data
- [ ] Extract active rescue from data
- [ ] Update handleAcceptRescue to use mutation
- [ ] Test: View dashboard
- [ ] Test: Accept assignment
- [ ] Verify: Assignment appears
- [ ] Verify: Accept button works
- [ ] Verify: Toast notifications appear

**Status**: TODO 🔴 | Time: _____

### 🔴 Rescuer Active Rescue (1 hour)
- [ ] Import hooks (`useMyAssignedRescuesQuery`, `useUpdateRescueProgressMutation`, `useCompleteRescueMutation`)
- [ ] Import toast
- [ ] Add query for active rescue
- [ ] Add polling (5 seconds)
- [ ] Add update progress mutation
- [ ] Add complete rescue mutation
- [ ] Add loading state
- [ ] Add empty state (no active rescue)
- [ ] Remove mock data (mockActiveRescue)
- [ ] Update handleStatusUpdate to use mutation
- [ ] Update handleCompleteRescue to use mutation
- [ ] Test: View active rescue
- [ ] Test: Mark "En Route"
- [ ] Test: Mark "Arrived"
- [ ] Test: Mark "In Progress"
- [ ] Test: Complete rescue with form
- [ ] Verify: Status updates propagate
- [ ] Verify: Completion works
- [ ] Verify: Redirect after completion

**Status**: TODO 🔴 | Time: _____

### 🔴 Rescuer Assignments (20 min)
- [ ] Import hooks (`useMyAssignedRescuesQuery`, `useAcceptRescueMutation`)
- [ ] Import toast
- [ ] Add query with filter (status: ASSIGNED)
- [ ] Add polling (10 seconds)
- [ ] Add accept mutation
- [ ] Add loading state
- [ ] Remove mock data
- [ ] Update accept handler
- [ ] Test: View assignments list
- [ ] Test: Accept assignment
- [ ] Verify: List populates
- [ ] Verify: Accept works

**Status**: TODO 🔴 | Time: _____

### 🔴 Rescuer History (Optional)
- [ ] Use existing `useMyAssignedRescuesQuery` with status: COMPLETED
- [ ] Display completed rescues
- [ ] Show performance metrics

**Status**: Optional | Time: _____

---

## 🎯 Phase 4: Admin Pages (HIGH PRIORITY)

### 🔴 Admin Command Center (1.5 hours)
- [ ] Import hooks (`useActiveRescuesQuery`, `useAssignRescueMutation`)
- [ ] Import toast
- [ ] Add active rescues query
- [ ] Add polling (5 seconds)
- [ ] Add assign mutation
- [ ] Add loading state
- [ ] Remove mock data (mockRescues, mockAvailableRescuers)
- [ ] Filter rescues by status
- [ ] Update handleAssignRescuer to use mutation
- [ ] Test: View command center
- [ ] Test: See rescue queue
- [ ] Test: Select rescue (details panel)
- [ ] Test: Click "Assign Rescuer"
- [ ] Test: Assign rescuer from modal
- [ ] Verify: Rescues populate
- [ ] Verify: Assignment works
- [ ] Verify: Real-time updates
- [ ] Verify: Toast notifications

**Status**: TODO 🔴 | Time: _____

### 🔴 Admin Dashboard (Optional Enhancement)
- [ ] Use `useActiveRescuesQuery` for metrics
- [ ] Display real stats instead of mock
- [ ] Show recent activity

**Status**: Optional | Time: _____

---

## 🎯 Phase 5: Testing (2 hours)

### Individual Page Testing
- [ ] Each page loads without errors
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Toast notifications appear
- [ ] Data fetches correctly
- [ ] Mutations execute successfully
- [ ] No console errors

### End-to-End Workflow Test

#### Test 1: Complete Rescue Flow
- [ ] **Step 1**: Login as citizen
- [ ] **Step 2**: Navigate to Request Rescue
- [ ] **Step 3**: Fill out multi-step form
- [ ] **Step 4**: Submit request
- [ ] **Step 5**: Verify redirect to tracking page
- [ ] **Step 6**: Verify request shows in tracking
- [ ] **Step 7**: Logout

- [ ] **Step 8**: Login as admin
- [ ] **Step 9**: Navigate to Command Center
- [ ] **Step 10**: Verify new request appears in queue
- [ ] **Step 11**: Select the request
- [ ] **Step 12**: Click "Assign Rescuer"
- [ ] **Step 13**: Select a rescuer from modal
- [ ] **Step 14**: Verify assignment success
- [ ] **Step 15**: Logout

- [ ] **Step 16**: Login as rescuer
- [ ] **Step 17**: Navigate to Dashboard
- [ ] **Step 18**: Verify assignment appears
- [ ] **Step 19**: Click "Accept"
- [ ] **Step 20**: Verify acceptance success
- [ ] **Step 21**: Logout

- [ ] **Step 22**: Login as citizen
- [ ] **Step 23**: Navigate to tracking page
- [ ] **Step 24**: Verify rescuer info appears
- [ ] **Step 25**: Verify status shows "Accepted"
- [ ] **Step 26**: Logout

- [ ] **Step 27**: Login as rescuer
- [ ] **Step 28**: Navigate to Active Rescue
- [ ] **Step 29**: Click "Mark En Route"
- [ ] **Step 30**: Verify status updates
- [ ] **Step 31**: Click "Mark Arrived"
- [ ] **Step 32**: Click "Mark In Progress"
- [ ] **Step 33**: Click "Complete Rescue"
- [ ] **Step 34**: Fill completion form
- [ ] **Step 35**: Submit completion
- [ ] **Step 36**: Verify redirect to dashboard
- [ ] **Step 37**: Verify completion status

- [ ] **Step 38**: Verify citizen sees completion

#### Test 2: Real-time Updates
- [ ] Open citizen tracking in one browser
- [ ] Open rescuer dashboard in another browser
- [ ] Accept rescue as rescuer
- [ ] Verify citizen page updates (within 5 seconds)
- [ ] Update status as rescuer
- [ ] Verify citizen page updates

#### Test 3: Error Handling
- [ ] Try to submit incomplete form → See error
- [ ] Try invalid data → See error toast
- [ ] Disconnect backend → See error state
- [ ] Reconnect → See recovery

#### Test 4: Loading States
- [ ] Slow network simulation
- [ ] Verify loading spinners appear
- [ ] Verify skeleton states (if any)
- [ ] Verify smooth transitions

### Database Verification
- [ ] Open database
- [ ] Check `rescue_requests` table has new entries
- [ ] Check `rescue_timelines` table has events
- [ ] Check `notifications` table has notifications
- [ ] Check `volunteers` table stats updated
- [ ] Verify all foreign keys correct

### Performance Testing
- [ ] Pages load quickly
- [ ] No excessive API calls
- [ ] Polling doesn't cause lag
- [ ] Mutations are fast

**✓ Testing Complete!** Time: _____

---

## 🎯 Phase 6: Polish & Deploy (Optional)

### Code Quality
- [ ] Remove all console.logs
- [ ] Remove commented code
- [ ] Remove TODO comments
- [ ] Add JSDoc comments where needed
- [ ] Format code with Prettier

### Performance
- [ ] Check bundle size
- [ ] Optimize images (if any)
- [ ] Review polling intervals (optimize if needed)

### Documentation
- [ ] Update README with new features
- [ ] Document any new environment variables
- [ ] Create deployment guide

### Deployment
- [ ] Set environment variables
- [ ] Build frontend: `yarn build:frontend`
- [ ] Build backend: `yarn build:backend`
- [ ] Deploy to hosting
- [ ] Verify production works

**✓ Deployment Complete!** Time: _____

---

## 📊 Progress Tracker

### Overall Progress
```
Setup          [✓] Complete
Citizen Pages  [✓] Complete (2/2)
Rescuer Pages  [ ] In Progress (0/3)
Admin Pages    [ ] Not Started (0/1)
Testing        [ ] Not Started
Deploy         [ ] Not Started

Total: 2/7 pages integrated (29%)
```

### Time Tracking

| Phase | Estimated | Actual | Notes |
|-------|-----------|--------|-------|
| Setup | 10 min | _____ | |
| Citizen Request Form | Done ✅ | _____ | |
| Citizen Tracking | Done ✅ | _____ | |
| Citizen Requests List | 30 min | _____ | |
| Rescuer Dashboard | 45 min | _____ | |
| Rescuer Active | 1 hour | _____ | |
| Rescuer Assignments | 20 min | _____ | |
| Admin Command | 1.5 hours | _____ | |
| Testing | 2 hours | _____ | |
| **TOTAL** | **5-8 hours** | **_____** | |

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: Run `yarn install`

### Issue: GraphQL types mismatch
**Solution**: Check `rescue.hooks.ts` interface matches schema

### Issue: Apollo Client not authenticated
**Solution**: Verify token in localStorage and authLink setup

### Issue: Backend not responding
**Solution**: Check backend is running on correct port

### Issue: Polling not working
**Solution**: Verify `pollInterval` is set in query options

### Issue: Toast not appearing
**Solution**: Check Toaster is in layout, check console for errors

---

## ✅ Completion Checklist

When ALL items below are checked, you're DONE! 🎉

- [ ] All 7 pages integrated with GraphQL
- [ ] Toast notifications working on all pages
- [ ] Real-time updates via polling working
- [ ] All mutations tested and working
- [ ] End-to-end workflow tested successfully
- [ ] Database audit trail verified
- [ ] No console errors
- [ ] Loading states proper
- [ ] Error handling comprehensive
- [ ] Code cleaned up
- [ ] Documentation updated

## 🎉 PRODUCTION READY!

---

**Start Date**: _______________
**Target Completion**: _______________ (5-8 hours after start)
**Actual Completion**: _______________

**Notes**:
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
