/**
 * AI Chat Window
 * Main chat interface with mobile-first design
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AIChatWindowProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function AIChatWindow({ children, onClose }: AIChatWindowProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Safe window access only on client
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
      />

      {/* Chat window */}
      <motion.div
        initial={
          isMobile
            ? { y: '100%', opacity: 0 }
            : { scale: 0.9, opacity: 0, y: 20 }
        }
        animate={
          isMobile
            ? { y: 0, opacity: 1 }
            : { scale: 1, opacity: 1, y: 0 }
        }
        exit={
          isMobile
            ? { y: '100%', opacity: 0 }
            : { scale: 0.9, opacity: 0, y: 20 }
        }
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }}
        className={`
          fixed z-[101]
          ${isMobile ? 'inset-0' : 'bottom-6 right-6 w-[400px] h-[600px]'}
          bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95
          backdrop-blur-xl
          border border-white/10
          shadow-2xl shadow-black/50
          ${isMobile ? 'rounded-none' : 'rounded-2xl'}
          flex flex-col
          overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </>
  );
}
