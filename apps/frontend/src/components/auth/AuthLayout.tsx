'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0a1512] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(46,204,113,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.08),transparent_50%)]" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
            <ShieldAlert className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">SnakeSOS</span>
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
              Wildlife Rescue
            </span>
          </div>
        </Link>

        {/* Auth Card */}
        {children}

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} SnakeSOS. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};
