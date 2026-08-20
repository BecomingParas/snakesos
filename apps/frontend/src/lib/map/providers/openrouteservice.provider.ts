/**
 * OpenRouteService Routing Provider
 * Free routing API with generous rate limits
 * https://openrouteservice.org/
 */

import type {
  RoutePoint,
  Route,
  RoutingProvider,
  RoutingOptions,
  RoutingError,
} from '../routing.types';

const ORS_API_KEY = (import.meta as any).env?.VITE_OPENROUTESERVICE_API_KEY || '5b3ce3597851110001cf6248a6c1e7f9b4404df5b5fa1e83629cf6d4';
const ORS_BASE_URL = 'https://api.openrouteservice.org/v2';

export class OpenRouteServiceProvider implements RoutingProvider {
  name = 'OpenRouteService';

  private getProfile(profile?: string): string {
    switch (profile) {
      case 'walking':
        return 'foot-walking';
      case 'cycling':
        return 'cycling-regular';
      case 'driving':
      default:
        return 'driving-car';
    }
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
      const coords = waypoints.map(wp => [wp.lng, wp.lat]); // ORS uses [lng, lat]

      const response = await fetch(`${ORS_BASE_URL}/directions/${profile}/geojson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ORS_API_KEY,
        },
        body: JSON.stringify({
          coordinates: coords,
          instructions: true,
          elevation: false,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw this.createError('NO_ROUTE', 'No route found between these points');
        }
        throw this.createError('API_ERROR', `API returned ${response.status}`);
      }

      const data = await response.json();
      const route = data.features?.[0];

      if (!route) {
        throw this.createError('NO_ROUTE', 'No route found in response');
      }

      const properties = route.properties;
      const geometry = route.geometry;

      // Convert GeoJSON coordinates [lng, lat] to RoutePoint {lat, lng}
      const routeCoordinates: RoutePoint[] = geometry.coordinates.map((coord: number[]) => ({
        lat: coord[1],
        lng: coord[0],
      }));

      // Parse steps if available
      const steps =
        properties.segments?.[0]?.steps?.map((step: any) => ({
          distance: step.distance,
          duration: step.duration,
          instruction: step.instruction,
          coordinates: routeCoordinates.slice(step.way_points[0], step.way_points[1] + 1),
        })) || [];

      return {
        distance: properties.summary.distance, // in meters
        duration: properties.summary.duration, // in seconds
        coordinates: routeCoordinates,
        steps,
        summary: this.formatSummary(properties.summary.distance, properties.summary.duration),
      };
    } catch (error) {
      if ((error as RoutingError).code) {
        throw error;
      }
      console.error('OpenRouteService error:', error);
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
