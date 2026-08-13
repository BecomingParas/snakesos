'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TwoColumnAuthLayout } from '@/components/auth/two-column-layout'
import { useVerifyEmail } from '@/hooks/auth'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const shouldAutoResend = searchParams.get('resend') === 'true'
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const { verifyEmail } = useVerifyEmail()

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Auto-resend OTP if coming from login with unverified email
  useEffect(() => {
    if (shouldAutoResend && email && !isResending) {
      handleResend()
    }
  }, [shouldAutoResend, email])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits entered
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    // Check if it's a 6-digit code
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('')
      setCode(digits)
      inputRefs.current[5]?.focus()
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (verificationCode: string) => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter all 6 digits')
      return
    }

    if (!email) {
      toast.error('Email is required', {
        description: 'Please provide your email address',
      })
      return
    }

    setIsVerifying(true)

    try {
      await verifyEmail(email, verificationCode)

      toast.success('Email verified successfully!', {
        description: 'Please login to continue...',
      })

      // Redirect to login page after 1.5 seconds
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error) {
      toast.error('Verification failed', {
        description: error instanceof Error ? error.message : 'Invalid or expired code',
      })
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      toast.error('Email address is required')
      return
    }

    setIsResending(true)

    try {
      // Call resend verification mutation using correct GraphQL endpoint
      const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql'
      
      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation ResendVerification($input: ResendVerificationInput!) {
              resendVerification(input: $input) {
                success
                message
              }
            }
          `,
          variables: {
            input: { email },
          },
        }),
      })

      const data = await response.json()

      if (data.errors) {
        throw new Error(data.errors[0].message)
      }

      toast.success('Verification code sent!', {
        description: 'Please check your email inbox',
      })
    } catch (error) {
      toast.error('Failed to resend code', {
        description: error instanceof Error ? error.message : 'Please try again later',
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <TwoColumnAuthLayout title="Verify Your Email">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Verify Your Email
          </h1>
          
          <p className="mt-2 text-sm text-slate-600">
            We've sent a 6-digit verification code to
          </p>
          
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {email}
          </p>
        </div>

        {/* 6-Digit Code Input */}
        <div className="space-y-4">
          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isVerifying}
                className="h-14 w-12 rounded-lg border-2 border-slate-300 text-center text-2xl font-bold text-slate-900 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            onClick={() => handleVerify(code.join(''))}
            disabled={code.some(d => !d) || isVerifying}
            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Verify Email
              </>
            )}
          </Button>
        </div>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-green-600 hover:text-green-700 disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend'}
            </button>
          </p>
        </div>

        {/* Info Box */}
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Check your spam folder</p>
              <p className="text-blue-700">
                If you don't see the email in your inbox, please check your spam or junk folder. 
                The email will expire in 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center pt-4 border-t">
          <Link 
            href="/login" 
            className="text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </TwoColumnAuthLayout>
  )
}
