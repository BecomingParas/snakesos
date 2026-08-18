# Next Steps: Hospital Map Integration 🗺️

## ✅ What's Complete

All backend and frontend infrastructure is ready:
- Backend API with 65 hospitals
- GraphQL queries and mutations  
- React hooks for data fetching
- Hospital map components

## 🎯 What's Needed: Add Hospital Maps to Dashboards

### Option 1: Add Hospital Layer to Existing Maps

Update existing rescue maps to also show nearby hospitals.

#### Citizen Rescue Map - Show Nearby Hospitals
**File**: `apps/frontend/src/app/(dashboard)/dashboard/citizen/map/page.tsx`

Add hospital markers to the existing rescue tracking map:

```typescript
import { useNearbyHospitals } from '@/lib/graphql/hooks/hospital.hooks';

// In component:
const { data: hospitalsData } = useNearbyHospitals(
  location?.latitude,
  location?.longitude,
  {
    radiusKm: 30,
    antivenomRequired: false,
    limit: 10,
  }
);

const nearbyHospitals = hospitalsData?.nearbyHospitals || [];

// Pass to RescueMap component:
<RescueMap
  rescues={rescues}
  rescuers={mockRescuers}
  hospitals={nearbyHospitals}  // ADD THIS
  userLocation={location}
  // ... other props
/>
```

Then update `RescueMap.tsx` to accept and display `hospitals` prop with different colored markers.

---

### Option 2: Create Dedicated Hospital Map Pages (RECOMMENDED)

Create separate hospital-focused map pages for each dashboard.

#### 1. Citizen Hospital Finder
**New File**: `apps/frontend/src/app/(dashboard)/dashboard/citizen/hospitals/page.tsx`

```typescript
/**
 * Citizen Hospital Finder
 * Find nearby hospitals with antivenom availability
 */

'use client';

import { HospitalMapWithData } from '@/components/map/HospitalMapWithData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function CitizenHospitalsPage() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Find Nearby Hospitals</h1>
        <p className="text-slate-600 mt-2">
          Locate hospitals with snakebite treatment and antivenom availability
        </p>
      </div>

      {/* Emergency Alert */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">🚨 For Snake Bite Emergencies</CardTitle>
          <CardDescription className="text-red-700">
            If you've been bitten by a snake, seek medical attention immediately. 
            Green markers show verified antivenom availability.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Hospital Map */}
      <Card>
        <CardContent className="p-0">
          <div style={{ height: '70vh' }}>
            <HospitalMapWithData
              useUserLocation={true}
              radiusKm={50}
              snakebiteTreatmentOnly={true}
              zoom={12}
              onHospitalClick={(id) => {
                console.log('Hospital clicked:', id);
                // TODO: Navigate to hospital details or open modal
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-white shadow"></div>
              <span className="text-sm text-slate-600">Antivenom Available (Verified)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-600 border-2 border-white shadow"></div>
              <span className="text-sm text-slate-600">Snakebite Treatment (Status Unknown)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-white shadow"></div>
              <span className="text-sm text-slate-600">Out of Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-white shadow"></div>
              <span className="text-sm text-slate-600">General Hospital</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 2. Rescuer Hospital Reference
**New File**: `apps/frontend/src/app/(dashboard)/dashboard/rescuer/hospitals/page.tsx`

```typescript
/**
 * Rescuer Hospital Reference
 * Quick reference for nearby hospitals during rescues
 */

'use client';

import { HospitalMapWithData } from '@/components/map/HospitalMapWithData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Phone, Navigation, MapPin } from 'lucide-react';

export default function RescuerHospitalsPage() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Hospital Reference</h1>
        <p className="text-slate-600 mt-2">
          Nearby hospitals for snake bite emergencies
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <Phone className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold">Emergency Hotline</h3>
            <p className="text-2xl font-bold text-blue-600">102</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Navigation className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-semibold">Nearest Hospital</h3>
            <p className="text-sm text-slate-600">Click markers for directions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <MapPin className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold">Coverage Area</h3>
            <p className="text-sm text-slate-600">50km radius from your location</p>
          </CardContent>
        </Card>
      </div>

      {/* Hospital Map */}
      <Card>
        <CardContent className="p-0">
          <div style={{ height: '65vh' }}>
            <HospitalMapWithData
              useUserLocation={true}
              radiusKm={50}
              snakebiteTreatmentOnly={true}
              zoom={11}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 3. Admin Hospital Management Map
**New File**: `apps/frontend/src/app/(dashboard)/dashboard/admin/hospitals-map/page.tsx`

```typescript
/**
 * Admin Hospital Management Map
 * Overview of all hospitals and verification status
 */

'use client';

import { HospitalMapWithData } from '@/components/map/HospitalMapWithData';
import { useHospitalStats } from '@/lib/graphql/hooks/hospital.hooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function AdminHospitalMapPage() {
  const { data: stats } = useHospitalStats();

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Hospital Network Overview</h1>
        <p className="text-slate-600 mt-2">
          Manage and monitor hospital network across Nepal
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Hospitals</p>
                <p className="text-3xl font-bold">{stats?.hospitalStats?.totalHospitals || 0}</p>
              </div>
              <Building2 className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Antivenom Available</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.hospitalStats?.antivenomAvailable || 0}
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Status Unknown</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats?.hospitalStats?.antivenomUnknown || 0}
                </p>
              </div>
              <AlertCircle className="h-10 w-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">24/7 Emergency</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats?.hospitalStats?.emergency24x7Count || 0}
                </p>
              </div>
              <Clock className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hospital Map */}
      <Card>
        <CardHeader>
          <CardTitle>Hospital Network Map</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ height: '60vh' }}>
            <HospitalMapWithData
              useUserLocation={false}
              defaultCenter={[27.7172, 85.324]} // Kathmandu
              radiusKm={200}
              snakebiteTreatmentOnly={false}
              limit={100}
              zoom={7}
              onHospitalClick={(id) => {
                // Navigate to hospital details page
                window.location.href = `/dashboard/admin/hospitals/${id}`;
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Province Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution by Province</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats?.hospitalStats?.byProvince?.map((p: any) => (
              <div key={p.province} className="text-center">
                <p className="text-sm font-semibold text-slate-900">{p.province}</p>
                <p className="text-2xl font-bold text-blue-600">{p.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📋 Implementation Checklist

### Backend (✅ Complete)
- [x] Hospital service with distance calculation
- [x] GraphQL resolvers
- [x] 65 hospitals seeded
- [x] Verification workflow

### Frontend Components (✅ Complete)
- [x] GraphQL queries and mutations
- [x] React hooks
- [x] HospitalMap base component
- [x] HospitalMapWithData API-integrated component

### Pages to Create (Choose ONE of the options above)
- [ ] **Option 1**: Add hospital layer to existing rescue maps
- [ ] **Option 2**: Create dedicated hospital map pages (RECOMMENDED)
  - [ ] Citizen: `/dashboard/citizen/hospitals/page.tsx`
  - [ ] Rescuer: `/dashboard/rescuer/hospitals/page.tsx`  
  - [ ] Admin: `/dashboard/admin/hospitals-map/page.tsx`

### Navigation Updates
- [ ] Add "Find Hospitals" link to citizen sidebar
- [ ] Add "Hospital Reference" link to rescuer sidebar
- [ ] Add "Hospital Map" link to admin sidebar

### Testing
- [ ] Test geolocation works
- [ ] Test distance calculation
- [ ] Test marker colors (GREEN/YELLOW/RED/GRAY)
- [ ] Test hospital popup details
- [ ] Test responsive design (mobile/desktop)

---

## 🚀 Quick Start (Option 2 - Recommended)

1. **Create the three hospital page files** (copy code from above)
2. **Update navigation sidebars** to include hospital links
3. **Test on each dashboard**
4. **Verify 65 hospitals appear on maps**

That's it! Your hospital system is ready to go live. 🎉

---

## 💡 Pro Tips

1. **Citizen Dashboard**: Focus on "Find nearest hospital with antivenom"
2. **Rescuer Dashboard**: Quick reference during active rescues
3. **Admin Dashboard**: Monitor network coverage and verification status

4. **Mobile Optimization**: Maps are already responsive, test on mobile devices

5. **Future Enhancements**:
   - Add hospital details modal when clicking markers
   - Add route navigation integration (Google Maps/Apple Maps)
   - Add offline hospital data caching
   - Add push notifications for antivenom status changes

---

## 📞 Support

If you need help with any step:
1. Check `HOSPITAL_API_INTEGRATION_COMPLETE.md` for API docs
2. Check `IMPLEMENTATION_SUMMARY.md` for backend code examples
3. All components are in `apps/frontend/src/components/map/`
4. All hooks are in `apps/frontend/src/lib/graphql/hooks/hospital.hooks.ts`
