'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badges?: Array<{ label: string; icon?: ReactNode; variant?: 'default' | 'success' | 'warning' }>;
  image?: string;
  logo?: string;
  actions?: ReactNode;
  stats?: Array<{ label: string; value: string | number }>;
  variant?: 'default' | 'split' | 'centered';
}

export function HeroBanner({
  title,
  subtitle,
  badge,
  badges,
  image,
  logo,
  actions,
  stats,
  variant = 'default',
}: HeroBannerProps) {
  const isSplit = variant === 'split';
  const isCentered = variant === 'centered';

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card to-card/80 shadow-2xl"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary-rgb),0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(var(--primary-rgb),0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-grid-white/5" />

      {/* Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
      />

      {/* Content */}
      <div
        className={`relative grid gap-8 p-8 md:p-12 lg:p-16 ${
          isSplit ? 'lg:grid-cols-[1.2fr_0.8fr]' : isCentered ? 'place-items-center text-center' : ''
        }`}
      >
        {/* Text Content */}
        <div className={`flex flex-col ${isCentered ? 'items-center' : 'justify-center'}`}>
          {/* Badges */}
          {(badge || badges) && (
            <div className="mb-6 flex flex-wrap gap-3">
              {badge && (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-sm">
                  {badge}
                </span>
              )}
              {badges?.map((b, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${
                    b.variant === 'success'
                      ? 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                      : b.variant === 'warning'
                      ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                      : 'border-border/50 bg-muted/50 text-muted-foreground'
                  }`}
                >
                  {b.icon}
                  {b.label}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight text-foreground md:text-5xl lg:text-7xl"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Actions */}
          {actions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              {actions}
            </motion.div>
          )}

          {/* Stats */}
          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/50 bg-card/50 p-4 text-center backdrop-blur-sm"
                >
                  <div className="text-2xl font-black text-foreground md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Image/Logo Section */}
        {(image || logo) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {logo && (
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative flex h-64 w-64 items-center justify-center rounded-full border border-primary/20 bg-gradient-to-br from-card to-card/50 p-8 shadow-2xl shadow-primary/10 backdrop-blur-sm md:h-80 md:w-80"
              >
                <img src={logo} alt="Logo" className="h-full w-full object-contain" />
                
                {/* Rotating Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
                />
              </motion.div>
            )}

            {image && !logo && (
              <div
                className="h-96 w-full rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              />
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
