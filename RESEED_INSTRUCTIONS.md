# Re-seed Database to Fix Enum Values

## Problem Fixed
The seed data had mixed-case enum values (e.g., "Intermediate", "Expert", "Both") but GraphQL schema expects uppercase values (e.g., "INTERMEDIATE", "EXPERT", "BOTH").

## Changes Made to seed.ts
- `experience`: "Expert" → "EXPERT", "Intermediate" → "INTERMEDIATE", "Beginner" → "BEGINNER"
- `vehicle`: "Both" → "BOTH", "Bike" → "BIKE", "Car" → "CAR", "None" → "NONE"
- `availableTime`: "Anytime" → "ANYTIME", "Weekends" → "WEEKENDS", "Evenings" → "EVENINGS"

## To Apply the Fix

Run the seed command to update the database:

```bash
npm run db:seed
```

This will:
1. Clear existing data
2. Re-create all users, volunteers, rescues, etc. with correct enum values

## After Reseeding

1. **Restart backend** (if running):
   ```bash
   # Stop current backend (Ctrl+C)
   npm run backend:dev
   ```

2. **Test the volunteers page**:
   - Login as admin: `admin@snakerescue.com` / `password123`
   - Navigate to `/dashboard/admin/rescuers`
   - Should now load successfully with 6 volunteers

## Verification

The query should now return data without enum errors:
```graphql
query GetVolunteers {
  volunteers {
    edges {
      node {
        id
        experience  # Now returns: EXPERT, INTERMEDIATE, or BEGINNER
        vehicle     # Now returns: BOTH, BIKE, CAR, or NONE
        availableTime # Now returns: ANYTIME, WEEKENDS, or EVENINGS
      }
    }
  }
}
```

## Note
All test credentials remain the same after reseeding.
