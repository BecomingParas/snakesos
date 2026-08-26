'use client';

import { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useResponsive } from '@/hooks/use-responsive';
import { CommandCenterMobile } from './CommandCenterMobile';
import { CommandCenterDetail } from './CommandCenterDetail';
import {
  MapPin,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Phone,
  Loader2,
  Navigation,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { cn } from '@/lib/utils';
import {
  useActiveRescuesQuery,
  useAssignRescueMutation,
  useCancelRescueMutation,
  useAvailableVolunteersQuery,
  type RescueRequest,
} from '@/lib/graphql/hooks/rescue.hooks';
import { toast } from 'sonner';

// Dynamic import to avoid SSR issues
const RescueMap = dynamic(
  () =>
    import('@/components/map/RescueMap').then((mod) => ({
      default: mod.RescueMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-[hsl(210,8%,15%)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading map...</p>
        </div>
      </div>
    ),
  },
);

/**
 * Admin Command Center
 *
 * Three-panel layout:
 * LEFT: Request queue with filters
 * CENTER: Live map (placeholder)
 * RIGHT: Selected request details with assign rescuer action
 */

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'bg-amber-500',
    textColor: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  ASSIGNED: {
    label: 'Assigned',
    color: 'bg-blue-500',
    textColor: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'bg-violet-500',
    textColor: 'text-violet-700 dark:text-violet-400',
    dot: 'bg-violet-500',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-emerald-600',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-600',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

const PRIORITY_CONFIG = {
  LOW: { color: 'text-slate-500', dot: 'bg-slate-400' },
  MEDIUM: { color: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  HIGH: { color: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
  CRITICAL: { color: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
};

export default function AdminCommandCenter() {
  const [selectedRescue, setSelectedRescue] = useState<RescueRequest | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<string[]>([
    'PENDING',
    'ASSIGNED',
    'IN_PROGRESS',
  ]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedRescuerId, setSelectedRescuerId] = useState<string | null>(
    null,
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    27.7172, 85.324,
  ]); // Kathmandu default
  const [mapZoom, setMapZoom] = useState(13);
  const { isMobile } = useResponsive();
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  // Fetch active rescues
  const { data, loading, refetch } = useActiveRescuesQuery({
    variables: {
      pagination: { limit: 50, page: 1 },
    },
    pollInterval: 10000, // Real-time updates
    fetchPolicy: 'cache-and-network',
  });

  // Assign rescue mutation
  const [assignRescue, { loading: assigning }] = useAssignRescueMutation({
    onCompleted: () => {
      toast.success('Rescuer assigned successfully!');
      setShowAssignModal(false);
      setSelectedRescuerId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to assign: ${error.message}`);
    },
  });

  // Cancel rescue mutation
  const [cancelRescue, { loading: cancelling }] = useCancelRescueMutation({
    onCompleted: () => {
      toast.success('Rescue cancelled successfully');
      setSelectedRescue(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to cancel: ${error.message}`);
    },
  });

  // Extract rescues from GraphQL
  const allRescues = data?.activeRescues?.edges?.map((e) => e.node) || [];
  const filteredRescues = useMemo(
    () => allRescues.filter((r) => statusFilter.includes(r.status)),
    [allRescues, statusFilter],
  );

  // Fetch available volunteers when modal is open and rescue is selected
  const { data: volunteersData, loading: loadingVolunteers } =
    useAvailableVolunteersQuery({
      skip:
        !showAssignModal ||
        !selectedRescue ||
        !selectedRescue.lat ||
        !selectedRescue.lng,
      variables: {
        input: {
          lat: selectedRescue?.lat || 27.7172,
          lng: selectedRescue?.lng || 85.324,
          limit: 10,
          radiusKm: 50, // 50km radius
        },
      },
    });

  const availableVolunteers = volunteersData?.availableVolunteers || [];

  // Keep the selected rescue synced to the currently visible filter results.
  useEffect(() => {
    if (filteredRescues.length === 0) {
      setSelectedRescue(null);
      return;
    }

    const selectedStillVisible =
      selectedRescue &&
      filteredRescues.some((rescue) => rescue.id === selectedRescue.id);

    if (!selectedStillVisible) {
      setSelectedRescue(filteredRescues[0]);
    }
  }, [filteredRescues, selectedRescue?.id]);

  const handleAssignRescuer = async (rescuerId: string) => {
    if (!selectedRescue) return;

    try {
      await assignRescue({
        variables: {
          input: {
            rescueId: selectedRescue.id,
            volunteerId: rescuerId,
          },
        },
      });
    } catch (error) {
      console.error('Failed to assign rescuer:', error);
    }
  };

  // Handle selecting a rescuer in the modal
  const handleSelectRescuer = (rescuerId: string) => {
    setSelectedRescuerId(rescuerId);
  };

  // Handle submitting the assignment
  const handleSubmitAssignment = () => {
    if (selectedRescuerId) {
      handleAssignRescuer(selectedRescuerId);
    }
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter([status]);
  };

  // Handle rescue selection and map centering
  const handleRescueSelect = (rescue: RescueRequest) => {
    setSelectedRescue(rescue);

    // On mobile, switch to detail view
    if (isMobile) {
      setMobileView('detail');
    }

    // Center map on selected rescue if coordinates are valid
    if (rescue.lat && rescue.lng) {
      setMapCenter([rescue.lat, rescue.lng]);
      setMapZoom(15); // Zoom in on selected rescue
    }
  };

  // Handle back from mobile detail view
  const handleBackToList = () => {
    setMobileView('list');
    setSelectedRescue(null);
  };

  // Handle marker click from map
  const handleMapMarkerClick = (rescueId: string) => {
    const rescue = filteredRescues.find((r) => r.id === rescueId);
    if (rescue) {
      setSelectedRescue(rescue);
    }
  };

  // Handle calling citizen - WhatsApp on web, direct call on mobile device
  const handleCallCitizen = () => {
    if (!selectedRescue?.user?.phone) {
      toast.error('No phone number available');
      return;
    }

    const phone = selectedRescue.user.phone;

    // Detect if actual mobile device (not just small screen)
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    // On mobile device, use direct call
    if (isMobileDevice) {
      window.location.href = `tel:${phone}`;
      return;
    }

    // On web (desktop/laptop), use WhatsApp Web
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello, I'm calling regarding your snake rescue request ${selectedRescue.referenceNumber}. We're here to help!`,
    );
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.location.href = whatsappUrl;
  };

  // Handle cancelling rescue - show confirmation dialog
  const handleCancelRescue = async () => {
    if (!selectedRescue) return;
    setShowCancelDialog(true);
  };

  // Confirm cancel rescue
  const confirmCancelRescue = async () => {
    if (!selectedRescue) return;

    try {
      await cancelRescue({
        variables: {
          rescueId: selectedRescue.id,
          reason: 'Cancelled by admin from command center',
        },
      });
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Failed to cancel rescue:', error);
    }
  };

  const emergencyCount = filteredRescues.filter(
    (rescue) => rescue.isEmergency,
  ).length;
  const activeCount = filteredRescues.filter((rescue) =>
    ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(rescue.status),
  ).length;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden bg-slate-50 dark:bg-[#0c1117]">
      {loading && !data ? (
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              Loading command center...
            </p>
          </div>
        </div>
      ) : isMobile ? (
        /* MOBILE VIEW */
        mobileView === 'list' ? (
          <CommandCenterMobile
            rescues={filteredRescues}
            loading={loading}
            onRescueSelect={handleRescueSelect}
          />
        ) : selectedRescue ? (
          <CommandCenterDetail
            rescue={selectedRescue}
            onBack={handleBackToList}
            onRefetch={refetch}
          />
        ) : null
      ) : (
        /* DESKTOP VIEW */
        <>
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 backdrop-blur-xl dark:border-white/8 dark:bg-[#11161c]/95">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-sm font-bold text-slate-950 dark:text-white">
                    Rescue Command Center
                  </h1>
                  <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 sm:inline-flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{' '}
                    Live
                  </span>
                </div>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                  Monitor and coordinate active snake rescues
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/3 md:flex">
                <Radio className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Active
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {activeCount}
                </span>
              </div>
              {emergencyCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {emergencyCount}
                </div>
              )}
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </header>
          {/* Three-column grid layout: Queue | Map | Details */}
          <div
            className="grid min-h-0 flex-1 overflow-hidden"
            style={{
              gridTemplateColumns: 'minmax(320px, 380px) minmax(0, 1fr) 384px',
            }}
          >
            {/* LEFT PANEL: Request Queue - ALWAYS VISIBLE */}
            <aside className="flex min-w-0 flex-col overflow-hidden border-r border-slate-200/80 bg-white dark:border-white/8 dark:bg-[#11161c]">
              {/* Header */}
              <div className="shrink-0 border-b border-slate-200/70 px-4 py-3 dark:border-white/6">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Rescue Queue
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {allRescues.length} active
                  </span>
                </div>

                {/* Filters */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-1.5">
                    {['PENDING', 'ASSIGNED', 'IN_PROGRESS'].map((status) => {
                      const config =
                        STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                      return (
                        <button
                          key={status}
                          onClick={() => toggleStatusFilter(status)}
                          className={cn(
                            'rounded-lg border px-2 py-2 text-left text-[10px] font-semibold transition-all',
                            statusFilter.includes(status)
                              ? 'border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/4'
                              : 'border-transparent bg-slate-100/60 dark:bg-white/2',
                          )}
                        >
                          <span className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'h-1.5 w-1.5 rounded-full',
                                config.dot,
                              )}
                            />
                            {config.label}
                          </span>
                          <span className="mt-1 block text-sm font-bold text-slate-900 dark:text-white">
                            {
                              allRescues.filter(
                                (rescue) => rescue.status === status,
                              ).length
                            }
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Request List */}
              <div className="flex-1 overflow-y-auto">
                {filteredRescues.map((rescue) => {
                  const statusConfig =
                    STATUS_CONFIG[
                      rescue.status as keyof typeof STATUS_CONFIG
                    ] ?? STATUS_CONFIG.PENDING;
                  const priorityConfig =
                    PRIORITY_CONFIG[
                      rescue.priority as keyof typeof PRIORITY_CONFIG
                    ] ?? PRIORITY_CONFIG.LOW;
                  const isSelected = selectedRescue?.id === rescue.id;

                  return (
                    <button
                      type="button"
                      key={rescue.id}
                      onClick={() => handleRescueSelect(rescue)}
                      className={cn(
                        'group relative w-full border-b border-slate-200/70 px-4 py-3.5 text-left transition-colors duration-150 dark:border-white/6',
                        isSelected
                          ? 'bg-primary/6'
                          : 'hover:bg-slate-50 dark:hover:bg-white/3',
                      )}
                    >
                      {isSelected && (
                        <span className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                      )}
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                'truncate text-sm font-bold',
                                isSelected
                                  ? 'text-primary'
                                  : 'text-slate-900 dark:text-white',
                              )}
                            >
                              {rescue.referenceNumber}
                            </span>
                            {rescue.isEmergency && (
                              <span className="shrink-0 text-[10px] font-bold uppercase text-red-600 dark:text-red-400">
                                Emergency
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                            <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {rescue.address}
                            </span>
                          </div>
                          <div className="mt-2.5 flex items-center gap-3 text-[11px]">
                            <span
                              className={cn(
                                'flex items-center gap-1 font-semibold',
                                statusConfig.textColor,
                              )}
                            >
                              {statusConfig.label}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="h-3 w-3" />
                              {Math.max(
                                0,
                                Math.round(
                                  (Date.now() -
                                    new Date(rescue.createdAt).getTime()) /
                                    60000,
                                ),
                              )}
                              m
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Navigation className="h-3 w-3" />
                              {rescue.distance || 0} km
                            </span>
                          </div>
                          {rescue.assignedVolunteer && (
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                              <User className="h-3 w-3" />
                              <span className="truncate">
                                {rescue.assignedVolunteer.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {filteredRescues.length === 0 && (
                  <div className="p-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      No rescues match the filter
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Try changing your filter settings
                    </p>
                  </div>
                )}
              </div>
            </aside>

            {/* CENTER PANEL: Map */}
            <div className="relative overflow-hidden min-w-0">
              {filteredRescues.length === 0 ? (
                <div className="absolute inset-0 bg-slate-50 dark:bg-[hsl(210,8%,15%)] flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
                    <p className="mt-2 text-slate-700 dark:text-slate-400">
                      No Active Rescues
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Map will show rescue locations when requests are active
                    </p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0">
                  <RescueMap
                    rescues={filteredRescues
                      .filter((r: RescueRequest) => {
                        return (
                          typeof r.lat === 'number' &&
                          typeof r.lng === 'number' &&
                          Number.isFinite(r.lat) &&
                          Number.isFinite(r.lng)
                        );
                      })
                      .map((r: RescueRequest) => ({
                        id: r.id,
                        lat: r.lat as number,
                        lng: r.lng as number,
                        address: r.address,
                        municipality: r.municipality,
                        status: r.status,
                        priority: r.priority,
                        name: r.user?.name,
                        phone: r.user?.phone,
                        snakeDescription: r.snakeDescription,
                      }))}
                    rescuers={
                      filteredRescues
                        .filter((r: RescueRequest) => {
                          if (!r.assignedVolunteer) return false;
                          if (
                            !['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(
                              r.status,
                            )
                          )
                            return false;
                          return true;
                        })
                        .map((r: RescueRequest) => {
                          const rescuerLat =
                            typeof r.assignedVolunteer?.currentLat === 'number'
                              ? r.assignedVolunteer.currentLat
                              : typeof r.lat === 'number'
                                ? r.lat
                                : undefined;
                          const rescuerLng =
                            typeof r.assignedVolunteer?.currentLng === 'number'
                              ? r.assignedVolunteer.currentLng
                              : typeof r.lng === 'number'
                                ? r.lng + 0.002
                                : undefined;

                          if (
                            typeof rescuerLat !== 'number' ||
                            typeof rescuerLng !== 'number' ||
                            !Number.isFinite(rescuerLat) ||
                            !Number.isFinite(rescuerLng)
                          ) {
                            return null;
                          }

                          return {
                            id: r.assignedVolunteer.id,
                            name: r.assignedVolunteer.name,
                            lat: rescuerLat,
                            lng: rescuerLng,
                            phone: r.assignedVolunteer.contact,
                            status:
                              r.status === 'IN_PROGRESS'
                                ? 'En Route'
                                : r.status === 'ACCEPTED'
                                  ? 'Accepted'
                                  : 'Assigned',
                          };
                        })
                        .filter(Boolean) as Array<{
                        id: string;
                        name: string;
                        lat: number;
                        lng: number;
                        phone: string | undefined;
                        status: string;
                      }>
                    }
                    center={mapCenter}
                    zoom={mapZoom}
                    selectedRescueId={selectedRescue?.id}
                    onRescueClick={handleMapMarkerClick}
                    showAccuracyCircle={false}
                  />
                </div>
              )}
            </div>

            {/* RIGHT PANEL: Selected Rescue Details */}
            <div className="border-l border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-[hsl(210,8%,15%)]/95 backdrop-blur-2xl overflow-y-auto min-w-0 shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
              {selectedRescue ? (
                <div className="p-6 space-y-5">
                  {/* Header */}
                  <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11161c]">
                    <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                      {selectedRescue.referenceNumber}
                    </h2>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={cn(
                          'text-xs text-white font-medium px-3 py-1 rounded-full shadow-sm',
                          STATUS_CONFIG[
                            selectedRescue.status as keyof typeof STATUS_CONFIG
                          ].color,
                        )}
                      >
                        {
                          STATUS_CONFIG[
                            selectedRescue.status as keyof typeof STATUS_CONFIG
                          ].label
                        }
                      </Badge>
                      <Badge
                        className={cn(
                          'text-xs text-white font-medium px-3 py-1 rounded-full shadow-sm',
                          PRIORITY_CONFIG[
                            selectedRescue.priority as keyof typeof PRIORITY_CONFIG
                          ].color,
                        )}
                      >
                        {selectedRescue.priority}
                      </Badge>
                      {selectedRescue.isEmergency && (
                        <Badge className="rounded-full bg-red-500 text-xs font-medium text-white shadow-sm">
                          Emergency
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <Card className="p-5 bg-white/90 dark:bg-white/5 backdrop-blur-xl border-slate-200/60 dark:border-white/20 shadow-lg">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      Location
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {selectedRescue.address}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Ward {selectedRescue.ward}, {selectedRescue.municipality}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {selectedRescue.distance || 0} km away
                    </p>
                  </Card>

                  {/* Snake Info */}
                  <Card className="p-5 bg-white/90 dark:bg-white/5 backdrop-blur-xl border-slate-200/60 dark:border-white/20 shadow-lg">
                    <h3 className="font-bold mb-3 text-slate-900 dark:text-white">
                      Snake Information
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {selectedRescue.snakeDescription}
                    </p>
                  </Card>

                  {/* Citizen Contact */}
                  <Card className="p-5 bg-white/90 dark:bg-white/5 backdrop-blur-xl border-slate-200/60 dark:border-white/20 shadow-lg">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                      <User className="h-5 w-5 text-emerald-500" />
                      Citizen
                    </h3>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {selectedRescue.user?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedRescue.user?.phone || 'N/A'}
                    </p>
                  </Card>

                  {/* Assigned Rescuer */}
                  {selectedRescue.assignedVolunteer && (
                    <Card className="border-blue-300/60 bg-blue-50 p-5 shadow-sm dark:border-blue-400/20 dark:bg-blue-500/10">
                      <h3 className="font-bold mb-3 text-slate-900 dark:text-white">
                        Assigned Rescuer
                      </h3>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {selectedRescue.assignedVolunteer.name}
                      </p>
                      {selectedRescue.acceptedAt && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          Accepted:{' '}
                          {new Date(
                            selectedRescue.acceptedAt,
                          ).toLocaleTimeString()}
                        </p>
                      )}
                    </Card>
                  )}

                  {/* Timeline */}
                  <Card className="p-5 bg-white/90 dark:bg-white/5 backdrop-blur-xl border-slate-200/60 dark:border-white/20 shadow-lg">
                    <h3 className="font-bold mb-4 text-slate-900 dark:text-white">
                      Timeline
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">
                          Created:{' '}
                          {new Date(selectedRescue.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {selectedRescue.assignedAt && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-500" />
                          <span className="text-slate-600 dark:text-slate-400">
                            Assigned:{' '}
                            {new Date(
                              selectedRescue.assignedAt,
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {selectedRescue.acceptedAt && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-slate-600 dark:text-slate-400">
                            Accepted:{' '}
                            {new Date(
                              selectedRescue.acceptedAt,
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Actions */}
                  <div className="space-y-3">
                    {selectedRescue.status === 'PENDING' && (
                      <Button
                        className="w-full border border-blue-600/20 bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        onClick={() => setShowAssignModal(true)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Assign Rescuer
                      </Button>
                    )}

                    {selectedRescue.status === 'ASSIGNED' && (
                      <Button
                        className="w-full bg-white/90 dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 backdrop-blur-xl border-slate-300/60 dark:border-white/20 shadow-md text-slate-900 dark:text-white"
                        variant="outline"
                        onClick={() => setShowAssignModal(true)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Reassign Rescuer
                      </Button>
                    )}

                    {(selectedRescue.status === 'IN_PROGRESS' ||
                      selectedRescue.status === 'ACCEPTED') && (
                      <Button
                        className="w-full bg-white/90 dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 backdrop-blur-xl border-slate-300/60 dark:border-white/20 shadow-md text-slate-900 dark:text-white"
                        variant="outline"
                        onClick={() => setShowAssignModal(true)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Reassign Rescuer
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="w-full bg-white/90 dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 backdrop-blur-xl border-slate-300/60 dark:border-white/20 shadow-md"
                      onClick={handleCallCitizen}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      {isMobile ? 'Call Citizen' : 'WhatsApp Citizen'}
                    </Button>

                    {selectedRescue.status !== 'COMPLETED' &&
                      selectedRescue.status !== 'CANCELLED' && (
                        <Button
                          variant="destructive"
                          className="w-full border border-red-400/30 bg-red-600 text-white shadow-sm hover:bg-red-700"
                          onClick={handleCancelRescue}
                          disabled={cancelling}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          {cancelling ? 'Cancelling...' : 'Cancel Rescue'}
                        </Button>
                      )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-6 text-center">
                  <div>
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-500/10">
                      <AlertCircle className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="mt-4 font-medium text-slate-700 dark:text-slate-300">
                      Select a rescue from the queue
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      Click on any rescue to view details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Assign Rescuer Modal */}
      <Dialog
        open={showAssignModal}
        onOpenChange={(open) => {
          setShowAssignModal(open);
          if (!open) setSelectedRescuerId(null); // Reset selection when closing
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedRescue?.assignedVolunteer
                ? 'Reassign Rescuer'
                : 'Assign Rescuer'}
            </DialogTitle>
            <DialogDescription>
              Select a rescuer to assign to {selectedRescue?.referenceNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            {loadingVolunteers ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Finding available rescuers...
                  </p>
                </div>
              </div>
            ) : availableVolunteers.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-center">
                <div>
                  <User className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No available rescuers found nearby
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try expanding search radius
                  </p>
                </div>
              </div>
            ) : (
              availableVolunteers.map((item) => {
                const rescuer = item.volunteer;
                const isSelected = selectedRescuerId === rescuer.id;
                return (
                  <Card
                    key={rescuer.id}
                    className={cn(
                      'p-4 cursor-pointer transition-all',
                      isSelected
                        ? 'border-primary border-2 bg-primary/5'
                        : 'hover:border-primary/50 border-transparent',
                    )}
                    onClick={() => handleSelectRescuer(rescuer.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-full',
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-primary/10',
                            )}
                          >
                            <User
                              className={cn(
                                'h-5 w-5',
                                isSelected ? 'text-white' : 'text-primary',
                              )}
                            />
                          </div>
                          <div>
                            <p className="font-semibold">{rescuer.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {rescuer.experience || 'Rescuer'} •{' '}
                              {rescuer.totalRescues || 0} rescues
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-primary ml-2" />
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {item.distance
                                ? `${item.distance.toFixed(1)} km away`
                                : 'N/A'}
                            </span>
                          </div>
                          {rescuer.rating && (
                            <div>⭐ {rescuer.rating.toFixed(1)}</div>
                          )}
                          <div>Rank {item.rankingScore.toFixed(2)}</div>
                          <div>Load: {item.currentlyAssigned}</div>
                        </div>
                      </div>

                      <Badge className="bg-green-500">Available</Badge>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Footer with Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowAssignModal(false);
                setSelectedRescuerId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAssignment}
              disabled={!selectedRescuerId || assigning}
            >
              {assigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {selectedRescue?.assignedVolunteer
                    ? 'Reassigning...'
                    : 'Assigning...'}
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  {selectedRescue?.assignedVolunteer
                    ? 'Reassign Rescuer'
                    : 'Assign Rescuer'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Rescue Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Rescue</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel rescue{' '}
              {selectedRescue?.referenceNumber}?
              <br />
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelRescue}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel Rescue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
