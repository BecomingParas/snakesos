import { Suspense } from 'react';
import { DonationSuccessClient } from '@/components/donate/donation-success-client';

export const metadata = {
  title: 'Donation Successful - SnakeSOS',
  description: 'Thank you for your generous donation',
};

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <DonationSuccessClient />
    </Suspense>
  );
}
