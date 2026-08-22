# Queue & Race Condition Fix Implementation Log

**Date:** 2025-01-XX  
**Objective:** Fix critical race condition in rescue assignment and separate admin vs queue workflows

## Critical Issues Fixed

### 1. Race Condition in Assignment (CRITICAL - Production Blocker)

**Problem:**
- Multiple rescuers could accept same rescue simultaneously
- No atomic check in `assignVolunteer` method
- `UPDATE WHERE id = X` without checking `volunteerId IS NULL`
- Two rescuers both get success, citizen confused

**Solution:**
```typescript
// BEFORE (WRONG):
async assignVolunteer(rescueId, volunteerId) {
  return this.model.update({
    where: { id: rescueId },
    data: { volunteerId, status: 'ASSIGNED' }
  });
}

// AFTER (CORRECT - ATOMIC):
async assignVolunteer(rescueId, volunteerId) {
  const result = await this.model.updateMany({
    where: {
      id: rescueId,
      status: RescueStatus.PENDING,  // ← Must be pending
      volunteerId: null,              // ← Must be unassigned
    },
    data: { volunteerId, status: 'ASSIGNED', assignedAt: new Date() }
  });
  
  if (result.count === 0) {
    // Fetch to determine specific error
    const existing = await this.model.findUnique({ where: { id: rescueId } });
    if (!existing) throw new Error('RESCUE_NOT_FOUND');
    if (existing.volunteerId) throw new Error('RESCUE_ALREADY_ASSIGNED: ...');
    throw new Error('INVALID_STATUS: ...');
  }
  
  return this.model.findUnique({ where: { id: rescueId }, include: {...} });
}
```

**Why updateMany + conditional WHERE:**
- Atomic: single database operation
- Safe: only updates if ALL conditions match
- Explicit: clear race condition handling
- Returns count = 0 if conditions not met
- Better than transaction + row lock (simpler, Prisma-native)

### 2. Workflow Separation (CRITICAL - UX & Safety)

**Problem:**
- Only ONE workflow: admin assigns → rescuer confirms
- No self-service queue for rescuers
- Queue visibility missing
- Rescuers can't see/accept unassigned emergencies

**Solution: Two Separate Workflows**

**Workflow A: Admin Assignment (existing)**
```
CITIZEN → Create Rescue → PENDING
                            ↓
ADMIN → Assign to Rescuer → ASSIGNED
                            ↓
RESCUER → Accept → ACCEPTED
```
- Use case: `AcceptRescueUseCase` (already exists)
- Rescuer confirms PRE-ASSIGNED rescue

**Workflow B: Queue Self-Accept (NEW)**
```
CITIZEN → Create Rescue → PENDING (in queue)
                            ↓
RESCUER → See queue → Accept → ASSIGNED + ACCEPTED
```
- Use case: `AcceptFromQueueUseCase` (NEW)
- Rescuer accepts from unassigned queue
- ATOMIC assignment prevents race condition

## Files Modified

### Backend - Repository Layer
**File:** `libs/database/src/repositories/rescue.repository.ts`

1. **Fixed `assignVolunteer` method** (lines ~89-140)
   - Added atomic update with conditional WHERE
   - Added error handling for race conditions
   - Returns structured errors: RESCUE_ALREADY_ASSIGNED, INVALID_STATUS, RESCUE_NOT_FOUND

2. **Added `findAvailableForQueue` method** (lines ~155-185)
   - Finds PENDING rescues with `volunteerId = null`
   - Filters by `stillPresent = true`
   - Orders by priority DESC, createdAt ASC
   - Includes reporter, species relations
   - Optional filters: municipality, distance (TODO: geospatial)
   - Returns max 50 by default

### Backend - Use Cases
**File:** `libs/backend/modules/src/rescue/application/use-cases/accept-from-queue.use-case.ts` (NEW)

```typescript
export class AcceptFromQueueUseCase {
  async execute(input: AcceptFromQueueInput, userId: string) {
    // 1. Atomically assign (throws if already assigned)
    const rescue = await this.rescueRepository.assignVolunteer(
      input.rescueId,
      input.volunteerId
    );
    
    // 2. Create timeline event
    await this.rescueRepository.addTimelineEvent({
      rescueId: rescue.id,
      event: 'RESCUE_ACCEPTED_FROM_QUEUE',
      metadata: { acceptedFrom: 'QUEUE' }
    });
    
    // 3. Notify citizen
    await this.createNotifications(rescue);
    
    // 4. Mark volunteer as busy
    await this.updateVolunteerAvailability(volunteerId, false);
    
    return { success: true, rescue };
  }
}
```

**Error handling:**
- `RESCUE_ALREADY_ASSIGNED` → User-friendly: "Another rescuer accepted this"
- `INVALID_STATUS` → "No longer available"
- `RESCUE_NOT_FOUND` → "Not found"

**File:** `libs/backend/modules/src/rescue/application/queries/available-rescues.query.ts` (NEW)

```typescript
export class AvailableRescuesQuery {
  async execute(filters: AvailableRescuesFilters) {
    const rescues = await this.rescueRepository.findAvailableForQueue({
      municipality: filters.municipality,
      rescuerLat: filters.rescuerLat,
      rescuerLng: filters.rescuerLng,
      maxDistance: filters.maxDistance || 50,
      limit: filters.limit || 50,
    });
    
    // Calculate distances if rescuer location provided
    if (filters.rescuerLat && filters.rescuerLng) {
      return rescues.map(rescue => ({
        ...rescue,
        distance: this.calculateDistance(...) // Haversine formula
      }));
    }
    
    return rescues;
  }
  
  // Haversine distance calculation in km
  private calculateDistance(lat1, lng1, lat2, lng2) { ... }
}
```

**File:** `libs/backend/modules/src/rescue/index.ts`
- Exported: `AcceptFromQueueUseCase`
- Exported: `AvailableRescuesQuery`

### Backend - GraphQL Resolvers

**File:** `libs/backend/modules/src/rescue/infrastructure/graphql/resolvers/rescue-query.resolver.ts`

Added import:
```typescript
import { AvailableRescuesQuery } from '../../../application/queries/available-rescues.query.js';
```

Added query resolver:
```typescript
availableRescues: async (_parent, args, context) => {
  context.requireAuth();
  context.requireRole(['VOLUNTEER', 'VERIFIED_RESCUER', 'DISTRICT_COORDINATOR']);
  
  // Get volunteer profile for location
  const volunteer = await prisma.volunteer.findUnique({
    where: { userId: context.user.id }
  });
  
  const rescueRepository = new RescueRepository(prisma);
  const useCase = new AvailableRescuesQuery(rescueRepository);
  
  const rescues = await useCase.execute({
    municipality: args.filter?.municipality || volunteer.municipality,
    rescuerLat: volunteer.lastKnownLatitude,
    rescuerLng: volunteer.lastKnownLongitude,
    maxDistance: args.filter?.maxDistance || 50,
    limit: args.pagination?.limit || 50,
  });
  
  // Return as GraphQL Connection
  return {
    edges: rescues.map(r => ({ node: r, cursor: r.id })),
    pageInfo: { ... },
    totalCount: rescues.length,
  };
}
```

**File:** `libs/backend/modules/src/rescue/infrastructure/graphql/resolvers/rescue-mutation.resolver.ts`

Added import:
```typescript
import { AcceptFromQueueUseCase } from '../../../application/use-cases/accept-from-queue.use-case.js';
```

Added mutation resolver:
```typescript
acceptFromQueue: async (_parent, args, context) => {
  context.requireAuth();
  context.requireRole(['VOLUNTEER', 'VERIFIED_RESCUER', 'DISTRICT_COORDINATOR']);
  
  // Get volunteer profile
  const volunteer = await prisma.volunteer.findUnique({
    where: { userId: context.user.id }
  });
  
  const rescueRepository = new RescueRepository(prisma);
  const useCase = new AcceptFromQueueUseCase(rescueRepository);
  
  return await useCase.execute({
    rescueId: args.input.rescueId,
    volunteerId: volunteer.id,
    estimatedArrivalTime: args.input.estimatedArrivalTime,
    notes: args.input.notes,
  }, context.user.id);
}
```

### Frontend - GraphQL Hooks

**File:** `apps/frontend/src/lib/graphql/hooks/rescue.hooks.ts`

Added GraphQL queries:
```graphql
const AVAILABLE_RESCUES = gql`
  query AvailableRescues($pagination: PaginationInput, $filter: RescueRequestFilterInput) {
    availableRescues(pagination: $pagination, filter: $filter) {
      edges {
        node {
          id
          referenceNumber
          status
          priority
          municipality
          ward
          address
          landmark
          lat
          lng
          snakeDescription
          snakeSize
          snakeColor
          isEmergency
          hasBite
          createdAt
          distance
          user { id name phone }
          species { id name scientificName venomous }
        }
        cursor
      }
      pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
      totalCount
    }
  }
`;

const ACCEPT_FROM_QUEUE = gql`
  mutation AcceptFromQueue($input: AcceptRescueInput!) {
    acceptFromQueue(input: $input) {
      id
      referenceNumber
      status
      acceptedAt
      assignedAt
      assignedVolunteer { id name }
      updatedAt
    }
  }
`;
```

Added hooks:
```typescript
export function useAvailableRescuesQuery(
  options?: QueryHookOptions<
    { availableRescues: RescueRequestConnection },
    { pagination?: PaginationInput; filter?: RescueRequestFilterInput }
  >
) {
  return useQuery<...>(AVAILABLE_RESCUES, options);
}

export function useAcceptFromQueueMutation(
  options?: MutationHookOptions<
    { acceptFromQueue: RescueRequest },
    { input: AcceptRescueInput }
  >
) {
  return useMutation<...>(ACCEPT_FROM_QUEUE, options);
}
```

## Testing Plan

### 1. Race Condition Test (CRITICAL)
**Setup:**
1. Create 1 rescue as citizen (BR-TEST-001)
2. Open 2 browser windows as 2 different rescuers
3. Both rescuers navigate to queue
4. Both see BR-TEST-001 in queue

**Test:**
1. Both click "Accept" at the SAME TIME
2. **Expected:**
   - Window 1: "Rescue accepted successfully" → redirects to active rescue
   - Window 2: "This rescue has already been accepted by another rescuer"
   - Database: rescue.volunteerId = first rescuer's ID, status = ASSIGNED
   - Citizen receives notification: "Rescuer X is on the way"
   
3. **Failure modes to check:**
   - Both get success ❌ (race condition not fixed)
   - Both see error ❌ (assignment logic broken)
   - Rescue stays PENDING ❌ (atomic update failed)

### 2. Queue Visibility Test
**Test:**
1. Create 5 rescues in different municipalities
2. Login as rescuer in Butwal
3. Check queue only shows Butwal rescues
4. Check rescues sorted by priority (HIGH first) then age (oldest first)
5. Check distance calculation appears (if GPS available)

### 3. Workflow Separation Test
**Test A: Admin Assignment**
1. Admin assigns rescue → rescuer
2. Rescuer sees in "Pending Assignments" (existing dashboard section)
3. Rescuer clicks "Accept" → calls `acceptRescue` mutation (NOT `acceptFromQueue`)
4. Status: PENDING → ASSIGNED → ACCEPTED

**Test B: Queue Self-Accept**
1. Rescue created, NOT assigned
2. Rescuer sees in "Available Rescues" (NEW queue section)
3. Rescuer clicks "Accept from Queue" → calls `acceptFromQueue` mutation
4. Status: PENDING → ASSIGNED + ACCEPTED (single step)

## Next Steps

### Immediate (Production Blockers)
1. ✅ Fix atomic assignment (DONE)
2. ✅ Create separate use case for queue (DONE)
3. ✅ Add GraphQL resolvers (DONE)
4. ✅ Add frontend hooks (DONE)
5. ⏭️ Create queue UI page
6. ⏭️ Test race condition with 2 browsers
7. ⏭️ Deploy to staging
8. ⏭️ Load test with 10 concurrent accepts

### Priority 2 (Operational)
- Add geospatial distance filtering (PostGIS)
- Add queue refresh notifications (WebSocket/SSE)
- Add "assign to me" button for admin
- Add volunteer GPS tracking
- Add ETA calculation

### Priority 3 (Analytics)
- Track race condition attempts (metrics)
- Queue wait time analytics
- Acceptance rate by municipality
- Response time heatmap

## Technical Decisions

| Decision | Option A (Chosen) | Option B (Rejected) | Rationale |
|----------|-------------------|---------------------|-----------|
| Atomic assignment | `updateMany` + conditional WHERE | Transaction + row lock | Simpler, Prisma-native, explicit |
| Workflow separation | New use case `AcceptFromQueueUseCase` | Modify existing `AcceptRescueUseCase` | Clearer intent, preserves admin workflow |
| Error handling | Structured errors ("RESCUE_ALREADY_ASSIGNED:") | Generic errors | Better client handling, user-friendly messages |
| Distance calculation | Haversine in application layer | PostGIS in database | Works now, can optimize later |
| Queue refresh | Poll every 10s | WebSocket | MVP: polling, optimize later |

## Database Queries

### Check for race conditions
```sql
-- Find rescues with multiple "accepted" events
SELECT rescue_id, COUNT(*) as accept_count
FROM rescue_timeline
WHERE event = 'RESCUE_ACCEPTED_FROM_QUEUE'
GROUP BY rescue_id
HAVING COUNT(*) > 1;

-- Find rescues assigned to multiple volunteers (should be ZERO)
SELECT id, reference_number, "volunteerId", status
FROM "RescueRequest"
WHERE status IN ('ASSIGNED', 'ACCEPTED')
  AND "volunteerId" IS NOT NULL
  AND id IN (
    SELECT "rescueId" 
    FROM rescue_timeline 
    WHERE event = 'RESCUE_ACCEPTED_FROM_QUEUE'
    GROUP BY "rescueId"
    HAVING COUNT(*) > 1
  );
```

### Queue performance
```sql
-- Check queue query performance
EXPLAIN ANALYZE
SELECT * FROM "RescueRequest"
WHERE status = 'PENDING'
  AND "volunteerId" IS NULL
  AND "stillPresent" = true
  AND municipality = 'Butwal'
ORDER BY priority DESC, "createdAt" ASC
LIMIT 50;

-- Add index if slow (> 100ms)
CREATE INDEX idx_rescue_queue 
ON "RescueRequest" (status, "volunteerId", "stillPresent", municipality, priority, "createdAt");
```

## Production Checklist

- [ ] Backend tests pass
- [ ] Race condition test with 2 browsers (MANUAL)
- [ ] Queue visibility test (MANUAL)
- [ ] Error messages user-friendly
- [ ] Database indexes added
- [ ] Monitoring: track race condition attempts
- [ ] Load test: 10 concurrent accepts on same rescue
- [ ] Rollback plan: revert to single workflow (admin-only)
- [ ] Documentation: workflow diagram added
- [ ] Alert: Slack notification on race condition errors

## Known Limitations

1. **Distance calculation:** Haversine formula (not accounting for roads, only straight line)
2. **Queue refresh:** Polling (10s interval), not real-time
3. **GPS accuracy:** Depends on rescuer's device GPS
4. **Municipality filter only:** No district/province filtering yet
5. **No queue reservation:** Rescuer can't "hold" rescue for 2 minutes while deciding

## Future Enhancements

1. **PostGIS geospatial queries:** Distance filter in database, not application
2. **WebSocket queue updates:** Real-time queue refresh
3. **Queue reservation system:** "Reserve" rescue for 2 minutes before accepting
4. **Smart routing:** Consider road distance, not straight line
5. **Volunteer heatmap:** Show available rescuers on admin map
6. **Auto-assignment:** ML model suggests best rescuer based on location, experience, availability
7. **Queue priority algorithm:** Weight distance + priority + age + rescuer experience

---

**Status:** ✅ Backend complete, ⏭️ Frontend UI pending
**Next:** Create rescuer queue UI page
**Blocked by:** None
**Estimated completion:** 1-2 hours (UI + testing)
