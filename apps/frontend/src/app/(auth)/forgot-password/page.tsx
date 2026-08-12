import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { AuthLayout } from '@/components/auth/auth-layout'

export const metadata = {
  title: 'Forgot Password - SnakeSOS',
  description: 'Reset your SnakeSOS password',
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a reset link"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
