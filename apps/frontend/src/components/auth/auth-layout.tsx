/**
 * Auth Layout Component - NCAA Style
 * Clean centered layout for authentication pages
 */

import { ReactNode } from 'react'
import Link from 'next/link'

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center  mb-6">
            <img 
              src="/snakesoslogo.png" 
              alt="SnakeSOS Logo" 
              className="h-28 w-28 object-contain"
            />
            <div className="text-left">
              <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
                Snake<span className="text-green-400">SOS</span>
              </h1>
              <p className="text-xs text-slate-400">Wildlife Rescue Management</p>
            </div>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl bg-slate-50 shadow-2xl p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
