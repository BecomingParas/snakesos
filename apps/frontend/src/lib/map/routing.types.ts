/**
 * Routing Types
 * Type definitions for map routing services
 */

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface RouteStep {
  distance: number; // in meters
  duration: number; // in seconds
  instruction: string;
  coordinates: RoutePoint[];
}

export interface Route {
  distance: number; // total distance in meters
  duration: number; // total duration in seconds
  coordinates: RoutePoint[]; // array of lat/lng points for the route line
  steps?: RouteStep[]; // turn-by-turn instructions (optional)
  summary: string; // human-readable summary
}

export interface RoutingOptions {
  profile?: 'driving' | 'walking' | 'cycling'; // transportation mode
  avoidHighways?: boolean;
  avoidTolls?: boolean;
}

export interface RoutingProvider {
  name: string;
  getRoute(
    origin: RoutePoint,
    destination: RoutePoint,
    options?: RoutingOptions
  ): Promise<Route>;
  getMultiRoute(
    waypoints: RoutePoint[],
    options?: RoutingOptions
  ): Promise<Route>;
}

export interface RoutingError {
  code: 'NO_ROUTE' | 'INVALID_COORDS' | 'API_ERROR' | 'NETWORK_ERROR';
  message: string;
  provider: string;
}
