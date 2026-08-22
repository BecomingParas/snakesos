'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSignup } from '@/hooks/auth'
import { signupSchema, type SignupFormData } from '@/schemas/auth'
import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { getUserFriendlyErrorMessage } from '@/lib/graphql'

export function SignupForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup')
  const { signup, loading: isSubmitting } = useSignup()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      toast.success('Account created successfully!', {
        description: 'Please check your email for verification code',
      })
      
      // Redirect to verify-email page with the user's email
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch (error: unknown) {
      // Handle duplicate email error - check message content
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string' &&
        (error.message.toLowerCase().includes('already exists') ||
         error.message.toLowerCase().includes('already registered'))
      ) {
        setError('email', {
          type: 'server',
          message: 'This email is already registered',
        })
        toast.error('Email already exists', {
          description: 'Please use a different email or try logging in',
        })
        return
      }
      
      toast.error('Registration failed', {
        description: getUserFriendlyErrorMessage(error),
      })
    }
  }

  return (
    <>
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6 p-1 bg-secondary rounded-lg">
        <button
          type="button"
          onClick={() => {
            setActiveTab('signin')
            router.push('/login')
          }}
          className="flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all signin-button"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('signup')}
          className="flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all signup-button"
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name" className="text-foreground font-medium text-sm">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className="h-9"
            {...register('name')}
          />
          {errors.name?.message && (
            <p id="name-error" role="alert" className="text-xs text-red-600 mt-0.5">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-foreground font-medium text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="h-9"
            {...register('email')}
          />
          {errors.email?.message && (
            <p id="email-error" role="alert" className="text-xs text-red-600 mt-0.5">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-foreground font-medium text-sm">
            Password
          </Label>
          <PasswordInput
            id="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="h-9"
            {...register('password')}
          />
          {errors.password?.message && (
            <p id="password-error" role="alert" className="text-xs text-red-600 mt-0.5">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-foreground font-medium text-sm">
            Confirm Password
          </Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            className="h-9"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword?.message && (
            <p id="confirmPassword-error" role="alert" className="text-xs text-red-600 mt-0.5">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full h-9 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm mt-4 text-sm" 
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Google Sign Up */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-9 font-medium text-sm"
          onClick={() => toast.info('Google OAuth coming soon!')}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-2 pt-2 border-t">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </form>
    </>
  )
}