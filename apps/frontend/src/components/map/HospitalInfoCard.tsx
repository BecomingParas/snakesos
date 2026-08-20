/**
 * Hospital Information Card
 * Detailed hospital card with distance, ETA, treatment center info
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Phone,
  Navigation,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MapPin,
  Ambulance,
  Heart,
  Activity,
  Building2,
} from 'lucide-react';
import { formatDistance } from '@/lib/map/distance';
import { RoutingService } from '@/lib/map/routing.service';
import type { HospitalLocation } from './HospitalMap';

interface HospitalInfoCardProps {
  hospital: HospitalLocation;
  showDistance?: boolean;
  showRoute?: boolean;
  onCallClick?: () => void;
  onDirectionsClick?: () => void;
  onRouteClick?: () => void;
  className?: string;
  compact?: boolean;
}

/**
 * Get status badge styling
 */
function getAntivenomBadgeProps(status: HospitalLocation['antivenomStatus']) {
  switch (status) {
    case 'AVAILABLE':
      return {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle2 className="h-3 w-3" />,
      };
    case 'LOW_STOCK':
      return {
        variant: 'default' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <AlertTriangle className="h-3 w-3" />,
      };
    case 'OUT_OF_STOCK':
      return {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-3 w-3" />,
      };
    case 'NOT_SUPPORTED':
      return {
        variant: 'secondary' as const,
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <XCircle className="h-3 w-3" />,
      };
    default:
      return {
        variant: 'outline' as const,
        className: 'bg-slate-100 text-slate-800 border-slate-200',
        icon: <HelpCircle className="h-3 w-3" />,
      };
  }
}

/**
 * Format verification freshness text
 */
function getFreshnessInfo(
  freshness: HospitalLocation['antivenomVerificationFreshness'],
  verifiedAt?: string
): { text: string; variant: 'default' | 'warning' | 'error' } {
  if (!verifiedAt) {
    return { text: 'Never verified', variant: 'error' };
  }

  const date = new Date(verifiedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 24) {
    return {
      text: `Verified ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`,
      variant: 'default',
    };
  } else if (diffDays < 7) {
    return {
      text: `Verified ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`,
      variant: 'default',
    };
  } else if (diffDays < 30) {
    return {
      text: `Last verified ${diffDays} days ago`,
      variant: 'warning',
    };
  } else {
    return {
      text: `Last verified ${diffDays} days ago`,
      variant: 'error',
    };
  }
}

/**
 * Calculate ETA from distance
 */
function calculateETA(distanceKm: number, durationSeconds?: number): string {
  if (durationSeconds) {
    return RoutingService.formatDuration(durationSeconds);
  }
  
  // Fallback: estimate based on average speed (40 km/h in Nepal)
  const avgSpeedKmh = 40;
  const hours = distanceKm / avgSpeedKmh;
  const minutes = Math.round(hours * 60);
  
  if (minutes < 60) {
    return `~${minutes} min`;
  }
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `~${hrs}h ${mins}m` : `~${hrs}h`;
}

export function HospitalInfoCard({
  hospital,
  showDistance = true,
  showRoute = true,
  onCallClick,
  onDirectionsClick,
  onRouteClick,
  className = '',
  compact = false,
}: HospitalInfoCardProps) {
  const antivenomBadge = getAntivenomBadgeProps(hospital.antivenomStatus);
  const freshnessInfo = getFreshnessInfo(
    hospital.antivenomVerificationFreshness,
    hospital.antivenomLastVerifiedAt
  );

  if (compact) {
    return (
      <Card className={`hover:shadow-lg transition-shadow ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🏥</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{hospital.name}</h4>
              {showDistance && hospital.distance !== undefined && (
                <p className="text-xs text-blue-600 font-medium">
                  {formatDistance(hospital.distance)} • {calculateETA(hospital.distance)}
                </p>
              )}
              <div className="flex gap-1 mt-2 flex-wrap">
                {hospital.snakebiteTreatmentAvailable && (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0">
                    🐍 Treatment
                  </Badge>
                )}
                <Badge className={`text-[10px] px-1.5 py-0 ${antivenomBadge.className}`}>
                  {hospital.antivenomStatus.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="text-3xl">🏥</div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight">{hospital.name}</CardTitle>
              <CardDescription className="mt-1">
                <div className="flex items-center gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{hospital.address}</span>
                </div>
                {hospital.municipality && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {hospital.municipality}, {hospital.district}
                  </div>
                )}
              </CardDescription>
            </div>
          </div>
        </div>

        {/* Distance & ETA */}
        {showDistance && hospital.distance !== undefined && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-blue-600">
              <MapPin className="h-4 w-4" />
              <div>
                <p className="text-sm font-semibold">{formatDistance(hospital.distance)}</p>
                <p className="text-xs text-muted-foreground">Distance</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-4 w-4" />
              <div>
                <p className="text-sm font-semibold">{calculateETA(hospital.distance)}</p>
                <p className="text-xs text-muted-foreground">Est. Time</p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Critical Treatment Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Emergency Treatment Capability
          </h4>

          {/* Snakebite Treatment */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">🐍</span>
              <span className="text-sm font-medium">Snakebite Treatment</span>
            </div>
            <Badge variant={hospital.snakebiteTreatmentAvailable ? 'default' : 'secondary'}>
              {hospital.snakebiteTreatmentAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}
            </Badge>
          </div>

          {/* Antivenom Status */}
          <div className="p-3 bg-slate-50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">💉</span>
                <span className="text-sm font-medium">Antivenom Status</span>
              </div>
              <Badge className={antivenomBadge.className}>
                <span className="flex items-center gap-1">
                  {antivenomBadge.icon}
                  {hospital.antivenomStatus.replace('_', ' ')}
                </span>
              </Badge>
            </div>

            {/* Verification Info */}
            {hospital.antivenomLastVerifiedAt && (
              <div className="flex items-start gap-2 text-xs pt-2 border-t border-slate-200">
                <Clock className="h-3.5 w-3.5 mt-0.5 text-slate-500" />
                <div className="flex-1">
                  <p className={`font-medium ${
                    freshnessInfo.variant === 'default' ? 'text-slate-700' :
                    freshnessInfo.variant === 'warning' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {freshnessInfo.text}
                  </p>
                  {freshnessInfo.variant !== 'default' && (
                    <p className="text-yellow-600 flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3" />
                      Please call to confirm current availability
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Warning for Unknown Status */}
            {hospital.antivenomStatus === 'UNKNOWN' && (
              <div className="flex items-start gap-2 text-xs pt-2 border-t border-slate-200 text-amber-700 bg-amber-50 -mx-3 -mb-3 p-3 rounded-b-lg">
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5" />
                <p className="font-medium">
                  Antivenom status not verified. Call hospital to confirm availability before arriving.
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Emergency & Facilities */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Facilities & Services
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {hospital.emergency24x7 && (
              <div className="flex items-center gap-2 text-xs bg-green-50 rounded px-3 py-2">
                <Ambulance className="h-4 w-4 text-green-700" />
                <span className="text-green-800 font-medium">24/7 Emergency</span>
              </div>
            )}
            {hospital.ventilatorAvailable && (
              <div className="flex items-center gap-2 text-xs bg-blue-50 rounded px-3 py-2">
                <Heart className="h-4 w-4 text-blue-700" />
                <span className="text-blue-800 font-medium">Ventilator</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        {(hospital.phone || hospital.emergencyPhone) && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </h4>
            {hospital.phone && (
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                {hospital.phone}
              </p>
            )}
            {hospital.emergencyPhone && (
              <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                <Ambulance className="h-3.5 w-3.5" />
                Emergency: {hospital.emergencyPhone}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {hospital.phone && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = `tel:${hospital.phone}`;
                onCallClick?.();
              }}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          )}
          <Button
            className="w-full"
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`,
                '_blank'
              );
              onDirectionsClick?.();
            }}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Directions
          </Button>
        </div>

        {showRoute && onRouteClick && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={onRouteClick}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Show Route on Map
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
