'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export interface SuccessAnimationProps {
  title?: string;
  message?: string;
}

export function SuccessAnimation({
  title = 'Success!',
  message,
}: SuccessAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.1,
        }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl" />
        <div className="relative w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-white mb-2"
      >
        {title}
      </motion.h2>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 max-w-md"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}
