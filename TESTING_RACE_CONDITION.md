# Race Condition Testing Guide

**Purpose:** Verify that the atomic assignment prevents multiple rescuers from accepting the same rescue

**Priority:** 🔴 CRITICAL - Production Blocker

---

## Prerequisites

1. ✅ Backend deployed and running
2. ✅ Frontend deployed and running
3. ✅ Database accessible
4. ✅ At least 3 test accounts:
   - 1 Citizen account
   - 2 Rescuer accounts (different users)
   - 1 Admin account (optional, for monitoring)

---

## Test Setup

### Step 1: Create Test Accounts

**Citizen Account:**
```
Email: citizen-test@example.com
Password: Test123!
Role: CITIZEN
```

**Rescuer Account 1:**
```
Email: rescuer1-test@example.com
Password: Test123!
Role: VOLUNTEER or VERIFIED_RESCUER
Municipality: Butwal
```

**Rescuer Account 2:**
```
Email: rescuer2-test@example.com
Password: Test123!
Role: VOLUNTEER or VERIFIED_RESCUER
Municipality: Butwal
```

### Step 2: Create Test Rescue

1. Login as **Citizen** in browser
2. Navigate to "Report Emergency"
3. Create rescue with:
   - Municipality: Butwal
   - Address: Test Location
   - Description: "Test snake for race condition testing"
   - Priority: HIGH
4. Note the **Reference Number** (e.g., BR-2024-105)
5. Logout

---

## Test 1: Basic Race Condition Test

### Setup
1. Open **Browser Window 1** (Chrome/Firefox)
   - Login as **Rescuer 1**
   - Navigate to `/dashboard/rescuer/queue`
   - Verify test rescue appears in queue

2. Open **Browser Window 2** (different browser or incognito)
   - Login as **Rescuer 2**
   - Navigate to `/dashboard/rescuer/queue`
   - Verify test rescue appears in queue

3. Position windows **side by side** on screen

### Test Execution
1. **Count down: 3... 2... 1...**
2. **Both rescuers** click "Accept Rescue" button **simultaneously**

### Expected Results ✅

**Window 1 (First to complete - Winner):**
- ✅ Toast: "Rescue accepted! Redirecting..."
- ✅ Redirect to `/dashboard/rescuer/active`
- ✅ Rescue shows as "ACCEPTED" with rescuer's name
- ✅ Citizen receives notification: "Rescuer X is on the way"

**Window 2 (Second to complete - Loser):**
- ✅ Toast: "Already Accepted - This rescue was just accepted by another rescuer"
- ✅ Stays on queue page
- ✅ Rescue disappears from queue (auto-refresh)
- ✅ No assignment created

**Database:**
```sql
SELECT id, "referenceNumber", status, "volunteerId", "assignedAt", "acceptedAt"
FROM "RescueRequest"
WHERE "referenceNumber" = 'BR-2024-105';

-- Expected:
-- status: ACCEPTED
-- volunteerId: [Rescuer 1's volunteer ID]
-- assignedAt: [timestamp]
-- acceptedAt: [timestamp]
```

**Timeline Events:**
```sql
SELECT event, description, "userId", "createdAt"
FROM "RescueTimeline"
WHERE "rescueId" = '[rescue-id]'
ORDER BY "createdAt" DESC;

-- Expected: Only ONE "RESCUE_ACCEPTED_FROM_QUEUE" event
```

### Failure Modes ❌

**CRITICAL FAILURE - Race Condition Not Fixed:**
- ❌ Both windows show "Rescue accepted"
- ❌ Database has `result.count = 2` for updateMany
- ❌ Multiple timeline events
- ❌ Citizen receives 2 notifications

**Action if failure:** DO NOT DEPLOY TO PRODUCTION

---

## Test 2: Rapid Sequential Accepts

### Purpose
Verify queue removes rescue immediately after acceptance (before poll interval)

### Setup
1. Create 3 rescues (BR-2024-106, 107, 108)
2. Login as **Rescuer 1** in Window 1
3. Login as **Rescuer 2** in Window 2
4. Both navigate to queue

### Test Execution
1. Rescuer 1: Accept BR-2024-106
2. Wait 1 second
3. Rescuer 2: Try to accept BR-2024-106 (should fail)
4. Rescuer 2: Accept BR-2024-107 (should succeed)

### Expected Results
- ✅ Rescuer 1 accepts 106: Success
- ✅ Rescuer 2 tries 106: Error "Already accepted"
- ✅ Rescuer 2 accepts 107: Success
- ✅ Each rescue has exactly ONE volunteer assigned

---

## Test 3: Network Delay Simulation

### Purpose
Test race condition with simulated network delay

### Setup
1. Open Chrome DevTools → Network Tab
2. Throttle network: "Slow 3G"
3. Follow Test 1 setup

### Test Execution
Same as Test 1, but with slow network

### Expected Results
- ✅ Even with network delay, only ONE rescuer succeeds
- ✅ Second request returns error (not timeout)
- ✅ Database remains consistent

---

## Test 4: Load Test (10 Concurrent Accepts)

### Purpose
Stress test the atomic assignment with many concurrent attempts

### Setup
Use a tool like **k6** or **Artillery** to simulate 10 concurrent accept attempts

**k6 Script:** `test-race-condition.js`
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10, // 10 virtual users
  duration: '5s',
  iterations: 10, // 10 total attempts
};

const rescueId = 'YOUR_RESCUE_ID_HERE';
const token = 'YOUR_AUTH_TOKEN_HERE';

export default function() {
  const payload = JSON.stringify({
    query: `
      mutation AcceptFromQueue($input: AcceptRescueInput!) {
        acceptFromQueue(input: $input) {
          id
          referenceNumber
          status
        }
      }
    `,
    variables: {
      input: { rescueId }
    }
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.post('http://localhost:4000/graphql', payload, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
```

### Expected Results
- ✅ Exactly 1 request succeeds (200 OK, rescue assigned)
- ✅ 9 requests fail with "RESCUE_ALREADY_ASSIGNED" error
- ✅ Database: single assignment
- ✅ No data corruption

---

## Test 5: Auto-Refresh Verification

### Purpose
Verify queue updates automatically after acceptance

### Setup
1. Login as Rescuer 1 in Window 1
2. Login as Rescuer 2 in Window 2
3. Both view queue with auto-refresh enabled (default)

### Test Execution
1. Rescuer 1: Accept rescue from queue
2. Wait 5 seconds (poll interval)
3. Observe Rescuer 2's queue

### Expected Results
- ✅ Window 2: Rescue disappears from queue after 5s
- ✅ No error messages in Window 2
- ✅ Queue count decrements

---

## Test 6: Error Message Validation

### Purpose
Verify user-friendly error messages

### Test Cases

**Case A: Already Assigned**
- Error from backend: `RESCUE_ALREADY_ASSIGNED: ...`
- Toast message: "This rescue was just accepted by another rescuer. Please choose another rescue."
- User action: Select different rescue

**Case B: Invalid Status**
- Error from backend: `INVALID_STATUS: Cannot assign rescue with status COMPLETED`
- Toast message: "This rescue is no longer available."
- User action: Refresh queue

**Case C: Rescue Not Found**
- Error from backend: `RESCUE_NOT_FOUND: Rescue request not found`
- Toast message: "Rescue not found. It may have been deleted."
- User action: Refresh queue

---

## Database Verification Queries

### Check for Race Conditions
```sql
-- Find rescues with multiple accept events (SHOULD BE EMPTY)
SELECT r.id, r."referenceNumber", COUNT(t.id) as accept_count
FROM "RescueRequest" r
JOIN "RescueTimeline" t ON t."rescueId" = r.id
WHERE t.event = 'RESCUE_ACCEPTED_FROM_QUEUE'
GROUP BY r.id, r."referenceNumber"
HAVING COUNT(t.id) > 1;

-- Expected: 0 rows
```

### Check Assignment Consistency
```sql
-- Verify all ACCEPTED rescues have exactly one volunteer
SELECT 
  id,
  "referenceNumber",
  status,
  "volunteerId",
  "assignedAt",
  "acceptedAt"
FROM "RescueRequest"
WHERE status IN ('ACCEPTED', 'ASSIGNED')
  AND "volunteerId" IS NULL;

-- Expected: 0 rows (all accepted rescues must have volunteer)
```

### Performance Check
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

-- Expected: Execution time < 100ms
```

---

## Monitoring & Alerts

### Metrics to Track

1. **Race Condition Attempts**
   - Count of "RESCUE_ALREADY_ASSIGNED" errors
   - Alert if > 10 per hour

2. **Queue Performance**
   - Average time to accept from queue
   - Alert if > 2 seconds

3. **Failed Assignments**
   - Count of INVALID_STATUS errors
   - Alert if > 5 per hour

4. **Database Integrity**
   - Rescues with multiple accept events
   - Alert immediately if count > 0

### Slack Alert Example
```
🚨 RACE CONDITION DETECTED
Rescue: BR-2024-105
Issue: Multiple accept events detected
Volunteers: John Doe, Jane Smith
Action: Investigate immediately
```

---

## Rollback Plan

If race condition test fails:

### Immediate Actions
1. ❌ **DO NOT DEPLOY TO PRODUCTION**
2. 🔄 Revert to previous version
3. 🔍 Review atomic assignment code
4. 📝 Document failure mode

### Code to Check
```typescript
// File: rescue.repository.ts
// Method: assignVolunteer

// Must use updateMany with conditional WHERE
const result = await this.model.updateMany({
  where: {
    id: rescueId,
    status: RescueStatus.PENDING,  // ← Required
    volunteerId: null,              // ← Required
  },
  data: { ... }
});

// Must check result.count === 0
if (result.count === 0) {
  throw new Error('RESCUE_ALREADY_ASSIGNED: ...');
}
```

### Alternative Approaches (if atomic fails)
1. **Row-level locking:** `SELECT FOR UPDATE`
2. **Redis distributed lock:** Lock rescue ID before update
3. **Optimistic locking:** Version field, increment on update
4. **Queue system:** RabbitMQ/Redis Queue with single consumer

---

## Sign-Off Checklist

- [ ] Test 1 (Basic Race Condition): PASSED
- [ ] Test 2 (Sequential Accepts): PASSED
- [ ] Test 3 (Network Delay): PASSED
- [ ] Test 4 (Load Test 10x): PASSED
- [ ] Test 5 (Auto-Refresh): PASSED
- [ ] Test 6 (Error Messages): PASSED
- [ ] Database queries: No anomalies found
- [ ] Performance: Queue < 100ms
- [ ] Monitoring: Alerts configured
- [ ] Documentation: Updated

**Approved by:** ___________________  
**Date:** ___________________  
**Next Step:** Deploy to Production

---

## Production Deployment Checklist

- [ ] Staging tests passed (all 6 tests)
- [ ] Load test with 50 concurrent users
- [ ] Database backup created
- [ ] Rollback script prepared
- [ ] Monitoring dashboards ready
- [ ] Slack alerts configured
- [ ] Team notified of deployment
- [ ] Canary deployment (10% traffic first)
- [ ] Monitor for 2 hours
- [ ] Full deployment (100% traffic)

---

## Contact & Support

**Test Owner:** Development Team  
**Reviewer:** Tech Lead  
**Approver:** CTO / Product Owner

**Emergency Contact:** [Emergency Slack Channel]

---

**Status:** ⏭️ READY FOR TESTING  
**Last Updated:** 2025-01-XX  
**Version:** 1.0
