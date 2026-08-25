import { AdminEyebrow, AdminPanel } from '@/components/admin/theme';
import { money } from '@/lib/admin/finance/format';
import type { SettlementRecord } from '@/lib/graphql/hooks/finance.hooks';

export function RescuerPerformance({
  settlements,
  topEarner,
}: {
  settlements: SettlementRecord[];
  topEarner: number;
}) {
  return (
    <AdminPanel className="p-5">
      <div className="mb-5">
        <AdminEyebrow>Rescuer performance</AdminEyebrow>
        <h2 className="font-semibold text-foreground">Earnings by rescuer</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Settlement value per completed rescue.
        </p>
      </div>
      <div className="space-y-4">
        {settlements.slice(0, 5).map((settlement) => {
          const amount = Number(settlement.amount);
          return (
            <div key={settlement.id}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-foreground">
                  {settlement.rescuerName || 'Unknown rescuer'}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {money(settlement.amount, settlement.currency)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.max((amount / topEarner) * 100, 4)}%` }}
                />
              </div>
            </div>
          );
        })}
        {settlements.length === 0 && (
          <p className="text-sm text-muted-foreground">No earnings data yet.</p>
        )}
      </div>
    </AdminPanel>
  );
}
