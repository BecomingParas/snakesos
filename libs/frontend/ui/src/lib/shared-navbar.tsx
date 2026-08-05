'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Menu, Phone } from 'lucide-react';
import { Button, Sheet, SheetContent, SheetTrigger } from '@snake-rescue/ui';
import { useState } from 'react';

export interface NavItem {
  href: string;
  label: string;
}

export interface SharedNavbarProps {
  logo?: React.ReactNode;
  brandName?: string;
  brandTagline?: string;
  navItems?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  emergencyPhone?: string;
  className?: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/emergency', label: 'Emergency' },
  { href: '/snakes', label: 'Snake Guide' },
  { href: '/firstaid', label: 'First Aid' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export function SharedNavbar({
  logo,
  brandName = 'Butwal Snake Rescuers',
  brandTagline = '24/7 Wildlife Rescue',
  navItems = DEFAULT_NAV_ITEMS,
  ctaLabel = 'Emergency',
  ctaHref = '/emergency',
  emergencyPhone,
  className = '',
}: SharedNavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 w-full bg-[#1e293b] border-b border-white/5 ${className}`}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center px-6">
        {/* Brand */}
        <Link href="/" className="mr-8 flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary ring-1 ring-primary/30"
          >
            {logo || <Shield className="h-6 w-6" />}
          </motion.div>
          <div className="hidden flex-col lg:flex">
            <span className="text-base font-bold leading-tight text-white">{brandName}</span>
            <span className="text-[11px] text-primary uppercase tracking-wide font-semibold">{brandTagline}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === item.href
                  ? 'text-white bg-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          {/* Search Icon */}
          <Button 
            variant="ghost" 
            size="icon"
            className="hidden lg:flex text-gray-300 hover:text-white hover:bg-white/5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Button>

          {/* Language Selector */}
          <Button 
            variant="ghost" 
            size="icon"
            className="hidden lg:flex text-gray-300 hover:text-white hover:bg-white/5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </Button>

          {/* Emergency CTA */}
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href={ctaHref}>
              <Button className="relative h-9 w-full bg-red-600 text-white hover:bg-red-700 md:w-auto px-5 font-semibold">
                <Phone className="mr-2 h-4 w-4" />
                {ctaLabel}
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-[#1e293b] border-white/10">
              <div className="flex flex-col space-y-4 mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-sm font-bold text-white">{brandName}</div>
                    <div className="text-xs text-primary">{brandTagline}</div>
                  </div>
                </div>
                
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-white/10 text-white'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {emergencyPhone && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <a
                      href={`tel:${emergencyPhone}`}
                      className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      Call Emergency: {emergencyPhone}
                    </a>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}