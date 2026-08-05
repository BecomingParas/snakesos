// components/ui/custom-tabs.tsx - Custom Reusable Tab Component
'use client';

import { motion } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'minimal';
  className?: string;
}

export function TabsComponent({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  className = '',
}: TabsProps) {
  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap gap-0 justify-end ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`cursor-pointer px-4 sm:px-5 py-2.5 text-xs font-medium uppercase tracking-widest border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`sticky top-16 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex justify-center py-3 sm:py-4">
          <div className="inline-flex h-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 p-1 sm:p-2 shadow-sm overflow-x-auto max-w-full scrollbar-hide gap-1 sm:gap-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`rounded-xl px-4 py-2.5 sm:px-6 md:px-8 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wide sm:tracking-wider whitespace-nowrap transition-all
                    ${
                      isActive
                        ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md scale-105'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`ml-1.5 sm:ml-2 hidden sm:inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold
                        ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                        }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default TabsComponent;
