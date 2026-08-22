# SnakeSOS Workflow Fix - Status Summary

**Last Updated:** 2025-01-XX  
**Sprint:** Fix Critical Race Condition & Queue Implementation

---

## 🎯 Goals

1. ✅ **Fix race condition** in rescue assignment (CRITICAL - production blocker)
2. ✅ **Separate workflows**: Admin assignment vs Queue self-accept
3. ✅ **Backend complete**: Repository, use cases, resolvers
4. ✅ **GraphQL complete**: Queries and mutations added
5. ⏭️ **Frontend UI**: Create queue page for rescuers
6. ⏭️ **Testing**: Race condition test with 2 browsers
7. ⏭️ **Deployment**: Staging → Production

---

## ✅ COMPLETED

### Backend - Database Layer
- [x] Fixed `assignVolunteer` method with atomic update
- [x] Added `findAvailableForQueue` method
- [x] Race condition prevention with conditional WHERE clause
- [x] Structured error messages (RESCUE_ALREADY_ASSIGNED, INVALID_STATUS)

**File:** `libs/database/src/repositories/rescue.repository.ts`

### Backend - Application Layer
- [x] Created `AcceptFromQueueUseCase` (new workflow)
- [x] Created `AvailableRescuesQuery` (queue visibility)
- [x] Distance calculation with Haversine formula
- [x] Notification system for queue accepts
- [x] Volunteer availability tracking

**Files:**
- `libs/backend/modules/src/rescue/application/use-cases/accept-from-queue.use-case.ts`
- `libs/backend/modules/src/rescue/application/queries/available-rescues.query.ts`
- `libs/backend/modules/src/rescue/index.ts`

### Backend - GraphQL Layer
- [x] Added `availableRescues` query resolver
- [x] Added `acceptFromQueue` mutation resolver
- [x] Auth checks (VOLUNTEER, VERIFIED_RESCUER, DISTRICT_COORDINATOR)
- [x] Volunteer profile validation
- [x] GraphQL Connection format

**Files:**
- `libs/backend/modules/src/rescue/infrastructure/graphql/resolvers/rescue-query.resolver.ts`
- `libs/backend/modules/src/rescue/infrastructure/graphql/resolvers/rescue-mutation.resolver.ts`

### Frontend - GraphQL Hooks
- [x] Added `AVAILABLE_RESCUES` query
- [x] Added `ACCEPT_FROM_QUEUE` mutation
- [x] Created `useAvailableRescuesQuery` hook
- [x] Created `useAcceptFromQueueMutation` hook
- [x] Type definitions for new queries/mutations

**File:** `apps/frontend/src/lib/graphql/hooks/rescue.hooks.ts`

---

## ⏭️ TODO (Next Steps)

### 1. Frontend UI - Rescuer Queue Page ⚠️ HIGH PRIORITY

**Option A: Add Queue Tab to Existing Dashboard**
Update: `apps/frontend/src/app/(dashboard)/dashboard/rescuer/page.tsx`

Add new section:
```typescript
<Card className="p-6">
  <h2 className="text-xl font-semibold mb-6">Available Rescues (Queue)</h2>
  
  {availableRescues.length > 0 ? (
    <div className="space-y-4">
      {availableRescues.map((rescue) => (
        <RescueQueueCard 
          rescue={rescue} 
          onAccept={handleAcceptFromQueue}
          accepting={accepting === rescue.id}
        />
      ))}
    </div>
  ) : (
    <EmptyQueueState />
  )}
</Card>
```

**Option B: Create Separate Queue Page (RECOMMENDED)**
Create: `apps/frontend/src/app/(dashboard)/dashboard/rescuer/queue/page.tsx`

Benefits:
- Cleaner separation of concerns
- Dedicated space for filters (municipality, distance, priority)
- Real-time auto-refresh
- Map view integration
- Better mobile experience

### 2. Components to Create

#### `<RescueQueueCard>`
```typescript
interface RescueQueueCardProps {
  rescue: RescueRequest;
  onAccept: (rescueId: string) => void;
  accepting: boolean;
}

// Shows:
// - Reference number + priority badge
// - Address + municipality
// - Snake description
// - Distance (if GPS available)
// - Time since created
// - Citizen info (name, phone)
// - Accept button (green, prominent)
```

#### `<QueueFilters>`
```typescript
// Filters:
// - Municipality dropdown
// - Max distance slider (5km, 10km, 25km, 50km)
// - Priority filter (HIGH, CRITICAL only)
// - Emergency only toggle
```

#### `<QueueMapView>`
```typescript
// Shows:
// - Rescuer's location (blue dot)
// - Available rescues (red pins)
// - Distance circles (10km, 25km radius)
// - Click pin → show rescue details
```

### 3. Update Existing Rescuer Dashboard

**Current state:**
- Shows "Pending Assignments" (admin-assigned rescues)
- Shows active rescue
- Shows stats

**Changes needed:**
- Add "Queue" button in Quick Actions
- Add badge showing queue count
- Add section toggle: "My Assignments" vs "Available Queue"

### 4. Testing ⚠️ CRITICAL

#### Test 1: Race Condition (MUST PASS)
```
Setup:
1. Create 1 rescue as citizen
2. Open 2 browser windows as 2 rescuers
3. Both see rescue in queue

Test:
1. Both click "Accept" simultaneously
2. Window 1: Success → redirect
3. Window 2: Error "Already accepted"
4. Database: Single volunteerId assigned
5. Citizen: Single notification

Expected: NO DOUBLE ASSIGNMENT
```

#### Test 2: Queue Visibility
```
1. Create 5 rescues in different municipalities
2. Rescuer in Butwal sees only Butwal rescues
3. Rescues sorted by priority DESC, createdAt ASC
4. Distance calculation correct (if GPS available)
```

#### Test 3: Workflow Separation
```
Workflow A (Admin):
PENDING → Admin assigns → ASSIGNED → Rescuer confirms → ACCEPTED

Workflow B (Queue):
PENDING → Rescuer accepts → ASSIGNED + ACCEPTED
```

### 5. GraphQL Schema ⚠️ MISSING

The GraphQL schema files need to be created/updated:

**File:** `libs/contracts/src/lib/graphql/rescue/queries.graphql`
```graphql
extend type Query {
  """
  Get available rescues for queue (rescuer can accept)
  Shows PENDING unassigned rescues
  """
  availableRescues(
    pagination: PaginationInput
    filter: RescueRequestFilterInput
  ): RescueRequestConnection!
}
```

**File:** `libs/contracts/src/lib/graphql/rescue/mutations.graphql`
```graphql
extend type Mutation {
  """
  Accept rescue from queue (self-service)
  ATOMIC - prevents race condition when multiple rescuers try to accept
  """
  acceptFromQueue(input: AcceptRescueInput!): RescueRequest!
}
```

### 6. Error Handling in Frontend

Add toast messages for errors:
```typescript
try {
  await acceptFromQueue({ variables: { input: { rescueId } } });
  toast.success('Rescue accepted! Redirecting...');
  router.push('/dashboard/rescuer/active');
} catch (error: any) {
  if (error.message.includes('RESCUE_ALREADY_ASSIGNED')) {
    toast.error('This rescue was just accepted by another rescuer. Please choose another rescue.');
  } else if (error.message.includes('INVALID_STATUS')) {
    toast.error('This rescue is no longer available.');
  } else {
    toast.error('Failed to accept rescue. Please try again.');
  }
  refetch(); // Refresh queue
}
```

### 7. Real-time Updates ⚠️ IMPORTANT

Current: Polling every 10s
Improvement needed: WebSocket or Server-Sent Events

**Quick win (polling):**
```typescript
const { data, refetch } = useAvailableRescuesQuery({
  pollInterval: 5000, // 5 seconds
  fetchPolicy: 'cache-and-network',
});
```

**Better (WebSocket):**
- Subscribe to rescue status changes
- Remove rescue from queue immediately when accepted
- Show "Just accepted by X" notification

### 8. Database Indexes ⚠️ PERFORMANCE

Add index for queue query:
```sql
CREATE INDEX idx_rescue_queue 
ON "RescueRequest" (
  status,
  "volunteerId",
  "stillPresent",
  municipality,
  priority DESC,
  "createdAt" ASC
);
```

Run `EXPLAIN ANALYZE` to verify query performance < 100ms.

---

## 📊 Progress Tracker

| Component | Status | File | Priority |
|-----------|--------|------|----------|
| Atomic Assignment | ✅ Done | rescue.repository.ts | P0 |
| Queue Query Method | ✅ Done | rescue.repository.ts | P0 |
| Accept From Queue Use Case | ✅ Done | accept-from-queue.use-case.ts | P0 |
| Available Rescues Query | ✅ Done | available-rescues.query.ts | P0 |
| GraphQL Resolvers | ✅ Done | rescue-query.resolver.ts, rescue-mutation.resolver.ts | P0 |
| Frontend Hooks | ✅ Done | rescue.hooks.ts | P0 |
| GraphQL Schema Files | ⏭️ TODO | queries.graphql, mutations.graphql | P1 |
| Queue UI Page | ⏭️ TODO | /rescuer/queue/page.tsx | P0 |
| Queue Filters Component | ⏭️ TODO | QueueFilters.tsx | P1 |
| Queue Map Component | ⏭️ TODO | QueueMapView.tsx | P2 |
| Race Condition Test | ⏭️ TODO | Manual test | P0 |
| Database Indexes | ⏭️ TODO | Migration | P1 |
| Real-time Updates | ⏭️ Future | WebSocket | P2 |

**Legend:**
- ✅ Done
- ⏭️ TODO
- 🚧 In Progress
- P0 = Critical (production blocker)
- P1 = High (should have)
- P2 = Medium (nice to have)

---

## 🔥 Critical Path (Must Complete for Production)

1. ✅ Fix atomic assignment
2. ✅ Create queue use case
3. ✅ Add GraphQL resolvers
4. ✅ Add frontend hooks
5. **⏭️ Create queue UI page** ← YOU ARE HERE
6. **⏭️ Test race condition (2 browsers)**
7. **⏭️ Add database index**
8. **⏭️ Deploy to staging**
9. **⏭️ Load test (10 concurrent accepts)**
10. **⏭️ Deploy to production**

**Estimated time remaining:** 2-3 hours

---

## 🎓 Key Learnings

### Race Condition Fix
- Use `updateMany` with conditional WHERE, not `update`
- Check `result.count === 0` to detect race condition
- Return structured errors for client handling
- Atomic operations prevent 99.9% of race conditions

### Workflow Separation
- Separate use cases for separate workflows
- Clear intent: `AcceptFromQueueUseCase` vs `AcceptRescueUseCase`
- Easier to test, maintain, and understand
- Preserves existing admin workflow

### GraphQL Patterns
- Use Connection pattern for paginated lists
- Include `distance` in query result (calculated field)
- Auth checks in resolver, not use case
- Fetch volunteer profile once, reuse

### Frontend Patterns
- Separate hooks for separate operations
- Poll for real-time-ish updates (MVP)
- Optimize with WebSocket later
- User-friendly error messages

---

## 🚀 Deployment Plan

### Staging
1. Deploy backend + frontend
2. Run race condition test (2 browsers)
3. Check error messages
4. Verify queue performance
5. Load test: 10 concurrent accepts

### Production
1. Create database backup
2. Add database index
3. Deploy backend
4. Deploy frontend
5. Monitor logs for 1 hour
6. Check Slack alerts
7. Rollback plan: Revert to admin-only workflow

---

## 📝 Notes

- **Distance calculation:** Haversine (straight line), not road distance
- **Queue refresh:** 5-10s polling, not WebSocket (MVP)
- **Municipality filter only:** No district/province yet
- **No queue reservation:** Can't "hold" rescue while deciding

---

**Next Action:** Create rescuer queue UI page

**Blocked by:** None

**Owner:** Development Team

**Review by:** Tech Lead + Product Owner

---
