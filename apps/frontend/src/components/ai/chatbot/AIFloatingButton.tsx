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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className={cn(
            'fixed bottom-5 right-5 z-50',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          aria-label="Open SnakeSOS AI Assistant"
        >
          {/* Main Button - Smaller Size */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md hover:bg-primary/30 transition-colors" />
            
            {/* Button */}
            <div
              className={cn(
                'relative',
                'h-12 w-12 rounded-full',
                'bg-gradient-to-br from-primary to-primary/90',
                'shadow-lg shadow-primary/25',
                'flex items-center justify-center',
                'transition-all duration-300',
                'hover:shadow-xl hover:shadow-primary/40'
              )}
            >
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
              
              {/* Sparkle indicator - smaller */}
              <motion.div
                className="absolute -top-0.5 -right-0.5"
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
                <Sparkles className="h-3 w-3 text-primary fill-primary" />
              </motion.div>

              {/* Unread badge */}
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold flex items-center justify-center shadow-md"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.div>
              )}
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
