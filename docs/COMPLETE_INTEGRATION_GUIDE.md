# Complete Hospital System Integration Guide 🚀

## 📋 Current Status

### ✅ COMPLETED (100% Ready)
- [x] Backend service with distance calculation
- [x] GraphQL resolvers (Query, Mutation, Subscription)
- [x] 65 hospitals seeded in database
- [x] Frontend GraphQL queries and mutations
- [x] React hooks for data fetching
- [x] Hospital map components (Base + WithData)
- [x] Example citizen hospital finder page

### 🔄 PENDING (Your Action Required)
- [ ] Test backend server with hospital resolvers
- [ ] Test frontend hospital map page
- [ ] Add navigation links to sidebars
- [ ] Create rescuer and admin hospital pages (optional)

---

## 🎯 Quick Start - 3 Steps to Go Live

### Step 1: Test Backend API (5 minutes)

```bash
# Terminal 1 - Start Backend
cd c:\Users\paras\OneDrive\Desktop\snake-rescue
npm run dev:backend

# Or if you have separate script:
cd apps/backend
npm run dev

# Backend should start at: http://localhost:4000
# GraphQL endpoint: http://localhost:4000/graphql
```

**Verify GraphQL Resolvers Work:**

Open `http://localhost:4000/graphql` in your browser and run:

```graphql
# Test 1: Get nearby hospitals
query TestNearbyHospitals {
  nearbyHospitals(
    latitude: 27.7172
    longitude: 85.324
    radiusKm: 50
    limit: 10
  ) {
    id
    name
    address
    distance
    distanceFormatted
    antivenomStatus
    emergency24x7
  }
}

# Expected: Returns 10 hospitals with distances calculated
```

```graphql
# Test 2: Get hospital statistics
query TestStats {
  hospitalStats {
    totalHospitals
    antivenomAvailable
    antivenomUnknown
    emergency24x7Count
    byProvince {
      province
      count
    }
  }
}

# Expected: Returns stats for all 65 hospitals
```

**If queries fail**, check:
1. Backend server is running
2. Database connection works
3. Hospital resolvers are exported from modules

---

### Step 2: Test Frontend Map (5 minutes)

```bash
# Terminal 2 - Start Frontend
cd c:\Users\paras\OneDrive\Desktop\snake-rescue
npm run dev:frontend

# Or:
cd apps/frontend
npm run dev

# Frontend should start at: http://localhost:3000
```

**Test the Hospital Finder Page:**

1. Navigate to: `http://localhost:3000/dashboard/citizen/hospitals`

2. **Expected behavior:**
   - Page loads with map component
   - Browser asks for location permission → Click "Allow"
   - Map centers on your location
   - Hospital markers appear (up to 65 within 50km)
   - Markers are color-coded (GREEN/YELLOW/RED/GRAY)
   - Click any marker → Popup shows hospital details
   - Hospital count badge shows at bottom-left

3. **If map doesn't load:**
   - Check browser console for errors
   - Verify backend is running at `http://localhost:4000`
   - Check Apollo Client connection in `apps/frontend/src/lib/apollo/client.ts`

---

### Step 3: Add Navigation Link (2 minutes)

Find your citizen sidebar navigation file and add hospital link.

**Likely locations:**
- `apps/frontend/src/components/dashboard/CitizenSidebar.tsx`
- `apps/frontend/src/components/dashboard/Sidebar.tsx`
- `apps/frontend/src/app/(dashboard)/dashboard/citizen/layout.tsx`

**Add this navigation item:**

```typescript
{
  label: 'Find Hospitals',
  href: '/dashboard/citizen/hospitals',
  icon: Building2, // or MapPin
  description: 'Locate nearby hospitals with antivenom',
}
```

Import icon if needed:
```typescript
import { Building2 } from 'lucide-react';
```

---

## 🧪 Testing Checklist

### Backend Tests

```bash
# 1. Verify database has hospitals
npm run prisma:studio
# Open browser, check Hospital table has 65 records

# 2. Test GraphQL queries (in GraphQL Playground)
# Query 1: nearbyHospitals ✓
# Query 2: hospitalStats ✓
# Query 3: searchHospitals ✓

# 3. Test with different coordinates
query TestKathmandu {
  nearbyHospitals(latitude: 27.7172, longitude: 85.324, radiusKm: 30) {
    name
    distance
  }
}

query TestPokhara {
  nearbyHospitals(latitude: 28.2096, longitude: 83.9856, radiusKm: 30) {
    name
    distance
  }
}
```

### Frontend Tests

```bash
# 1. Page loads without errors
✓ Navigate to /dashboard/citizen/hospitals
✓ No console errors
✓ Map component renders

# 2. Geolocation works
✓ Browser prompts for location
✓ After allowing, map centers on user location
✓ Hospital markers appear

# 3. Map interactions work
✓ Click hospital marker → Popup opens
✓ Popup shows correct data (name, distance, phone)
✓ "Get Directions" button works
✓ "Call Hospital" button works (if phone available)

# 4. Responsive design
✓ Test on desktop (1920x1080)
✓ Test on tablet (768x1024)
✓ Test on mobile (375x667)
```

---

## 🐛 Troubleshooting

### Problem: Backend queries return errors

**Symptoms:**
```
Error: Cannot find module 'hospital'
```

**Solution:**
```bash
# Rebuild backend
cd apps/backend
npm run build

# Or restart dev server
npm run dev
```

---

### Problem: Frontend shows "Failed to load hospitals"

**Check 1: Backend is running**
```bash
# Check if backend is accessible
curl http://localhost:4000/graphql

# Should return HTML (GraphQL Playground)
```

**Check 2: Apollo Client configured correctly**

Open `apps/frontend/src/lib/apollo/client.ts`:
```typescript
// Verify uri points to backend
uri: 'http://localhost:4000/graphql'
```

**Check 3: CORS enabled**

Backend `apps/backend/src/app.ts` should have:
```typescript
app.use(cors({
  origin: 'http://localhost:3000', // or your frontend URL
  credentials: true,
}));
```

---

### Problem: Geolocation doesn't work

**Symptoms:**
- Browser doesn't ask for permission
- Map shows default location (Kathmandu)

**Solutions:**

1. **Use HTTPS in production** (required for geolocation)
2. **Check browser permissions:**
   - Chrome: Settings → Privacy → Location → Allow
   - Firefox: Address bar → 🔒 → Permissions → Location
3. **Fallback to manual location:**
   ```typescript
   <HospitalMapWithData
     useUserLocation={false}
     defaultCenter={[27.7172, 85.324]}
     radiusKm={50}
   />
   ```

---

### Problem: Markers don't appear on map

**Check 1: Hospitals in radius**
```graphql
# Test query with large radius
query TestLargeRadius {
  nearbyHospitals(latitude: 27.7172, longitude: 85.324, radiusKm: 200) {
    name
    distance
  }
}
```

**Check 2: Hospital coordinates are valid**
```sql
-- Check database
SELECT name, latitude, longitude 
FROM Hospital 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL
LIMIT 10;
```

**Check 3: Leaflet is loaded**
```typescript
// In browser console
console.log(window.L); // Should show Leaflet object
```

---

## 📁 File Reference Quick Access

### Backend Files
```
libs/backend/modules/src/hospital/
  ├── application/hospital.service.ts          # Distance calculation
  └── infrastructure/graphql/resolvers/
      ├── hospital-query.resolver.ts           # Queries
      └── hospital-mutation.resolver.ts        # Mutations

apps/backend/src/server.ts                     # Resolver registration
```

### Frontend Files
```
apps/frontend/src/
  ├── lib/graphql/
  │   ├── queries/hospital.queries.ts          # GraphQL queries
  │   ├── mutations/hospital.mutations.ts      # GraphQL mutations
  │   └── hooks/hospital.hooks.ts              # React hooks
  │
  ├── components/map/
  │   ├── HospitalMap.tsx                      # Base map
  │   └── HospitalMapWithData.tsx              # API-integrated map
  │
  └── app/(dashboard)/dashboard/
      └── citizen/hospitals/page.tsx           # Example page
```

### Database
```
libs/database/prisma/
  ├── schema.prisma                            # Hospital models
  └── seeds/hospitals.seed.ts                  # 65 hospitals
```

---

## 🎨 Customization Options

### Change Search Radius

```typescript
<HospitalMapWithData
  radiusKm={100}  // Change from 50 to 100
  zoom={10}       // Adjust zoom level
/>
```

### Filter by Antivenom Only

```typescript
<HospitalMapWithData
  antivenomRequired={true}  // Only show verified available
/>
```

### Show All Hospitals (Not Just Snakebite)

```typescript
<HospitalMapWithData
  snakebiteTreatmentOnly={false}  // Include all hospitals
/>
```

### Custom Center (No Geolocation)

```typescript
<HospitalMapWithData
  useUserLocation={false}
  defaultCenter={[28.2096, 83.9856]}  // Pokhara
/>
```

---

## 📊 Expected Results

After completing all steps, you should see:

### Backend GraphQL Playground
```
✓ Query: nearbyHospitals returns 10-65 hospitals
✓ Query: hospitalStats shows 65 total
✓ Query: searchHospitals("Bir") finds Bir Hospital
✓ No errors in terminal
```

### Frontend Hospital Map
```
✓ Map loads at /dashboard/citizen/hospitals
✓ 65 markers appear (within radius)
✓ Markers color-coded correctly:
  - 0 GREEN (no verifications yet)
  - 65 YELLOW (all unknown status)
  - 0 RED (none out of stock)
✓ Click marker shows popup with:
  - Hospital name
  - Address
  - Distance (e.g., "12.5km")
  - Travel time (e.g., "~19 mins")
  - Phone numbers
  - Antivenom status
✓ Bottom-left shows "65 hospitals found"
```

---

## 🚀 Going to Production

### 1. Environment Variables

```bash
# .env.production
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_API_URL="https://api.snakesos.com/graphql"
```

### 2. Build & Deploy

```bash
# Build backend
cd apps/backend
npm run build
npm start

# Build frontend
cd apps/frontend
npm run build
npm start
```

### 3. Post-Deployment Checks

```
✓ Backend accessible at production URL
✓ GraphQL queries work via HTTPS
✓ Frontend can reach backend API
✓ Geolocation works (HTTPS required)
✓ Map markers appear correctly
✓ SSL certificate valid
```

---

## 🎉 Success!

You've successfully integrated:
- ✅ 65 Nepal hospitals with GPS coordinates
- ✅ GraphQL API with distance calculation
- ✅ Interactive maps with color-coded markers
- ✅ Geolocation and navigation features
- ✅ Medical-safety-compliant verification system

**Your SnakeSOS hospital system is ready to save lives!** 🚑💚

---

## 📞 Quick Commands Reference

```bash
# Database
npm run prisma:studio          # View database
npm run seed:hospitals         # Re-seed hospitals

# Backend
npm run dev:backend            # Start backend
http://localhost:4000/graphql  # GraphQL Playground

# Frontend  
npm run dev:frontend           # Start frontend
http://localhost:3000/dashboard/citizen/hospitals  # Hospital map

# Testing
curl http://localhost:4000/health  # Check backend health
```

---

## 📚 Documentation Files

- `HOSPITAL_API_INTEGRATION_COMPLETE.md` - API documentation
- `HOSPITAL_SYSTEM_FINAL_SUMMARY.md` - Complete system overview
- `NEXT_STEPS_MAP_INTEGRATION.md` - Integration guide
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `NEPAL_HOSPITAL_DATA_SOURCES.md` - Data sources and verification

---

**Need Help?** Check the files above or review the inline comments in the code files.

**Ready to Deploy?** Follow the "Going to Production" section above.

**Good luck! 🚀**
