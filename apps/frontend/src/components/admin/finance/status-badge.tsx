import { Badge } from '@/components/ui/badge';
import { statusClass } from '@/lib/admin/finance/status';
import type { FinanceStatus } from '@/lib/graphql/hooks/finance.hooks';

export function StatusBadge({ status }: { status: FinanceStatus }) {
  return (
    <Badge className={`font-medium ${statusClass(status)}`}>{status}</Badge>
  );
}
