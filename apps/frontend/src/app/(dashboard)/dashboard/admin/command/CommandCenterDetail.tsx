'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Phone,
  ChevronLeft,
  Loader2,
  Map as MapIcon,
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
    import('@/components/map/RescueMap').then((mod) => ({
      default: mod.RescueMap,
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
    STATUS_CONFIG[rescue.status as keyof typeof STATUS_CONFIG];
  const priorityConfig =
    PRIORITY_CONFIG[rescue.priority as keyof typeof PRIORITY_CONFIG];

  // Detect if actual mobile device (not just small screen)
  const isMobileDevice =
    typeof navigator !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

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
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">{rescue.referenceNumber}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Status & Priority */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn('text-white', statusConfig.color)}>
              {statusConfig.label}
            </Badge>
            <Badge className={cn('text-white', priorityConfig.color)}>
              {priorityConfig.label}
            </Badge>
            {rescue.isEmergency && (
              <Badge variant="destructive" className="animate-pulse">
                EMERGENCY
              </Badge>
            )}
          </div>

          {/* Location */}
          <Card className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Location
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMapSheet(true)}
              >
                <MapIcon className="h-4 w-4 mr-1" />
                View Map
              </Button>
            </div>
            <p className="text-sm mb-1">{rescue.address}</p>
            <p className="text-sm text-muted-foreground">
              Ward {rescue.ward}, {rescue.municipality}
            </p>
            {rescue.landmark && (
              <p className="text-xs text-muted-foreground mt-2">
                📍 Landmark: {rescue.landmark}
              </p>
            )}
            {rescue.distance !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">
                {rescue.distance} km away
              </p>
            )}
          </Card>

          {/* Snake Info */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2">🐍 Snake Information</h3>
            <div className="space-y-2 text-sm">
              <p>{rescue.snakeDescription || 'No description provided'}</p>
              {rescue.snakeSize && (
                <p className="text-muted-foreground">
                  Size: {rescue.snakeSize}
                </p>
              )}
              {rescue.snakeColor && (
                <p className="text-muted-foreground">
                  Color: {rescue.snakeColor}
                </p>
              )}
            </div>
          </Card>

          {/* Citizen Contact */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Citizen
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">
                  {rescue.user?.name || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {rescue.user?.phone || 'N/A'}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCallCitizen}
              >
                <Phone className="mr-2 h-4 w-4" />
                {isMobileDevice ? 'Call Citizen' : 'WhatsApp Citizen'}
              </Button>
            </div>
          </Card>

          {/* Assigned Rescuer */}
          {rescue.assignedVolunteer && (
            <Card className="p-4 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
              <h3 className="font-semibold mb-2">👨‍🚒 Assigned Rescuer</h3>
              <p className="text-sm font-medium">
                {rescue.assignedVolunteer.name}
              </p>
              {rescue.acceptedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Accepted: {new Date(rescue.acceptedAt).toLocaleTimeString()}
                </p>
              )}
            </Card>
          )}

          {/* Timeline */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(rescue.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {rescue.assignedAt && (
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Assigned</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(rescue.assignedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {rescue.acceptedAt && (
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Accepted</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(rescue.acceptedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="sticky bottom-0 bg-background border-t p-4 space-y-2">
        {rescue.status === 'PENDING' && (
          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowAssignSheet(true)}
          >
            <User className="mr-2 h-5 w-5" />
            Assign Rescuer
          </Button>
        )}

        {['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(rescue.status) && (
          <Button
            className="w-full"
            size="lg"
            variant="outline"
            onClick={() => setShowAssignSheet(true)}
          >
            <User className="mr-2 h-5 w-5" />
            Reassign Rescuer
          </Button>
        )}

        {!['COMPLETED', 'CANCELLED'].includes(rescue.status) && (
          <Button
            variant="destructive"
            className="w-full"
            size="lg"
            onClick={() => setShowCancelDialog(true)}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel Rescue'}
          </Button>
        )}
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
