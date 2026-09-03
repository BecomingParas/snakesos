'use client';

import { createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Hospital,
  WalletCards,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Create context for sidebar collapse state
export const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}>({
  collapsed: false,
  setCollapsed: () => undefined,
});

export const useSidebar = () => useContext(SidebarContext);

type Role =
  | 'CITIZEN'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'DISTRICT_COORDINATOR'
  | 'VERIFIED_RESCUER'
  | 'VOLUNTEER';

interface SidebarProps {
  role: Role;
}

// Accent color per role — gives each dashboard a distinct identity at a glance
const roleAccent: Record<Role, string> = {
  CITIZEN: 'bg-primary',
  ADMIN: 'bg-primary',
  SUPER_ADMIN: 'bg-warning',
  DISTRICT_COORDINATOR: 'bg-info',
  VERIFIED_RESCUER: 'bg-success',
  VOLUNTEER: 'bg-success',
};

export function Sidebar({ role }: SidebarProps) {
  const { collapsed, setCollapsed } = useSidebar();
  const pathname = usePathname();

  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      collapsed ? '76px' : '272px',
    );
  }

  const roleConfig: Record<
    Role,
    {
      title: string;
      subtitle: string;
      basePath: string;
      links: { href: string; label: string; icon: typeof LayoutDashboard }[];
    }
  > = {
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
        { href: '/settings', label: 'Settings', icon: Settings },
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
        { href: '/hospitals', label: 'Hospitals', icon: Hospital },
        { href: '/rescuers', label: 'Rescuers', icon: Users },
        { href: '/users', label: 'Citizens', icon: UserCheck },
        { href: '/gallery', label: 'Gallery', icon: ImageIcon },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/finance', label: 'Finance', icon: WalletCards },
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
        { href: '/hospitals', label: 'Hospitals', icon: Hospital },
        { href: '/rescuers', label: 'Rescuers', icon: Users },
        { href: '/users', label: 'Citizens', icon: UserCheck },
        { href: '/gallery', label: 'Gallery', icon: ImageIcon },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/finance', label: 'Finance', icon: WalletCards },
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
        { href: '/gallery', label: 'Gallery', icon: ImageIcon },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/profile', label: 'Settings', icon: Settings },
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
        { href: '/hospitals', label: 'Hospitals', icon: Hospital },
        { href: '/history', label: 'History', icon: List },
        { href: '/earnings', label: 'Earnings', icon: WalletCards },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/notifications', label: 'Notifications', icon: Bell },
        { href: '/settings', label: 'Settings', icon: Settings },
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
        { href: '/hospitals', label: 'Hospitals', icon: Hospital },
        { href: '/history', label: 'History', icon: List },
        { href: '/earnings', label: 'Earnings', icon: WalletCards },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/notifications', label: 'Notifications', icon: Bell },
        { href: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  };

  const config = roleConfig[role] || roleConfig.CITIZEN;
  const accent = roleAccent[role] || roleAccent.CITIZEN;

  const isActive = (href: string) => {
    const fullPath = `${config.basePath}${href}`;
    if (href === '') return pathname === config.basePath;
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm transition-[width] duration-300 ease-in-out',
          collapsed ? 'w-19' : 'w-68',
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div
            className={cn(
              'flex items-center border-b border-border/20 ',
              collapsed && 'justify-center px-2',
            )}
          >
            <Link href="/" className="flex items-center gap-3 group min-w-0">
              {collapsed ? (
                /* Collapsed: Just snake icon */
                <img
                  src="/logo.png"
                  alt="SnakeSOS"
                  className="h-16 w-12 object-cover transition-all duration-300 group-hover:scale-110"
                />
              ) : (
                <>
                  {/* Expanded: Light mode logo */}
                  <img
                    src="/snakesoslogo.png"
                    alt="SnakeSOS Logo"
                    className="h-12 w-auto sm:h-14 sm:w-auto lg:h-8 lg:w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-110 dark:hidden"
                  />
                  {/* Expanded: Dark mode logo */}
                  <img
                    src="/snakesoslogo_bg.png"
                    alt="SnakeSOS Logo"
                    className="hidden h-12 w-auto sm:h-14 sm:w-auto lg:h-20 lg:w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-110 dark:block"
                  />
                </>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-0.5">
              {config.links.map((link, index) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                const fullPath = `${config.basePath}${link.href}`;
                const isEmergency = link.label === 'Emergency';

                const navItem = (
                  <Link
                    key={link.href || 'overview'}
                    href={fullPath}
                    className={cn(
                      'group relative flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                      isEmergency
                        ? active
                          ? 'bg-destructive/15 text-destructive shadow-sm'
                          : 'text-destructive hover:bg-destructive/10'
                        : active
                          ? 'bg-secondary/60 text-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground',
                      collapsed && 'justify-center px-2',
                    )}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <span
                        className={cn(
                          'absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full',
                          isEmergency ? 'bg-destructive' : accent,
                        )}
                      />
                    )}

                    <span className="relative shrink-0">
                      <Icon
                        className={cn(
                          'h-5 w-5 transition-transform duration-200 group-hover:scale-110',
                          active && !isEmergency && 'text-primary',
                        )}
                      />
                    </span>

                    {!collapsed && (
                      <span className="truncate">{link.label}</span>
                    )}
                  </Link>
                );

                const withGroupLabel =
                  index === 1 && !collapsed ? (
                    <div key={`group-${index}`}>
                      <div className="mb-1.5 mt-5 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                        Workspace
                      </div>
                      {navItem}
                    </div>
                  ) : (
                    navItem
                  );

                if (collapsed) {
                  return (
                    <Tooltip key={link.href || 'overview'}>
                      <TooltipTrigger asChild>{withGroupLabel}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {link.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return withGroupLabel;
              })}
            </nav>
          </ScrollArea>

          {/* Collapse Button */}
          <div className="border-t border-border/20 p-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                'w-full text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all',
                collapsed ? 'justify-center px-2' : 'justify-start',
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
    </TooltipProvider>
  );
}
