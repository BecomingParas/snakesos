/**
 * Map Distance Utilities
 * Calculate distances between coordinates using Haversine formula
 */

/**
 * Calculate distance between two coordinates
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m away`;
  }
  if (km < 10) {
    return `${km.toFixed(1)}km away`;
  }
  return `${Math.round(km)}km away`;
}

/**
 * Sort items by distance from a point
 */
export function sortByDistance<T extends { lat?: number | null; lng?: number | null }>(
  items: T[],
  userLat: number,
  userLng: number
): (T & { distance?: number })[] {
  return items
    .map(item => ({
      ...item,
      distance: item.lat && item.lng
        ? calculateDistance(userLat, userLng, item.lat, item.lng)
        : undefined,
    }))
    .sort((a, b) => {
      if (a.distance === undefined) return 1;
      if (b.distance === undefined) return -1;
      return a.distance - b.distance;
    });
}

/**
 * Get estimated travel time (rough estimate: 40 km/h average in Nepal)
 */
export function estimateTravelTime(distanceKm: number): string {
  const avgSpeedKmh = 40; // Average speed in urban Nepal
  const hours = distanceKm / avgSpeedKmh;
  const minutes = Math.round(hours * 60);
  
  if (minutes < 60) {
    return `~${minutes} min`;
  }
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `~${hrs}h ${mins}m` : `~${hrs}h`;
}
