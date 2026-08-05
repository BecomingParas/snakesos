// ===================================================================
// Admin Dashboard Constants
// ===================================================================

import type { RescueStatus } from './types';

export const WEEK_DATA = [
  { day: 'Mon', rescues: 3 },
  { day: 'Tue', rescues: 5 },
  { day: 'Wed', rescues: 2 },
  { day: 'Thu', rescues: 7 },
  { day: 'Fri', rescues: 4 },
  { day: 'Sat', rescues: 6 },
  { day: 'Sun', rescues: 1 },
];

export const PIE_COLORS = [
  '#2ECC71', // Emerald
  '#F39C12', // Yellow
  '#3498DB', // Blue
  '#9B59B6', // Purple
  '#95A5A6', // Gray
];

export const STATUS_COLORS: Record<RescueStatus, string> = {
  PENDING: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  ASSIGNED: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
  IN_PROGRESS: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
  RESCUED: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
  CLOSED: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
};
