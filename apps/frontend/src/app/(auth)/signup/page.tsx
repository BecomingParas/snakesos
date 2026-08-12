import { SignupForm } from '@/components/auth/signup-form'
import { TwoColumnAuthLayout } from '@/components/auth/two-column-layout'

export const metadata = {
  title: 'Sign Up - SnakeSOS',
  description: 'Create your SnakeSOS account',
}

export default function SignupPage() {
  return (
    <TwoColumnAuthLayout
      title="Create Account"
      subtitle="Join our wildlife rescue community today"
    >
      <SignupForm />
    </TwoColumnAuthLayout>
  )
}
