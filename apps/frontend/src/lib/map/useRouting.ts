/**
 * useRouting Hook
 * React hook for map routing with loading and error states
 */

import { useState, useCallback } from 'react';
import { routingService, RoutingService } from './routing.service';
import type { RoutePoint, Route, RoutingOptions, RoutingError } from './routing.types';

interface UseRoutingState {
  route: Route | null;
  loading: boolean;
  error: RoutingError | null;
}

interface UseRoutingReturn extends UseRoutingState {
  getRoute: (origin: RoutePoint, destination: RoutePoint, options?: RoutingOptions) => Promise<void>;
  getMultiRoute: (waypoints: RoutePoint[], options?: RoutingOptions) => Promise<void>;
  clearRoute: () => void;
  reset: () => void;
}

export function useRouting(): UseRoutingReturn {
  const [state, setState] = useState<UseRoutingState>({
    route: null,
    loading: false,
    error: null,
  });

  const getRoute = useCallback(
    async (origin: RoutePoint, destination: RoutePoint, options?: RoutingOptions) => {
      setState({ route: null, loading: true, error: null });

      try {
        // Validate coordinates
        if (!RoutingService.validateCoordinates(origin)) {
          throw {
            code: 'INVALID_COORDS',
            message: 'Invalid origin coordinates',
            provider: 'useRouting',
          } as RoutingError;
        }
        if (!RoutingService.validateCoordinates(destination)) {
          throw {
            code: 'INVALID_COORDS',
            message: 'Invalid destination coordinates',
            provider: 'useRouting',
          } as RoutingError;
        }

        const route = await routingService.getRoute(origin, destination, options);
        setState({ route, loading: false, error: null });
      } catch (error) {
        const routingError = error as RoutingError;
        setState({ route: null, loading: false, error: routingError });
      }
    },
    []
  );

  const getMultiRoute = useCallback(async (waypoints: RoutePoint[], options?: RoutingOptions) => {
    setState({ route: null, loading: true, error: null });

    try {
      // Validate all waypoints
      for (let i = 0; i < waypoints.length; i++) {
        if (!RoutingService.validateCoordinates(waypoints[i])) {
          throw {
            code: 'INVALID_COORDS',
            message: `Invalid coordinates at waypoint ${i + 1}`,
            provider: 'useRouting',
          } as RoutingError;
        }
      }

      const route = await routingService.getMultiRoute(waypoints, options);
      setState({ route, loading: false, error: null });
    } catch (error) {
      const routingError = error as RoutingError;
      setState({ route: null, loading: false, error: routingError });
    }
  }, []);

  const clearRoute = useCallback(() => {
    setState(prev => ({ ...prev, route: null }));
  }, []);

  const reset = useCallback(() => {
    setState({ route: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    getRoute,
    getMultiRoute,
    clearRoute,
    reset,
  };
}
