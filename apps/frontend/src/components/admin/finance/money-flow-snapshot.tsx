import { CircleDollarSign } from 'lucide-react';
import { AdminEyebrow, AdminPanel } from '@/components/admin/theme';

export function MoneyFlowSnapshot({
  collected,
  paidOut,
  awaiting,
}: {
  collected: number;
  paidOut: number;
  awaiting: number;
}) {
  return (
    <AdminPanel className="p-5">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <AdminEyebrow>Money flow</AdminEyebrow>
          <h2 className="font-semibold text-foreground">Finance snapshot</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Collected and allocated across the rescue network.
          </p>
        </div>
        <CircleDollarSign className="h-5 w-5 text-success" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">Collected</p>
          <p className="mt-2 text-xl font-bold text-foreground">
            NPR {collected.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">Paid out</p>
          <p className="mt-2 text-xl font-bold text-success">
            NPR {paidOut.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">Awaiting payout</p>
          <p className="mt-2 text-xl font-bold text-warning">
            NPR {awaiting.toLocaleString()}
          </p>
        </div>
      </div>
    </AdminPanel>
  );
}
