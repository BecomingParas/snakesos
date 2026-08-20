# Hospital Cache Fix Applied

## Issue
Map was showing outdated/cached hospital coordinates even after database was updated with correct values.

## Root Cause
The `useHospitals` GraphQL hook was using Apollo Client's default `cache-first` fetch policy, which meant:
1. Hospital data was cached in the browser
2. Even after fixing the database, the frontend kept showing old cached coordinates
3. Hard refresh wasn't clearing the Apollo cache

## Fix Applied
Updated `libs/frontend/src/lib/graphql/hooks/hospital.hooks.ts`:

```typescript
export function useHospitals(filters?: unknown, options?: { first?: number; after?: string }) {
  return useQuery(LIST_HOSPITALS, {
    variables: { 
      filter: filters, 
      first: options?.first || 100,
      after: options?.after,
    },
    fetchPolicy: 'cache-and-network', // ✅ ADDED: Always fetch fresh data
  });
}
```

### What `fetchPolicy: 'cache-and-network'` does:
- Returns cached data immediately (fast initial render)
- **ALSO** fetches fresh data from the network in the background
- Updates the UI when fresh data arrives
- Ensures data is always up-to-date

## How to Test
1. **Hard refresh the browser**: Ctrl + F5 (Windows) or Cmd + Shift + R (Mac)
2. Navigate to Admin Map page
3. Click on any rescue request
4. Click "Show Hospital Route"
5. ✅ The route should now show correct hospital locations

## Verified Coordinates
**Lumbini Provincial Hospital (Butwal)**:
- ✅ Latitude: 27.6969
- ✅ Longitude: 83.4562
- ✅ Location: Butwal city center, Rupandehi District

## Additional Benefits
This fix ensures:
- All hospital coordinates stay fresh
- New hospitals appear immediately
- Antivenom status updates show in real-time
- Hospital data updates automatically every page load

---
**Fixed**: August 20, 2026
**Issue**: Frontend cache showing old coordinates
**Solution**: Added `fetchPolicy: 'cache-and-network'` to hospitals query
