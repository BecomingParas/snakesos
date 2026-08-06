'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button, InputOTP, InputOTPGroup, InputOTPSlot } from '@snake-rescue/ui';
import { AuthLayout } from '../../../components/auth/AuthLayout';
import { AuthCard } from '../../../components/auth/AuthCard';

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    // Return undefined for other cases to satisfy TypeScript
    return undefined;
  }, [countdown, canResend]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a complete 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - replace with actual GraphQL mutation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate OTP validation
      if (otp === '123456') {
        router.push('/email-verified');
      } else {
        setError('Invalid OTP code. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCountdown(60);
    setCanResend(false);
    setOtp('');
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Enter Verification Code"
        subtitle="We've sent a 6-digit code to your phone number"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Phone Number Display */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Code sent to{' '}
              <span className="text-white font-semibold">+977 98XXXXXXXX</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Countdown Timer */}
          <div className="text-center">
            {!canResend ? (
              <p className="text-gray-500 text-sm">
                Resend code in{' '}
                <span className="text-emerald-400 font-semibold">
                  {countdown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
              >
                Resend Code
              </button>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>

          {/* Help Text */}
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-gray-500 text-xs mb-3">
              Didn't receive the code? Check your phone or request a new one.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Phone Number
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
