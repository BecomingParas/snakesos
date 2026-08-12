'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useCurrentUser } from '@/hooks/dashboard'

export function DashboardNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const { user } = useCurrentUser()
  const userRole = user?.role || 'CITIZEN'

  const navItems = {
    ADMIN: [
      { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
      { href: '/dashboard/admin/rescues', label: 'Rescues', icon: MapPin },
      { href: '/dashboard/admin/volunteers', label: 'Volunteers', icon: Users },
      { href: '/dashboard/admin/users', label: 'Users', icon: Users },
      { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
    ],
    VERIFIED_RESCUER: [
      { href: '/dashboard/rescuer', label: 'My Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/rescuer/assigned', label: 'Assigned Rescues', icon: MapPin },
      { href: '/dashboard/rescuer/history', label: 'History', icon: MapPin },
      { href: '/dashboard/rescuer/profile', label: 'Profile', icon: Settings },
    ],
    CITIZEN: [
      { href: '/dashboard/citizen', label: 'My Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/citizen/requests', label: 'My Requests', icon: MapPin },
      { href: '/dashboard/citizen/profile', label: 'Profile', icon: Settings },
    ],
  }

  const items = navItems[userRole as keyof typeof navItems] || navItems.CITIZEN

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐍</span>
          <span className="font-display text-xl font-bold">
            Snake<span className="text-primary">SOS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Menu */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              Back to Site
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/">Back to Site</Link>
            </Button>
            <Button variant="ghost" size="sm" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
