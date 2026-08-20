/**
 * Routing Service
 * Main routing service with provider fallback
 */

import { OpenRouteServiceProvider } from './providers/openrouteservice.provider';
import { OSRMProvider } from './providers/osrm.provider';
import type {
  RoutePoint,
  Route,
  RoutingProvider,
  RoutingOptions,
  RoutingError,
} from './routing.types';

export class RoutingService {
  private providers: RoutingProvider[];
  private currentProviderIndex = 0;

  constructor() {
    // Initialize providers in priority order
    this.providers = [
      new OpenRouteServiceProvider(), // Primary: More features
      new OSRMProvider(), // Fallback: Always available
    ];
  }

  /**
   * Get route between two points with automatic provider fallback
   */
  async getRoute(
    origin: RoutePoint,
    destination: RoutePoint,
    options?: RoutingOptions
  ): Promise<Route> {
    return this.getRouteWithFallback(
      async provider => provider.getRoute(origin, destination, options),
      'getRoute'
    );
  }

  /**
   * Get route through multiple waypoints with automatic provider fallback
   */
  async getMultiRoute(waypoints: RoutePoint[], options?: RoutingOptions): Promise<Route> {
    return this.getRouteWithFallback(
      async provider => provider.getMultiRoute(waypoints, options),
      'getMultiRoute'
    );
  }

  /**
   * Execute routing request with automatic provider fallback
   */
  private async getRouteWithFallback(
    routeFn: (provider: RoutingProvider) => Promise<Route>,
    operation: string
  ): Promise<Route> {
    const errors: RoutingError[] = [];

    // Try each provider in order
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      try {
        console.log(`[RoutingService] Attempting ${operation} with ${provider.name}`);
        const route = await routeFn(provider);
        
        // Success! Update current provider index for next time
        this.currentProviderIndex = i;
        console.log(`[RoutingService] Success with ${provider.name}`);
        
        return route;
      } catch (error) {
        const routingError = error as RoutingError;
        console.warn(`[RoutingService] ${provider.name} failed:`, routingError.message);
        errors.push(routingError);

        // If this is an invalid coordinates error, don't try other providers
        if (routingError.code === 'INVALID_COORDS') {
          throw routingError;
        }

        // Continue to next provider
        continue;
      }
    }

    // All providers failed
    const finalError: RoutingError = {
      code: 'API_ERROR',
      message: `All routing providers failed: ${errors.map(e => `${e.provider}: ${e.message}`).join(', ')}`,
      provider: 'RoutingService',
    };

    console.error('[RoutingService] All providers failed:', finalError);
    throw finalError;
  }

  /**
   * Get the currently active provider name
   */
  getCurrentProvider(): string {
    return this.providers[this.currentProviderIndex]?.name || 'None';
  }

  /**
   * Format distance in meters to human-readable string
   */
  static formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    const km = meters / 1000;
    return km < 10 ? `${km.toFixed(1)}km` : `${Math.round(km)}km`;
  }

  /**
   * Format duration in seconds to human-readable string
   */
  static formatDuration(seconds: number): string {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  /**
   * Validate coordinates before routing
   */
  static validateCoordinates(point: RoutePoint): boolean {
    const { lat, lng } = point;
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  }
}

// Export singleton instance
export const routingService = new RoutingService();

// Export types
export type { RoutePoint, Route, RoutingOptions, RoutingError };
