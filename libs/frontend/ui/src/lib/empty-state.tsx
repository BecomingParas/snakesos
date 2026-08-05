'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  variant?: 'default' | 'minimal';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center rounded-2xl border p-12 text-center ${
        variant === 'minimal'
          ? 'border-dashed border-border/50 bg-transparent'
          : 'border-border bg-card/50 shadow-lg'
      }`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mb-6 inline-flex items-center justify-center rounded-2xl bg-muted p-6 ring-1 ring-border/50"
      >
        <Icon className="h-12 w-12 text-muted-foreground" />
      </motion.div>

      <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">{description}</p>

      {action && <div>{action}</div>}
    </motion.div>
  );
}
