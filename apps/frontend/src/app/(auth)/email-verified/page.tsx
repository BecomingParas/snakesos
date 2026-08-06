'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, SuccessAnimation } from '@snake-rescue/ui';
import { AuthLayout } from '../../../components/auth/AuthLayout';
import { AuthCard } from '../../../components/auth/AuthCard';

export default function EmailVerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/complete-profile');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <AuthLayout>
      <AuthCard title="" subtitle="">
        <SuccessAnimation
          title="Email Verified!"
          message="Your email has been successfully verified. You can now complete your profile and start using SnakeSOS."
        />

        <div className="mt-8 space-y-3">
          <Button
            onClick={() => router.push('/complete-profile')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-6 rounded-xl"
          >
            Complete Your Profile
          </Button>

          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/5 py-6 rounded-xl"
          >
            Skip for Now
          </Button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Redirecting in 3 seconds...
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
