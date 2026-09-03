import Stripe from 'stripe';
import {
  PaymentProviderError,
  type PaymentProvider,
  type PaymentProviderRequest,
  type PaymentProviderResponse,
} from '../payments.types';

export class StripePaymentProvider implements PaymentProvider {
  readonly name = 'STRIPE' as const;
  private readonly stripe: Stripe;

  constructor(secretKey = process.env.STRIPE_SECRET_KEY) {
    if (!secretKey) {
      throw new PaymentProviderError(
        'STRIPE_SECRET_KEY is required for the active development provider',
        this.name,
      );
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2026-07-29.dahlia',
      typescript: true,
    });
  }

  async createPayment(
    input: PaymentProviderRequest,
  ): Promise<PaymentProviderResponse> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: input.currency.toLowerCase(),
            product_data: { name: 'SnakeSOS rescue payment' },
            unit_amount: Number(toMinorUnits(input.amount)),
          },
          quantity: 1,
        },
      ],
      success_url:
        input.returnUrl ||
        process.env.STRIPE_SUCCESS_URL ||
        'http://localhost:4200/payment/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url:
        process.env.STRIPE_CANCEL_URL ||
        'http://localhost:4200/payment/cancelled',
      metadata: {
        paymentIntentId: input.paymentIntentId,
        ...Object.fromEntries(
          Object.entries(input.metadata || {}).map(([key, value]) => [
            key,
            String(value),
          ]),
        ),
      },
    });

    if (!session.url) {
      throw new PaymentProviderError(
        'Stripe did not return a checkout URL',
        this.name,
      );
    }
    return {
      providerReference: session.id,
      checkoutUrl: session.url,
      metadata: { sessionId: session.id },
    };
  }

  async verifyPayment(
    providerReference: string,
  ): Promise<PaymentProviderResponse> {
    const session =
      await this.stripe.checkout.sessions.retrieve(providerReference);
    return {
      providerReference,
      metadata: {
        status:
          session.payment_status === 'paid' ||
          session.payment_status === 'no_payment_required'
            ? 'SUCCEEDED'
            : session.status === 'expired'
              ? 'FAILED'
              : 'PENDING',
        paymentStatus: session.payment_status,
      },
    };
  }

  async refundPayment(
    providerReference: string,
    amount: string,
  ): Promise<PaymentProviderResponse> {
    const session =
      await this.stripe.checkout.sessions.retrieve(providerReference);
    if (!session.payment_intent || typeof session.payment_intent !== 'string') {
      throw new PaymentProviderError(
        'Stripe session has no payment intent to refund',
        this.name,
      );
    }
    const refund = await this.stripe.refunds.create({
      payment_intent: session.payment_intent,
      amount: Number(toMinorUnits(amount)),
    });
    return {
      providerReference: refund.id,
      metadata: { status: refund.status || 'PENDING' },
    };
  }
}

function toMinorUnits(value: string): bigint {
  const [whole = '0', fraction = ''] = value.split('.');
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0').slice(0, 2));
}
