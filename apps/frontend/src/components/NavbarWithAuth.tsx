'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Phone,
  Sparkles,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
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
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/donate', label: 'Donate' },
  { href: '/contact', label: 'Contact' },
];

const BRAND_NAME = 'SnakeSOS';
const BRAND_TAGLINE = '24/7 WILDLIFE RESCUE';
const EMERGENCY_PHONE = '9816482570';

export default function NavbarWithAuth() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Auth state
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
    return undefined;
  }, [showUserMenu]);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    router.push('/');
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

          {/* Auth Buttons / User Menu */}
          {!authLoading && (
            <>
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserMenu(!showUserMenu);
                    }}
                    className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/40">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-semibold">{user.name?.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-12 w-56 glass-card border border-white/10 rounded-xl overflow-hidden shadow-xl"
                      >
                        <div className="p-4 border-b border-white/10">
                          <p className="text-white font-semibold text-sm">{user.name}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
                          {user.role && (
                            <span className="inline-block mt-2 text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                              {user.role}
                            </span>
                          )}
                        </div>
                        <div className="p-2">
                          <Link
                            href="/dashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="text-sm font-medium">Dashboard</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login">
                  <Button
                    size="sm"
                    className="hidden sm:inline-flex h-9 gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-black hover:bg-emerald-400"
                  >
                    <User className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </>
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
                {/* User Info (Mobile) */}
                {isAuthenticated && user && (
                  <div className="mb-2 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/40">
                        <User className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col space-y-1">
                  {isAuthenticated && (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 rounded px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}
                  
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

                <div className="border-t border-white/10 pt-4 space-y-3">
                  {isAuthenticated ? (
                    <Button
                      onClick={handleLogout}
                      className="w-full rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 py-3 font-bold"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black py-3 font-bold">
                        <User className="h-4 w-4" />
                        Login / Register
                      </Button>
                    </Link>
                  )}
                  
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
