'use client';

import { Search, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme';
import { NotificationDropdown } from '@/components/dashboard/notification-dropdown';
import { EmergencyHeaderButton } from '@/components/dashboard/emergency-header-button';
import { toast } from 'sonner';

interface DesktopTopNavProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onLogout: () => void;
  onEmergencyClick?: () => void;
}

export function DesktopTopNav({
  user,
  onLogout,
  onEmergencyClick,
}: DesktopTopNavProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/20 bg-background/60 px-6 backdrop-blur-2xl shadow-sm">
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search or jump to..."
            className="h-10 pl-9 pr-20 border-border/30 bg-background/40 backdrop-blur-sm focus-visible:border-primary/50 transition-all"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden h-6 -translate-y-1/2 select-none items-center gap-1 rounded border border-border/30 bg-muted/50 px-2 font-mono text-[10px] font-semibold opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Emergency Button */}
        <EmergencyHeaderButton
          role={user.role}
          onClick={
            onEmergencyClick ||
            (() =>
              toast.error('Emergency dispatch alerted', {
                description: 'Hotline 1166 notified',
              }))
          }
        />

        {/* Notifications */}
        <NotificationDropdown role={user.role} />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 gap-2 px-2 hover:bg-secondary/50 transition-all"
            >
              <Avatar className="h-8 w-8 border-2 border-border/20">
                {user.avatar && (
                  <AvatarImage src={user.avatar} alt={user.name} />
                )}
                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-border/30 bg-background/95 backdrop-blur-xl"
          >
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">
                  {user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/30" />
            <DropdownMenuItem className="hover:bg-secondary/50 transition-all">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/30" />
            <DropdownMenuItem
              onClick={onLogout}
              className="hover:bg-destructive/10 transition-all"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
