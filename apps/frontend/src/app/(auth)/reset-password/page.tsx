'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button, Label } from '@snake-rescue/ui';
import { AuthLayout } from '../../../components/auth/AuthLayout';
import { AuthCard } from '../../../components/auth/AuthCard';
import { PasswordInput } from '../../../components/auth/PasswordInput';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid or expired reset link');
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - replace with actual GraphQL mutation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <AuthCard title="Invalid Link" subtitle="">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Invalid or Expired Link
              </h2>
              <p className="text-gray-400 text-sm">
                This password reset link is invalid or has expired.
              </p>
            </div>

            <Link href="/forgot-password">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-6 rounded-xl">
                Request New Link
              </Button>
            </Link>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  if (isSuccess) {
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
              <h2 className="text-2xl font-bold text-white mb-2">
                Password Reset Successfully!
              </h2>
              <p className="text-gray-400 text-sm">
                Your password has been reset. You can now login with your new
                password.
              </p>
            </div>

            <Link href="/login">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-6 rounded-xl">
                Continue to Login
              </Button>
            </Link>

            <p className="text-gray-500 text-xs">Redirecting in 2 seconds...</p>
          </motion.div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Set New Password"
        subtitle="Enter a strong password to secure your account"
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

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              New Password
            </Label>
            <PasswordInput
              id="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <p className="text-xs text-gray-500">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirm New Password
            </Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-6 rounded-xl transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Resetting password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>

          {/* Back to Login */}
          <Link
            href="/login"
            className="flex items-center justify-center text-sm text-emerald-400 hover:text-emerald-300 transition-colors mt-4"
          >
            Back to Login
          </Link>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <AuthCard title="Loading..." subtitle="">
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        </AuthCard>
      </AuthLayout>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
