// ===================================================================
// Admin Dashboard Types
// ===================================================================

export interface AdminStats {
  totalRescues: number;
  pendingRescues: number;
  completedRescues: number;
  activeRescues: number;
  totalVolunteers: number;
  pendingVolunteers: number;
  totalSpecies: number;
  totalBlogs: number;
}

export interface RescueRecord {
  id: string;
  name: string;
  phone: string;
  municipality: string;
  status: RescueStatus;
  createdAt: string;
}

export type RescueStatus = 
  | 'PENDING' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'RESCUED' 
  | 'CLOSED';

export interface TelegramStatus {
  enabled: boolean;
  botTokenSet: boolean;
  chatIdSet: boolean;
}

export interface WeekActivity {
  day: string;
  rescues: number;
}

export interface PieChartData {
  name: string;
  value: number;
}

export interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'emerald' | 'yellow' | 'blue' | 'purple' | 'red';
  subtext: string;
  href: string;
  delay?: number;
}
