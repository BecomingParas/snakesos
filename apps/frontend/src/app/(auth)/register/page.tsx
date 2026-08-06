'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Loader2, AlertCircle, Github } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import {
  Button,
  Label,
  EmailInput,
  PhoneInput,
  SocialButton,
  Divider,
} from '@snake-rescue/ui';
import { AuthLayout } from '../../../components/auth/AuthLayout';
import { AuthCard } from '../../../components/auth/AuthCard';
import { PasswordInput } from '../../../components/auth/PasswordInput';
import { useAuth } from '@snake-rescue/features';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
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

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
      });
      router.push('/verify-email');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider} - Coming soon`);
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Create Account"
        subtitle="Join our wildlife rescue community and help save lives"
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

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <EmailInput
            id="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          {/* Phone */}
          <PhoneInput
            id="phone"
            label="Phone Number (Optional)"
            placeholder="+977 98XXXXXXXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password <span className="text-red-400">*</span>
            </Label>
            <PasswordInput
              id="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirm Password <span className="text-red-400">*</span>
            </Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
            />
            <Label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer">
              I agree to the{' '}
              <Link
                href="/terms"
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                Privacy Policy
              </Link>
            </Label>
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Divider */}
          <Divider text="or continue with" />

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <SocialButton
              icon={<FcGoogle className="w-5 h-5" />}
              provider="Google"
              onClick={() => handleSocialLogin('Google')}
            >
              Google
            </SocialButton>
            <SocialButton
              icon={<Github className="w-5 h-5" />}
              provider="GitHub"
              onClick={() => handleSocialLogin('GitHub')}
            >
              GitHub
            </SocialButton>
          </div>

          {/* Login Link */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a1512] text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          <Link href="/login">
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/5 py-6 rounded-xl"
            >
              Sign In Instead
            </Button>
          </Link>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
