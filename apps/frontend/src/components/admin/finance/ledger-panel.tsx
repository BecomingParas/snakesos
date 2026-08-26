'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ListChecks, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';
import { AdminEyebrow, AdminPanel } from '@/components/admin/theme';
import { money } from '@/lib/admin/finance/format';
import { nextPayoutAction } from '@/lib/admin/finance/status';
import type {
  FinanceStatus,
  PayoutRecord,
  SettlementRecord,
} from '@/lib/graphql/hooks/finance.hooks';
import { StatusBadge } from './status-badge';

export type LedgerTab = 'transactions' | 'queue';

interface LedgerPanelProps {
  activeTab: LedgerTab;
  onTabChange: (tab: LedgerTab) => void;
  settlements: SettlementRecord[];
  visibleSettlements: SettlementRecord[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  payouts: PayoutRecord[];
  visiblePayouts: PayoutRecord[];
  queuePage: number;
  queuePageSize: number;
  onQueuePageChange: (page: number) => void;
  onQueuePageSizeChange: (size: number) => void;
  pendingPayouts: number;
  transitioning: boolean;
  onTransition: (payoutId: string, status: FinanceStatus) => void;
}

export function LedgerPanel({
  activeTab,
  onTabChange,
  settlements,
  visibleSettlements,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  payouts,
  visiblePayouts,
  queuePage,
  queuePageSize,
  onQueuePageChange,
  onQueuePageSizeChange,
  pendingPayouts,
  transitioning,
  onTransition,
}: LedgerPanelProps) {
  return (
    <AdminPanel className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
        <div>
          <AdminEyebrow>Ledger</AdminEyebrow>
          <h2 className="font-semibold text-foreground">
            {activeTab === 'transactions'
              ? 'Transaction activity'
              : 'Payout queue'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeTab === 'transactions'
              ? 'Latest rescue payments'
              : 'Approve, process and settle payouts'}
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
          <button
            type="button"
            onClick={() => onTabChange('transactions')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${activeTab === 'transactions' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Receipt className="h-3.5 w-3.5" />
            Transactions{' '}
            <span className="text-xs opacity-70">{settlements.length}</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('queue')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${activeTab === 'queue' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <ListChecks className="h-3.5 w-3.5" />
            Queue <span className="text-xs opacity-70">{payouts.length}</span>
            {pendingPayouts > 0 && activeTab !== 'queue' && (
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            )}
          </button>
        </div>
      </div>
      {activeTab === 'transactions' ? (
        <TransactionTable
          settlements={settlements}
          visibleSettlements={visibleSettlements}
          page={page}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      ) : (
        <PayoutTable
          payouts={payouts}
          visiblePayouts={visiblePayouts}
          queuePage={queuePage}
          queuePageSize={queuePageSize}
          onQueuePageChange={onQueuePageChange}
          onQueuePageSizeChange={onQueuePageSizeChange}
          transitioning={transitioning}
          onTransition={onTransition}
        />
      )}
    </AdminPanel>
  );
}

function TransactionTable({
  settlements,
  visibleSettlements,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Pick<
  LedgerPanelProps,
  | 'settlements'
  | 'visibleSettlements'
  | 'page'
  | 'pageSize'
  | 'onPageChange'
  | 'onPageSizeChange'
>) {
  const router = useRouter();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-155 text-left text-sm">
          <thead className="bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Citizen</th>
              <th className="px-5 py-3 font-medium">Rescuer</th>
              <th className="px-5 py-3 font-medium">Rescue</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Settlement</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleSettlements.map((settlement) => (
              <tr
                className="cursor-pointer transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none"
                key={settlement.id}
                role="link"
                tabIndex={0}
                onClick={() =>
                  router.push(
                    `/dashboard/admin/finance/transactions/${settlement.id}`,
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    router.push(
                      `/dashboard/admin/finance/transactions/${settlement.id}`,
                    );
                  }
                }}
              >
                <td className="px-5 py-4 text-foreground">
                  {settlement.citizenName || 'Unknown citizen'}
                </td>
                <td className="px-5 py-4 font-medium text-foreground">
                  {settlement.rescuerName ||
                    settlement.rescuer?.name ||
                    'Unknown rescuer'}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <Link
                    href={`/dashboard/admin/finance/transactions/${settlement.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {settlement.rescueChargeId?.slice(0, 8) || 'Rescue payment'}
                  </Link>
                </td>
                <td className="px-5 py-4 font-medium text-foreground">
                  {money(settlement.amount, settlement.currency)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={settlement.status} />
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {new Date(settlement.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {settlements.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">
            No transactions found.
          </p>
        )}
      </div>
      <div className="px-5 pb-5">
        <DashboardPagination
          page={page}
          pageSize={pageSize}
          totalCount={settlements.length}
          onPageChange={onPageChange}
          onPageSizeChange={(size) => {
            onPageSizeChange(size);
            onPageChange(1);
          }}
          itemLabel="transactions"
          alwaysShow
        />
      </div>
    </>
  );
}

function PayoutTable({
  payouts,
  visiblePayouts,
  queuePage,
  queuePageSize,
  onQueuePageChange,
  onQueuePageSizeChange,
  transitioning,
  onTransition,
}: Pick<
  LedgerPanelProps,
  | 'payouts'
  | 'visiblePayouts'
  | 'queuePage'
  | 'queuePageSize'
  | 'onQueuePageChange'
  | 'onQueuePageSizeChange'
  | 'transitioning'
  | 'onTransition'
>) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-155 text-left text-sm">
          <thead className="bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Payout</th>
              <th className="px-5 py-3 font-medium">Citizen</th>
              <th className="px-5 py-3 font-medium">Rescuer</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visiblePayouts.map((payout) => {
              const action = nextPayoutAction[payout.status];
              return (
                <tr
                  className="transition-colors hover:bg-white/5"
                  key={payout.id}
                >
                  <td className="px-5 py-4 text-muted-foreground">
                    {payout.id.slice(0, 8)}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {payout.citizenName || 'Unknown citizen'}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {payout.rescuerName || 'Unknown rescuer'}
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {money(payout.amount, payout.currency)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={payout.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    {action && (
                      <Button
                        size="sm"
                        disabled={transitioning}
                        onClick={() => onTransition(payout.id, action.to)}
                        style={{
                          backgroundColor: 'hsl(var(--primary))',
                          color: 'hsl(var(--primary-foreground))',
                        }}
                        className="hover:opacity-90"
                      >
                        {action.label}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {payouts.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">
            No payouts have been created.
          </p>
        )}
      </div>
      <div className="px-5 pb-5">
        <DashboardPagination
          page={queuePage}
          pageSize={queuePageSize}
          totalCount={payouts.length}
          onPageChange={onQueuePageChange}
          onPageSizeChange={(size) => {
            onQueuePageSizeChange(size);
            onQueuePageChange(1);
          }}
          itemLabel="payouts"
          alwaysShow
        />
      </div>
    </>
  );
}
