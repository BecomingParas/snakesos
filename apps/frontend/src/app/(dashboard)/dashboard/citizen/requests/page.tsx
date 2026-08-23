'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useMyRescueRequestsQuery } from '@/lib/graphql/hooks/rescue.hooks';
import { toast } from 'sonner';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';

/**
 * Citizen Requests List Page
 * Shows all rescue requests by the citizen
 */

// Mock data (kept as fallback)
const mockRequests = [
  {
    id: 'req-1',
    referenceNumber: 'BR-2024-103',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    address: 'Hospital Road',
    municipality: 'Butwal',
    snakeDescription: 'Large brown snake',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    assignedVolunteer: {
      name: 'Ram Sharma',
    },
  },
  {
    id: 'req-2',
    referenceNumber: 'BR-2024-098',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    address: 'Main Chowk',
    municipality: 'Butwal',
    snakeDescription: 'Small green snake in garden',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
    assignedVolunteer: {
      name: 'Sita Devi',
    },
  },
  {
    id: 'req-3',
    referenceNumber: 'BR-2024-092',
    status: 'CANCELLED',
    priority: 'LOW',
    address: 'Traffic Area',
    municipality: 'Butwal',
    snakeDescription: 'Snake already gone',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
  ASSIGNED: { label: 'Assigned', color: 'bg-blue-500', icon: AlertCircle },
  ACCEPTED: { label: 'Accepted', color: 'bg-green-500', icon: CheckCircle },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'bg-purple-500',
    icon: AlertCircle,
  },
  COMPLETED: { label: 'Completed', color: 'bg-green-600', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500', icon: AlertCircle },
};

export default function CitizenRequestsListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Map tabs to statuses
  const statusMap: Record<string, string[] | undefined> = {
    active: ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'],
    completed: ['COMPLETED'],
    cancelled: ['CANCELLED'],
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Fetch real data from GraphQL
  const { data, loading, error } = useMyRescueRequestsQuery({
    variables: {
      pagination: { limit: pageSize, page: currentPage },
      filter: statusMap[activeTab] ? { statuses: statusMap[activeTab] } : {},
    },
    pollInterval: 10000, // Real-time updates every 10 seconds
    fetchPolicy: 'cache-and-network',
  });

  // Extract requests
  const allRequests = data?.myRescueRequests?.edges?.map((e) => e.node) || [];

  // Use real data if available, otherwise fallback to mock data
  const requests = data?.myRescueRequests ? allRequests : mockRequests;

  // Filter by tab
  const activeRequests = requests.filter((r) =>
    ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status),
  );
  const completedRequests = requests.filter((r) => r.status === 'COMPLETED');
  const cancelledRequests = requests.filter((r) => r.status === 'CANCELLED');

  // Show error toast if query fails
  if (error) {
    toast.error(`Failed to load requests: ${error.message}`);
  }

  // Loading state
  if (loading && !data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading your requests...
          </p>
        </div>
      </div>
    );
  }

  const renderRequestCard = (request: (typeof mockRequests)[0]) => {
    const statusConfig =
      STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG];
    const StatusIcon = statusConfig.icon;

    return (
      <Card
        key={request.id}
        className="p-6 hover:border-primary cursor-pointer transition-colors"
        onClick={() => router.push(`/dashboard/citizen/requests/${request.id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{request.referenceNumber}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {request.address}, {request.municipality}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className={cn('text-white', statusConfig.color)}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusConfig.label}
            </Badge>
          </div>
        </div>

        <p className="text-sm mb-4">{request.snakeDescription}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
            {request.assignedVolunteer && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{request.assignedVolunteer.name}</span>
              </div>
            )}
          </div>
          <Button size="sm" variant="outline">
            <Eye className="mr-1 h-4 w-4" />
            View Details
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Rescue Requests
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                View and manage your rescue requests
              </p>
            </div>
            <Button onClick={() => router.push('/dashboard/citizen/request')}>
              New Request
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-3 mb-8">
          <Card className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <p className="mt-1 text-3xl font-bold">{activeRequests.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Completed
            </p>
            <p className="mt-1 text-3xl font-bold">
              {completedRequests.length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="mt-1 text-3xl font-bold">{requests.length}</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="active">
              Active ({activeRequests.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeRequests.length > 0 ? (
              activeRequests.map(renderRequestCard)
            ) : (
              <Card className="p-12 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">
                  No Active Requests
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  You don't have any active rescue requests
                </p>
                <Button
                  className="mt-4"
                  onClick={() => router.push('/dashboard/citizen/request')}
                >
                  Create New Request
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedRequests.length > 0 ? (
              completedRequests.map(renderRequestCard)
            ) : (
              <Card className="p-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">
                  No Completed Requests
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  You haven't completed any rescue requests yet
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledRequests.length > 0 ? (
              cancelledRequests.map(renderRequestCard)
            ) : (
              <Card className="p-12 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">
                  No Cancelled Requests
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  You haven't cancelled any requests
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        <DashboardPagination
          page={currentPage}
          pageSize={pageSize}
          totalCount={data?.myRescueRequests?.totalCount || 0}
          pageInfo={data?.myRescueRequests?.pageInfo}
          onPageChange={setCurrentPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}
