/**
 * Root Provider - Combines all providers
 */
'use client';

import { ReactNode } from 'react';
import { ApolloClientProvider } from '../apollo/provider';
import { ThemeProvider } from './theme-provider';
import { ToastProvider } from './toast-provider';

export interface RootProviderProps {
  children: ReactNode;
}

export const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <ThemeProvider>
      <ApolloClientProvider>
        {children}
        <ToastProvider />
      </ApolloClientProvider>
    </ThemeProvider>
  );
};
