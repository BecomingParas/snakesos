'use client';

import {
  useAdminStats,
  useTelegramStatus,
  StatCardGrid,
  RescueActivityChart,
  RescueStatusPie,
  RecentRescuesTable,
  TelegramAlertPanel,
  QuickActionLinks,
  AdminLoadingState,
} from '@snake-rescue/features';

export default function AdminDashboardPage() {
  const { stats, recentRescues, loading } = useAdminStats();
  const { status, testing, result, testTelegram } = useTelegramStatus();

  if (loading) {
    return <AdminLoadingState />;
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-400 py-12">
        Failed to load dashboard data. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm mt-1">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <StatCardGrid stats={stats} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RescueActivityChart />
        </div>
        <RescueStatusPie stats={stats} />
      </div>

      {/* Recent Rescues Table */}
      <RecentRescuesTable rescues={recentRescues} />

      {/* Telegram Alert Panel */}
      <TelegramAlertPanel
        status={status}
        testing={testing}
        result={result}
        onTest={testTelegram}
      />

      {/* Quick Action Links */}
      <QuickActionLinks />
    </div>
  );
}
