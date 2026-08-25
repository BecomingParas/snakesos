import type { FinanceStatus } from '@/lib/graphql/hooks/finance.hooks';

export function statusClass(status: FinanceStatus) {
  if (['PAID', 'SETTLED'].includes(status)) {
    return 'border-success/30 bg-success/10 text-success';
  }
  if (['FAILED', 'REJECTED', 'CANCELLED'].includes(status)) {
    return 'border-destructive/30 bg-destructive/10 text-destructive';
  }
  if (['ELIGIBLE', 'APPROVED', 'PROCESSING'].includes(status)) {
    return 'border-warning/30 bg-warning/10 text-warning';
  }
  return 'border-border bg-muted text-muted-foreground';
}

export const nextPayoutAction: Record<
  string,
  { label: string; to: FinanceStatus }
> = {
  PENDING: { label: 'Approve', to: 'APPROVED' },
  APPROVED: { label: 'Process', to: 'PROCESSING' },
  PROCESSING: { label: 'Mark paid', to: 'PAID' },
};
