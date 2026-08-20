# Hospital Limit Fix - Show All 67 Hospitals

## 🐛 Problem
Only 20 hospitals showing instead of 67

## 🔍 Root Cause

The backend had a **default limit of 20** in the hospital service:

```typescript
// libs/backend/modules/src/hospital/application/hospital.service.ts
async listHospitals(filters, pagination = {}) {
  const limit = pagination.limit || 20;  // ← DEFAULT WAS 20!
  // ...
}
```

The frontend was passing `first: 100` but the resolver wasn't using it!

---

## ✅ Solution

Updated the GraphQL resolver to:
1. Accept `first` parameter (Relay-style pagination)
2. Use `first` as the limit
3. Default to **100** for admin views (instead of 20)

```typescript
// libs/backend/modules/src/hospital/infrastructure/graphql/resolvers/hospital-query.resolver.ts

hospitals: async (_parent, args, context) => {
  // Support both Relay-style (first/after) and traditional (pagination)
  const limit = args.first || args.pagination?.limit || 100; // ← NOW DEFAULTS TO 100!
  const page = args.pagination?.page || 1;

  const result = await hospitalService.listHospitals(args.filter, { page, limit });
  // ...
}
```

---

## 🚀 How to Apply

### 1. Restart Backend Server

The resolver code has been updated. Restart your backend:

```bash
# In project root
cd ~/OneDrive/Desktop/snake-rescue

# Stop backend (Ctrl+C in backend terminal)

# Restart backend
yarn dev:backend
```

### 2. Refresh Frontend

After backend restarts:
- Hard refresh browser: `Ctrl + Shift + R`
- Check console for: `[Admin Map] Loaded 67 hospitals across Nepal`
- Check statistics: Should show **HOSPITALS: 67**

---

## 🎯 Expected Result

### Before Fix ❌
```
HOSPITALS: 20  ← Only 20 showing
Map: 20 markers
```

### After Fix ✅
```
HOSPITALS: 67  ← All hospitals!
Map: 67 markers across Nepal
```

---

## 📊 Hospital Distribution

All 67 hospitals across 7 provinces:

| Province | Count |
|----------|-------|
| Bagmati | 12 |
| Koshi | 11 |
| Madhesh | 11 |
| Gandaki | 9 |
| Lumbini | 11 |
| Karnali | 6 |
| Sudurpaschim | 7 |
| **TOTAL** | **67** |

---

## 🔧 Technical Details

### Frontend Query
```tsx
// apps/frontend/src/app/(dashboard)/dashboard/admin/map/page.tsx
const { data } = useHospitals(
  { status: 'ACTIVE' },
  { first: 100 }  // ← Requests 100 hospitals
);
```

### GraphQL Query Sent
```graphql
query ListHospitals($filter: HospitalFilterInput, $first: Int) {
  hospitals(filter: $filter, first: $first) {
    edges {
      node {
        id
        name
        latitude
        longitude
        # ... all fields
      }
    }
  }
}

# Variables:
{
  "filter": { "status": "ACTIVE" },
  "first": 100  # ← This is now properly used!
}
```

### Backend Processing
```typescript
// Resolver extracts: first = 100
// Service receives: { limit: 100, page: 1 }
// Database query: findMany({ take: 100, skip: 0 })
// Returns: All 67 hospitals (less than limit)
```

---

## 🧪 Testing Checklist

After restarting backend:

- [ ] Backend console shows no errors
- [ ] Frontend console: `[Admin Map] Loaded 67 hospitals across Nepal`
- [ ] Statistics: **HOSPITALS: 67**
- [ ] Map: **67 green markers** visible
- [ ] Zoom out: Markers across all Nepal provinces
- [ ] Click markers: Popup shows hospital details

---

## 🐛 If Still Only Shows 20

### Check 1: Backend Restarted?
```bash
# Make sure backend is running with updated code
ps aux | grep node  # Check for running processes
# Kill old processes if needed
# Start fresh: yarn dev:backend
```

### Check 2: Browser Cache
```bash
# Hard refresh: Ctrl + Shift + R
# Or clear cache completely:
# Chrome: Settings → Privacy → Clear browsing data
```

### Check 3: Check Backend Logs
```bash
# Backend should show query with limit=100
# Look for Prisma query logs
```

### Check 4: Check GraphQL Request
```bash
# Browser DevTools → Network tab → GraphQL
# Click "hospitals" request
# Check Variables: { "first": 100 }
# Check Response: Should have 67 items in edges array
```

---

## 📁 Files Modified

```
libs/backend/modules/src/hospital/infrastructure/graphql/resolvers/hospital-query.resolver.ts
```

**Change**: Added support for `first` parameter and changed default from 20 to 100

---

## ✅ Status

**Backend Fix Applied**: ✓  
**Default Limit Changed**: 20 → 100 ✓  
**Relay Pagination Supported**: ✓  

**Action Required**: **Restart backend server!**

---

**Once backend is restarted, all 67 hospitals will display!** 🚀
