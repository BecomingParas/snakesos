'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NotificationDropdown } from '@/components/dashboard/notification-dropdown'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface MobileHeaderProps {
  title: string
  user: {
    name: string
    email: string
    role: string
  }
  onMenuClick?: () => void
  onNotificationClick?: () => void
  onProfileClick?: () => void
  onLogoutClick?: () => void
  notificationCount?: number
  showMenu?: boolean
}

export function MobileHeader({
  title,
  user,
  onMenuClick,
  onNotificationClick,
  onProfileClick,
  onLogoutClick,
  notificationCount = 0,
  showMenu = true,
}: MobileHeaderProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-50 w-full md:mobile-glass-header border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left: Logo + Title */}
        <a href="/" className="flex items-center gap-2 min-w-0 group">
          <div className="h-8 w-8 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
            <img 
              src="/snakesoslogo.png" 
              alt="SnakeSOS Logo" 
              className="h-7 w-7 object-contain transition-transform group-hover:scale-105"
            />
          </div>
          <span className="text-sm font-bold truncate">
            Snake<span className="text-primary">SOS</span>
          </span>
        </a>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notifications */}
          <NotificationDropdown role={user.role} />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    Role: {user.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {onProfileClick && (
                <DropdownMenuItem onClick={onProfileClick}>
                  Profile
                </DropdownMenuItem>
              )}
              {onLogoutClick && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogoutClick}>
                    Log out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
