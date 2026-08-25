import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

export function AdminEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
      {children}
    </p>
  );
}

export function AdminPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`border-border bg-card/80 backdrop-blur-xl shadow-sm ${className}`}
    >
      {children}
    </Card>
  );
}
