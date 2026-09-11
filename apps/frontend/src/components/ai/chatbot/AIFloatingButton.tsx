/**
 * AI Floating Assistant Button
 * Entry point for the SnakeSOS AI Assistant
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
  unreadCount?: number;
}

export function AIFloatingButton({
  onClick,
  isOpen,
  unreadCount = 0,
}: AIFloatingButtonProps) {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'group',
            'flex flex-col items-center gap-2',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          aria-label="Open SnakeSOS AI Assistant"
        >
          {/* Main Button */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors" />
            
            {/* Button */}
            <div
              className={cn(
                'relative',
                'h-14 w-14 rounded-full',
                'bg-gradient-to-br from-primary to-primary/90',
                'shadow-lg shadow-primary/25',
                'flex items-center justify-center',
                'transition-all duration-300',
                'group-hover:shadow-xl group-hover:shadow-primary/40'
              )}
            >
              <MessageCircle className="h-6 w-6 text-primary-foreground" />
              
              {/* Sparkle indicator */}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles className="h-3.5 w-3.5 text-primary fill-primary" />
              </motion.div>

              {/* Unread badge */}
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold flex items-center justify-center shadow-md"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.div>
              )}
            </div>
          </div>

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'px-3 py-1.5',
              'bg-background/95 backdrop-blur-sm',
              'border border-border/50',
              'rounded-full shadow-lg',
              'text-xs font-medium text-foreground',
              'whitespace-nowrap',
              'opacity-0 group-hover:opacity-100',
              'transition-opacity duration-200'
            )}
          >
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              SnakeSOS AI Assistant
            </span>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
