'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  icon?: LucideIcon;
  badge?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
  variant?: 'default' | 'gradient';
}

export function SectionHeader({
  icon: Icon,
  badge,
  title,
  subtitle,
  action,
  align = 'left',
  variant = 'default',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${
        align === 'center' ? 'md:flex-col md:items-center' : ''
      }`}
    >
      <div className={`flex flex-col gap-3 ${alignClass}`}>
        {(badge || Icon) && (
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-sm">
            {Icon && <Icon className="h-4 w-4 text-primary" />}
            {badge && (
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {badge}
              </span>
            )}
          </div>
        )}
        
        <h2
          className={`text-3xl font-black uppercase leading-tight tracking-tight md:text-4xl lg:text-5xl ${
            variant === 'gradient'
              ? 'bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent'
              : 'text-foreground'
          }`}
        >
          {title}
        </h2>
        
        {subtitle && (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
