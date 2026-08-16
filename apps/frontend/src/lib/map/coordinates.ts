/**
 * Coordinate Validation Utilities
 * Validate and sanitize GPS coordinates
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Validate if coordinates are valid GPS coordinates
 */
export function isValidCoordinate(lat?: number | null, lng?: number | null): boolean {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return false;
  }

  if (
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    isNaN(lat) ||
    isNaN(lng) ||
    !isFinite(lat) ||
    !isFinite(lng)
  ) {
    return false;
  }

  // Validate latitude range: -90 to 90
  if (lat < -90 || lat > 90) {
    return false;
  }

  // Validate longitude range: -180 to 180
  if (lng < -180 || lng > 180) {
    return false;
  }

  return true;
}

/**
 * Validate and sanitize coordinates
 * Returns null if invalid
 */
export function validateCoordinates(
  lat?: number | null,
  lng?: number | null
): Coordinates | null {
  if (!isValidCoordinate(lat, lng)) {
    return null;
  }

  return {
    lat: lat!,
    lng: lng!,
  };
}

/**
 * Filter array of items to only those with valid coordinates
 */
export function filterValidCoordinates<T extends { lat?: number | null; lng?: number | null }>(
  items: T[]
): T[] {
  return items.filter(item => isValidCoordinate(item.lat, item.lng));
}

/**
 * Calculate map bounds from an array of coordinates
 */
export function calculateBounds(
  coordinates: Coordinates[]
): {
  north: number;
  south: number;
  east: number;
  west: number;
  center: Coordinates;
} | null {
  if (coordinates.length === 0) {
    return null;
  }

  const lats = coordinates.map(c => c.lat);
  const lngs = coordinates.map(c => c.lng);

  const north = Math.max(...lats);
  const south = Math.min(...lats);
  const east = Math.max(...lngs);
  const west = Math.min(...lngs);

  const centerLat = (north + south) / 2;
  const centerLng = (east + west) / 2;

  return {
    north,
    south,
    east,
    west,
    center: { lat: centerLat, lng: centerLng },
  };
}

/**
 * Check if coordinates are in Nepal
 * Approximate bounding box for Nepal
 */
export function isInNepal(lat: number, lng: number): boolean {
  // Nepal approximate bounds
  const nepalBounds = {
    north: 30.447,
    south: 26.347,
    east: 88.201,
    west: 80.056,
  };

  return (
    lat >= nepalBounds.south &&
    lat <= nepalBounds.north &&
    lng >= nepalBounds.west &&
    lng <= nepalBounds.east
  );
}

/**
 * Get default center for Nepal (Kathmandu)
 */
export function getNepalDefaultCenter(): Coordinates {
  return {
    lat: 27.7172,
    lng: 85.324,
  };
}
