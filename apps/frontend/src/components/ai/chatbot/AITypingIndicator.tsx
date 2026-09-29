'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function AITypingIndicator() {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center"
      >
        <Sparkles className="w-4 h-4 text-primary-foreground" />
      </motion.div>

      {/* Typing dots */}
      <div className="bg-muted/50 backdrop-blur-sm border border-border rounded-2xl px-5 py-4 flex items-center gap-1.5">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full bg-foreground/60"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
