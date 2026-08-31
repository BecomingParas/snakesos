export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapCoordinate {
  lat: number;
  lng: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface RescueLocation extends Coordinates {
  id: string;
  address: string;
  municipality?: string;
  status: string;
  priority: string;
  name?: string;
  phone?: string;
  snakeDescription?: string;
  assignedVolunteerId?: string;
}

export interface RescuerLocation extends Coordinates {
  id: string;
  name: string;
  phone?: string;
  status?: string;
  experience?: string;
  totalRescues?: number;
  municipality?: string;
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
  antivenomStatus?: string;
  antivenomVerificationFreshness?: 'FRESH' | 'STALE' | 'VERY_OLD' | 'NEVER';
  antivenomLastVerifiedAt?: string | null;
  emergencyAvailable?: boolean;
  emergency24x7?: boolean;
  snakebiteTreatmentAvailable?: boolean;
  ventilatorAvailable?: boolean;
  distance?: number;
  distanceFormatted?: string;
}

export interface IncidentLocation {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  snakeSpecies?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  reportedAt: string;
  notes?: string;
}

export type MapMarkerType =
  | 'RESCUE'
  | 'RESCUER'
  | 'HOSPITAL'
  | 'HOTSPOT'
  | 'USER';

export interface MapMarker {
  id: string;
  position: MapCoordinate;
  title?: string;
  description?: string;
  type?: MapMarkerType;
}

export interface HotspotLocation {
  id: string;
  name: string;
  district?: string;
  province?: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' | 'EXTREME';
  riskScore: number;
  source: string;
  sourceUrl?: string;
  studyYear?: number;
  populationAtRisk?: number;
  latitude?: number;
  longitude?: number;
}

export interface RescueMapProps {
  rescues: RescueLocation[];
  rescuers?: RescuerLocation[];
  hospitals?: HospitalLocation[];
  hotspots?: HotspotLocation[];
  center?: [number, number];
  zoom?: number;
  userLocation?: UserLocation | null;
  selectedRescueId?: string | null;
  onRescueClick?: (rescueId: string) => void;
  onHospitalClick?: (hospitalId: string) => void;
  showAccuracyCircle?: boolean;
  showRoutes?: boolean;
  heatmapPoints?: Array<{
    lat: number;
    lng: number;
    weight?: number;
  }>;
  showHeatmap?: boolean;
  tileTheme?: 'default' | 'dark';
}

export interface GoogleMapsMapConfig {
  defaultCenter: MapCoordinate;
  defaultZoom: number;
  nationalBounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}
