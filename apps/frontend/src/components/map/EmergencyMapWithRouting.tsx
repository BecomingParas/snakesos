/**
 * Emergency Map with Routing
 * Enhanced Emergency Map with integrated routing capabilities
 * Shows route from incident to nearest hospital with turn-by-turn directions
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { EmergencyMap } from './EmergencyMap';
import type { IncidentLocation, RescuerLocation } from './EmergencyMap';
import type { HospitalLocation } from './HospitalMap';
import { useRouting } from '@/lib/map/useRouting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  MapIcon,
  Navigation,
  Clock,
  AlertTriangle,
  Loader2,
  X,
  ChevronRight,
  Route as RouteIcon,
} from 'lucide-react';
import { RoutingService } from '@/lib/map/routing.service';

interface EmergencyMapWithRoutingProps {
  incident?: IncidentLocation;
  rescuers?: RescuerLocation[];
  hospitals?: HospitalLocation[];
  center?: [number, number];
  zoom?: number;
  onIncidentClick?: () => void;
  onRescuerClick?: (rescuerId: string) => void;
  onHospitalClick?: (hospitalId: string) => void;
  showRescuers?: boolean;
  showHospitals?: boolean;
  emergencyMode?: boolean;
  autoRouteToNearestHospital?: boolean;
}

export function EmergencyMapWithRouting({
  incident,
  rescuers = [],
  hospitals = [],
  center,
  zoom = 13,
  onIncidentClick,
  onRescuerClick,
  onHospitalClick,
  showRescuers = true,
  showHospitals = true,
  emergencyMode = false,
  autoRouteToNearestHospital = false,
}: EmergencyMapWithRoutingProps) {
  const { route, loading: routeLoading, error: routeError, getRoute, clearRoute } = useRouting();
  const [selectedHospital, setSelectedHospital] = useState<HospitalLocation | null>(null);
  const [showRoutePanel, setShowRoutePanel] = useState(false);

  // Auto-route to nearest hospital if enabled
  useEffect(() => {
    if (
      autoRouteToNearestHospital &&
      incident &&
      hospitals.length > 0 &&
      !route &&
      !routeLoading
    ) {
      // Find nearest hospital with snakebite treatment
      const snakebiteFacilities = hospitals.filter((h) => h.snakebiteTreatmentAvailable);
      const nearestHospital =
        snakebiteFacilities.length > 0 ? snakebiteFacilities[0] : hospitals[0];

      if (nearestHospital) {
        handleGetRoute(nearestHospital);
      }
    }
  }, [autoRouteToNearestHospital, incident, hospitals, route, routeLoading]);

  const handleGetRoute = useCallback(
    async (hospital: HospitalLocation) => {
      if (!incident) return;

      setSelectedHospital(hospital);
      setShowRoutePanel(true);

      await getRoute(
        { lat: incident.latitude, lng: incident.longitude },
        { lat: hospital.latitude, lng: hospital.longitude },
        { profile: 'driving' }
      );
    },
    [incident, getRoute]
  );

  const handleClearRoute = useCallback(() => {
    clearRoute();
    setSelectedHospital(null);
    setShowRoutePanel(false);
  }, [clearRoute]);

  const handleHospitalClickWithRoute = useCallback(
    (hospitalId: string) => {
      const hospital = hospitals.find((h) => h.id === hospitalId);
      if (hospital && incident) {
        handleGetRoute(hospital);
      }
      onHospitalClick?.(hospitalId);
    },
    [hospitals, incident, handleGetRoute, onHospitalClick]
  );

  return (
    <div className="relative w-full h-full">
      {/* Main Map */}
      <EmergencyMap
        incident={incident}
        rescuers={rescuers}
        hospitals={hospitals}
        route={route ?? undefined}
        showRoute={!!route}
        center={center}
        zoom={zoom}
        onIncidentClick={onIncidentClick}
        onRescuerClick={onRescuerClick}
        onHospitalClick={handleHospitalClickWithRoute}
        showRescuers={showRescuers}
        showHospitals={showHospitals}
        emergencyMode={emergencyMode}
      />

      {/* Route Panel */}
      {showRoutePanel && (
        <Card className="absolute top-4 right-4 z-[1000] w-80 max-h-[80vh] shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                <RouteIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <CardTitle className="text-base">Route to Hospital</CardTitle>
                  {selectedHospital && (
                    <CardDescription className="text-xs mt-1">
                      {selectedHospital.name}
                    </CardDescription>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mr-2 -mt-1"
                onClick={handleClearRoute}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Loading State */}
            {routeLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                  <p className="text-sm text-muted-foreground">Calculating route...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {routeError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {routeError.message}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectedHospital && handleGetRoute(selectedHospital)}
                    className="mt-2 w-full text-xs"
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Route Summary */}
            {route && !routeLoading && (
              <>
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900">
                        {RoutingService.formatDistance(route.distance)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900">
                        {RoutingService.formatDuration(route.duration)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700">
                    Fastest route via road • {route.coordinates.length} waypoints
                  </p>
                </div>

                {/* Emergency Warning */}
                {emergencyMode && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-xs text-red-900">
                      <strong>Emergency Route:</strong> Drive carefully. Consider calling ahead to
                      confirm hospital readiness.
                    </AlertDescription>
                  </Alert>
                )}

                <Separator />

                {/* Turn-by-Turn Directions */}
                {route.steps && route.steps.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      Turn-by-Turn Directions
                    </h4>
                    <ScrollArea className="h-48">
                      <div className="space-y-2 pr-3">
                        {route.steps.map((step, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0 text-xs space-y-1">
                              <p className="text-slate-900">{step.instruction}</p>
                              <div className="flex items-center gap-3 text-muted-foreground">
                                <span>
                                  {RoutingService.formatDistance(step.distance)}
                                </span>
                                {step.duration > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      {RoutingService.formatDuration(step.duration)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                <Separator />

                {/* Hospital Info */}
                {selectedHospital && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Destination</h4>
                    <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xl">🏥</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {selectedHospital.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {selectedHospital.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {selectedHospital.snakebiteTreatmentAvailable && (
                          <Badge variant="default" className="text-[10px]">
                            🐍 Snakebite Treatment
                          </Badge>
                        )}
                        {selectedHospital.emergency24x7 && (
                          <Badge variant="secondary" className="text-[10px]">
                            🚑 24/7 Emergency
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {selectedHospital?.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedHospital.phone) {
                          window.location.href = `tel:${selectedHospital.phone}`;
                        }
                      }}
                      className="text-xs"
                    >
                      <span className="mr-1">📞</span>
                      Call
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => {
                      if (selectedHospital) {
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.latitude},${selectedHospital.longitude}`,
                          '_blank'
                        );
                      }
                    }}
                    className="text-xs"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Open in Maps
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Route Button for other hospitals */}
      {!showRoutePanel && incident && hospitals.length > 0 && (
        <div className="absolute bottom-20 right-4 z-[1000]">
          <Button
            size="sm"
            onClick={() => {
              const nearestHospital = hospitals[0];
              if (nearestHospital) {
                handleGetRoute(nearestHospital);
              }
            }}
            className="shadow-lg"
          >
            <RouteIcon className="h-4 w-4 mr-2" />
            Show Route
          </Button>
        </div>
      )}
    </div>
  );
}
