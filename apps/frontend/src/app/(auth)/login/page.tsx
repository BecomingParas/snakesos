import { LoginForm } from '@/components/auth/login-form'
import { TwoColumnAuthLayout } from '@/components/auth/two-column-layout'

export const metadata = {
  title: 'Sign In - SnakeSOS',
  description: 'Sign in to your SnakeSOS account',
}

export default function LoginPage() {
  return (
    <TwoColumnAuthLayout
      title="Sign In"
      subtitle="Access your SnakeSOS account"
    >
      <LoginForm />
    </TwoColumnAuthLayout>
  )
}
