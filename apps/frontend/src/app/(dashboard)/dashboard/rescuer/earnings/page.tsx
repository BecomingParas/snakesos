'use client';

import { useState } from 'react';
import {
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  Loader2,
  WalletCards,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  useCreatePayout,
  useMyFinance,
} from '@/lib/graphql/hooks/finance.hooks';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';
import { toast } from 'sonner';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, loading, error, refetch } = useMyFinance({
    pagination: { page: currentPage, limit: pageSize },
  });
  const [createPayout, { loading: requestingPayout }] = useCreatePayout();
  const settlements = data?.mySettlements?.edges.map((edge) => edge.node) || [];
  const payouts = data?.myPayouts?.edges.map((edge) => edge.node) || [];
  const payoutBySettlementId = new Map(
    payouts.map((payout) => [payout.settlementId, payout]),
  );
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
    <div className="mx-auto max-w-6xl space-y-6 p-6">
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
      <Card className="p-5 text-sm text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">Pending</span> means
          the rescue payment is still being processed.{' '}
          <span className="font-semibold text-foreground">Eligible</span> means
          the amount is approved and can be requested for payout.
        </p>
      </Card>
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b p-5">
          <WalletCards className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Earnings history</h2>
        </div>
        <div className="divide-y">
          {settlements.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">
              Your earnings history will appear here.
            </p>
          )}
          {settlements.map((settlement) => (
            <div
              className="flex cursor-pointer flex-wrap items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/30"
              key={settlement.id}
              role="link"
              tabIndex={0}
              onClick={() =>
                window.location.assign(
                  `/dashboard/rescuer/earnings/${settlement.id}`,
                )
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  window.location.assign(
                    `/dashboard/rescuer/earnings/${settlement.id}`,
                  );
                }
              }}
            >
              <div>
                <p className="font-medium">
                  {money(settlement.amount, settlement.currency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Earned {new Date(settlement.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                <Badge className={statusClass(settlement.status)}>
                  {settlement.status}
                </Badge>
                {settlement.status === 'ELIGIBLE' &&
                  (payoutBySettlementId.get(settlement.id) ? (
                    <Badge className="bg-warning/15 text-warning">
                      PAYOUT REQUESTED
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      disabled={requestingPayout}
                      onClick={async (event) => {
                        event.stopPropagation();
                        try {
                          await createPayout({
                            variables: {
                              input: {
                                settlementId: settlement.id,
                                idempotencyKey: `settlement:${settlement.id}`,
                              },
                            },
                          });
                          toast.success('Payout requested');
                          await refetch();
                        } catch (requestError) {
                          toast.error(
                            requestError instanceof Error
                              ? requestError.message
                              : 'Unable to request payout',
                          );
                        }
                      }}
                    >
                      Request payout
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <DashboardPagination
        page={currentPage}
        pageSize={pageSize}
        totalCount={data?.mySettlements?.totalCount || 0}
        pageInfo={data?.mySettlements?.pageInfo}
        onPageChange={setCurrentPage}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setCurrentPage(1);
        }}
        alwaysShow
      />
    </div>
  );
}
