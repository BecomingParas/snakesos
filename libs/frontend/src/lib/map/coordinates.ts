/**
 * Coordinate validation and normalization utilities
 * 
 * CRITICAL: These validators prevent invalid coordinates from:
 * - Breaking map rendering
 * - Causing incorrect route calculations
 * - Creating phantom locations
 */

export interface ValidatedCoordinates {
  latitude: number;
  longitude: number;
  isValid: true;
}

export interface InvalidCoordinates {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  isValid: false;
  reason: string;
}

export type CoordinateValidationResult = ValidatedCoordinates | InvalidCoordinates;

/**
 * Validates latitude/longitude coordinates
 * 
 * Rules:
 * - Latitude must be between -90 and 90 (inclusive)
 * - Longitude must be between -180 and 180 (inclusive)
 * - Both must be finite numbers (not NaN, not Infinity)
 * - Null or undefined values are invalid
 * - (0, 0) is technically valid but often indicates missing data
 * 
 * @param lat - Latitude value
 * @param lng - Longitude value
 * @param allowNullIsland - If false, reject (0, 0) coordinates (default: false)
 * @returns Validation result with reason if invalid
 */
export function validateCoordinates(
  lat: number | null | undefined,
  lng: number | null | undefined,
  allowNullIsland: boolean = false
): CoordinateValidationResult {
  // Check for null/undefined
  if (lat === null || lat === undefined) {
    return {
      latitude: lat,
      longitude: lng,
      isValid: false,
      reason: 'Latitude is null or undefined',
    };
  }

  if (lng === null || lng === undefined) {
    return {
      latitude: lat,
      longitude: lng,
      isValid: false,
      reason: 'Longitude is null or undefined',
    };
  }

  // Check for NaN
  if (Number.isNaN(lat)) {
    return {
      latitude: lat,
      longitude: lng,
      isValid: false,
      reason: 'Latitude is NaN',
    };
  }

  if (Number.isNaN(lng)) {
    return {
      latitude: lat,
      longitude: lng,
      isValid: false,
      reason: 'Longitude is NaN',
    };
  }

  // Check for Infinity
  if (!Number.isFinite(lat)) {
    return {
      latitude: lat,
      longitude: lng,
      isValid: false,
      reason: 'Latitude is not a finite number',
    };
  }

  if (!Number.isFinite(lng)) {
    return {
      latitude: lat,
      longitude: lng,
      isValid: false,
      reason: 'Longitude is not a finite number',
    };
  }

  // Check latitude range
  if (lat < -90 || lat > 90) {
    return {
      latitude: lat,
      longitude: lng,
      isValid: false,
      reason: `Latitude ${lat} is out of valid range [-90, 90]`,
    };
  }

  // Check longitude range
  if (lng < -180 || lng > 180) {
    return {
      latitude: lat,
      longitude: lng,
      isValid: false,
      reason: `Longitude ${lng} is out of valid range [-180, 180]`,
    };
  }

  // Check for Null Island (0, 0) if not explicitly allowed
  if (!allowNullIsland && lat === 0 && lng === 0) {
    return {
      latitude: lat,
      longitude: lng,
      isValid: false,
      reason: 'Coordinates (0, 0) likely indicate missing data',
    };
  }

  // All validations passed
  return {
    latitude: lat,
    longitude: lng,
    isValid: true,
  };
}

/**
 * Type guard to check if coordinates are valid
 */
export function isValidCoordinates(
  result: CoordinateValidationResult
): result is ValidatedCoordinates {
  return result.isValid === true;
}

/**
 * Validates coordinates specifically for Nepal context
 * 
 * Nepal bounding box (approximate):
 * - Latitude: 26.3° N to 30.5° N
 * - Longitude: 80.0° E to 88.3° E
 * 
 * @param lat - Latitude value
 * @param lng - Longitude value
 * @param strict - If true, reject coordinates outside Nepal (default: false)
 * @returns Validation result
 */
export function validateNepalCoordinates(
  lat: number | null | undefined,
  lng: number | null | undefined,
  strict: boolean = false
): CoordinateValidationResult {
  // First, validate basic coordinate rules
  const basicValidation = validateCoordinates(lat, lng, false);
  
  if (!isValidCoordinates(basicValidation)) {
    return basicValidation;
  }

  // Nepal-specific validation (only if strict mode)
  if (strict) {
    const { latitude, longitude } = basicValidation;

    // Check if coordinates are within Nepal's bounding box
    const isInNepal =
      latitude >= 26.3 &&
      latitude <= 30.5 &&
      longitude >= 80.0 &&
      longitude <= 88.3;

    if (!isInNepal) {
      return {
        latitude,
        longitude,
        isValid: false,
        reason: `Coordinates (${latitude}, ${longitude}) are outside Nepal's bounding box`,
      };
    }
  }

  return basicValidation;
}

/**
 * Safely extracts coordinates from an object with various field name conventions
 * 
 * Handles:
 * - latitude/longitude
 * - lat/lng
 * - lat/lon
 * 
 * @param obj - Object containing coordinates
 * @returns Validation result
 */
export function extractCoordinates(
  obj: any
): CoordinateValidationResult {
  if (!obj || typeof obj !== 'object') {
    return {
      latitude: undefined,
      longitude: undefined,
      isValid: false,
      reason: 'Input is not an object',
    };
  }

  // Try latitude/longitude first
  let lat = obj.latitude ?? obj.lat;
  let lng = obj.longitude ?? obj.lng ?? obj.lon;

  return validateCoordinates(lat, lng);
}

/**
 * Format coordinates for display
 * 
 * @param lat - Latitude
 * @param lng - Longitude
 * @param precision - Decimal places (default: 4)
 * @returns Formatted string like "27.7042°N, 85.3138°E"
 */
export function formatCoordinates(
  lat: number,
  lng: number,
  precision: number = 4
): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  
  const latAbs = Math.abs(lat).toFixed(precision);
  const lngAbs = Math.abs(lng).toFixed(precision);
  
  return `${latAbs}°${latDir}, ${lngAbs}°${lngDir}`;
}
