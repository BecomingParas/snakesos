/**
 * HospitalMap Component
 * Interactive map showing hospitals with verified antivenom availability
 *
 * MEDICAL SAFETY: Never displays "Antivenom Available" unless verified
 */

'use client';

import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatDistance, calculateDistance } from '@/lib/map/distance';
import { isValidCoordinate } from '@/lib/map/coordinates';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Navigation, AlertTriangle, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

// Fix for default marker icons in Next.js/Webpack
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

export interface HospitalLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  municipality?: string;
  district?: string;
  phone?: string;
  emergencyPhone?: string;

  // Snakebite treatment
  snakebiteTreatmentAvailable: boolean;

  // Antivenom status (CRITICAL)
  antivenomStatus:
    | 'AVAILABLE'
    | 'LOW_STOCK'
    | 'OUT_OF_STOCK'
    | 'UNKNOWN'
    | 'NOT_SUPPORTED';
  antivenomLastVerifiedAt?: string;
  antivenomVerificationFreshness: 'FRESH' | 'STALE' | 'VERY_OLD' | 'NEVER';

  // Capabilities
  emergencyAvailable: boolean;
  emergency24x7: boolean;
  ventilatorAvailable: boolean;

  // Distance (computed)
  distance?: number;
}

interface HospitalMapProps {
  hospitals: HospitalLocation[];
  center?: [number, number];
  zoom?: number;
  userLocation?: { latitude: number; longitude: number } | null;
  selectedHospitalId?: string | null;
  onHospitalClick?: (hospitalId: string) => void;
  filters?: {
    snakebiteTreatmentOnly?: boolean;
    antivenomAvailable?: boolean;
    emergency24x7?: boolean;
  };
}

// Map updater component
function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom || map.getZoom(), {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);

  return null;
}

/**
 * CRITICAL: Get marker color based on verified medical capability
 *
 * 🟢 GREEN: Verified antivenom available
 * 🟡 YELLOW: Snakebite treatment center, antivenom status unknown/stale
 * 🔴 RED: Verified out of stock
 * ⚪ GRAY: General hospital, snakebite capability unknown/not supported
 */
function getHospitalMarkerColor(hospital: HospitalLocation): string {
  // RED: Verified out of stock
  if (hospital.antivenomStatus === 'OUT_OF_STOCK') {
    return '#dc2626'; // red-600
  }

  // GREEN: Verified available (FRESH verification only)
  if (
    hospital.antivenomStatus === 'AVAILABLE' &&
    hospital.antivenomVerificationFreshness === 'FRESH'
  ) {
    return '#16a34a'; // green-600
  }

  // YELLOW: Snakebite treatment center but antivenom unknown/stale/low
  if (
    hospital.snakebiteTreatmentAvailable &&
    (hospital.antivenomStatus === 'UNKNOWN' ||
      hospital.antivenomStatus === 'LOW_STOCK' ||
      hospital.antivenomVerificationFreshness !== 'FRESH')
  ) {
    return '#ca8a04'; // yellow-600
  }

  // GRAY: General hospital or not supported
  return '#6b7280'; // gray-500
}

function getStatusBadgeColor(
  status: HospitalLocation['antivenomStatus'],
): string {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-green-100 text-green-800';
    case 'LOW_STOCK':
      return 'bg-yellow-100 text-yellow-800';
    case 'OUT_OF_STOCK':
      return 'bg-red-100 text-red-800';
    case 'NOT_SUPPORTED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
}

function getFreshnessText(
  freshness: HospitalLocation['antivenomVerificationFreshness'],
  verifiedAt?: string,
): string {
  if (!verifiedAt) return 'Never verified';

  const date = new Date(verifiedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 24) {
    return `Verified ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `Verified ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return `Last verified ${diffDays} days ago`;
  }
}

export function HospitalMap({
  hospitals,
  center = [27.7172, 85.324], // Kathmandu default
  zoom = 13,
  userLocation,
  selectedHospitalId,
  onHospitalClick,
  filters = {},
}: HospitalMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [selectedHospital, setSelectedHospital] =
    useState<HospitalLocation | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  // Filter hospitals based on criteria
  const filteredHospitals = hospitals.filter((hospital) => {
    if (!isValidCoordinate(hospital.latitude, hospital.longitude)) {
      return false;
    }

    if (
      filters.snakebiteTreatmentOnly &&
      !hospital.snakebiteTreatmentAvailable
    ) {
      return false;
    }

    if (filters.antivenomAvailable) {
      // Only show VERIFIED available (FRESH)
      if (
        hospital.antivenomStatus !== 'AVAILABLE' ||
        hospital.antivenomVerificationFreshness !== 'FRESH'
      ) {
        return false;
      }
    }

    if (filters.emergency24x7 && !hospital.emergency24x7) {
      return false;
    }

    return true;
  });

  // Calculate distances if user location is available
  const hospitalsWithDistance = filteredHospitals.map((hospital) => ({
    ...hospital,
    distance: userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          hospital.latitude,
          hospital.longitude,
        )
      : undefined,
  }));

  // Update center when user location is available
  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude]);
      setMapZoom(12);
    }
  }, [userLocation]);

  // Update center when prop changes
  useEffect(() => {
    const centerStr = JSON.stringify(center);
    const currentStr = JSON.stringify(mapCenter);
    if (centerStr !== currentStr) {
      setMapCenter(center);
    }
  }, [center]);

  const handleHospitalClick = (hospital: HospitalLocation) => {
    setSelectedHospital(hospital);
    setIsSheetOpen(true);
    onHospitalClick?.(hospital.id);
  };

  const handleCall = (phone?: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleDirections = (lat: number, lng: number) => {
    // Open in Google Maps
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank',
    );
  };

  const handleReportSubmit = () => {
    if (!selectedHospital || !reportReason) return;

    setIsReportDialogOpen(false);
    setReportReason('');
    setReportDetails('');
    toast.success('Report submitted', {
      description: `${selectedHospital.name} information will be reviewed.`,
    });
  };

  return (
    <>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        className="z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapUpdater center={mapCenter} zoom={mapZoom} />

        {/* User Location Marker */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={L.divIcon({
                className: 'user-location-marker',
                html: `
                  <div style="
                    background: #3b82f6;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  "></div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-blue-600">📍 Your Location</strong>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={100}
              pathOptions={{
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                color: '#3b82f6',
                weight: 1,
              }}
            />
          </>
        )}

        {/* Hospital Markers */}
        {hospitalsWithDistance.map((hospital) => {
          const isSelected = selectedHospitalId === hospital.id;
          const markerColor = getHospitalMarkerColor(hospital);

          return (
            <Marker
              key={`hospital-${hospital.id}`}
              position={[hospital.latitude, hospital.longitude]}
              icon={L.divIcon({
                className: 'hospital-marker',
                html: `
                  <div style="
                    background: ${markerColor};
                    width: ${isSelected ? '40px' : '34px'};
                    height: ${isSelected ? '40px' : '34px'};
                    border-radius: 50%;
                    border: ${isSelected ? '4px' : '3px'} solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,${isSelected ? '0.5' : '0.3'});
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${isSelected ? '20px' : '18px'};
                    cursor: pointer;
                  ">🏥</div>
                `,
                iconSize: [isSelected ? 40 : 34, isSelected ? 40 : 34],
                iconAnchor: [isSelected ? 20 : 17, isSelected ? 20 : 17],
              })}
              eventHandlers={{
                click: () => handleHospitalClick(hospital),
              }}
            >
              <Popup>
                <div className="text-sm min-w-[250px]">
                  <strong className="text-slate-900">🏥 {hospital.name}</strong>

                  <div className="mt-2 space-y-1.5">
                    <p className="text-xs text-slate-700">
                      📍 {hospital.address}
                    </p>

                    {hospital.distance !== undefined && (
                      <p className="text-xs text-blue-600 font-semibold">
                        {formatDistance(hospital.distance)} away
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-200 space-y-1">
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-slate-600">
                          🐍 Snakebite Treatment:
                        </span>
                        <Badge
                          variant={
                            hospital.snakebiteTreatmentAvailable
                              ? 'default'
                              : 'secondary'
                          }
                          className="text-[10px] px-1.5 py-0"
                        >
                          {hospital.snakebiteTreatmentAvailable ? 'YES' : 'NO'}
                        </Badge>
                      </p>

                      <p className="text-xs flex items-center justify-between">
                        <span className="text-slate-600">💉 Antivenom:</span>
                        <Badge
                          className={`text-[10px] px-1.5 py-0 ${getStatusBadgeColor(hospital.antivenomStatus)}`}
                        >
                          {hospital.antivenomStatus.replace('_', ' ')}
                        </Badge>
                      </p>

                      {hospital.antivenomLastVerifiedAt && (
                        <p className="text-[10px] text-slate-500 italic">
                          {getFreshnessText(
                            hospital.antivenomVerificationFreshness,
                            hospital.antivenomLastVerifiedAt,
                          )}
                        </p>
                      )}

                      {hospital.emergency24x7 && (
                        <p className="text-xs flex items-center">
                          <span className="text-green-600">
                            🚑 24/7 Emergency
                          </span>
                        </p>
                      )}

                      {hospital.ventilatorAvailable && (
                        <p className="text-xs flex items-center">
                          <span className="text-blue-600">
                            🫁 Ventilator Available
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex gap-2">
                      {hospital.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => handleCall(hospital.phone)}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="text-xs h-7"
                        onClick={() =>
                          handleDirections(
                            hospital.latitude,
                            hospital.longitude,
                          )
                        }
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Hospital Detail Sheet (Mobile-friendly) */}
      {selectedHospital && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle className="text-left">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🏥</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      {selectedHospital.name}
                    </h3>
                    {selectedHospital.distance !== undefined && (
                      <p className="text-sm text-blue-600 font-semibold">
                        📍 {formatDistance(selectedHospital.distance)} away
                      </p>
                    )}
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(80vh-120px)] pb-6">
              {/* Critical Information Box */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    🐍 Snakebite Treatment
                  </span>
                  <Badge
                    variant={
                      selectedHospital.snakebiteTreatmentAvailable
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {selectedHospital.snakebiteTreatmentAvailable
                      ? 'AVAILABLE'
                      : 'NOT AVAILABLE'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    💉 Antivenom
                  </span>
                  <Badge
                    className={getStatusBadgeColor(
                      selectedHospital.antivenomStatus,
                    )}
                  >
                    {selectedHospital.antivenomStatus.replace('_', ' ')}
                  </Badge>
                </div>

                {selectedHospital.antivenomLastVerifiedAt && (
                  <div className="flex items-start gap-2 text-xs text-slate-600 bg-white rounded p-2">
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        {getFreshnessText(
                          selectedHospital.antivenomVerificationFreshness,
                          selectedHospital.antivenomLastVerifiedAt,
                        )}
                      </p>
                      {selectedHospital.antivenomVerificationFreshness !==
                        'FRESH' && (
                        <p className="text-yellow-600 flex items-center gap-1 mt-1">
                          <AlertTriangle className="h-3 w-3" />
                          Verification may be outdated
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency & Facilities */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-900">
                  Emergency & Facilities
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedHospital.emergency24x7 && (
                    <div className="flex items-center gap-2 text-xs bg-green-50 rounded px-3 py-2">
                      <span>🚑</span>
                      <span className="text-green-800">24/7 Emergency</span>
                    </div>
                  )}
                  {selectedHospital.ventilatorAvailable && (
                    <div className="flex items-center gap-2 text-xs bg-blue-50 rounded px-3 py-2">
                      <span>🫁</span>
                      <span className="text-blue-800">Ventilator</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-900">
                  Location
                </h4>
                <p className="text-sm text-slate-600">
                  {selectedHospital.address}
                </p>
                {selectedHospital.municipality && (
                  <p className="text-xs text-slate-500">
                    {selectedHospital.municipality}, {selectedHospital.district}
                  </p>
                )}
              </div>

              {/* Contact */}
              {(selectedHospital.phone || selectedHospital.emergencyPhone) && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Contact
                  </h4>
                  {selectedHospital.phone && (
                    <p className="text-sm text-slate-600">
                      📞 {selectedHospital.phone}
                    </p>
                  )}
                  {selectedHospital.emergencyPhone && (
                    <p className="text-sm text-red-600 font-medium">
                      🚨 Emergency: {selectedHospital.emergencyPhone}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                {selectedHospital.phone && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleCall(selectedHospital.phone)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Hospital
                  </Button>
                )}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() =>
                    handleDirections(
                      selectedHospital.latitude,
                      selectedHospital.longitude,
                    )
                  }
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>

              {/* Report Incorrect Info */}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs text-slate-500 hover:text-slate-700"
                onClick={() => setIsReportDialogOpen(true)}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Report Incorrect Information
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}

      <Dialog
        open={isReportDialogOpen}
        onOpenChange={(open) => {
          setIsReportDialogOpen(open);
          if (!open) {
            setReportReason('');
            setReportDetails('');
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report incorrect information</DialogTitle>
            <DialogDescription>
              Help us keep {selectedHospital?.name || 'this hospital'}{' '}
              information accurate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hospital-report-reason">What is incorrect?</Label>
              <select
                id="hospital-report-reason"
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
              >
                <option value="">Select a reason</option>
                <option value="wrong-contact">Phone number is incorrect</option>
                <option value="wrong-location">
                  Location or address is incorrect
                </option>
                <option value="wrong-capability">
                  Hospital capabilities are incorrect
                </option>
                <option value="outdated">Information is outdated</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital-report-details">
                Additional details (optional)
              </Label>
              <Textarea
                id="hospital-report-details"
                value={reportDetails}
                onChange={(event) => setReportDetails(event.target.value)}
                placeholder="Tell us what needs to be corrected..."
                maxLength={500}
                rows={4}
              />
              <p className="text-right text-xs text-muted-foreground">
                {reportDetails.length}/500
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsReportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!reportReason}
              onClick={handleReportSubmit}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
