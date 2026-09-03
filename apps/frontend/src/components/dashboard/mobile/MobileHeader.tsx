'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationDropdown } from '@/components/dashboard/notification-dropdown';
import { EmergencyHeaderButton } from '@/components/dashboard/emergency-header-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileHeaderProps {
  title: string;
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  onEmergencyClick?: () => void;
  showMenu?: boolean;
}

export function MobileHeader({
  title,
  user,
  onMenuClick,
  onNotificationClick,
  onProfileClick,
  onLogoutClick,
  onEmergencyClick,
  showMenu = true,
}: MobileHeaderProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 w-full md:mobile-glass-header border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left: Logo with theme switching - BIGGER */}
        <a href="/" className="flex items-center gap-2 min-w-0 group">
          {/* Light mode logo */}
          <img
            src="/snakesoslogo.png"
            alt="SnakeSOS Logo"
            className="h-12 w-12 object-contain transition-transform group-hover:scale-105 dark:hidden"
          />
          {/* Dark mode logo */}
          <img
            src="/snakesoslogo_bg.png"
            alt="SnakeSOS Logo"
            className="hidden h-12 w-12 object-contain transition-transform group-hover:scale-105 dark:block"
          />
        </a>

        {/* Right: Emergency, notifications, and profile */}
        <div className="flex items-center gap-2 shrink-0">
          <EmergencyHeaderButton role={user.role} onClick={onEmergencyClick} />
          {/* Notifications */}
          <NotificationDropdown role={user.role} />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  {user.avatar && (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
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
  );
}
