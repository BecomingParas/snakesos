# SnakeSOS Complete Workflow Implementation Plan

## Current Status Analysis

### ✅ What Already Exists
1. **Database Schema (Prisma)**
   - User, Volunteer, RescueRequest models
   - RescueTimeline for audit trail
   - Notification system
   - Complete status enums (PENDING, ASSIGNED, ACCEPTED, IN_PROGRESS, COMPLETED, etc.)

2. **GraphQL Infrastructure**
   - Apollo Server configured
   - Authentication/Authorization working
   - Basic rescue queries (rescueRequest, rescueRequests, myRescueRequests, myAssignedRescues)
   - Basic mutations (createRescueRequest, assignRescue)

3. **Frontend Infrastructure**
   - Next.js App Router
   - Apollo Client configured
   - Authentication working
   - Basic dashboard structure

### ❌ What's Missing (Critical for Connected Workflow)

1. **Backend Mutations - INCOMPLETE**
   - ✅ createRescueRequest
   - ✅ assignRescue
   - ❌ acceptRescue (volunteer accepts assignment)
   - ❌ updateRescueStatus (status transitions: EN_ROUTE, ARRIVED, IN_PROGRESS)
   - ❌ completeRescue (mark rescue complete)
   - ❌ cancelRescue
   - ❌ Timeline events creation

2. **Real-time Synchronization**
   - ❌ GraphQL subscriptions
   - ❌ Status change notifications
   - ❌ Live location updates

3. **Frontend Workflows**
   - ❌ Citizen rescue request workflow
   - ❌ Citizen tracking page
   - ❌ Rescuer assignment acceptance
   - ❌ Rescuer status updates
   - ❌ Admin command center
   - ❌ Notification system

## Implementation Phases

### PHASE 1: Complete Backend Mutations ⚡ **START HERE**

Complete the missing backend mutations so we have the full operational API:

1. **acceptRescue**
   - Rescuer accepts assignment
   - Update status: ASSIGNED → ACCEPTED
   - Create timeline event
   - Notify citizen
   - Notify admin

2. **updateRescueStatus**
   - Generic status transition
   - Support: ACCEPTED → IN_PROGRESS, IN_PROGRESS → COMPLETED
   - Validate state machine
   - Create timeline events
   - Trigger notifications

3. **completeRescue**
   - Mark rescue complete
   - Record outcome
   - Upload rescue images
   - Create completion timeline event
   - Notify all parties

4. **cancelRescue**
   - Allow citizen or admin to cancel
   - Record reason
   - Update volunteer metrics
   - Notify parties

5. **Timeline Event Creation**
   - Automatic timeline events for every status change
   - Manual event addition by rescuer/admin
   - Location tracking

### PHASE 2: Citizen Workflow

Build complete citizen experience:

1. **Rescue Request Flow**
   - Multi-step form: Type → Location → Images → Description → Review → Submit
   - AI identification integration
   - Location capture
   - Image upload
   - Request confirmation

2. **Request Tracking Page** `/citizen/requests/[id]`
   - Visual status timeline
   - Assigned rescuer info (when assigned)
   - Real-time status updates
   - Map showing location (when rescuer en route)
   - Chat/contact rescuer
   - Cancel request option

3. **Citizen Dashboard** `/citizen`
   - Active rescue (if any)
   - Recent requests
   - Emergency shortcuts
   - Snake ID shortcut

### PHASE 3: Rescuer Workflow

Build complete rescuer experience:

1. **Rescuer Dashboard** `/rescuer`
   - Availability toggle
   - Current rescue
   - Pending assignments
   - Today's stats
   - Quick accept buttons

2. **Assignment Detail Page** `/rescuer/requests/[id]`
   - Request details
   - Location/map
   - Snake info + AI identification
   - Safety warnings
   - Accept/Reject buttons
   - Navigation button

3. **Active Rescue Page** `/rescuer/active/[id]`
   - Status update buttons: "En Route" → "Arrived" → "Rescue Started" → "Complete"
   - Location sharing toggle
   - Upload rescue photos
   - Complete rescue form (outcome, notes)
   - Contact citizen

### PHASE 4: Admin Command Center

Build operational control center:

1. **Admin Command Center** `/admin/command`
   ```
   ┌──────────────┬────────────────────┬──────────────┐
   │ REQUESTS     │    LIVE MAP        │  DETAILS     │
   │              │                    │              │
   │ #REQ-001 🔴  │   [Map showing]    │  Request Info│
   │ #REQ-002 🟡  │   - Requests       │  Snake Info  │
   │ #REQ-003 🟢  │   - Rescuers       │  Timeline    │
   │              │   - Routes         │  Actions     │
   └──────────────┴────────────────────┴──────────────┘
   ```

2. **Request Management**
   - Real-time request queue
   - Priority sorting
   - Status filtering
   - Assign rescuer modal
   - Reassign capability
   - View full history

3. **Rescuer Availability**
   - Live rescuer status
   - Location (when shared)
   - Current workload
   - Performance metrics

### PHASE 5: Real-time Synchronization

Implement live updates:

1. **GraphQL Subscriptions**
   - `rescueStatusChanged(rescueId: ID!)`
   - `rescueAssigned(userId: ID!)`
   - `newRescueRequest(adminId: ID!)`

2. **Apollo Cache Updates**
   - Optimistic responses
   - Cache invalidation
   - Refetch queries

3. **Notification System**
   - Real-time toast notifications
   - In-app notification center
   - Badge counts
   - Sound alerts for critical events

### PHASE 6: AI Integration & Emergency Workflows

1. **Snake Identification** `/identify`
   - Image upload
   - AI analysis
   - Species database
   - Risk assessment
   - "Create Rescue Request" button

2. **Snakebite Emergency** `/emergency`
   - Emergency warning
   - First-aid instructions
   - Hospital discovery
   - Emergency contact
   - Create emergency rescue request

### PHASE 7: Testing & Validation

End-to-end workflow test:

1. Citizen creates rescue request
2. Request appears in admin dashboard
3. Admin assigns rescuer
4. Rescuer receives notification
5. Rescuer accepts
6. Citizen sees rescuer assigned
7. Rescuer updates status to "En Route"
8. All parties see status update
9. Rescuer marks "Arrived"
10. Rescuer completes rescue
11. Citizen receives completion
12. Admin sees analytics update

## Critical Design Principles

### 1. **State Machine Enforcement**
```
PENDING → ASSIGNED → ACCEPTED → IN_PROGRESS → COMPLETED
                                              ↓
                                          CANCELLED
```

Every status transition must:
- Be validated server-side
- Create timeline event
- Trigger notifications
- Update metrics
- Be audited

### 2. **No Fake Workflows**
When a button is clicked:
1. GraphQL mutation called
2. Backend updates database
3. Backend creates timeline event
4. Backend sends notifications
5. Apollo cache updated
6. All connected UIs refresh

### 3. **Authorization Per Operation**
- Citizen: create, view own, cancel own
- Rescuer: accept, update status, complete
- Admin: assign, reassign, view all, manage

### 4. **Notification Strategy**
Every important action triggers notifications:
- Database: Notification record created
- In-app: Apollo subscription/polling
- Email: Background job (optional)
- SMS: For critical events (optional)

## Next Steps

1. ✅ Document current state (this file)
2. ⚡ **Phase 1**: Complete backend mutations
3. Generate GraphQL types
4. Phase 2: Citizen workflow
5. Phase 3: Rescuer workflow
6. Phase 4: Admin command center
7. Phase 5: Real-time sync
8. Phase 6: AI & emergency
9. Phase 7: End-to-end testing

## File Structure

```
libs/
├── contracts/
│   └── graphql/
│       └── rescue/
│           ├── schema.graphql (✅ exists)
│           ├── queries.graphql (✅ exists)
│           ├── mutations.graphql (⚠️ incomplete)
│           ├── subscriptions.graphql (❌ create)
│           ├── inputs.graphql (✅ exists)
│           └── enums.graphql (✅ exists)
│
├── backend/
│   └── modules/
│       └── rescue/
│           ├── application/
│           │   ├── use-cases/
│           │   │   ├── create-rescue.use-case.ts (✅)
│           │   │   ├── assign-volunteer.use-case.ts (✅)
│           │   │   ├── accept-rescue.use-case.ts (❌)
│           │   │   ├── update-status.use-case.ts (❌)
│           │   │   └── complete-rescue.use-case.ts (❌)
│           │   └── queries/
│           │       ├── get-rescue.query.ts (✅)
│           │       └── list-rescues.query.ts (✅)
│           ├── domain/
│           │   └── rescue-status-machine.ts (❌ create)
│           └── infrastructure/
│               └── graphql/
│                   └── resolvers/
│                       ├── rescue-query.resolver.ts (✅)
│                       └── rescue-mutation.resolver.ts (⚠️ incomplete)
│
apps/
└── frontend/
    └── src/
        ├── app/
        │   └── (dashboard)/
        │       ├── citizen/
        │       │   ├── page.tsx (⚠️ basic)
        │       │   ├── request/
        │       │   │   └── page.tsx (❌)
        │       │   └── requests/
        │       │       └── [id]/
        │       │           └── page.tsx (❌)
        │       ├── rescuer/
        │       │   ├── page.tsx (❌)
        │       │   ├── requests/
        │       │   │   └── [id]/
        │       │   │       └── page.tsx (❌)
        │       │   └── active/
        │       │       └── [id]/
        │       │           └── page.tsx (❌)
        │       └── admin/
        │           ├── page.tsx (⚠️ basic)
        │           └── command/
        │               └── page.tsx (❌)
        └── components/
            └── rescue/
                ├── RequestForm.tsx (❌)
                ├── StatusTimeline.tsx (❌)
                ├── RescuerCard.tsx (❌)
                ├── RequestDetails.tsx (❌)
                └── AssignRescuerModal.tsx (❌)
```

## Success Criteria

The workflow is complete when:

1. ✅ Citizen can create rescue request
2. ✅ Request automatically appears in admin dashboard
3. ✅ Admin can assign rescuer
4. ✅ Rescuer receives notification
5. ✅ Rescuer can accept/reject
6. ✅ Citizen sees rescuer assignment
7. ✅ Rescuer can update status (En Route, Arrived, In Progress)
8. ✅ All parties see real-time status updates
9. ✅ Rescuer can complete rescue with photos
10. ✅ Citizen receives completion notification
11. ✅ Admin sees updated analytics
12. ✅ Complete audit trail in rescue_timelines table
13. ✅ No fake local-only UI state
14. ✅ All important actions are audited
15. ✅ Authorization enforced server-side

---

**Current Focus**: Phase 1 - Complete Backend Mutations
