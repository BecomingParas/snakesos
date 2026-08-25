export interface CompensationPolicyAmounts {
  grossAmount: string;
  commissionRate: string;
  fixedAmount: string;
}

export interface RescueFinancialSnapshot {
  grossAmount: string;
  commissionAmount: string;
  rescuerAmount: string;
  netAmount: string;
}

function toMinorUnits(value: string): bigint {
  const [whole = '0', fraction = ''] = value.split('.');
  const normalizedFraction = fraction.padEnd(2, '0').slice(0, 2);
  return BigInt(whole) * 100n + BigInt(normalizedFraction);
}

function fromMinorUnits(value: bigint): string {
  const sign = value < 0n ? '-' : '';
  const absolute = value < 0n ? -value : value;
  return `${sign}${absolute / 100n}.${(absolute % 100n).toString().padStart(2, '0')}`;
}

export function calculateRescueFinancialSnapshot(
  policy: CompensationPolicyAmounts,
): RescueFinancialSnapshot {
  const grossMinor = toMinorUnits(policy.grossAmount);
  const commissionRateHundredths = toMinorUnits(policy.commissionRate);
  const commissionMinor =
    (grossMinor * commissionRateHundredths + 5000n) / 10000n;
  const rescuerMinor = grossMinor - commissionMinor;

  return {
    grossAmount: fromMinorUnits(grossMinor),
    commissionAmount: fromMinorUnits(commissionMinor),
    rescuerAmount: fromMinorUnits(rescuerMinor),
    netAmount: fromMinorUnits(grossMinor),
  };
}
