'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Activity,
  Siren,
  Map,
  User,
  Settings,
  List,
  BarChart3,
  Users,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isEmergency?: boolean;
}

interface MobileBottomNavProps {
  role:
    | 'CITIZEN'
    | 'ADMIN'
    | 'SUPER_ADMIN'
    | 'DISTRICT_COORDINATOR'
    | 'VERIFIED_RESCUER'
    | 'VOLUNTEER';
}

export function MobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Role-specific navigation items
  const navItems: Record<string, NavItem[]> = {
    CITIZEN: [
      { href: '/dashboard/citizen', label: 'Home', icon: Home },
      { href: '/dashboard/citizen/requests', label: 'Requests', icon: List },
      {
        href: '/dashboard/citizen/emergency',
        label: 'SOS',
        icon: Siren,
        isEmergency: true,
      },
      { href: '/dashboard/citizen/map', label: 'Track', icon: Map },
      { href: '/dashboard/citizen/settings', label: 'Account', icon: User },
    ],
    ADMIN: [
      { href: '/dashboard/admin', label: 'Home', icon: Home },
      { href: '/dashboard/admin/rescues', label: 'Rescues', icon: List },
      { href: '/dashboard/admin/map', label: 'Map', icon: Map },
      { href: '/dashboard/admin/rescuers', label: 'Team', icon: Users },
    ],
    SUPER_ADMIN: [
      { href: '/dashboard/admin', label: 'Home', icon: Home },
      { href: '/dashboard/admin/rescues', label: 'Rescues', icon: List },
      { href: '/dashboard/admin/map', label: 'Map', icon: Map },
      { href: '/dashboard/admin/analytics', label: 'Stats', icon: BarChart3 },
    ],
    DISTRICT_COORDINATOR: [
      { href: '/dashboard/admin', label: 'Home', icon: Home },
      { href: '/dashboard/admin/rescues', label: 'Rescues', icon: List },
      { href: '/dashboard/admin/map', label: 'Map', icon: Map },
      { href: '/dashboard/admin/rescuers', label: 'Team', icon: Users },
    ],
    VERIFIED_RESCUER: [
      { href: '/dashboard/rescuer', label: 'Home', icon: Home },
      {
        href: '/dashboard/rescuer/assignments',
        label: 'Tasks',
        icon: FileText,
      },
      {
        href: '/dashboard/rescuer/active',
        label: 'Active',
        icon: Activity,
        isEmergency: true,
      },
      { href: '/dashboard/rescuer/map', label: 'Map', icon: Map },
      {
        href: '/dashboard/rescuer/settings',
        label: 'Account',
        icon: User,
      },
    ],
    VOLUNTEER: [
      { href: '/dashboard/rescuer', label: 'Home', icon: Home },
      {
        href: '/dashboard/rescuer/assignments',
        label: 'Tasks',
        icon: FileText,
      },
      {
        href: '/dashboard/rescuer/active',
        label: 'Active',
        icon: Activity,
        isEmergency: true,
      },
      { href: '/dashboard/rescuer/map', label: 'Map', icon: Map },
      {
        href: '/dashboard/rescuer/settings',
        label: 'Account',
        icon: User,
      },
    ],
  };

  const items = navItems[role] || navItems.CITIZEN;

  const isActive = (href: string) => {
    if (
      href === '/dashboard/citizen' ||
      href === '/dashboard/admin' ||
      href === '/dashboard/rescuer'
    ) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
      }}
    >
      {/* Glassmorphism background with iOS-style blur */}
      <div className="relative">
        {/* Backdrop blur layer */}
        <div className="absolute inset-0 bg-background/80 dark:bg-background/60 backdrop-blur-2xl backdrop-saturate-150" />
        
        {/* Top border with gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        
        {/* Content */}
        <div className="relative flex items-center justify-around px-safe pt-1 pb-safe">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-[60px]',
                  'active:scale-95',
                  item.isEmergency && 'relative',
                )}
              >
                {/* Emergency glow effect */}
                {item.isEmergency && (
                  <div className="absolute inset-0 bg-destructive/20 dark:bg-destructive/30 rounded-xl blur-sm" />
                )}
                
                {/* Icon container with active state */}
                <div
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200',
                    active && !item.isEmergency && 'bg-primary/10 dark:bg-primary/20',
                    item.isEmergency && 'bg-destructive/10 dark:bg-destructive/20',
                  )}
                >
                  {item.isEmergency ? (
                    <Icon className="h-6 w-6 text-destructive dark:text-red-500 drop-shadow-sm" />
                  ) : (
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors duration-200',
                        active
                          ? 'text-primary dark:text-primary'
                          : 'text-muted-foreground dark:text-muted-foreground/80',
                      )}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'text-[11px] font-medium mt-1 transition-colors duration-200',
                    item.isEmergency &&
                      'text-destructive dark:text-red-500 font-semibold',
                    active && !item.isEmergency && 'text-primary dark:text-primary',
                    !active && !item.isEmergency && 'text-muted-foreground dark:text-muted-foreground/80',
                  )}
                >
                  {item.label}
                </span>

                {/* Active indicator */}
                {active && !item.isEmergency && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
