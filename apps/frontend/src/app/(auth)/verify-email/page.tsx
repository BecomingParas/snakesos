import { Suspense } from 'react'
import { VerifyEmailClient } from '@/components/auth/verify-email-client'

export const metadata = {
  title: 'Verify Email - SnakeSOS',
  description: 'Verify your email address to activate your account',
}

// Opt out of static generation since this page uses Apollo Client hooks
export const dynamic = 'force-dynamic'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  )
}
