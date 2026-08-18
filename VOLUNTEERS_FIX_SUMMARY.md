# Volunteers/Rescuers Page Fix Summary

## Problem
The Admin Rescuers page at `/dashboard/admin/rescuers` was showing GraphQL errors and not loading volunteer data.

### Errors Encountered
1. `Cannot return null for non-nullable field Query.volunteers`
2. `Cannot query field "specialization" on type "Volunteer"`  
3. `Cannot query field "verificationStatus" on type "Volunteer"`
4. `Cannot query field "isActive" on type "Volunteer"`

## Root Causes

### 1. Missing Volunteers Resolver
- The `volunteers` query was defined in GraphQL schema but resolver was missing from backend
- Added resolver to `auth.resolver.ts` (since volunteers are user-related)

### 2. Schema Mismatches
- **Frontend was querying**: `specialization`, `verificationStatus`, `isActive`
- **Actual Prisma schema has**: `skills: string[]`, `status: VolunteerStatus`, no `isActive` field

### 3. Non-existent Mutation
- Frontend tried to use `updateVolunteerStatus` mutation which doesn't exist in schema
- Schema has: `verifyVolunteer`, `suspendVolunteer`, `reactivateVolunteer` instead

### 4. Enum Value Case Mismatch
- **Seed data had**: "Intermediate", "Expert", "Beginner", "Both", "Anytime", etc. (mixed case)
- **GraphQL schema expects**: "INTERMEDIATE", "EXPERT", "BEGINNER", "BOTH", "ANYTIME", etc. (uppercase)
- GraphQL enum validation failed with: `Enum "ExperienceLevel" cannot represent value: "Intermediate"`

## Solutions Implemented

### Backend Changes

#### 1. Added `volunteers` Resolver (`auth.resolver.ts`)
```typescript
volunteers: async (_parent, args, context) => {
  try {
    context.requireAuth();
    context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

    const { pagination, filter } = args;
    const limit = pagination?.limit || 50;
    const page = pagination?.page || 1;
    const skip = (page - 1) * limit;

    // Build where clause with correct fields
    const where: any = {};
    if (filter?.status) where.status = filter.status;
    if (filter?.experience) where.experience = filter.experience;
    if (filter?.municipality) where.municipality = { contains: filter.municipality, mode: 'insensitive' };
    if (filter?.isAvailableNow !== undefined) where.isAvailableNow = filter.isAvailableNow;

    // Fetch with user relation
    const [volunteers, totalCount] = await Promise.all([
      prisma.volunteer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      }),
      prisma.volunteer.count({ where }),
    ]);

    // Return proper VolunteerConnection structure
    return {
      edges: volunteers.map((volunteer) => ({
        node: volunteer,
        cursor: volunteer.id,
      })),
      pageInfo: {
        hasNextPage: skip + volunteers.length < totalCount,
        hasPreviousPage: page > 1,
        startCursor: volunteers.length > 0 ? volunteers[0].id : null,
        endCursor: volunteers.length > 0 ? volunteers[volunteers.length - 1].id : null,
      },
      totalCount,
    };
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    throw error;
  }
}
```

### Frontend Changes

#### 2. Fixed TypeScript Interfaces (`volunteer.hooks.ts`)
```typescript
// BEFORE
export interface Volunteer {
  specialization?: string;
  verificationStatus: string;
  isActive: boolean;
}

// AFTER
export interface Volunteer {
  skills: string[];
  status: string;  // VERIFIED | APPROVED | PENDING | SUSPENDED
}
```

#### 3. Fixed GraphQL Query (`volunteer.hooks.ts`)
```graphql
# BEFORE
query GetVolunteers {
  volunteers {
    edges {
      node {
        specialization
        verificationStatus
        isActive
      }
    }
  }
}

# AFTER  
query GetVolunteers {
  volunteers {
    edges {
      node {
        skills
        status
      }
    }
  }
}
```

#### 4. Updated Rescuers Page Component (`rescuers/page.tsx`)
- Changed filter from `verificationStatus` to `status`
- Removed references to `isActive` field
- Removed `updateVolunteerStatus` mutation usage
- Simplified actions (removed status toggle buttons temporarily)
- Updated status badge logic to use `status` field

```typescript
// BEFORE
filter: {
  verificationStatus: 'VERIFIED',
  isActive: true
}

// AFTER
filter: {
  status: 'VERIFIED'
}
```

#### 5. Removed Non-existent Mutation
- Removed `useUpdateVolunteerStatusMutation` import and usage
- Action buttons now show placeholder message
- Can be implemented later using proper mutations:
  - `verifyVolunteer(volunteerId, notes)`
  - `suspendVolunteer(volunteerId, reason)`  
  - `reactivateVolunteer(volunteerId)`

## Database Schema Reference

### Volunteer Model (Prisma)
```prisma
model Volunteer {
  id String @id @default(uuid())
  
  // Core fields
  experience String  // "Beginner" | "Intermediate" | "Expert"
  skills String[]    // ["First Aid", "Snake Handling", etc]
  status VolunteerStatus  // PENDING | APPROVED | VERIFIED | SUSPENDED
  isAvailableNow Boolean
  
  // NO specialization field
  // NO isActive field
  // NO verificationStatus field
}

enum VolunteerStatus {
  PENDING
  APPROVED
  VERIFIED
  SUSPENDED
}
```

## Test Data

The seed file creates 6 volunteer profiles:
- **Bikash Thapa** - VERIFIED, Expert, 412 rescues
- **Anjali Rai** - VERIFIED, Expert, 288 rescues
- **Sabina Tamang** - VERIFIED, Intermediate, 164 rescues
- **Dipesh Lama** - VERIFIED, Intermediate, 121 rescues
- **Nisha Poudel** - APPROVED, Beginner, 23 rescues
- **Prabin Sah** - VERIFIED, Intermediate, 58 rescues

## Testing Instructions

1. **Run seed** (if not already done):
   ```bash
   npm run db:seed
   ```

2. **Restart backend** to pick up resolver changes:
   ```bash
   npm run backend:dev
   ```

3. **Test as Admin**:
   - Login: `admin@snakerescue.com` / `password123`
   - Navigate to `/dashboard/admin/rescuers`
   - Should see 6 volunteers listed with proper data

4. **Test Filters**:
   - Click "Verified" → Should show 5 verified rescuers
   - Click "Pending" → Should show 0 (none in seed data)
   - Click "Available" → Should show volunteers with `isAvailableNow: true`
   - Search by name/location

## Status

✅ **COMPLETE** - Volunteers page loads successfully with all data

## Next Steps (Optional Enhancements)

1. Implement proper volunteer status mutations using existing schema:
   - Wire up `verifyVolunteer` mutation to "Verify" button
   - Add suspend/reactivate functionality
   
2. Add volunteer details modal/page

3. Add bulk operations (bulk approve, etc)

4. Add volunteer performance charts

## Re-seeding Required

After fixing the enum values in seed.ts, you must re-seed the database:

```bash
npm run db:seed
```

This updates all volunteer records to use uppercase enum values that match the GraphQL schema.

## Files Modified

### Backend
- `libs/backend/modules/src/auth/infrastructure/graphql/resolvers/auth.resolver.ts` - Added volunteers resolver
- `libs/database/prisma/seed.ts` - Fixed enum values to uppercase

### Frontend
- `apps/frontend/src/lib/graphql/hooks/volunteer.hooks.ts`
- `apps/frontend/src/app/(dashboard)/dashboard/admin/rescuers/page.tsx`

## Related GraphQL Schema Files
- `libs/contracts/src/lib/graphql/volunteer/schema.graphql`
- `libs/contracts/src/lib/graphql/volunteer/queries.graphql`
- `libs/contracts/src/lib/graphql/volunteer/mutations.graphql`
