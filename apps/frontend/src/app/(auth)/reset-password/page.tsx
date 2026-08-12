import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { AuthLayout } from '@/components/auth/auth-layout'

export const metadata = {
  title: 'Reset Password - SnakeSOS',
  description: 'Create a new password for your account',
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password below"
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}
