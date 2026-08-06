'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthCard = ({ children, title, subtitle }: AuthCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-3xl p-8 border border-white/10"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        {subtitle && (
          <p className="text-gray-400 text-sm leading-relaxed">{subtitle}</p>
        )}
      </div>

      {/* Content */}
      {children}
    </motion.div>
  );
};
