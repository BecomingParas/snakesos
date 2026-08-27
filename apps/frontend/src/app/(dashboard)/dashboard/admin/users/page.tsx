'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Search,
  UserCheck,
  Shield,
  Mail,
  Phone,
  Calendar,
  Loader2,
} from 'lucide-react';
import { useUsersQuery } from '@/lib/graphql/hooks/user.hooks';
import {
  useMyProfileQuery,
  useUpdateUserRoleMutation,
} from '@/lib/graphql/hooks/user.hooks';
import { toast } from 'sonner';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Admin Citizens Management Page - NOW WITH GRAPHQL INTEGRATION ✅
 */

export default function AdminUsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  // Fetch users
  const { data, loading, error } = useUsersQuery({
    variables: {
      pagination: { limit: pageSize, page: currentPage },
      filter: {
        role: roleFilter !== 'all' ? roleFilter : undefined,
        search: searchTerm || undefined,
        isActive:
          statusFilter === 'all' ? undefined : statusFilter === 'active',
      },
    },
    fetchPolicy: 'cache-and-network',
  });
  const { data: profileData } = useMyProfileQuery();
  const [updateUserRole, { loading: updatingRole }] =
    useUpdateUserRoleMutation();

  // Debug logging
  console.log('Users Query Debug:', {
    data,
    loading,
    error,
    users: data?.users,
  });

  const users = data?.users?.edges || [];
  const totalCount = data?.users?.totalCount || 0;
  const userNodes = users;
  const currentUserId = profileData?.me?.id;

  const handleRoleChange = async (userId: string, role: string) => {
    if (userId === currentUserId) {
      toast.error('You cannot change your own role');
      return;
    }
    try {
      await updateUserRole({ variables: { input: { userId, role } } });
      toast.success('User role updated');
    } catch (roleError) {
      toast.error(
        roleError instanceof Error
          ? roleError.message
          : 'Unable to update role',
      );
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: userNodes.length,
      active: userNodes.filter((u: any) => u?.status === 'ACTIVE').length,
      citizens: userNodes.filter((u: any) => u?.role === 'CITIZEN').length,
      rescuers: userNodes.filter(
        (u: any) => u?.role === 'VERIFIED_RESCUER' || u?.role === 'VOLUNTEER',
      ).length,
    };
  }, [userNodes]);

  if (error) {
    toast.error(`Failed to load users: ${error.message}`);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="h-8 w-8" />
            Citizens Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all citizens and their account status
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
                Total Users
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Active Users
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.citizens}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Citizens
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Shield className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.rescuers}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Rescuers
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
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-10 w-full md:w-[168px] border-primary/20 bg-primary/[0.04] font-medium shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/[0.08]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="CITIZEN">Citizens</SelectItem>
              <SelectItem value="VOLUNTEER">Volunteers</SelectItem>
              <SelectItem value="VERIFIED_RESCUER">
                Verified Rescuers
              </SelectItem>
              <SelectItem value="DISTRICT_COORDINATOR">Coordinators</SelectItem>
              <SelectItem value="ADMIN">Admins</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as 'all' | 'active' | 'inactive')
            }
          >
            <SelectTrigger className="h-10 w-full md:w-[140px] border-primary/20 bg-primary/[0.04] font-medium shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/[0.08]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      )}

      {/* Users Table */}
      {!loading && users.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr className="text-left">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Contact</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {userNodes.map((user: any) => (
                  <tr
                    key={user.id}
                    className="cursor-pointer border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    tabIndex={0}
                    onClick={() =>
                      router.push(`/dashboard/admin/users/${user.id}`)
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        router.push(`/dashboard/admin/users/${user.id}`);
                      }
                    }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {user.avatar && (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          )}
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 text-sm">
                        {user.phone && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div onClick={(event) => event.stopPropagation()}>
                        <Select
                          value={user.role}
                          onValueChange={(role) =>
                            void handleRoleChange(user.id, role)
                          }
                          disabled={user.id === currentUserId || updatingRole}
                        >
                          <SelectTrigger
                            aria-label={`Change role for ${user.name}`}
                            className="h-10 w-[168px] border-primary/20 bg-primary/[0.04] font-medium shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/[0.08]"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CITIZEN">Citizen</SelectItem>
                            <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                            <SelectItem value="VERIFIED_RESCUER">
                              Verified Rescuer
                            </SelectItem>
                            <SelectItem value="DISTRICT_COORDINATOR">
                              Coordinator
                            </SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="SUPER_ADMIN">
                              Super Admin
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {user.id === currentUserId && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Current account
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <Badge
                          className={
                            user.status === 'ACTIVE'
                              ? 'bg-green-500'
                              : 'bg-gray-500'
                          }
                        >
                          {user.status}
                        </Badge>
                        {user.emailVerified && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs border-green-500 text-green-700"
                          >
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!loading && users.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No citizens found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? 'Try adjusting your search or filters'
              : 'No citizens registered yet'}
          </p>
        </Card>
      )}

      <DashboardPagination
        page={currentPage}
        pageSize={pageSize}
        totalCount={totalCount}
        pageInfo={data?.users?.pageInfo}
        onPageChange={setCurrentPage}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
