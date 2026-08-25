import { prisma, Prisma } from '@snake-rescue/database';
import { BadRequestError } from '@snake-rescue/shared';
import { calculateRescueFinancialSnapshot } from '../domain/financial-calculator.js';

export interface CreateRescueChargeInput {
  rescueId: string;
  rescuerId: string;
  actorId: string;
}

export class RescueFinancialService {
  constructor(private readonly database = prisma) {}

  async createForCompletedRescueInTransaction(
    transaction: Prisma.TransactionClient,
    input: CreateRescueChargeInput,
  ) {
    const existing = await transaction.rescueCharge.findUnique({
      where: { rescueId: input.rescueId },
      include: { transaction: true, settlement: true },
    });
    if (existing) return existing;

    const now = new Date();
    const rescue = await transaction.rescueRequest.findUnique({
      where: { id: input.rescueId },
      select: { status: true, assignedTo: true },
    });
    if (!rescue || !['IN_PROGRESS', 'COMPLETED'].includes(rescue.status)) {
      throw new BadRequestError(
        'Only started or completed rescues can be financially finalized',
      );
    }
    if (rescue.assignedTo !== input.rescuerId) {
      throw new BadRequestError('Rescuer is not assigned to this rescue');
    }

    const policy = await transaction.compensationPolicy.findFirst({
      where: {
        isActive: true,
        currency: 'NPR',
        effectiveFrom: { lte: now },
        OR: [{ effectiveTo: null }, { effectiveTo: { gt: now } }],
      },
      orderBy: { effectiveFrom: 'desc' },
    });
    if (!policy) {
      throw new BadRequestError(
        'No active rescue compensation policy is configured',
      );
    }

    const snapshot = calculateRescueFinancialSnapshot({
      grossAmount: policy.grossAmount.toString(),
      commissionRate: policy.commissionRate.toString(),
      fixedAmount: policy.fixedAmount.toString(),
    });
    const grossAmount = new Prisma.Decimal(snapshot.grossAmount);
    const commissionAmount = new Prisma.Decimal(snapshot.commissionAmount);
    const rescuerAmount = new Prisma.Decimal(snapshot.rescuerAmount);
    const rescueCharge = await transaction.rescueCharge.create({
      data: {
        rescueId: input.rescueId,
        rescuerId: input.rescuerId,
        policyId: policy.id,
        currency: policy.currency,
        grossAmount,
        platformCommissionRate: policy.commissionRate,
        platformCommissionAmount: commissionAmount,
        rescuerAmount,
        netAmount: grossAmount,
        status: 'PENDING',
      },
    });
    const financialTransaction = await transaction.financialTransaction.create({
      data: {
        type: 'RESCUE_CHARGE',
        status: 'PENDING',
        currency: policy.currency,
        rescueChargeId: rescueCharge.id,
        idempotencyKey: `rescue-charge:${input.rescueId}`,
        grossAmount,
        platformCommissionRate: policy.commissionRate,
        platformCommissionAmount: commissionAmount,
        rescuerAmount,
        netAmount: grossAmount,
      },
    });
    await transaction.settlement.create({
      data: {
        transactionId: financialTransaction.id,
        rescueChargeId: rescueCharge.id,
        rescuerId: input.rescuerId,
        amount: rescuerAmount,
        currency: policy.currency,
        status: 'PENDING',
      },
    });
    await transaction.paymentIntent.create({
      data: {
        rescueChargeId: rescueCharge.id,
        provider: 'STRIPE',
        amount: grossAmount,
        currency: policy.currency,
        idempotencyKey: `rescue-payment:${input.rescueId}`,
      },
    });
    await transaction.financialAuditEvent.create({
      data: {
        actorId: input.actorId,
        action: 'RESCUE_FINANCIALS_CREATED',
        entityType: 'RescueCharge',
        entityId: rescueCharge.id,
        amount: grossAmount,
        currency: policy.currency,
        newState: {
          grossAmount: grossAmount.toString(),
          commissionRate: policy.commissionRate.toString(),
          commissionAmount: commissionAmount.toString(),
          rescuerAmount: rescuerAmount.toString(),
        },
      },
    });
    return transaction.rescueCharge.findUnique({
      where: { id: rescueCharge.id },
      include: { transaction: true, settlement: true },
    });
  }

  async createForCompletedRescue(input: CreateRescueChargeInput) {
    const existing = await this.database.rescueCharge.findUnique({
      where: { rescueId: input.rescueId },
      include: { transaction: true, paymentIntent: true },
    });

    if (existing) {
      await this.database.paymentIntent.upsert({
        where: { rescueChargeId: existing.id },
        create: {
          rescueChargeId: existing.id,
          provider: 'STRIPE',
          amount: existing.grossAmount,
          currency: existing.currency,
          idempotencyKey: `rescue-payment:${input.rescueId}`,
        },
        update: {},
      });
      return this.database.rescueCharge.findUnique({
        where: { id: existing.id },
        include: { transaction: true, paymentIntent: true },
      });
    }

    const now = new Date();
    const rescue = await this.database.rescueRequest.findUnique({
      where: { id: input.rescueId },
      select: { id: true, status: true, assignedTo: true },
    });

    if (!rescue || !['IN_PROGRESS', 'COMPLETED'].includes(rescue.status)) {
      throw new BadRequestError(
        'Only started or completed rescues can be financially finalized',
      );
    }

    if (rescue.assignedTo !== input.rescuerId) {
      throw new BadRequestError('Rescuer is not assigned to this rescue');
    }

    const policy = await this.database.compensationPolicy.findFirst({
      where: {
        isActive: true,
        currency: 'NPR',
        effectiveFrom: { lte: now },
        OR: [{ effectiveTo: null }, { effectiveTo: { gt: now } }],
      },
      orderBy: { effectiveFrom: 'desc' },
    });

    if (!policy) {
      throw new BadRequestError(
        'No active rescue compensation policy is configured',
      );
    }

    const snapshot = calculateRescueFinancialSnapshot({
      grossAmount: policy.grossAmount.toString(),
      commissionRate: policy.commissionRate.toString(),
      fixedAmount: policy.fixedAmount.toString(),
    });
    const grossAmount = new Prisma.Decimal(snapshot.grossAmount);
    const commissionAmount = new Prisma.Decimal(snapshot.commissionAmount);
    const rescuerAmount = new Prisma.Decimal(snapshot.rescuerAmount);

    try {
      return await this.database.$transaction(async (transaction) => {
        const rescueCharge = await transaction.rescueCharge.upsert({
          where: { rescueId: input.rescueId },
          create: {
            rescueId: input.rescueId,
            rescuerId: input.rescuerId,
            policyId: policy.id,
            currency: policy.currency,
            grossAmount,
            platformCommissionRate: policy.commissionRate,
            platformCommissionAmount: commissionAmount,
            rescuerAmount,
            netAmount: grossAmount,
            status: 'PENDING',
          },
          update: {},
        });

        const financialTransaction =
          await transaction.financialTransaction.upsert({
            where: { rescueChargeId: rescueCharge.id },
            create: {
              type: 'RESCUE_CHARGE',
              status: 'PENDING',
              currency: policy.currency,
              rescueChargeId: rescueCharge.id,
              idempotencyKey: `rescue-charge:${input.rescueId}`,
              grossAmount,
              platformCommissionRate: policy.commissionRate,
              platformCommissionAmount: commissionAmount,
              rescuerAmount,
              netAmount: grossAmount,
            },
            update: {},
          });

        await transaction.settlement.upsert({
          where: { rescueChargeId: rescueCharge.id },
          create: {
            transactionId: financialTransaction.id,
            rescueChargeId: rescueCharge.id,
            rescuerId: input.rescuerId,
            amount: rescuerAmount,
            currency: policy.currency,
            status: 'PENDING',
          },
          update: {},
        });

        await transaction.paymentIntent.upsert({
          where: { rescueChargeId: rescueCharge.id },
          create: {
            rescueChargeId: rescueCharge.id,
            provider: 'STRIPE',
            amount: grossAmount,
            currency: policy.currency,
            idempotencyKey: `rescue-payment:${input.rescueId}`,
          },
          update: {},
        });

        await transaction.financialAuditEvent.create({
          data: {
            actorId: input.actorId,
            action: 'RESCUE_FINANCIALS_FINALIZED',
            entityType: 'RescueCharge',
            entityId: rescueCharge.id,
            amount: grossAmount,
            currency: policy.currency,
            newState: {
              grossAmount: grossAmount.toString(),
              commissionRate: policy.commissionRate.toString(),
              commissionAmount: commissionAmount.toString(),
              rescuerAmount: rescuerAmount.toString(),
            },
          },
        });

        return transaction.rescueCharge.findUnique({
          where: { id: rescueCharge.id },
          include: {
            transaction: true,
            settlement: true,
            paymentIntent: true,
          },
        });
      });
    } catch (error) {
      const retryResult = await this.database.rescueCharge.findUnique({
        where: { rescueId: input.rescueId },
        include: { transaction: true, settlement: true, paymentIntent: true },
      });
      if (retryResult) return retryResult;
      throw error;
    }
  }
}
