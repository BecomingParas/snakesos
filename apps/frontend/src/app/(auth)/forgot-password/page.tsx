import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata = {
  title: 'Forgot Password - SnakeSOS',
  description: 'Reset your SnakeSOS password',
}

// Opt out of static generation since this page uses Apollo Client hooks
export const dynamic = 'force-dynamic'

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
