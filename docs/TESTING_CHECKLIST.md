# 🧪 Hospital Integration - Testing Checklist

## Quick Reference for Testing All Hospital Features

---

## 🚀 Pre-Test Setup

### Start Servers

```bash
# Terminal 1 - Backend
cd c:\Users\paras\OneDrive\Desktop\snake-rescue
npm run dev:backend
# ✓ Backend running at http://localhost:4000

# Terminal 2 - Frontend  
npm run dev:frontend
# ✓ Frontend running at http://localhost:3000
```

### Verify Database

```bash
# Open Prisma Studio
npm run prisma:studio

# Check:
# ✓ Hospital table has 65 records
# ✓ All hospitals have latitude/longitude
# ✓ antivenomStatus = "UNKNOWN" for all (initially)
```

---

## 📋 Backend API Tests

### Test in GraphQL Playground
**URL:** http://localhost:4000/graphql

#### ✅ Test 1: Nearby Hospitals (Kathmandu)
```graphql
query TestKathmandu {
  nearbyHospitals(
    latitude: 27.7172
    longitude: 85.324
    radiusKm: 50
    limit: 10
  ) {
    id
    name
    distance
    distanceFormatted
    antivenomStatus
    emergency24x7
  }
}
```
**Expected:** 
- [ ] Returns 5-15 hospitals
- [ ] Distances calculated correctly (sorted ascending)
- [ ] All have antivenomStatus = "UNKNOWN"
- [ ] distanceFormatted shows "X.Xkm"

---

#### ✅ Test 2: Hospital Statistics
```graphql
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
```
**Expected:**
- [ ] totalHospitals = 65
- [ ] antivenomUnknown = 65 (all unknown initially)
- [ ] byProvince shows 7 provinces
- [ ] Distribution looks reasonable

---

#### ✅ Test 3: Search Hospitals
```graphql
query TestSearch {
  searchHospitals(query: "Bir", limit: 5) {
    id
    name
    address
    district
    antivenomStatus
  }
}
```
**Expected:**
- [ ] Finds "Bir Hospital" in Kathmandu
- [ ] Returns up to 5 results
- [ ] Name/address contain "Bir"

---

#### ✅ Test 4: Different Locations

**Pokhara:**
```graphql
query TestPokhara {
  nearbyHospitals(latitude: 28.2096, longitude: 83.9856, radiusKm: 30) {
    name
    district
    distance
  }
}
```
**Expected:**
- [ ] Returns Pokhara-area hospitals
- [ ] Western Nepal hospitals (Gandaki Province)

**Birgunj:**
```graphql
query TestBirgunj {
  nearbyHospitals(latitude: 27.0087, longitude: 84.8788, radiusKm: 30) {
    name
    district
    distance
  }
}
```
**Expected:**
- [ ] Returns Birgunj-area hospitals
- [ ] Madhesh Province hospitals

---

## 🗺️ Frontend Map Tests

### Test 1: Citizen Hospital Finder Page

**URL:** http://localhost:3000/dashboard/citizen/hospitals

#### Visual Checks:
- [ ] Page loads without errors
- [ ] Emergency alert banner visible (red)
- [ ] Three info cards displayed (Green/Yellow/Phone)
- [ ] Map container renders
- [ ] Map legend displayed

#### Geolocation:
- [ ] Browser asks "Allow location?"
- [ ] After allowing: Map centers on user location
- [ ] Hospital markers appear on map
- [ ] User location shown (blue pulsing circle)

#### Hospital Markers:
- [ ] Markers use hospital emoji (🏥)
- [ ] Most markers are yellow (status UNKNOWN)
- [ ] Markers are clickable
- [ ] Correct count shown (e.g., "15 hospitals found")

#### Marker Popup:
- [ ] Click any marker → Popup opens
- [ ] Shows hospital name
- [ ] Shows full address
- [ ] Shows phone numbers (if available)
- [ ] Shows antivenom status badge (yellow "Unknown")
- [ ] Shows distance (e.g., "2.5km away")
- [ ] Shows travel time (e.g., "~4 mins")
- [ ] 24/7 indicator if applicable

#### Responsive:
- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)

---

### Test 2: Citizen Map Page (with Rescues)

**URL:** http://localhost:3000/dashboard/citizen/map

#### Visual Checks:
- [ ] Page loads without errors
- [ ] Statistics cards displayed
- [ ] Map renders with both rescues AND hospitals
- [ ] Legend includes hospital markers

#### Hospital Display:
- [ ] Hospital markers visible (yellow 🏥)
- [ ] Smaller/fewer than hospital finder (30km radius)
- [ ] Do not interfere with rescue markers
- [ ] Click hospital → Popup works

#### Integration:
- [ ] Rescue markers work (🐍)
- [ ] Rescuer markers work (👨‍⚕️) (if any)
- [ ] Hospital markers work (🏥)
- [ ] User location works (🔵)
- [ ] All markers render without Z-index conflicts

#### Legend Check:
- [ ] Legend shows 6 items:
  - [ ] My Request (🐍)
  - [ ] Rescuer (👨‍⚕️)
  - [ ] Hospital (Antivenom) (🏥 green)
  - [ ] Hospital (Unknown) (🏥 yellow)
  - [ ] Your Location (🔵)
  - [ ] Distance (📍)

---

### Test 3: Rescuer Map Page

**URL:** http://localhost:3000/dashboard/rescuer/map

#### Visual Checks:
- [ ] Page loads without errors
- [ ] Shows assigned rescues (if any)
- [ ] Shows MORE hospitals than citizen map (50km radius)
- [ ] Legend correct

#### Hospital Features:
- [ ] ~10-15 hospital markers visible
- [ ] Click hospital → Details popup
- [ ] Distance shown from rescuer location
- [ ] Useful for directing victims

#### Use Case Verification:
- [ ] Can see nearest hospital from rescue location
- [ ] Can get phone numbers quickly
- [ ] Can check antivenom status
- [ ] Hospitals don't clutter rescue view

---

### Test 4: Admin Map Page

**URL:** http://localhost:3000/dashboard/admin/map

#### Visual Checks:
- [ ] Page loads without errors
- [ ] Statistics bar shows totals
- [ ] Map shows ALL active rescues
- [ ] Map shows MANY hospitals (100km radius)

#### Hospital Network View:
- [ ] ~30-50 hospital markers visible
- [ ] Wide geographic coverage
- [ ] Color-coded by status
- [ ] Strategic overview visible

#### Legend Check:
- [ ] Legend shows 7 items:
  - [ ] Critical (🐍 red)
  - [ ] High (🐍 orange)
  - [ ] Medium (🐍 yellow)
  - [ ] Low (🐍 green)
  - [ ] Rescuer (👨‍⚕️)
  - [ ] Hospital (🏥)
  - [ ] Your Location (🔵)

#### Admin Features:
- [ ] Can see hospital distribution
- [ ] Can identify coverage gaps
- [ ] Statistics accurate
- [ ] Performance acceptable with 50 hospitals

---

## 🧪 Advanced Tests

### Test 5: Hospital Marker Color Verification

**Setup:** Use GraphQL mutation to verify a hospital

```graphql
mutation VerifyHospital {
  verifyAntivenomStatus(input: {
    hospitalId: "INSERT_HOSPITAL_ID_HERE"
    status: AVAILABLE
    notes: "Test verification"
  }) {
    id
    hospital {
      id
      name
      antivenomStatus
    }
  }
}
```

**Then check maps:**
- [ ] Citizen map: Hospital marker now GREEN
- [ ] Rescuer map: Hospital marker now GREEN
- [ ] Admin map: Hospital marker now GREEN
- [ ] Popup shows "✓ Available" badge

**Mark as Out of Stock:**
```graphql
mutation MarkOutOfStock {
  verifyAntivenomStatus(input: {
    hospitalId: "SAME_HOSPITAL_ID"
    status: OUT_OF_STOCK
    notes: "Test out of stock"
  }) {
    id
  }
}
```

**Then check maps:**
- [ ] All maps: Hospital marker now RED
- [ ] Popup shows "✗ Out of Stock" badge

---

### Test 6: Distance Accuracy

**Manual Verification:**
1. Note your current location (from browser geolocation)
2. Pick a hospital marker on map
3. Note the distance shown (e.g., "2.5km")
4. Verify using Google Maps:
   - Open Google Maps
   - Right-click your location → "Measure distance"
   - Click the hospital location
   - Compare distances

**Expected:**
- [ ] Distance within 5-10% of Google Maps
- [ ] Travel time reasonable for Nepal (based on 40km/h)

---

### Test 7: Error Handling

#### No Location Permission:
1. Block location in browser settings
2. Refresh citizen map page
3. **Expected:**
   - [ ] Alert shown: "Location Access Required"
   - [ ] Map shows default center (Kathmandu)
   - [ ] No hospitals shown OR limited hospitals
   - [ ] "Enable Location" button visible

#### Backend Offline:
1. Stop backend server
2. Refresh any map page
3. **Expected:**
   - [ ] Loading state shows
   - [ ] Error message appears
   - [ ] "Retry" button available
   - [ ] Map doesn't crash

#### Invalid Coordinates:
1. Check browser console
2. **Expected:**
   - [ ] No invalid coordinate warnings
   - [ ] All hospitals have valid lat/lng
   - [ ] filterValidCoordinates working

---

### Test 8: Performance

#### Large Radius (Admin):
1. Open admin map
2. Set radiusKm to 200 in code (temporarily)
3. **Expected:**
   - [ ] Map still loads quickly (<3 seconds)
   - [ ] No lag when clicking markers
   - [ ] Smooth panning/zooming
   - [ ] Browser doesn't freeze

#### Mobile Performance:
1. Open on mobile device or Chrome DevTools mobile view
2. Test citizen hospital finder
3. **Expected:**
   - [ ] Map loads quickly
   - [ ] Markers clickable on touch
   - [ ] Popups readable
   - [ ] No lag scrolling

---

## 🔒 Security & Data Quality

### Test 9: Data Validation

#### Hospital Data Quality:
```sql
-- Run in Prisma Studio or DB client

-- Check for null coordinates
SELECT COUNT(*) FROM "Hospital" 
WHERE latitude IS NULL OR longitude IS NULL;
-- Expected: 0

-- Check coordinate ranges
SELECT COUNT(*) FROM "Hospital" 
WHERE latitude < 26 OR latitude > 31 
   OR longitude < 80 OR longitude > 89;
-- Expected: 0 (Nepal bounds: ~26-31°N, 80-89°E)

-- Check status values
SELECT "antivenomStatus", COUNT(*) 
FROM "Hospital" 
GROUP BY "antivenomStatus";
-- Expected: All UNKNOWN initially
```

---

## 📊 Acceptance Criteria

### Must Pass ALL:
- [ ] ✅ Backend: All 4 GraphQL tests pass
- [ ] ✅ Frontend: All 4 map pages load and display hospitals
- [ ] ✅ Color Coding: Yellow (unknown), Green (available), Red (out of stock)
- [ ] ✅ Distance: Calculated and displayed correctly
- [ ] ✅ Popups: Show complete hospital information
- [ ] ✅ Geolocation: Works when permitted, graceful when denied
- [ ] ✅ Legend: Accurate on all pages
- [ ] ✅ Performance: No lag with 50 hospitals
- [ ] ✅ Responsive: Works on mobile/tablet/desktop
- [ ] ✅ Integration: Hospitals don't break rescue/rescuer markers

---

## 🐛 Known Issues / Limitations

### Expected Behavior:
- **All hospitals yellow initially** - This is CORRECT (default UNKNOWN status)
- **Some hospitals may not appear** - Only snakebite treatment centers included
- **Distance estimates vary** - Based on straight-line distance, not roads
- **Travel time approximate** - Based on 40km/h average, actual varies

### Not Issues:
- ✅ "0 hospitals found" - User may be in remote area
- ✅ "Status unknown for all" - Admin needs to verify hospitals
- ✅ Small marker size - Intentional to avoid clutter
- ✅ No route lines - Feature not implemented yet

---

## 📝 Test Report Template

```
HOSPITAL INTEGRATION TEST REPORT
Date: _____________
Tester: ___________

Backend API Tests:
[ ] Test 1: Nearby Hospitals       Pass / Fail
[ ] Test 2: Statistics              Pass / Fail
[ ] Test 3: Search                  Pass / Fail
[ ] Test 4: Multiple Locations      Pass / Fail

Frontend Map Tests:
[ ] Citizen Hospital Finder         Pass / Fail
[ ] Citizen Map (w/ Rescues)        Pass / Fail
[ ] Rescuer Map                     Pass / Fail
[ ] Admin Map                       Pass / Fail

Advanced Tests:
[ ] Color Verification              Pass / Fail
[ ] Distance Accuracy               Pass / Fail
[ ] Error Handling                  Pass / Fail
[ ] Performance                     Pass / Fail
[ ] Data Validation                 Pass / Fail

Issues Found:
1. ______________________________
2. ______________________________
3. ______________________________

Overall Status: ✅ PASS / ❌ FAIL

Notes:
_____________________________________
_____________________________________
```

---

## ✅ Quick Pass/Fail Criteria

### ✅ PASS if:
- All GraphQL queries return data
- All 4 map pages show hospitals
- Markers are color-coded correctly
- Popups show hospital details
- Distance calculation works
- No console errors

### ❌ FAIL if:
- Backend returns errors
- No hospitals appear on any map
- Markers all same color
- Popups don't open
- Map crashes
- Critical console errors

---

## 🚀 Ready to Test!

Start with Backend API Tests (easiest), then move to Frontend Map Tests.

**Estimated Testing Time:** 30-45 minutes for complete test suite

**Good luck! 🎉**

