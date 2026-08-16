'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCurrentUser } from '@/hooks/dashboard'
import { useResponsive } from '@/hooks/use-responsive'
import { Loader2 } from 'lucide-react'
import { Sidebar, SidebarContext } from '@/components/dashboard/sidebar'
import { MobileHeader } from '@/components/dashboard/mobile/MobileHeader'
import { MobileBottomNav } from '@/components/dashboard/mobile/MobileBottomNav'
import { MobileDrawer } from '@/components/dashboard/mobile/MobileDrawer'
import { DesktopTopNav } from '@/components/dashboard/DesktopTopNav'
import { toast } from 'sonner'

/**
 * Dashboard Layout Client Component - Responsive
 * DESKTOP: Sidebar + Top Nav + Content
 * MOBILE: Mobile Header + Bottom Nav + Drawer + Content
 */
export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const { isMobile } = useResponsive()

  // Set initial CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', '280px')
  }, [])

  // Ensure component is mounted on client before accessing hooks
  useEffect(() => {
    setMounted(true)
  }, [])

  // Only call Apollo hooks after mount to prevent SSR issues
  const { user, loading, error } = useCurrentUser({ 
    skip: !mounted 
  })

  useEffect(() => {
    if (!mounted) return

    // If not loading and no user, redirect to login
    if (!loading && (error || !user)) {
      router.replace('/login?redirect=/dashboard')
    }
    
    // If user exists but email not verified, redirect to verification page
    if (!loading && user && !user.emailVerified) {
      router.replace(`/verify-email?email=${encodeURIComponent(user.email)}`)
    }
  }, [user, loading, error, router, mounted])

  const handleLogout = async () => {
    router.push('/login')
    toast.success('Logged out successfully')
  }

  // Show loading state while checking auth or not yet mounted
  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If error or no user, show nothing (will redirect)
  if (error || !user) {
    return null
  }

  // Get page title from pathname
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]
    return lastSegment
      ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ')
      : 'Dashboard'
  }

  return (
    <SidebarContext.Provider value={{ collapsed: sidebarCollapsed, setCollapsed: setSidebarCollapsed }}>
      {/* MOBILE LAYOUT */}
      {isMobile ? (
        <div className="flex min-h-screen flex-col bg-background">
          {/* Mobile Header */}
          <MobileHeader
            title={getPageTitle()}
            user={user}
            onMenuClick={() => setMobileDrawerOpen(true)}
            onNotificationClick={() => router.push(`/dashboard/${user.role.toLowerCase().replace('_', '-')}/notifications`)}
            onProfileClick={() => router.push(`/dashboard/${user.role.toLowerCase().replace('_', '-')}/profile`)}
            onLogoutClick={handleLogout}
            notificationCount={0} // TODO: Connect to real notification count
          />

          {/* Mobile Drawer */}
          <MobileDrawer
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            role={user.role}
            user={user}
            onLogout={handleLogout}
          />

          {/* Page Content - with bottom padding for nav */}
          <main className="flex-1 pb-16 overflow-x-hidden">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav role={user.role} />
        </div>
      ) : (
        /* DESKTOP LAYOUT */
        <div className="flex min-h-screen bg-background">
          {/* Desktop Sidebar */}
          <Sidebar role={user.role} />
          
          {/* Main Content */}
          <main 
            className="min-h-screen w-full transition-all duration-300 overflow-x-hidden" 
            style={{ marginLeft: 'var(--sidebar-width)' }}
          >
            {/* Desktop Top Navigation Bar */}
            <DesktopTopNav
              user={user}
              onLogout={handleLogout}
            />

            {/* Page Content */}
            <div className="h-[calc(100vh-3.5rem)] overflow-auto">
              {children}
            </div>
          </main>
        </div>
      )}
    </SidebarContext.Provider>
  )
}
