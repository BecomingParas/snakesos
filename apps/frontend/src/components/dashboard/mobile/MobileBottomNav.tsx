'use client'

import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, 
  Activity, 
  Siren, 
  Map, 
  User,
  List,
  BarChart3,
  Users,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  isEmergency?: boolean
}

interface MobileBottomNavProps {
  role: 'CITIZEN' | 'ADMIN' | 'SUPER_ADMIN' | 'DISTRICT_COORDINATOR' | 'VERIFIED_RESCUER' | 'VOLUNTEER'
}

export function MobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  // Role-specific navigation items
  const navItems: Record<string, NavItem[]> = {
    CITIZEN: [
      { href: '/dashboard/citizen', label: 'Home', icon: Home },
      { href: '/dashboard/citizen/requests', label: 'Requests', icon: List },
      { href: '/dashboard/citizen/emergency', label: 'SOS', icon: Siren, isEmergency: true },
      { href: '/dashboard/citizen/map', label: 'Track', icon: Map },
      { href: '/dashboard/citizen/profile', label: 'Profile', icon: User },
    ],
    ADMIN: [
      { href: '/dashboard/admin', label: 'Home', icon: Home },
      { href: '/dashboard/admin/command', label: 'Active', icon: Activity },
      { href: '/dashboard/admin/rescues', label: 'Rescues', icon: List },
      { href: '/dashboard/admin/map', label: 'Map', icon: Map },
      { href: '/dashboard/admin/rescuers', label: 'Team', icon: Users },
    ],
    SUPER_ADMIN: [
      { href: '/dashboard/admin', label: 'Home', icon: Home },
      { href: '/dashboard/admin/command', label: 'Active', icon: Activity },
      { href: '/dashboard/admin/rescues', label: 'Rescues', icon: List },
      { href: '/dashboard/admin/map', label: 'Map', icon: Map },
      { href: '/dashboard/admin/analytics', label: 'Stats', icon: BarChart3 },
    ],
    DISTRICT_COORDINATOR: [
      { href: '/dashboard/admin', label: 'Home', icon: Home },
      { href: '/dashboard/admin/command', label: 'Active', icon: Activity },
      { href: '/dashboard/admin/rescues', label: 'Rescues', icon: List },
      { href: '/dashboard/admin/map', label: 'Map', icon: Map },
      { href: '/dashboard/admin/rescuers', label: 'Team', icon: Users },
    ],
    VERIFIED_RESCUER: [
      { href: '/dashboard/rescuer', label: 'Home', icon: Home },
      { href: '/dashboard/rescuer/assignments', label: 'Tasks', icon: FileText },
      { href: '/dashboard/rescuer/active', label: 'Active', icon: Activity, isEmergency: true },
      { href: '/dashboard/rescuer/map', label: 'Map', icon: Map },
      { href: '/dashboard/rescuer/profile', label: 'Profile', icon: User },
    ],
    VOLUNTEER: [
      { href: '/dashboard/rescuer', label: 'Home', icon: Home },
      { href: '/dashboard/rescuer/assignments', label: 'Tasks', icon: FileText },
      { href: '/dashboard/rescuer/active', label: 'Active', icon: Activity, isEmergency: true },
      { href: '/dashboard/rescuer/map', label: 'Map', icon: Map },
      { href: '/dashboard/rescuer/profile', label: 'Profile', icon: User },
    ],
  }

  const items = navItems[role] || navItems.CITIZEN

  const isActive = (href: string) => {
    if (href === '/dashboard/citizen' || href === '/dashboard/admin' || href === '/dashboard/rescuer') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/50 md:hidden"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Button
              key={item.href}
              variant="ghost"
              onClick={() => router.push(item.href)}
              className={cn(
                'flex flex-col items-center justify-center h-full flex-1 gap-1 rounded-none relative',
                item.isEmergency && 'text-destructive hover:text-destructive',
                active && !item.isEmergency && 'text-primary',
                !active && !item.isEmergency && 'text-muted-foreground'
              )}
            >
              {item.isEmergency ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-destructive/20 rounded-full animate-pulse" />
                  <div className="relative bg-destructive rounded-full p-2">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              ) : (
                <Icon className={cn('h-5 w-5', active && 'fill-current')} />
              )}
              <span className={cn(
                'text-[10px] font-medium',
                item.isEmergency && 'text-destructive font-bold'
              )}>
                {item.label}
              </span>
              {active && !item.isEmergency && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-t-full" />
              )}
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
