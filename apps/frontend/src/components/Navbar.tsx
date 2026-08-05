'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Phone, Sparkles, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/emergency', label: 'Emergency' },
  { href: '/snakes', label: 'Snakes' },
  { href: '/ai-id', label: 'AI ID', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { href: '/firstaid', label: 'First Aid' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/stories', label: 'Stories' },
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/donate', label: 'Donate' },
  { href: '/contact', label: 'Contact' },
];

const BRAND_NAME = 'Butwal Snake Rescuers';
const BRAND_TAGLINE = '24/7 WILDLIFE RESCUE';
const EMERGENCY_PHONE = '9816482570';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full bg-[#1e293b] border-b border-white/5"
    >
      <div className="container flex h-16 max-w-7xl items-center px-6 mx-auto">
        {/* Brand */}
        <Link href="/" className="mr-8 flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary ring-1 ring-primary/30 overflow-hidden"
          >
            <Shield className="h-6 w-6" />
          </motion.div>
          <div className="hidden flex-col lg:flex">
            <span className="text-base font-bold leading-tight text-white">{BRAND_NAME}</span>
            <span className="text-[11px] text-primary uppercase tracking-wide font-semibold">{BRAND_TAGLINE}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-1 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === item.href
                  ? 'text-primary bg-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2 md:flex-none">
          {/* Search Icon */}
          <button
            type="button"
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Language Selector */}
          <button
            type="button"
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-md text-gray-300 hover:text-white hover:bg-white/5 font-semibold text-sm transition-colors"
          >
            ने
          </button>

          {/* Emergency CTA */}
          <Link href="/emergency" className="hidden sm:block">
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Emergency
            </button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-md text-white"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle navigation menu</span>
          </button>
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
              className="fixed right-0 top-16 z-50 h-[calc(100dvh-4rem)] w-[85%] max-w-sm border-l border-white/10 bg-[#1e293b] md:hidden overflow-y-auto"
            >
              <div className="flex flex-col space-y-4 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-sm font-bold text-white">{BRAND_NAME}</div>
                    <div className="text-xs text-primary">{BRAND_TAGLINE}</div>
                  </div>
                </div>

                <nav className="flex flex-col space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-white/10 text-primary'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    className="h-9 w-9 flex items-center justify-center rounded-md text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="h-9 w-9 flex items-center justify-center rounded-md text-gray-300 hover:text-white hover:bg-white/5 font-semibold text-sm"
                  >
                    ने
                  </button>
                </div>

                <div className="mt-2 pt-4 border-t border-white/10">
                  <a
                    href={`tel:${EMERGENCY_PHONE}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Call Emergency: {EMERGENCY_PHONE}
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}