'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'premium' | 'minimal';
  delay?: number;
}

function AnimatedCounter({ value, duration = 0.8 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.max(1, Math.round(duration * 60));
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      setCount(Math.round(value * progress));
      if (progress === 1) window.clearInterval(timer);
    }, 1000 / 60);

    return () => window.clearInterval(timer);
  }, [duration, value]);

  return <span>{count}</span>;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  variant = 'default',
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        variant === 'premium'
          ? 'border-primary/20 bg-gradient-to-br from-card via-card to-card/50 shadow-2xl shadow-primary/5'
          : variant === 'minimal'
          ? 'border-border/50 bg-card/50 backdrop-blur-sm'
          : 'border-border bg-card shadow-lg'
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:scale-150" />

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
              <Icon className="h-5 w-5 text-primary" />
            </div>

            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {label}
            </h3>

            <div className="mb-2 text-4xl font-black text-foreground">
              {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
            </div>

            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {trend && (
            <div
              className={`ml-2 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
                trend.isPositive
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '75%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + 0.2 }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
          />
        </div>
      </div>
    </motion.div>
  );
}
