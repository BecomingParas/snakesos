# Google Maps Setup Guide for SnakeSOS

## ✅ What I've Done

1. **Installed Google Maps** - Added `@react-google-maps/api` package
2. **Created GoogleEmergencyMap** - New component at `apps/frontend/src/components/map/GoogleEmergencyMap.tsx`
3. **Fixed Data Issues** - All rescue requests now within Nepal borders

## 🔑 Get Your Google Maps API Key

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/google/maps-apis
2. Sign in with your Google account

### Step 2: Create a New Project (or select existing)
1. Click the project dropdown at the top
2. Click "NEW PROJECT"
3. Name it: "SnakeSOS" or "Snake Rescue Platform"
4. Click "CREATE"

### Step 3: Enable Required APIs
Enable these 3 APIs:
1. **Maps JavaScript API** - For displaying the map
2. **Directions API** - For routing between locations
3. **Places API** (optional) - For address autocomplete

To enable:
1. Go to "APIs & Services" → "Library"
2. Search for each API
3. Click "ENABLE"

### Step 4: Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS"
3. Select "API key"
4. Copy the generated key

### Step 5: Restrict Your API Key (IMPORTANT!)
1. Click on your API key to edit it
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add: `localhost:4200/*`
   - Add: `localhost:3000/*`
   - Add your production domain when ready
3. Under "API restrictions":
   - Select "Restrict key"
   - Select: Maps JavaScript API, Directions API
4. Click "SAVE"

## 🔧 Add API Key to Your Project

### Create or Update `.env.local` file:

```bash
# In the root of your project, create .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...your_actual_key_here
```

**Important:** Don't commit this file! It's already in `.gitignore`.

## 🗺️ Use the New Google Maps Component

### Option 1: Replace EmergencyMap completely

In your dashboard/admin/map page:

```typescript
// Old:
import { EmergencyMap } from '@/components/map/EmergencyMap';

// New:
import { GoogleEmergencyMap } from '@/components/map/GoogleEmergencyMap';

// Then use it:
<GoogleEmergencyMap
  incident={incident}
  hospitals={hospitals}
  rescuers={rescuers}
  showRoute={true}
  emergencyMode={true}
/>
```

### Option 2: Keep both and switch based on preference

```typescript
const useGoogleMaps = true; // Set to false to use Leaflet

{useGoogleMaps ? (
  <GoogleEmergencyMap {...props} />
) : (
  <EmergencyMap {...props} />
)}
```

## 🌍 Component Features

### ✅ What Works:
- ✅ Hospital markers with color coding
- ✅ Rescue request markers
- ✅ Rescuer/volunteer markers
- ✅ InfoWindows (popups) on click
- ✅ Auto-fit bounds to show all markers
- ✅ Emergency mode indicator
- ✅ Route polylines
- ✅ Map restricted to Nepal bounds
- ✅ Proper coordinate validation

### 🎨 Marker Colors:
- **Hospitals**:
  - 🟢 Green: Antivenom available
  - 🔵 Cyan: 24/7 emergency
  - 🟠 Orange: Other hospitals
- **Incidents**:
  - 🔴 Red: Critical
  - 🟠 Orange: High
  - 🟡 Yellow: Medium
  - 🟢 Green: Low
- **Rescuers**:
  - 🟢 Green: Available
  - 🔵 Blue: En route
  - 🟣 Purple: On site
  - ⚫ Gray: Unavailable

## 💰 Google Maps Pricing

### Free Tier (per month):
- $200 free credit = approximately:
  - 28,000 map loads
  - 40,000 directions requests
  - This is usually enough for development and small production use

### To Monitor Usage:
1. Go to Google Cloud Console
2. "APIs & Services" → "Dashboard"
3. Set up billing alerts

### Pro Tip:
Add usage limits to prevent unexpected charges:
1. Go to "APIs & Services" → "Credentials"
2. Click on your API key
3. Set quotas under "API restrictions"

## 🐛 Troubleshooting

### "Google Maps API Key Required" error:
- Make sure `.env.local` file exists in project root
- Check that the variable starts with `NEXT_PUBLIC_`
- Restart your development server after adding the key

### Map not showing:
- Check browser console for errors
- Verify API key is correct
- Make sure Maps JavaScript API is enabled in Google Cloud
- Check API key restrictions allow your localhost

### Markers not showing:
- All markers outside Nepal are automatically filtered
- Check browser console for coordinate warnings
- Verify data has valid `latitude` and `longitude` fields

### "This page can't load Google Maps correctly" error:
- API key is invalid or restricted
- Check Application restrictions in Google Cloud Console
- Make sure your domain is in the allowed referrers list

## 🔄 Migration Checklist

- [x] Install `@react-google-maps/api`
- [ ] Get Google Maps API key
- [ ] Add key to `.env.local`
- [ ] Enable required APIs in Google Cloud
- [ ] Test the new GoogleEmergencyMap component
- [ ] Replace EmergencyMap with GoogleEmergencyMap
- [ ] Deploy and update environment variables on Vercel/production

## 📚 Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation/javascript)
- [React Google Maps API Docs](https://react-google-maps-api-docs.netlify.app/)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## Need Help?

If you face any issues:
1. Check the browser console for errors
2. Verify your API key is correct
3. Make sure all required APIs are enabled
4. Check that your key restrictions allow localhost

The Leaflet-based `EmergencyMap` will still work as a fallback!
