/**
 * OSRM Routing Provider
 * Open Source Routing Machine - Free and open source
 * Uses public OSRM instance or custom server
 */

import type {
  RoutePoint,
  Route,
  RoutingProvider,
  RoutingOptions,
  RoutingError,
} from '../routing.types';

const OSRM_BASE_URL = 'https://router.project-osrm.org';

export class OSRMProvider implements RoutingProvider {
  name = 'OSRM';

  private getProfile(profile?: string): string {
    // OSRM public instance only supports driving
    return 'driving';
  }

  async getRoute(
    origin: RoutePoint,
    destination: RoutePoint,
    options?: RoutingOptions
  ): Promise<Route> {
    return this.getMultiRoute([origin, destination], options);
  }

  async getMultiRoute(waypoints: RoutePoint[], options?: RoutingOptions): Promise<Route> {
    try {
      const profile = this.getProfile(options?.profile);
      const coords = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');

      const url = `${OSRM_BASE_URL}/route/v1/${profile}/${coords}?overview=full&geometries=geojson&steps=true`;

      const response = await fetch(url);

      if (!response.ok) {
        throw this.createError('API_ERROR', `API returned ${response.status}`);
      }

      const data = await response.json();

      if (data.code !== 'Ok' || !data.routes?.[0]) {
        throw this.createError('NO_ROUTE', 'No route found between these points');
      }

      const route = data.routes[0];
      const geometry = route.geometry;

      // Convert GeoJSON coordinates [lng, lat] to RoutePoint {lat, lng}
      const routeCoordinates: RoutePoint[] = geometry.coordinates.map((coord: number[]) => ({
        lat: coord[1],
        lng: coord[0],
      }));

      // Parse steps if available
      const steps =
        route.legs?.[0]?.steps?.map((step: any) => {
          const stepCoords: RoutePoint[] = step.geometry.coordinates.map((coord: number[]) => ({
            lat: coord[1],
            lng: coord[0],
          }));
          return {
            distance: step.distance,
            duration: step.duration,
            instruction: step.maneuver?.instruction || 'Continue',
            coordinates: stepCoords,
          };
        }) || [];

      return {
        distance: route.distance, // in meters
        duration: route.duration, // in seconds
        coordinates: routeCoordinates,
        steps,
        summary: this.formatSummary(route.distance, route.duration),
      };
    } catch (error) {
      if ((error as RoutingError).code) {
        throw error;
      }
      console.error('OSRM error:', error);
      throw this.createError('NETWORK_ERROR', 'Failed to fetch route');
    }
  }

  private formatSummary(distanceMeters: number, durationSeconds: number): string {
    const km = (distanceMeters / 1000).toFixed(1);
    const minutes = Math.round(durationSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${minutes}m`;
    return `${km} km • ${timeStr}`;
  }

  private createError(code: RoutingError['code'], message: string): RoutingError {
    return {
      code,
      message,
      provider: this.name,
    } as RoutingError;
  }
}
