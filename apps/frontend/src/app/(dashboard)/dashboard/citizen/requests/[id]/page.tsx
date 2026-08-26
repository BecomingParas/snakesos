'use client';

import { useEffect, useRef, useState } from 'react';
import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  Circle,
  AlertCircle,
  XCircle,
  MessageCircle,
  Navigation,
  CreditCard,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PaymentMethod, PaymentMethodSelector } from '@/components/payment';
import { cn } from '@/lib/utils';
import {
  useRescueRequestQuery,
  useCancelRescueMutation,
} from '@/lib/graphql/hooks/rescue.hooks';
import { toast } from 'sonner';
import {
  useMyRescuePaymentIntent,
  useStartPayment,
} from '@/lib/graphql/hooks/finance.hooks';
import { useRateVolunteerMutation } from '@/lib/graphql/hooks/volunteer.hooks';

/**
 * Rescue Request Tracking Page
 * Shows complete status of a rescue request with:
 * - Visual timeline
 * - Rescuer information (when assigned)
 * - Real-time status updates
 * - Map (when active)
 * - Actions (cancel, contact)
 */

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-500',
    icon: Clock,
    description: 'Your request is being reviewed',
  },
  ASSIGNED: {
    label: 'Assigned',
    color: 'bg-blue-500',
    icon: User,
    description: 'A rescuer has been assigned',
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'bg-green-500',
    icon: CheckCircle,
    description: 'Rescuer is on the way',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'bg-purple-500',
    icon: Navigation,
    description: 'Rescue operation underway',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-green-600',
    icon: CheckCircle,
    description: 'Rescue completed successfully',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-500',
    icon: XCircle,
    description: 'Request was cancelled',
  },
};

export default function RequestTrackingPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  // Fetch rescue request with real-time polling
  const { data, loading, error, refetch } = useRescueRequestQuery({
    variables: { id },
    pollInterval: 5000, // Poll every 5 seconds for real-time updates
    fetchPolicy: 'cache-and-network',
  });
  const { data: paymentIntentData, refetch: refetchPaymentIntent } =
    useMyRescuePaymentIntent(id);
  const [startPayment] = useStartPayment();
  const searchParams = useSearchParams();

  // Cancel mutation
  const [cancelRescue, { loading: cancelling }] = useCancelRescueMutation({
    onCompleted: () => {
      toast.success('Rescue request cancelled');
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to cancel: ${error.message}`);
    },
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingDimensions, setRatingDimensions] = useState({
    responseSpeed: 0,
    professionalism: 0,
    communication: 0,
    safetyHandling: 0,
  });
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [rateVolunteer, { loading: submittingRating }] =
    useRateVolunteerMutation({
      onCompleted: () => {
        toast.success('Your rating was saved');
        void refetch();
      },
      onError: (ratingError) => toast.error(ratingError.message),
    });
  const paymentIntent = paymentIntentData?.myRescuePaymentIntent;
  const handledReturnStatus = useRef<string | undefined>(undefined);
  const returnedFromStripe =
    searchParams.get('payment') === 'complete' &&
    Boolean(searchParams.get('session_id'));

  useEffect(() => {
    const savedRating = data?.rescueRequest?.rating;
    if (savedRating && selectedRating === 0) {
      setSelectedRating(savedRating.rating);
      setRatingFeedback(savedRating.feedback || '');
    }
  }, [data, selectedRating]);

  useEffect(() => {
    if (!returnedFromStripe) return;

    // The Stripe redirect only means checkout has returned to the browser.
    // The webhook is authoritative, so this is a read-only revalidation.
    void Promise.all([refetch(), refetchPaymentIntent()]);
  }, [refetch, refetchPaymentIntent, returnedFromStripe]);

  useEffect(() => {
    if (!returnedFromStripe || !paymentIntent) return;

    const status = paymentIntent.status;
    if (handledReturnStatus.current === status) return;
    handledReturnStatus.current = status;

    if (status === 'SUCCEEDED') {
      setProcessingPayment(false);
      toast.success('Payment completed successfully');
      window.history.replaceState({}, '', window.location.pathname);
      if (window.opener && window.opener !== window) {
        window.opener.focus();
        window.setTimeout(() => window.close(), 1200);
      }
      return;
    }

    if (['FAILED', 'CANCELLED'].includes(status)) {
      setProcessingPayment(false);
      toast.error('Payment was not completed. No charge was recorded.');
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    toast.message(
      'Payment received. Waiting for secure confirmation from Stripe…',
    );
  }, [paymentIntent, returnedFromStripe]);

  useEffect(() => {
    if (
      ['SUCCEEDED', 'FAILED', 'CANCELLED'].includes(paymentIntent?.status || '')
    ) {
      setProcessingPayment(false);
    }
  }, [paymentIntent?.status]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading rescue details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-center mb-2">
            Error Loading Rescue
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            {error.message}
          </p>
          <Button onClick={() => router.back()} className="w-full">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const rescue = data?.rescueRequest;

  if (!rescue) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-center mb-2">
            Rescue Not Found
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            The rescue request you're looking for doesn't exist or you don't
            have permission to view it.
          </p>
          <Button
            onClick={() => router.push('/dashboard/citizen')}
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // TODO: Replace mockRescue with rescue from GraphQL
  // For now, we'll use the GraphQL data
  const statusConfig =
    STATUS_CONFIG[rescue.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusConfig.icon;

  const canCancel = ['PENDING', 'ASSIGNED'].includes(rescue.status);

  const paymentConfirmed = paymentIntent?.status === 'SUCCEEDED';
  const ratingEditWindowMs = 14 * 24 * 60 * 60 * 1000;
  const ratingEditable =
    !rescue.rating ||
    Date.now() - new Date(rescue.rating.createdAt).getTime() <=
      ratingEditWindowMs;

  const timelineSteps = [
    {
      status: 'REQUESTED',
      label: 'Request Submitted',
      completed: true,
      timestamp: rescue.createdAt,
    },
    {
      status: 'ASSIGNED',
      label: 'Rescuer Assigned',
      completed: ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(
        rescue.status,
      ),
      timestamp: rescue.assignedAt,
      detail: rescue.assignedVolunteer?.name,
    },
    {
      status: 'ACCEPTED',
      label: 'On The Way',
      completed: ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(
        rescue.status,
      ),
      timestamp: rescue.acceptedAt,
      active: rescue.status === 'ACCEPTED',
    },
    {
      status: 'IN_PROGRESS',
      label: 'Rescue Started',
      completed: ['IN_PROGRESS', 'COMPLETED'].includes(rescue.status),
      timestamp: rescue.startedAt,
      active: rescue.status === 'IN_PROGRESS',
    },
    {
      status: 'PAYMENT',
      label: 'Payment',
      completed: paymentConfirmed,
      timestamp: paymentConfirmed ? paymentIntent.updatedAt : undefined,
      detail: paymentIntent
        ? `${paymentIntent.currency} ${Number(paymentIntent.amount).toLocaleString()} · ${paymentIntent.status.toLowerCase().replace('_', ' ')}`
        : 'Payment will be available after the rescue is completed',
      active: Boolean(paymentIntent && paymentIntent.status !== 'SUCCEEDED'),
    },
    {
      status: 'COMPLETED',
      label: 'Completed',
      completed: rescue.status === 'COMPLETED',
      timestamp: rescue.completedAt,
    },
  ];

  const handleCancel = async () => {
    await cancelRescue({
      variables: {
        rescueId: id,
        reason: 'Cancelled by citizen',
      },
    });
  };

  const handlePaymentProceed = async () => {
    if (!paymentMethod || !paymentIntent) {
      toast.error('Payment is not available for this rescue yet');
      return;
    }

    const requestedAmount = Number(paymentAmount || paymentIntent.amount);
    if (!Number.isFinite(requestedAmount) || requestedAmount < 1) {
      toast.error('Enter a valid payment amount');
      return;
    }

    setProcessingPayment(true);
    const checkoutWindow = window.open('', '_blank');
    if (!checkoutWindow) {
      toast.error('Please allow pop-ups to open the Stripe payment page');
      setProcessingPayment(false);
      return;
    }
    try {
      const result = await startPayment({
        variables: {
          input: {
            paymentIntentId: paymentIntent.id,
            amount: requestedAmount.toFixed(2),
            returnUrl: `${window.location.origin}/dashboard/citizen/requests/${id}?payment=complete&session_id={CHECKOUT_SESSION_ID}`,
          },
        },
      });
      const checkoutUrl = result.data?.startPayment?.checkoutUrl;
      if (!checkoutUrl) {
        if (result.data?.startPayment?.paymentIntent.status === 'SUCCEEDED') {
          await Promise.all([refetch(), refetchPaymentIntent()]);
          setProcessingPayment(false);
          toast.success('Demo payment completed successfully');
          return;
        }
        throw new Error('Payment provider did not return a checkout URL');
      }
      checkoutWindow.location.href = checkoutUrl;
    } catch (error) {
      checkoutWindow.close();
      toast.error(error instanceof Error ? error.message : 'Payment failed');
      setProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/citizen')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Rescue Request
              </h1>
              <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
                {rescue.referenceNumber}
              </p>
            </div>

            <Badge className={cn('text-white', statusConfig.color)}>
              <StatusIcon className="mr-1 h-4 w-4" />
              {statusConfig.label}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'p-3 rounded-full',
                    statusConfig.color,
                    'text-white',
                  )}
                >
                  <StatusIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {statusConfig.label}
                  </h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {statusConfig.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Rescue Progress</h3>

              <div className="space-y-6">
                {timelineSteps.map((step, index) => (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                          step.completed
                            ? 'bg-green-500 text-white'
                            : step.active
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 text-gray-500 dark:bg-gray-700',
                        )}
                      >
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : step.status === 'PAYMENT' ? (
                          <CreditCard className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div
                          className={cn(
                            'w-0.5 h-12 transition-colors',
                            step.completed
                              ? 'bg-green-500'
                              : 'bg-gray-200 dark:bg-gray-700',
                          )}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-4">
                      <p className="font-semibold">{step.label}</p>
                      {step.detail && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {step.detail}
                        </p>
                      )}
                      {step.timestamp && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(step.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Snake Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Snake Information</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Description
                  </p>
                  <p className="mt-1">{rescue.snakeDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Size</p>
                    <p className="mt-1">{rescue.snakeSize}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Color</p>
                    <p className="mt-1">{rescue.snakeColor}</p>
                  </div>
                </div>

                {rescue.snakeImages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Photos
                    </p>
                    <div className="flex gap-2">
                      {rescue.snakeImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="h-20 w-20 rounded bg-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Location</h3>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p>{rescue.address}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ward {rescue.ward}, {rescue.municipality}
                    </p>
                    {rescue.landmark && (
                      <p className="text-sm text-gray-500">
                        Near: {rescue.landmark}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-4 h-48 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <p className="text-gray-500">Map View</p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rescuer Card */}
            {rescue.assignedVolunteer && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your Rescuer</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {rescue.assignedVolunteer.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {rescue.assignedVolunteer.experience} Rescuer
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience</span>
                      <span className="font-medium">
                        {rescue.assignedVolunteer.totalRescues} rescues
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating</span>
                      <span className="font-medium">
                        ⭐ {rescue.assignedVolunteer.rating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" variant="default">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Rescuer
                    </Button>
                    <Button className="w-full" variant="outline">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {rescue.status === 'COMPLETED' &&
              rescue.assignedVolunteer &&
              ratingEditable && (
                <Card className="border-primary/30 bg-primary/5 p-6">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        {rescue.rating
                          ? 'Update your rating'
                          : 'Rate your rescuer'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {rescue.rating
                          ? 'You can edit your rating within 14 days.'
                          : 'How was your rescue experience?'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-1" aria-label="Choose a rating">
                    {Array.from({ length: 5 }, (_, index) => {
                      const value = index + 1;
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-label={`${value} star${value === 1 ? '' : 's'}`}
                          aria-pressed={selectedRating === value}
                          onClick={() => setSelectedRating(value)}
                          className="rounded-md p-1 transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <Star
                            className={cn(
                              'h-7 w-7',
                              value <= selectedRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground',
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 space-y-2">
                    {[
                      ['responseSpeed', 'Response speed'],
                      ['professionalism', 'Professionalism'],
                      ['communication', 'Communication'],
                      ['safetyHandling', 'Safety handling'],
                    ].map(([key, label]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="text-sm text-muted-foreground">
                          {label}
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }, (_, index) => {
                            const value = index + 1;
                            const selected =
                              ratingDimensions[
                                key as keyof typeof ratingDimensions
                              ];
                            return (
                              <button
                                key={value}
                                type="button"
                                aria-label={`${label}: ${value} star${value === 1 ? '' : 's'}`}
                                aria-pressed={selected === value}
                                onClick={() =>
                                  setRatingDimensions((current) => ({
                                    ...current,
                                    [key]: value,
                                  }))
                                }
                                className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                <Star
                                  className={cn(
                                    'h-4 w-4',
                                    value <= selected
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-muted-foreground',
                                  )}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <textarea
                    value={ratingFeedback}
                    onChange={(event) => setRatingFeedback(event.target.value)}
                    placeholder="Optional feedback"
                    rows={3}
                    className="mt-4 w-full resize-none rounded-lg border border-border/70 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <Button
                    type="button"
                    className="mt-3 w-full"
                    disabled={selectedRating === 0 || submittingRating}
                    onClick={() => {
                      void rateVolunteer({
                        variables: {
                          volunteerId: rescue.assignedVolunteer!.id,
                          rescueId: id,
                          rating: selectedRating,
                          feedback: ratingFeedback.trim() || undefined,
                          responseSpeed:
                            ratingDimensions.responseSpeed || undefined,
                          professionalism:
                            ratingDimensions.professionalism || undefined,
                          communication:
                            ratingDimensions.communication || undefined,
                          safetyHandling:
                            ratingDimensions.safetyHandling || undefined,
                        },
                      });
                    }}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {submittingRating
                      ? 'Saving...'
                      : rescue.rating
                        ? 'Update Rating'
                        : 'Submit Rating'}
                  </Button>
                </Card>
              )}

            {rescue.status === 'COMPLETED' &&
              rescue.rating &&
              !ratingEditable && (
                <Card className="p-6">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <div>
                      <h3 className="font-semibold">Your rating</h3>
                      <p className="text-sm text-muted-foreground">
                        {rescue.rating.rating}/5 submitted on{' '}
                        {new Date(rescue.rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {rescue.rating.feedback && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      “{rescue.rating.feedback}”
                    </p>
                  )}
                </Card>
              )}

            {/* Payment */}
            <Card className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/20">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Support This Rescue</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-sm font-semibold text-muted-foreground">
                  Payment Amount (NPR)
                </p>
                {paymentIntent ? (
                  <>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        NPR
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={paymentAmount || paymentIntent.amount}
                        onChange={(event) =>
                          setPaymentAmount(event.target.value)
                        }
                        className="w-full rounded-lg border border-border/70 bg-background px-4 py-3 pl-14 text-2xl font-bold text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {[100, 500, 1000, 2000, 5000].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setPaymentAmount(String(amount))}
                          className="rounded-lg border border-border/70 px-2 py-2 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
                        >
                          NPR {amount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border border-border/70 bg-background px-4 py-3">
                    <p className="text-2xl font-bold text-primary">
                      {rescue.status === 'ACCEPTED'
                        ? 'Waiting for rescuer'
                        : 'Preparing payment'}
                    </p>
                  </div>
                )}
              </div>
              {paymentConfirmed ? (
                <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-200">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle className="h-4 w-4" />
                    Payment completed
                  </div>
                  <p className="mt-1">
                    Stripe verification is complete. Thank you for supporting
                    this rescue.
                  </p>
                </div>
              ) : paymentIntent ? (
                <>
                  <PaymentMethodSelector
                    selectedMethod={paymentMethod}
                    onSelect={setPaymentMethod}
                  />
                  <Button
                    type="button"
                    onClick={handlePaymentProceed}
                    disabled={!paymentMethod || processingPayment}
                    className="mt-4 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <CreditCard className="h-4 w-4" />
                    {processingPayment ? 'Processing...' : 'Proceed to Payment'}
                  </Button>
                </>
              ) : (
                <div className="rounded-md border border-border/70 bg-secondary/40 p-3 text-sm text-gray-600 dark:text-gray-300">
                  The rescuer must click <strong>Start Rescue</strong> first.
                  Payment options will appear here automatically after that.
                </div>
              )}
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>

              <div className="space-y-2">
                {canCancel && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleCancel}
                    disabled={cancelling}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {cancelling ? 'Cancelling...' : 'Cancel Request'}
                  </Button>
                )}

                <Button variant="outline" className="w-full">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="p-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <h3 className="text-lg font-semibold mb-2 text-red-900 dark:text-red-100">
                Emergency?
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                If this is a medical emergency, call immediately
              </p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Phone className="mr-2 h-4 w-4" />
                Call Emergency: 102
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
