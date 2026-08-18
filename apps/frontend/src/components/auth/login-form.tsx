'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useLogin } from '@/hooks/auth'
import { loginSchema, type LoginFormData } from '@/schemas/auth'
import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { getUserFriendlyErrorMessage } from '@/lib/graphql'

export function LoginForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const { login, loading: isSubmitting } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      })
      
      // Check if email is verified
      if (!result.user.emailVerified) {
        toast.warning('Email not verified', {
          description: 'Please verify your email to continue. Sending verification code...',
        })
        
        // Redirect to verify-email page with auto-resend
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}&resend=true`)
        return
      }
      
      toast.success('Welcome back!', {
        description: 'You have successfully signed in',
      })
      
      // Map role to dashboard route
      const roleMap: Record<string, string> = {
        'ADMIN': 'admin',
        'SUPER_ADMIN': 'admin',
        'DISTRICT_COORDINATOR': 'admin',
        'VERIFIED_RESCUER': 'rescuer',
        'VOLUNTEER': 'rescuer',
        'CITIZEN': 'citizen',
      }
      
      const dashboardPath = roleMap[result.user.role] || 'citizen'
      router.push(`/dashboard/${dashboardPath}`)
    } catch (error: any) {
      if (error.field) {
        setError(error.field as keyof LoginFormData, {
          type: 'server',
          message: error.message,
        })
      } else {
        toast.error('Sign in failed', {
          description: getUserFriendlyErrorMessage(error),
        })
      }
    }
  }

  return (
    <>
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6 p-1 bg-secondary rounded-lg">
        <button
          type="button"
          onClick={() => setActiveTab('signin')}
          className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'signin'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('signup')
            router.push('/signup')
          }}
          className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'signup'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
            className={`h-9 ${
              errors.email ? 'border-destructive' : ''
            }`}
            {...register('email')}
          />
          {errors.email?.message && (
            <p id="email-error" role="alert" className="text-xs text-destructive mt-0.5">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-foreground font-medium text-sm">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:text-primary/80 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={`h-9 ${
              errors.password ? 'border-destructive' : ''
            }`}
            {...register('password')}
          />
          {errors.password?.message && (
            <p id="password-error" role="alert" className="text-xs text-destructive mt-0.5">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full h-9 font-medium shadow-sm mt-4 text-sm" 
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In */}
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
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:text-primary/80 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </>
  )
}
