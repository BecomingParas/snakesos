'use client';

import { Loader } from 'lucide-react';

export function AdminLoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <Loader className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-sm">Loading dashboard...</p>
      </div>
    </div>
  );
}
