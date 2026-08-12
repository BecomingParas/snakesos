'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  List,
  AlertCircle,
  Info,
  Heart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Users,
  BarChart3,
  MapPin,
  UserCheck,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SidebarProps {
  role: 'CITIZEN' | 'ADMIN' | 'SUPER_ADMIN' | 'DISTRICT_COORDINATOR' | 'VERIFIED_RESCUER' | 'VOLUNTEER'
}

export function Sidebar({ role, userName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Role-specific configuration
  const roleConfig = {
    CITIZEN: {
      title: 'Citizen',
      subtitle: 'Public reporter',
      basePath: '/dashboard/citizen',
      links: [
        { href: '', label: 'Overview', icon: LayoutDashboard },
        { href: '/requests/new', label: 'New request', icon: FileText },
        { href: '/requests', label: 'My requests', icon: List },
        { href: '/emergency', label: 'Emergency', icon: AlertCircle },
        { href: '/snake-info', label: 'Snake info', icon: Info },
        { href: '/donate', label: 'Donate', icon: Heart },
        { href: '/profile', label: 'Profile', icon: Settings },
      ],
    },
    ADMIN: {
      title: 'Admin',
      subtitle: 'System administrator',
      basePath: '/dashboard/admin',
      links: [
        { href: '', label: 'Overview', icon: LayoutDashboard },
        { href: '/rescues', label: 'Rescue requests', icon: Activity },
        { href: '/volunteers', label: 'Volunteers', icon: Users },
        { href: '/users', label: 'Users', icon: UserCheck },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/coverage', label: 'Coverage', icon: MapPin },
        { href: '/alerts', label: 'Alerts', icon: Bell },
        { href: '/settings', label: 'Settings', icon: Settings },
      ],
    },
    SUPER_ADMIN: {
      title: 'Super Admin',
      subtitle: 'Full system access',
      basePath: '/dashboard/admin',
      links: [
        { href: '', label: 'Overview', icon: LayoutDashboard },
        { href: '/rescues', label: 'Rescue requests', icon: Activity },
        { href: '/volunteers', label: 'Volunteers', icon: Users },
        { href: '/users', label: 'Users', icon: UserCheck },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/coverage', label: 'Coverage', icon: MapPin },
        { href: '/alerts', label: 'Alerts', icon: Bell },
        { href: '/settings', label: 'Settings', icon: Settings },
      ],
    },
    DISTRICT_COORDINATOR: {
      title: 'Coordinator',
      subtitle: 'District coordinator',
      basePath: '/dashboard/admin',
      links: [
        { href: '', label: 'Overview', icon: LayoutDashboard },
        { href: '/rescues', label: 'Rescue requests', icon: Activity },
        { href: '/volunteers', label: 'Volunteers', icon: Users },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/coverage', label: 'Coverage', icon: MapPin },
        { href: '/profile', label: 'Profile', icon: Settings },
      ],
    },
    VERIFIED_RESCUER: {
      title: 'Rescuer',
      subtitle: 'Verified rescuer',
      basePath: '/dashboard/rescuer',
      links: [
        { href: '', label: 'Overview', icon: LayoutDashboard },
        { href: '/active', label: 'Active Rescues', icon: Activity },
        { href: '/history', label: 'History', icon: List },
        { href: '/schedule', label: 'Schedule', icon: MapPin },
        { href: '/profile', label: 'Profile', icon: Settings },
      ],
    },
    VOLUNTEER: {
      title: 'Volunteer',
      subtitle: 'Community volunteer',
      basePath: '/dashboard/rescuer',
      links: [
        { href: '', label: 'Overview', icon: LayoutDashboard },
        { href: '/active', label: 'Active Rescues', icon: Activity },
        { href: '/history', label: 'History', icon: List },
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
        'fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-[#0a1810] text-gray-200 transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-[280px]'
      )}
    >
      <div className="flex h-full flex-col">

        {/* Header */}
        <div className={cn('border-b border-border/30 p-4', collapsed && 'px-2')}>
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold text-white">{config.title}</h2>
                <p className="truncate text-xs text-gray-400">{config.subtitle}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
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
                    <div className="mb-2 mt-4 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Workspace
                    </div>
                    <Link
                      href={fullPath}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
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
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white',
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
        <div className="border-t border-border/30 p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'w-full text-gray-400 hover:bg-white/5 hover:text-white',
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
