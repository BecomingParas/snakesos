'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@snake-rescue/ui';
import { AuthLayout } from '../../../components/auth/AuthLayout';
import { AuthCard } from '../../../components/auth/AuthCard';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [email] = useState('user@example.com'); // This would come from context/state

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return undefined;
  }, [countdown, canResend]);

  const handleResend = async () => {
    setIsResending(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsResending(false);
    setCountdown(60);
    setCanResend(false);
  };

  const handleCheckEmail = () => {
    // Mock verification check - in real app, this would poll or use websockets
    router.push('/email-verified');
  };

  return (
    <AuthLayout>
      <AuthCard title="Verify Your Email" subtitle="">
        <div className="space-y-6">
          {/* Email Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl" />
              <div className="relative w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
                <Mail className="w-10 h-10 text-emerald-400" />
              </div>
            </div>
          </motion.div>

          {/* Message */}
          <div className="text-center space-y-3">
            <p className="text-gray-300 text-sm leading-relaxed">
              We've sent a verification link to
            </p>
            <p className="text-white font-semibold text-lg">{email}</p>
            <p className="text-gray-400 text-sm">
              Click the link in the email to verify your account. The link will
              expire in 24 hours.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleCheckEmail}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-6 rounded-xl"
            >
              I've Verified My Email
            </Button>

            <Button
              onClick={handleResend}
              disabled={!canResend || isResending}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/5 py-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : canResend ? (
                'Resend Verification Email'
              ) : (
                `Resend in ${countdown}s`
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-gray-500 text-xs mb-3">
              Didn't receive the email? Check your spam folder or try a different
              email address.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
