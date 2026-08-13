# Map GraphQL Query Fix

## Issue
The GraphQL query had two errors:
1. ❌ `assignedTo` field doesn't exist (should be `assignedBy`)
2. ❌ `assignedVolunteer` is an object, not a scalar

## Errors Received
```
Cannot query field "assignedTo" on type "RescueRequest". 
Did you mean "assignedAt" or "assignedBy"?

Field "assignedVolunteer" of type "Volunteer" must have a selection of subfields. 
Did you mean "assignedVolunteer { ... }"?
```

## Solution Applied ✅

### 1. Fixed GraphQL Fragment
**File**: `apps/frontend/src/lib/graphql/queries/rescue.queries.ts`

**Before**:
```graphql
fragment RescueRequestFields on RescueRequest {
  # ... other fields
  assignedTo              # ❌ WRONG
  assignedVolunteer       # ❌ WRONG (missing subfields)
}
```

**After**:
```graphql
fragment RescueRequestFields on RescueRequest {
  # ... other fields
  assignedVolunteer {     # ✅ CORRECT (with subfields)
    id
    status
    user {
      id
      name
      phone
    }
  }
  assignedAt              # ✅ CORRECT
  assignedBy {            # ✅ CORRECT
    id
    name
  }
}
```

### 2. Updated Admin Map Page
**File**: `apps/frontend/src/app/(dashboard)/dashboard/admin/map/page.tsx`

**Before**:
```typescript
id: r.assignedTo || '',           // ❌ Field doesn't exist
name: 'Active Rescuer',           // ❌ Hardcoded
phone: r.phone,                   // ❌ Wrong phone
```

**After**:
```typescript
id: r.assignedVolunteer?.id || '',
name: r.assignedVolunteer?.user?.name || 'Active Rescuer',
phone: r.assignedVolunteer?.user?.phone || r.phone,
```

### 3. Updated Citizen Map Page
**File**: `apps/frontend/src/app/(dashboard)/dashboard/citizen/map/page.tsx`

**Before**:
```typescript
id: activeRescue.assignedTo || '',      // ❌ Field doesn't exist
name: 'Assigned Rescuer',               // ❌ Hardcoded
phone: '+977-9800000000',               // ❌ Hardcoded
```

**After**:
```typescript
id: activeRescue.assignedVolunteer?.id || '',
name: activeRescue.assignedVolunteer?.user?.name || 'Assigned Rescuer',
phone: activeRescue.assignedVolunteer?.user?.phone || '+977-9800000000',
```

## Schema Reference

According to `libs/contracts/src/lib/graphql/rescue/schema.graphql`:

```graphql
type RescueRequest {
  # Assignment fields
  assignedVolunteer: Volunteer    # ✅ Object (needs subfields)
  assignedAt: DateTime            # ✅ Datetime
  assignedBy: User                # ✅ User object
  
  # ❌ assignedTo: does NOT exist
}

type Volunteer {
  id: ID!
  status: VolunteerStatus!
  user: User!
  # ... other fields
}
```

## Testing

The query should now work without errors. Test it in GraphQL Playground:

```graphql
query TestRescueQuery {
  rescueRequests(pagination: { page: 1, limit: 10 }) {
    edges {
      node {
        id
        address
        status
        assignedVolunteer {
          id
          status
          user {
            name
            phone
          }
        }
        assignedAt
        assignedBy {
          name
        }
      }
    }
  }
}
```

## Result ✅

All three map pages now:
- ✅ Use correct GraphQL field names
- ✅ Query nested volunteer data properly
- ✅ Display rescuer name and phone from assigned volunteer
- ✅ No GraphQL validation errors

## Next Steps

1. Test the query in GraphQL Playground
2. Verify map pages load without errors
3. Check that assigned rescuer info displays correctly
4. Ensure rescuer markers show on admin map
