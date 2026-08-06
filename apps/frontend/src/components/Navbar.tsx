'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Phone,
  Sparkles,
  User,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@snake-rescue/ui';
import { useAuth } from '@snake-rescue/features';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/emergency', label: 'Emergency' },
  { href: '/snakes', label: 'Snakes' },
  { href: '/ai-identifier', label: 'AI ID', icon: <Sparkles className="h-4 w-4" /> },
  { href: '/firstaid', label: 'First Aid' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/stories', label: 'Stories' },
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/donate', label: 'Donate' },
  { href: '/contact', label: 'Contact' },
];

const BRAND_NAME = 'SnakeSOS';
const BRAND_TAGLINE = '24/7 WILDLIFE RESCUE';
const EMERGENCY_PHONE = '9816482570';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
            <Image
              src="/logo.png"
              alt={`${BRAND_NAME} logo`}
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight text-white">{BRAND_NAME}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-500">
              {BRAND_TAGLINE}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-1.5 rounded px-3 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === item.href
                  ? 'border border-emerald-500 bg-emerald-500/10 text-emerald-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {('icon' in item && item.icon) || null}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Language */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-9 w-9 rounded border border-white/20 text-sm font-semibold text-gray-300 hover:border-white/40 hover:bg-white/10 hover:text-white lg:flex"
          >
            ने
          </Button>

          {/* Auth Buttons - Desktop */}
          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 gap-2 rounded-3xl border border-white/20 px-4 text-sm font-medium text-gray-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  <User className="h-4 w-4" />
                  {user?.name || 'Profile'}
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="h-9 gap-2 rounded-3xl border border-red-500/50 px-4 text-sm font-medium text-red-400 hover:border-red-500 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-2 rounded-3xl border border-emerald-500/50 px-5 text-sm font-semibold text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
          )}

          {/* Emergency CTA */}
          <Button asChild size="sm" className="hidden h-9 gap-2 rounded-3xl bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700 sm:inline-flex">
            <Link href="/emergency">
              <Phone className="h-4 w-4" />
              Emergency
            </Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-white hover:bg-white/10 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-black/60 md:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed right-0 top-16 z-50 h-[calc(100dvh-4rem)] w-[85%] max-w-sm overflow-y-auto border-l border-white/10 bg-slate-900/95 shadow-xl backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col space-y-4 p-6">
                <div className="mb-2 flex items-center space-x-3 border-b border-white/10 pb-4">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                    <Image src="/logo.png" alt={`${BRAND_NAME} logo`} fill sizes="40px" className="object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{BRAND_NAME}</div>
                    <div className="text-xs font-semibold text-emerald-500">{BRAND_TAGLINE}</div>
                  </div>
                </div>

                <nav className="flex flex-col space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2.5 rounded px-3 py-2.5 text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'border border-emerald-500 bg-emerald-500/10 text-emerald-500'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {('icon' in item && item.icon) || null}
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded border border-white/20 text-sm font-semibold text-gray-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
                  >
                    ने
                  </Button>
                </div>

                {/* Auth Section - Mobile */}
                {isAuthenticated ? (
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 rounded px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        <User className="h-4 w-4" />
                        {user?.name || 'My Profile'}
                      </Button>
                    </Link>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start gap-2 rounded border border-red-500/30 px-3 py-2.5 text-sm font-medium text-red-400 hover:border-red-500 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="border-t border-white/10 pt-4">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full rounded-3xl border border-emerald-500 bg-emerald-500/10 py-3 font-bold text-emerald-400 hover:bg-emerald-500/20">
                        <LogIn className="h-4 w-4" />
                        Login / Register
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4">
                  <Button asChild className="w-full rounded-3xl bg-red-600 py-3 font-bold hover:bg-red-700">
                    <a href={`tel:${EMERGENCY_PHONE}`} onClick={() => setIsOpen(false)}>
                      <Phone className="h-4 w-4" />
                      Call Emergency: {EMERGENCY_PHONE}
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}