'use client';

import Link from 'next/link';
import { AlertCircle, Users, Bug, BookOpen, LucideIcon } from 'lucide-react';

interface QuickActionLink {
  label: string;
  href: string;
  icon: LucideIcon;
  color: 'red' | 'blue' | 'emerald' | 'purple';
}

const QUICK_ACTIONS: QuickActionLink[] = [
  { label: 'Manage Rescues', href: '/admin/rescues', icon: AlertCircle, color: 'red' },
  { label: 'Approve Volunteers', href: '/admin/volunteers', icon: Users, color: 'blue' },
  { label: 'Snake Database', href: '/admin/species', icon: Bug, color: 'emerald' },
  { label: 'Blog Management', href: '/admin/blog', icon: BookOpen, color: 'purple' },
];

export function QuickActionLinks() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {QUICK_ACTIONS.map(({ label, href, icon: Icon, color }) => (
        <Link
          key={href}
          href={href}
          className={`glass-card rounded-xl p-4 border border-white/10 hover:border-${color}-500/30 transition-all flex items-center gap-3 group`}
        >
          <Icon
            className={`w-5 h-5 text-${color}-400 group-hover:scale-110 transition-transform`}
          />
          <span className="text-white text-sm font-medium">{label}</span>
        </Link>
      ))}
    </div>
  );
}
