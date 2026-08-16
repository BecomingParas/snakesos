'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import {
  Search,
  Download,
  Columns,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const GET_RESCUE_REQUESTS = gql`
  query GetRescueRequests($pagination: PaginationInput, $filter: RescueRequestFilterInput, $sort: RescueSortInput) {
    rescueRequests(pagination: $pagination, filter: $filter, sort: $sort) {
      edges {
        node {
          id
          referenceNumber
          status
          priority
          species {
            name
            scientificName
          }
          snakeDescription
          municipality
          ward
          user {
            name
          }
          assignedVolunteer {
            user {
              name
            }
          }
          updatedAt
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`

const STATUS_STYLES = {
  PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  ASSIGNED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  ACCEPTED: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  IN_PROGRESS: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
  CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
  CLOSED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  EXPIRED: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
}

const PRIORITY_STYLES = {
  LOW: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  MEDIUM: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  CRITICAL: 'bg-red-500/10 text-red-500 border-red-500/20',
  EMERGENCY: 'bg-red-600/10 text-red-600 border-red-600/20',
}

interface GetRescueRequestsQuery {
  rescueRequests: {
    edges: Array<{
      node: {
        id: string
        referenceNumber: string
        status: string
        priority: string
        species: {
          name: string
          scientificName: string
        }
        snakeDescription: string
        municipality: string
        ward: string | null
        user: {
          name: string
        }
        assignedVolunteer: {
          user: {
            name: string
          }
        } | null
        updatedAt: string
        createdAt: string
      }
    }>
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string | null
      endCursor: string | null
    }
    totalCount: number
  } | null
}

export default function RescueRequestsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { data, loading, error } = useQuery<GetRescueRequestsQuery>(GET_RESCUE_REQUESTS, {
    variables: {
      pagination: {
        limit: pageSize,
        page: currentPage,
      },
    },
    fetchPolicy: 'cache-and-network',
  })

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const rescueRequests = data?.rescueRequests?.edges?.map((edge: any) => edge.node) || []
  const totalCount = data?.rescueRequests?.totalCount || 0
  const totalPages = Math.ceil(totalCount / pageSize)

  const filteredRequests = rescueRequests.filter((request: any) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      request.referenceNumber?.toLowerCase().includes(query) ||
      request.species?.name?.toLowerCase().includes(query) ||
      request.snakeDescription?.toLowerCase().includes(query) ||
      request.municipality?.toLowerCase().includes(query) ||
      request.user?.name?.toLowerCase().includes(query)
    )
  })

  if (error) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-xl font-semibold">Failed to Load Rescue Requests</h2>
          <p className="text-sm text-muted-foreground">
            {error?.message || 'Unable to fetch rescue requests'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb + Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Dashboard</span>
          <span>/</span>
          <span>Admin</span>
          <span>/</span>
          <span className="text-foreground">Rescue requests</span>
        </div>
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider text-primary">ADMIN</div>
          <h1 className="text-3xl font-bold tracking-tight">Rescue requests</h1>
          <p className="text-sm text-muted-foreground">
            Triage incoming reports and assign handlers
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search this table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card/60 border-border/70"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Columns className="h-4 w-4" />
            Columns
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Loading rescue requests...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/50 bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" className="rounded border-border" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Request
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Species
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      District
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Reported by
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Rescuer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Age
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">
                        {searchQuery ? 'No results found for your search' : 'No rescue requests yet'}
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request: any) => (
                      <tr
                        key={request.id}
                        className="group hover:bg-muted/20 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded border-border" />
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm font-medium">
                            {request.referenceNumber || request.id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">
                            {request.species?.name || request.snakeDescription || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">
                            {request.municipality}
                            {request.ward ? ` - ${request.ward}` : ''}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">{request.user?.name || '—'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">
                            {request.assignedVolunteer?.user?.name || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wider',
                              PRIORITY_STYLES[request.priority as keyof typeof PRIORITY_STYLES] ||
                                PRIORITY_STYLES.LOW
                            )}
                          >
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wider',
                              STATUS_STYLES[request.status as keyof typeof STATUS_STYLES] ||
                                STATUS_STYLES.PENDING
                            )}
                          >
                            {request.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                          {formatTimeAgo(request.updatedAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border/50 px-4 py-3 bg-muted/20">
              <div className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium text-foreground">
                  {Math.min((currentPage - 1) * pageSize + 1, totalCount)}–
                  {Math.min(currentPage * pageSize, totalCount)}
                </span>{' '}
                of <span className="font-medium text-foreground">{totalCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page <span className="font-medium text-foreground">{currentPage}</span> /{' '}
                  <span className="font-medium">{totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
