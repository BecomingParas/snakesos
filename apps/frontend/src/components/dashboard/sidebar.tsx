'use client'

import {  createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  List,
  AlertCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Users,
  BarChart3,
  UserCheck,
  Bell,
  Map,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

// Create context for sidebar collapse state
export const SidebarContext = createContext<{
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}>({
  collapsed: false,
  setCollapsed: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

interface SidebarProps {
  role: 'CITIZEN' | 'ADMIN' | 'SUPER_ADMIN' | 'DISTRICT_COORDINATOR' | 'VERIFIED_RESCUER' | 'VOLUNTEER'
}

export function Sidebar({ role }: SidebarProps) {
  const { collapsed, setCollapsed } = useSidebar()
  const pathname = usePathname()

  // Update CSS variable when collapsed state changes
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      collapsed ? '70px' : '280px'
    )
  }

  // Role-specific configuration
  const roleConfig = {
    CITIZEN: {
      title: 'Citizen',
      subtitle: 'Public reporter',
      basePath: '/dashboard/citizen',
      links: [
        { href: '', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/request', label: 'Request Rescue', icon: FileText },
        { href: '/requests', label: 'My Requests', icon: List },
        { href: '/map', label: 'Track Rescue', icon: Map },
        { href: '/notifications', label: 'Notifications', icon: Bell },
        { href: '/emergency', label: 'Emergency', icon: AlertCircle },
        { href: '/profile', label: 'Profile', icon: Settings },
      ],
    },
    ADMIN: {
      title: 'Admin',
      subtitle: 'System administrator',
      basePath: '/dashboard/admin',
      links: [
        { href: '', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/command', label: 'Command Center', icon: Activity },
        { href: '/rescues', label: 'All Rescues', icon: List },
        { href: '/map', label: 'Live Map', icon: Map },
        { href: '/rescuers', label: 'Rescuers', icon: Users },
        { href: '/users', label: 'Users', icon: UserCheck },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/notifications', label: 'Notifications', icon: Bell },
        { href: '/settings', label: 'Settings', icon: Settings },
      ],
    },
    SUPER_ADMIN: {
      title: 'Super Admin',
      subtitle: 'Full system access',
      basePath: '/dashboard/admin',
      links: [
        { href: '', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/command', label: 'Command Center', icon: Activity },
        { href: '/rescues', label: 'All Rescues', icon: List },
        { href: '/map', label: 'Live Map', icon: Map },
        { href: '/rescuers', label: 'Rescuers', icon: Users },
        { href: '/users', label: 'Users', icon: UserCheck },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/notifications', label: 'Notifications', icon: Bell },
        { href: '/settings', label: 'Settings', icon: Settings },
      ],
    },
    DISTRICT_COORDINATOR: {
      title: 'Coordinator',
      subtitle: 'District coordinator',
      basePath: '/dashboard/admin',
      links: [
        { href: '', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/command', label: 'Command Center', icon: Activity },
        { href: '/rescues', label: 'Rescues', icon: List },
        { href: '/map', label: 'Live Map', icon: Map },
        { href: '/rescuers', label: 'Rescuers', icon: Users },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/profile', label: 'Profile', icon: Settings },
      ],
    },
    VERIFIED_RESCUER: {
      title: 'Rescuer',
      subtitle: 'Verified rescuer',
      basePath: '/dashboard/rescuer',
      links: [
        { href: '', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/assignments', label: 'Assignments', icon: FileText },
        { href: '/active', label: 'Active Rescue', icon: Activity },
        { href: '/map', label: 'Map', icon: Map },
        { href: '/history', label: 'History', icon: List },
        { href: '/notifications', label: 'Notifications', icon: Bell },
        { href: '/profile', label: 'Profile', icon: Settings },
      ],
    },
    VOLUNTEER: {
      title: 'Volunteer',
      subtitle: 'Community volunteer',
      basePath: '/dashboard/rescuer',
      links: [
        { href: '', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/assignments', label: 'Assignments', icon: FileText },
        { href: '/active', label: 'Active Rescue', icon: Activity },
        { href: '/map', label: 'Map', icon: Map },
        { href: '/history', label: 'History', icon: List },
        { href: '/notifications', label: 'Notifications', icon: Bell },
        { href: '/profile', label: 'Profile', icon: Settings },
      ],
    },
  }

  const config = roleConfig[role] || roleConfig.CITIZEN

  const isActive = (href: string) => {
    const fullPath = `${config.basePath}${href}`
    if (href === '') {
      return pathname === config.basePath
    }
    return pathname.startsWith(fullPath)
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border/20 bg-background/60 backdrop-blur-2xl shadow-sm transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-[280px]'
      )}
    >
      <div className="flex h-full flex-col">

        {/* Header */}
        <div className={cn('border-b border-border/20 p-4', collapsed && 'px-2')}>
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold text-foreground">{config.title}</h2>
                <p className="truncate text-xs text-muted-foreground font-medium">{config.subtitle}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {config.links.map((link, index) => {
              const Icon = link.icon
              const active = isActive(link.href)
              const fullPath = `${config.basePath}${link.href}`

              if (index === 1 && !collapsed) {
                return (
                  <div key={`group-${index}`}>
                    <div className="mb-2 mt-4 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Workspace
                    </div>
                    <Link
                      href={fullPath}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all',
                        active
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-foreground hover:bg-secondary/50 hover:text-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{link.label}</span>
                    </Link>
                  </div>
                )
              }

              return (
                <Link
                  key={link.href || 'overview'}
                  href={fullPath}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all',
                    active
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-foreground hover:bg-secondary/50 hover:text-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? link.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="truncate">{link.label}</span>}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Collapse Button */}
        <div className="border-t border-border/20 p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'w-full text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all',
              collapsed ? 'justify-center px-2' : 'justify-start'
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}
