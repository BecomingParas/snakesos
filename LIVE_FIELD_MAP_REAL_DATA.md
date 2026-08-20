# Live Field Map - Real Data Integration

## ✅ What Was Updated

The **"Live field map"** on the admin dashboard overview now fetches and displays **ALL REAL DATA** instead of mock data.

---

## 📍 Location

**Page**: Admin Dashboard Overview  
**Path**: `/dashboard/admin`  
**Component**: `LiveFieldMap` in the overview section

**NOT the detailed map page** (`/dashboard/admin/map` - that was already fixed)

---

## 🔄 What Changed

### Before ❌
```tsx
// Used mock data
import { markers } from '@/lib/dashboard-data'

<LiveFieldMap markers={markers} />  // Mock data only
```

### After ✅
```tsx
// Fetches ALL real data
const { data: rescuesData } = useActiveRescuesQuery({ ... })
const { data: volunteersData } = useVolunteersQuery({ ... })
const { data: hospitalsData } = useHospitals({ ... })

// Converts to markers
const realMarkers = [
  ...rescues.map(r => ({ ... })),      // All active rescues
  ...volunteers.map(v => ({ ... })),   // All available volunteers
  ...hospitals.slice(0, 20).map(h => ({ ... }))  // Sample of hospitals
]

<LiveFieldMap markers={realMarkers} />  // Real data!
```

---

## 📊 Data Sources

### 1. **Active Rescues** (Call-outs) 🐍
- **Query**: `useActiveRescuesQuery`
- **Limit**: 200 rescues
- **Refresh**: Every 30 seconds
- **Display**: Shows location, priority, status

### 2. **Available Volunteers** (Handlers) 🧑‍🚒
- **Query**: `useVolunteersQuery`
- **Filter**: APPROVED + AVAILABLE only
- **Limit**: 200 volunteers
- **Refresh**: Every 30 seconds
- **Display**: Shows name, municipality, availability

### 3. **Hospitals** (Facilities) 🏥
- **Query**: `useHospitals`
- **Limit**: 100 hospitals (shows first 20 on overview)
- **Display**: Shows name, location, 24/7 status

---

## 🎯 Expected Result

### Overview Map Will Show:
- ✅ **Red/Orange markers**: CRITICAL/HIGH priority rescues
- ✅ **Yellow markers**: MEDIUM priority rescues
- ✅ **Green markers**: LOW priority rescues + volunteers + hospitals
- ✅ **Real-time positions**: Based on actual GPS coordinates
- ✅ **Auto-refresh**: Updates every 30 seconds

### Console Log
Check browser console for:
```
[Admin Dashboard] Live field map data: {
  rescues: X,
  volunteers: Y,
  hospitals: Z,
  markers: X+Y+Z total
}
```

---

## 🔄 Real-Time Updates

All data refreshes automatically:
- **Rescues**: Every 30 seconds
- **Volunteers**: Every 30 seconds
- **Hospitals**: Static (no need to refresh)

The map will show live field changes without manual refresh!

---

## 🗺️ Geographic Conversion

Real GPS coordinates are converted to map positions:

```typescript
// Nepal bounds: Lat 26.3-30.4, Lng 80.0-88.2

// Convert latitude/longitude to map percentage
x = ((longitude - 80.0) / 8.2) * 100  // West to East
y = (1 - (latitude - 26.3) / 4.1) * 100  // North to South (inverted)
```

Example:
- Kathmandu (27.7172, 85.324) → x: 65%, y: 65%
- Pokhara (28.2096, 83.9856) → x: 49%, y: 53%

---

## 🎨 Marker Types

### Call-outs (Rescues)
- **ID**: `rescue-{id}`
- **Type**: `rescue`
- **Label**: Snake description + Municipality
- **Color**: Based on priority (RED/ORANGE/YELLOW/GREEN)
- **Status**: PENDING/ASSIGNED/IN_PROGRESS

### Handlers (Volunteers)
- **ID**: `volunteer-{id}`
- **Type**: `handler`
- **Label**: Volunteer name + Municipality
- **Color**: GREEN
- **Status**: AVAILABLE/BUSY

### Facilities (Hospitals)
- **ID**: `hospital-{id}`
- **Type**: `facility`
- **Label**: Hospital name + Municipality
- **Color**: GREEN
- **Status**: AVAILABLE (24/7) / LIMITED

---

## 🔧 Performance

### Overview Map (Optimized)
- Shows **first 20 hospitals** only (not all 67)
- Reason: Overview map is small, too many markers = cluttered
- Full map available at `/dashboard/admin/map`

### Data Limits
- Rescues: 200 (shows all active)
- Volunteers: 200 (shows all available)
- Hospitals: 20 on overview, 100 on full map

---

## 📁 Files Modified

```
apps/frontend/src/app/(dashboard)/dashboard/admin/page.tsx
```

**Changes**:
1. Import GraphQL hooks: `useActiveRescuesQuery`, `useVolunteersQuery`, `useHospitals`
2. Fetch all real data with polling (30s)
3. Convert data to MapMarker format
4. Pass real markers to LiveFieldMap
5. Fallback to mock data if queries fail
6. Add console logging for debugging

---

## 🧪 Testing

### 1. Visit Admin Dashboard
```
http://localhost:4200/dashboard/admin
```

### 2. Check "Live field map" Section
- Should see markers on map
- Markers should match real data (not random mock positions)

### 3. Check Console
```
[Admin Dashboard] Live field map data: {
  rescues: X,
  volunteers: Y, 
  hospitals: Z,
  markers: X+Y+Z
}
```

### 4. Compare with Full Map
```
# Full map page
http://localhost:4200/dashboard/admin/map

# Should show same rescues + volunteers + MORE hospitals (67 vs 20)
```

---

## 🔍 Debugging

### If Overview Map Shows No Markers

**Check 1**: Console logs
```javascript
// Should see data counts
[Admin Dashboard] Live field map data: { rescues: 4, volunteers: 3, hospitals: 20, markers: 27 }
```

**Check 2**: GraphQL queries
```javascript
// Check browser Network tab
// Look for: activeRescues, volunteers, hospitals queries
// Verify they return data
```

**Check 3**: Fallback to mock
```javascript
// If realMarkers.length === 0, uses mock data
// This means queries returned empty
// Check backend logs
```

---

## 🎯 Differences: Overview vs Full Map

| Feature | Overview Map | Full Map Page |
|---------|-------------|---------------|
| Location | `/dashboard/admin` | `/dashboard/admin/map` |
| Size | Small (400px) | Large (600px) |
| Rescues | All active | All active |
| Volunteers | All available | All available |
| Hospitals | 20 sample | 67 all |
| Zoom | Nepal overview | Adjustable |
| Details | Click for tooltip | Click for full popup |
| Purpose | Quick glance | Detailed ops |

---

## ✅ Status

**Real Data Integration**: ✓  
**Auto-refresh**: ✓ (30 seconds)  
**All 3 data sources**: ✓  
**Fallback to mock**: ✓  

**System Ready**: The overview "Live field map" now shows REAL rescue operations data!

---

## 🚀 Next Steps

1. **Test on overview page**: `/dashboard/admin`
2. **Verify real data appears**: Check console logs
3. **Create rescue/volunteer**: See them appear on map
4. **Wait 30 seconds**: Map should auto-update

**The overview now provides true live field visibility!** 🎉
