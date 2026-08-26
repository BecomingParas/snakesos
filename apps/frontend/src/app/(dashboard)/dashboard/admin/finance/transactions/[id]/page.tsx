'use client';

import { use } from 'react';
import { CircleX, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { TransactionDetail } from '@/components/admin/finance/transaction-detail';
import { useAdminFinance } from '@/lib/graphql/hooks/finance.hooks';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminTransactionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { data, loading, error } = useAdminFinance();
  const transaction = data?.settlements?.find((settlement) => settlement.id === id);

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="space-y-6 p-6 md:p-8">
        <Card className="mx-auto max-w-5xl p-8 text-center">
          <CircleX className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-3 text-xl font-semibold">Transaction not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error?.message || 'This transaction is unavailable.'}
          </p>
        </Card>
      </div>
    );
  }

  return <TransactionDetail transaction={transaction} />;
}