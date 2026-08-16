'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Search, 
  UserCheck, 
  Shield,
  Mail,
  Phone,
  Calendar,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { useUsersQuery, useUpdateUserStatusMutation } from '@/lib/graphql/hooks/user.hooks'
import { toast } from 'sonner'

/**
 * Admin Users Management Page - NOW WITH GRAPHQL INTEGRATION ✅
 */

const roleColors = {
  CITIZEN: 'bg-blue-500',
  VOLUNTEER: 'bg-green-500',
  VERIFIED_RESCUER: 'bg-purple-500',
  DISTRICT_COORDINATOR: 'bg-orange-500',
  ADMIN: 'bg-red-500',
  SUPER_ADMIN: 'bg-red-700',
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Fetch users
  const { data, loading, error, refetch } = useUsersQuery({
    variables: {
      pagination: { limit: 200, page: 1 },
      filter: {
        role: roleFilter !== 'all' ? roleFilter : undefined,
        isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
        search: searchTerm || undefined,
      }
    },
    fetchPolicy: 'cache-and-network',
  })

  // Update user status mutation
  const [updateStatus, { loading: updatingStatus }] = useUpdateUserStatusMutation({
    onCompleted: () => {
      toast.success('User status updated successfully!')
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`)
    },
  })


  const users = data?.users?.edges?.map(e => e.node) || []

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      citizens: users.filter(u => u.role === 'CITIZEN').length,
      rescuers: users.filter(u => u.role === 'VERIFIED_RESCUER' || u.role === 'VOLUNTEER').length,
    }
  }, [users])

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    await updateStatus({
      variables: {
        input: {
          userId,
          isActive: !currentStatus,
        }
      }
    })
  }

  if (error) {
    toast.error(`Failed to load users: ${error.message}`)
  }

  const isUpdating = updatingStatus

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="h-8 w-8" />
            Users Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all users and their permissions
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
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Users</p>
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
              <p className="text-xs text-gray-600 dark:text-gray-400">Active Users</p>
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
              <p className="text-xs text-gray-600 dark:text-gray-400">Citizens</p>
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
              <p className="text-xs text-gray-600 dark:text-gray-400">Rescuers</p>
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

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Roles</option>
            <option value="CITIZEN">Citizens</option>
            <option value="VOLUNTEER">Volunteers</option>
            <option value="VERIFIED_RESCUER">Verified Rescuers</option>
            <option value="DISTRICT_COORDINATOR">Coordinators</option>
            <option value="ADMIN">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr 
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
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
                          <span className="truncate max-w-[200px]">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${roleColors[user.role as keyof typeof roleColors] || 'bg-gray-500'} text-white`}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <Badge className={user.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {user.isEmailVerified && (
                          <Badge variant="outline" className="ml-2 text-xs border-green-500 text-green-700">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : 
                           user.isActive ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        </Button>
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
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search or filters' : 'No users registered yet'}
          </p>
        </Card>
      )}
    </div>
  )
}
