'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Search,
  Download,
  Columns,
  Loader2,
  AlertTriangle,
  UserPlus,
  RefreshCw,
  MapPinOff,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  useAssignRescueMutation,
  useAvailableVolunteersQuery,
} from '@/lib/graphql/hooks/rescue.hooks';
import { toast } from 'sonner';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const DELETE_RESCUE_REQUEST = gql`
  mutation DeleteRescueRequest($id: ID!) {
    deleteRescueRequest(id: $id) {
      success
      message
    }
  }
`;

const GET_RESCUE_REQUESTS = gql`
  query GetRescueRequests(
    $pagination: PaginationInput
    $filter: RescueRequestFilterInput
    $sort: RescueSortInput
  ) {
    rescueRequests(pagination: $pagination, filter: $filter, sort: $sort) {
      edges {
        node {
          id
          referenceNumber
          status
          priority
          isEmergency
          hasBite
          species {
            name
            scientificName
          }
          snakeDescription
          municipality
          ward
          lat
          lng
          user {
            name
          }
          assignedVolunteer {
            name
            contact
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
`;

const STATUS_STYLES = {
  PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  ASSIGNED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  ACCEPTED: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  IN_PROGRESS: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
  CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
  CLOSED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  EXPIRED: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
};

interface RescueRequestNode {
  id: string;
  referenceNumber: string;
  status: string;
  priority: string;
  isEmergency: boolean;
  hasBite: boolean;
  species: {
    name: string;
    scientificName: string;
  };
  snakeDescription: string;
  municipality: string;
  ward: string | null;
  lat: number | null;
  lng: number | null;
  user: {
    name: string;
  };
  assignedVolunteer: {
    name: string;
    contact: string;
  } | null;
  updatedAt: string;
  createdAt: string;
}

interface GetRescueRequestsQuery {
  rescueRequests: {
    edges: Array<{ node: RescueRequestNode }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
    totalCount: number;
  } | null;
}

function hasValidCoords(lat: number | null, lng: number | null): lat is number {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !(lat === 0 && lng === 0)
  );
}

function escapeCsvField(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadCsv(rows: RescueRequestNode[]) {
  const headers = [
    'Reference',
    'Species',
    'Municipality',
    'Ward',
    'Reported by',
    'Rescuer',
    'Priority',
    'Status',
    'Created at',
  ];
  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      [
        r.referenceNumber || r.id,
        r.species?.name || r.snakeDescription || 'Unknown',
        r.municipality || '',
        r.ward || '',
        r.user?.name || '',
        r.assignedVolunteer?.name || '',
        r.priority,
        r.status,
        r.createdAt,
      ]
        .map((v) => escapeCsvField(String(v ?? '')))
        .join(','),
    ),
  ];
  const blob = new Blob([lines.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `rescue-requests-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function RescueRequestsPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [assigningRequest, setAssigningRequest] =
    useState<RescueRequestNode | null>(null);
  const [selectedRequestIds, setSelectedRequestIds] = useState<Set<string>>(
    new Set(),
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteRescue, { loading: deleting }] = useMutation(
    DELETE_RESCUE_REQUEST,
  );
  const [selectedRescuerId, setSelectedRescuerId] = useState<string | null>(
    null,
  );
  const [pageSize, setPageSize] = useState(10);

  // Debounce free-text search before it hits the server
  useEffect(() => {
    const timeout = setTimeout(() => setSearchQuery(searchInput.trim()), 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const { data, loading, error, refetch } = useQuery<GetRescueRequestsQuery>(
    GET_RESCUE_REQUESTS,
    {
      variables: {
        pagination: {
          limit: pageSize,
          page: currentPage,
        },
        // The query declares $filter but it was previously never passed,
        // so search silently only ever matched whatever happened to be on
        // the currently loaded page. Wiring it here makes search actually
        // query across the full dataset. Adjust the field name if your
        // RescueRequestFilterInput uses something other than `search`.
        filter: searchQuery ? { search: searchQuery } : undefined,
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const requestHasLocation = hasValidCoords(
    assigningRequest?.lat ?? null,
    assigningRequest?.lng ?? null,
  );

  const {
    data: volunteersData,
    loading: loadingVolunteers,
    error: volunteersError,
  } = useAvailableVolunteersQuery({
    skip: !assigningRequest || !requestHasLocation,
    variables: {
      input: {
        lat: assigningRequest?.lat ?? 0,
        lng: assigningRequest?.lng ?? 0,
        limit: 10,
        radiusKm: 50,
      },
    },
  });

  const [assignRescue, { loading: assigning }] = useAssignRescueMutation({
    onCompleted: () => {
      toast.success('Rescuer assigned successfully');
      setAssigningRequest(null);
      setSelectedRescuerId(null);
      refetch();
    },
    onError: (mutationError) => {
      toast.error(`Failed to assign rescuer: ${mutationError.message}`);
    },
  });

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const rescueRequests: RescueRequestNode[] = useMemo(
    () => data?.rescueRequests?.edges?.map((edge) => edge.node) ?? [],
    [data],
  );
  const totalCount = data?.rescueRequests?.totalCount ?? 0;
  const allCurrentPageSelected =
    rescueRequests.length > 0 &&
    rescueRequests.every((request) => selectedRequestIds.has(request.id));

  const toggleRequest = (requestId: string, checked: boolean) => {
    setSelectedRequestIds((current) => {
      const next = new Set(current);
      if (checked) next.add(requestId);
      else next.delete(requestId);
      return next;
    });
  };

  const toggleCurrentPage = (checked: boolean) => {
    setSelectedRequestIds((current) => {
      const next = new Set(current);
      rescueRequests.forEach((request) => {
        if (checked) next.add(request.id);
        else next.delete(request.id);
      });
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedRequestIds.size === 0) return;
    try {
      await Promise.all(
        [...selectedRequestIds].map((id) =>
          deleteRescue({ variables: { id } }),
        ),
      );
      toast.success(
        `${selectedRequestIds.size} rescue request${selectedRequestIds.size === 1 ? '' : 's'} deleted`,
      );
      setSelectedRequestIds(new Set());
      setDeleteDialogOpen(false);
      setDeleteConfirmation('');
      await refetch();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : 'Unable to delete selected requests',
      );
    }
  };
  const availableVolunteers = volunteersData?.availableVolunteers ?? [];

  const handleExportCsv = () => {
    const rowsToExport = rescueRequests;

    if (rowsToExport.length === 0) {
      toast.error('No rescue requests to export');
      return;
    }

    downloadCsv(rowsToExport);
    toast.success(
      `Exported ${rowsToExport.length} rescue request${
        rowsToExport.length === 1 ? '' : 's'
      } to CSV`,
    );
  };

  if (error) {
    return (
      <div className="w-full max-w-none px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-xl font-semibold">
            Failed to Load Rescue Requests
          </h2>
          <p className="text-sm text-muted-foreground">
            {error?.message || 'Unable to fetch rescue requests'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb + Title */}
      <div className="space-y-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Rescue requests</h1>
          <p className="text-sm text-muted-foreground">
            Triage incoming reports and assign handlers
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-50 max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reference, species, municipality, reporter..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 bg-card/60 border-border/70"
            aria-label="Search rescue requests"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {selectedRequestIds.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              disabled={deleting}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete selected ({selectedRequestIds.size})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => toast.info('Column customization is coming soon')}
          >
            <Columns className="h-4 w-4" />
            Columns
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportCsv}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">
                Loading rescue requests...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/50 bg-muted/30">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <Checkbox
                        aria-label="Select all rescue requests on this page"
                        checked={allCurrentPageSelected}
                        onCheckedChange={(checked) =>
                          toggleCurrentPage(checked === true)
                        }
                      />
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
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Action
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Age
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {rescueRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-12 text-center text-sm text-muted-foreground"
                      >
                        {searchQuery
                          ? 'No results found for your search'
                          : 'No rescue requests yet'}
                      </td>
                    </tr>
                  ) : (
                    rescueRequests.map((request) => (
                      <tr
                        key={request.id}
                        className={cn(
                          'group cursor-pointer border-l-2 transition-colors',
                          request.isEmergency || request.hasBite
                            ? 'border-l-red-500 bg-red-500/5 hover:bg-red-500/10'
                            : 'border-l-transparent hover:bg-muted/20',
                        )}
                        tabIndex={0}
                        onClick={() =>
                          router.push(`/dashboard/admin/rescues/${request.id}`)
                        }
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            router.push(
                              `/dashboard/admin/rescues/${request.id}`,
                            );
                          }
                        }}
                      >
                        <td
                          className="px-4 py-3"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Checkbox
                            aria-label={`Select ${request.referenceNumber || 'rescue request'}`}
                            checked={selectedRequestIds.has(request.id)}
                            onCheckedChange={(checked) =>
                              toggleRequest(request.id, checked === true)
                            }
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm font-medium">
                            {request.referenceNumber || request.id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">
                            {request.species?.name ||
                              request.snakeDescription ||
                              'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">
                            {request.municipality}
                            {request.ward ? ` - ${request.ward}` : ''}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">
                            {request.user?.name || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {request.assignedVolunteer ? (
                            <div>
                              <span className="block text-sm font-medium">
                                {request.assignedVolunteer.name}
                              </span>
                              {request.assignedVolunteer.contact && (
                                <span className="block text-xs text-muted-foreground">
                                  {request.assignedVolunteer.contact}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wider',
                              STATUS_STYLES[
                                request.status as keyof typeof STATUS_STYLES
                              ] || STATUS_STYLES.PENDING,
                            )}
                          >
                            {request.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {request.status === 'PENDING' &&
                            !request.assignedVolunteer ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setAssigningRequest(request);
                                }}
                              >
                                <UserPlus className="h-4 w-4" />
                                Assign
                              </Button>
                            ) : request.status === 'ASSIGNED' &&
                              request.assignedVolunteer ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setAssigningRequest(request);
                                }}
                              >
                                <RefreshCw className="h-4 w-4" />
                                Reassign
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {request.status === 'ACCEPTED'
                                  ? 'Accepted'
                                  : 'Managed'}
                              </span>
                            )}
                          </div>
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

            <div className="px-6 pb-6">
              <DashboardPagination
                page={currentPage}
                pageSize={pageSize}
                totalCount={totalCount}
                pageInfo={data?.rescueRequests?.pageInfo}
                onPageChange={setCurrentPage}
                onPageSizeChange={(nextPageSize) => {
                  setPageSize(nextPageSize);
                  setCurrentPage(1);
                }}
                alwaysShow
              />
            </div>
          </>
        )}
      </div>

      <Dialog
        open={Boolean(assigningRequest)}
        onOpenChange={(open) => {
          if (!open) {
            setAssigningRequest(null);
            setSelectedRescuerId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {assigningRequest?.assignedVolunteer
                ? 'Reassign rescuer'
                : 'Assign a rescuer'}
            </DialogTitle>
            <DialogDescription>
              Choose an available rescuer for{' '}
              {assigningRequest?.referenceNumber}.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-80 space-y-2 overflow-y-auto py-2">
            {!requestHasLocation ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <MapPinOff className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  This request has no recorded coordinates, so nearby rescuers
                  can&apos;t be found automatically. Confirm the location with
                  the reporter before assigning.
                </p>
              </div>
            ) : loadingVolunteers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : volunteersError ? (
              <p className="py-8 text-center text-sm text-destructive">
                Could not load rescuers: {volunteersError.message}
              </p>
            ) : availableVolunteers.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No available rescuers found near this request.
              </p>
            ) : (
              availableVolunteers.map((item) => {
                const rescuer = item.volunteer;
                const selected = selectedRescuerId === rescuer.id;

                return (
                  <button
                    key={rescuer.id}
                    type="button"
                    onClick={() => setSelectedRescuerId(rescuer.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors',
                      selected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted/50',
                    )}
                  >
                    <span>
                      <span className="block font-medium">{rescuer.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {item.distance != null
                          ? `${item.distance.toFixed(1)} km away`
                          : 'Distance unavailable'}
                        {rescuer.experienceYears
                          ? ` · ${rescuer.experienceYears} years experience`
                          : ''}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.estimatedArrival != null
                        ? `~${item.estimatedArrival} min`
                        : ''}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigningRequest(null)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedRescuerId || assigning || !requestHasLocation}
              onClick={() => {
                if (assigningRequest && selectedRescuerId) {
                  assignRescue({
                    variables: {
                      input: {
                        rescueId: assigningRequest.id,
                        volunteerId: selectedRescuerId,
                      },
                    },
                  });
                }
              }}
            >
              {assigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteConfirmation('');
        }}
      >
        <AlertDialogContent className="border-red-400/50 bg-red-700 text-white shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <AlertDialogTitle>
                  Delete{' '}
                  {selectedRequestIds.size === 1
                    ? 'rescue request'
                    : 'rescue requests'}
                  ?
                </AlertDialogTitle>
                <AlertDialogDescription className="mt-1 text-red-100/80">
                  You selected{' '}
                  <strong className="text-foreground">
                    {selectedRequestIds.size}
                  </strong>{' '}
                  rescue request{selectedRequestIds.size === 1 ? '' : 's'}. They
                  will be removed from the active list.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <div className="rounded-lg border border-red-200/30 bg-red-800/50 p-3">
            <p className="text-sm text-red-100">
              This action cannot be undone. Type <strong>DELETE</strong> to
              continue.
            </p>
            <Input
              value={deleteConfirmation}
              onChange={(event) => setDeleteConfirmation(event.target.value)}
              placeholder="Type DELETE"
              aria-label="Type DELETE to confirm deletion"
              className="mt-3 border-red-200/40 bg-red-900/70 text-white placeholder:text-red-100/60"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-red-200/40 bg-transparent text-red-50 hover:bg-red-900">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteConfirmation !== 'DELETE' || deleting}
              className="bg-red-500 text-white hover:bg-red-400 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => void handleDeleteSelected()}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
