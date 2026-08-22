'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle2, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useResetPassword } from '@/hooks/auth'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/auth'
import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { getUserFriendlyErrorMessage } from '@/lib/graphql'
import { TwoColumnAuthLayout } from '@/components/auth/two-column-layout'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(false)
  const { resetPassword: resetPasswordMutation, loading: isSubmitting } = useResetPassword()

  const email = searchParams.get('email')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email) {
      toast.error('Invalid request', {
        description: 'Email is missing from the reset link',
      })
      return
    }

    try {
      await resetPasswordMutation({
        email,
        code: data.code,
        newPassword: data.password,
      })
      setIsSuccess(true)
      toast.success('Password reset successful!', {
        description: 'You can now sign in with your new password',
      })
    } catch (error: any) {
      toast.error('Password reset failed', {
        description: getUserFriendlyErrorMessage(error),
      })
    }
  }

  if (!email) {
    return (
      <TwoColumnAuthLayout title="Invalid Reset Link">
        <div className="space-y-6">
          {/* Error Icon */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Invalid Reset Link
            </h1>
            
            <p className="mt-2 text-sm text-muted-foreground">
              The password reset link is missing email information
            </p>
          </div>

          {/* Info Box */}
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Link invalid</p>
                <p className="text-yellow-700">
                  Please start the password reset process again from the forgot password page.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="default"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push('/forgot-password')}
            >
              Request New Reset Link
            </Button>

            <Button
              variant="outline"
              className="w-full h-11"
              onClick={() => router.push('/login')}
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      </TwoColumnAuthLayout>
    )
  }

  if (isSuccess) {
    return (
      <TwoColumnAuthLayout title="Password Reset Successful">
        <div className="space-y-6">
          {/* Success Icon */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Password Reset Complete!
            </h1>
            
            <p className="mt-2 text-sm text-muted-foreground">
              Your password has been successfully reset
            </p>
          </div>

          {/* Success Message */}
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">All set!</p>
                <p className="text-green-700">
                  You can now sign in with your new password. 
                  Make sure to keep it secure and don't share it with anyone.
                </p>
              </div>
            </div>
          </div>

          {/* Action */}
          <Button
            variant="default"
            className="w-full h-11 bg-green-600 hover:bg-green-700"
            onClick={() => router.push('/login')}
          >
            Continue to Sign In
          </Button>
        </div>
      </TwoColumnAuthLayout>
    )
  }

  return (
    <TwoColumnAuthLayout title="Reset Your Password">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <KeyRound className="h-8 w-8 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create New Password
          </h1>
          
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a 6-digit code to <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-foreground font-medium">
              Verification Code
            </Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              maxLength={6}
              autoComplete="off"
              aria-invalid={Boolean(errors.code)}
              aria-describedby={errors.code ? 'code-error' : undefined}
              className={`h-11 text-center text-lg tracking-widest text-foreground placeholder:text-muted-foreground ${errors.code ? 'border-red-500' : ''}`}
              {...register('code')}
            />
            {errors.code?.message && (
              <p id="code-error" role="alert" className="text-sm text-red-600">
                {errors.code.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              New Password
            </Label>
            <PasswordInput
              id="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={`h-11 text-foreground placeholder:text-muted-foreground ${errors.password ? 'border-red-500' : ''}`}
              {...register('password')}
            />
            {errors.password?.message && (
              <p id="password-error" role="alert" className="text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground font-medium">
              Confirm New Password
            </Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              className={`h-11 text-foreground placeholder:text-muted-foreground ${errors.confirmPassword ? 'border-red-500' : ''}`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword?.message && (
              <p id="confirmPassword-error" role="alert" className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium" 
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </form>

        {/* Security Info */}
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Password requirements</p>
              <ul className="text-blue-700 list-disc list-inside space-y-1">
                <li>At least 8 characters long</li>
                <li>Contains uppercase letter (A-Z)</li>
                <li>Contains lowercase letter (a-z)</li>
                <li>Contains number (0-9)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center pt-4 border-t">
          <Button
            variant="ghost"
            onClick={() => router.push('/forgot-password')}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Didn't receive code? Request new one
          </Button>
        </div>
      </div>
    </TwoColumnAuthLayout>
  )
}
