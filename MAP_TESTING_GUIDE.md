# Map System Testing Guide

## Prerequisites

### 1. Backend Running
```bash
# Make sure backend is running on port 4000
node apps/backend/dist/src/main.js
# OR
yarn dev:backend
```

### 2. Frontend Running
```bash
# Frontend should be on port 4200
yarn dev:frontend
```

### 3. Database with Test Data
Ensure your database has rescue requests with valid `lat` and `lng` coordinates.

## Test Rescue Data

If you don't have test data, you can add some manually in Prisma Studio:

```bash
npx prisma studio
```

### Sample Test Coordinates (Kathmandu, Nepal)

```javascript
// Thamel Area
{ lat: 27.7172, lng: 85.3240, address: "Thamel, Kathmandu" }

// Durbar Square
{ lat: 27.7045, lng: 85.3076, address: "Durbar Square, Kathmandu" }

// Boudhanath Stupa
{ lat: 27.7215, lng: 85.3620, address: "Boudhanath, Kathmandu" }

// Swayambhunath
{ lat: 27.7149, lng: 85.2906, address: "Swayambhunath, Kathmandu" }

// Patan Durbar Square
{ lat: 27.6729, lng: 85.3262, address: "Patan, Lalitpur" }
```

## Testing Scenarios

### Scenario 1: Admin Map View ✅

**Route**: `/dashboard/admin/map`

**Expected Behavior**:
1. ✅ Map loads with OpenStreetMap tiles
2. ✅ See all rescue requests as colored markers
3. ✅ Statistics bar shows counts (Total, Critical, Pending, Assigned, In Progress)
4. ✅ Blue dot shows your current location (if permission granted)
5. ✅ Click any marker to see popup with details
6. ✅ Distance and ETA shown if location enabled
7. ✅ Auto-refresh every 30 seconds
8. ✅ Manual refresh button works
9. ✅ Map legend displayed at bottom

**Steps**:
```bash
1. Login as Admin user
2. Navigate to "Live Field Map" in sidebar
3. Allow location permission when prompted
4. Verify map loads with markers
5. Click on different markers
6. Check statistics are accurate
7. Wait 30 seconds and verify data refreshes
```

---

### Scenario 2: Rescuer Map View ✅

**Route**: `/dashboard/rescuer/map`

**Expected Behavior**:
1. ✅ Map loads showing ONLY assigned rescues
2. ✅ List on left side sorted by distance (closest first)
3. ✅ Statistics show Total Assigned, In Progress, Critical
4. ✅ Each rescue card shows distance and ETA
5. ✅ "Navigate" button opens Google Maps with directions
6. ✅ "Call" button triggers phone dialer
7. ✅ Clicking rescue card highlights marker on map
8. ✅ Auto-refresh every 15 seconds
9. ✅ Priority color coding (red=critical, orange=high, etc.)

**Steps**:
```bash
1. Login as Verified Rescuer or Volunteer
2. Navigate to "Track Rescues" in sidebar
3. Allow location permission
4. Verify only assigned rescues appear
5. Check list is sorted by distance
6. Click "Navigate" button on a rescue
7. Click "Call" button to test phone dialer
8. Click different rescue cards
9. Verify marker highlights on map
```

**Test Navigate Feature**:
- Clicking "Navigate" should open: `https://www.google.com/maps/dir/?api=1&destination=27.7172,85.324`
- Google Maps should open with directions from current location

---

### Scenario 3: Citizen Map View ✅

**Route**: `/dashboard/citizen/map`

**Expected Behavior**:
1. ✅ Map loads showing ONLY user's own rescue requests
2. ✅ Statistics show My Requests, Pending, Assigned, Active
3. ✅ If rescue is ASSIGNED or IN_PROGRESS:
   - ✅ Blue alert box at top
   - ✅ Shows "Rescuer En Route!" or "Rescue Assigned"
   - ✅ Displays rescuer distance ("500m away")
   - ✅ Shows ETA ("~5 min")
   - ✅ "Call Rescuer" button visible
4. ✅ Rescuer location shown on map with 👨‍⚕️ marker
5. ✅ Real-time location tracking (updates every 10 seconds)
6. ✅ List on left shows all user's requests
7. ✅ Status badges (Waiting/Assigned/Active)
8. ✅ Map legend at bottom

**Steps**:
```bash
1. Login as Citizen user
2. Navigate to "Track Rescue" in sidebar
3. Allow location permission
4. Verify only YOUR rescue requests appear
5. If you have an active rescue:
   - Check blue alert box appears
   - Verify rescuer distance is shown
   - Test "Call Rescuer" button
   - Watch rescuer marker on map
6. Wait 10 seconds and verify data updates
7. Click different request cards
```

---

## Testing Location Features

### Test Location Permission

1. **First Visit**:
   - Browser should prompt: "Allow location access?"
   - Click "Allow"
   - Blue dot should appear on map

2. **If Denied**:
   - Yellow warning banner appears
   - "Enable" button to request again
   - Distance calculations won't work

3. **Without Location**:
   - Map still works
   - No blue dot
   - No distance/ETA shown
   - "Enable location" prompt visible

---

## Testing Map Interactions

### Marker Colors by Priority
- 🔴 **Red** = CRITICAL priority
- 🟠 **Orange** = HIGH priority
- 🟡 **Yellow** = MEDIUM priority
- 🟢 **Green** = LOW priority

### Map Controls
- **Zoom**: Use mouse wheel or +/- buttons
- **Pan**: Click and drag map
- **Popup**: Click marker to see details
- **Highlight**: Selected marker is larger

### Expected Popup Content
```
🐍 Rescue Request

Status: [PENDING/ASSIGNED/IN_PROGRESS]
Location: Thamel, Kathmandu
          Kathmandu Metropolitan City
Contact: Ram Sharma
📞 +977-9800000000
Snake: Brown snake, 2 feet long

📍 2.5 km away
~4 min
```

---

## Common Issues & Solutions

### Issue 1: Map Not Loading
**Symptoms**: Blank white space or loading spinner forever

**Solutions**:
```bash
# Check console for errors
# Verify Leaflet CSS is loaded
# Ensure backend is running
# Check GraphQL endpoint: http://localhost:4000/graphql
```

### Issue 2: No Markers Showing
**Symptoms**: Map loads but no markers visible

**Check**:
1. Are there rescues in database with valid lat/lng?
2. Open browser console and check data response
3. Verify coordinates are within Nepal bounds (lat: 26-30, lng: 80-88)

**SQL Check**:
```sql
-- Check rescue data
SELECT id, address, lat, lng, status, priority 
FROM "RescueRequest" 
WHERE lat IS NOT NULL AND lng IS NOT NULL;
```

### Issue 3: Location Permission Denied
**Symptoms**: Yellow warning banner, no blue dot

**Solutions**:
1. Check browser settings → Site permissions → Location
2. Enable location for localhost
3. Refresh page and allow when prompted
4. **Chrome**: chrome://settings/content/location
5. **Firefox**: about:preferences#privacy → Permissions → Location

### Issue 4: Distance Calculations Wrong
**Symptoms**: Shows "10000 km away" or wrong distances

**Check**:
1. Verify coordinates are decimal degrees (not DMS)
2. Check lat/lng are not swapped
3. Nepal coordinates should be:
   - Latitude: 26.0 to 30.5
   - Longitude: 80.0 to 88.5

### Issue 5: "Navigate" Opens Wrong Location
**Symptoms**: Google Maps opens but shows wrong place

**Debug**:
```javascript
// Check the URL being generated
console.log(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);

// Should be like:
https://www.google.com/maps/dir/?api=1&destination=27.7172,85.324
```

---

## Performance Testing

### Expected Load Times
- Initial map load: **1-2 seconds**
- Marker rendering (50 markers): **<100ms**
- Location refresh: **~500ms**
- Auto-refresh poll: **15-30 seconds**

### Monitor Performance
```javascript
// Open browser console and check:
// 1. Network tab for GraphQL requests
// 2. Performance tab for render times
// 3. Console for any errors
```

---

## Browser Compatibility

### Supported Browsers ✅
- Chrome/Edge 90+ (Recommended)
- Firefox 88+
- Safari 14+
- Mobile Chrome (Android)
- Mobile Safari (iOS)

### Not Supported ❌
- Internet Explorer (any version)
- Chrome < 60
- Safari < 12

---

## Real-Time Updates Testing

### Admin Map
- Poll interval: **30 seconds**
- Test: Create new rescue in database
- Expected: Appears on map after 30s (or manual refresh)

### Rescuer Map
- Poll interval: **15 seconds**
- Test: Assign a rescue to logged-in rescuer
- Expected: Appears in list after 15s

### Citizen Map
- Poll interval: **10 seconds**
- Watch location: **Continuous tracking**
- Test: Update rescue status to IN_PROGRESS
- Expected: Alert box appears within 10s

---

## Security Testing

### Location Privacy
1. User location is **CLIENT-SIDE ONLY**
2. Never sent to backend
3. Used only for distance calculations
4. Stored in browser memory (not localStorage)

### Permission Handling
1. Always request permission before tracking
2. Graceful degradation if denied
3. Clear messaging about why location is needed
4. No location = No distance/ETA (but map still works)

---

## Mobile Testing

### iOS Safari
```bash
# Test on iPhone/iPad
1. Open in Safari (not Chrome on iOS)
2. Location permission prompt appears
3. Map should be touch-responsive
4. Pinch to zoom works
5. Tap markers for popups
```

### Android Chrome
```bash
# Test on Android device
1. Open in Chrome
2. Location permission via system dialog
3. Touch interactions smooth
4. Navigation button opens Google Maps app
5. Call button opens phone dialer
```

---

## Next Steps After Testing

### If Map Works ✅
1. Test with real rescue data
2. Update backend to filter by logged-in user
3. Add rescuer location updates (backend)
4. Consider adding route drawing
5. Consider adding marker clustering

### If Issues Found ❌
1. Check console errors
2. Verify GraphQL queries work in Playground
3. Test database has valid lat/lng data
4. Check location permissions
5. Try different browser

---

## Quick Debug Checklist

- [ ] Backend running on port 4000
- [ ] Frontend running on port 4200
- [ ] Database has rescues with lat/lng
- [ ] Location permission granted
- [ ] No console errors
- [ ] GraphQL endpoint accessible
- [ ] Map tiles loading (check Network tab)
- [ ] Markers rendering
- [ ] Distance calculations working
- [ ] Auto-refresh polling

---

## Support

If you encounter issues not covered here:

1. Check browser console for errors
2. Test GraphQL queries in Playground: http://localhost:4000/graphql
3. Verify database data with Prisma Studio: `npx prisma studio`
4. Check backend logs for errors
5. Try in incognito/private mode to rule out cache issues

---

**Map system is production-ready once all scenarios pass! 🎉**
