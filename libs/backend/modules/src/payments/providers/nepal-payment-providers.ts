import { createHmac } from 'node:crypto';
import {
  PaymentProviderError,
  type PaymentProvider,
  type PaymentProviderRequest,
  type PaymentProviderResponse,
} from '../payments.types';

const ESEWA_DEFAULT_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const KHALTI_DEFAULT_URL = 'https://a.khalti.com/api/v2/epayment/initiate/';
const KHALTI_LOOKUP_URL = 'https://a.khalti.com/api/v2/epayment/lookup/';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for payment provider`);
  return value;
}

function toMinorUnits(value: string): bigint {
  const [whole = '0', fraction = ''] = value.split('.');
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0').slice(0, 2));
}

async function parseProviderResponse(
  response: Response,
  provider: 'ESEWA' | 'KHALTI',
): Promise<Record<string, unknown>> {
  const body = await response.text();
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(body) as Record<string, unknown>;
  } catch {
    parsed = { raw: body };
  }
  if (!response.ok) {
    throw new PaymentProviderError(
      `${provider} request failed with status ${response.status}`,
      provider,
      response.status >= 500,
    );
  }
  return parsed;
}

export class EsewaPaymentProvider implements PaymentProvider {
  readonly name = 'ESEWA' as const;

  async createPayment(
    input: PaymentProviderRequest,
  ): Promise<PaymentProviderResponse> {
    const productCode = required('ESEWA_PRODUCT_CODE');
    const secretKey = required('ESEWA_SECRET_KEY');
    const totalAmount = input.amount;
    const signaturePayload = `total_amount=${totalAmount},transaction_uuid=${input.paymentIntentId},product_code=${productCode}`;
    const signature = createHmac('sha256', secretKey)
      .update(signaturePayload)
      .digest('base64');
    const params = new URLSearchParams({
      amount: totalAmount,
      tax_amount: '0',
      total_amount: totalAmount,
      transaction_uuid: input.paymentIntentId,
      product_code: productCode,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: required('ESEWA_SUCCESS_URL'),
      failure_url: required('ESEWA_FAILURE_URL'),
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    });

    return {
      providerReference: input.paymentIntentId,
      checkoutUrl: `${process.env.ESEWA_CHECKOUT_URL || ESEWA_DEFAULT_URL}?${params.toString()}`,
      metadata: {
        signedFieldNames: 'total_amount,transaction_uuid,product_code',
      },
    };
  }

  async verifyPayment(
    providerReference: string,
    amount?: string,
  ): Promise<PaymentProviderResponse> {
    if (!amount) {
      throw new PaymentProviderError(
        'eSewa verification requires the intent amount',
        this.name,
      );
    }
    const productCode = required('ESEWA_PRODUCT_CODE');
    const response = await fetch(
      `${process.env.ESEWA_STATUS_URL || 'https://rc-epay.esewa.com.np/api/epay/transaction/status/'}?product_code=${encodeURIComponent(productCode)}&total_amount=${encodeURIComponent(amount)}&transaction_uuid=${encodeURIComponent(providerReference)}`,
    );
    const body = await parseProviderResponse(response, this.name);
    return { providerReference, metadata: body };
  }

  async refundPayment(): Promise<PaymentProviderResponse> {
    throw new PaymentProviderError(
      'eSewa refunds require a merchant-specific settlement workflow',
      this.name,
    );
  }
}

export class KhaltiPaymentProvider implements PaymentProvider {
  readonly name = 'KHALTI' as const;

  async createPayment(
    input: PaymentProviderRequest,
  ): Promise<PaymentProviderResponse> {
    const response = await fetch(
      process.env.KHALTI_INITIATE_URL || KHALTI_DEFAULT_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Key ${required('KHALTI_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          return_url: input.returnUrl || required('KHALTI_RETURN_URL'),
          website_url: required('KHALTI_WEBSITE_URL'),
          amount: Number(toMinorUnits(input.amount)),
          purchase_order_id: input.paymentIntentId,
          purchase_order_name:
            input.metadata?.purchaseOrderName || 'SnakeSOS rescue payment',
        }),
      },
    );
    const body = await parseProviderResponse(response, this.name);
    const providerReference = String(body.pidx || '');
    if (!providerReference || typeof body.payment_url !== 'string') {
      throw new PaymentProviderError(
        'Khalti returned an invalid payment response',
        this.name,
      );
    }
    return {
      providerReference,
      checkoutUrl: body.payment_url,
      metadata: body,
    };
  }

  async verifyPayment(providerReference: string): Promise<PaymentProviderResponse> {
    const response = await fetch(
      process.env.KHALTI_LOOKUP_URL || KHALTI_LOOKUP_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Key ${required('KHALTI_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pidx: providerReference }),
      },
    );
    const body = await parseProviderResponse(response, this.name);
    return { providerReference, metadata: body as Record<string, string> };
  }

  async refundPayment(): Promise<PaymentProviderResponse> {
    throw new PaymentProviderError(
      'Khalti refunds require a merchant-specific settlement workflow',
      this.name,
    );
  }
}
