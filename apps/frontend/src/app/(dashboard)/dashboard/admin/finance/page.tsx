'use client';

import { useState } from 'react';
import {
  Check,
  CircleDollarSign,
  Loader2,
  Receipt,
  WalletCards,
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminEyebrow, AdminPanel } from '@/components/admin/theme';
import {
  LedgerPanel,
  type LedgerTab,
} from '@/components/admin/finance/ledger-panel';
import { MoneyFlowSnapshot } from '@/components/admin/finance/money-flow-snapshot';
import { RescuerPerformance } from '@/components/admin/finance/rescuer-performance';
import { RevenueTrendChart } from '@/components/admin/finance/revenue-trend-chart';
import { FinanceStatCard } from '@/components/admin/finance/stat-card';
import { useFinanceAggregates } from '@/hooks/admin/useFinanceAggregates';
import {
  type FinanceStatus,
  useAdminFinance,
  useTransitionPayout,
} from '@/lib/graphql/hooks/finance.hooks';

export default function AdminFinancePage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [queuePage, setQueuePage] = useState(1);
  const [queuePageSize, setQueuePageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<LedgerTab>('transactions');
  const { data, loading, error, refetch } = useAdminFinance();
  const [transitionPayout, { loading: transitioning }] = useTransitionPayout();
  const settlements = data?.settlements || [];
  const payouts = data?.payouts || [];
  const visibleSettlements = settlements.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const visiblePayouts = payouts.slice(
    (queuePage - 1) * queuePageSize,
    queuePage * queuePageSize,
  );
  const {
    eligibleTotal,
    eligibleCount,
    totalCollected,
    paidOutTotal,
    awaitingPayout,
    topEarner,
    grossRevenue,
    platformCommission,
    rescuerPayout,
    monthlyRevenue,
    pendingPayouts,
  } = useFinanceAggregates(settlements, payouts);

  const transition = async (payoutId: string, status: FinanceStatus) => {
    try {
      await transitionPayout({ variables: { input: { payoutId, status } } });
      toast.success(`Payout marked ${status.toLowerCase()}`);
      await refetch();
    } catch (transitionError) {
      toast.error(
        transitionError instanceof Error
          ? transitionError.message
          : 'Unable to update payout',
      );
    }
  };

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-foreground">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <AdminPanel className="p-6">
          <p className="text-sm text-destructive">
            Unable to load finance data: {error.message}
          </p>
        </AdminPanel>
      </div>
    );
  }

  const revenueCards = [
    {
      label: 'Gross revenue',
      value: `NPR ${grossRevenue.toLocaleString()}`,
      icon: CircleDollarSign,
    },
    {
      label: 'SnakeSOS commission',
      value: `NPR ${platformCommission.toLocaleString()}`,
      icon: Receipt,
    },
    {
      label: 'Rescuer payout',
      value: `NPR ${rescuerPayout.toLocaleString()}`,
      icon: WalletCards,
    },
  ];
  const summaryCards = [
    { label: 'Settlements', value: settlements.length, icon: WalletCards },
    { label: 'Eligible', value: eligibleCount, icon: Check },
    { label: 'Payouts', value: payouts.length, icon: CircleDollarSign },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 text-foreground md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <AdminEyebrow>Command Center · Finance</AdminEyebrow>
          <h1 className="flex items-center gap-3 text-2xl font-bold md:text-3xl">
            <CircleDollarSign className="h-7 w-7 text-primary" />
            Finance
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review eligible settlements and reconcile rescuer payouts.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
          <CircleDollarSign className="h-5 w-5 text-primary" />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Eligible to settle
            </p>
            <p className="font-semibold text-foreground">
              NPR {eligibleTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {revenueCards.map((card) => (
          <FinanceStatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <RevenueTrendChart data={monthlyRevenue} />
        <RescuerPerformance settlements={settlements} topEarner={topEarner} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <MoneyFlowSnapshot
          collected={totalCollected}
          paidOut={paidOutTotal}
          awaiting={awaitingPayout}
        />
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {summaryCards.map((card) => (
            <FinanceStatCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <LedgerPanel
        activeTab={activeTab}
        onTabChange={setActiveTab}
        settlements={settlements}
        visibleSettlements={visibleSettlements}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        payouts={payouts}
        visiblePayouts={visiblePayouts}
        queuePage={queuePage}
        queuePageSize={queuePageSize}
        onQueuePageChange={setQueuePage}
        onQueuePageSizeChange={setQueuePageSize}
        pendingPayouts={pendingPayouts}
        transitioning={transitioning}
        onTransition={transition}
      />
    </div>
  );
}
