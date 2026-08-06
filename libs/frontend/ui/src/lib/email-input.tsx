'use client';

import * as React from 'react';
import { Mail } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';
import { cn } from './utils';

export interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className="text-gray-300">
            {label}
          </Label>
        )}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            ref={ref}
            type="email"
            className={cn(
              'pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500',
              error && 'border-red-500/50 focus-visible:ring-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

EmailInput.displayName = 'EmailInput';
