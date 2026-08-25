import { prisma, Prisma } from '@snake-rescue/database';
import { BadRequestError } from '@snake-rescue/shared';

import type { PaymentProviderName } from './payments.types.js';

export type PaymentIntentTransition =
  | 'REQUIRES_ACTION'
  | 'AUTHORIZED'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED';

export interface CreatePaymentIntentInput {
  rescueChargeId?: string;
  donationId?: string;
  provider: PaymentProviderName;
  amount: string;
  currency?: string;
  idempotencyKey: string;
  actorId?: string;
}

const ALLOWED_TRANSITIONS: Record<string, PaymentIntentTransition[]> = {
  CREATED: ['REQUIRES_ACTION', 'AUTHORIZED', 'FAILED', 'CANCELLED'],
  REQUIRES_ACTION: ['AUTHORIZED', 'SUCCEEDED', 'FAILED', 'CANCELLED'],
  AUTHORIZED: ['SUCCEEDED', 'FAILED'],
  SUCCEEDED: [],
  FAILED: [],
  CANCELLED: [],
};

export class PaymentIntentService {
  constructor(private readonly database = prisma) {}

  async findById(id: string) {
    return this.database.paymentIntent.findUnique({ where: { id } });
  }

  async findByProviderReference(providerReference: string) {
    return this.database.paymentIntent.findFirst({
      where: { providerReference },
    });
  }

  async create(input: CreatePaymentIntentInput) {
    if ((input.rescueChargeId ? 1 : 0) + (input.donationId ? 1 : 0) !== 1) {
      throw new BadRequestError(
        'A payment intent must belong to one rescue charge or donation',
      );
    }

    let amount: Prisma.Decimal;
    try {
      amount = new Prisma.Decimal(input.amount);
    } catch {
      throw new BadRequestError('Payment amount must be a valid decimal');
    }
    if (!amount.isFinite() || !amount.isPositive()) {
      throw new BadRequestError('Payment amount must be greater than zero');
    }
    if (amount.decimalPlaces() > 2) {
      throw new BadRequestError(
        'Payment amount cannot have more than two decimal places',
      );
    }

    const intent = await this.database.paymentIntent.upsert({
      where: { idempotencyKey: input.idempotencyKey },
      create: {
        rescueChargeId: input.rescueChargeId,
        donationId: input.donationId,
        provider: input.provider,
        amount,
        currency: input.currency || 'NPR',
        idempotencyKey: input.idempotencyKey,
      },
      update: {},
    });

    if (
      intent.provider !== input.provider ||
      !new Prisma.Decimal(intent.amount).equals(amount) ||
      intent.currency !== (input.currency || 'NPR') ||
      intent.rescueChargeId !== (input.rescueChargeId || null) ||
      intent.donationId !== (input.donationId || null)
    ) {
      throw new BadRequestError(
        'Idempotency key is already associated with a different payment intent',
      );
    }

    return intent;
  }

  async updateRescueAmount(id: string, amountValue: string, userId: string) {
    let amount: Prisma.Decimal;
    try {
      amount = new Prisma.Decimal(amountValue);
    } catch {
      throw new BadRequestError('Payment amount must be a valid decimal');
    }
    if (
      !amount.isFinite() ||
      !amount.isPositive() ||
      amount.decimalPlaces() > 2
    ) {
      throw new BadRequestError(
        'Payment amount must be a positive amount with up to two decimals',
      );
    }

    return this.database.$transaction(async (transaction) => {
      const intent = await transaction.paymentIntent.findUnique({
        where: { id },
        include: { rescueCharge: { include: { rescue: true } } },
      });
      if (
        !intent?.rescueCharge ||
        intent.rescueCharge.rescue.userId !== userId
      ) {
        throw new BadRequestError('Payment intent not found');
      }
      if (!['CREATED', 'REQUIRES_ACTION'].includes(intent.status)) {
        throw new BadRequestError(
          'Payment amount cannot be changed after checkout has started',
        );
      }
      if (
        intent.status === 'REQUIRES_ACTION' &&
        !new Prisma.Decimal(intent.amount).equals(amount)
      ) {
        throw new BadRequestError(
          'Payment amount cannot be changed after checkout has started',
        );
      }

      const commissionRate = new Prisma.Decimal(
        intent.rescueCharge.platformCommissionRate,
      );
      const commissionAmount = amount.mul(commissionRate).div(100);
      const rescuerAmount = amount.sub(commissionAmount);

      await transaction.rescueCharge.update({
        where: { id: intent.rescueCharge.id },
        data: {
          grossAmount: amount,
          platformCommissionAmount: commissionAmount,
          rescuerAmount,
          netAmount: amount,
        },
      });
      await transaction.financialTransaction.updateMany({
        where: { rescueChargeId: intent.rescueCharge.id },
        data: {
          grossAmount: amount,
          platformCommissionAmount: commissionAmount,
          rescuerAmount,
          netAmount: amount,
        },
      });
      await transaction.settlement.updateMany({
        where: { rescueChargeId: intent.rescueCharge.id },
        data: { amount: rescuerAmount },
      });
      return transaction.paymentIntent.update({
        where: { id },
        data: { amount },
      });
    });
  }

  async transition(
    id: string,
    nextStatus: PaymentIntentTransition,
    actorId?: string,
    providerReference?: string,
  ) {
    return this.database.$transaction(async (transaction) => {
      const current = await transaction.paymentIntent.findUnique({
        where: { id },
      });
      if (!current) throw new BadRequestError('Payment intent not found');

      if (current.status === nextStatus) return current;

      if (!ALLOWED_TRANSITIONS[current.status]?.includes(nextStatus)) {
        throw new BadRequestError(
          `Invalid payment intent transition: ${current.status} -> ${nextStatus}`,
        );
      }

      // Compare-and-set makes concurrent provider retries idempotent: only the
      // request that observes the current status records the state transition.
      const transitionResult = await transaction.paymentIntent.updateMany({
        where: { id, status: current.status },
        data: {
          status: nextStatus,
          providerReference,
        },
      });

      if (transitionResult.count === 0) {
        const latest = await transaction.paymentIntent.findUnique({
          where: { id },
        });
        if (!latest) throw new BadRequestError('Payment intent not found');
        return latest;
      }

      const updated = await transaction.paymentIntent.findUnique({
        where: { id },
      });
      if (!updated) throw new BadRequestError('Payment intent not found');

      await transaction.financialAuditEvent.create({
        data: {
          actorId,
          action: `PAYMENT_INTENT_${nextStatus}`,
          entityType: 'PaymentIntent',
          entityId: id,
          previousState: { status: current.status },
          newState: {
            status: nextStatus,
            providerReference: providerReference || null,
          },
          amount: current.amount,
          currency: current.currency,
        },
      });

      return updated;
    });
  }

  async finalizeSuccessfulPayment(id: string, providerReference: string) {
    return this.database.$transaction(async (transaction) => {
      const intent = await transaction.paymentIntent.findUnique({
        where: { id },
      });
      if (!intent) throw new BadRequestError('Payment intent not found');
      const finalizedAt = new Date();

      if (intent.rescueChargeId) {
        await transaction.rescueCharge.updateMany({
          where: { id: intent.rescueChargeId, status: { not: 'PAID' } },
          data: { status: 'PAID', finalizedAt },
        });
        await transaction.financialTransaction.updateMany({
          where: {
            rescueChargeId: intent.rescueChargeId,
            status: { in: ['PENDING', 'AUTHORIZED'] },
          },
          data: {
            status: 'PAID',
            externalReference: providerReference,
            finalizedAt,
          },
        });
        await transaction.settlement.updateMany({
          where: { rescueChargeId: intent.rescueChargeId, status: 'PENDING' },
          data: { status: 'ELIGIBLE', eligibleAt: finalizedAt },
        });
      }

      if (intent.donationId) {
        await transaction.donation.updateMany({
          where: { id: intent.donationId, status: 'PENDING' },
          data: {
            status: 'COMPLETED',
            transactionId: providerReference,
            paidAt: finalizedAt,
          },
        });
        await transaction.financialTransaction.updateMany({
          where: {
            donationId: intent.donationId,
            status: { in: ['PENDING', 'AUTHORIZED'] },
          },
          data: {
            status: 'PAID',
            externalReference: providerReference,
            finalizedAt,
          },
        });
      }

      return intent;
    });
  }

  async finalizeUnsuccessfulPayment(
    id: string,
    status: 'FAILED' | 'CANCELLED',
  ) {
    return this.database.$transaction(async (transaction) => {
      const intent = await transaction.paymentIntent.findUnique({
        where: { id },
      });
      if (!intent) throw new BadRequestError('Payment intent not found');

      if (intent.rescueChargeId) {
        await transaction.rescueCharge.updateMany({
          where: { id: intent.rescueChargeId },
          data: { status },
        });
        await transaction.financialTransaction.updateMany({
          where: { rescueChargeId: intent.rescueChargeId },
          data: { status },
        });
      }

      if (intent.donationId) {
        await transaction.donation.updateMany({
          where: { id: intent.donationId },
          data: { status },
        });
        await transaction.financialTransaction.updateMany({
          where: { donationId: intent.donationId },
          data: { status },
        });
      }

      return intent;
    });
  }
}
