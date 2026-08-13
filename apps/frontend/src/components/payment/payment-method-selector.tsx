'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export type PaymentMethod = 'esewa' | 'khalti' | 'bank';

export interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  description: string;
  logo: string;
}

interface PaymentMethodSelectorProps {
  onSelect?: (method: PaymentMethod) => void;
  selectedMethod?: PaymentMethod;
  disabled?: boolean;
}

const paymentMethods: PaymentMethodOption[] = [
  {
    id: 'esewa',
    name: 'eSewa',
    description: '@snakesos01',
    logo: '/wallets/esewa.png',
  },
  {
    id: 'khalti',
    name: 'Khalti',
    description: 'khalti.com',
    logo: '/wallets/khalti.png',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    description: 'Nepal Bank',
    logo: '/wallets/bank.jpg',
  },
];

export function PaymentMethodSelector({
  onSelect,
  selectedMethod,
  disabled = false,
}: PaymentMethodSelectorProps) {
  const [selected, setSelected] = useState<PaymentMethod | undefined>(selectedMethod);

  const handleSelect = (method: PaymentMethod) => {
    if (disabled) return;
    setSelected(method);
    onSelect?.(method);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Choose Payment Method
      </h2>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleSelect(method.id)}
            disabled={disabled}
            className={`
              w-full p-4 rounded-xl transition-all duration-200
              flex items-center gap-4
              ${
                selected === method.id
                  ? 'bg-[#1a2a2a] border-2 border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'bg-[#0d1a1a] border-2 border-gray-700 hover:border-gray-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Logo */}
            <div className="w-14 h-14 rounded-lg bg-white/90 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src={method.logo}
                alt={method.name}
                width={56}
                height={56}
                className="object-contain p-1"
              />
            </div>

            {/* Name and Description */}
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-white">{method.name}</h3>
                {method.id === 'esewa' && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                )}
              </div>
              <p className="text-sm text-gray-400">{method.description}</p>
            </div>

            {/* Checkmark */}
            {selected === method.id && (
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
