'use client';

import * as React from 'react';
import { Button } from './button';
import { cn } from './utils';

export interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  provider: string;
  isLoading?: boolean;
}

export function SocialButton({
  icon,
  provider,
  isLoading,
  className,
  children,
  ...props
}: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      className={cn(
        'w-full border-white/20 text-white hover:bg-white/5 py-6 rounded-xl transition-all duration-200',
        'hover:border-white/30',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {icon}
          {children || `Continue with ${provider}`}
        </>
      )}
    </Button>
  );
}
