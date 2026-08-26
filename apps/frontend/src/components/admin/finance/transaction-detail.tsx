'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowDownToLine,
  ArrowLeft,
  Calendar,
  CircleDollarSign,
  FileText,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdminEyebrow, AdminPanel } from '@/components/admin/theme';
import { money } from '@/lib/admin/finance/format';
import type { SettlementRecord } from '@/lib/graphql/hooks/finance.hooks';
import { StatusBadge } from './status-badge';

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </span>
      <span className="text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

export function TransactionDetail({
  transaction,
}: {
  transaction: SettlementRecord;
}) {
  const rescuer =
    transaction.rescuerName || transaction.rescuer?.name || 'Unknown rescuer';

  return (
    <div className="w-full max-w-none space-y-6 p-5 text-foreground md:p-6">
      <Button asChild variant="outline">
        <Link href="/dashboard/admin/finance">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to finance
        </Link>
      </Button>

      <AdminPanel className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <AdminEyebrow>Finance · Transaction activity</AdminEyebrow>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">
              Transaction details
            </h1>
            <p className="mt-2 break-all text-sm text-muted-foreground">
              {transaction.id}
            </p>
          </div>
          <StatusBadge status={transaction.status} />
        </div>
      </AdminPanel>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminPanel className="p-5">
          <CircleDollarSign className="h-5 w-5 text-primary" />
          <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
            Gross amount
          </p>
          <p className="mt-1 text-xl font-bold">
            {money(transaction.grossAmount, transaction.currency)}
          </p>
        </AdminPanel>
        <AdminPanel className="p-5">
          <ArrowDownToLine className="h-5 w-5 text-primary" />
          <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
            Rescuer payout
          </p>
          <p className="mt-1 text-xl font-bold">
            {money(transaction.rescuerAmount, transaction.currency)}
          </p>
        </AdminPanel>
        <AdminPanel className="p-5">
          <CircleDollarSign className="h-5 w-5 text-primary" />
          <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
            Commission
          </p>
          <p className="mt-1 text-xl font-bold">
            {money(transaction.commissionAmount, transaction.currency)}
          </p>
        </AdminPanel>
        <AdminPanel className="p-5">
          <Calendar className="h-5 w-5 text-primary" />
          <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
            Created
          </p>
          <p className="mt-1 text-sm font-semibold">
            {new Date(transaction.createdAt).toLocaleString()}
          </p>
        </AdminPanel>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminPanel className="p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <FileText className="h-4 w-4 text-primary" />
            Payment record
          </h2>
          <div className="mt-3">
            <DetailRow
              icon={FileText}
              label="Transaction ID"
              value={transaction.id}
            />
            <DetailRow
              icon={FileText}
              label="Rescue charge"
              value={transaction.rescueChargeId || 'Not linked'}
            />
            <DetailRow
              icon={CircleDollarSign}
              label="Settlement amount"
              value={money(transaction.amount, transaction.currency)}
            />
            <DetailRow
              icon={CircleDollarSign}
              label="Commission rate"
              value={`${transaction.commissionRate}%`}
            />
            <DetailRow
              icon={Calendar}
              label="Eligible at"
              value={
                transaction.eligibleAt
                  ? new Date(transaction.eligibleAt).toLocaleString()
                  : 'Not yet eligible'
              }
            />
            <DetailRow
              icon={Calendar}
              label="Settled at"
              value={
                transaction.settledAt
                  ? new Date(transaction.settledAt).toLocaleString()
                  : 'Not settled'
              }
            />
          </div>
        </AdminPanel>

        <AdminPanel className="p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <UserRound className="h-4 w-4 text-primary" />
            Participants
          </h2>
          <div className="mt-3">
            <DetailRow
              icon={UserRound}
              label="Citizen"
              value={transaction.citizenName || 'Unknown citizen'}
            />
            <DetailRow icon={UserRound} label="Rescuer" value={rescuer} />
            <DetailRow
              icon={CircleDollarSign}
              label="Currency"
              value={transaction.currency}
            />
            <DetailRow
              icon={Calendar}
              label="Recorded"
              value={new Date(transaction.createdAt).toLocaleString()}
            />
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
