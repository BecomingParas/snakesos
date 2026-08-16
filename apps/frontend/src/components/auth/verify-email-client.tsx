'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail,AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TwoColumnAuthLayout } from '@/components/auth/two-column-layout'
import { useVerifyEmail, useResendVerification } from '@/hooks/auth/useVerifyEmail'

export function VerifyEmailClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const shouldAutoResend = searchParams.get('resend') === 'true'
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [verifyMutationError, setVerifyMutationError] = useState<string | null>(null)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const hasAutoResent = useRef(false)
  
  const { verifyEmail } = useVerifyEmail()
  const { resendVerification } = useResendVerification()

  // Timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
    return undefined
  }, [resendTimer])

  // Auto-resend if flag is set (from registration)
  useEffect(() => {
    if (shouldAutoResend && !hasAutoResent.current && email) {
      hasAutoResent.current = true
      handleResend()
    }
  }, [shouldAutoResend, email])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('')
      const newCode = [...code]
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char
        }
      })
      setCode(newCode)
      
      // Focus last filled input
      const lastIndex = Math.min(index + pastedCode.length - 1, 5)
      inputRefs.current[lastIndex]?.focus()
      
      // Auto-verify if all 6 digits are filled
      if (newCode.every(digit => digit !== '')) {
        handleVerify(newCode.join(''))
      }
      return
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all 6 digits are entered
    if (newCode.every(digit => digit !== '')) {
      handleVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (verificationCode: string) => {
    if (!email) {
      toast.error('Email is required')
      return
    }

    setIsVerifying(true)
    setVerifyMutationError(null)

    try {
      const result = await verifyEmail(email, verificationCode)

      if (result.success) {
        toast.success('Email verified successfully!', {
          description: 'You can now log in to your account',
        })
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else {
        const errorMessage = result.message || 'Invalid verification code'
        setVerifyMutationError(errorMessage)
        toast.error(errorMessage)
        // Clear code on error
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify email'
      setVerifyMutationError(errorMessage)
      toast.error(errorMessage)
      // Clear code on error
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      toast.error('Email is required')
      return
    }

    setIsResending(true)

    try {
      const success = await resendVerification(email)

      if (success) {
        toast.success('Verification code sent!', {
          description: 'Please check your email',
        })
        setCanResend(false)
        setResendTimer(60)
      } else {
        toast.error('Failed to resend code')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification code'
      toast.error(errorMessage)
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return (
      <TwoColumnAuthLayout title="Invalid Request">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mb-4 mx-auto" />
          <p className="text-muted-foreground mb-6">
            No email address provided. Please sign up first.
          </p>
          <Button asChild>
            <Link href="/signup">Go to Sign Up</Link>
          </Button>
        </div>
      </TwoColumnAuthLayout>
    )
  }

  return (
    <TwoColumnAuthLayout 
      title="Verify Your Email"
      subtitle={`We've sent a 6-digit code to ${email}`}
    >
      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleCodeChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className="h-14 w-14 rounded-lg border-2 border-input bg-background text-center text-2xl font-semibold text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              disabled={isVerifying}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {verifyMutationError && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{verifyMutationError}</span>
          </div>
        )}

        {isVerifying && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verifying code...</span>
          </div>
        )}

        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={!canResend || isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : canResend ? (
              'Resend Code'
            ) : (
              `Resend in ${resendTimer}s`
            )}
          </Button>
        </div>

        <div className="text-center">
          <Link
            href="/signup"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Wrong email? Sign up again
          </Link>
        </div>
      </div>
    </TwoColumnAuthLayout>
  )
}
