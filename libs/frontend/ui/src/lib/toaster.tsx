'use client';

import { Toaster } from 'sonner';

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      expand={false}
      visibleToasts={3}
      toastOptions={{
        duration: 3000,
        classNames: {
          toast: 'relative overflow-hidden rounded-md border bg-background/95 p-4 shadow-lg',
          success: 'sonner-toast-success',
          error: 'sonner-toast-error',
          info: 'sonner-toast-info',
        },
      }}
    />
  );
}
