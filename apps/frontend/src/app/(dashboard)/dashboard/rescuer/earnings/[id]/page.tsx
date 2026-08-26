'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  CreditCard,
  ReceiptText,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  useMyFinance,
  type FinanceStatus,
} from '@/lib/graphql/hooks/finance.hooks';

interface PageProps {
  params: Promise<{ id: string }>;
}

function money(amount: string, currency: string) {
  return `${currency} ${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function statusClass(status: FinanceStatus) {
  if (['PAID', 'SETTLED'].includes(status)) return 'bg-success/15 text-success';
  if (['FAILED', 'CANCELLED', 'REJECTED'].includes(status)) {
    return 'bg-destructive/15 text-destructive';
  }
  return 'bg-warning/15 text-warning';
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

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleString() : 'Not recorded';
}

export default function RescuerEarningsDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = useMyFinance({
    pagination: { page: 1, limit: 100 },
  });
  const settlement = data?.mySettlements?.edges
    .map((edge) => edge.node)
    .find((record) => record.id === id);
  const payout = data?.myPayouts?.edges
    .map((edge) => edge.node)
    .find((record) => record.settlementId === id);

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Clock3 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !settlement) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <Card className="p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 text-xl font-semibold">
            Earning record unavailable
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error?.message || 'This earning record could not be found.'}
          </p>
          <Button
            className="mt-6"
            onClick={() => router.push('/dashboard/rescuer/earnings')}
          >
            Back to earnings
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/rescuer/earnings')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to earnings
        </Button>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-success">Earnings history</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              {money(settlement.amount, settlement.currency)}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Settlement {settlement.id}
            </p>
          </div>
          <Badge className={statusClass(settlement.status)}>
            {settlement.status}
          </Badge>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
                <ReceiptText className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-semibold">Settlement breakdown</h2>
                <p className="text-sm text-muted-foreground">
                  How this earning was calculated
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Detail
                label="Gross amount"
                value={money(settlement.grossAmount, settlement.currency)}
              />
              <Detail
                label="Commission rate"
                value={`${Number(settlement.commissionRate).toLocaleString()}%`}
              />
              <Detail
                label="Commission"
                value={money(settlement.commissionAmount, settlement.currency)}
              />
              <Detail
                label="Your amount"
                value={money(settlement.rescuerAmount, settlement.currency)}
              />
              <Detail
                label="Created"
                value={formatDate(settlement.createdAt)}
              />
              <Detail
                label="Settled"
                value={formatDate(settlement.settledAt)}
              />
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <CircleDollarSign className="h-5 w-5 text-success" />
                <h2 className="font-semibold">Payout status</h2>
              </div>
              <div className="mt-5 space-y-5">
                <Detail
                  label="Payout amount"
                  value={
                    payout
                      ? money(payout.amount, payout.currency)
                      : 'Not requested'
                  }
                />
                <Detail
                  label="Payment method"
                  value={payout?.paymentMethod || 'Not selected'}
                />
                <Detail
                  label="Requested"
                  value={formatDate(payout?.requestedAt)}
                />
                <Detail
                  label="Processed"
                  value={formatDate(payout?.processedAt)}
                />
                {payout && (
                  <Badge className={statusClass(payout.status)}>
                    {payout.status}
                  </Badge>
                )}
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Record details</h2>
              </div>
              <div className="mt-5 space-y-5">
                <Detail
                  label="Rescue charge"
                  value={settlement.rescueChargeId || 'Not linked'}
                />
                <Detail
                  label="Eligible"
                  value={formatDate(settlement.eligibleAt)}
                />
                <Detail
                  label="Payout reference"
                  value={payout?.externalReference || 'Not available'}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
