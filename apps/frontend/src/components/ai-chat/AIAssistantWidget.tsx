/**
 * AI Assistant Widget
 * Collapsible AI chat widget for dashboard pages
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import { AIChat } from './AIChat';
import { cn } from '@/lib/utils';

interface AIAssistantWidgetProps {
  context?: 'rescuer' | 'admin';
  location?: { latitude: number; longitude: number };
}

export function AIAssistantWidget({
  context = 'admin',
  location,
}: AIAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'w-[400px] h-[600px]',
            'shadow-2xl rounded-lg',
            'border bg-background'
          )}
        >
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat interface */}
          <div className="h-[calc(600px-64px)]">
            <AIChat context={context} location={location} />
          </div>
        </div>
      )}
    </>
  );
}
