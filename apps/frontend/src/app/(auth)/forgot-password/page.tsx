'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button, EmailInput } from '@snake-rescue/ui';
import { AuthLayout } from '../../../components/auth/AuthLayout';
import { AuthCard } from '../../../components/auth/AuthCard';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - replace with actual GraphQL mutation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout>
        <AuthCard title="" subtitle="">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl" />
                <div className="relative w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-gray-400 text-sm">
                We've sent a password reset link to
              </p>
              <p className="text-white font-semibold mt-1">{email}</p>
            </div>

            <p className="text-gray-400 text-sm">
              Click the link in the email to reset your password. The link will
              expire in 1 hour.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/5 py-6 rounded-xl"
              >
                Try Different Email
              </Button>

              <Link href="/login">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-6 rounded-xl">
                  Back to Login
                </Button>
              </Link>
            </div>

            <p className="text-gray-500 text-xs pt-4">
              Didn't receive the email? Check your spam folder.
            </p>
          </motion.div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Forgot Password?"
        subtitle="Enter your email and we'll send you a link to reset your password"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Email Field */}
          <EmailInput
            id="email"
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-6 rounded-xl transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>

          {/* Back to Login */}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
