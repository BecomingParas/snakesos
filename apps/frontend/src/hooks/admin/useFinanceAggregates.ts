import { useMemo } from 'react';
import type {
  PayoutRecord,
  SettlementRecord,
} from '@/lib/graphql/hooks/finance.hooks';

export interface FinanceAggregates {
  eligibleTotal: number;
  eligibleCount: number;
  totalCollected: number;
  paidOutTotal: number;
  awaitingPayout: number;
  topEarner: number;
  grossRevenue: number;
  platformCommission: number;
  rescuerPayout: number;
  monthlyRevenue: { month: string; revenue: number }[];
  pendingPayouts: number;
}

export function useFinanceAggregates(
  settlements: SettlementRecord[],
  payouts: PayoutRecord[],
): FinanceAggregates {
  return useMemo(() => {
    const eligibleTotal = settlements
      .filter((settlement) => settlement.status === 'ELIGIBLE')
      .reduce((total, settlement) => total + Number(settlement.amount), 0);
    const eligibleCount = settlements.filter(
      (settlement) => settlement.status === 'ELIGIBLE',
    ).length;
    const totalCollected = settlements.reduce(
      (total, settlement) => total + Number(settlement.amount),
      0,
    );
    const paidOutTotal = payouts
      .filter((payout) => payout.status === 'PAID')
      .reduce((total, payout) => total + Number(payout.amount), 0);
    const awaitingPayout = payouts
      .filter((payout) =>
        ['PENDING', 'APPROVED', 'PROCESSING'].includes(payout.status),
      )
      .reduce((total, payout) => total + Number(payout.amount), 0);
    const topEarner = Math.max(
      ...settlements.map((settlement) => Number(settlement.amount)),
      1,
    );
    const grossRevenue = settlements.reduce(
      (total, settlement) => total + Number(settlement.grossAmount),
      0,
    );
    const platformCommission = settlements.reduce(
      (total, settlement) => total + Number(settlement.commissionAmount),
      0,
    );
    const rescuerPayout = settlements.reduce(
      (total, settlement) => total + Number(settlement.rescuerAmount),
      0,
    );
    const monthlyRevenue = settlements.reduce<
      { month: string; revenue: number }[]
    >((months, settlement) => {
      const month = new Date(settlement.createdAt).toLocaleDateString(
        undefined,
        { month: 'short', year: '2-digit' },
      );
      const existing = months.find((item) => item.month === month);
      if (existing) existing.revenue += Number(settlement.grossAmount);
      else months.push({ month, revenue: Number(settlement.grossAmount) });
      return months;
    }, []);

    return {
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
      pendingPayouts: payouts.filter((payout) => payout.status === 'PENDING')
        .length,
    };
  }, [settlements, payouts]);
}
