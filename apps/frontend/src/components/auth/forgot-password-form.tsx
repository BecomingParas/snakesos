'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { useForgotPassword } from '@/hooks/auth'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { getUserFriendlyErrorMessage } from '@/lib/graphql'

export function ForgotPasswordForm() {
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)
  const { forgotPassword, loading: isSubmitting } = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email)
      setIsSuccess(true)
      toast.success('Reset link sent!', {
        description: 'Check your email for password reset instructions',
      })
    } catch (error: any) {
      toast.error('Request failed', {
        description: getUserFriendlyErrorMessage(error),
      })
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            We've sent a password reset link to:
          </p>
          <p className="font-medium">{getValues('email')}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          Click the link in the email to reset your password. If you don't see
          the email, check your spam folder.
        </p>

        <div className="space-y-2 pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">
          Email Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={errors.email ? 'border-destructive' : ''}
          {...register('email')}
        />
        {errors.email?.message && (
          <p id="email-error" role="alert" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send Reset Link
      </Button>

      <div className="text-center pt-4">
        <Link
          href="/login"
          className="text-sm text-primary hover:underline"
        >
          ← Back to Sign In
        </Link>
      </div>
    </form>
  )
}
