'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Github } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import {
  Button,
  Label,
  EmailInput,
  SocialButton,
  Divider,
} from '@snake-rescue/ui';
import { AuthLayout } from '../../../components/auth/AuthLayout';
import { AuthCard } from '../../../components/auth/AuthCard';
import { PasswordInput } from '../../../components/auth/PasswordInput';
import { useAuth } from '@snake-rescue/features';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider} - Coming soon`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to access your account and continue rescue operations"
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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
            />
            <Label
              htmlFor="remember"
              className="text-sm text-gray-400 cursor-pointer"
            >
              Remember me for 30 days
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
                Signing in...
              </>
            ) : (
              'Sign In'
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

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a1512] text-gray-500">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link href="/register">
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/5 py-6 rounded-xl"
            >
              Create New Account
            </Button>
          </Link>
        </form>

        {/* Additional Links */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 text-xs">
            Need help?{' '}
            <a
              href="tel:9856034050"
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Call 9856034050
            </a>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
