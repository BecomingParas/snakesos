import { prisma } from '@snake-rescue/database';
import { BadRequestError } from '@snake-rescue/shared';

type PayoutTransition =
  | 'APPROVED'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'REJECTED'
  | 'CANCELLED';
export type PayoutPaymentMethod =
  | 'ESEWA'
  | 'KHALTI'
  | 'IME_PAY'
  | 'FONEPAY'
  | 'BANK_TRANSFER'
  | 'STRIPE'
  | 'PAYPAL'
  | 'CASH';

export interface CreatePayoutInput {
  settlementId: string;
  paymentMethod?: PayoutPaymentMethod;
  idempotencyKey: string;
  actorId?: string;
}

export class PayoutService {
  constructor(private readonly database = prisma) {}

  async create(input: CreatePayoutInput) {
    return this.database.$transaction(async (transaction) => {
      const settlement = await transaction.settlement.findUnique({
        where: { id: input.settlementId },
      });
      if (!settlement) throw new BadRequestError('Settlement not found');
      if (settlement.status !== 'ELIGIBLE') {
        throw new BadRequestError(
          'Only eligible settlements can create payouts',
        );
      }

      const existing = await transaction.payout.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (existing) {
        if (existing.settlementId !== input.settlementId) {
          throw new BadRequestError(
            'Idempotency key is already associated with another payout',
          );
        }
        return existing;
      }

      const payout = await transaction.payout.create({
        data: {
          settlementId: settlement.id,
          rescuerId: settlement.rescuerId,
          amount: settlement.amount,
          currency: settlement.currency,
          paymentMethod: input.paymentMethod,
          idempotencyKey: input.idempotencyKey,
        },
      });
      await transaction.financialAuditEvent.create({
        data: {
          actorId: input.actorId,
          action: 'PAYOUT_CREATED',
          entityType: 'Payout',
          entityId: payout.id,
          amount: payout.amount,
          currency: payout.currency,
          newState: { status: payout.status },
        },
      });
      return payout;
    });
  }

  async transition(
    payoutId: string,
    nextStatus: PayoutTransition,
    actorId?: string,
    externalReference?: string,
    failureReason?: string,
  ) {
    return this.database.$transaction(async (transaction) => {
      const payout = await transaction.payout.findUnique({
        where: { id: payoutId },
      });
      if (!payout) throw new BadRequestError('Payout not found');
      if (payout.status === nextStatus) return payout;

      const allowed: Record<string, PayoutTransition[]> = {
        PENDING: ['APPROVED', 'PROCESSING', 'REJECTED', 'CANCELLED'],
        APPROVED: ['PROCESSING', 'REJECTED', 'CANCELLED'],
        PROCESSING: ['PAID', 'FAILED', 'CANCELLED'],
      };
      if (!allowed[payout.status]?.includes(nextStatus)) {
        throw new BadRequestError(
          `Invalid payout transition: ${payout.status} -> ${nextStatus}`,
        );
      }

      const now = new Date();
      const updated = await transaction.payout.update({
        where: { id: payoutId },
        data: {
          status: nextStatus,
          externalReference,
          processedAt: nextStatus === 'PAID' ? now : undefined,
          failedAt: ['FAILED', 'REJECTED'].includes(nextStatus)
            ? now
            : undefined,
          failureReason,
        },
      });

      if (nextStatus === 'PAID') {
        await transaction.settlement.update({
          where: { id: payout.settlementId },
          data: { status: 'SETTLED', settledAt: now },
        });
        await transaction.financialTransaction.updateMany({
          where: { settlement: { id: payout.settlementId } },
          data: { status: 'SETTLED' },
        });
      }

      await transaction.financialAuditEvent.create({
        data: {
          actorId,
          action: `PAYOUT_${nextStatus}`,
          entityType: 'Payout',
          entityId: payoutId,
          amount: payout.amount,
          currency: payout.currency,
          previousState: { status: payout.status },
          newState: {
            status: nextStatus,
            externalReference: externalReference || null,
          },
        },
      });
      return updated;
    });
  }
}
