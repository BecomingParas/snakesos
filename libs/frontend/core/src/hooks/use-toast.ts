/**
 * Toast Hook - Wrapper around sonner toast
 */
import { toast as sonnerToast } from 'sonner';

export const useToast = () => {
  return {
    toast: (message: string, options?: { description?: string }) => {
      return sonnerToast(message, options);
    },
    success: (message: string, options?: { description?: string }) => {
      return sonnerToast.success(message, options);
    },
    error: (message: string, options?: { description?: string }) => {
      return sonnerToast.error(message, options);
    },
    warning: (message: string, options?: { description?: string }) => {
      return sonnerToast.warning(message, options);
    },
    info: (message: string, options?: { description?: string }) => {
      return sonnerToast.info(message, options);
    },
    loading: (message: string, options?: { description?: string }) => {
      return sonnerToast.loading(message, options);
    },
    promise: <T,>(
      promise: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: Error) => string);
      }
    ) => {
      return sonnerToast.promise(promise, options);
    },
    dismiss: (id?: string | number) => {
      sonnerToast.dismiss(id);
    },
  };
};
