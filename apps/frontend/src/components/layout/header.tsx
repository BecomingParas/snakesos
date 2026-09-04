'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme';
import { useCurrentUser } from '@/hooks/dashboard';
import { useLogout } from '@/hooks/auth/useLogout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const links = [
  { href: '/', label: 'Home' },
  { href: '/rescues', label: 'Rescues' },
  { href: '/identify', label: 'AI ID' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/volunteers', label: 'Volunteers' },
  { href: '/donate', label: 'Donate' },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  // Get actual auth state
  const { user, loading } = useCurrentUser({ skip: false });
  const { logout: performLogout } = useLogout();

  const isLoggedIn = !!user;
  const profileHref =
    user?.role === 'VERIFIED_RESCUER' || user?.role === 'VOLUNTEER'
      ? '/dashboard/rescuer/settings'
      : user?.role === 'CITIZEN'
        ? '/dashboard/citizen/settings'
        : '/dashboard/admin/settings';

  const handleLogout = async () => {
    await performLogout();
    window.location.href = '/';
  };

  // Generate user initials from name
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/20 bg-background/60 backdrop-blur-2xl shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-4 px-2 sm:px-5">
        <Link href="/" className="flex items-center gap-1 group">
          {/* Light mode logo */}
          <img
            src="/snakesoslogo.png"
            alt="SnakeSOS Logo"
            className="h-20 w-20 sm:h-20 sm:w-20 lg:h-48 lg:w-48 object-contain transition-transform group-hover:scale-105 dark:hidden"
          />
          {/* Dark mode logo */}
          <img
            src="/snakesoslogo_bg.png"
            alt="SnakeSOS Logo"
            className="hidden h-20 w-20 sm:h-20 sm:w-20 lg:h-48 lg:w-48 object-contain transition-transform group-hover:scale-105 dark:block"
          />
        </Link>

        <nav className="mx-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const isActive =
              pathname === l.href ||
              (l.href !== '/' && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-[15px] font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {/* Language and Sign in side by side - Desktop only */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Theme Toggle - Desktop only */}
            <ThemeToggle />

            {/* User Avatar Dropdown or Sign in Button */}
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-9 w-9 grid place-items-center overflow-hidden rounded-full border border-border/30 bg-secondary/40 p-0 text-sm font-semibold text-foreground transition-all hover:bg-secondary/60 hover:border-border/50">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      getUserInitials(user.name)
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-lg border-border bg-popover shadow-elevated"
                >
                  {/* User Info Section */}
                  <div className="flex items-center gap-3 p-3 border-b border-border/20 bg-transparent">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        getUserInitials(user.name)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary uppercase">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-3 py-2.5"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2.5"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer focus:bg-destructive/10 focus:text-destructive"
                  >
                    <div className="flex items-center gap-3 px-3 py-2.5 w-full">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                        <LogOut className="h-4 w-4 text-destructive" />
                      </div>
                      <span className="font-medium text-destructive">
                        Sign Out
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-9 border-border/40 hover:bg-secondary/50 hover:border-border/60 transition-all"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>

          {/* Emergency Button */}
          <Button
            asChild
            variant="destructive"
            className="h-9 rounded-lg px-4 font-semibold"
          >
            <Link
              href={
                user?.role === 'CITIZEN'
                  ? '/dashboard/citizen/request?emergency=true'
                  : '/emergency'
              }
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Emergency</span>
            </Link>
          </Button>
        </div>

        <button
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary/50 transition-colors lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div
        className={cn(
          'border-t border-border/20 bg-background/95 backdrop-blur-xl lg:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <div className="mx-auto max-w-7xl">
          {/* Navigation Links */}
          <nav className="flex flex-col px-5 py-4">
            <div className="space-y-1 mb-3">
              {links.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:text-foreground hover:bg-secondary/50',
                    )}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>

            {/* Settings Section - Theme */}
            <div className="space-y-1 mb-3 pt-2 border-t border-border/20">
              {/* Theme Toggle */}
              <button
                onClick={() => {
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                }}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
              >
                <span>Theme</span>
                <span className="text-sm text-muted-foreground">
                  Light / Dark
                </span>
              </button>
            </div>

            {/* Logged Out State */}
            {!isLoggedIn && (
              <div className="space-y-2 pt-3 border-t border-border/20">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full justify-center border-border/40 hover:bg-secondary/50"
                >
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="w-full justify-center bg-primary hover:bg-primary/90"
                >
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            {/* Logged In State */}
            {isLoggedIn && user && (
              <div className="space-y-3 pt-3 border-t border-border/20">
                {/* User Profile Card */}
                <div className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      getUserInitials(user.name)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary uppercase">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                  </div>
                  Dashboard
                </Link>
                <Link
                  href={profileHref}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                    <LogOut className="h-4 w-4 text-destructive" />
                  </div>
                  Sign Out
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
