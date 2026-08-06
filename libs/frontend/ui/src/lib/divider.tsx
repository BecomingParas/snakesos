'use client';

import { cn } from './utils';

export interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text = 'or', className }: DividerProps) {
  return (
    <div className={cn('relative my-6', className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-[#0a1512] text-gray-500 uppercase tracking-wider text-xs font-semibold">
          {text}
        </span>
      </div>
    </div>
  );
}
