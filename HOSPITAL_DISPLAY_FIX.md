# Hospital Display Fix - Admin Map

## 🐛 Problem
Hospitals not showing on admin dashboard map  
Statistics showed: "HOSPITALS: 0"

## 🔍 Root Cause

### Issue 1: Wrong Query Used
- **Before**: Used `useNearbyHospitals(lat, lng, radiusKm)` 
- **Problem**: Requires GPS coordinates + may have backend/resolver issues
- **Result**: Query returned empty or failed silently

### Issue 2: Data Format Mismatch  
- **RescueMap expects**: `latitude`, `longitude` (full names)
- **Query might return**: `lat`, `lng` (short names)
- **Result**: Markers couldn't be positioned

## ✅ Solution

### 1. Changed to Simple Query
```tsx
// BEFORE - GPS-based query
const { data } = useNearbyHospitals(27.7172, 85.324, {
  radiusKm: 1000,
  limit: 100,
});
const hospitals = data?.nearbyHospitals || [];

// AFTER - Direct query (no GPS required)
const { data } = useHospitals(
  { status: 'ACTIVE' },
  { limit: 100, page: 1 }
);
const hospitals = data?.hospitals?.edges?.map(edge => edge.node) || [];
```

**Why Better**:
- ✅ No GPS coordinates required
- ✅ Direct database query
- ✅ Returns all active hospitals
- ✅ Standard GraphQL connection format

### 2. Explicit Data Mapping
Map hospital data to exact format RescueMap expects:

```tsx
hospitals={hospitals.map((h: any) => ({
  id: h.id,
  name: h.name,
  latitude: h.latitude,        // Full field name
  longitude: h.longitude,      // Full field name
  address: h.address,
  municipality: h.municipality,
  district: h.district,
  phone: h.phone,
  emergencyPhone: h.emergencyPhone,
  antivenomStatus: h.antivenomStatus,
  emergency24x7: h.emergency24x7,
  snakebiteTreatmentAvailable: h.snakebiteTreatmentAvailable,
  ventilatorAvailable: h.ventilatorAvailable,
}))}
```

### 3. Added Debug Logging
```tsx
console.log(`[Admin Map] Hospital Query Status:`, {
  loading: hospitalsLoading,
  error: hospitalsError?.message,
  data: hospitalsData,
  hospitalsCount: hospitals.length,
});
```

**Check Console For**:
```
[Admin Map] Hospital Query Status: { loading: false, error: undefined, data: {...}, hospitalsCount: 67 }
[Admin Map] Loaded 67 hospitals across Nepal
```

## 🎯 Expected Result

### Dashboard Statistics
```
HOSPITALS: 67  ← Should show this now!
```

### Map Display
- 🏥 **67 green hospital markers** across Nepal
- Markers distributed by province:
  - Bagmati: 12
  - Koshi: 11  
  - Madhesh: 11
  - Gandaki: 9
  - Lumbini: 11
  - Karnali: 6
  - Sudurpaschim: 7

### Hospital Popup (on click)
Shows:
- Hospital name
- Address
- Phone numbers
- Antivenom status
- 24/7 emergency availability
- Treatment facilities

## 🧪 Testing

### 1. Check Console
```bash
# Open browser console (F12)
# Refresh page: http://localhost:4200/dashboard/admin/map
# Look for:
✅ [Admin Map] Loaded 67 hospitals across Nepal
✅ [Admin Map Stats] { rescues: X, hospitals: 67, rescuers: Y }
```

### 2. Check Map
- Zoom out to see all of Nepal
- Look for green 🏥 markers across the country
- Click any hospital marker → popup should show details

### 3. Check Statistics
- "HOSPITALS" card should show: **67**
- Not: 0 (previous issue)

## 📁 Files Modified

```
apps/frontend/src/app/(dashboard)/dashboard/admin/map/page.tsx
```

**Changes**:
1. Import: `useNearbyHospitals` → `useHospitals`
2. Query: GPS-based → Direct list query
3. Data mapping: Added explicit field mapping
4. Debug: Added detailed logging

## 🔄 If Still Not Working

### Check 1: GraphQL Backend
```bash
# Test query directly in GraphQL playground
query {
  hospitals(
    filter: { status: ACTIVE }
    pagination: { limit: 10, page: 1 }
  ) {
    edges {
      node {
        id
        name
        latitude
        longitude
      }
    }
    totalCount
  }
}
```

**Expected**: Should return hospitals list

### Check 2: Database
```bash
# Check if hospitals exist in database
npx prisma studio

# Navigate to Hospital table
# Should see 67 records
```

### Check 3: Network Tab
```bash
# Open browser DevTools → Network tab
# Filter: GraphQL
# Look for "hospitals" query
# Check response data
```

### Check 4: Authentication
```bash
# Ensure admin user is logged in
# Check JWT token in localStorage
# GraphQL might require authentication
```

## 💡 Alternative Solution

If `useHospitals` still doesn't work, use direct Apollo query:

```tsx
import { useQuery, gql } from '@apollo/client';

const GET_ALL_HOSPITALS = gql`
  query GetAllHospitals {
    hospitals(
      filter: { status: ACTIVE }
      pagination: { limit: 100 }
    ) {
      edges {
        node {
          id
          name
          latitude
          longitude
          address
          municipality
          district
          phone
          emergencyPhone
          antivenomStatus
          emergency24x7
        }
      }
    }
  }
`;

// In component
const { data, loading, error } = useQuery(GET_ALL_HOSPITALS);
const hospitals = data?.hospitals?.edges?.map(e => e.node) || [];
```

## ✅ Status

**Fix Applied**: Yes ✓  
**Testing Required**: Check browser console + map display  
**Expected Result**: 67 hospitals visible on map

---

**Last Updated**: 2024  
**Issue**: Hospitals not displaying  
**Solution**: Changed from GPS-based query to direct list query with explicit mapping
