'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram';
  url: string;
}

export interface SharedFooterProps {
  brandName?: string;
  tagline?: string;
  description?: string;
  sections?: FooterSection[];
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: SocialLink[];
  copyrightText?: string;
  className?: string;
}

const SOCIAL_ICONS = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
};

export function SharedFooter({
  brandName = 'Butwal Snake Rescuers',
  tagline = '24/7 Wildlife Rescue',
  description = 'Professional snake rescue and wildlife conservation services in Rupandehi District, Nepal.',
  sections = [],
  phone = '9816482570',
  email = 'info@butwalsnake.com',
  address = 'Butwal, Rupandehi District, Nepal',
  socialLinks = [],
  copyrightText = '© 2026 Butwal Snake Rescuers • Calm response. Community care. Conservation.',
  className = '',
}: SharedFooterProps) {
  return (
    <footer className={`border-t border-border bg-card ${className}`}>
      <div className="container max-w-screen-2xl py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">{brandName}</h3>
              <p className="text-sm text-primary font-semibold">{tagline}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-2">
                {socialLinks.map((social) => {
                  const Icon = SOCIAL_ICONS[social.platform];
                  return (
                    <motion.a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{social.platform}</span>
                    </motion.a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Sections */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-3">
              {phone && (
                <li className="flex items-start gap-2 text-sm">
                  <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <a href={`tel:${phone}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-2 text-sm">
                  <Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <a href={`mailto:${email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {email}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span className="text-muted-foreground">{address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}