# SnakeSOS Rescue Workflow Diagram

## Two Separate Workflows

### Workflow A: Admin Assignment (Existing)
```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN ASSIGNMENT WORKFLOW                 │
└─────────────────────────────────────────────────────────────┘

    CITIZEN                ADMIN              RESCUER
       │                     │                   │
       │ Report Emergency    │                   │
       ├────────────────────>│                   │
       │                     │                   │
       │  ┌──────────────────┴───────────────┐   │
       │  │ Status: PENDING                  │   │
       │  │ volunteerId: null                │   │
       │  │ Queue: No (admin will assign)    │   │
       │  └──────────────────┬───────────────┘   │
       │                     │                   │
       │                     │ Manually Assign   │
       │                     │ (select rescuer)  │
       │                     ├──────────────────>│
       │                     │                   │
       │  ┌──────────────────┴───────────────────┴──┐
       │  │ Status: ASSIGNED                         │
       │  │ volunteerId: R1                          │
       │  │ assignedBy: Admin                        │
       │  └──────────────────┬───────────────────────┘
       │                     │                   │
       │                     │                   │ Confirm
       │                     │                   │ Assignment
       │                     │                   │
       │  ┌──────────────────┴───────────────────┴──┐
       │  │ Status: ACCEPTED                         │
       │  │ acceptedAt: [timestamp]                  │
       │  │ Mutation: acceptRescue                   │
       │  └──────────────────┬───────────────────────┘
       │                     │                   │
       │                     │                   │ Start
       │                     │                   │ Rescue
       │  ┌──────────────────┴───────────────────────┘
       │  │ Status: IN_PROGRESS                      │
       │  └──────────────────┬───────────────────────┐
       │                     │                   │
       │                     │                   │ Complete
       │                     │                   │ Rescue
       │  ┌──────────────────┴───────────────────┴──┐
       │  │ Status: COMPLETED                        │
       │  │ outcome: SUCCESS                         │
       │  └──────────────────────────────────────────┘
       │
```

**Use Case:** `AcceptRescueUseCase`  
**Mutation:** `acceptRescue`  
**UI:** "Pending Assignments" section on rescuer dashboard

---

### Workflow B: Queue Self-Service (NEW)
```
┌─────────────────────────────────────────────────────────────┐
│                   QUEUE SELF-SERVICE WORKFLOW                │
└─────────────────────────────────────────────────────────────┘

    CITIZEN              SYSTEM            RESCUER 1        RESCUER 2
       │                    │                  │                │
       │ Report Emergency   │                  │                │
       ├───────────────────>│                  │                │
       │                    │                  │                │
       │  ┌─────────────────┴────────────┐     │                │
       │  │ Status: PENDING              │     │                │
       │  │ volunteerId: null            │     │                │
       │  │ Queue: Yes (visible to all)  │     │                │
       │  └─────────────────┬────────────┘     │                │
       │                    │                  │                │
       │                    │  View Queue      │                │
       │                    │<─────────────────┤                │
       │                    │                  │                │
       │                    │  Show Available  │                │
       │                    │  Rescues         │                │
       │                    ├─────────────────>│                │
       │                    │                  │                │
       │                    │        View Queue                 │
       │                    │<──────────────────────────────────┤
       │                    │                  │                │
       │                    │        Show Available             │
       │                    │        Rescues                    │
       │                    ├──────────────────────────────────>│
       │                    │                  │                │
       │                    │  Accept (click)  │                │
       │                    │<─────────────────┤                │
       │                    │                  │                │
       │  ┌─────────────────┴─────────┐        │                │
       │  │ ATOMIC CHECK:            │        │                │
       │  │ WHERE status=PENDING     │        │                │
       │  │   AND volunteerId=NULL   │        │                │
       │  │                          │        │                │
       │  │ IF match: UPDATE to R1   │        │                │
       │  │ ELSE: return count=0     │        │                │
       │  └─────────────────┬─────────┘        │                │
       │                    │                  │                │
       │  ┌─────────────────┴─────────┐        │                │
       │  │ Status: ASSIGNED          │        │                │
       │  │ Status: ACCEPTED          │        │                │
       │  │ volunteerId: R1           │        │                │
       │  │ acceptedAt: [timestamp]   │        │                │
       │  │ assignedAt: [timestamp]   │        │                │
       │  │ Mutation: acceptFromQueue │        │                │
       │  └─────────────────┬─────────┘        │                │
       │                    │                  │                │
       │                    │  ✅ Success      │                │
       │                    │  Redirect        │                │
       │                    ├─────────────────>│                │
       │                    │                  │                │
       │                    │        Accept (click) ──race───>  │
       │                    │        (too late!)                │
       │                    │<──────────────────────────────────┤
       │                    │                  │                │
       │  ┌─────────────────┴─────────┐        │                │
       │  │ ATOMIC CHECK:            │        │                │
       │  │ WHERE status=PENDING     │        │                │
       │  │   AND volunteerId=NULL   │        │                │
       │  │                          │        │                │
       │  │ NO MATCH (R1 assigned)   │        │                │
       │  │ return count=0           │        │                │
       │  └─────────────────┬─────────┘        │                │
       │                    │                  │                │
       │                    │        ❌ Error: Already Assigned │
       │                    │        "Another rescuer accepted" │
       │                    ├──────────────────────────────────>│
       │                    │                  │                │
       │                    │  Continue        │                │
       │                    │  to IN_PROGRESS  │                │
       │                    ├─────────────────>│                │
       │                    │                  │                │
       │  ┌─────────────────┴─────────┐        │                │
       │  │ Status: IN_PROGRESS       │        │                │
       │  └─────────────────┬─────────┘        │                │
       │                    │                  │                │
       │                    │  Complete        │                │
       │                    │<─────────────────┤                │
       │  ┌─────────────────┴─────────┐        │                │
       │  │ Status: COMPLETED         │        │                │
       │  │ outcome: SUCCESS          │        │                │
       │  └───────────────────────────┘        │                │
       │
```

**Use Case:** `AcceptFromQueueUseCase` (NEW)  
**Mutation:** `acceptFromQueue` (NEW)  
**UI:** `/dashboard/rescuer/queue` page (NEW)

---

## Race Condition Prevention

### Without Atomic Check (WRONG ❌)
```
Time    Rescuer 1              Database              Rescuer 2
─────────────────────────────────────────────────────────────────
T0      Click "Accept"                               Click "Accept"
        
T1      Read rescue:                                 Read rescue:
        status=PENDING ✓                             status=PENDING ✓
        volunteerId=null ✓                           volunteerId=null ✓
        
T2      Update:                                      Update:
        volunteerId=R1                               volunteerId=R2
        
T3      SUCCESS ✅                                   SUCCESS ✅
        (WRONG!)                                     (WRONG!)
        
Result: BOTH ASSIGNED (RACE CONDITION!)
Database: volunteerId=R2 (overwrites R1)
Citizen: Confused (2 notifications? or just R2?)
```

### With Atomic Check (CORRECT ✅)
```
Time    Rescuer 1              Database              Rescuer 2
─────────────────────────────────────────────────────────────────
T0      Click "Accept"                               Click "Accept"
        
T1      updateMany({                                 updateMany({
          WHERE:                                       WHERE:
            status=PENDING                               status=PENDING
            volunteerId=null                             volunteerId=null
          SET:                                         SET:
            volunteerId=R1                               volunteerId=R2
        })                                           })
        
T2      Database checks:        ┌───────┐            Database checks:
        ✓ status=PENDING        │LOCKED │            ⏳ Waiting for lock...
        ✓ volunteerId=null      │       │
        → UPDATE successful     │       │
        → result.count=1        └───────┘
        
T3      SUCCESS ✅                                   Database checks:
        Assigned to R1          ┌───────┐            ✗ status=ACCEPTED (changed!)
                                │LOCKED │            ✗ volunteerId=R1 (not null!)
                                │       │            → UPDATE failed
                                └───────┘            → result.count=0
                                
T4                                                   ERROR ❌
                                                     "RESCUE_ALREADY_ASSIGNED"
        
Result: ONLY R1 ASSIGNED ✅
Database: volunteerId=R1, status=ACCEPTED
Citizen: Single notification ✅
Rescuer 2: User-friendly error message ✅
```

**Key:** `updateMany` with conditional WHERE is atomic at database level

---

## Status Flow

```
┌─────────────┐
│   PENDING   │  ← Created by citizen
└──────┬──────┘
       │
       ├─────────────────┬──────────────┐
       │                 │              │
       ▼                 ▼              ▼
  (Admin assigns)   (Queue accept) (Cancelled)
       │                 │              │
       ▼                 │              ▼
┌─────────────┐          │        ┌──────────┐
│  ASSIGNED   │          │        │CANCELLED │
└──────┬──────┘          │        └──────────┘
       │                 │
       │(Rescuer confirms)
       │                 │
       ▼                 │
┌─────────────┐          │
│  ACCEPTED   │◄─────────┘
└──────┬──────┘
       │
       │(Rescuer starts)
       ▼
┌─────────────┐
│ IN_PROGRESS │
└──────┬──────┘
       │
       │(Rescuer completes)
       ▼
┌─────────────┐
│  COMPLETED  │
└─────────────┘
```

---

## Database Atomic Operation

### updateMany with Conditional WHERE
```sql
-- Single atomic operation
UPDATE "RescueRequest"
SET 
  "volunteerId" = $1,
  status = 'ASSIGNED',
  "assignedAt" = NOW()
WHERE 
  id = $2
  AND status = 'PENDING'        -- ← Must be PENDING
  AND "volunteerId" IS NULL     -- ← Must be unassigned
RETURNING *;

-- If WHERE conditions not met: 0 rows updated
-- If WHERE conditions met: 1 row updated
```

**Why this works:**
1. Single SQL statement = atomic
2. WHERE clause checked BEFORE update
3. If conditions fail, no update happens
4. Returns count = 0 or 1
5. No race condition possible

**Alternative (not used):**
```sql
-- NOT ATOMIC (race condition possible)
BEGIN TRANSACTION;
  SELECT status, "volunteerId" FROM "RescueRequest" WHERE id = $1;
  -- ↑ Race condition here ↑
  UPDATE "RescueRequest" SET "volunteerId" = $2 WHERE id = $1;
COMMIT;

-- Better with row lock, but more complex:
BEGIN TRANSACTION;
  SELECT * FROM "RescueRequest" WHERE id = $1 FOR UPDATE;
  -- Check conditions
  UPDATE ...
COMMIT;
```

---

## UI Components

### Rescuer Dashboard
```
┌───────────────────────────────────────────────────────────┐
│                    RESCUER DASHBOARD                       │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Availability Toggle: [ON] [OFF]                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Active Rescue (1)                                    │ │
│  │ - BR-2024-105: In Progress                           │ │
│  │ - Butwal, Ward 12                                    │ │
│  │ - [Continue Rescue] [Call Citizen]                   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Pending Assignments (2) ← Admin pre-assigned         │ │
│  │ - BR-2024-106: Assigned to you                       │ │
│  │   [Accept] [Reject]                                  │ │
│  │ - BR-2024-107: Assigned to you                       │ │
│  │   [Accept] [Reject]                                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Quick Actions                                        │ │
│  │ - [🟢 View Rescue Queue] ← NEW                       │ │
│  │ - View All Assignments                               │ │
│  │ - Rescue History                                     │ │
│  │ - Map View                                           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

### Rescue Queue Page (NEW)
```
┌───────────────────────────────────────────────────────────┐
│                      RESCUE QUEUE                          │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  ℹ️ These are unassigned rescue requests. Click "Accept"  │
│     to take ownership. System prevents double-booking.    │
│                                                            │
│  Filters: [Municipality ▼] [Emergency Only ☐]            │
│           [Auto-refresh ☑] [🔄 Refresh]                   │
│                                                            │
│  📊 23 rescues in queue • Last updated: 5s ago            │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🔴 BR-2024-108 [EMERGENCY] [HIGH]                    │ │
│  │ Butwal, Ward 12, Traffic Chowk                       │ │
│  │                                                       │ │
│  │ 🐍 Large brown snake, 4 feet, potentially venomous  │ │
│  │                                                       │ │
│  │ ⏱️ 15m ago  📍 GPS available  📏 2.3 km away         │ │
│  │                                                       │ │
│  │ [✅ Accept Rescue] [📞] [🗺️]                          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ BR-2024-109 [MEDIUM]                                 │ │
│  │ Butwal, Ward 8, Near Hospital                        │ │
│  │                                                       │ │
│  │ 🐍 Small green snake in garden                       │ │
│  │                                                       │ │
│  │ ⏱️ 8m ago  📍 GPS available  📏 1.5 km away          │ │
│  │                                                       │ │
│  │ [✅ Accept Rescue] [📞] [🗺️]                          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ... (more rescues)                                       │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

---

## Error Handling

### Backend Errors
```typescript
// Repository layer
if (result.count === 0) {
  const existing = await this.model.findUnique({ where: { id: rescueId } });
  
  if (!existing) {
    throw new Error('RESCUE_NOT_FOUND: Rescue request not found');
  }
  
  if (existing.volunteerId) {
    throw new Error('RESCUE_ALREADY_ASSIGNED: This rescue has already been assigned to another rescuer');
  }
  
  throw new Error(`INVALID_STATUS: Cannot assign rescue with status ${existing.status}`);
}
```

### Frontend Error Handling
```typescript
try {
  await acceptFromQueue({ variables: { input: { rescueId } } });
  toast.success('Rescue accepted!');
} catch (error: any) {
  if (error.message.includes('RESCUE_ALREADY_ASSIGNED')) {
    toast.error('Already Accepted', {
      description: 'This rescue was just accepted by another rescuer. Please choose another rescue.',
    });
  } else if (error.message.includes('INVALID_STATUS')) {
    toast.error('No Longer Available', {
      description: 'This rescue is no longer available for acceptance.',
    });
  } else {
    toast.error('Failed to Accept', {
      description: error.message || 'An error occurred. Please try again.',
    });
  }
  
  refetch(); // Refresh queue
}
```

---

## Monitoring

### Metrics to Track
1. **Race Condition Attempts**
   - Count of `RESCUE_ALREADY_ASSIGNED` errors
   - Alert if > 10 per hour

2. **Queue Performance**
   - Queue query execution time
   - Alert if > 100ms

3. **Acceptance Rate**
   - % of rescues accepted from queue vs admin-assigned
   - Target: > 60% from queue

4. **Response Time**
   - Time from creation to acceptance
   - Target: < 5 minutes average

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Status:** Complete
