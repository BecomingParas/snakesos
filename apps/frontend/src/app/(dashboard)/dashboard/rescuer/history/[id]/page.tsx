'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock3,
  FileText,
  MapPin,
  ShieldCheck,
  Star,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRescueRequestQuery } from '@/lib/graphql/hooks/rescue.hooks';

interface PageProps {
  params: Promise<{ id: string }>;
}

const OUTCOME_LABELS: Record<string, string> = {
  RESCUED_RELOCATED: 'Rescued & Relocated',
  ALREADY_GONE: 'Already Gone',
  FALSE_ALARM: 'False Alarm',
  NO_SNAKE_FOUND: 'No Snake Found',
  DECEASED: 'Snake Deceased',
};

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString() : 'Not recorded';
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

export default function RescuerHistoryDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = useRescueRequestQuery({
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });
  const rescue = data?.rescueRequest;

  if (loading && !rescue) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Clock3 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !rescue) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <Card className="p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 text-xl font-semibold">
            Rescue record unavailable
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error?.message || 'This rescue record could not be found.'}
          </p>
          <Button
            className="mt-6"
            onClick={() => router.push('/dashboard/rescuer/history')}
          >
            Back to history
          </Button>
        </Card>
      </div>
    );
  }

  const completed = rescue.status === 'COMPLETED';
  const StatusIcon = completed ? CheckCircle : XCircle;
  const statusLabel = completed ? 'Completed' : 'Cancelled';
  const outcome = rescue.outcome
    ? OUTCOME_LABELS[rescue.outcome] || rescue.outcome
    : 'Not recorded';
  const review = rescue.rating;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/rescuer/history')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to history
        </Button>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Rescue history</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              {rescue.referenceNumber}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {rescue.address}, {rescue.municipality}
            </p>
          </div>
          <Badge
            className={
              completed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }
          >
            <StatusIcon className="mr-1 h-4 w-4" />
            {statusLabel}
          </Badge>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="font-semibold">Rescue summary</h2>
                  <p className="text-sm text-muted-foreground">
                    Outcome and field report
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Detail label="Outcome" value={outcome} />
                <Detail label="Priority" value={rescue.priority} />
                <Detail
                  label="Duration"
                  value={
                    rescue.rescueDuration
                      ? `${rescue.rescueDuration} minutes`
                      : 'Not recorded'
                  }
                />
                <Detail
                  label="Completed"
                  value={formatDate(rescue.completedAt || rescue.updatedAt)}
                />
              </div>
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Field report
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {rescue.rescueReport || 'No report was added.'}
                </p>
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="font-semibold">Snake information</h2>
                  <p className="text-sm text-muted-foreground">
                    Details captured during the rescue
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Detail
                  label="Description"
                  value={rescue.snakeDescription || 'Not recorded'}
                />
                <Detail
                  label="Size"
                  value={rescue.snakeSize || 'Not recorded'}
                />
                <Detail
                  label="Color"
                  value={rescue.snakeColor || 'Not recorded'}
                />
                <Detail
                  label="Species"
                  value={rescue.species?.name || 'Not identified'}
                />
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <Star className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="font-semibold">Citizen review</h2>
                  <p className="text-sm text-muted-foreground">
                    Feedback received for this rescue
                  </p>
                </div>
              </div>
              {review ? (
                <div className="mt-6 space-y-4">
                  <div
                    className="flex items-center gap-1"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${index < review.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold">
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {review.feedback || 'No written feedback was provided.'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Reviewed {formatDate(review.createdAt)}
                  </p>
                </div>
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">
                  The citizen has not submitted a review for this rescue yet.
                </p>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5 sm:p-6">
              <h2 className="font-semibold">Rescue timeline</h2>
              <div className="mt-5 space-y-4">
                <Detail
                  label="Request submitted"
                  value={formatDate(rescue.createdAt)}
                />
                <Detail
                  label="Accepted"
                  value={formatDate(rescue.acceptedAt)}
                />
                <Detail
                  label="Rescue started"
                  value={formatDate(rescue.startedAt)}
                />
                <Detail
                  label="Rescue completed"
                  value={formatDate(rescue.completedAt)}
                />
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Location</h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {rescue.address}, {rescue.municipality}
                {rescue.ward ? `, Ward ${rescue.ward}` : ''}
              </p>
              {rescue.landmark && (
                <p className="mt-2 text-sm">Landmark: {rescue.landmark}</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
