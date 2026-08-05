// ===================================================================
// Admin Feature Module - Barrel Exports
// ===================================================================

// Types
export type {
  AdminStats,
  RescueRecord,
  RescueStatus,
  TelegramStatus,
  WeekActivity,
  PieChartData,
  StatCardProps,
} from './types';

// Constants
export { WEEK_DATA, PIE_COLORS, STATUS_COLORS } from './constants';

// Hooks
export { useAdminStats } from './hooks/use-admin-stats';
export { useTelegramStatus } from './hooks/use-telegram-status';

// Components
export { StatCard, StatCardGrid } from './components/stat-card';
export { RescueActivityChart } from './components/rescue-activity-chart';
export { RescueStatusPie } from './components/rescue-status-pie';
export { RecentRescuesTable } from './components/recent-rescues-table';
export { TelegramAlertPanel } from './components/telegram-alert-panel';
export { QuickActionLinks } from './components/quick-action-links';
export { AdminLoadingState } from './components/loading-state';
