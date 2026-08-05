'use client';

import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  variant?: 'default' | 'minimal' | 'fullscreen';
}

export function LoadingState({ message, variant = 'default' }: LoadingStateProps) {
  if (variant === 'fullscreen') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
            />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {message || 'Loading...'}
          </h2>
        </motion.div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center rounded-2xl border border-border bg-card p-12"
    >
      <div className="flex items-center gap-4 rounded-full border border-primary/20 bg-primary/10 px-6 py-3 backdrop-blur-sm">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="h-5 w-5 text-primary" />
        </motion.div>
        <span className="text-sm font-bold uppercase tracking-wider text-foreground">
          {message || 'Loading...'}
        </span>
      </div>
    </motion.div>
  );
}
