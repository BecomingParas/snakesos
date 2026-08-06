/**
 * Toast Provider - Notification system
 */
'use client';

import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

export const ToastProvider = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme as 'light' | 'dark' | 'system'}
      position="top-right"
      toastOptions={{
        style: {
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#f3f4f6' : '#111827',
          border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
        },
      }}
      richColors
      closeButton
      expand
    />
  );
};
