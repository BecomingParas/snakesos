'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@snake-rescue/features';
import { ShieldAlert, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useApp();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-white/5 font-manrope">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-6 w-6 text-emerald-500" />
              <span className="text-lg font-bold font-poppins text-white tracking-tight">
                SnakeSOS
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-manrope">
              Protecting human lives and conserving Rupandehi biodiversity through safe, 24/7 emergency snake rescue, local community education, and snakebite first aid awareness.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://facebook.com/butwalsnakerescuers"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-slate-800/50 text-gray-400 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-500"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/butwalsnakerescuers"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-slate-800/50 text-gray-400 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-500"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com/@butwalsnakerescuers"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-slate-800/50 text-gray-400 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-500"
                aria-label="TikTok"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.61.94-5.22 3.01-6.73 1.63-1.19 3.73-1.57 5.68-1.07v4.11c-1.12-.27-2.31-.18-3.3.38-.85.48-1.48 1.34-1.61 2.33-.14 1.05.29 2.14 1.05 2.87.77.72 1.88 1.01 2.91.81 1.25-.24 2.21-1.29 2.38-2.56.12-.9.08-1.82.08-2.73 0-6.49-.03-12.98.02-19.47Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Coverage Areas */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              COVERAGE AREAS
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>Butwal Municipality</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>Tilottama Municipality</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>Siddharthanagar</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>Devdaha Municipality</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>Rupandehi Surrounding Zones</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Useful Information */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Useful Information</h3>
            <ul className="space-y-3">
              <li><Link href="/emergency" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Emergency Rescue</Link></li>
              <li><Link href="/snakes" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Snake DB & AI</Link></li>
              <li><Link href="/firstaid" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> First Aid</Link></li>
              <li><Link href="/volunteer" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Volunteer</Link></li>
              <li><Link href="/donate" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Donate</Link></li>
              <li><Link href="/admin" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Admin Login</Link></li>
            </ul>
          </div>

          {/* Col 4: 24/7 Hotline Contacts */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              24/7 HOTLINE CONTACTS
            </h3>
            <div className="space-y-3">
              <a
                href={`tel:${t('tel1')}`}
                className="flex items-center space-x-3 rounded border border-red-600/30 bg-red-600/10 p-4 transition-all hover:border-red-600/50 hover:bg-red-600/20"
              >
                <Phone className="h-6 w-6 shrink-0 text-red-500" />
                <div className="flex-1">
                  <span className="block text-xs font-bold uppercase leading-none tracking-widest text-red-500">EMERGENCY 1</span>
                  <span className="mt-1 block text-lg font-bold font-mono text-white">{t('tel1')}</span>
                </div>
              </a>
              
              <a
                href={`tel:${t('tel2')}`}
                className="flex items-center space-x-3 rounded border border-emerald-600/30 bg-emerald-600/10 p-4 transition-all hover:border-emerald-600/50 hover:bg-emerald-600/20"
              >
                <Phone className="h-6 w-6 shrink-0 text-emerald-500" />
                <div className="flex-1">
                  <span className="block text-xs font-bold uppercase leading-none tracking-widest text-emerald-500">EMERGENCY 2</span>
                  <span className="mt-1 block text-lg font-bold font-mono text-white">{t('tel2')}</span>
                </div>
              </a>

              <div className="flex items-center space-x-3 pt-2">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-gray-400">hotline@butwalsnakerescue.org</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-manrope">
          <p>© {currentYear} SnakeSOS. All Rights Reserved. Rupandehi, Nepal.</p>
          <p className="flex items-center gap-1.5">
            {t('designedBy')}
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;