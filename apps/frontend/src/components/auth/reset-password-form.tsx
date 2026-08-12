'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useResetPassword } from '@/hooks/auth'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/auth'
import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { getUserFriendlyErrorMessage } from '@/lib/graphql'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(false)
  const { resetPassword: resetPasswordMutation, loading: isSubmitting } = useResetPassword()

  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid reset link', {
        description: 'The password reset token is missing',
      })
      return
    }

    try {
      await resetPasswordMutation({
        token,
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

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          The password reset link is missing or invalid. Please request a new
          password reset link.
        </p>

        <Button
          variant="default"
          className="w-full"
          onClick={() => router.push('/forgot-password')}
        >
          Request New Link
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/login')}
        >
          Back to Sign In
        </Button>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>

        <p className="text-sm text-muted-foreground">
          Your password has been successfully reset. You can now sign in with
          your new password.
        </p>

        <Button
          variant="default"
          className="w-full"
          onClick={() => router.push('/login')}
        >
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">
          New Password <span className="text-destructive">*</span>
        </Label>
        <PasswordInput
          id="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
          className={errors.password ? 'border-destructive' : ''}
          {...register('password')}
        />
        {errors.password?.message && (
          <p id="password-error" role="alert" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Must contain uppercase, lowercase, and number
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          Confirm New Password <span className="text-destructive">*</span>
        </Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          className={errors.confirmPassword ? 'border-destructive' : ''}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword?.message && (
          <p id="confirmPassword-error" role="alert" className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Reset Password
      </Button>
    </form>
  )
}
