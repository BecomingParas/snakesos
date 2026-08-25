import { calculateRescueFinancialSnapshot } from '../../../libs/backend/modules/src/finance/domain/financial-calculator.ts';

describe('calculateRescueFinancialSnapshot', () => {
  it('snapshots the confirmed standard rescue policy', () => {
    expect(
      calculateRescueFinancialSnapshot({
        grossAmount: '1000.00',
        commissionRate: '20.00',
        fixedAmount: '500.00',
      }),
    ).toEqual({
      grossAmount: '1000.00',
      commissionAmount: '200.00',
      rescuerAmount: '800.00',
      netAmount: '1000.00',
    });
  });

  it('rounds commission in minor units', () => {
    expect(
      calculateRescueFinancialSnapshot({
        grossAmount: '999.99',
        commissionRate: '12.50',
        fixedAmount: '500.00',
      }).commissionAmount,
    ).toBe('125.00');
  });

  it('keeps the rescuer payout dynamic after the commission', () => {
    expect(
      calculateRescueFinancialSnapshot({
        grossAmount: '2000.00',
        commissionRate: '10.00',
        fixedAmount: '500.00',
      }),
    ).toEqual({
      grossAmount: '2000.00',
      commissionAmount: '200.00',
      rescuerAmount: '1800.00',
      netAmount: '2000.00',
    });
  });
});
