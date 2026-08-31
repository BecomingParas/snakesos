'use client';

import { type ReactNode, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  AlertCircle,
  AlertTriangle,
  MapPin,
  User,
  UserPlus,
  Clock,
  CheckCircle,
  Phone,
  Loader2,
  Map as MapIcon,
  RefreshCw,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  type RescueRequest,
  useAssignRescueMutation,
  useCancelRescueMutation,
  useAvailableVolunteersQuery,
} from '@/lib/graphql/hooks/rescue.hooks';
import { toast } from 'sonner';

// Dynamic import for map
const RescueMap = dynamic(
  () =>
    import('@/components/map/GoogleRescueMap').then((mod) => ({
      default: mod.GoogleRescueMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center bg-slate-100 dark:bg-[hsl(210,8%,15%)] rounded-lg">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    ),
  },
);

interface CommandCenterDetailProps {
  rescue: RescueRequest;
  onBack: () => void;
  onRefetch: () => void;
}

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'bg-yellow-500' },
  ASSIGNED: { label: 'Assigned', color: 'bg-blue-500' },
  ACCEPTED: { label: 'Accepted', color: 'bg-green-500' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-purple-500' },
  COMPLETED: { label: 'Completed', color: 'bg-green-600' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500' },
};

const PRIORITY_CONFIG = {
  LOW: { color: 'bg-gray-500', label: 'Low' },
  MEDIUM: { color: 'bg-yellow-500', label: 'Medium' },
  HIGH: { color: 'bg-orange-500', label: 'High' },
  CRITICAL: { color: 'bg-red-600', label: 'Critical' },
};

const ACTIVE_STATUSES = ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] as const;
const TERMINAL_STATUSES = ['COMPLETED', 'CANCELLED'] as const;

const isMobileDevice = () =>
  typeof navigator !== 'undefined' &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

/**
 * Mobile Rescue Detail View
 * Shows complete rescue information with actions
 */
export function CommandCenterDetail({
  rescue,
  onBack,
  onRefetch,
}: CommandCenterDetailProps) {
  const [showAssignSheet, setShowAssignSheet] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showMapSheet, setShowMapSheet] = useState(false);
  const [selectedRescuerId, setSelectedRescuerId] = useState<string | null>(
    null,
  );

  const statusConfig =
    STATUS_CONFIG[rescue.status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.PENDING;
  const priorityConfig =
    PRIORITY_CONFIG[rescue.priority as keyof typeof PRIORITY_CONFIG] ??
    PRIORITY_CONFIG.LOW;
  const isPending = rescue.status === 'PENDING';
  const isActive = ACTIVE_STATUSES.includes(
    rescue.status as (typeof ACTIVE_STATUSES)[number],
  );
  const isTerminal = TERMINAL_STATUSES.includes(
    rescue.status as (typeof TERMINAL_STATUSES)[number],
  );
  const hasAssignedRescuer = Boolean(rescue.assignedVolunteer);
  const canAssign = isPending;
  const canReassign = isActive && hasAssignedRescuer;
  const canCancel = !isTerminal;

  // Fetch available volunteers when sheet is open
  const { data: volunteersData, loading: loadingVolunteers } =
    useAvailableVolunteersQuery({
      skip: !showAssignSheet || !rescue.lat || !rescue.lng,
      variables: {
        input: {
          lat: rescue.lat || 27.7172,
          lng: rescue.lng || 85.324,
          limit: 10,
          radiusKm: 50,
        },
      },
    });

  const availableVolunteers = volunteersData?.availableVolunteers || [];

  // Mutations
  const [assignRescue, { loading: assigning }] = useAssignRescueMutation({
    onCompleted: () => {
      toast.success('Rescuer assigned successfully!');
      setShowAssignSheet(false);
      setSelectedRescuerId(null);
      onRefetch();
    },
    onError: (error) => {
      toast.error(`Failed to assign: ${error.message}`);
    },
  });

  const [cancelRescue, { loading: cancelling }] = useCancelRescueMutation({
    onCompleted: () => {
      toast.success('Rescue cancelled successfully');
      setShowCancelDialog(false);
      onBack();
      onRefetch();
    },
    onError: (error) => {
      toast.error(`Failed to cancel: ${error.message}`);
    },
  });

  const handleCallCitizen = () => {
    if (!rescue.user?.phone) {
      toast.error('No phone number available');
      return;
    }

    const phone = rescue.user.phone;

    // Detect if actual mobile device (not just small screen)
    if (isMobileDevice()) {
      window.location.href = `tel:${phone}`;
      return;
    }

    // On web (desktop/laptop), use WhatsApp Web
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello, I'm calling regarding your snake rescue request ${rescue.referenceNumber}. We're here to help!`,
    );
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.location.href = whatsappUrl;
  };

  const handleAssignRescuer = async () => {
    if (!selectedRescuerId) return;

    try {
      await assignRescue({
        variables: {
          input: {
            rescueId: rescue.id,
            volunteerId: selectedRescuerId,
          },
        },
      });
    } catch (error) {
      console.error('Failed to assign rescuer:', error);
    }
  };

  const handleCancelRescue = async () => {
    try {
      await cancelRescue({
        variables: {
          rescueId: rescue.id,
          reason: 'Cancelled by admin from mobile command center',
        },
      });
    } catch (error) {
      console.error('Failed to cancel rescue:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/80">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          aria-label="Back to rescue queue"
          title="Back to rescue queue"
          className="shrink-0 px-3"
        >
          <span>Back</span>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Rescue Request
          </p>
          <h1 className="truncate text-sm font-bold">
            {rescue.referenceNumber}
          </h1>
        </div>
        {rescue.isEmergency && (
          <Badge variant="destructive" className="shrink-0 gap-1 animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            Emergency
          </Badge>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          <section
            className={cn(
              'rounded-2xl border p-4 shadow-md',
              rescue.isEmergency
                ? 'border-destructive/30 bg-destructive/5'
                : 'bg-muted/30',
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Current Status
                </p>
                <h2 className="mt-1 text-xl font-bold">{statusConfig.label}</h2>
              </div>
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl',
                  rescue.isEmergency
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-primary/10 text-primary',
                )}
              >
                {rescue.isEmergency ? (
                  <AlertTriangle className="h-6 w-6" />
                ) : (
                  <ShieldCheck className="h-6 w-6" />
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className={cn('text-white', statusConfig.color)}>
                {statusConfig.label}
              </Badge>
              <Badge className={cn('text-white', priorityConfig.color)}>
                {priorityConfig.label} Priority
              </Badge>
              {rescue.isEmergency && (
                <Badge variant="destructive">Emergency</Badge>
              )}
            </div>
          </section>

          {/* Location */}
          <Card className="relative overflow-hidden rounded-2xl shadow-md">
            <div className="p-4">
              <SectionHeader
                icon={<MapPin className="h-4 w-4" />}
                title="Rescue Location"
                description="Incident coordinates"
              />
              <div className="mt-4 rounded-xl bg-muted/50 p-3">
                <p className="text-sm font-medium">{rescue.address}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ward {rescue.ward} · {rescue.municipality}
                </p>
                {rescue.landmark && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Landmark:</span>{' '}
                    {rescue.landmark}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full"
                onClick={() => setShowMapSheet(true)}
              >
                <MapIcon className="mr-2 h-4 w-4" />
                Open Live Map
              </Button>
            </div>
            {rescue.distance !== undefined && (
              <Badge
                variant="secondary"
                className="absolute right-4 top-4"
                aria-label={`${rescue.distance.toFixed(1)} kilometers away`}
              >
                {rescue.distance.toFixed(1)} km
              </Badge>
            )}
          </Card>

          {/* Snake Info */}
          <Card className="rounded-2xl shadow-md">
            <div className="p-4">
              <SectionHeader
                icon={<AlertCircle className="h-4 w-4" />}
                title="Snake Information"
                description="Reported by citizen"
              />
              <div className="mt-4 rounded-xl bg-muted/40 p-3">
                <p className="text-sm leading-6">
                  {rescue.snakeDescription || 'No description provided'}
                </p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <InfoItem
                  label="Estimated Size"
                  value={rescue.snakeSize || 'Not provided'}
                />
                <InfoItem
                  label="Color"
                  value={rescue.snakeColor || 'Not provided'}
                />
              </div>
            </div>
          </Card>

          {/* Citizen Contact */}
          <Card className="rounded-2xl shadow-md">
            <div className="p-4">
              <SectionHeader
                icon={<User className="h-4 w-4" />}
                title="Citizen"
                description="Person who reported the incident"
              />
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {rescue.user?.name || 'Unknown Citizen'}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {rescue.user?.phone || 'No phone number'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={handleCallCitizen}
              >
                <Phone className="mr-2 h-4 w-4" />
                {isMobileDevice() ? 'Call Citizen' : 'Contact via WhatsApp'}
              </Button>
            </div>
          </Card>

          {/* Assigned Rescuer */}
          {rescue.assignedVolunteer && (
            <Card className="rounded-2xl border-blue-500/20 bg-blue-500/5 shadow-md">
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <SectionHeader
                    icon={<ShieldCheck className="h-4 w-4" />}
                    title="Assigned Rescuer"
                    description="Current response unit"
                  />
                  <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    Active
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {rescue.assignedVolunteer.name}
                    </p>
                    {rescue.acceptedAt && (
                      <p className="text-xs text-muted-foreground">
                        Accepted{' '}
                        {new Date(rescue.acceptedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card className="rounded-2xl shadow-md">
            <div className="p-4">
              <SectionHeader
                icon={<Clock className="h-4 w-4" />}
                title="Response Timeline"
                description="Rescue activity history"
              />
              <div className="mt-5 space-y-0">
                {[
                  {
                    label: 'Request Created',
                    date: rescue.createdAt,
                    color: 'bg-primary',
                  },
                  rescue.assignedAt && {
                    label: 'Rescuer Assigned',
                    date: rescue.assignedAt,
                    color: 'bg-blue-500',
                  },
                  rescue.acceptedAt && {
                    label: 'Rescuer Accepted',
                    date: rescue.acceptedAt,
                    color: 'bg-green-500',
                  },
                ]
                  .filter(
                    (
                      event,
                    ): event is {
                      label: string;
                      date: string;
                      color: string;
                    } => Boolean(event),
                  )
                  .map((event, index, events) => (
                    <div key={event.date} className="relative flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            'h-3 w-3 rounded-full ring-4 ring-background',
                            event.color,
                          )}
                        />
                        {index !== events.length - 1 && (
                          <div className="h-full min-h-6 w-px bg-border" />
                        )}
                      </div>
                      <div className="pb-5">
                        <p className="text-sm font-medium">{event.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 border-t bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-lg gap-2">
          {canAssign && (
            <Button
              size="lg"
              className="flex-1"
              onClick={() => setShowAssignSheet(true)}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Assign Rescuer
            </Button>
          )}

          {canReassign && (
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => setShowAssignSheet(true)}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Reassign
            </Button>
          )}

          {canCancel && (
            <Button
              variant="destructive"
              size="lg"
              className="shrink-0"
              onClick={() => setShowCancelDialog(true)}
              disabled={cancelling}
            >
              {cancelling ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <X className="h-5 w-5" />
              )}
              <span className="sr-only">Cancel Rescue</span>
            </Button>
          )}
        </div>
      </div>

      {/* Assign Rescuer Sheet */}
      <Sheet open={showAssignSheet} onOpenChange={setShowAssignSheet}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>
              {rescue.assignedVolunteer ? 'Reassign Rescuer' : 'Assign Rescuer'}
            </SheetTitle>
            <SheetDescription>
              Select a rescuer to{' '}
              {rescue.assignedVolunteer ? 'reassign' : 'assign'} to{' '}
              {rescue.referenceNumber}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-3 overflow-y-auto max-h-[60vh]">
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
                  <p className="text-sm text-muted-foreground">
                    No available rescuers found
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
                      isSelected && 'border-primary border-2 bg-primary/5',
                    )}
                    onClick={() => setSelectedRescuerId(rescuer.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{rescuer.name}</p>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {rescuer.experience || 'Rescuer'} •{' '}
                          {rescuer.totalRescues || 0} rescues
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          {rescuer.rating && (
                            <span>⭐ {rescuer.rating.toFixed(1)}</span>
                          )}
                          <span>Rank {item.rankingScore.toFixed(2)}</span>
                          {item.distance && (
                            <span>📍 {item.distance.toFixed(1)} km</span>
                          )}
                          <span>Load: {item.currentlyAssigned}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowAssignSheet(false);
                setSelectedRescuerId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleAssignRescuer}
              disabled={!selectedRescuerId || assigning}
            >
              {assigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {rescue.assignedVolunteer ? 'Reassigning...' : 'Assigning...'}
                </>
              ) : rescue.assignedVolunteer ? (
                'Reassign'
              ) : (
                'Assign'
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Map Sheet */}
      <Sheet open={showMapSheet} onOpenChange={setShowMapSheet}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Location Map</SheetTitle>
            <SheetDescription>{rescue.address}</SheetDescription>
          </SheetHeader>

          <div className="mt-4 h-[calc(90vh-120px)] rounded-lg overflow-hidden">
            {rescue.lat && rescue.lng ? (
              <RescueMap
                rescues={[
                  {
                    id: rescue.id,
                    lat: rescue.lat,
                    lng: rescue.lng,
                    address: rescue.address,
                    municipality: rescue.municipality,
                    status: rescue.status,
                    priority: rescue.priority,
                    name: rescue.user?.name,
                    phone: rescue.user?.phone,
                    snakeDescription: rescue.snakeDescription,
                  },
                ]}
                rescuers={
                  rescue.assignedVolunteer &&
                  ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(
                    rescue.status,
                  )
                    ? [
                        {
                          id: rescue.assignedVolunteer.id,
                          name: rescue.assignedVolunteer.name,
                          lat:
                            rescue.assignedVolunteer.currentLat || rescue.lat,
                          lng:
                            rescue.assignedVolunteer.currentLng ||
                            rescue.lng + 0.002,
                          phone: rescue.assignedVolunteer.contact,
                          status:
                            rescue.status === 'IN_PROGRESS'
                              ? 'En Route'
                              : 'Assigned',
                        },
                      ]
                    : []
                }
                center={[rescue.lat, rescue.lng]}
                zoom={15}
                selectedRescueId={rescue.id}
                showAccuracyCircle={false}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">
                  No location data available
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Rescue</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel rescue {rescue.referenceNumber}?
              <br />
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelRescue}
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

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
