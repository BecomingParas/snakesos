'use client';

import * as React from 'react';
import { cn } from './utils';

interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ReusableTabsProps {
  tabs: Tab[];
  value: string;
  onValueChange: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'dark-pills';
  className?: string;
}

export function ReusableTabs({
  tabs,
  value,
  onValueChange,
  variant = 'default',
  className,
}: ReusableTabsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-2xl p-2',
        variant === 'default' && 'bg-muted',
        variant === 'pills' && 'bg-muted/50',
        variant === 'underline' && 'bg-transparent border-b border-border p-0',
        variant === 'dark-pills' && 'bg-slate-100 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onValueChange(tab.value)}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold uppercase tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            // Default variant (like shadcn tabs)
            variant === 'default' &&
              'rounded-md px-3 py-1.5 ring-offset-background',
            variant === 'default' &&
              value === tab.value &&
              'bg-background text-foreground shadow-sm',
            variant === 'default' &&
              value !== tab.value &&
              'text-muted-foreground hover:bg-muted/50',
            // Pills variant (rounded buttons)
            variant === 'pills' &&
              'rounded-full px-8 py-2.5 mx-2',
            variant === 'pills' &&
              value === tab.value &&
              'bg-primary text-primary-foreground shadow-md',
            variant === 'pills' &&
              value !== tab.value &&
              'text-muted-foreground hover:bg-muted hover:text-foreground',
            // Dark Pills variant (like NCAA Australia)
            variant === 'dark-pills' &&
              'rounded-xl px-4 py-2.5 mx-0.5 text-sm',
            variant === 'dark-pills' &&
              value === tab.value &&
              'bg-slate-900 dark:bg-slate-800 text-white shadow-lg',
            variant === 'dark-pills' &&
              value !== tab.value &&
              'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50',
            // Underline variant
            variant === 'underline' &&
              'relative px-4 py-3 border-b-2 border-transparent',
            variant === 'underline' &&
              value === tab.value &&
              'text-primary border-primary font-semibold',
            variant === 'underline' &&
              value !== tab.value &&
              'text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
          )}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Hook for managing tab state
export function useReusableTabs(defaultValue: string) {
  const [value, setValue] = React.useState(defaultValue);

  return {
    value,
    onValueChange: setValue,
  };
}
