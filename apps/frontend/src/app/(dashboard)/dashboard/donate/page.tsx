'use client';

import { useState } from 'react';
import { PaymentMethod, PaymentMethodSelector } from '@/components/payment';

// Force this page to be dynamically rendered, not statically generated
export const dynamic = 'force-dynamic';

export default function DonatePage() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>();
  const [amount, setAmount] = useState<string>('');

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    console.log('Selected payment method:', method);
  };

  const handleProceed = () => {
    if (!selectedMethod || !amount) {
      alert('Please select a payment method and enter an amount');
      return;
    }

    console.log('Processing payment:', {
      method: selectedMethod,
      amount: parseFloat(amount),
    });

    // Here you would integrate with actual payment gateways
    switch (selectedMethod) {
      case 'esewa':
        alert(`Redirecting to eSewa for payment of NPR ${amount}`);
        break;
      case 'khalti':
        alert(`Redirecting to Khalti for payment of NPR ${amount}`);
        break;
      case 'stripe':
        window.location.href = `/donate?amount=${encodeURIComponent(amount)}&method=stripe`;
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a1a] via-[#0d2020] to-[#0a1a1a] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Support Snake Rescue
          </h1>
          <p className="text-gray-400">
            Your donation helps us rescue and protect snakes across Nepal
          </p>
        </div>

        {/* Amount Input */}
        <div className="bg-[#0d1a1a] border border-gray-700 rounded-xl p-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
            Donation Amount (NPR)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 bg-[#1a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="1"
          />
          
          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[100, 500, 1000, 2000, 5000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="px-4 py-2 bg-[#1a2a2a] border border-gray-600 rounded-lg text-gray-300 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
              >
                NPR {quickAmount}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Selector */}
        <PaymentMethodSelector
          onSelect={handlePaymentMethodSelect}
          selectedMethod={selectedMethod}
        />

        {/* Proceed Button */}
        <div className="flex justify-center">
          <button
            onClick={handleProceed}
            disabled={!selectedMethod || !amount}
            className={`
              px-8 py-3 rounded-lg font-medium transition-all duration-200
              ${
                selectedMethod && amount
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Proceed to Payment
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-[#0d1a1a] border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-3">
            Why Donate?
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">✓</span>
              <span>Support 24/7 snake rescue operations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">✓</span>
              <span>Fund equipment and training for rescuers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">✓</span>
              <span>Support conservation and education programs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">✓</span>
              <span>Help maintain rescue facilities and resources</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
