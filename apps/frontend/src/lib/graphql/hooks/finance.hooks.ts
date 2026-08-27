'use client';

import { useMutation, useQuery } from '@/lib/apollo/hooks';
import {
  ADMIN_FINANCE,
  MY_FINANCE,
  TRANSITION_PAYOUT,
  MY_RESCUE_PAYMENT_INTENT,
  START_PAYMENT,
  CONFIRM_PAYMENT,
  CREATE_PAYOUT,
  ASSIGNED_RESCUE_PAYMENT_INTENT,
} from '../queries/finance.queries';

export type FinanceStatus =
  | 'PENDING'
  | 'ELIGIBLE'
  | 'PROCESSING'
  | 'SETTLED'
  | 'FAILED'
  | 'CANCELLED'
  | 'APPROVED'
  | 'PAID'
  | 'REJECTED';

export type PaymentIntentStatus =
  | 'CREATED'
  | 'REQUIRES_ACTION'
  | 'AUTHORIZED'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED';

export interface SettlementRecord {
  id: string;
  rescueChargeId?: string | null;
  rescuerId?: string;
  rescuer?: { name: string } | null;
  rescuerName?: string;
  citizenName?: string;
  grossAmount: string;
  commissionRate: string;
  commissionAmount: string;
  rescuerAmount: string;
  amount: string;
  currency: string;
  status: FinanceStatus;
  eligibleAt?: string | null;
  settledAt?: string | null;
  createdAt: string;
}

export interface PayoutRecord {
  id: string;
  settlementId: string;
  rescuerId?: string;
  rescuerName?: string;
  citizenName?: string;
  amount: string;
  currency: string;
  status: FinanceStatus;
  paymentMethod?: string | null;
  externalReference?: string | null;
  requestedAt: string;
  processedAt?: string | null;
  failedAt?: string | null;
  failureReason?: string | null;
}

interface FinanceData {
  settlements?: SettlementRecord[];
  payouts?: PayoutRecord[];
  mySettlements?: FinanceConnection<SettlementRecord>;
  myPayouts?: FinanceConnection<PayoutRecord>;
}

export interface FinanceConnection<T> {
  edges: Array<{ node: T; cursor: string }>;
  pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
  totalCount: number;
}

export function useAdminFinance() {
  return useQuery<FinanceData>(ADMIN_FINANCE, {
    fetchPolicy: 'cache-and-network',
  });
}

export function useMyFinance(variables?: {
  pagination?: { limit: number; page: number };
}) {
  return useQuery<FinanceData>(MY_FINANCE, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
}

export function useTransitionPayout() {
  return useMutation(TRANSITION_PAYOUT);
}

export function useCreatePayout() {
  return useMutation(CREATE_PAYOUT);
}

export function useMyRescuePaymentIntent(rescueId: string) {
  return useQuery<
    { myRescuePaymentIntent: PaymentIntentRecord | null },
    { rescueId: string }
  >(MY_RESCUE_PAYMENT_INTENT, {
    variables: { rescueId },
    skip: !rescueId,
    pollInterval: 3000,
    // A payment status is finalized asynchronously by the provider webhook.
    // Never render a stale cached status as the source of truth after checkout.
    fetchPolicy: 'network-only',
  });
}

export function useAssignedRescuePaymentIntent(rescueId: string) {
  return useQuery<
    { assignedRescuePaymentIntent: PaymentIntentRecord | null },
    { rescueId: string }
  >(ASSIGNED_RESCUE_PAYMENT_INTENT, {
    variables: { rescueId },
    skip: !rescueId,
    pollInterval: 3000,
    fetchPolicy: 'network-only',
  });
}

export function useStartPayment() {
  return useMutation<
    {
      startPayment: {
        checkoutUrl?: string | null;
        providerReference: string;
        paymentIntent: {
          status: PaymentIntentStatus;
        };
      };
    },
    { input: { paymentIntentId: string; amount?: string; returnUrl?: string } }
  >(START_PAYMENT);
}

export function useConfirmPayment() {
  return useMutation(CONFIRM_PAYMENT);
}

export interface PaymentIntentRecord {
  id: string;
  provider: string;
  amount: string;
  currency: string;
  status: PaymentIntentStatus;
  providerReference?: string | null;
  updatedAt: string;
}
