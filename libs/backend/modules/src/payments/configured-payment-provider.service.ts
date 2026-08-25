import { PaymentIntentService } from './payment-intent.service.js';
import { PaymentProviderService } from './payment-provider.service.js';
import {
  EsewaPaymentProvider,
  KhaltiPaymentProvider,
} from './providers/nepal-payment-providers.js';
import { StripePaymentProvider } from './providers/stripe-payment-provider.js';

export function createConfiguredPaymentProviderService(
  paymentIntents = new PaymentIntentService(),
): PaymentProviderService {
  const providers = [];

  if (process.env.STRIPE_SECRET_KEY)
    providers.push(new StripePaymentProvider());
  if (process.env.ESEWA_PRODUCT_CODE && process.env.ESEWA_SECRET_KEY) {
    providers.push(new EsewaPaymentProvider());
  }
  if (process.env.KHALTI_SECRET_KEY)
    providers.push(new KhaltiPaymentProvider());

  return new PaymentProviderService(paymentIntents, providers);
}
