'use client';

import { CircleDollarSign, Clock3, Loader2, WalletCards } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useMyFinance } from '@/lib/graphql/hooks/finance.hooks';

type FinanceStatus =
  | 'PENDING'
  | 'ELIGIBLE'
  | 'SETTLED'
  | 'PAID'
  | 'PROCESSING'
  | 'FAILED'
  | 'CANCELLED'
  | 'APPROVED'
  | 'REJECTED';

function money(amount: string, currency: string) {
  return `${currency} ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusClass(status: FinanceStatus) {
  if (['PAID', 'SETTLED'].includes(status)) return 'bg-success/15 text-success';
  if (['FAILED', 'CANCELLED', 'REJECTED'].includes(status))
    return 'bg-destructive/15 text-destructive';
  return 'bg-warning/15 text-warning';
}

export default function RescuerEarningsPage() {
  const { data, loading, error } = useMyFinance();
  const settlements = data?.mySettlements || [];
  const payouts = data?.myPayouts || [];
  const earned = payouts
    .filter((payout) => payout.status === 'PAID')
    .reduce((total, payout) => total + Number(payout.amount), 0);
  const pending = settlements
    .filter((settlement) => ['ELIGIBLE', 'PENDING'].includes(settlement.status))
    .reduce((total, settlement) => total + Number(settlement.amount), 0);

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="p-8 text-destructive">
        Unable to load earnings: {error.message}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-success">
          Rescuer account
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Earnings</h1>
        <p className="mt-2 text-muted-foreground">
          Track what has been settled and what is ready for payout.
        </p>
      </header>
      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-4 p-5">
          <CircleDollarSign className="h-6 w-6 text-success" />
          <div>
            <p className="text-sm text-muted-foreground">Paid out</p>
            <p className="text-2xl font-bold">NPR {earned.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <Clock3 className="h-6 w-6 text-warning" />
          <div>
            <p className="text-sm text-muted-foreground">Pending or eligible</p>
            <p className="text-2xl font-bold">NPR {pending.toLocaleString()}</p>
          </div>
        </Card>
      </section>
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b p-5">
          <WalletCards className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Payout history</h2>
        </div>
        <div className="divide-y">
          {payouts.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">
              Your payout history will appear here.
            </p>
          )}
          {payouts.map((payout) => (
            <div
              className="flex flex-wrap items-center justify-between gap-4 p-5"
              key={payout.id}
            >
              <div>
                <p className="font-medium">
                  {money(payout.amount, payout.currency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Requested {new Date(payout.requestedAt).toLocaleDateString()}
                </p>
              </div>
              <Badge className={statusClass(payout.status)}>
                {payout.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
