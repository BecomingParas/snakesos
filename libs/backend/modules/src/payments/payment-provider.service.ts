import { PaymentIntentService } from './payment-intent.service.js';
import { prisma, Prisma } from '@snake-rescue/database';
import type {
  PaymentProvider,
  PaymentProviderName,
  PaymentProviderRequest,
} from './payments.types.js';

export class PaymentProviderService {
  private readonly providers: Map<PaymentProviderName, PaymentProvider>;

  constructor(
    private readonly paymentIntents = new PaymentIntentService(),
    providers: PaymentProvider[] = [],
    private readonly database = prisma,
  ) {
    this.providers = new Map(
      providers.map((provider) => [provider.name, provider]),
    );
  }

  async initiatePayment(
    intentId: string,
    providerName: PaymentProviderName,
    input: Omit<PaymentProviderRequest, 'paymentIntentId'>,
    actorId?: string,
  ) {
    const intent = await this.paymentIntents.findById(intentId);
    if (!intent) throw new Error(`Payment intent not found: ${intentId}`);
    if (intent.provider !== providerName) {
      throw new Error('Payment provider does not match the payment intent');
    }
    if (['SUCCEEDED', 'FAILED', 'CANCELLED'].includes(intent.status)) {
      throw new Error(`Payment intent is already ${intent.status}`);
    }

    const provider = this.providers.get(providerName);
    if (!provider)
      throw new Error(`Payment provider is not configured: ${providerName}`);
    const response = await provider.createPayment({
      ...input,
      paymentIntentId: intentId,
    });
    const updatedIntent = await this.paymentIntents.transition(
      intentId,
      'REQUIRES_ACTION',
      actorId,
      response.providerReference,
    );
    return { intent: updatedIntent, ...response };
  }

  async confirmPayment(
    intentId: string,
    providerReference: string,
    actorId?: string,
    expectedProvider?: PaymentProviderName,
  ) {
    const intent = await this.paymentIntents.findById(intentId);
    if (!intent) throw new Error(`Payment intent not found: ${intentId}`);
    if (expectedProvider && intent.provider !== expectedProvider) {
      throw new Error(
        'Payment callback provider does not match the payment intent',
      );
    }
    if (
      intent.providerReference &&
      intent.providerReference !== providerReference
    ) {
      throw new Error('Provider reference does not match the payment intent');
    }

    const provider = this.providers.get(intent.provider as PaymentProviderName);
    if (!provider) {
      throw new Error(`Payment provider is not configured: ${intent.provider}`);
    }

    const response = await provider.verifyPayment(
      providerReference,
      intent.amount.toString(),
    );
    const status = String(response.metadata?.status || '').toUpperCase();
    if (
      ['COMPLETE', 'COMPLETED', 'SUCCESS', 'SUCCEEDED', 'PAID'].includes(status)
    ) {
      const updated = await this.paymentIntents.transition(
        intentId,
        'SUCCEEDED',
        actorId,
        providerReference,
      );
      if (updated.status === 'SUCCEEDED') {
        await this.paymentIntents.finalizeSuccessfulPayment(
          intentId,
          providerReference,
        );
      }
      return { intent: updated, providerResponse: response };
    }

    if (
      [
        'FAILED',
        'CANCELLED',
        'CANCELED',
        'USER CANCELED',
        'EXPIRED',
        'REFUNDED',
      ].includes(status)
    ) {
      const updated = await this.paymentIntents.transition(
        intentId,
        status === 'FAILED' ? 'FAILED' : 'CANCELLED',
        actorId,
        providerReference,
      );
      await this.paymentIntents.finalizeUnsuccessfulPayment(
        intentId,
        status === 'FAILED' ? 'FAILED' : 'CANCELLED',
      );
      return { intent: updated, providerResponse: response };
    }

    return { intent, providerResponse: response };
  }

  async confirmPaymentByProviderReference(
    providerReference: string,
    actorId?: string,
    expectedProvider?: PaymentProviderName,
  ) {
    const intent =
      await this.paymentIntents.findByProviderReference(providerReference);
    if (!intent)
      throw new Error('Payment intent for provider reference was not found');
    return this.confirmPayment(
      intent.id,
      providerReference,
      actorId,
      expectedProvider,
    );
  }

  async refundPayment(
    intentId: string,
    amount: string,
    idempotencyKey: string,
    actorId?: string,
  ) {
    const intent = await this.paymentIntents.findById(intentId);
    if (!intent) throw new Error(`Payment intent not found: ${intentId}`);
    if (intent.status !== 'SUCCEEDED') {
      throw new Error('Only successful payments can be refunded');
    }
    if (!intent.providerReference) {
      throw new Error('Payment intent has no provider reference');
    }

    const refundAmount = new Prisma.Decimal(amount);
    if (!refundAmount.isFinite() || !refundAmount.isPositive()) {
      throw new Error('Refund amount must be greater than zero');
    }

    const transaction = intent.rescueChargeId
      ? await this.database.financialTransaction.findUnique({
          where: { rescueChargeId: intent.rescueChargeId },
        })
      : intent.donationId
        ? await this.database.financialTransaction.findFirst({
            where: { donationId: intent.donationId },
          })
        : null;
    if (!transaction) throw new Error('Financial transaction not found');
    if (refundAmount.greaterThan(transaction.grossAmount)) {
      throw new Error('Refund amount cannot exceed the transaction amount');
    }
    const existingRefund = await this.database.refund.findUnique({
      where: { idempotencyKey },
    });
    if (existingRefund) {
      if (
        existingRefund.transactionId !== transaction.id ||
        !new Prisma.Decimal(existingRefund.amount).equals(refundAmount)
      ) {
        throw new Error(
          'Idempotency key is already associated with another refund',
        );
      }
      return { intent, refund: existingRefund };
    }

    const provider = this.providers.get(intent.provider as PaymentProviderName);
    if (!provider) {
      throw new Error(`Payment provider is not configured: ${intent.provider}`);
    }
    const response = await provider.refundPayment(
      intent.providerReference,
      amount,
    );
    const refundStatus = String(response.metadata?.status || '').toUpperCase();
    const completed = ['SUCCEEDED', 'COMPLETED', 'SUCCESS'].includes(
      refundStatus,
    );
    const fullyRefunded = refundAmount.equals(transaction.grossAmount);

    return this.database.$transaction(async (databaseTransaction) => {
      const refund = await databaseTransaction.refund.create({
        data: {
          transactionId: transaction.id,
          amount: refundAmount,
          currency: transaction.currency,
          providerReference: response.providerReference,
          idempotencyKey,
          status: completed ? 'COMPLETED' : 'PENDING',
          createdById: actorId,
          processedAt: completed ? new Date() : null,
        },
      });

      if (completed) {
        const nextStatus = fullyRefunded ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
        await databaseTransaction.financialTransaction.update({
          where: { id: transaction.id },
          data: { status: nextStatus },
        });
        if (intent.rescueChargeId) {
          await databaseTransaction.rescueCharge.update({
            where: { id: intent.rescueChargeId },
            data: { status: nextStatus },
          });
        }
        if (intent.donationId && fullyRefunded) {
          await databaseTransaction.donation.update({
            where: { id: intent.donationId },
            data: {
              status: 'REFUNDED',
              refundedAt: new Date(),
              refundAmount: Number(refundAmount.toString()),
            },
          });
        }
      }

      await databaseTransaction.financialAuditEvent.create({
        data: {
          actorId,
          action: completed ? 'PAYMENT_REFUNDED' : 'PAYMENT_REFUND_PENDING',
          entityType: 'Refund',
          entityId: refund.id,
          amount: refundAmount,
          currency: transaction.currency,
          newState: {
            status: refund.status,
            providerReference: response.providerReference,
          },
        },
      });
      return { intent, refund };
    });
  }

  getProvider(name: PaymentProviderName) {
    return this.providers.get(name);
  }
}
