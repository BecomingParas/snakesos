'use client';

import { useAuth } from '@snake-rescue/features';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from '@snake-rescue/ui';
import {
  LayoutDashboard,
  User,
  Bell,
  Settings,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-400 mt-1">
              Here's what's happening with your rescue activities
            </p>
          </div>
          <Button
            onClick={() => router.push('/emergency')}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report Emergency
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Rescues
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-gray-500 mt-1">
                Lifetime rescue requests
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Active Requests
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-gray-500 mt-1">Pending rescue calls</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Notifications
              </CardTitle>
              <Bell className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-gray-500 mt-1">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Frequently used features
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
              onClick={() => router.push('/emergency')}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              New Rescue
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
              onClick={() => router.push('/ai-identifier')}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Identify Snake
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
              onClick={() => router.push('/dashboard/profile')}
            >
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
              onClick={() => router.push('/dashboard/settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">
              Your latest rescue requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No recent activity</p>
              <p className="text-gray-500 text-sm mt-2">
                Your rescue requests will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
