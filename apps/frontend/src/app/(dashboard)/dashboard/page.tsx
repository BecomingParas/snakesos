'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useCurrentUser } from '@/hooks/dashboard'

/**
 * Dashboard Auto-Router
 * Redirects to role-specific dashboard based on user role
 */
export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, error } = useCurrentUser()

  useEffect(() => {
    // Wait for user data to load
    if (loading) return

    // If error or no user, redirect to login
    if (error || !user) {
      router.replace('/login?redirect=/dashboard')
      return
    }

    // Redirect based on role
    const roleRoutes: Record<string, string> = {
      ADMIN: '/dashboard/admin',
      SUPER_ADMIN: '/dashboard/admin',
      DISTRICT_COORDINATOR: '/dashboard/admin',
      VERIFIED_RESCUER: '/dashboard/rescuer',
      VOLUNTEER: '/dashboard/rescuer',
      CITIZEN: '/dashboard/citizen',
    }

    const targetRoute = roleRoutes[user.role] || '/dashboard/citizen'
    router.replace(targetRoute)
  }, [user, loading, error, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          {loading ? 'Loading your dashboard...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  )
}
