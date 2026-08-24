export interface Coordinates {
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
  emergency24x7?: boolean;
  distance?: number;
  distanceFormatted?: string;
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
}
