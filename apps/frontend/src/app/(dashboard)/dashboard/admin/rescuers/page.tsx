'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Search,
  UserCheck,
  Award,
  MapPin,
  Star,
  Activity,
  Phone,
  Mail,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useVolunteersQuery } from '@/lib/graphql/hooks/volunteer.hooks';
import { toast } from 'sonner';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';

/**
 * Admin Rescuers Management Page - NOW WITH GRAPHQL INTEGRATION ✅
 */

type StatusFilter = 'all' | 'available' | 'busy' | 'verified' | 'pending';

export default function AdminRescuersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Fetch volunteers
  const { data, loading, error } = useVolunteersQuery({
    variables: {
      pagination: { limit: pageSize, page: currentPage },
      filter: {
        status:
          statusFilter === 'verified'
            ? 'VERIFIED'
            : statusFilter === 'pending'
              ? 'PENDING'
              : undefined,
        isAvailableNow:
          statusFilter === 'available'
            ? true
            : statusFilter === 'busy'
              ? false
              : undefined,
        search: searchTerm || undefined,
      },
      sort: { field: 'BAYESIAN_RATING', order: 'DESC' },
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000, // Poll every 30 seconds
  });

  const volunteers = data?.volunteers?.edges?.map((e) => e.node) || [];

  // Filter volunteers based on search
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((volunteer) => {
      const matchesSearch =
        volunteer.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.user.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        volunteer.user.phone?.includes(searchTerm) ||
        volunteer.municipality.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [volunteers, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: volunteers.length,
      available: volunteers.filter((v) => v.isAvailableNow).length,
      verified: volunteers.filter((v) => v.status === 'VERIFIED').length,
      pending: volunteers.filter((v) => v.status === 'PENDING').length,
    };
  }, [volunteers]);

  if (error) {
    toast.error(`Failed to load rescuers: ${error.message}`);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="h-8 w-8" />
            Rescuers Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and monitor all rescuers and volunteers
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Total Rescuers
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.available}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Available Now
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.verified}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Verified
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <UserCheck className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Pending
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, phone, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'available' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('available')}
              size="sm"
            >
              Available
            </Button>
            <Button
              variant={statusFilter === 'verified' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('verified')}
              size="sm"
            >
              Verified
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('pending')}
              size="sm"
            >
              Pending
            </Button>
          </div>
        </div>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      )}

      {/* Rescuers List */}
      {!loading && filteredVolunteers.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVolunteers.map((volunteer) => (
            <Card
              key={volunteer.id}
              className="cursor-pointer p-6 transition-shadow hover:shadow-lg"
              role="link"
              tabIndex={0}
              onClick={() =>
                router.push(`/dashboard/admin/rescuers/${volunteer.id}`)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  router.push(`/dashboard/admin/rescuers/${volunteer.id}`);
                }
              }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{volunteer.user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {volunteer.experience}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={
                      volunteer.isAvailableNow ? 'bg-green-500' : 'bg-gray-500'
                    }
                  >
                    {volunteer.isAvailableNow ? 'Available' : 'Busy'}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span>{volunteer.totalRescues} rescues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{volunteer.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {volunteer.municipality}
                      {volunteer.ward ? `, Ward ${volunteer.ward}` : ''}
                    </span>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-2 text-sm">
                  {volunteer.user.phone && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Phone className="h-3 w-3" />
                      <span>{volunteer.user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{volunteer.user.email}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      volunteer.status === 'VERIFIED'
                        ? 'border-green-500 text-green-700'
                        : volunteer.status === 'PENDING'
                          ? 'border-yellow-500 text-yellow-700'
                          : volunteer.status === 'APPROVED'
                            ? 'border-blue-500 text-blue-700'
                            : 'border-red-500 text-red-700'
                    }`}
                  >
                    {volunteer.status === 'VERIFIED'
                      ? '✓ Verified'
                      : volunteer.status === 'PENDING'
                        ? '⏳ Pending'
                        : volunteer.status === 'APPROVED'
                          ? '✓ Approved'
                          : '✗ Suspended'}
                  </Badge>
                  {volunteer.successRate && volunteer.successRate >= 90 && (
                    <Badge
                      variant="outline"
                      className="text-xs border-purple-500 text-purple-700"
                    >
                      ⭐ {volunteer.successRate.toFixed(0)}% Success
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {volunteer.status === 'PENDING' && (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={(event) => {
                        event.stopPropagation();
                        router.push(
                          `/dashboard/admin/rescuers/${volunteer.id}`,
                        );
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredVolunteers.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No rescuers found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? 'Try adjusting your search'
              : 'No rescuers registered yet'}
          </p>
        </Card>
      )}

      <DashboardPagination
        page={currentPage}
        pageSize={pageSize}
        totalCount={data?.volunteers?.totalCount || 0}
        pageInfo={data?.volunteers?.pageInfo}
        onPageChange={setCurrentPage}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setCurrentPage(1);
        }}
        alwaysShow
      />
    </div>
  );
}
