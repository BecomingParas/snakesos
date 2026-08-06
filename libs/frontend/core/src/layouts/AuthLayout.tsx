/**
 * AuthLayout - Layout for authentication pages (login, register)
 */
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export const AuthLayout = ({ children, title, description }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Snake className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold">Snake Rescue</span>
            </Link>
            {title && (
              <h2 className="mt-8 text-3xl font-bold tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Right side - Image/Illustration */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md space-y-6 text-center">
            <Snake className="h-24 w-24 text-primary mx-auto" />
            <h3 className="text-2xl font-bold">Saving Snakes, Protecting People</h3>
            <p className="text-muted-foreground">
              Join our community of volunteers and wildlife experts dedicated to snake rescue
              and conservation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
