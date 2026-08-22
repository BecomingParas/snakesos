'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2,  KeyRound,  } from 'lucide-react'
import { toast } from 'sonner'
import { useForgotPassword } from '@/hooks/auth'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { getUserFriendlyErrorMessage } from '@/lib/graphql'
import { TwoColumnAuthLayout } from '@/components/auth/two-column-layout'

export function ForgotPasswordForm() {
  const router = useRouter()
  const { forgotPassword, loading: isSubmitting } = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      
      // Redirect directly to reset password page with email (no success page)
      toast.success('Request received!', {
        description: 'Enter your new password',
      })
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`)
    } catch (error: any) {
      toast.error('Request failed', {
        description: getUserFriendlyErrorMessage(error),
      })
    }
  }

  return (
    <TwoColumnAuthLayout title="Forgot Password">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <KeyRound className="h-8 w-8 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Forgot Password?
          </h1>
          
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`h-11 ${errors.email ? 'border-red-500' : ''}`}
              {...register('email')}
            />
            {errors.email?.message && (
              <p id="email-error" role="alert" className="text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium" 
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>

        {/* Back to Login */}
        <div className="text-center pt-4 border-t">
          <Link 
            href="/login" 
            className="text-sm text-muted-foreground hover:text-foreground font-medium"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </TwoColumnAuthLayout>
  )
}
