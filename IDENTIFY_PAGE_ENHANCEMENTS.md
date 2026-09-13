# Snake Identification Page Enhancements

## Overview
Enhanced the `/identify` page to show nearest hospital and rescuer details using AI-powered location detection and database integration.

## Features Implemented

### 1. **Automatic Location Detection**
- Uses browser's Geolocation API to get user's coordinates
- Sends location (lat/lng) with snake identification request
- Falls back gracefully if location permission is denied

### 2. **Nearest Hospital Information**
Shows the closest hospital with snakebite treatment capabilities:
- Hospital name and address with map pin icon
- Distance from user (calculated using Haversine formula)
- Antivenom availability status (color-coded):
  - ✓ Green: Available
  - ⚠️ Yellow: Low Stock
  - ✗ Red: Out of Stock
  - ? Gray: Unknown
- Snakebite treatment availability badge
- Emergency phone number with click-to-call
- Beautiful gradient card design

### 3. **Nearest Rescuer Information**
Shows the closest available trained snake rescuer:
- Rescuer name and experience level
- Distance from user location
- Rating (star rating out of 5)
- Total rescues completed
- Contact number with click-to-call
- Professional gradient card design
- Safety tip: "Do not approach the snake"

### 4. **24/7 Emergency Hotline Card**
Always visible, even if no nearby hospital/rescuer found:
- Two emergency numbers: 9812482578 and 9807591342
- Animated pulse icon for urgency
- Clear description: "Snake emergency? Our trained rescuers are available round the clock"
- Prominent red buttons for immediate calling

### 5. **Enhanced UI/UX**
- Color-coded status indicators for quick recognition
- Icon-based information (MapPin, Phone, Navigation, Activity)
- Distance badges showing km away
- Click-to-call buttons for all phone numbers
- Responsive design for mobile and desktop
- Gradient backgrounds for visual appeal
- Professional spacing and typography

## Technical Implementation

### API Route Enhancement (`/api/identify-snake`)
```typescript
// Added database queries after AI identification
1. Query active hospitals with snakebite treatment
2. Calculate distance using Haversine formula
3. Sort by distance and return nearest
4. Query verified, available rescuers
5. Calculate rescuer distances
6. Return nearest rescuer with details
```

### Database Integration
- **Hospital Model**: Active hospitals with `snakebiteTreatmentAvailable: true`
- **Volunteer Model**: Verified rescuers with `isAvailableNow: true`
- **Geolocation**: Uses `latitude`, `longitude`, `currentLat`, `currentLng` fields

### Distance Calculation
- Haversine formula for accurate distance between GPS coordinates
- Returns distance in kilometers
- Accounts for Earth's curvature

### Frontend Changes
- Added location permission request
- Enhanced TypeScript types for hospital and rescuer data
- Conditional rendering based on data availability
- Emergency hotline always shows (fallback)

## User Flow

1. User uploads snake image on `/identify` page
2. Browser requests location permission
3. If granted, coordinates are captured
4. Image + location sent to AI identification API
5. AI identifies snake species
6. Backend queries nearest hospital & rescuer based on location
7. Frontend displays:
   - Snake identification results
   - Nearest hospital with antivenom status
   - Nearest available rescuer
   - Emergency hotlines
8. User can immediately call hospital or rescuer

## Benefits

✅ **Faster Emergency Response**: User knows exactly who to call  
✅ **Informed Decisions**: Antivenom availability helps with hospital choice  
✅ **Professional Guidance**: Connects to trained rescuers, not amateurs  
✅ **24/7 Coverage**: Emergency hotlines always visible as backup  
✅ **Better UX**: All critical info in one place, no searching needed  
✅ **Mobile-First**: Perfect for on-site emergency situations  

## Future Enhancements

- [ ] Map view showing hospital and rescuer locations
- [ ] Real-time rescuer availability updates
- [ ] Multiple hospital options (top 3 nearest)
- [ ] Integration with Google Maps for directions
- [ ] SMS/WhatsApp quick contact buttons
- [ ] Hospital operating hours display
- [ ] Rescuer response time estimates

## Files Modified

1. `apps/frontend/src/app/(public)/identify/page.tsx`
   - Added location detection
   - Added hospital/rescuer UI cards
   - Updated TypeScript types

2. `apps/frontend/src/app/api/identify-snake/route.ts`
   - Added Prisma database queries
   - Added distance calculation functions
   - Enhanced API response with location data

3. `apps/frontend/src/app/api/nearest-emergency/route.ts` (NEW)
   - Standalone API for emergency contacts
   - Can be used by other features

## Testing Checklist

- [x] Snake identification still works without location
- [x] Location permission prompt appears
- [x] Nearest hospital displays correctly
- [x] Nearest rescuer displays correctly  
- [x] Emergency hotlines always visible
- [x] Click-to-call works on mobile
- [x] Distance calculation accurate
- [x] Responsive on mobile devices
- [x] Graceful fallback if no hospitals in DB
- [x] Graceful fallback if no rescuers available

## Deployment Status

✅ Committed to GitHub: `60247e5`  
✅ Pushed to main branch  
🔄 Vercel deploying automatically  
⏳ Live in ~2-3 minutes at https://snakesos.vercel.app/identify

---

**Note**: The AI now intelligently finds and recommends the nearest emergency resources based on the user's actual location when they identify a snake, making the emergency response much more effective and targeted.
