'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  List,
  AlertCircle,
  Heart,
  Settings,
  Activity,
  Users,
  BarChart3,
  MapPin,
  UserCheck,
  Bell,
  Map,
  Hospital,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  role:
    | 'CITIZEN'
    | 'ADMIN'
    | 'SUPER_ADMIN'
    | 'DISTRICT_COORDINATOR'
    | 'VERIFIED_RESCUER'
    | 'VOLUNTEER';
  user: {
    name: string;
    email: string;
  };
  onLogout?: () => void;
}

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function MobileDrawer({
  open,
  onClose,
  role,
  user,
  onLogout,
}: MobileDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Role-specific configuration
  const roleConfig: Record<
    string,
    { title: string; subtitle: string; basePath: string; links: NavLink[] }
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
        { href: '/profile', label: 'Settings', icon: Settings },
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
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/notifications', label: 'Notifications', icon: Bell },
        { href: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  };

  const config = roleConfig[role] || roleConfig.CITIZEN;

  const isActive = (href: string) => {
    const fullPath = `${config.basePath}${href}`;
    if (href === '') {
      return pathname === config.basePath;
    }
    return pathname.startsWith(fullPath);
  };

  const handleNavigation = (href: string) => {
    const fullPath = `${config.basePath}${href}`;
    router.push(fullPath);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-70 p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="border-b border-border/30 p-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-sm font-semibold">
                    {config.title}
                  </SheetTitle>
                  <p className="text-xs text-muted-foreground">
                    {config.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {config.links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);

                return (
                  <button
                    key={link.href || 'overview'}
                    onClick={() => handleNavigation(link.href)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User Info + Logout */}
          <div className="border-t border-border/30 p-4 space-y-2">
            <div className="px-3 py-2 rounded-lg bg-accent/50">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
            {onLogout && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
