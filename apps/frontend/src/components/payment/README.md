# Payment Method Selector Component

A reusable payment method selector component for the Snake Rescue application, supporting eSewa, Khalti, and Bank Transfer payment methods.

## Features

- 🎨 Clean, modern UI matching the app design
- ✅ Single-selection radio-style interface
- 🖼️ Payment method logos from `/public/wallets`
- ♿ Accessible and keyboard-friendly
- 📱 Fully responsive design
- 🎯 TypeScript support with proper types

## Usage

### Basic Example

```tsx
import { PaymentMethodSelector, PaymentMethod } from '@/components/payment';

function MyComponent() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>();

  const handleSelect = (method: PaymentMethod) => {
    console.log('Selected:', method);
    setSelectedMethod(method);
  };

  return (
    <PaymentMethodSelector
      onSelect={handleSelect}
      selectedMethod={selectedMethod}
    />
  );
}
```

### With Controlled State

```tsx
import { PaymentMethodSelector, PaymentMethod } from '@/components/payment';

function DonationForm() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('esewa');

  return (
    <PaymentMethodSelector
      selectedMethod={paymentMethod}
      onSelect={setPaymentMethod}
    />
  );
}
```

### Disabled State

```tsx
<PaymentMethodSelector
  selectedMethod={selectedMethod}
  onSelect={handleSelect}
  disabled={isProcessing}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSelect` | `(method: PaymentMethod) => void` | `undefined` | Callback when a payment method is selected |
| `selectedMethod` | `PaymentMethod` | `undefined` | Currently selected payment method |
| `disabled` | `boolean` | `false` | Disables the selector |

## Types

```typescript
type PaymentMethod = 'esewa' | 'khalti' | 'bank';

interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  description: string;
  logo: string;
}
```

## Payment Methods

### 1. eSewa
- **ID**: `esewa`
- **Name**: eSewa
- **Description**: @snakesos01
- **Logo**: `/wallets/esewa.png`

### 2. Khalti
- **ID**: `khalti`
- **Name**: Khalti
- **Description**: khalti.com
- **Logo**: `/wallets/khalti.png`

### 3. Bank Transfer
- **ID**: `bank`
- **Name**: Bank Transfer
- **Description**: Nepal Bank
- **Logo**: `/wallets/bank.jpg`

## Styling

The component uses Tailwind CSS and matches the app's dark theme:
- Background: `#0d1a1a` (unselected), `#1a2a2a` (selected)
- Border: Emerald (`#10b981`) for selected state
- Text: White primary, gray secondary

## Integration with Payment Gateways

The component only handles UI selection. You'll need to integrate with actual payment gateways:

### eSewa Integration
```typescript
if (method === 'esewa') {
  // Initialize eSewa payment
  window.location.href = `https://esewa.com.np/epay/main?tAmt=${amount}&amt=${amount}&txAmt=0&psc=0&pdc=0&scd=SNAKESOS&pid=${orderId}&su=${successUrl}&fu=${failureUrl}`;
}
```

### Khalti Integration
```typescript
if (method === 'khalti') {
  // Initialize Khalti payment
  const checkout = new KhaltiCheckout({
    publicKey: process.env.NEXT_PUBLIC_KHALTI_PUBLIC_KEY,
    productIdentity: orderId,
    productName: "Snake Rescue Donation",
    amount: amount * 100, // Amount in paisa
    onSuccess: handleKhaltiSuccess,
    onError: handleKhaltiError,
  });
  checkout.show();
}
```

### Bank Transfer
For bank transfer, you'd typically show bank account details and ask for transaction reference:

```typescript
if (method === 'bank') {
  // Show bank details modal
  showBankDetailsModal({
    bankName: "Nepal Bank Limited",
    accountName: "Snake Rescue Nepal",
    accountNumber: "XXXX-XXXX-XXXX",
  });
}
```

## Example Page

See `apps/frontend/src/app/(dashboard)/dashboard/donate/page.tsx` for a complete example with:
- Amount input
- Quick amount selection
- Payment method selector
- Proceed to payment button
- Information section

## Logo Requirements

Place payment gateway logos in `apps/frontend/public/wallets/`:
- `esewa.png` - eSewa logo
- `khalti.png` - Khalti logo
- `bank.jpg` - Bank/generic payment logo

Recommended logo size: 200x200px (will be scaled to 56x56px)

## Accessibility

- Keyboard navigation support
- Proper ARIA labels
- Visual feedback for selection
- Disabled state handling
- Focus management

## Browser Support

- Modern browsers with ES6+ support
- Next.js 14+ required for Image component
- Tailwind CSS 3+ for styling
