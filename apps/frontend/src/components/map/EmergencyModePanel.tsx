/**
 * Emergency Mode Panel
 * Critical information panel for active snakebite emergencies
 * Shows: Priority alerts, nearest verified hospitals, quick actions
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  Phone,
  Navigation,
  Clock,
  MapPin,
  Activity,
  Heart,
  Siren,
} from 'lucide-react';
import type { IncidentLocation, HospitalLocation } from './map.types';
import { formatDistance } from '@/lib/map/distance';

interface EmergencyModePanelProps {
  incident: IncidentLocation;
  nearestHospitals: HospitalLocation[];
  onCallEmergency?: () => void;
  onRouteToHospital?: (hospital: HospitalLocation) => void;
  onViewHospitalDetails?: (hospital: HospitalLocation) => void;
  className?: string;
}

/**
 * Get priority color and urgency level
 */
function getPriorityInfo(priority: IncidentLocation['priority']) {
  switch (priority) {
    case 'CRITICAL':
      return {
        color: 'bg-red-600',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        urgency: 'IMMEDIATE ACTION REQUIRED',
        icon: <Siren className="h-5 w-5" />,
      };
    case 'HIGH':
      return {
        color: 'bg-orange-600',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        urgency: 'Urgent Response Needed',
        icon: <AlertTriangle className="h-5 w-5" />,
      };
    default:
      return {
        color: 'bg-yellow-600',
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        urgency: 'Prompt Attention Required',
        icon: <AlertTriangle className="h-5 w-5" />,
      };
  }
}

/**
 * Calculate time since incident
 */
function getTimeSinceIncident(reportedAt: string): string {
  const reported = new Date(reportedAt);
  const now = new Date();
  const diffMs = now.getTime() - reported.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return `${hours}h ${mins}m ago`;
}

export function EmergencyModePanel({
  incident,
  nearestHospitals,
  onCallEmergency,
  onRouteToHospital,
  onViewHospitalDetails,
  className = '',
}: EmergencyModePanelProps) {
  const priorityInfo = getPriorityInfo(incident.priority);
  const timeSince = getTimeSinceIncident(incident.reportedAt);

  // Get nearest verified snakebite facility
  const nearestVerifiedFacility = nearestHospitals.find(
    (h) =>
      h.snakebiteTreatmentAvailable &&
      h.antivenomStatus === 'AVAILABLE' &&
      h.antivenomVerificationFreshness === 'FRESH'
  );

  // Get nearest snakebite facility (any status)
  const nearestSnakebiteFacility = nearestHospitals.find((h) => h.snakebiteTreatmentAvailable);

  return (
    <Card className={`border-2 ${priorityInfo.borderColor} shadow-2xl ${className}`}>
      {/* Emergency Header */}
      <CardHeader className={`${priorityInfo.bgColor} border-b ${priorityInfo.borderColor}`}>
        <div className="flex items-start gap-3">
          <div className={`${priorityInfo.color} rounded-full p-2 text-white animate-pulse`}>
            {priorityInfo.icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span className={priorityInfo.textColor}>SNAKEBITE EMERGENCY</span>
              <Badge variant="destructive" className="text-xs">
                {incident.priority}
              </Badge>
            </CardTitle>
            <p className={`text-xs font-semibold mt-1 ${priorityInfo.textColor}`}>
              {priorityInfo.urgency}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Critical Alert */}
        <Alert variant="destructive" className="animate-in fade-in-50 duration-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-sm font-bold">Time is Critical</AlertTitle>
          <AlertDescription className="text-xs space-y-1">
            <p>Snakebite reported {timeSince}</p>
            <p className="font-semibold">
              Call nearest hospital immediately to confirm antivenom availability
            </p>
          </AlertDescription>
        </Alert>

        {/* Incident Details */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Incident Details
          </h4>
          <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900">{incident.address}</p>
                {incident.snakeSpecies && (
                  <p className="text-slate-600 mt-1">
                    Species: <span className="font-semibold">{incident.snakeSpecies}</span>
                  </p>
                )}
              </div>
            </div>
            {incident.notes && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-slate-600">{incident.notes}</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Nearest Verified Facility */}
        {nearestVerifiedFacility ? (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-green-700">
              <Heart className="h-4 w-4" />
              Nearest Verified Treatment Center
            </h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-green-900 truncate">
                    {nearestVerifiedFacility.name}
                  </p>
                  <p className="text-xs text-green-700 truncate">
                    {nearestVerifiedFacility.address}
                  </p>
                </div>
                <span className="text-xl flex-shrink-0">🏥</span>
              </div>

              {nearestVerifiedFacility.distance !== undefined && (
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-green-800">
                    <MapPin className="h-3 w-3" />
                    <span className="font-semibold">
                      {formatDistance(nearestVerifiedFacility.distance)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-green-800">
                    <Clock className="h-3 w-3" />
                    <span className="font-semibold">
                      ~{Math.round(nearestVerifiedFacility.distance / 40 * 60)} min
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-1 flex-wrap">
                <Badge className="bg-green-100 text-green-800 text-[10px]">
                  ✓ Antivenom Available
                </Badge>
                {nearestVerifiedFacility.emergency24x7 && (
                  <Badge className="bg-green-100 text-green-800 text-[10px]">
                    24/7 Emergency
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {nearestVerifiedFacility.phone && (
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full bg-green-600 hover:bg-green-700 text-xs"
                    onClick={() => {
                      window.location.href = `tel:${nearestVerifiedFacility.phone}`;
                      onCallEmergency?.();
                    }}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call Now
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => onRouteToHospital?.(nearestVerifiedFacility)}
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Get Route
                </Button>
              </div>
            </div>
          </div>
        ) : nearestSnakebiteFacility ? (
          /* Nearest Snakebite Facility (Unverified) */
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              Nearest Snakebite Treatment Center
            </h4>
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-900">
                <p className="font-semibold mb-2">Antivenom status not verified</p>
                <div className="bg-white rounded p-2 space-y-1 mb-2">
                  <p className="font-medium">{nearestSnakebiteFacility.name}</p>
                  <p className="text-amber-700">{nearestSnakebiteFacility.address}</p>
                  {nearestSnakebiteFacility.distance !== undefined && (
                    <p className="text-amber-800 font-semibold">
                      {formatDistance(nearestSnakebiteFacility.distance)} away
                    </p>
                  )}
                </div>
                <p className="font-semibold text-amber-900">
                  ⚠️ CALL FIRST to confirm antivenom availability
                </p>
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-2">
              {nearestSnakebiteFacility.phone && (
                <Button
                  size="sm"
                  variant="default"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-xs"
                  onClick={() => {
                    window.location.href = `tel:${nearestSnakebiteFacility.phone}`;
                  }}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call to Confirm
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => onRouteToHospital?.(nearestSnakebiteFacility)}
              >
                <Navigation className="h-3 w-3 mr-1" />
                Get Route
              </Button>
            </div>
          </div>
        ) : (
          /* No Snakebite Facilities */
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-sm">No Treatment Centers Found</AlertTitle>
            <AlertDescription className="text-xs">
              No snakebite treatment centers found nearby. Contact emergency services immediately.
            </AlertDescription>
          </Alert>
        )}

        {/* Additional Hospitals */}
        {nearestHospitals.length > 1 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-600">
                Other Nearby Hospitals ({Math.min(nearestHospitals.length - 1, 3)})
              </h4>
              <div className="space-y-1.5">
                {nearestHospitals.slice(1, 4).map((hospital) => (
                  <button
                    key={hospital.id}
                    onClick={() => onViewHospitalDetails?.(hospital)}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{hospital.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-0.5">
                          {hospital.distance !== undefined && (
                            <span>{formatDistance(hospital.distance)}</span>
                          )}
                          {hospital.snakebiteTreatmentAvailable && (
                            <Badge variant="secondary" className="text-[9px] h-4 px-1">
                              🐍
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-sm">🏥</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Emergency Actions */}
        <Separator />
        <div className="space-y-2">
          <Button
            variant="destructive"
            className="w-full font-bold"
            size="lg"
            onClick={() => {
              window.location.href = 'tel:102'; // Nepal emergency number
              onCallEmergency?.();
            }}
          >
            <Phone className="h-5 w-5 mr-2" />
            CALL 102 (EMERGENCY)
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            National Emergency Ambulance Service
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
